from beanie import Document, Indexed
from pydantic import EmailStr
from datetime import datetime


class User(Document):
    email: Indexed(EmailStr, unique=True)
    password_hash: str
    full_name: str
    created_at: datetime = datetime.utcnow()
    updated_at: datetime = datetime.utcnow()

    class Settings:
        name = "users"
