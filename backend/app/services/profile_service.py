from sqlalchemy.orm import Session
from app.models.profile import Profile
from app.schemas.profile import ProfileCreate, ProfileUpdate
from typing import List, Optional


class ProfileService:
    
    @staticmethod
    def create_profile(db: Session, profile: ProfileCreate) -> Profile:
        """Create a new profile"""
        db_profile = Profile(**profile.dict())
        db.add(db_profile)
        db.commit()
        db.refresh(db_profile)
        return db_profile
    
    @staticmethod
    def get_all_profiles(db: Session) -> List[Profile]:
        """Get all profiles"""
        return db.query(Profile).all()
    
    @staticmethod
    def get_profile_by_id(db: Session, profile_id: int) -> Optional[Profile]:
        """Get a profile by ID"""
        return db.query(Profile).filter(Profile.id == profile_id).first()
    
    @staticmethod
    def get_profile_by_email(db: Session, email: str) -> Optional[Profile]:
        """Get a profile by email"""
        return db.query(Profile).filter(Profile.email == email).first()
    
    @staticmethod
    def update_profile(db: Session, profile_id: int, profile_update: ProfileUpdate) -> Optional[Profile]:
        """Update a profile"""
        db_profile = db.query(Profile).filter(Profile.id == profile_id).first()
        if not db_profile:
            return None
        
        update_data = profile_update.dict(exclude_unset=True)
        for key, value in update_data.items():
            setattr(db_profile, key, value)
        
        db.commit()
        db.refresh(db_profile)
        return db_profile
    
    @staticmethod
    def delete_profile(db: Session, profile_id: int) -> bool:
        """Delete a profile"""
        db_profile = db.query(Profile).filter(Profile.id == profile_id).first()
        if not db_profile:
            return False
        
        db.delete(db_profile)
        db.commit()
        return True

