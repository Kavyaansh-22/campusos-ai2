from sqlalchemy import Column, Integer, String, Text, ForeignKey
from sqlalchemy.orm import relationship

from backend.database import Base


class Faculty(Base):
    __tablename__ = "faculty"

    id = Column(Integer, primary_key=True)
    name = Column(String(255), nullable=False)
    department_id = Column(Integer, ForeignKey("departments.id"))
    designation = Column(String(255))
    subjects = Column(Text)
    office_location = Column(String(255))
    email = Column(String(255))
    research_interests = Column(Text)

    department = relationship("Department", lazy="joined")
