'use client';

import React, { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';
import Modal from '@/components/ui/Modal';
import Card, { CardContent } from '@/components/ui/Card';
import RecipeCard from '@/components/recipe/RecipeCard';
import RecipeDetail from '@/components/recipe/RecipeDetail';
import { profileAPI, recipeAPI } from '@/lib/api';
import { Recipe, Profile, RecipeFavorite } from '@/lib/types';
import toast from 'react-hot-toast';

export default function FavoritesPage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [favorites, setFavorites] = useState<RecipeFavorite[]>([]);
  const [loading, setLoading] = useState(true);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);

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

      const favoritesRes = await recipeAPI.getFavorites(currentProfile.id);
      setFavorites(favoritesRes.data);
      
      setLoading(false);
    } catch (error) {
      console.error('Error loading favorites:', error);
      toast.error('Failed to load favorites');
      setLoading(false);
    }
  };

  const handleViewRecipe = (recipe: Recipe) => {
    setSelectedRecipe(recipe);
    setIsViewModalOpen(true);
  };

  const handleToggleFavorite = async (recipe: Recipe) => {
    if (!profile) return;

    try {
      await recipeAPI.removeFromFavorites(profile.id, recipe.id);
      toast.success('Removed from favorites');
      loadData();
    } catch (error) {
      console.error('Error removing favorite:', error);
      toast.error('Failed to remove from favorites');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Favorite Recipes</h1>
        <p className="text-gray-600 mt-1">Your saved and loved recipes</p>
      </div>

      {favorites.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent>
            <Heart className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No favorites yet</h3>
            <p className="text-gray-600">
              Start adding recipes to your favorites to see them here!
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {favorites.map((favorite) => (
            <RecipeCard
              key={favorite.id}
              recipe={{ ...favorite.recipe, is_favorite: true }}
              onView={handleViewRecipe}
              onToggleFavorite={handleToggleFavorite}
            />
          ))}
        </div>
      )}

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

