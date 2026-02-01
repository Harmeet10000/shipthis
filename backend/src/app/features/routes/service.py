from math import ceil
from bson import ObjectId
from datetime import datetime

from app.features.routes.mapbox import MapboxClient
from app.features.routes.emissions import EmissionCalculator
from app.features.search.model import Search, TransportMode


class RouteService:
    def __init__(self, mapbox: MapboxClient):
        self.mapbox = mapbox
        self.calculator = EmissionCalculator()

    async def calculate(
        self,
        *,
        user_id: ObjectId,
        payload,
    ):
        origin = payload.origin.to_coordinates()
        destination = payload.destination.to_coordinates()

        if payload.transport_mode == "land":
            response = await self.mapbox.get_directions(
                profile="driving-traffic",
                coordinates=[origin, destination],
                alternatives=True,
            )
            routes = response["routes"]
        else:
            routes = [
                {
                    "distance": self._haversine(origin, destination) * 1000,
                    "duration": 0,
                    "geometry": {
                        "type": "LineString",
                        "coordinates": [origin, destination],
                    },
                }
            ]

        enriched = []
        for r in routes:
            distance_km = r["distance"] / 1000
            duration_h = r["duration"] / 3600 if r["duration"] else 0

            if payload.transport_mode == "land":
                co2 = self.calculator.calculate_land(
                    distance_km=distance_km,
                    segments={},
                    cargo_kg=payload.cargo_weight_kg,
                )
            elif payload.transport_mode == "sea":
                co2 = self.calculator.calculate_sea(
                    distance_km=distance_km,
                    cargo_kg=payload.cargo_weight_kg,
                )
            else:
                co2 = self.calculator.calculate_air(
                    distance_km=distance_km,
                    cargo_kg=payload.cargo_weight_kg,
                )

            enriched.append(
                {
                    "distance_km": distance_km,
                    "duration_hours": duration_h,
                    "co2_emissions_kg": co2,
                    "geometry": r["geometry"],
                }
            )

        shortest = min(enriched, key=lambda r: r["distance_km"])
        efficient = min(enriched, key=lambda r: r["co2_emissions_kg"])

        saved = await Search(
            user_id=user_id,
            origin={
                "name": payload.origin.name,
                "coordinates": origin,
            },
            destination={
                "name": payload.destination.name,
                "coordinates": destination,
            },
            cargo_weight_kg=payload.cargo_weight_kg,
            transport_mode=TransportMode(payload.transport_mode),
            shortest_route=shortest,
            efficient_route=efficient,
            metadata={
                "api_version": "v1",
                "calculation_method": "mapbox+heuristics",
            },
            created_at=datetime.utcnow(),
        ).insert()

        savings = shortest["co2_emissions_kg"] - efficient["co2_emissions_kg"]
        percent = (savings / shortest["co2_emissions_kg"]) * 100

        efficient["savings"] = {
            "co2_saved_kg": round(savings, 2),
            "percentage": round(percent, 2),
            "message": f"This route saves {round(savings, 2)} kg of CO2",
        }

        return {
            "search_id": str(saved.id),
            "shortest_route": shortest,
            "efficient_route": efficient,
            "comparison": {
                "distance_difference_km": round(
                    efficient["distance_km"] - shortest["distance_km"], 2
                ),
                "time_difference_minutes": round(
                    (efficient["duration_hours"] - shortest["duration_hours"]) * 60
                ),
                "co2_reduction": f"{round(percent, 2)}%",
            },
        }

    def _haversine(self, a, b):
        from math import radians, sin, cos, sqrt, atan2

        lon1, lat1 = a
        lon2, lat2 = b
        R = 6371

        dlat = radians(lat2 - lat1)
        dlon = radians(lon2 - lon1)

        h = (
            sin(dlat / 2) ** 2
            + cos(radians(lat1)) * cos(radians(lat2)) * sin(dlon / 2) ** 2
        )
        return 2 * R * atan2(sqrt(h), sqrt(1 - h))
