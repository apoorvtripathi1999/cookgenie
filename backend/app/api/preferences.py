from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.schemas.preference import UserPreferenceCreate, UserPreferenceUpdate, UserPreferenceResponse
from app.services.preference_service import PreferenceService

router = APIRouter(prefix="/api/preferences", tags=["preferences"])


@router.post("/", response_model=UserPreferenceResponse, status_code=status.HTTP_201_CREATED)
def create_preference(preference: UserPreferenceCreate, db: Session = Depends(get_db)):
    """Create user preferences"""
    # Check if preferences already exist for this profile
    existing = PreferenceService.get_preference_by_profile(db, preference.profile_id)
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Preferences already exist for this profile. Use PUT to update."
        )
    
    return PreferenceService.create_preference(db, preference)


@router.get("/{profile_id}", response_model=UserPreferenceResponse)
def get_preference(profile_id: int, db: Session = Depends(get_db)):
    """Get preferences for a profile"""
    preference = PreferenceService.get_preference_by_profile(db, profile_id)
    if not preference:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Preferences not found for this profile"
        )
    return preference


@router.put("/{profile_id}", response_model=UserPreferenceResponse)
def update_preference(profile_id: int, preference_update: UserPreferenceUpdate, db: Session = Depends(get_db)):
    """Update user preferences"""
    preference = PreferenceService.update_preference(db, profile_id, preference_update)
    if not preference:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Preferences not found for this profile"
        )
    return preference


@router.delete("/{profile_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_preference(profile_id: int, db: Session = Depends(get_db)):
    """Delete user preferences"""
    success = PreferenceService.delete_preference(db, profile_id)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Preferences not found for this profile"
        )
    return None

