from sqlalchemy import Column, Integer, String, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime
from app.database import Base


class Profile(Base):
    __tablename__ = "profiles"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    email = Column(String(255), unique=True, nullable=True)
    avatar = Column(String(255), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    inventory_items = relationship("InventoryItem", back_populates="profile", cascade="all, delete-orphan")
    preferences = relationship("UserPreference", back_populates="profile", cascade="all, delete-orphan")
    recipes = relationship("Recipe", back_populates="profile", cascade="all, delete-orphan")
    favorites = relationship("RecipeFavorite", back_populates="profile", cascade="all, delete-orphan")

