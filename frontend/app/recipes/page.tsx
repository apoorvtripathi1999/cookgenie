'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Sparkles } from 'lucide-react';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import RecipeCard from '@/components/recipe/RecipeCard';
import RecipeDetail from '@/components/recipe/RecipeDetail';
import Card, { CardContent } from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import { profileAPI, recipeAPI, inventoryAPI, preferenceAPI } from '@/lib/api';
import { Recipe, Profile, UserPreference } from '@/lib/types';
import toast from 'react-hot-toast';

export default function RecipesPage() {
  const searchParams = useSearchParams();
  const shouldGenerate = searchParams.get('generate') === 'true';

  const [profile, setProfile] = useState<Profile | null>(null);
  const [preferences, setPreferences] = useState<UserPreference | null>(null);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [isGenerateModalOpen, setIsGenerateModalOpen] = useState(shouldGenerate);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);

  const [generateForm, setGenerateForm] = useState({
    cuisine_type: '',
    max_cooking_time: '',
    servings: '2',
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const profilesRes = await profileAPI.getAll();
      let currentProfile = profilesRes.data[0];
      
      if (!currentProfile) {
        const newProfile = await profileAPI.create({ name: 'Default User' });
        currentProfile = newProfile.data;
      }
      
      setProfile(currentProfile);

      // Load preferences
      try {
        const prefRes = await preferenceAPI.get(currentProfile.id);
        setPreferences(prefRes.data);
      } catch (error) {
        // Preferences not set yet
      }

      // Load recipes
      const recipesRes = await recipeAPI.getByProfile(currentProfile.id);
      setRecipes(recipesRes.data);
      
      setLoading(false);
    } catch (error) {
      console.error('Error loading data:', error);
      toast.error('Failed to load recipes');
      setLoading(false);
    }
  };

  const handleGenerateRecipe = async () => {
    if (!profile) return;

    setGenerating(true);
    try {
      // Get available ingredients
      const inventoryRes = await inventoryAPI.getByProfile(profile.id);
      const ingredients = inventoryRes.data
        .filter((item: any) => item.quantity > 0)
        .map((item: any) => item.name);

      if (ingredients.length === 0) {
        toast.error('Please add some ingredients to your inventory first!');
        setGenerating(false);
        return;
      }

      const requestData = {
        profile_id: profile.id,
        ingredients,
        cuisine_type: generateForm.cuisine_type || undefined,
        max_cooking_time: generateForm.max_cooking_time ? parseInt(generateForm.max_cooking_time) : undefined,
        servings: parseInt(generateForm.servings),
        dietary_preferences: preferences?.dietary_restrictions,
        available_utensils: preferences?.available_utensils,
      };

      const response = await recipeAPI.generate(requestData);
      toast.success('Recipe generated successfully!');
      setIsGenerateModalOpen(false);
      loadData();
      
      // Show the generated recipe
      setSelectedRecipe(response.data);
      setIsViewModalOpen(true);
    } catch (error: any) {
      console.error('Error generating recipe:', error);
      toast.error(error.response?.data?.detail || 'Failed to generate recipe. Please check your Gemini API key.');
    } finally {
      setGenerating(false);
    }
  };

  const handleViewRecipe = (recipe: Recipe) => {
    setSelectedRecipe(recipe);
    setIsViewModalOpen(true);
  };

  const handleToggleFavorite = async (recipe: Recipe) => {
    if (!profile) return;

    try {
      if (recipe.is_favorite) {
        await recipeAPI.removeFromFavorites(profile.id, recipe.id);
        toast.success('Removed from favorites');
      } else {
        await recipeAPI.addToFavorites({
          profile_id: profile.id,
          recipe_id: recipe.id,
        });
        toast.success('Added to favorites!');
      }
      loadData();
    } catch (error) {
      console.error('Error toggling favorite:', error);
      toast.error('Failed to update favorite');
    }
  };

  const handleDeleteRecipe = async (id: number) => {
    if (!confirm('Are you sure you want to delete this recipe?')) return;

    try {
      await recipeAPI.delete(id);
      toast.success('Recipe deleted successfully!');
      loadData();
    } catch (error) {
      console.error('Error deleting recipe:', error);
      toast.error('Failed to delete recipe');
    }
  };

  const cuisineOptions = [
    { value: '', label: 'Any Cuisine' },
    { value: 'Indian', label: 'Indian' },
    { value: 'Italian', label: 'Italian' },
    { value: 'Mexican', label: 'Mexican' },
    { value: 'Chinese', label: 'Chinese' },
    { value: 'Japanese', label: 'Japanese' },
    { value: 'Mediterranean', label: 'Mediterranean' },
    { value: 'American', label: 'American' },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Recipes</h1>
          <p className="text-gray-600 mt-1">Your AI-generated recipe collection</p>
        </div>
        <Button variant="primary" onClick={() => setIsGenerateModalOpen(true)}>
          <Sparkles className="w-5 h-5 mr-2" />
          Generate Recipe
        </Button>
      </div>

      {recipes.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent>
            <Sparkles className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No recipes yet</h3>
            <p className="text-gray-600 mb-4">Generate your first AI-powered recipe!</p>
            <Button variant="primary" onClick={() => setIsGenerateModalOpen(true)}>
              <Sparkles className="w-5 h-5 mr-2" />
              Generate Recipe
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recipes.map((recipe: Recipe) => (
            <RecipeCard
              key={recipe.id}
              recipe={recipe}
              onView={handleViewRecipe}
              onToggleFavorite={handleToggleFavorite}
              onDelete={handleDeleteRecipe}
            />
          ))}
        </div>
      )}

      {/* Generate Recipe Modal */}
      <Modal
        isOpen={isGenerateModalOpen}
        onClose={() => setIsGenerateModalOpen(false)}
        title="Generate Recipe with AI"
        size="md"
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            CookGenie will create a recipe based on your available ingredients and preferences.
          </p>

          <Select
            label="Cuisine Type"
            options={cuisineOptions}
            value={generateForm.cuisine_type}
            onChange={(e) => setGenerateForm({ ...generateForm, cuisine_type: e.target.value })}
          />

          <Input
            label="Max Cooking Time (minutes)"
            type="number"
            placeholder="e.g., 30"
            value={generateForm.max_cooking_time}
            onChange={(e) => setGenerateForm({ ...generateForm, max_cooking_time: e.target.value })}
          />

          <Input
            label="Servings"
            type="number"
            value={generateForm.servings}
            onChange={(e) => setGenerateForm({ ...generateForm, servings: e.target.value })}
            required
          />

          <div className="flex space-x-3 pt-4">
            <Button
              variant="primary"
              onClick={handleGenerateRecipe}
              isLoading={generating}
              className="flex-1"
            >
              {generating ? 'Generating...' : 'Generate Recipe'}
            </Button>
            <Button
              variant="ghost"
              onClick={() => setIsGenerateModalOpen(false)}
              disabled={generating}
              className="flex-1"
            >
              Cancel
            </Button>
          </div>
        </div>
      </Modal>

      {/* View Recipe Modal */}
      <Modal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        title=""
        size="xl"
      >
        {selectedRecipe && <RecipeDetail recipe={selectedRecipe} />}
      </Modal>
    </div>
  );
}

