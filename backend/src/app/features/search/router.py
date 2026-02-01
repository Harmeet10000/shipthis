from fastapi import APIRouter, Depends, Query, status

from app.features.auth.dependency import get_current_user
from app.features.search.dto import (
    SearchListResponse,
    SearchStatsResponse,
)
from app.features.search.handler import SearchHandler
from app.features.search.model import TransportMode
from app.features.search.repository import SearchRepository
from app.features.search.service import SearchService

router = APIRouter(prefix="/api/v1/searches", tags=["Searches"])


def get_handler() -> SearchHandler:
    service = SearchService(SearchRepository())
    return SearchHandler(service)


@router.get("", response_model=SearchListResponse)
async def list_searches(
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
    sort: str = Query("-created_at"),
    mode: TransportMode | None = Query(None),
    current_user=Depends(get_current_user),
    handler: SearchHandler = Depends(get_handler),
):
    return await handler.list_searches(
        user_id=current_user.id,
        page=page,
        limit=limit,
        sort=sort,
        mode=mode,
    )


@router.get("/{search_id}")
async def get_search(
    search_id: str,
    current_user=Depends(get_current_user),
    handler: SearchHandler = Depends(get_handler),
):
    return await handler.get_search(
        search_id=search_id,
        user_id=current_user.id,
    )


@router.delete(
    "/{search_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
async def delete_search(
    search_id: str,
    current_user=Depends(get_current_user),
    handler: SearchHandler = Depends(get_handler),
):
    await handler.delete_search(
        search_id=search_id,
        user_id=current_user.id,
    )


@router.get("/stats", response_model=SearchStatsResponse)
async def search_stats(
    current_user=Depends(get_current_user),
    handler: SearchHandler = Depends(get_handler),
):
    return await handler.get_stats(user_id=current_user.id)
