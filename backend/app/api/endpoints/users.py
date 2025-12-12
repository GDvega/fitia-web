from fastapi import APIRouter, HTTPException
from app.models.user import UserBase, UserUpdate
from app.services import user_service

router = APIRouter()

@router.post("/", response_model=dict)
def create_user_endpoint(user: UserBase):
    try:
        user_id = user_service.create_user(user)
        return {"id": user_id, "message": "User created successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/{user_id}", response_model=UserBase)
def get_user_endpoint(user_id: str):
    user_data = user_service.get_user(user_id)
    if not user_data:
        raise HTTPException(status_code=404, detail="User not found")
    return user_data

@router.put("/{user_id}", response_model=dict)
def update_user_endpoint(user_id: str, user: UserUpdate):
    try:
        user_service.update_user(user_id, user.dict(exclude_unset=True))
        return {"id": user_id, "message": "User updated successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
