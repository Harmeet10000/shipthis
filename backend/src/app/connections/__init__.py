"""Database connection dependencies."""

from fastapi import Request
from motor.motor_asyncio import AsyncIOMotorDatabase
from redis.asyncio import Redis

from app.connections.mongodb import create_mongo_client
from app.connections.redis import create_redis_client


__all__ = [
    "create_mongo_client",
    "create_redis_client",
]
