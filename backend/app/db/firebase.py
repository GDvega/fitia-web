import firebase_admin
from firebase_admin import credentials, firestore
from app.core.config import settings

def get_db():
    """
    Initializes the Firebase app if not already initialized and returns the Firestore client.
    """
    if not firebase_admin._apps:
        # Check if running in Emulator Mode
        import os
        if os.getenv("FIRESTORE_EMULATOR_HOST"):
             import google.auth.credentials
             cred = google.auth.credentials.AnonymousCredentials()
             firebase_admin.initialize_app(cred, {'projectId': 'fitia-demo'})
        elif settings.FIREBASE_CREDENTIALS_PATH:
             # Explicit credentials file (e.g. local dev without emulator but with key)
             cred = credentials.Certificate(settings.FIREBASE_CREDENTIALS_PATH)
             firebase_admin.initialize_app(cred)
             # Production (Cloud Run) - Use Application Default Credentials (ADC)
             # Cloud Run injects the service account automatically.
             firebase_admin.initialize_app()
    
    # Connect to the specific database (default or named like 'fitia-prod')
    return firestore.client(database=settings.FIREBASE_DATABASE_ID)
