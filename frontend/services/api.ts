import axios from 'axios';
import { UserProfile, Goal, ActivityLevel, DayPlan, Gender, DietType, PreparationStyle, VarietyLevel, PlanningMode } from '../types';

// Use environment variable for API URL (Production) or fallback to relative (Dev/Proxy)
const API_URL = import.meta.env.VITE_API_URL || '/api/v1';

console.log("🔌 Connected to API:", API_URL); // Debug for Cloud Run logs

const api = axios.create({
    baseURL: API_URL,
});

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            // Token expired or invalid
            localStorage.removeItem('token');
            localStorage.removeItem('fitia_user_store'); // Clear persisted store
            window.location.href = '/#/login'; // Force redirect using HashRouter format
        }
        return Promise.reject(error);
    }
);

// Mappers
const GOAL_MAPPING: Record<Goal, string> = {
    [Goal.LoseWeight]: "Lose Weight",
    [Goal.Maintain]: "Maintain Weight",
    [Goal.GainMuscle]: "Gain Muscle"
};

const ACTIVITY_MAPPING: Record<ActivityLevel, string> = {
    [ActivityLevel.Sedentary]: "Sedentary",
    [ActivityLevel.Light]: "Lightly Active",
    [ActivityLevel.Moderate]: "Moderately Active",
    [ActivityLevel.Very]: "Very Active"
};

const GENDER_MAPPING: Record<Gender, string> = {
    [Gender.Male]: "Male",
    [Gender.Female]: "Female",
    [Gender.Other]: "Other"
};

const DIET_MAPPING: Record<DietType, string> = {
    [DietType.Balanced]: "Balanced",
    [DietType.HighProtein]: "High Protein",
    [DietType.LowCarb]: "Low Carb",
    [DietType.Keto]: "Keto",
    [DietType.LowFat]: "Low Fat",
    [DietType.Vegan]: "Vegan"
};

const PREP_STYLE_MAPPING: Record<PreparationStyle, string> = {
    [PreparationStyle.Recipes]: "Recipes",
    [PreparationStyle.Ingredients]: "Ingredients"
};

const VARIETY_MAPPING: Record<VarietyLevel, string> = {
    [VarietyLevel.High]: "High",
    [VarietyLevel.Medium]: "Medium",
    [VarietyLevel.Low]: "Low"
};

const PLANNING_MODE_MAPPING: Record<PlanningMode, string> = {
    [PlanningMode.Automatic]: "Automatic",
    [PlanningMode.Custom]: "Custom"
};

const REVERSE_GENDER_MAPPING: Record<string, Gender> = {
    "Male": Gender.Male,
    "Female": Gender.Female,
    "Other": Gender.Other
};

const REVERSE_GOAL_MAPPING: Record<string, Goal> = {
    "Lose Weight": Goal.LoseWeight,
    "Maintain Weight": Goal.Maintain,
    "Gain Muscle": Goal.GainMuscle
};

const REVERSE_ACTIVITY_MAPPING: Record<string, ActivityLevel> = {
    "Sedentary": ActivityLevel.Sedentary,
    "Lightly Active": ActivityLevel.Light,
    "Moderately Active": ActivityLevel.Moderate,
    "Very Active": ActivityLevel.Very
};

const REVERSE_DIET_MAPPING: Record<string, DietType> = {
    "Balanced": DietType.Balanced,
    "High Protein": DietType.HighProtein,
    "Low Carb": DietType.LowCarb,
    "Keto": DietType.Keto,
    "Low Fat": DietType.LowFat,
    "Vegan": DietType.Vegan
};

const REVERSE_PREP_STYLE_MAPPING: Record<string, PreparationStyle> = {
    "Recipes": PreparationStyle.Recipes,
    "Ingredients": PreparationStyle.Ingredients
};

const REVERSE_VARIETY_MAPPING: Record<string, VarietyLevel> = {
    "High": VarietyLevel.High,
    "Medium": VarietyLevel.Medium,
    "Low": VarietyLevel.Low
};

const REVERSE_PLANNING_MODE_MAPPING: Record<string, PlanningMode> = {
    "Automatic": PlanningMode.Automatic,
    "Custom": PlanningMode.Custom
};

// ... (Helper for images omitted for brevity in tool call, kept in file) ...
// Helper for images (Mock)
const getMockImage = (type: string) => {
    const images: Record<string, string> = {
        'Breakfast': 'https://images.unsplash.com/photo-1525351484163-7529414395d8?auto=format&fit=crop&q=80&w=800',
        'Lunch': 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=800',
        'Dinner': 'https://images.unsplash.com/photo-1467003909585-2f8a7270028d?auto=format&fit=crop&q=80&w=800',
        'Snack': 'https://images.unsplash.com/photo-1488477181946-6428a029177b?auto=format&fit=crop&q=80&w=800',
    };
    return images[type] || images['Breakfast'];
};

