from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.schemas.inventory import (
    InventoryItemCreate,
    InventoryItemUpdate,
    InventoryItemResponse,
    ExpiryAlert
)
from app.services.inventory_service import InventoryService

router = APIRouter(prefix="/api/inventory", tags=["inventory"])


@router.post("/", response_model=InventoryItemResponse, status_code=status.HTTP_201_CREATED)
def create_inventory_item(item: InventoryItemCreate, db: Session = Depends(get_db)):
    """Create a new inventory item"""
    return InventoryService.create_item(db, item)


@router.get("/profile/{profile_id}", response_model=List[InventoryItemResponse])
def get_inventory_by_profile(profile_id: int, db: Session = Depends(get_db)):
    """Get all inventory items for a profile"""
    return InventoryService.get_items_by_profile(db, profile_id)


@router.get("/{item_id}", response_model=InventoryItemResponse)
def get_inventory_item(item_id: int, db: Session = Depends(get_db)):
    """Get a single inventory item"""
    item = InventoryService.get_item_by_id(db, item_id)
    if not item:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Inventory item not found"
        )
    return item


@router.put("/{item_id}", response_model=InventoryItemResponse)
def update_inventory_item(item_id: int, item_update: InventoryItemUpdate, db: Session = Depends(get_db)):
    """Update an inventory item"""
    item = InventoryService.update_item(db, item_id, item_update)
    if not item:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Inventory item not found"
        )
    return item


@router.delete("/{item_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_inventory_item(item_id: int, db: Session = Depends(get_db)):
    """Delete an inventory item"""
    success = InventoryService.delete_item(db, item_id)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Inventory item not found"
        )
    return None


@router.get("/profile/{profile_id}/expiry-alerts", response_model=List[ExpiryAlert])
def get_expiry_alerts(profile_id: int, db: Session = Depends(get_db)):
    """Get expiry alerts for a profile"""
    return InventoryService.get_expiry_alerts(db, profile_id)


@router.get("/profile/{profile_id}/low-stock", response_model=List[InventoryItemResponse])
def get_low_stock_items(
    profile_id: int,
    threshold: float = Query(default=1.0, ge=0),
    db: Session = Depends(get_db)
):
    """Get low stock items for a profile"""
    return InventoryService.get_low_stock_items(db, profile_id, threshold)

