from sqlalchemy import Column, Integer, String, Text

from backend.database import Base


class Building(Base):
    __tablename__ = "buildings"

    id = Column(Integer, primary_key=True)
    name = Column(String(255), nullable=False)
    description = Column(Text)
    location = Column(String(255))
    address = Column(String(255))
    floors = Column(Integer)
