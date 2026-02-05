from app.features.routes.emissions import EmissionCalculator
from app.utils.logger import logger

# RouteCalculateForMultiOrginRequest(
#     cargo_info=[
#         CargoInfo(
#             origin=PointIn(name="delhi", lat=0.0, lng=0.0),
#             destination=PointIn(name="mumbai", lat=0.0, lng=0.0),
#             cargo_weight_kg=1.0,
#             transport_mode="land",
#         ),
#         CargoInfo(
#             origin=PointIn(name="mumbai", lat=0.0, lng=0.0),
#             destination=PointIn(name="pune", lat=0.0, lng=0.0),
#             cargo_weight_kg=1.0,
#             transport_mode="land",
#         ),
#     ]
# )
# [
#     CargoInfo(
#         origin=PointIn(name="delhi", lat=0.0, lng=0.0),
#         destination=PointIn(name="mumbai", lat=0.0, lng=0.0),
#         cargo_weight_kg=1.0,
#         transport_mode="land",
#     ),
#     CargoInfo(
#         origin=PointIn(name="mumbai", lat=0.0, lng=0.0),
#         destination=PointIn(name="pune", lat=0.0, lng=0.0),
#         cargo_weight_kg=1.0,
#         transport_mode="land",
#     ),
# ]


class RouteService:
    def __init__(self, mapbox, repo):
        self.mapbox = mapbox
        self.repo = repo
        self.emissions = EmissionCalculator()

    async def calculate_for_multi_origin(self, *, user_id, payload):
        # logger.info("payload", payload=payload.cargo_info)

        for p in payload.cargo_info:

            origin = p.origin.to_coordinates()
            dest = p.destination.to_coordinates()
            logger.info("origin/dest",p=p, origin=origin, dest=dest)

            response = await self.mapbox.get_directions(
                profile="driving-traffic",
                coordinates=[origin, dest],
                alternatives=True,
            )
            # logger.info("response", response=response)

            routes = []
            for r in response["routes"]:
                distance_km = r["distance"] / 1000
                duration_h = r["duration"] / 3600

                co2 = self.emissions.calculate_land(
                    distance_km=distance_km,
                    cargo_kg=p.cargo_weight_kg,
                    segments={},
                )

                routes.append(
                    {
                        "distance_km": distance_km,
                        "duration_hours": duration_h,
                        "co2_emissions_kg": co2,
                        "geometry": r["geometry"],
                    }
                )

                # logger.info("routes", routes=routes)

            shortest = min(routes, key=lambda r: r["distance_km"])
            efficient = min(routes, key=lambda r: r["co2_emissions_kg"])

            await self.repo.save(
                user_id=user_id,
                payload=p,
                shortest=shortest,
                efficient=efficient,
            )

            savings = shortest["co2_emissions_kg"] - efficient["co2_emissions_kg"]
            percent = (savings / shortest["co2_emissions_kg"]) * 100

            efficient["savings"] = {
                "co2_saved_kg": round(savings, 2),
                "percentage": round(percent, 2),
            }

            return {
                "shortest_route": shortest,
                "efficient_route": efficient,
            }

    async def calculate(self, *, user_id, payload):
        origin = payload.origin.to_coordinates()
        dest = payload.destination.to_coordinates()

        response = await self.mapbox.get_directions(
            profile="driving-traffic",
            coordinates=[origin, dest],
            alternatives=True,
        )
        # logger.info("response",response=response)

        routes = []
        for r in response["routes"]:
            distance_km = r["distance"] / 1000
            duration_h = r["duration"] / 3600

            co2 = self.emissions.calculate_land(
                distance_km=distance_km,
                cargo_kg=payload.cargo_weight_kg,
                segments={},
            )

            routes.append(
                {
                    "distance_km": distance_km,
                    "duration_hours": duration_h,
                    "co2_emissions_kg": co2,
                    "geometry": r["geometry"],
                }
            )

        shortest = min(routes, key=lambda r: r["distance_km"])
        efficient = min(routes, key=lambda r: r["co2_emissions_kg"])

        await self.repo.save(
            user_id=user_id,
            payload=payload,
            shortest=shortest,
            efficient=efficient,
        )

        savings = shortest["co2_emissions_kg"] - efficient["co2_emissions_kg"]
        percent = (savings / shortest["co2_emissions_kg"]) * 100

        efficient["savings"] = {
            "co2_saved_kg": round(savings, 2),
            "percentage": round(percent, 2),
        }

        return {
            "shortest_route": shortest,
            "efficient_route": efficient,
        }
