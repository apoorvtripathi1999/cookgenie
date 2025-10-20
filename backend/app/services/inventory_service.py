from sqlalchemy.orm import Session
from app.models.inventory import InventoryItem
from app.schemas.inventory import InventoryItemCreate, InventoryItemUpdate, ExpiryAlert
from datetime import date, timedelta
from typing import List


class InventoryService:
    
    @staticmethod
    def create_item(db: Session, item: InventoryItemCreate) -> InventoryItem:
        """Create a new inventory item"""
        db_item = InventoryItem(**item.dict())
        db.add(db_item)
        db.commit()
        db.refresh(db_item)
        return db_item
    
    @staticmethod
    def get_items_by_profile(db: Session, profile_id: int) -> List[InventoryItem]:
        """Get all inventory items for a profile"""
        return db.query(InventoryItem).filter(
            InventoryItem.profile_id == profile_id
        ).all()
    
    @staticmethod
    def get_item_by_id(db: Session, item_id: int) -> InventoryItem:
        """Get a single inventory item by ID"""
        return db.query(InventoryItem).filter(InventoryItem.id == item_id).first()
    
    @staticmethod
    def update_item(db: Session, item_id: int, item_update: InventoryItemUpdate) -> InventoryItem:
        """Update an inventory item"""
        db_item = db.query(InventoryItem).filter(InventoryItem.id == item_id).first()
        if not db_item:
            return None
        
        update_data = item_update.dict(exclude_unset=True)
        for key, value in update_data.items():
            setattr(db_item, key, value)
        
        db.commit()
        db.refresh(db_item)
        return db_item
    
    @staticmethod
    def delete_item(db: Session, item_id: int) -> bool:
        """Delete an inventory item"""
        db_item = db.query(InventoryItem).filter(InventoryItem.id == item_id).first()
        if not db_item:
            return False
        
        db.delete(db_item)
        db.commit()
        return True
    
    @staticmethod
    def get_expiry_alerts(db: Session, profile_id: int) -> List[ExpiryAlert]:
        """Get expiry alerts for items that are expired or expiring soon"""
        items = db.query(InventoryItem).filter(
            InventoryItem.profile_id == profile_id,
            InventoryItem.expiry_date.isnot(None)
        ).all()
        
        today = date.today()
        alerts = []
        
        for item in items:
            days_until_expiry = (item.expiry_date - today).days
            
            if days_until_expiry < 0:
                status = "expired"
            elif days_until_expiry <= 3:
                status = "expiring_soon"
            elif days_until_expiry <= 7:
                status = "expiring_this_week"
            else:
                continue  # Don't include items expiring later
            
            alerts.append(ExpiryAlert(
                item=item,
                days_until_expiry=days_until_expiry,
                status=status
            ))
        
        return alerts
    
    @staticmethod
    def get_low_stock_items(db: Session, profile_id: int, threshold: float = 1.0) -> List[InventoryItem]:
        """Get items that are running low on stock"""
        return db.query(InventoryItem).filter(
            InventoryItem.profile_id == profile_id,
            InventoryItem.quantity <= threshold
        ).all()

