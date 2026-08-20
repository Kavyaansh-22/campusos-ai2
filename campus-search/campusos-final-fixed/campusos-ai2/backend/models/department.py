from sqlalchemy import Column, Integer, String, Text, DateTime
from sqlalchemy.sql import func
from backend.database import Base


class Department(Base):
    __tablename__ = "departments"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    school = Column(String(255))
    description = Column(Text)
    location = Column(String(255))
    contact_email = Column(String(255))
    contact_phone = Column(String(255))
    created_at = Column(DateTime, server_default=func.now())