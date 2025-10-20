export interface Profile {
  id: number;
  name: string;
  email?: string;
  avatar?: string;
  created_at: string;
  updated_at: string;
}

export enum UnitType {
  GRAM = 'gram',
  KILOGRAM = 'kilogram',
  LITER = 'liter',
  MILLILITER = 'milliliter',
  PIECE = 'piece',
  CUP = 'cup',
  TABLESPOON = 'tablespoon',
  TEASPOON = 'teaspoon',
}

export interface InventoryItem {
  id: number;
  profile_id: number;
  name: string;
  quantity: number;
  unit: UnitType;
  category?: string;
  expiry_date?: string;
  purchase_date?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface ExpiryAlert {
  item: InventoryItem;
  days_until_expiry: number;
  status: 'expired' | 'expiring_soon' | 'expiring_this_week';
}

export interface Recipe {
  id: number;
  profile_id: number;
  title: string;
  cuisine_type?: string;
  cooking_time?: number;
  difficulty?: string;
  servings?: number;
  ingredients: Array<{
    name: string;
    quantity: string;
    unit: string;
  }>;
  instructions: string;
  utensils_required?: string[];
  nutritional_info?: {
    calories?: string;
    protein?: string;
    carbs?: string;
    fat?: string;
  };
  image_url?: string;
  generated_by_ai: boolean;
  created_at: string;
  is_favorite?: boolean;
}

export interface RecipeFavorite {
  id: number;
  profile_id: number;
  recipe_id: number;
  notes?: string;
  created_at: string;
  recipe: Recipe;
}

export interface UserPreference {
  id: number;
  profile_id: number;
  dietary_restrictions?: string[];
  preferred_cuisines?: string[];
  disliked_ingredients?: string[];
  available_utensils?: string[];
  max_cooking_time?: number;
  skill_level?: string;
  created_at: string;
  updated_at: string;
}

export interface RecipeGenerateRequest {
  profile_id: number;
  ingredients?: string[];
  cuisine_type?: string;
  max_cooking_time?: number;
  dietary_preferences?: string[];
  available_utensils?: string[];
  servings?: number;
}

