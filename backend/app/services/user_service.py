from app.db.firebase import get_db
from app.models.user import UserBase
from app.core.security import get_password_hash, verify_password

USER_COLLECTION = "users"


def get_user_by_email(email: str) -> dict:
    db = get_db()
    users_ref = db.collection(USER_COLLECTION).where("email", "==", email).limit(1)
    docs = users_ref.stream()
    for doc in docs:
        user_data = doc.to_dict()
        user_data["id"] = doc.id
        return user_data
    return None

def authenticate_user(email: str, password: str):
    from app.core.security import verify_password
    user = get_user_by_email(email)
    if not user:
        return False
    if not verify_password(password, user["hashed_password"]):
        return False
    return user

def create_user(user_data) -> str:
    db = get_db()
    
    # Check if this is a dict or UserCreate model
    if hasattr(user_data, 'dict'):
        data = user_data.dict()
    else:
        data = user_data

    # Hash password if present
    if "password" in data:
        data["hashed_password"] = get_password_hash(data.pop("password"))
    
    update_time, user_ref = db.collection(USER_COLLECTION).add(data)
    return user_ref.id

def get_user(user_id: str) -> dict:
    db = get_db()
    doc_ref = db.collection(USER_COLLECTION).document(user_id)
    doc = doc_ref.get()
    if doc.exists:
        return doc.to_dict()
    return None

def update_user(user_id: str, user_data: dict) -> bool:
    db = get_db()
    doc_ref = db.collection(USER_COLLECTION).document(user_id)
    doc_ref.set(user_data, merge=True)
    return True
