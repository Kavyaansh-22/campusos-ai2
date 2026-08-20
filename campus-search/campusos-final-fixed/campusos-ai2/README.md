# CampusOS AI Assistant

Standalone AI chat assistant for MIT World Peace University's CampusOS project.
This is **only the AI Assistant module** — backend + a minimal test chat window.
It does not include the CampusOS landing page, search UI, auth, or any other
CampusOS feature. Those live in your partner's MVP; this module is built to
plug into it later via a stable `POST /api/chat` contract.

## Architecture

```
Browser (frontend/index.html)
        |
        v
FastAPI backend (backend/main.py)
        |
        v
AI service (backend/services/ai_service.py)
   - Claude decides which controlled search tool to call
        |
        v
Retrieval service (backend/services/retrieval_service.py)
   - safe, parameterized MySQL queries — no raw SQL from the LLM, ever
        |
        v
MySQL "campusos" database (your existing schema, unchanged)
```

The LLM is never given raw database access. It can only request one of six
fixed searches (`search_buildings`, `search_departments`, `search_faculty`,
`search_labs`, `search_facilities`, `search_offices`); the backend runs the
actual parameterized query and hands back structured JSON. The LLM then
writes the final answer strictly from that JSON — it's instructed to say
plainly when nothing relevant was found rather than invent an answer.

## Project structure

```
campusos-ai/
├── backend/
│   ├── main.py                  FastAPI app, /health, /debug/buildings
│   ├── database.py              SQLAlchemy engine/session (only file touching MySQL)
│   ├── config.py                Loads all settings from environment/.env
│   ├── models/                  ORM models mirroring your existing 6 tables
│   ├── services/
│   │   ├── retrieval_service.py Controlled search functions (parameterized SQL)
│   │   ├── ai_service.py        Provider-agnostic AI abstraction (Anthropic by default)
│   │   └── chat_service.py      Simple in-memory conversation context
│   ├── routes/
│   │   └── chat.py              POST /api/chat
│   └── tests/
│       ├── test_ai_service_mock.py   Tests the tool-dispatch loop with a mocked client
│       └── test_questions.py         27-question retrieval test set
├── frontend/
│   └── index.html                Standalone test chat window (no build step)
├── dummy_data/
│   ├── schema.sql                 Dummy schema used for development (matches your real one)
│   └── seed.sql                   Sample rows across all 6 tables
├── .env                            NOT committed — see setup below
├── .gitignore
├── requirements.txt
└── README.md
```

## Setup

### 1. Python environment

```bash
cd campusos-ai
python3 -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate
pip install -r requirements.txt
```

### 2. Point it at your real MySQL Workbench database

Edit `.env` (already gitignored) with your real credentials:

```env
DB_HOST=localhost
DB_PORT=3306
DB_NAME=campusos
DB_USER=your_mysql_user
DB_PASSWORD=your_mysql_password

# AI_PROVIDER: "gemini" or "anthropic"
AI_PROVIDER=gemini
AI_API_KEY=your_gemini_api_key
AI_MODEL=gemini-2.5-flash
```

Get a Gemini API key from [Google AI Studio](https://aistudio.google.com/apikey).

To use Claude/Anthropic instead, set `AI_PROVIDER=anthropic`, `AI_MODEL=claude-sonnet-4-6` (or another Claude model), and `AI_API_KEY` to a key from console.anthropic.com.

This module does **not** create or modify your schema — it assumes the
`buildings`, `departments`, `faculty`, `labs`, `facilities`, `offices` tables
already exist, exactly as described in your brief.

> Note: `dummy_data/schema.sql` and `dummy_data/seed.sql` are included so you
> (or anyone else) can spin up a throwaway dev database that matches this
> module's assumptions. They were used to build and test everything below —
> they don't touch your real database and you can ignore them entirely if
> your MySQL Workbench database is already set up.

### 3. Run the backend

```bash
uvicorn backend.main:app --reload --port 8000
```

Check it's alive:

```bash
curl http://127.0.0.1:8000/health
# {"status":"ok","database":"campusos"}
```

### 4. Open the test chat window

Just open `frontend/index.html` directly in a browser (double-click it, or
`open frontend/index.html` on macOS). It talks to `http://127.0.0.1:8000` by
default — change `API_BASE` at the top of the `<script>` block if your
backend runs elsewhere.

## API contract (stable — safe for your partner to integrate against)

```
POST /api/chat
Content-Type: application/json

{ "message": "Where is the electronics lab?" }
```

```json
{
  "answer": "The Electronics Laboratory is in Academic Block A, 2nd floor, Room 204.",
  "sources": [
    { "type": "lab", "id": 1, "name": "Electronics Laboratory" }
  ]
}
```

Optional `session_id` field keeps short conversational context (e.g. resolving
"it" in a follow-up question) — omit it and every request is a fresh
conversation.

## Testing

**Retrieval layer (no AI key needed):**

```bash
python -m backend.tests.test_questions
```

Runs 27 questions across all six categories, including phrasing variations
("electronics lab" / "Electronics LAB" / "I need the electronics lab
location") straight through the search functions, so you can confirm the
database layer works before spending any AI API calls on it.

**AI tool-dispatch logic (mocked, no AI key needed):**

```bash
python -m backend.tests.test_ai_service_mock          # Anthropic path
python -m backend.tests.test_gemini_provider_mock      # Gemini path
```

**Full end-to-end (needs a real `AI_API_KEY` in `.env`):**

Start the backend, open `frontend/index.html`, and try the questions in
`backend/tests/test_questions.py` plus the "honest failure" cases it prints
at the end (e.g. "Who is the Dean?", "Where is the swimming pool?") — the
assistant should clearly say it can't find that information rather than
guessing.

## Swapping the AI provider

Two providers are already implemented in `backend/services/ai_service.py`:
`GeminiProvider` (default) and `AnthropicProvider`. Switch between them
purely via `.env` — set `AI_PROVIDER` to `gemini` or `anthropic`, matching
`AI_API_KEY` and `AI_MODEL`. Nothing else in the app needs to change.

To add a third provider later, write a new class implementing the same
`answer(db, message, history) -> {"answer": ..., "sources": [...]}`
contract, register it in `_build_provider()`, and point `AI_PROVIDER` at it.

Note: `GeminiProvider` is built on the current `google-genai` SDK, not the
older `google-generativeai` package — that one is end-of-life and no
longer receiving updates as of this writing.

## What's intentionally NOT here

Per the project scope, this module does not include: the CampusOS landing
page, campus search UI, student dashboard, authentication, events, clubs,
hostel/attendance/payments systems, a vector database, or any long-term
memory system. See the original project brief for the full list.
