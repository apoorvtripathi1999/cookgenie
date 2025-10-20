from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.schemas.recipe import (
    RecipeResponse,
    RecipeGenerateRequest,
    RecipeFavoriteCreate,
    RecipeFavoriteResponse
)
from app.services.recipe_service import RecipeService

router = APIRouter(prefix="/api/recipes", tags=["recipes"])


@router.post("/generate", response_model=RecipeResponse, status_code=status.HTTP_201_CREATED)
def generate_recipe(request: RecipeGenerateRequest, db: Session = Depends(get_db)):
    """Generate a recipe using AI based on available ingredients and preferences"""
    try:
        recipe = RecipeService.generate_recipe(db, request)
        return recipe
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error generating recipe: {str(e)}"
        )


@router.get("/profile/{profile_id}", response_model=List[RecipeResponse])
def get_recipes_by_profile(profile_id: int, limit: int = 50, db: Session = Depends(get_db)):
    """Get all recipes for a profile"""
    recipes = RecipeService.get_recipes_by_profile(db, profile_id, limit)
    
    # Add is_favorite field to each recipe
    for recipe in recipes:
        recipe.is_favorite = RecipeService.is_favorited(db, profile_id, recipe.id)
    
    return recipes


@router.get("/{recipe_id}", response_model=RecipeResponse)
def get_recipe(recipe_id: int, db: Session = Depends(get_db)):
    """Get a single recipe by ID"""
    recipe = RecipeService.get_recipe_by_id(db, recipe_id)
    if not recipe:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Recipe not found"
        )
    return recipe


@router.delete("/{recipe_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_recipe(recipe_id: int, db: Session = Depends(get_db)):
    """Delete a recipe"""
    success = RecipeService.delete_recipe(db, recipe_id)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Recipe not found"
        )
    return None


@router.post("/favorites", response_model=RecipeFavoriteResponse, status_code=status.HTTP_201_CREATED)
def add_to_favorites(favorite: RecipeFavoriteCreate, db: Session = Depends(get_db)):
    """Add a recipe to favorites"""
    # Check if recipe exists
    recipe = RecipeService.get_recipe_by_id(db, favorite.recipe_id)
    if not recipe:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Recipe not found"
        )
    
    return RecipeService.add_to_favorites(db, favorite)


@router.delete("/favorites/{profile_id}/{recipe_id}", status_code=status.HTTP_204_NO_CONTENT)
def remove_from_favorites(profile_id: int, recipe_id: int, db: Session = Depends(get_db)):
    """Remove a recipe from favorites"""
    success = RecipeService.remove_from_favorites(db, profile_id, recipe_id)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Favorite not found"
        )
    return None


@router.get("/favorites/profile/{profile_id}", response_model=List[RecipeFavoriteResponse])
def get_favorites(profile_id: int, db: Session = Depends(get_db)):
    """Get all favorite recipes for a profile"""
    return RecipeService.get_favorites(db, profile_id)

