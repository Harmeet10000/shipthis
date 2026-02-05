from fastapi import APIRouter, Depends

from app.features.auth.dependency import get_current_user
from app.features.routes.dependency import get_route_service
from app.features.routes.dto import (
    RouteCalculateForMultiOrginRequest,
    RouteCalculateRequest,
)

router = APIRouter(prefix="/api/v1/routes", tags=["Routes"])


@router.post("/calculate")
async def calculate_route(
    payload: RouteCalculateRequest,
    user=Depends(get_current_user),
    service=Depends(get_route_service),
):
    return await service.calculate(
        user_id=user.id,
        payload=payload,
    )

@router.post("/calculate_multi_origin")
async def calculate_route_for_multi_origin(
    payload: RouteCalculateForMultiOrginRequest,
    user=Depends(get_current_user),
    service=Depends(get_route_service),
):
    return await service.calculate_for_multi_origin(
        user_id=user.id,
        payload=payload,
    )
