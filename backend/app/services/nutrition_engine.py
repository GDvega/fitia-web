from app.services import ai_plan
from app.models.user import UserBase, Gender, ActivityLevel, Goal

def calculate_bmr(user: UserBase) -> float:
    """Calculates Basal Metabolic Rate using Harris-Benedict Revised."""
    if user.gender == Gender.MALE:
        return 88.362 + (13.397 * user.weight) + (4.799 * user.height) - (5.677 * user.age)
    else:
        return 447.593 + (9.247 * user.weight) + (3.098 * user.height) - (4.330 * user.age)

def calculate_tdee(bmr: float, activity_level: ActivityLevel) -> float:
    """Calculates Total Daily Energy Expenditure."""
    multipliers = {
        ActivityLevel.SEDENTARY: 1.2,
        ActivityLevel.LIGHT: 1.375,
        ActivityLevel.MODERATE: 1.55,
        ActivityLevel.VERY_ACTIVE: 1.725
    }
    return bmr * multipliers.get(activity_level, 1.2)

def adjust_for_goal(tdee: float, goal: Goal) -> float:
    """Adjusts calories based on user goal."""
    if goal == Goal.LOSE_WEIGHT:
        return tdee - 500
    elif goal == Goal.GAIN_MUSCLE:
        return tdee + 300
    return tdee

def generate_weekly_plan(user: UserBase):
    bmr = calculate_bmr(user)
    tdee = calculate_tdee(bmr, user.activity_level)
    daily_target = int(adjust_for_goal(tdee, user.goal))
    
    # Delegate to AI Service
    ai_result = ai_plan.generate_ai_weekly_plan(user, daily_target)
    
    return {
        "bmr": int(bmr),
        "tdee": int(tdee),
        "target_calories": daily_target,
        "plan": ai_result.get("plan", [])
    }

def find_alternative_recipe(meal_type: str, exclude_ids: list[str] = [], keywords: list[str] = []) -> dict:
    # Legacy/Fallback or Implement AI single recipe gen?
    # For now returning None as we want full AI behavior and regenerate button does full plan usually.
    # User might want to swap single meal though.
    return None


def update_latest_plan_meal(user_id: str, meal_type: str, keywords: list[str] = []) -> dict:
    from app.db.firebase import get_db
    
    db = get_db()
    
    plans_ref = db.collection('users').document(user_id).collection('meal_plans')
    docs = plans_ref.stream()
    all_plans = list(docs)
    
    if not all_plans:
        return {'success': False, 'message': 'No active plan found to update.'}
        
    latest_doc = all_plans[-1]
    plan_data = latest_doc.to_dict()
    plan_id = latest_doc.id
    
    weekly_plan = plan_data.get('plan', [])
    
    found = False
    new_recipe = None
    
    for day_plan in weekly_plan:
        meals = day_plan.get('meals', [])
        for i, meal in enumerate(meals):
            if meal['meal_type'] == meal_type:
                old_recipe_id = meal['recipe_id']
                
                new_recipe_data = find_alternative_recipe(meal_type, exclude_ids=[old_recipe_id], keywords=keywords)
                
                if new_recipe_data:
                    meals[i] = {
                        'recipe_id': new_recipe_data['id'],
                        'name': new_recipe_data['name'],
                        'calories': new_recipe_data['calories'],
                        'meal_type': new_recipe_data['type']
                    }
                    
                    delta = new_recipe_data['calories'] - meal['calories']
                    day_plan['total_calories'] += delta
                    
                    found = True
                    new_recipe = new_recipe_data
                    break
        if found:
            break
            
    if not found or not new_recipe:
        return {'success': False, 'message': 'Could not find a suitable alternative recipe.'}
        
    plans_ref.document(plan_id).update({'plan': weekly_plan})
    
    return {
        'success': True, 
        'message': f"Updated your {meal_type} to: {new_recipe['name']}",
        'new_meal': new_recipe
    }

