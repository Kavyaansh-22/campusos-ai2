from sqlalchemy import Column, Integer, String, Text, ForeignKey
from sqlalchemy.orm import relationship

from backend.database import Base


class Facility(Base):
    __tablename__ = "facilities"

    id = Column(Integer, primary_key=True)
    name = Column(String(255), nullable=False)
    category = Column(String(100))
    building_id = Column(Integer, ForeignKey("buildings.id"))
    location = Column(String(255))
    timings = Column(String(255))
    description = Column(Text)
    contact = Column(String(255))

    building = relationship("Building", lazy="joined")
