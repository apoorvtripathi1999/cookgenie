import google.generativeai as genai
from app.config import get_settings
from typing import List, Dict, Any, Optional
import json
import re

settings = get_settings()
genai.configure(api_key=settings.gemini_api_key)


class GeminiService:
    def __init__(self):
        # Use the latest available Gemini model
        self.model = genai.GenerativeModel('gemini-2.5-flash')
    
    def generate_recipe(
        self,
        ingredients: List[str],
        cuisine_type: Optional[str] = None,
        max_cooking_time: Optional[int] = None,
        dietary_preferences: Optional[List[str]] = None,
        available_utensils: Optional[List[str]] = None,
        servings: int = 2,
        disliked_ingredients: Optional[List[str]] = None
    ) -> Dict[str, Any]:
        """
        Generate a recipe using Gemini API based on available ingredients and preferences
        """
        
        # Build the prompt
        prompt = self._build_recipe_prompt(
            ingredients=ingredients,
            cuisine_type=cuisine_type,
            max_cooking_time=max_cooking_time,
            dietary_preferences=dietary_preferences,
            available_utensils=available_utensils,
            servings=servings,
            disliked_ingredients=disliked_ingredients
        )
        
        try:
            response = self.model.generate_content(prompt)
            recipe_data = self._parse_recipe_response(response.text)
            return recipe_data
        except Exception as e:
            raise Exception(f"Error generating recipe with Gemini: {str(e)}")
    
    def _build_recipe_prompt(
        self,
        ingredients: List[str],
        cuisine_type: Optional[str],
        max_cooking_time: Optional[int],
        dietary_preferences: Optional[List[str]],
        available_utensils: Optional[List[str]],
        servings: int,
        disliked_ingredients: Optional[List[str]]
    ) -> str:
        """Build a detailed prompt for Gemini"""
        
        prompt = f"""You are a professional chef assistant. Generate a detailed recipe based on the following criteria:

**Available Ingredients:**
{', '.join(ingredients)}

**Requirements:**
- Servings: {servings}"""
        
        if cuisine_type:
            prompt += f"\n- Cuisine Type: {cuisine_type}"
        
        if max_cooking_time:
            prompt += f"\n- Maximum Cooking Time: {max_cooking_time} minutes"
        
        if dietary_preferences:
            prompt += f"\n- Dietary Preferences: {', '.join(dietary_preferences)}"
        
        if available_utensils:
            prompt += f"\n- Available Kitchen Tools: {', '.join(available_utensils)}"
        
        if disliked_ingredients:
            prompt += f"\n- DO NOT USE: {', '.join(disliked_ingredients)}"
        
        prompt += """

Please provide the recipe in the following JSON format:
{
    "title": "Recipe Name",
    "cuisine_type": "Cuisine Type",
    "cooking_time": <time in minutes>,
    "difficulty": "easy/medium/hard",
    "servings": <number>,
    "ingredients": [
        {"name": "ingredient name", "quantity": "amount", "unit": "unit"},
        ...
    ],
    "instructions": "Step-by-step cooking instructions with numbered steps",
    "utensils_required": ["utensil1", "utensil2", ...],
    "nutritional_info": {
        "calories": "approximate calories per serving",
        "protein": "grams",
        "carbs": "grams",
        "fat": "grams"
    }
}

Make sure the recipe:
1. Uses primarily the available ingredients
2. Is practical and delicious
3. Includes clear, numbered steps
4. Respects all dietary preferences
5. Can be made with available utensils
6. Fits within the time constraint

Respond ONLY with valid JSON, no additional text."""
        
        return prompt
    
    def _parse_recipe_response(self, response_text: str) -> Dict[str, Any]:
        """Parse the Gemini response and extract recipe data"""
        
        try:
            # Try to extract JSON from the response
            # Remove markdown code blocks if present
            json_match = re.search(r'```(?:json)?\s*([\s\S]*?)\s*```', response_text)
            if json_match:
                json_text = json_match.group(1)
            else:
                json_text = response_text
            
            # Parse JSON
            recipe_data = json.loads(json_text.strip())
            
            # Validate required fields
            required_fields = ['title', 'ingredients', 'instructions']
            for field in required_fields:
                if field not in recipe_data:
                    raise ValueError(f"Missing required field: {field}")
            
            # Ensure instructions is a string
            if isinstance(recipe_data['instructions'], list):
                recipe_data['instructions'] = '\n'.join(recipe_data['instructions'])
            
            return recipe_data
            
        except json.JSONDecodeError as e:
            # If JSON parsing fails, create a structured response from text
            return self._fallback_parse(response_text)
    
    def _fallback_parse(self, response_text: str) -> Dict[str, Any]:
        """Fallback parser if JSON extraction fails"""
        
        return {
            "title": "Custom Recipe",
            "cuisine_type": "Mixed",
            "cooking_time": 30,
            "difficulty": "medium",
            "servings": 2,
            "ingredients": [{"name": "Various ingredients", "quantity": "as needed", "unit": ""}],
            "instructions": response_text,
            "utensils_required": ["Basic kitchen tools"],
            "nutritional_info": None
        }


# Singleton instance
gemini_service = GeminiService()

