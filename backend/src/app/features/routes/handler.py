from app.features.routes.service import RouteService


class RouteHandler:
    def __init__(self, service: RouteService):
        self.service = service

    async def calculate(self, *, user_id, payload):
        return await self.service.calculate(
            user_id=user_id,
            payload=payload,
        )
