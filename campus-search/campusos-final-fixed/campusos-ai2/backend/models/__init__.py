"""SQLAlchemy models mapped onto the existing campusos MySQL tables.

These map onto tables that ALREADY exist (created via MySQL Workbench).
Nothing in this package creates or alters the schema.
"""
from backend.models.building import Building
from backend.models.department import Department
from backend.models.faculty import Faculty
from backend.models.lab import Lab
from backend.models.facility import Facility
from backend.models.office import Office

__all__ = ["Building", "Department", "Faculty", "Lab", "Facility", "Office"]
