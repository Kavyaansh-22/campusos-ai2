"""
Verifies GeminiProvider's tool-dispatch loop with a mocked genai client -
same purpose as test_ai_service_mock.py but for the Gemini path, so it
works without a real AI_API_KEY configured. Built against the current
`google-genai` SDK (not the deprecated `google-generativeai` package).

Run with: venv/bin/python -m backend.tests.test_gemini_provider_mock
"""
from types import SimpleNamespace
from unittest.mock import MagicMock

from backend.database import SessionLocal
from backend.services.ai_service import GeminiProvider


def _response(text=None, function_calls=None):
    return SimpleNamespace(text=text, function_calls=function_calls or [])


def _fc(name, args):
    return SimpleNamespace(name=name, args=args)


def test_tool_dispatch_then_final_answer():
    provider = GeminiProvider.__new__(GeminiProvider)  # skip __init__ (no real client/key)

    first_response = _response(function_calls=[_fc("search_labs", {"query": "electronics"})])
    second_response = _response(text="The Electronics Laboratory is in Academic Block A, room 204.")

    mock_chat = MagicMock()
    mock_chat.send_message.side_effect = [first_response, second_response]

    provider._client = MagicMock()
    provider._client.chats.create.return_value = mock_chat
    provider._model_name = "gemini-2.5-flash"
    provider._config = MagicMock()

    db = SessionLocal()
    try:
        result = provider.answer(db, "Where is the electronics lab?", [])
    finally:
        db.close()

    assert "Electronics Laboratory" in result["answer"], result
    assert len(result["sources"]) >= 1, result
    assert result["sources"][0]["type"] == "lab"
    assert mock_chat.send_message.call_count == 2
    print("OK:", result)


def test_no_results_does_not_hallucinate():
    provider = GeminiProvider.__new__(GeminiProvider)

    first_response = _response(function_calls=[_fc("search_offices", {"query": "dean"})])
    second_response = _response(
        text="I couldn't find verified information about that in the CampusOS database."
    )

    mock_chat = MagicMock()
    mock_chat.send_message.side_effect = [first_response, second_response]

    provider._client = MagicMock()
    provider._client.chats.create.return_value = mock_chat
    provider._model_name = "gemini-2.5-flash"
    provider._config = MagicMock()

    db = SessionLocal()
    try:
        result = provider.answer(db, "Who is the Dean?", [])
    finally:
        db.close()

    assert "couldn't find" in result["answer"].lower(), result
    assert result["sources"] == []
    print("OK:", result)


if __name__ == "__main__":
    test_tool_dispatch_then_final_answer()
    test_no_results_does_not_hallucinate()
    print("All mock Gemini provider tests passed.")
