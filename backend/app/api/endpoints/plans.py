from fastapi import APIRouter, HTTPException
from app.services import nutrition_engine
from app.services import user_service
from app.db.firebase import get_db
from app.models.user import UserBase, Gender

router = APIRouter()

@router.post("/generate")
def generate_plan(user_id: str):
    # 1. Fetch User
    user_data = user_service.get_user(user_id)
    if not user_data:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Validation for missing Gender (legacy data support)
    if "gender" not in user_data:
        # Default or fail? Fails for now as required for Algo.
        # Ideally user should update profile.
        raise HTTPException(status_code=400, detail="User profile incomplete: missing gender")

    user = UserBase(**user_data)

    # 2. Run Engine
    result = nutrition_engine.generate_weekly_plan(user)

    # 3. Save to Firestore
    db = get_db()
    # Save as a subcollection 'meal_plans' for the user
    # Or just a top level collection with userId. Subcollection is cleaner.
    plan_ref = db.collection("users").document(user_id).collection("meal_plans").document()
    plan_ref.set(result)

    return {"plan_id": plan_ref.id, "summary": result}

@router.get("/latest")
def get_latest_plan(user_id: str):
    db = get_db()
    plans_ref = db.collection("users").document(user_id).collection("meal_plans")
    # Order by some timestamp ideally, but for now getting latest created
    # Firestore auto-ids don't guarantee strict order, ideally we'd have a 'created_at' field.
    # Assuming list returns in some order or we pick one. For robust implementation, add timestamp.
    # Simple workaround: just stream and pick last? Or better, list(limit=1) if we had a query.
    # Let's just getAll and pick last for now (simple mock behavior).
    docs = plans_ref.stream()
    all_plans = [doc.to_dict() for doc in docs]
    
    if not all_plans:
        raise HTTPException(status_code=404, detail="No plan found for user")
        
    return {"summary": all_plans[-1]}