// Mapper: Backend Plan -> Frontend DayPlan
const mapBackendPlanToFrontend = (backendPlan: any[]): DayPlan[] => {
    return backendPlan.map((day: any) => ({
        day: day.day,
        totalCalories: day.total_calories,
        targetCalories: day.target_calories,
        meals: day.meals.map((meal: any) => ({
            id: meal.recipe_id || meal.id, // Fallback to meal.id if recipe_id missing
            name: meal.name,
            calories: meal.calories,
            type: meal.meal_type,
            protein: meal.protein || Math.floor(meal.calories * 0.25 / 4),
            carbs: meal.carbs || Math.floor(meal.calories * 0.45 / 4),
            fats: meal.fats || Math.floor(meal.calories * 0.30 / 9),
            image: meal.image || getMockImage(meal.meal_type),
            prepTime: meal.prepTime || '15',
            ingredients: meal.ingredients || []
        }))
    }));
};


export const registerUser = async (profile: UserProfile): Promise<string> => {
    const payload = {
        name: profile.name,
        age: profile.age,
        weight: profile.weight,
        height: profile.height,
        gender: GENDER_MAPPING[profile.gender],
        goal: GOAL_MAPPING[profile.goal],
        activity_level: ACTIVITY_MAPPING[profile.activityLevel],
        diet_type: DIET_MAPPING[profile.dietType],
        foods_like: profile.availableFoods,
        meals_per_day: profile.mealsPerDay,
        preparation_style: PREP_STYLE_MAPPING[profile.preparationStyle],
        variety_level: VARIETY_MAPPING[profile.varietyLevel],
        planning_mode: PLANNING_MODE_MAPPING[profile.planningMode]
    };

    const response = await api.post('/users/', payload);
    return response.data.id;
};


export const updateUser = async (userId: string, profile: Partial<UserProfile>): Promise<void> => {
    // Map Frontend Enums -> Backend Strings
    const payload: any = { ...profile };

    if (profile.gender) payload.gender = GENDER_MAPPING[profile.gender];
    if (profile.goal) payload.goal = GOAL_MAPPING[profile.goal];
    if (profile.activityLevel) payload.activity_level = ACTIVITY_MAPPING[profile.activityLevel];
    if (profile.dietType) payload.diet_type = DIET_MAPPING[profile.dietType];
    if (profile.availableFoods) payload.foods_like = profile.availableFoods;
    if (profile.mealsPerDay) payload.meals_per_day = profile.mealsPerDay;
    if (profile.preparationStyle) payload.preparation_style = PREP_STYLE_MAPPING[profile.preparationStyle];
    if (profile.varietyLevel) payload.variety_level = VARIETY_MAPPING[profile.varietyLevel];
    if (profile.planningMode) payload.planning_mode = PLANNING_MODE_MAPPING[profile.planningMode];
    if (profile.isOnboardingComplete !== undefined) payload.is_onboarding_complete = profile.isOnboardingComplete;

    // Ensure numeric types
    if (profile.age) payload.age = Number(profile.age);
    if (profile.weight) payload.weight = Number(profile.weight);
    if (profile.height) payload.height = Number(profile.height);

    await api.put(`/users/${userId}`, payload);
};

export const generatePlan = async (userId: string): Promise<DayPlan[]> => {
    const response = await api.post(`/plans/generate?user_id=${userId}`);
    return mapBackendPlanToFrontend(response.data.summary.plan);
};

export const fetchCurrentPlan = async (userId: string): Promise<DayPlan[]> => {
    try {
        const response = await api.get(`/plans/latest?user_id=${userId}`);
        return mapBackendPlanToFrontend(response.data.summary.plan);
    } catch (e: any) {
        if (e.response && e.response.status === 404) {
            // Expected for new users
            return [];
        }
        // console.error("Failed to load current plan:", e);
        throw e;
    }
};

export const getUserProfile = async (userId: string): Promise<Partial<UserProfile>> => {
    const response = await api.get(`/users/${userId}`);
    const data = response.data;

    // Reverse map enums
    return {
        gender: REVERSE_GENDER_MAPPING[data.gender] || data.gender,
        goal: REVERSE_GOAL_MAPPING[data.goal] || data.goal,
        activityLevel: REVERSE_ACTIVITY_MAPPING[data.activity_level] || data.activity_level,
        dietType: REVERSE_DIET_MAPPING[data.diet_type] || data.diet_type,
        availableFoods: data.foods_like,
        mealsPerDay: data.meals_per_day,
        preparationStyle: REVERSE_PREP_STYLE_MAPPING[data.preparation_style] || data.preparation_style,
        varietyLevel: REVERSE_VARIETY_MAPPING[data.variety_level] || data.variety_level,
        planningMode: REVERSE_PLANNING_MODE_MAPPING[data.planning_mode] || data.planning_mode,
        isOnboardingComplete: data.is_onboarding_complete,
    };
};


export const sendChatMessage = async (userId: string, message: string): Promise<{ intent: string, message: string }> => {
    const response = await api.post('/chat/', { user_id: userId, message });
    return response.data;
};

export default api;
