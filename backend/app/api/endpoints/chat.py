from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from app.services.ai_chat import process_user_message
from app.services.nutrition_engine import update_latest_plan_meal

router = APIRouter()

class ChatRequest(BaseModel):
    user_id: str
    message: str

@router.post("/")
async def chat_endpoint(request: ChatRequest):
    # 1. AI Processing
    ai_response = process_user_message(request.message)
    
    # 2. Action Handling
    action_result = None
    if ai_response.get("intent") == "CHANGE_MEAL":
        entities = ai_response.get("entities", {})
        meal_type = entities.get("meal_type")
        keywords = entities.get("food_keywords") or []
        
        if meal_type:
            # Capitalize for matching (e.g. "dinner" -> "Dinner")
            meal_type = meal_type.capitalize() 
            
            # Execute change
            action_result = update_latest_plan_meal(request.user_id, meal_type, keywords)
            
            # Append result to AI message
            if action_result["success"]:
                 ai_response["message"] += f"\n\nDone! {action_result['message']}"
            else:
                 ai_response["message"] += f"\n\n(I tried to change it but: {action_result['message']})"

    return ai_response
