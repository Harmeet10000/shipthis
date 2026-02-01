from bson import ObjectId
from fastapi import HTTPException, status

from app.features.search.model import TransportMode
from app.features.search.service import SearchService


class SearchHandler:
    def __init__(self, service: SearchService):
        self.service = service

    async def list_searches(
        self,
        *,
        user_id: ObjectId,
        page: int,
        limit: int,
        sort: str,
        mode: TransportMode | None,
    ):
        return await self.service.list_searches(
            user_id=user_id,
            page=page,
            limit=limit,
            sort=sort,
            mode=mode,
        )

    async def get_search(
        self,
        *,
        search_id: str,
        user_id: ObjectId,
    ):
        search = await self.service.get_search(
            search_id=ObjectId(search_id),
            user_id=user_id,
        )
        if not search:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Search not found",
            )
        return search

    async def delete_search(
        self,
        *,
        search_id: str,
        user_id: ObjectId,
    ):
        deleted = await self.service.delete_search(
            search_id=ObjectId(search_id),
            user_id=user_id,
        )
        if not deleted:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Search not found",
            )

    async def get_stats(self, *, user_id: ObjectId):
        return await self.service.get_stats(user_id=user_id)
