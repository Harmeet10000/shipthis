from fastapi import APIRouter, Depends

from app.config.settings import get_settings
from app.features.auth.dependency import get_current_user
from app.features.routes.dto import (
    RouteCalculateRequest,
    RouteCalculateResponse,
)
from app.features.routes.handler import RouteHandler
from app.features.routes.mapbox import MapboxClient
from app.features.routes.service import RouteService

router = APIRouter(prefix="/api/v1/routes", tags=["Routes"])


def get_handler():
    settings = get_settings()
    mapbox = MapboxClient(settings.MAPBOX_TOKEN)
    return RouteHandler(RouteService(mapbox))


@router.post(
    "/calculate",
    response_model=RouteCalculateResponse,
)
async def calculate_route(
    payload: RouteCalculateRequest,
    current_user=Depends(get_current_user),
    handler: RouteHandler = Depends(get_handler),
):
    return await handler.calculate(
        user_id=current_user.id,
        payload=payload,
    )
