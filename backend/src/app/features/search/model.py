from datetime import datetime
from enum import Enum
from typing import List, Optional

from beanie import Document, Indexed
from pydantic import BaseModel, Field
from bson import ObjectId


class TransportMode(str, Enum):
    land = "land"
    sea = "sea"
    air = "air"


class Location(BaseModel):
    name: str
    coordinates: List[float]  # [longitude, latitude]


class RouteInfo(BaseModel):
    distance_km: float
    duration_hours: float
    co2_emissions_kg: float
    geometry: dict  # GeoJSON LineString


class Metadata(BaseModel):
    api_version: str
    calculation_method: str


class Search(Document):
    user_id: Indexed(ObjectId)
    origin: Location
    destination: Location
    cargo_weight_kg: float
    transport_mode: TransportMode
    shortest_route: RouteInfo
    efficient_route: RouteInfo
    metadata: Metadata
    created_at: Indexed(datetime) = Field(default_factory=datetime.utcnow)

    class Settings:
        name = "searches"
