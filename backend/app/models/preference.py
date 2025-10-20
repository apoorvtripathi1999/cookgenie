from sqlalchemy import Column, Integer, String, ForeignKey, JSON, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime
from app.database import Base


class UserPreference(Base):
    __tablename__ = "user_preferences"
    
    id = Column(Integer, primary_key=True, index=True)
    profile_id = Column(Integer, ForeignKey("profiles.id"), nullable=False, unique=True)
    
    # Dietary preferences
    dietary_restrictions = Column(JSON, nullable=True)  # ["vegan", "gluten-free", etc.]
    preferred_cuisines = Column(JSON, nullable=True)  # ["Indian", "Italian", etc.]
    disliked_ingredients = Column(JSON, nullable=True)
    
    # Cooking preferences
    available_utensils = Column(JSON, nullable=True)  # ["oven", "air fryer", etc.]
    max_cooking_time = Column(Integer, nullable=True)  # in minutes
    skill_level = Column(String(50), nullable=True)  # beginner, intermediate, advanced
    
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    profile = relationship("Profile", back_populates="preferences")

