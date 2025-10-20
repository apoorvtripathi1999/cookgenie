'use client';

import React from 'react';
import { Clock, Users, ChefHat, Heart, Trash2 } from 'lucide-react';
import Card, { CardContent, CardFooter } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import { Recipe } from '@/lib/types';
import { formatRelativeTime } from '@/lib/utils';

interface RecipeCardProps {
  recipe: Recipe;
  onView: (recipe: Recipe) => void;
  onToggleFavorite: (recipe: Recipe) => void;
  onDelete?: (id: number) => void;
}

const RecipeCard: React.FC<RecipeCardProps> = ({ recipe, onView, onToggleFavorite, onDelete }) => {
  return (
    <Card hover className="animate-fade-in">
      <CardContent className="space-y-4 pt-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="text-xl font-bold text-gray-900 mb-2">{recipe.title}</h3>
            <div className="flex flex-wrap gap-2">
              {recipe.cuisine_type && (
                <Badge variant="info">{recipe.cuisine_type}</Badge>
              )}
              {recipe.difficulty && (
                <Badge variant="default">{recipe.difficulty}</Badge>
              )}
              {recipe.generated_by_ai && (
                <Badge variant="success">AI Generated</Badge>
              )}
            </div>
          </div>
          
          <button
            onClick={() => onToggleFavorite(recipe)}
            className="ml-2"
          >
            <Heart
              className={`w-6 h-6 transition-colors ${
                recipe.is_favorite
                  ? 'fill-red-500 text-red-500'
                  : 'text-gray-400 hover:text-red-500'
              }`}
            />
          </button>
        </div>
        
        <div className="flex items-center space-x-4 text-sm text-gray-600">
          {recipe.cooking_time && (
            <div className="flex items-center space-x-1">
              <Clock className="w-4 h-4" />
              <span>{recipe.cooking_time} min</span>
            </div>
          )}
          
          {recipe.servings && (
            <div className="flex items-center space-x-1">
              <Users className="w-4 h-4" />
              <span>{recipe.servings} servings</span>
            </div>
          )}
          
          <div className="flex items-center space-x-1">
            <ChefHat className="w-4 h-4" />
            <span>{recipe.ingredients.length} ingredients</span>
          </div>
        </div>
        
        <p className="text-sm text-gray-600">
          Created {formatRelativeTime(recipe.created_at)}
        </p>
      </CardContent>
      
      <CardFooter className="flex space-x-2">
        <Button
          variant="primary"
          size="sm"
          onClick={() => onView(recipe)}
          className="flex-1"
        >
          View Recipe
        </Button>
        
        {onDelete && (
          <Button
            variant="danger"
            size="sm"
            onClick={() => onDelete(recipe.id)}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default RecipeCard;

