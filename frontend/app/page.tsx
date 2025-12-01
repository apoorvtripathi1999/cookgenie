'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AlertCircle, Package, ChefHat, Heart, TrendingUp, Plus, Sparkles } from 'lucide-react';
import Card, { CardHeader, CardContent } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import { profileAPI, inventoryAPI, recipeAPI } from '@/lib/api';
import { Profile, ExpiryAlert } from '@/lib/types';
import toast from 'react-hot-toast';

export default function DashboardPage() {
  const router = useRouter();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [expiryAlerts, setExpiryAlerts] = useState<ExpiryAlert[]>([]);
  const [inventoryCount, setInventoryCount] = useState(0);
  const [recipeCount, setRecipeCount] = useState(0);
  const [favoriteCount, setFavoriteCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      // Get or create default profile
      const profilesRes = await profileAPI.getAll();
      let currentProfile = profilesRes.data[0];
      
      if (!currentProfile) {
        const newProfile = await profileAPI.create({ name: 'Default User' });
        currentProfile = newProfile.data;
      }
      
      setProfile(currentProfile);

      // Load dashboard stats
      const [inventoryRes, recipesRes, favoritesRes, alertsRes] = await Promise.all([
        inventoryAPI.getByProfile(currentProfile.id),
        recipeAPI.getByProfile(currentProfile.id, 10),
        recipeAPI.getFavorites(currentProfile.id),
        inventoryAPI.getExpiryAlerts(currentProfile.id),
      ]);

      setInventoryCount(inventoryRes.data.length);
      setRecipeCount(recipesRes.data.length);
      setFavoriteCount(favoritesRes.data.length);
      setExpiryAlerts(alertsRes.data);
      
      setLoading(false);
    } catch (error) {
      console.error('Error loading dashboard:', error);
      toast.error('Failed to load dashboard data');
      setLoading(false);
    }
  };

  const handleGenerateRecipe = () => {
    router.push('/recipes?generate=true');
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
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Welcome back, {profile?.name}!
        </h1>
        <p className="text-gray-600">Here's what's cooking in your kitchen</p>
      </div>

      {/* Expiry Alerts */}
      {expiryAlerts.length > 0 && (
        <Card className="mb-6 border-l-4 border-l-orange-500 animate-slide-up">
          <CardHeader>
            <div className="flex items-center space-x-2">
              <AlertCircle className="w-5 h-5 text-orange-600" />
              <h2 className="text-lg font-semibold text-gray-900">Expiry Alerts</h2>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {expiryAlerts.slice(0, 5).map((alert: ExpiryAlert) => (
                <div
                  key={alert.item.id}
                  className="flex items-center justify-between p-3 bg-orange-50 rounded-lg"
                >
                  <div>
                    <p className="font-medium text-gray-900">{alert.item.name}</p>
                    <p className="text-sm text-gray-600">
                      {alert.status === 'expired'
                        ? 'Expired'
                        : `Expires in ${Math.abs(alert.days_until_expiry)} day${
                            Math.abs(alert.days_until_expiry) !== 1 ? 's' : ''
                          }`}
                    </p>
                  </div>
                  <Badge variant="warning">{alert.status.replace('_', ' ')}</Badge>
                </div>
              ))}
            </div>
            {expiryAlerts.length > 5 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.push('/inventory')}
                className="mt-3 w-full"
              >
                View all alerts
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="cursor-pointer" onClick={() => router.push('/inventory')}>
          <Card hover>
            <CardContent className="flex items-center space-x-4 pt-6">
              <div className="bg-blue-100 p-3 rounded-lg">
                <Package className="w-8 h-8 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Inventory Items</p>
                <p className="text-2xl font-bold text-gray-900">{inventoryCount}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="cursor-pointer" onClick={() => router.push('/recipes')}>
          <Card hover>
            <CardContent className="flex items-center space-x-4 pt-6">
              <div className="bg-green-100 p-3 rounded-lg">
                <ChefHat className="w-8 h-8 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Recipes</p>
                <p className="text-2xl font-bold text-gray-900">{recipeCount}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="cursor-pointer" onClick={() => router.push('/favorites')}>
          <Card hover>
            <CardContent className="flex items-center space-x-4 pt-6">
              <div className="bg-red-100 p-3 rounded-lg">
                <Heart className="w-8 h-8 text-red-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Favorite Recipes</p>
                <p className="text-2xl font-bold text-gray-900">{favoriteCount}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-gradient-to-br from-primary-500 to-primary-700 text-white">
          <CardContent className="pt-6 pb-6">
            <Sparkles className="w-12 h-12 mb-4" />
            <h3 className="text-2xl font-bold mb-2">Generate a Recipe</h3>
            <p className="text-primary-100 mb-4">
              Let AI create a delicious recipe based on your available ingredients
            </p>
            <Button
              variant="secondary"
              onClick={handleGenerateRecipe}
              className="bg-white text-primary-700 hover:bg-gray-100"
            >
              <ChefHat className="w-5 h-5 mr-2" />
              Generate Recipe
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-secondary-500 to-secondary-700 text-white">
          <CardContent className="pt-6 pb-6">
            <Plus className="w-12 h-12 mb-4" />
            <h3 className="text-2xl font-bold mb-2">Manage Inventory</h3>
            <p className="text-secondary-100 mb-4">
              Add and track your kitchen ingredients and get expiry alerts
            </p>
            <Button
              variant="primary"
              onClick={() => router.push('/inventory')}
              className="bg-white text-secondary-700 hover:bg-gray-100"
            >
              <Package className="w-5 h-5 mr-2" />
              Manage Inventory
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

