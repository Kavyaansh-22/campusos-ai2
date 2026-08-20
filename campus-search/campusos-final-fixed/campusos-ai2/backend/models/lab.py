from sqlalchemy import Column, Integer, String, Text, ForeignKey
from sqlalchemy.orm import relationship

from backend.database import Base


class Lab(Base):
    __tablename__ = "labs"

    id = Column(Integer, primary_key=True)
    name = Column(String(255), nullable=False)
    department_id = Column(Integer, ForeignKey("departments.id"))
    building_id = Column(Integer, ForeignKey("buildings.id"))
    floor = Column(Integer)
    room_number = Column(String(50))
    description = Column(Text)
    equipment = Column(Text)

    department = relationship("Department", lazy="joined")
    building = relationship("Building", lazy="joined")
