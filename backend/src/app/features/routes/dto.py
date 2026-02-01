from typing import Literal

from pydantic import BaseModel, Field


class PointIn(BaseModel):
    name: str
    lat: float
    lng: float

    def to_coordinates(self):
        return [self.lng, self.lat]


class RouteCalculateRequest(BaseModel):
    origin: PointIn
    destination: PointIn
    cargo_weight_kg: float = Field(gt=0)
    transport_mode: Literal["land", "sea", "air"]


class RouteGeometry(BaseModel):
    type: str
    coordinates: list[list[float]]


class RouteOut(BaseModel):
    distance_km: float
    duration_hours: float
    co2_emissions_kg: float
    geometry: dict


class EfficientRouteOut(RouteOut):
    savings: dict


class RouteCalculateResponse(BaseModel):
    search_id: str
    shortest_route: RouteOut
    efficient_route: EfficientRouteOut
    comparison: dict
