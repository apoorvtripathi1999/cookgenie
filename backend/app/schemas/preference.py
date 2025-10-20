from pydantic import BaseModel
from datetime import datetime
from typing import Optional, List


class UserPreferenceBase(BaseModel):
    dietary_restrictions: Optional[List[str]] = None
    preferred_cuisines: Optional[List[str]] = None
    disliked_ingredients: Optional[List[str]] = None
    available_utensils: Optional[List[str]] = None
    max_cooking_time: Optional[int] = None
    skill_level: Optional[str] = None


class UserPreferenceCreate(UserPreferenceBase):
    profile_id: int


class UserPreferenceUpdate(UserPreferenceBase):
    pass


class UserPreferenceResponse(UserPreferenceBase):
    id: int
    profile_id: int
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True

