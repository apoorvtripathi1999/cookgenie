from pydantic import BaseModel, EmailStr
from datetime import datetime
from typing import Optional


class ProfileBase(BaseModel):
    name: str
    email: Optional[EmailStr] = None
    avatar: Optional[str] = None


class ProfileCreate(ProfileBase):
    pass


class ProfileUpdate(BaseModel):
    name: Optional[str] = None
    email: Optional[EmailStr] = None
    avatar: Optional[str] = None


class ProfileResponse(ProfileBase):
    id: int
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True

