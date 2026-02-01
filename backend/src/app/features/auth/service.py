from jose import jwt, JWTError
from fastapi import HTTPException

from app.features.auth.repository import UserRepository, RefreshTokenRepository
from app.features.auth.dto import RegisterRequest
from app.features.auth.model import User
from app.features.auth.security import (
    create_token,
    hash_password,
    verify_password,
    SECRET_KEY,
    ALGORITHM,
)


ACCESS_TTL_MIN = 15
REFRESH_TTL_MIN = 60 * 24 * 7  # 7 days


class AuthService:
    def __init__(self, redis):
        self.repo = UserRepository()
        self.refresh_tokens = RefreshTokenRepository(redis)


    async def register(self, data: RegisterRequest):
        if await self.repo.get_by_email(data.email):
            raise ValueError("Email already exists")

        user = User(
            email=data.email,
            password_hash=hash_password(data.password),
            full_name=data.full_name,
        )
        await self.repo.create(user)
        return user

    async def login(self, email: str, password: str):
        user = await self.repo.get_by_email(email)
        if not user or not verify_password(password, user.password_hash):
            raise HTTPException(status_code=401, detail="Invalid credentials")

        access = create_token(
            user_id=str(user.id),
            email=user.email,
            token_type="access",
            expires_minutes=ACCESS_TTL_MIN,
        )

        refresh = create_token(
            user_id=str(user.id),
            email=user.email,
            token_type="refresh",
            expires_minutes=REFRESH_TTL_MIN,
        )

        payload = jwt.decode(refresh, SECRET_KEY, algorithms=[ALGORITHM])
        ttl = payload["exp"] - int(datetime.now(tz=timezone.utc).timestamp())

        await self.refresh_tokens.store(payload["jti"], payload["sub"], ttl)

        return {
            "access_token": access,
            "refresh_token": refresh,
            "token_type": "bearer",
        }

    async def refresh(self, refresh_token: str):
        try:
            payload = jwt.decode(refresh_token, SECRET_KEY, algorithms=[ALGORITHM])
        except JWTError:
            raise HTTPException(status_code=401, detail="Invalid refresh token")

        if payload["type"] != "refresh":
            raise HTTPException(status_code=401, detail="Invalid token type")

        if not await self.refresh_tokens.exists(payload["jti"]):
            raise HTTPException(status_code=401, detail="Refresh token revoked")

        # 🔁 ROTATION: revoke old refresh token
        await self.refresh_tokens.revoke(payload["jti"])

        user = await self.repo.get_by_id(payload["sub"])
        if not user:
            raise HTTPException(status_code=401, detail="User not found")

        # issue new tokens
        return await self.login(user.email, user.password_hash)

    async def logout(self, refresh_token: str):
        try:
            payload = jwt.decode(refresh_token, SECRET_KEY, algorithms=[ALGORITHM])
        except JWTError:
            return  # idempotent logout

        if payload.get("jti"):
            await self.refresh_tokens.revoke(payload["jti"])