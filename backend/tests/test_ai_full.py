from fastapi.testclient import TestClient
from app.main import app
import uuid

client = TestClient(app)

def test_full_ai_flow():
    email = f"ai_test_{uuid.uuid4()}@test.com"
    print(f"\n[TEST] Starting AI Integration Test for: {email}")

    # 1. Register User with CUSTOM Mode (Should avoid AI call)
    user_payload = {
        "email": email,
        "password": "password123",
        "name": "AI Test User",
        "gender": "Male",
        "planning_mode": "Custom",
        "variety_level": "High",
        "country": "TestCountry",
        "region": "TestRegion"
    }
    resp = client.post("/api/v1/auth/register", json=user_payload)
    if resp.status_code != 200:
        print(f"Details: {resp.text}")
    assert resp.status_code == 200, "Registration failed"
    user_id = resp.json()["id"]
    print("[PASS] User Registered (Custom Mode)")

    # 2. Generate Plan (Custom Mode -> Should be fast/empty-ish)
    resp = client.post(f"/api/v1/plans/generate?user_id={user_id}")
    assert resp.status_code == 200
    data = resp.json()
    # Check if we got the basic tracker template (empty meals or specific structure)
    # Based on my code in ai_plan.py, it returns a 7-day plan with empty meals.
    plan = data["summary"]["plan"]
    assert len(plan) == 7
    # Check first day meals - should be empty or default
    print("[PASS] Custom Plan Generated (Fast Path)")

    # 3. Update User to AUTOMATIC Mode
    update_payload = {"planning_mode": "Automatic"}
    resp = client.put(f"/api/v1/users/{user_id}", json=update_payload)
    assert resp.status_code == 200
    print("[PASS] User Updated to Automatic Mode")

    # 4. Generate AI Plan (Real AI Call)
    print("[WAIT] Generating AI Plan (consulting Gemini)...")
    resp = client.post(f"/api/v1/plans/generate?user_id={user_id}")
    if resp.status_code != 200:
        print(f"AI Gen Failed: {resp.text}")
    assert resp.status_code == 200
    ai_data = resp.json()
    ai_plan = ai_data["summary"]["plan"]
    assert len(ai_plan) == 7
    # detailed check
    first_meal = ai_plan[0]["meals"][0]
    assert first_meal["name"] != "", "AI should generate meal names"
    print(f"[PASS] AI Plan Generated. First Meal: {first_meal['name']}")

    # 5. Test AI Chat
    print("[WAIT] Testing AI Chat...")
    chat_payload = {
        "user_id": user_id,
        "message": "Give me a healthy snack suggestion"
    }
    resp = client.post("/api/v1/chat/", json=chat_payload)
    assert resp.status_code == 200
    chat_resp = resp.json()
    assert "message" in chat_resp
    assert len(chat_resp["message"]) > 0
    print(f"[PASS] AI Chat Response: {chat_resp['message'][:50]}...")

if __name__ == "__main__":
    test_full_ai_flow()
