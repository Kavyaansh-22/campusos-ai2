from sqlalchemy import Column, Integer, String, Text, ForeignKey
from sqlalchemy.orm import relationship

from backend.database import Base


class Office(Base):
    __tablename__ = "offices"

    id = Column(Integer, primary_key=True)
    name = Column(String(255), nullable=False)
    purpose = Column(Text)
    building_id = Column(Integer, ForeignKey("buildings.id"))
    location = Column(String(255))
    timings = Column(String(255))
    contact_email = Column(String(255))
    contact_phone = Column(String(50))
    services = Column(Text)

    building = relationship("Building", lazy="joined")
