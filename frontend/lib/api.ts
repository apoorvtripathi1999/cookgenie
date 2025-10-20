import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Profile APIs
export const profileAPI = {
  getAll: () => api.get('/api/profiles'),
  getById: (id: number) => api.get(`/api/profiles/${id}`),
  create: (data: any) => api.post('/api/profiles', data),
  update: (id: number, data: any) => api.put(`/api/profiles/${id}`, data),
  delete: (id: number) => api.delete(`/api/profiles/${id}`),
};

// Inventory APIs
export const inventoryAPI = {
  getByProfile: (profileId: number) => api.get(`/api/inventory/profile/${profileId}`),
  getById: (id: number) => api.get(`/api/inventory/${id}`),
  create: (data: any) => api.post('/api/inventory', data),
  update: (id: number, data: any) => api.put(`/api/inventory/${id}`, data),
  delete: (id: number) => api.delete(`/api/inventory/${id}`),
  getExpiryAlerts: (profileId: number) => api.get(`/api/inventory/profile/${profileId}/expiry-alerts`),
  getLowStock: (profileId: number, threshold?: number) => 
    api.get(`/api/inventory/profile/${profileId}/low-stock`, { params: { threshold } }),
};

// Recipe APIs
export const recipeAPI = {
  generate: (data: any) => api.post('/api/recipes/generate', data),
  getByProfile: (profileId: number, limit?: number) => 
    api.get(`/api/recipes/profile/${profileId}`, { params: { limit } }),
  getById: (id: number) => api.get(`/api/recipes/${id}`),
  delete: (id: number) => api.delete(`/api/recipes/${id}`),
  addToFavorites: (data: any) => api.post('/api/recipes/favorites', data),
  removeFromFavorites: (profileId: number, recipeId: number) => 
    api.delete(`/api/recipes/favorites/${profileId}/${recipeId}`),
  getFavorites: (profileId: number) => api.get(`/api/recipes/favorites/profile/${profileId}`),
};

// Preference APIs
export const preferenceAPI = {
  get: (profileId: number) => api.get(`/api/preferences/${profileId}`),
  create: (data: any) => api.post('/api/preferences', data),
  update: (profileId: number, data: any) => api.put(`/api/preferences/${profileId}`, data),
  delete: (profileId: number) => api.delete(`/api/preferences/${profileId}`),
};

