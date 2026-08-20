"""
AI service abstraction.

The rest of the app talks to `ai_service.answer()` and never touches a
specific LLM SDK directly. Swapping providers means writing a new
*Provider class and changing AI_PROVIDER in .env — nothing else changes.

Design:
  - The LLM is given a small, fixed set of "tools" that map 1:1 onto the
    controlled retrieval functions in retrieval_service.py.
  - The LLM decides which tool(s) to call and with what search term(s).
  - The BACKEND executes the actual (parameterized, safe) database query.
  - The LLM only ever sees the structured JSON results we return to it —
    it never sees or writes SQL.
  - The system prompt instructs the model to answer ONLY from retrieved
    data and to say so plainly when nothing relevant was found.
"""
from __future__ import annotations

import json
import logging
from typing import Any, Protocol

from sqlalchemy.orm import Session

from backend.config import settings
from backend.services.retrieval_service import SEARCH_FUNCTIONS

logger = logging.getLogger(__name__)

SYSTEM_PROMPT = """You are the CampusOS AI Assistant for MIT World Peace University (MIT-WPU), Pune.

You help students with natural-language questions about campus buildings, \
departments, faculty, labs, facilities, and offices.

Rules you must always follow:
1. You do NOT know anything about the campus from memory. The ONLY source \
of truth is the search tools available to you (search_buildings, \
search_departments, search_faculty, search_labs, search_facilities, \
search_offices). Always call the relevant tool(s) before answering a \
campus-related question.
2. Never invent faculty names, room numbers, timings, contact info, or any \
other campus detail. If the tools return no relevant results, say plainly \
that you couldn't find that information in the CampusOS database. Do not \
guess.
3. When the user's wording doesn't literally match campus terms (e.g. an \
acronym like "AI" or "ML"), translate it into a better search term \
yourself before calling a tool (e.g. search for "machine learning" or \
"artificial intelligence" rather than the literal acronym).
4. Use relationships when relevant: faculty belong to departments; labs, \
facilities, and offices belong to buildings. You can call multiple tools \
or call a tool more than once if the first search doesn't have what you need.
5. Keep answers concise, natural, and student-friendly — one or two \
sentences is usually enough. Do not pad answers with phrases like "Based \
on the information retrieved...".
6. Use the conversation history to resolve pronouns like "it" or "there" \
to the entity discussed most recently.
"""

TOOL_DEFINITIONS = [
    {
        "name": "search_buildings",
        "description": "Search campus buildings by name or description.",
        "input_schema": {
            "type": "object",
            "properties": {"query": {"type": "string", "description": "Search term, e.g. building name"}},
            "required": ["query"],
        },
    },
    {
        "name": "search_departments",
        "description": "Search academic departments by name, school, or description.",
        "input_schema": {
            "type": "object",
            "properties": {"query": {"type": "string"}},
            "required": ["query"],
        },
    },
    {
        "name": "search_faculty",
        "description": "Search faculty members by name, designation, subjects taught, or department name.",
        "input_schema": {
            "type": "object",
            "properties": {"query": {"type": "string"}},
            "required": ["query"],
        },
    },
    {
        "name": "search_labs",
        "description": "Search labs by name, equipment, department name, or building name.",
        "input_schema": {
            "type": "object",
            "properties": {"query": {"type": "string"}},
            "required": ["query"],
        },
    },
    {
        "name": "search_facilities",
        "description": "Search campus facilities (library, cafeteria, sports complex, etc.) by name, description, or building name.",
        "input_schema": {
            "type": "object",
            "properties": {"query": {"type": "string"}},
            "required": ["query"],
        },
    },
    {
        "name": "search_offices",
        "description": "Search administrative offices (admissions, exams, accounts, etc.) by name, what they handle, or building name.",
        "input_schema": {
            "type": "object",
            "properties": {"query": {"type": "string"}},
            "required": ["query"],
        },
    },
]


# Same six tools, expressed in the shape the `google-genai` SDK expects.
# Kept separate from TOOL_DEFINITIONS above so each provider owns its own
# wire format.
def _gemini_tools():
    from google.genai import types

    def _decl(name: str, description: str):
        return types.FunctionDeclaration(
            name=name,
            description=description,
            parameters=types.Schema(
                type="OBJECT",
                properties={
                    "query": types.Schema(type="STRING", description="Search term")
                },
                required=["query"],
            ),
        )

    return [
        types.Tool(
            function_declarations=[
                _decl("search_buildings", "Search campus buildings by name or description."),
                _decl("search_departments", "Search academic departments by name, school, or description."),
                _decl("search_faculty", "Search faculty members by name, designation, subjects taught, or department name."),
                _decl("search_labs", "Search labs by name, equipment, department name, or building name."),
                _decl("search_facilities", "Search campus facilities (library, cafeteria, sports complex, etc.) by name, description, or building name."),
                _decl("search_offices", "Search administrative offices (admissions, exams, accounts, etc.) by name, what they handle, or building name."),
            ]
        )
    ]


class AIProvider(Protocol):
    def answer(
        self, db: Session, message: str, history: list[dict[str, str]]
    ) -> dict[str, Any]:
        ...


