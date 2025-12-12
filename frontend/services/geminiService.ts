import { GoogleGenAI, Chat, GenerateContentResponse } from "@google/genai";
import { UserProfile } from "../types";

const getAI = () => {
  const apiKey = import.meta.env.VITE_API_KEY;
  if (!apiKey) {
    console.warn("VITE_API_KEY is not set. Chat features will not work.");
    return null;
  }
  return new GoogleGenAI({ apiKey });
};

const SYSTEM_INSTRUCTION_BASE = `
You are 'Fitia AI', a friendly, encouraging, and highly knowledgeable nutritionist assistant for the Fitia app.
Your goal is to help users stick to their diet plans, offer healthy alternatives, and explain nutritional concepts simply.
Keep answers concise (under 3 sentences where possible) unless a detailed explanation is requested.
Adopt a "Clean Health" tone: positive, science-backed, and empathetic.
`;

let chatSession: Chat | null = null;

export const initChatSession = (userProfile: UserProfile | null, language: string = 'en') => {
  let contextInstruction = SYSTEM_INSTRUCTION_BASE;

  contextInstruction += `\nIMPORTANT: ALWAYS Respond in the following language code: ${language}.`;

  if (userProfile) {
    contextInstruction += `
    \nUser Profile:
    - Name: ${userProfile.name}
    - Goal: ${userProfile.goal}
    - Activity: ${userProfile.activityLevel}
    - Stats: ${userProfile.height}cm, ${userProfile.weight}kg.
    Adjust your advice based on this profile.
    `;
  }

  const ai = getAI();
  if (!ai) return;

  chatSession = ai.chats.create({
    model: 'gemini-2.5-flash',
    config: {
      systemInstruction: contextInstruction,
    },
  });
};

export const sendMessageToGemini = async (message: string): Promise<string> => {
  if (!chatSession) {
    // Fallback if session wasn't initialized
    initChatSession(null);
  }

  if (!chatSession) {
    return "Error: Could not initialize AI session.";
  }

  try {
    const response: GenerateContentResponse = await chatSession.sendMessage({ message });
    return response.text || "I'm having trouble thinking of a response right now. Please try again.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "I seem to be having connection issues. Please check your internet or API key.";
  }
};