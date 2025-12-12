import { describe, it, expect, vi, beforeEach } from 'vitest';
import api, { registerUser, generatePlan, fetchCurrentPlan } from './api';
import { UserProfile, Goal, ActivityLevel, Gender } from '../types';

// Mock axios
vi.mock('axios', () => {
    return {
        default: {
            create: vi.fn(() => ({
                post: vi.fn(),
                get: vi.fn(),
            })),
        }
    };
});

describe('API Service Integration', () => {
    let mockPost: any;
    let mockGet: any;

    beforeEach(() => {
        vi.clearAllMocks();
        // Access the mocked instance from the default export of our module
        // But since we mock axios.create to return an object, we need to grab that object.
        // A simpler way for this environment is to mock the `api` instance methods directly if possible, 
        // but since `api` is exported default from the module we test, we need to mock axios before import.
        // Let's just spy on the exported api instance methods if we can, or rely on the mock factory above.
        // The mock factory returns a new object on create(). We need to capture that or assume api is that object.

        // Actually, since `api` is imported, and it was created via axios.create(), 
        // and axios.create returns the mock object we defined:
        mockPost = api.post;
        mockGet = api.get;
    });

    it('registerUser sends correct payload', async () => {
        const mockProfile: UserProfile = {
            name: 'Test',
            age: 25,
            weight: 70,
            height: 170,
            gender: Gender.Male,
            goal: Goal.LoseWeight,
            activityLevel: ActivityLevel.Moderate,
            // ... other fields ignore
        } as any;

        (mockPost as any).mockResolvedValue({ data: { id: '123' } });

        const id = await registerUser(mockProfile);

        expect(id).toBe('123');
        expect(mockPost).toHaveBeenCalledWith('/users/', expect.objectContaining({
            name: 'Test',
            gender: 'Male',
            goal: 'Lose Weight', // Mapped
            activity_level: 'Moderately Active' // Mapped
        }));
    });

    it('generatePlan maps response correctly', async () => {
        const mockBackendPlan = {
            summary: {
                plan: [
                    {
                        day: 'Monday',
                        total_calories: 2000,
                        target_calories: 2000,
                        meals: [
                            {
                                recipe_id: 'r1',
                                name: 'Meal 1',
                                calories: 500,
                                meal_type: 'Breakfast'
                            }
                        ]
                    }
                ]
            }
        };

        (mockPost as any).mockResolvedValue({ data: mockBackendPlan });

        const plan = await generatePlan('123');

        expect(plan).toHaveLength(1);
        expect(plan[0].totalCalories).toBe(2000); // Mapped from snake_case
        expect(plan[0].meals[0].name).toBe('Meal 1');
        expect(plan[0].meals[0].image).toBeDefined(); // Mock image added
    });
});
