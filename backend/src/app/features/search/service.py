from math import ceil

from bson import ObjectId


class SearchService:
    def __init__(self, repo, redis):
        self.repo = repo
        self.redis = redis

    async def list_searches(self, *, user_id, page, limit, sort, mode):
        data, total = await self.repo.list(
            user_id=user_id,
            page=page,
            limit=limit,
            sort=sort,
            mode=mode,
        )

        total_pages = ceil(total / limit) if total else 0

        return {
            "data": data,
            "pagination": {
                "page": page,
                "limit": limit,
                "total": total,
                "total_pages": total_pages,
                "has_next": page < total_pages,
            },
        }

    async def get_search(self, *, search_id, user_id):
        return await self.repo.get(
            search_id=ObjectId(search_id),
            user_id=user_id,
        )

    async def delete_search(self, *, search_id, user_id):
        return await self.repo.delete(
            search_id=ObjectId(search_id),
            user_id=user_id,
        )

    async def get_stats(self, *, user_id):
        stats = await self.repo.stats(user_id=user_id)
        return {
            "total_searches": stats["total_searches"] if stats else 0,
            "total_co2_saved": stats["total_co2_saved"] if stats else 0.0,
            "avg_cargo_weight": stats["avg_cargo_weight"] if stats else 0.0,
        }
