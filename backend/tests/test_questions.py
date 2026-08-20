"""
CampusOS AI Assistant — manual/automated test question set.

This does two things:

1. Runs every question straight through the retrieval layer (no AI call
   needed) so you can confirm the underlying search logic finds the right
   rows before you ever spend an AI API call on it.

2. Prints the same questions in a human-readable list you can paste into
   the chat UI (or curl against /api/chat) once AI_API_KEY is set, to
   check the LLM's phrasing, relationship reasoning, and honesty on
   failure cases.

Run with: venv/bin/python -m backend.tests.test_questions
"""
from backend.database import SessionLocal
from backend.services.retrieval_service import SEARCH_FUNCTIONS

# (category, question, retrieval_function_name, term_to_search)
# term_to_search is what a well-behaved AI should translate the question
# into — it's what we use to sanity-check the DB layer here, independent
# of whether the LLM makes the exact same choice.
QUESTIONS = [
    # --- Buildings ---
    ("buildings", "Where is Academic Block A?", "search_buildings", "Academic Block A"),
    ("buildings", "Tell me about Academic Block B.", "search_buildings", "Academic Block B"),
    ("buildings", "How many floors does the library building have?", "search_buildings", "Library"),

    # --- Departments ---
    ("departments", "What departments are in the School of Engineering?", "search_departments", "Engineering"),
    ("departments", "Tell me about Electronics Engineering.", "search_departments", "Electronics"),
    ("departments", "What does the AI and Machine Learning department focus on?", "search_departments", "Artificial Intelligence"),

    # --- Faculty ---
    ("faculty", "Who teaches Machine Learning?", "search_faculty", "Machine Learning"),
    ("faculty", "Which department does Dr. Karan Shah belong to?", "search_faculty", "Karan Shah"),
    ("faculty", "What is Dr. Riya Sharma's email?", "search_faculty", "Riya Sharma"),
    ("faculty", "Who teaches Embedded Systems?", "search_faculty", "Embedded Systems"),

    # --- Labs (incl. phrasing variations from the brief) ---
    ("labs", "Where is the Electronics Laboratory?", "search_labs", "Electronics Laboratory"),
    ("labs", "Where can I find the electronics laboratory?", "search_labs", "electronics laboratory"),
    ("labs", "What's the location of the electronics lab?", "search_labs", "electronics lab"),
    ("labs", "Electronics lab location?", "search_labs", "electronics lab"),
    ("labs", "electronics lab", "search_labs", "electronics lab"),
    ("labs", "Electronics LAB", "search_labs", "Electronics LAB"),
    ("labs", "I need the electronics lab location", "search_labs", "electronics lab"),
    ("labs", "What equipment does the Artificial Intelligence Laboratory have?", "search_labs", "Artificial Intelligence Laboratory"),
    ("labs", "Which building is the AI laboratory in?", "search_labs", "Artificial Intelligence"),
    ("labs", "What labs are in Academic Block B?", "search_labs", "Academic Block B"),
    ("labs", "Tell me about the Computer Networks Laboratory.", "search_labs", "Computer Networks Laboratory"),

    # --- Facilities ---
    ("facilities", "Where is the Central Library?", "search_facilities", "Central Library"),
    ("facilities", "What are the library timings?", "search_facilities", "library"),
    ("facilities", "What facilities are in Academic Block A?", "search_facilities", "Academic Block A"),

    # --- Offices ---
    ("offices", "Where is the Admissions Office?", "search_offices", "Admissions Office"),
    ("offices", "What does the Examination Office handle?", "search_offices", "Examination Office"),
    ("offices", "How do I contact the Student Affairs Office?", "search_offices", "Student Affairs Office"),
]

# Questions the dummy database genuinely cannot answer. The AI must say
# so honestly instead of inventing an answer.
FAILURE_CASES = [
    "Who is the Dean?",
    "Where is the swimming pool?",
    "What is today's cafeteria menu?",
    "When is the next MIT-WPU hackathon?",
    "What is the hostel curfew time?",
]


def run_retrieval_checks():
    db = SessionLocal()
    passed, failed = 0, 0
    try:
        for category, question, fn_name, term in QUESTIONS:
            fn = SEARCH_FUNCTIONS[fn_name]
            results = fn(db, term)
            status = "PASS" if results else "FAIL (no rows found)"
            if results:
                passed += 1
            else:
                failed += 1
            print(f"[{category:11s}] {status:22s} | Q: {question}")
            if not results:
                print(f"             -> tried {fn_name}('{term}') and found nothing; "
                      f"check dummy data or search term")
    finally:
        db.close()

    print(f"\nRetrieval layer: {passed}/{len(QUESTIONS)} questions resolved to at least one row.")
    print(f"({len(FAILURE_CASES)} additional honest-failure cases below — these SHOULD return nothing.)")
    print()
    print("Honest-failure cases (paste into the chat UI once AI_API_KEY is set —")
    print("the assistant must say it can't find the info, never invent an answer):")
    for q in FAILURE_CASES:
        print(f"  - {q}")


if __name__ == "__main__":
    run_retrieval_checks()
