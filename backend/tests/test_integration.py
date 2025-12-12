from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_integration_flow():
    import uuid
    random_email = f"test_{uuid.uuid4()}@test.com"
    # 1. Register User (Auth Flow)
    user_payload = {
        "email": random_email,
        "password": "securepassword123",
        "name": "Integration Test User",
        "age": 30,
        "weight": 80.0,
        "height": 180.0,
        "gender": "Male",
        "goal": "Lose Weight",
        "activity_level": "Moderately Active",
        "country": "Peru",
        "region": "Lima"
    }
    # Using the auth endpoint
    response = client.post("/api/v1/auth/register", json=user_payload)
    if response.status_code != 200:
        print(f"Registration failed: {response.text}")
    assert response.status_code == 200
    data = response.json()
    user_id = data.get("id")
    assert user_id is not None
    print(f"Created User ID: {user_id}")

    # 1b. Login (Verify Auth)
    login_data = {
        "username": random_email,
        "password": "securepassword123"
    }
    response = client.post("/api/v1/auth/login", data=login_data)
    assert response.status_code == 200
    token = response.json().get("access_token")
    assert token is not None
    print("Login Successful, Token received")

    # 2. Generate Plan
    response = client.post(f"/api/v1/plans/generate?user_id={user_id}")
    assert response.status_code == 200
    plan_data = response.json()
    assert "plan_id" in plan_data
    assert "summary" in plan_data
    assert len(plan_data["summary"]["plan"]) == 7
    print("Plan Generated Successfully")

    # 3. Fetch Latest Plan
    response = client.get(f"/api/v1/plans/latest?user_id={user_id}")
    assert response.status_code == 200
    fetched_plan = response.json()
    assert "summary" in fetched_plan
    assert len(fetched_plan["summary"]["plan"]) == 7
    print("Plan Fetched Successfully")

if __name__ == "__main__":
    test_integration_flow()
