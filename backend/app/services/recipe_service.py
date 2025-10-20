from sqlalchemy.orm import Session
from app.models.recipe import Recipe, RecipeFavorite
from app.models.inventory import InventoryItem
from app.schemas.recipe import RecipeGenerateRequest, RecipeFavoriteCreate
from app.services.gemini_service import gemini_service
from typing import List, Optional


class RecipeService:
    
    @staticmethod
    def generate_recipe(db: Session, request: RecipeGenerateRequest) -> Recipe:
        """Generate a recipe using Gemini API and save it"""
        
        # Get ingredients from inventory if not provided
        if not request.ingredients:
            inventory_items = db.query(InventoryItem).filter(
                InventoryItem.profile_id == request.profile_id
            ).all()
            ingredients = [item.name for item in inventory_items if item.quantity > 0]
        else:
            ingredients = request.ingredients
        
        if not ingredients:
            raise ValueError("No ingredients available to generate recipe")
        
        # Generate recipe using Gemini
        recipe_data = gemini_service.generate_recipe(
            ingredients=ingredients,
            cuisine_type=request.cuisine_type,
            max_cooking_time=request.max_cooking_time,
            dietary_preferences=request.dietary_preferences,
            available_utensils=request.available_utensils,
            servings=request.servings
        )
        
        # Save recipe to database
        db_recipe = Recipe(
            profile_id=request.profile_id,
            title=recipe_data['title'],
            cuisine_type=recipe_data.get('cuisine_type'),
            cooking_time=recipe_data.get('cooking_time'),
            difficulty=recipe_data.get('difficulty'),
            servings=recipe_data.get('servings'),
            ingredients=recipe_data['ingredients'],
            instructions=recipe_data['instructions'],
            utensils_required=recipe_data.get('utensils_required'),
            nutritional_info=recipe_data.get('nutritional_info'),
            generated_by_ai=True
        )
        
        db.add(db_recipe)
        db.commit()
        db.refresh(db_recipe)
        
        return db_recipe
    
    @staticmethod
    def get_recipes_by_profile(db: Session, profile_id: int, limit: int = 50) -> List[Recipe]:
        """Get all recipes for a profile"""
        return db.query(Recipe).filter(
            Recipe.profile_id == profile_id
        ).order_by(Recipe.created_at.desc()).limit(limit).all()
    
    @staticmethod
    def get_recipe_by_id(db: Session, recipe_id: int) -> Optional[Recipe]:
        """Get a single recipe by ID"""
        return db.query(Recipe).filter(Recipe.id == recipe_id).first()
    
    @staticmethod
    def delete_recipe(db: Session, recipe_id: int) -> bool:
        """Delete a recipe"""
        db_recipe = db.query(Recipe).filter(Recipe.id == recipe_id).first()
        if not db_recipe:
            return False
        
        db.delete(db_recipe)
        db.commit()
        return True
    
    @staticmethod
    def add_to_favorites(db: Session, favorite: RecipeFavoriteCreate) -> RecipeFavorite:
        """Add a recipe to favorites"""
        # Check if already favorited
        existing = db.query(RecipeFavorite).filter(
            RecipeFavorite.profile_id == favorite.profile_id,
            RecipeFavorite.recipe_id == favorite.recipe_id
        ).first()
        
        if existing:
            return existing
        
        db_favorite = RecipeFavorite(**favorite.dict())
        db.add(db_favorite)
        db.commit()
        db.refresh(db_favorite)
        return db_favorite
    
    @staticmethod
    def remove_from_favorites(db: Session, profile_id: int, recipe_id: int) -> bool:
        """Remove a recipe from favorites"""
        db_favorite = db.query(RecipeFavorite).filter(
            RecipeFavorite.profile_id == profile_id,
            RecipeFavorite.recipe_id == recipe_id
        ).first()
        
        if not db_favorite:
            return False
        
        db.delete(db_favorite)
        db.commit()
        return True
    
    @staticmethod
    def get_favorites(db: Session, profile_id: int) -> List[RecipeFavorite]:
        """Get all favorite recipes for a profile"""
        return db.query(RecipeFavorite).filter(
            RecipeFavorite.profile_id == profile_id
        ).order_by(RecipeFavorite.created_at.desc()).all()
    
    @staticmethod
    def is_favorited(db: Session, profile_id: int, recipe_id: int) -> bool:
        """Check if a recipe is favorited by a profile"""
        favorite = db.query(RecipeFavorite).filter(
            RecipeFavorite.profile_id == profile_id,
            RecipeFavorite.recipe_id == recipe_id
        ).first()
        return favorite is not None

