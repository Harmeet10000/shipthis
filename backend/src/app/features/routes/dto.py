from pydantic import BaseModel, Field
from typing import Dict, List, Literal


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
    coordinates: List[List[float]]


class RouteOut(BaseModel):
    distance_km: float
    duration_hours: float
    co2_emissions_kg: float
    geometry: Dict


class EfficientRouteOut(RouteOut):
    savings: Dict


class RouteCalculateResponse(BaseModel):
    search_id: str
    shortest_route: RouteOut
    efficient_route: EfficientRouteOut
    comparison: Dict
