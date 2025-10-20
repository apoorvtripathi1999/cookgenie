from sqlalchemy import Column, Integer, String, Float, Date, DateTime, ForeignKey, Enum
from sqlalchemy.orm import relationship
from datetime import datetime
import enum
from app.database import Base


class UnitType(str, enum.Enum):
    GRAM = "gram"
    KILOGRAM = "kilogram"
    LITER = "liter"
    MILLILITER = "milliliter"
    PIECE = "piece"
    CUP = "cup"
    TABLESPOON = "tablespoon"
    TEASPOON = "teaspoon"


class InventoryItem(Base):
    __tablename__ = "inventory_items"
    
    id = Column(Integer, primary_key=True, index=True)
    profile_id = Column(Integer, ForeignKey("profiles.id"), nullable=False)
    name = Column(String(255), nullable=False)
    quantity = Column(Float, nullable=False)
    unit = Column(Enum(UnitType), nullable=False)
    category = Column(String(100), nullable=True)  # e.g., "vegetable", "dairy", "spice"
    expiry_date = Column(Date, nullable=True)
    purchase_date = Column(Date, nullable=True)
    notes = Column(String(500), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    profile = relationship("Profile", back_populates="inventory_items")

