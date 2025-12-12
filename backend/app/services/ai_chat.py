# Validating against Enum value (backend uses 'Male', 'Female')
# New SDK Import
import os
import json
from dotenv import load_dotenv
from google import genai
from google.genai import types

load_dotenv()

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
if not GEMINI_API_KEY:
    print("Warning: GEMINI_API_KEY not found in env")

# Configure Client
client = genai.Client(api_key=GEMINI_API_KEY)

# System Prompt
SYSTEM_PROMPT = """
Eres el Nutricionista IA de Fitia. Tu objetivo es ayudar a los usuarios con sus planes de comida y preguntas de nutrición.
Tienes dos tareas principales:
1. Responder preguntas generales de nutrición.
2. Ayudar a los usuarios a modificar su plan de comidas (ej. "Cambia el desayuno", "No me gusta el pescado").

Debes retornar tu respuesta en formato JSON.
Estructura:
{
    "intent": "CHANGE_MEAL" | "QUESTION",
    "entities": {
        "meal_type": "Breakfast" | "Lunch" | "Dinner" | "Snack" | null,
        "food_keywords": ["pollo", "ensalada"] | null # palabras clave para buscar
    },
    "message": "Respuesta legible para el usuario en Español"
}

Si el usuario quiere cambiar una comida, pon intent en "CHANGE_MEAL", identifica qué tipo de comida (infiere del contexto o por defecto la siguiente próxima), y extrae palabras clave para preferencias.
Si el usuario hace una pregunta, pon intent en "QUESTION", entities en null, y da una respuesta útil en "message".
Mantén "message" conciso y amigable, SIEMPRE en Español.
"""

def process_user_message(message: str) -> dict:
    try:
        # New SDK Call
        response = client.models.generate_content(
            model='gemini-2.0-flash', # Or gemini-1.5-flash
            contents=f"{SYSTEM_PROMPT}\n\nUser: {message}\n\nResponse (JSON):",
            config=types.GenerateContentConfig(
                response_mime_type='application/json' 
            )
        )
        
        text_response = response.text.strip()
        
        # Robust JSON extraction
        import re
        json_match = re.search(r'(\{.*\})', text_response, re.DOTALL)
        
        if json_match:
            json_str = json_match.group(1)
            return json.loads(json_str)
        else:
            # Fallback if no JSON found
            return json.loads(text_response) # Try direct parse just in case

    except Exception as e:
        print(f"Error calling Gemini or parsing response: {e}")
        return {
            "intent": "unknown",
            "message": "Estoy teniendo problemas para pensar claramente ahora mismo. Por favor intenta de nuevo."
        }
