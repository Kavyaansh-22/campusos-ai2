"""
Verifies the tool-dispatch loop in AnthropicProvider.answer() without
making a real network call — useful in this dev environment where no
live AI_API_KEY is configured, and useful going forward as a regression
test once a real key is present.

Run with: venv/bin/python -m backend.tests.test_ai_service_mock
"""
from types import SimpleNamespace
from unittest.mock import MagicMock

from backend.database import SessionLocal
from backend.services.ai_service import AnthropicProvider


def _text_block(text):
    return SimpleNamespace(type="text", text=text)


def _tool_use_block(name, input_, id_="tool_1"):
    return SimpleNamespace(type="tool_use", name=name, input=input_, id=id_)


def test_tool_dispatch_then_final_answer():
    provider = AnthropicProvider.__new__(AnthropicProvider)  # skip __init__ (no real client)
    provider._model = "claude-sonnet-4-6"

    # First call: model asks to use search_labs("electronics")
    first_response = SimpleNamespace(
        stop_reason="tool_use",
        content=[_tool_use_block("search_labs", {"query": "electronics"})],
    )
    # Second call: model has the tool result and gives a final answer
    second_response = SimpleNamespace(
        stop_reason="end_turn",
        content=[_text_block("The Electronics Laboratory is in Academic Block A, room 204.")],
    )

    mock_client = MagicMock()
    mock_client.messages.create.side_effect = [first_response, second_response]
    provider._client = mock_client

    db = SessionLocal()
    try:
        result = provider.answer(db, "Where is the electronics lab?", [])
    finally:
        db.close()

    assert "Electronics Laboratory" in result["answer"], result
    assert len(result["sources"]) >= 1, result
    assert result["sources"][0]["type"] == "lab"
    assert mock_client.messages.create.call_count == 2
    print("OK:", result)


def test_no_results_does_not_hallucinate():
    provider = AnthropicProvider.__new__(AnthropicProvider)
    provider._model = "claude-sonnet-4-6"

    first_response = SimpleNamespace(
        stop_reason="tool_use",
        content=[_tool_use_block("search_offices", {"query": "dean"})],
    )
    second_response = SimpleNamespace(
        stop_reason="end_turn",
        content=[_text_block(
            "I couldn't find verified information about that in the CampusOS database."
        )],
    )

    mock_client = MagicMock()
    mock_client.messages.create.side_effect = [first_response, second_response]
    provider._client = mock_client

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
    print("All mock AI-service tests passed.")
