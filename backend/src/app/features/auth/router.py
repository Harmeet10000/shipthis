# app/features/auth/router.py
from fastapi import APIRouter, Depends

from app.features.auth.handler import register_handler, login_handler, refresh_handler, logout_handler
from app.features.auth.dto import LogoutResponse, RegisterRequest, LoginRequest, TokenResponse
from app.features.auth.dependency import get_current_user

router = APIRouter(prefix="/api/v1/auth", tags=["Auth"])


@router.post("/register")
async def register(data: RegisterRequest):
    return await register_handler(data)


@router.post("/login", response_model=TokenResponse)
async def login(data: LoginRequest):
    return await login_handler(data)



@router.post("/refresh", response_model=TokenResponse)
async def refresh(tokens=Depends(refresh_handler)):
    return tokens


@router.post("/logout", response_model=LogoutResponse())
async def logout(result=Depends(logout_handler)):
    return result


@router.get("/me")
async def me(user=Depends(get_current_user)):
    return {
        "id": str(user.id),
        "email": user.email,
        "full_name": user.full_name,
    }
