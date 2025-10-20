from sqlalchemy.orm import Session
from app.models.preference import UserPreference
from app.schemas.preference import UserPreferenceCreate, UserPreferenceUpdate
from typing import Optional


class PreferenceService:
    
    @staticmethod
    def create_preference(db: Session, preference: UserPreferenceCreate) -> UserPreference:
        """Create user preferences"""
        db_preference = UserPreference(**preference.dict())
        db.add(db_preference)
        db.commit()
        db.refresh(db_preference)
        return db_preference
    
    @staticmethod
    def get_preference_by_profile(db: Session, profile_id: int) -> Optional[UserPreference]:
        """Get preferences for a profile"""
        return db.query(UserPreference).filter(
            UserPreference.profile_id == profile_id
        ).first()
    
    @staticmethod
    def update_preference(db: Session, profile_id: int, preference_update: UserPreferenceUpdate) -> Optional[UserPreference]:
        """Update user preferences"""
        db_preference = db.query(UserPreference).filter(
            UserPreference.profile_id == profile_id
        ).first()
        
        if not db_preference:
            return None
        
        update_data = preference_update.dict(exclude_unset=True)
        for key, value in update_data.items():
            setattr(db_preference, key, value)
        
        db.commit()
        db.refresh(db_preference)
        return db_preference
    
    @staticmethod
    def delete_preference(db: Session, profile_id: int) -> bool:
        """Delete user preferences"""
        db_preference = db.query(UserPreference).filter(
            UserPreference.profile_id == profile_id
        ).first()
        
        if not db_preference:
            return False
        
        db.delete(db_preference)
        db.commit()
        return True

