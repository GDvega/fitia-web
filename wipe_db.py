import requests
import os

FIRESTORE_EMULATOR_HOST = os.getenv("FIRESTORE_EMULATOR_HOST", "localhost:8080")
PROJECT_ID = os.getenv("GOOGLE_CLOUD_PROJECT", "fitia-demo")

def wipe_db():
    print(f"Wiping Firestore Emulator at {FIRESTORE_EMULATOR_HOST} for project {PROJECT_ID}")
    url = f"http://{FIRESTORE_EMULATOR_HOST}/emulator/v1/projects/{PROJECT_ID}/databases/(default)/documents"
    
    try:
        response = requests.delete(url)
        if response.status_code == 200:
            print("Database wiped successfully.")
        else:
            print(f"Failed to wipe database: {response.text}")
    except Exception as e:
        print(f"Error wiping database: {e}")

if __name__ == "__main__":
    wipe_db()
