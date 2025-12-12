import os
import json
import urllib.parse
from dotenv import load_dotenv
from google import genai
from google.genai import types
from app.models.user import UserBase, PreparationStyle, PlanningMode

load_dotenv()

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
client = genai.Client(api_key=GEMINI_API_KEY)

SYSTEM_PROMPT = """
Eres un Nutricionista Experto de Fitia. Tu tarea es generar un plan de comidas semanal PERSONALIZADO y REGIONAL.
Utiliza los datos del usuario (País, Región, Objetivo, Calorías) para sugerir platos típicos o disponibles en su zona.

IMPORTANTE:
1. Retorna SOLAMENTE JSON válido.
2. No incluyas markdown (```json ... ```).
3. El idioma debe ser ESPAÑOL.
4. Estructura del JSON:
{
  "plan": [
    {
      "day": "Lunes",
      "total_calories": 2000,
      "meals": [
        {
          "meal_type": "Breakfast" | "Lunch" | "Dinner" | "Snack",
          "name": "Nombre creativo del plato",
          "calories": 500,
          "protein": 30,
          "carbs": 40,
          "fats": 20,
          "ingredients": ["Ingrediente 1", "Ingrediente 2"],
          "prepTime": "15 min"
        }
      ]
    }
  ]
}
"""

def generate_image_url(recipe_name: str) -> str:
    """Generates a dynamic image URL using Pollinations.ai"""
    prompt = f"{recipe_name}, professional food photography, 4k, delicious, appetizing, studio lighting"
    encoded_prompt = urllib.parse.quote(prompt)
    return f"https://image.pollinations.ai/prompt/{encoded_prompt}"

def generate_ai_weekly_plan(user: UserBase, daily_calories: int) -> dict:
    if user.planning_mode == PlanningMode.CUSTOM:
        # User wants to count calories themselves -> Return empty template
        distribution = user.meals_per_day if user.meals_per_day else ['Breakfast', 'Lunch', 'Dinner']
        days = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo']
        
        plan = []
        for day in days:
            day_meals = []
            for meal_type in distribution:
                day_meals.append({
                    "meal_type": meal_type,
                    "name": "Registrar Comida",
                    "calories": 0,
                    "protein": 0,
                    "carbs": 0,
                    "fats": 0,
                    "ingredients": [],
                    "prepTime": "0 min",
                    "image": "https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&q=80&w=300",
                    "id": str(abs(hash(f"{day}-{meal_type}")))
                })
            
            plan.append({
                "day": day,
                "total_calories": 0,
                "target_calories": daily_calories,
                "meals": day_meals
            })
        
        return {"plan": plan}

    prep_instruction = 'Recetas detalladas paso a paso' if user.preparation_style == PreparationStyle.RECIPES else 'Lista de ingredientes simples para armar'
    
    variety_instruction = {
        'Low': 'Repite las mismas comidas varios días (Ideal para Meal Prep/Cocinando en lote). Simplifica al máximo.',
        'Medium': 'Balance entre variedad y repetición. Puedes repetir desayunos o cenas.',
        'High': 'Máxima variedad, intenta no repetir platos en la semana.'
    }.get(user.variety_level.value if user.variety_level else 'Medium', 'Balance entre variedad y repetición')

    prompt = f"""
    Genera un plan semanal para:
    - Perfil: {user.gender}, {user.age} años, {user.weight}kg.
    - Ubicación: {user.region}, {user.country} (Usa ingredientes locales).
    - Objetivo: {user.goal}
    - Dieta: {user.diet_type.value if user.diet_type else 'Cualquiera'}
    - Preferencias/Ingredientes: {', '.join(user.foods_like) if user.foods_like else 'Sin restricciones específicas'}
    - Estilo de Preparación: {prep_instruction}
    - Nivel de Variedad: {variety_instruction}
    - Meta Diaria: {daily_calories} kcal (Aprox).
    - Distribución de Comidas: {', '.join(user.meals_per_day) if user.meals_per_day else 'Desayuno, Almuerzo, Cena'}.
    """

    try:
        response = client.models.generate_content(
            model='gemini-2.0-flash',
            contents=f"{SYSTEM_PROMPT}\n\nUSER REQUEST:\n{prompt}\n\nRESPONSE (JSON):",
            config=types.GenerateContentConfig(
                response_mime_type='application/json'
            )
        )
        
        text_response = response.text.strip()
        # Cleanup markdown formatting if present despite instructions
        if text_response.startswith("```json"):
            text_response = text_response[7:]
        if text_response.endswith("```"):
            text_response = text_response[:-3]
            
        data = json.loads(text_response.strip())
        
        # Post-process to add Images and IDs
        for day in data.get("plan", []):
            for meal in day.get("meals", []):
                meal["id"] = str(abs(hash(meal["name"]))) # Simple ID
                meal["image"] = generate_image_url(meal["name"])
                
        return data

    except Exception as e:
        print(f"Error generating AI Plan: {e}")
        # Fallback to empty structure or error handling
        return {"plan": []}
