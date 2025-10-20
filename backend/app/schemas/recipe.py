from pydantic import BaseModel
from datetime import datetime
from typing import Optional, List, Dict, Any


class RecipeGenerateRequest(BaseModel):
    profile_id: int
    ingredients: Optional[List[str]] = None  # If None, use all available inventory
    cuisine_type: Optional[str] = None
    max_cooking_time: Optional[int] = None
    dietary_preferences: Optional[List[str]] = None
    available_utensils: Optional[List[str]] = None
    servings: Optional[int] = 2


class RecipeBase(BaseModel):
    title: str
    cuisine_type: Optional[str] = None
    cooking_time: Optional[int] = None
    difficulty: Optional[str] = None
    servings: Optional[int] = None
    ingredients: List[Dict[str, Any]]
    instructions: str
    utensils_required: Optional[List[str]] = None
    nutritional_info: Optional[Dict[str, Any]] = None
    image_url: Optional[str] = None


class RecipeResponse(RecipeBase):
    id: int
    profile_id: int
    generated_by_ai: bool
    created_at: datetime
    is_favorite: Optional[bool] = False
    
    class Config:
        from_attributes = True


class RecipeFavoriteCreate(BaseModel):
    profile_id: int
    recipe_id: int
    notes: Optional[str] = None


class RecipeFavoriteResponse(BaseModel):
    id: int
    profile_id: int
    recipe_id: int
    notes: Optional[str] = None
    created_at: datetime
    recipe: RecipeResponse
    
    class Config:
        from_attributes = True

