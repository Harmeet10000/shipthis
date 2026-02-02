import httpx


class MapboxClient:
    def __init__(self, token: str):
        self.base_url = "https://api.mapbox.com/directions/v5/mapbox"
        self.token = token

    async def get_directions(
        self,
        *,
        profile: str,
        coordinates: list,
        alternatives: bool = True,
    ):
        coord_str = ";".join(f"{lon},{lat}" for lon, lat in coordinates)

        params = {
            "alternatives": "false" if alternatives else "false",
            "geometries": "geojson",
            "steps": "true",
            "annotations": "distance,duration,speed,congestion",
            "overview": "full",
            "access_token": self.token,
        }

        async with httpx.AsyncClient(timeout=20) as client:
            resp = await client.get(
                f"{self.base_url}/{profile}/{coord_str}",
                params=params,
            )
            resp.raise_for_status()
            return resp.json()
