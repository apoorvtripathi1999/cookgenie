from pydantic import BaseModel, Field
from datetime import date, datetime
from typing import Optional
from app.models.inventory import UnitType


class InventoryItemBase(BaseModel):
    name: str
    quantity: float = Field(gt=0)
    unit: UnitType
    category: Optional[str] = None
    expiry_date: Optional[date] = None
    purchase_date: Optional[date] = None
    notes: Optional[str] = None


class InventoryItemCreate(InventoryItemBase):
    profile_id: int


class InventoryItemUpdate(BaseModel):
    name: Optional[str] = None
    quantity: Optional[float] = Field(default=None, gt=0)
    unit: Optional[UnitType] = None
    category: Optional[str] = None
    expiry_date: Optional[date] = None
    purchase_date: Optional[date] = None
    notes: Optional[str] = None


class InventoryItemResponse(InventoryItemBase):
    id: int
    profile_id: int
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True


class ExpiryAlert(BaseModel):
    item: InventoryItemResponse
    days_until_expiry: int
    status: str  # "expired", "expiring_soon", "expiring_this_week"

