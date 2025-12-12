import { describe, it, expect, vi, beforeEach } from 'vitest';
import { initChatSession, sendMessageToGemini } from '../geminiService';
import { UserProfile, Goal, ActivityLevel, DietType, PreparationStyle, VarietyLevel, PlanningMode, WeightLossSpeed, Gender } from '../../types';

// Mock the @google/genai module
const { mockSendMessage, mockChatsCreate } = vi.hoisted(() => {
    const mockSendMessage = vi.fn();
    const mockChatsCreate = vi.fn(() => ({
        sendMessage: mockSendMessage
    }));
    return { mockSendMessage, mockChatsCreate };
});

vi.mock('@google/genai', () => {
    return {
        GoogleGenAI: class {
            chats = {
                create: mockChatsCreate
            };
            constructor() { }
        }
    };
});

describe('geminiService', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    const mockProfile: UserProfile = {
        name: 'Test User',
        age: 30,
        gender: Gender.Male,
        height: 180,
        weight: 80,
        targetWeight: 75,
        activityLevel: ActivityLevel.Moderate,
        goal: Goal.LoseWeight,
        weightLossSpeed: WeightLossSpeed.Recommended,
        dietType: DietType.Balanced,
        mealsPerDay: ['Breakfast', 'Lunch', 'Dinner'],
        preparationStyle: PreparationStyle.Recipes,
        varietyLevel: VarietyLevel.Medium,
        availableFoods: [],
        planningMode: PlanningMode.Automatic
    };

    it('initChatSession should initialize the chat session with instructions', () => {
        initChatSession(mockProfile, 'en');
        expect(mockChatsCreate).toHaveBeenCalled();
        // We could check if instructions contain the user name
        const calls = mockChatsCreate.mock.calls as any[];
        const callArgs = calls[0][0];
        expect(callArgs.config.systemInstruction).toContain('Test User');
    });

    it('sendMessageToGemini should send message and return response', async () => {
        mockSendMessage.mockResolvedValueOnce({ text: 'Hello form AI' });
        initChatSession(mockProfile, 'en');

        const response = await sendMessageToGemini('Hello');
        expect(mockSendMessage).toHaveBeenCalledWith({ message: 'Hello' });
        expect(response).toBe('Hello form AI');
    });

    it('sendMessageToGemini should handle errors safely', async () => {
        mockSendMessage.mockRejectedValueOnce(new Error('API Error'));
        initChatSession(mockProfile, 'en');

        // Silence console.error for this test
        const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => { });

        const response = await sendMessageToGemini('Hello');
        expect(response).toContain('connection issues');

        consoleSpy.mockRestore();
    });
});
