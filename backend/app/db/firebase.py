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
        else:
             # Production (Cloud Run) - Use Application Default Credentials (ADC)
             # Cloud Run injects the service account automatically.
             firebase_admin.initialize_app()
    
    # Connect to the specific database
    # firebase_admin.firestore.client() does not support 'database' arg in all versions.
    # We use the direct Google Cloud Firestore client for named database support.
    from google.cloud import firestore as google_firestore
    
    # If using emulator, fall back to wrapper which handles localhost connection automatically
    import os
    if os.getenv("FIRESTORE_EMULATOR_HOST"):
        return firestore.client()
        
    # Production: Use direct client with database ID and ADC
    return google_firestore.Client(database=settings.FIREBASE_DATABASE_ID)
