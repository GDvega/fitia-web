export enum Gender {
  Male = 'Male',
  Female = 'Female',
  Other = 'Other'
}

export enum ActivityLevel {
  Sedentary = 'Sedentary',
  Light = 'Lightly Active',
  Moderate = 'Moderately Active',
  Very = 'Very Active'
}

export enum Goal {
  LoseWeight = 'Lose Weight',
  Maintain = 'Maintain Weight',
  GainMuscle = 'Gain Muscle'
}

export enum DietType {
  Balanced = 'Balanced',
  HighProtein = 'High Protein',
  LowCarb = 'Low Carb',
  Keto = 'Keto',
  LowFat = 'Low Fat',
  Vegan = 'Vegan'
}

export enum VarietyLevel {
  High = 'High',
  Medium = 'Medium',
  Low = 'Low'
}

export enum PreparationStyle {
  Recipes = 'Recipes',
  Ingredients = 'Ingredients'
}

export enum PlanningMode {
  Custom = 'Custom',
  Automatic = 'Automatic'
}

export enum WeightLossSpeed {
  Recommended = 'Recommended',
  Fast = 'Fast',
  Slow = 'Slow'
}

export interface UserProfile {
  // Basic Stats
  name: string;
  age: number;
  height: number; // cm
  weight: number; // kg
  targetWeight: number; // kg
  gender: Gender;
  activityLevel: ActivityLevel;
  isOnboardingComplete?: boolean;
  country?: string;
  region?: string;
  goal: Goal;
  weightLossSpeed: WeightLossSpeed;

  // Nutrition Preferences
  dietType: DietType;
  mealsPerDay: string[]; // ['Breakfast', 'Lunch', 'Dinner', 'Snack1']
  preparationStyle: PreparationStyle;
  varietyLevel: VarietyLevel;
  availableFoods: string[]; // List of ingredient IDs or names
  planningMode: PlanningMode;
}

export interface Meal {
  id: string;
  name: string;
  calories: number;
  protein: number; // g
  carbs: number; // g
  fats: number; // g
  image: string;
  type: 'Breakfast' | 'Lunch' | 'Dinner' | 'Snack';
  ingredients?: string[];
  prepTime?: string;
}

export interface DayPlan {
  day: string; // "Monday", "Tuesday", etc.
  meals: Meal[];
  totalCalories: number;
  targetCalories: number;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}

export interface ChatResponse {
  intent: 'CHANGE_MEAL' | 'QUESTION';
  entities: {
    meal_type?: string;
    food_keywords?: string[];
  };
  message: string;
}