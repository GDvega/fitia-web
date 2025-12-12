from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from app.services import user_service
from app.core import security
from app.models.user import UserCreate

router = APIRouter()

@router.post("/login")
def login(form_data: OAuth2PasswordRequestForm = Depends()):
    user = user_service.authenticate_user(form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username (email) or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token = security.create_access_token(data={"sub": user["id"]})
    return {"access_token": access_token, "token_type": "bearer"}

@router.post("/register", response_model=dict)
def register(user: UserCreate):
    # Check if email already exists
    if user_service.get_user_by_email(user.email):
        raise HTTPException(status_code=400, detail="Email already registered")
    
    user_id = user_service.create_user(user)
    return {"id": user_id, "message": "User created successfully"}
