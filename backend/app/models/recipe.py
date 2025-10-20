from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey, JSON, Boolean
from sqlalchemy.orm import relationship
from datetime import datetime
from app.database import Base


class Recipe(Base):
    __tablename__ = "recipes"
    
    id = Column(Integer, primary_key=True, index=True)
    profile_id = Column(Integer, ForeignKey("profiles.id"), nullable=False)
    title = Column(String(255), nullable=False)
    cuisine_type = Column(String(100), nullable=True)
    cooking_time = Column(Integer, nullable=True)  # in minutes
    difficulty = Column(String(50), nullable=True)  # easy, medium, hard
    servings = Column(Integer, nullable=True)
    ingredients = Column(JSON, nullable=False)  # list of ingredients used
    instructions = Column(Text, nullable=False)
    utensils_required = Column(JSON, nullable=True)  # list of utensils
    nutritional_info = Column(JSON, nullable=True)
    image_url = Column(String(500), nullable=True)
    generated_by_ai = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    profile = relationship("Profile", back_populates="recipes")
    favorites = relationship("RecipeFavorite", back_populates="recipe", cascade="all, delete-orphan")


class RecipeFavorite(Base):
    __tablename__ = "recipe_favorites"
    
    id = Column(Integer, primary_key=True, index=True)
    profile_id = Column(Integer, ForeignKey("profiles.id"), nullable=False)
    recipe_id = Column(Integer, ForeignKey("recipes.id"), nullable=False)
    notes = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    profile = relationship("Profile", back_populates="favorites")
    recipe = relationship("Recipe", back_populates="favorites")

