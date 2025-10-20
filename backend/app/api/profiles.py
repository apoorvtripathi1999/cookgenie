from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.schemas.profile import ProfileCreate, ProfileUpdate, ProfileResponse
from app.services.profile_service import ProfileService

router = APIRouter(prefix="/api/profiles", tags=["profiles"])


@router.post("/", response_model=ProfileResponse, status_code=status.HTTP_201_CREATED)
def create_profile(profile: ProfileCreate, db: Session = Depends(get_db)):
    """Create a new profile"""
    # Check if email already exists
    if profile.email:
        existing = ProfileService.get_profile_by_email(db, profile.email)
        if existing:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email already registered"
            )
    
    return ProfileService.create_profile(db, profile)


@router.get("/", response_model=List[ProfileResponse])
def get_all_profiles(db: Session = Depends(get_db)):
    """Get all profiles"""
    return ProfileService.get_all_profiles(db)


@router.get("/{profile_id}", response_model=ProfileResponse)
def get_profile(profile_id: int, db: Session = Depends(get_db)):
    """Get a profile by ID"""
    profile = ProfileService.get_profile_by_id(db, profile_id)
    if not profile:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Profile not found"
        )
    return profile


@router.put("/{profile_id}", response_model=ProfileResponse)
def update_profile(profile_id: int, profile_update: ProfileUpdate, db: Session = Depends(get_db)):
    """Update a profile"""
    profile = ProfileService.update_profile(db, profile_id, profile_update)
    if not profile:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Profile not found"
        )
    return profile


@router.delete("/{profile_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_profile(profile_id: int, db: Session = Depends(get_db)):
    """Delete a profile"""
    success = ProfileService.delete_profile(db, profile_id)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Profile not found"
        )
    return None

