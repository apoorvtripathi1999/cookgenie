'use client';

import React from 'react';
import { Clock, Users, ChefHat, Utensils } from 'lucide-react';
import Badge from '@/components/ui/Badge';
import { Recipe } from '@/lib/types';

interface RecipeDetailProps {
  recipe: Recipe;
}

const RecipeDetail: React.FC<RecipeDetailProps> = ({ recipe }) => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold text-gray-900 mb-3">{recipe.title}</h2>
        <div className="flex flex-wrap gap-2 mb-4">
          {recipe.cuisine_type && <Badge variant="info">{recipe.cuisine_type}</Badge>}
          {recipe.difficulty && <Badge variant="default">{recipe.difficulty}</Badge>}
        </div>
        
        <div className="flex flex-wrap gap-4 text-sm text-gray-600">
          {recipe.cooking_time && (
            <div className="flex items-center space-x-2">
              <Clock className="w-5 h-5" />
              <span className="font-medium">{recipe.cooking_time} minutes</span>
            </div>
          )}
          
          {recipe.servings && (
            <div className="flex items-center space-x-2">
              <Users className="w-5 h-5" />
              <span className="font-medium">{recipe.servings} servings</span>
            </div>
          )}
        </div>
      </div>
      
      {/* Ingredients */}
      <div>
        <h3 className="flex items-center space-x-2 text-xl font-bold text-gray-900 mb-3">
          <ChefHat className="w-6 h-6" />
          <span>Ingredients</span>
        </h3>
        <ul className="space-y-2">
          {recipe.ingredients.map((ingredient, index) => (
            <li key={index} className="flex items-center space-x-2 text-gray-700">
              <span className="w-2 h-2 bg-primary-500 rounded-full"></span>
              <span>
                <span className="font-medium">{ingredient.quantity} {ingredient.unit}</span> {ingredient.name}
              </span>
            </li>
          ))}
        </ul>
      </div>
      
      {/* Utensils */}
      {recipe.utensils_required && recipe.utensils_required.length > 0 && (
        <div>
          <h3 className="flex items-center space-x-2 text-xl font-bold text-gray-900 mb-3">
            <Utensils className="w-6 h-6" />
            <span>Required Utensils</span>
          </h3>
          <div className="flex flex-wrap gap-2">
            {recipe.utensils_required.map((utensil, index) => (
              <Badge key={index} variant="default">{utensil}</Badge>
            ))}
          </div>
        </div>
      )}
      
      {/* Instructions */}
      <div>
        <h3 className="text-xl font-bold text-gray-900 mb-3">Instructions</h3>
        <div className="prose prose-sm max-w-none">
          <p className="text-gray-700 whitespace-pre-line leading-relaxed">{recipe.instructions}</p>
        </div>
      </div>
      
      {/* Nutritional Info */}
      {recipe.nutritional_info && (
        <div>
          <h3 className="text-xl font-bold text-gray-900 mb-3">Nutritional Information</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {recipe.nutritional_info.calories && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600">Calories</p>
                <p className="text-lg font-bold text-gray-900">{recipe.nutritional_info.calories}</p>
              </div>
            )}
            {recipe.nutritional_info.protein && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600">Protein</p>
                <p className="text-lg font-bold text-gray-900">{recipe.nutritional_info.protein}g</p>
              </div>
            )}
            {recipe.nutritional_info.carbs && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600">Carbs</p>
                <p className="text-lg font-bold text-gray-900">{recipe.nutritional_info.carbs}g</p>
              </div>
            )}
            {recipe.nutritional_info.fat && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600">Fat</p>
                <p className="text-lg font-bold text-gray-900">{recipe.nutritional_info.fat}g</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default RecipeDetail;

