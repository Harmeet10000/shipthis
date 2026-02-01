# app/features/auth/handler.py
from fastapi import Depends, HTTPException, Request
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer

from app.features.auth.dto import LoginRequest, RegisterRequest
from app.features.auth.service import AuthService

security = HTTPBearer()


async def register_handler(request: Request, data: RegisterRequest):
    try:
        service = AuthService(request.app.state.redis)
        return await service.register(data)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


async def login_handler(request: Request, data: LoginRequest):
    try:
        service = AuthService(request.app.state.redis)
        return await service.login(data.email, data.password)
    except ValueError as e:
        raise HTTPException(status_code=401, detail=str(e))


async def refresh_handler(
    request: Request,
    creds: HTTPAuthorizationCredentials = Depends(security),
):
    service = AuthService(request.app.state.redis)
    return await service.refresh(creds.credentials)


async def logout_handler(
    request: Request,
    creds: HTTPAuthorizationCredentials = Depends(security),
):
    service = AuthService(request.app.state.redis)
    await service.logout(creds.credentials)
    return {"detail": "Logged out successfully"}
