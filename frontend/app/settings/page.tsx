'use client';

import React, { useState, useEffect } from 'react';
import { User, Settings as SettingsIcon, Save } from 'lucide-react';
import Card, { CardHeader, CardContent } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Badge from '@/components/ui/Badge';
import { profileAPI, preferenceAPI } from '@/lib/api';
import { Profile, UserPreference } from '@/lib/types';
import toast from 'react-hot-toast';

export default function SettingsPage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [preferences, setPreferences] = useState<UserPreference | null>(null);
  const [loading, setLoading] = useState(true);

  const [profileForm, setProfileForm] = useState({
    name: '',
    email: '',
  });

  const [preferenceForm, setPreferenceForm] = useState({
    dietary_restrictions: [] as string[],
    preferred_cuisines: [] as string[],
    disliked_ingredients: [] as string[],
    available_utensils: [] as string[],
    max_cooking_time: '',
    skill_level: 'intermediate',
  });

  const [newTag, setNewTag] = useState({
    dietary: '',
    cuisine: '',
    disliked: '',
    utensil: '',
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
      setProfileForm({
        name: currentProfile.name,
        email: currentProfile.email || '',
      });

      // Load preferences
      try {
        const prefRes = await preferenceAPI.get(currentProfile.id);
        setPreferences(prefRes.data);
        setPreferenceForm({
          dietary_restrictions: prefRes.data.dietary_restrictions || [],
          preferred_cuisines: prefRes.data.preferred_cuisines || [],
          disliked_ingredients: prefRes.data.disliked_ingredients || [],
          available_utensils: prefRes.data.available_utensils || [],
          max_cooking_time: prefRes.data.max_cooking_time?.toString() || '',
          skill_level: prefRes.data.skill_level || 'intermediate',
        });
      } catch (error) {
        // Preferences not set yet
      }
      
      setLoading(false);
    } catch (error) {
      console.error('Error loading data:', error);
      toast.error('Failed to load settings');
      setLoading(false);
    }
  };

  const handleUpdateProfile = async () => {
    if (!profile) return;

    try {
      await profileAPI.update(profile.id, profileForm);
      toast.success('Profile updated successfully!');
      loadData();
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    }
  };

  const handleUpdatePreferences = async () => {
    if (!profile) return;

    try {
      const data = {
        ...preferenceForm,
        max_cooking_time: preferenceForm.max_cooking_time ? parseInt(preferenceForm.max_cooking_time) : null,
      };

      if (preferences) {
        await preferenceAPI.update(profile.id, data);
      } else {
        await preferenceAPI.create({ profile_id: profile.id, ...data });
      }
      
      toast.success('Preferences updated successfully!');
      loadData();
    } catch (error) {
      console.error('Error updating preferences:', error);
      toast.error('Failed to update preferences');
    }
  };

  const addTag = (type: 'dietary' | 'cuisine' | 'disliked' | 'utensil') => {
    const value = newTag[type].trim();
    if (!value) return;

    const fieldMap = {
      dietary: 'dietary_restrictions',
      cuisine: 'preferred_cuisines',
      disliked: 'disliked_ingredients',
      utensil: 'available_utensils',
    };

    const field = fieldMap[type] as keyof typeof preferenceForm;
    const current = preferenceForm[field] as string[];
    
    if (!current.includes(value)) {
      setPreferenceForm({
        ...preferenceForm,
        [field]: [...current, value],
      });
      setNewTag({ ...newTag, [type]: '' });
    }
  };

  const removeTag = (type: keyof typeof preferenceForm, value: string) => {
    const current = preferenceForm[type] as string[];
    setPreferenceForm({
      ...preferenceForm,
      [type]: current.filter((item: string) => item !== value),
    });
  };

  const skillOptions = [
    { value: 'beginner', label: 'Beginner' },
    { value: 'intermediate', label: 'Intermediate' },
    { value: 'advanced', label: 'Advanced' },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600 mt-1">Manage your profile and preferences</p>
      </div>

      {/* Profile Settings */}
      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-center space-x-2">
            <User className="w-5 h-5" />
            <h2 className="text-xl font-semibold">Profile Information</h2>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            label="Name"
            value={profileForm.name}
            onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
          />
          <Input
            label="Email (Optional)"
            type="email"
            value={profileForm.email}
            onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
          />
          <Button variant="primary" onClick={handleUpdateProfile}>
            <Save className="w-4 h-4 mr-2" />
            Save Profile
          </Button>
        </CardContent>
      </Card>

      {/* Cooking Preferences */}
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-2">
            <SettingsIcon className="w-5 h-5" />
            <h2 className="text-xl font-semibold">Cooking Preferences</h2>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Dietary Restrictions */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Dietary Restrictions
            </label>
            <div className="flex gap-2 mb-2">
              <Input
                placeholder="e.g., Vegan, Gluten-free"
                value={newTag.dietary}
                onChange={(e) => setNewTag({ ...newTag, dietary: e.target.value })}
                onKeyPress={(e) => e.key === 'Enter' && addTag('dietary')}
              />
              <Button variant="secondary" onClick={() => addTag('dietary')}>
                Add
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {preferenceForm.dietary_restrictions.map((item: string) => (
                <Badge key={item} variant="default">
                  {item}
                  <button
                    onClick={() => removeTag('dietary_restrictions', item)}
                    className="ml-2 text-gray-600 hover:text-gray-900"
                  >
                    ×
                  </button>
                </Badge>
              ))}
            </div>
          </div>

          {/* Preferred Cuisines */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Preferred Cuisines
            </label>
            <div className="flex gap-2 mb-2">
              <Input
                placeholder="e.g., Italian, Mexican"
                value={newTag.cuisine}
                onChange={(e) => setNewTag({ ...newTag, cuisine: e.target.value })}
                onKeyPress={(e) => e.key === 'Enter' && addTag('cuisine')}
              />
              <Button variant="secondary" onClick={() => addTag('cuisine')}>
                Add
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {preferenceForm.preferred_cuisines.map((item: string) => (
                <Badge key={item} variant="info">
                  {item}
                  <button
                    onClick={() => removeTag('preferred_cuisines', item)}
                    className="ml-2 text-blue-600 hover:text-blue-900"
                  >
                    ×
                  </button>
                </Badge>
              ))}
            </div>
          </div>

          {/* Disliked Ingredients */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Disliked Ingredients
            </label>
            <div className="flex gap-2 mb-2">
              <Input
                placeholder="e.g., Mushrooms, Cilantro"
                value={newTag.disliked}
                onChange={(e) => setNewTag({ ...newTag, disliked: e.target.value })}
                onKeyPress={(e) => e.key === 'Enter' && addTag('disliked')}
              />
              <Button variant="secondary" onClick={() => addTag('disliked')}>
                Add
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {preferenceForm.disliked_ingredients.map((item: string) => (
                <Badge key={item} variant="danger">
                  {item}
                  <button
                    onClick={() => removeTag('disliked_ingredients', item)}
                    className="ml-2 text-red-600 hover:text-red-900"
                  >
                    ×
                  </button>
                </Badge>
              ))}
            </div>
          </div>

          {/* Available Utensils */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Available Kitchen Tools
            </label>
            <div className="flex gap-2 mb-2">
              <Input
                placeholder="e.g., Oven, Air Fryer, Blender"
                value={newTag.utensil}
                onChange={(e) => setNewTag({ ...newTag, utensil: e.target.value })}
                onKeyPress={(e) => e.key === 'Enter' && addTag('utensil')}
              />
              <Button variant="secondary" onClick={() => addTag('utensil')}>
                Add
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {preferenceForm.available_utensils.map((item: string) => (
                <Badge key={item} variant="success">
                  {item}
                  <button
                    onClick={() => removeTag('available_utensils', item)}
                    className="ml-2 text-green-600 hover:text-green-900"
                  >
                    ×
                  </button>
                </Badge>
              ))}
            </div>
          </div>

          {/* Other Preferences */}
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Max Cooking Time (minutes)"
              type="number"
              placeholder="e.g., 45"
              value={preferenceForm.max_cooking_time}
              onChange={(e) =>
                setPreferenceForm({ ...preferenceForm, max_cooking_time: e.target.value })
              }
            />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Skill Level
              </label>
              <select
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                value={preferenceForm.skill_level}
                onChange={(e) =>
                  setPreferenceForm({ ...preferenceForm, skill_level: e.target.value })
                }
              >
                {skillOptions.map((option: string) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <Button variant="primary" onClick={handleUpdatePreferences}>
            <Save className="w-4 h-4 mr-2" />
            Save Preferences
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

