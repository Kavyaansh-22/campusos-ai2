"""
Controlled retrieval functions.

This is the ONLY place that turns a search term into a MySQL query. The
AI service (ai_service.py) can ask for one of these searches by name, but
it can never send raw SQL. Every query here is parameterized through
SQLAlchemy - no string-built SQL, ever.

Search is case-insensitive and does simple partial (substring) matching
across the fields a student would plausibly search by, plus a few
relationship-aware joins (e.g. finding labs by department name).

Column names here match the real CampusOS MySQL schema (created in
MySQL Workbench) - not a guessed/dummy schema.
"""
from typing import Any
from sqlalchemy import or_
from sqlalchemy.orm import Session

from backend.models import Building, Department, Faculty, Lab, Facility, Office


def _like(term: str) -> str:
    return f"%{term.strip()}%"


def search_buildings(db: Session, query: str, limit: int = 5) -> list[dict[str, Any]]:
    like = _like(query)
    rows = (
        db.query(Building)
        .filter(
            or_(
                Building.name.ilike(like),
                Building.description.ilike(like),
                Building.location.ilike(like),
                Building.address.ilike(like),
            )
        )
        .limit(limit)
        .all()
    )
    return [
        {
            "type": "building",
            "id": b.id,
            "name": b.name,
            "description": b.description,
            "location": b.location,
            "address": b.address,
            "floors": b.floors,
        }
        for b in rows
    ]


def search_departments(db: Session, query: str, limit: int = 5) -> list[dict[str, Any]]:
    like = _like(query)
    rows = (
        db.query(Department)
        .filter(
            or_(
                Department.name.ilike(like),
                Department.school.ilike(like),
                Department.description.ilike(like),
            )
        )
        .limit(limit)
        .all()
    )
    return [
        {
            "type": "department",
            "id": d.id,
            "name": d.name,
            "school": d.school,
            "description": d.description,
            "location": d.location,
            "contact_email": d.contact_email,
            "contact_phone": d.contact_phone,
        }
        for d in rows
    ]


def search_faculty(db: Session, query: str, limit: int = 5) -> list[dict[str, Any]]:
    """Matches on faculty name/subjects/research AND on their department's
    name, so 'AI faculty' or 'who teaches machine learning' both work."""
    like = _like(query)
    rows = (
        db.query(Faculty)
        .join(Department, Faculty.department_id == Department.id, isouter=True)
        .filter(
            or_(
                Faculty.name.ilike(like),
                Faculty.designation.ilike(like),
                Faculty.subjects.ilike(like),
                Faculty.research_interests.ilike(like),
                Department.name.ilike(like),
            )
        )
        .limit(limit)
        .all()
    )
    return [
        {
            "type": "faculty",
            "id": f.id,
            "name": f.name,
            "designation": f.designation,
            "department": f.department.name if f.department else None,
            "email": f.email,
            "office_location": f.office_location,
            "subjects": f.subjects,
            "research_interests": f.research_interests,
        }
        for f in rows
    ]


def search_labs(db: Session, query: str, limit: int = 5) -> list[dict[str, Any]]:
    """Matches on lab name/description/equipment, its department, or its
    building - so 'labs in Academic Block B' and 'electronics lab' both work."""
    like = _like(query)
    rows = (
        db.query(Lab)
        .join(Department, Lab.department_id == Department.id, isouter=True)
        .join(Building, Lab.building_id == Building.id, isouter=True)
        .filter(
            or_(
                Lab.name.ilike(like),
                Lab.description.ilike(like),
                Lab.equipment.ilike(like),
                Department.name.ilike(like),
                Building.name.ilike(like),
            )
        )
        .limit(limit)
        .all()
    )
    return [
        {
            "type": "lab",
            "id": lab.id,
            "name": lab.name,
            "department": lab.department.name if lab.department else None,
            "building": lab.building.name if lab.building else None,
            "floor": lab.floor,
            "room_number": lab.room_number,
            "description": lab.description,
            "equipment": lab.equipment,
        }
        for lab in rows
    ]


def search_facilities(db: Session, query: str, limit: int = 5) -> list[dict[str, Any]]:
    like = _like(query)
    rows = (
        db.query(Facility)
        .join(Building, Facility.building_id == Building.id, isouter=True)
        .filter(
            or_(
                Facility.name.ilike(like),
                Facility.category.ilike(like),
                Facility.description.ilike(like),
                Building.name.ilike(like),
            )
        )
        .limit(limit)
        .all()
    )
    return [
        {
            "type": "facility",
            "id": f.id,
            "name": f.name,
            "category": f.category,
            "building": f.building.name if f.building else None,
            "location": f.location,
            "timings": f.timings,
            "description": f.description,
            "contact": f.contact,
        }
        for f in rows
    ]


def search_offices(db: Session, query: str, limit: int = 5) -> list[dict[str, Any]]:
    like = _like(query)
    rows = (
        db.query(Office)
        .join(Building, Office.building_id == Building.id, isouter=True)
        .filter(
            or_(
                Office.name.ilike(like),
                Office.purpose.ilike(like),
                Office.services.ilike(like),
                Building.name.ilike(like),
            )
        )
        .limit(limit)
        .all()
    )
    return [
        {
            "type": "office",
            "id": o.id,
            "name": o.name,
            "purpose": o.purpose,
            "building": o.building.name if o.building else None,
            "location": o.location,
            "timings": o.timings,
            "contact_email": o.contact_email,
            "contact_phone": o.contact_phone,
            "services": o.services,
        }
        for o in rows
    ]


# Registry the AI service uses to dispatch a tool call by name, without the
# AI service needing to import six functions individually.
SEARCH_FUNCTIONS = {
    "search_buildings": search_buildings,
    "search_departments": search_departments,
    "search_faculty": search_faculty,
    "search_labs": search_labs,
    "search_facilities": search_facilities,
    "search_offices": search_offices,
}
