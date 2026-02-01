# app/features/auth/dependencies.py
from fastapi import Depends, HTTPException, Request
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import jwt, JWTError

from app.features.auth.repository import UserRepository
from app.features.auth.security import SECRET_KEY, ALGORITHM

security = HTTPBearer()


async def get_current_user(
    request: Request,
    creds: HTTPAuthorizationCredentials = Depends(security),
):
    try:
        payload = jwt.decode(
            creds.credentials,
            SECRET_KEY,
            algorithms=[ALGORITHM],
        )
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")

    if payload.get("type") != "access":
        raise HTTPException(status_code=401, detail="Invalid token type")

    user = await UserRepository().get_by_id(payload["sub"])
    if not user:
        raise HTTPException(status_code=401, detail="User not found")

    request.state.user = user
    return user