class AnthropicProvider:
    """Default provider. Uses Claude's tool-use to call the controlled
    retrieval functions, then asks Claude to write the final answer from
    the returned structured data only."""

    def __init__(self):
        import anthropic  # imported lazily so the app can start even if
                           # the package/key isn't configured yet in dev
        self._client = anthropic.Anthropic(api_key=settings.AI_API_KEY)
        self._model = settings.AI_MODEL

    def answer(
        self, db: Session, message: str, history: list[dict[str, str]]
    ) -> dict[str, Any]:
        messages = list(history) + [{"role": "user", "content": message}]
        sources: list[dict[str, Any]] = []
        max_tool_rounds = 4

        for _ in range(max_tool_rounds):
            response = self._client.messages.create(
                model=self._model,
                max_tokens=500,
                system=SYSTEM_PROMPT,
                tools=TOOL_DEFINITIONS,
                messages=messages,
            )

            if response.stop_reason != "tool_use":
                final_text = "".join(
                    block.text for block in response.content if block.type == "text"
                ).strip()
                return {"answer": final_text, "sources": sources}

            # Model wants to call one or more tools. Execute each via the
            # controlled retrieval layer, never via raw SQL.
            messages.append({"role": "assistant", "content": response.content})
            tool_results = []
            for block in response.content:
                if block.type != "tool_use":
                    continue
                fn = SEARCH_FUNCTIONS.get(block.name)
                query_term = (block.input or {}).get("query", "")
                if fn is None:
                    result_payload: Any = {"error": f"Unknown tool {block.name}"}
                else:
                    result_payload = fn(db, query_term)
                    sources.extend(
                        {"type": r["type"], "id": r["id"], "name": r["name"]}
                        for r in result_payload
                    )
                tool_results.append(
                    {
                        "type": "tool_result",
                        "tool_use_id": block.id,
                        "content": json.dumps(result_payload),
                    }
                )
            messages.append({"role": "user", "content": tool_results})

        # Safety net: if the model keeps calling tools past the round
        # limit, don't hallucinate — say we couldn't resolve it cleanly.
        return {
            "answer": "I couldn't find verified information about that in the CampusOS database.",
            "sources": sources,
        }


class GeminiProvider:
    """Uses Gemini's function calling to call the controlled retrieval
    functions, same contract as AnthropicProvider: the model never sees
    or writes SQL, only the structured JSON we hand back to it.

    Built on the current `google-genai` SDK (the old `google-generativeai`
    package is end-of-life and no longer receives updates)."""

    def __init__(self):
        from google import genai  # lazy import, same reasoning as AnthropicProvider
        from google.genai import types

        self._client = genai.Client(api_key=settings.AI_API_KEY)
        self._model_name = settings.AI_MODEL
        self._config = types.GenerateContentConfig(
            system_instruction=SYSTEM_PROMPT,
            tools=_gemini_tools(),
        )

    @staticmethod
    def _to_gemini_history(history: list[dict[str, str]]) -> list[dict[str, Any]]:
        # Our internal history uses {"role": "user"|"assistant", ...};
        # Gemini expects {"role": "user"|"model", "parts": [...]}.
        converted = []
        for turn in history:
            role = "model" if turn.get("role") == "assistant" else "user"
            converted.append({"role": role, "parts": [{"text": turn.get("content", "")}]})
        return converted

    def answer(
        self, db: Session, message: str, history: list[dict[str, str]]
    ) -> dict[str, Any]:
        from google.genai import types

        chat = self._client.chats.create(
            model=self._model_name,
            config=self._config,
            history=self._to_gemini_history(history),
        )
        sources: list[dict[str, Any]] = []
        max_tool_rounds = 4

        response = chat.send_message(message)

        for _ in range(max_tool_rounds):
            function_calls = response.function_calls

            if not function_calls:
                return {"answer": (response.text or "").strip(), "sources": sources}

            # Model wants to call one or more tools. Execute each via the
            # controlled retrieval layer, never via raw SQL.
            function_response_parts = []
            for fc in function_calls:
                fn = SEARCH_FUNCTIONS.get(fc.name)
                query_term = (fc.args or {}).get("query", "")
                if fn is None:
                    result_payload: Any = {"error": f"Unknown tool {fc.name}"}
                else:
                    result_payload = fn(db, query_term)
                    sources.extend(
                        {"type": r["type"], "id": r["id"], "name": r["name"]}
                        for r in result_payload
                    )
                function_response_parts.append(
                    types.Part.from_function_response(
                        name=fc.name,
                        response={"result": json.dumps(result_payload)},
                    )
                )
            response = chat.send_message(function_response_parts)

        # Safety net: if the model keeps calling tools past the round
        # limit, don't hallucinate — say we couldn't resolve it cleanly.
        return {
            "answer": "I couldn't find verified information about that in the CampusOS database.",
            "sources": sources,
        }


def _build_provider() -> AIProvider:
    provider = settings.AI_PROVIDER.strip().lower()
    if provider == "anthropic":
        return AnthropicProvider()
    if provider == "gemini":
        return GeminiProvider()
    raise ValueError(f"Unsupported AI_PROVIDER: {settings.AI_PROVIDER}")


class AIService:
    """Public entrypoint used by the chat route. Lazily builds the
    configured provider on first use so the app can still start up
    (e.g. for /health) without an AI key present."""

    def __init__(self):
        self._provider: AIProvider | None = None

    def _get_provider(self) -> AIProvider:
        if self._provider is None:
            self._provider = _build_provider()
        return self._provider

    def answer(
        self, db: Session, message: str, history: list[dict[str, str]]
    ) -> dict[str, Any]:
        return self._get_provider().answer(db, message, history)


ai_service = AIService()
