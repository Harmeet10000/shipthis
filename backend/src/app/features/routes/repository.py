from datetime import datetime


class RouteRepository:
    def __init__(self, db):
        self.collection = db.searches

    async def save(
        self,
        *,
        user_id,
        payload,
        shortest,
        efficient,
    ):
        await self.collection.insert_one(
            {
                "user_id": user_id,
                "origin": {
                    "name": payload.origin.name,
                    "coordinates": payload.origin.to_coordinates(),
                },
                "destination": {
                    "name": payload.destination.name,
                    "coordinates": payload.destination.to_coordinates(),
                },
                "cargo_weight_kg": payload.cargo_weight_kg,
                "transport_mode": payload.transport_mode,
                "shortest_route": shortest,
                "efficient_route": efficient,
                "created_at": datetime.utcnow(),
            }
        )
