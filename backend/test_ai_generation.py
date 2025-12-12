from app.models.user import UserBase, Gender, Goal, ActivityLevel
from app.services.nutrition_engine import generate_weekly_plan
import json

def test_ai():
    print("Testing AI Generation for Peru...")
    user = UserBase(
        email="test@test.com",
        name="Test User",
        country="Peru",
        region="Lima",
        goal=Goal.LOSE_WEIGHT,
        activity_level=ActivityLevel.MODERATE
    )
    
    plan_data = generate_weekly_plan(user)
    
    print(f"Plan Generated. Target: {plan_data['target_calories']}")
    week = plan_data['plan']
    if not week:
        print("ERROR: Plan is empty!")
        return

    first_day = week[0]
    print(f"Day 1: {first_day['day']}")
    for meal in first_day['meals']:
        print(f" - {meal['meal_type']}: {meal['name']} ({meal['calories']} kcal)")
        print(f"   Ingredients: {meal.get('ingredients')}")
        print(f"   Image: {meal.get('image')}")
        
    print("Test Complete.")

if __name__ == "__main__":
    test_ai()
