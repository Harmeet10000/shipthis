from math import ceil
from typing import Optional
from bson import ObjectId

from app.features.search.model import Search, TransportMode


class SearchRepository:
    async def list(
        self,
        *,
        user_id: ObjectId,
        page: int,
        limit: int,
        sort: str,
        mode: Optional[TransportMode],
    ):
        filter_query = {"user_id": user_id}
        if mode:
            filter_query["transport_mode"] = mode

        total = await Search.find(filter_query).count()
        skip = (page - 1) * limit

        sort_field = sort.lstrip("-")
        direction = -1 if sort.startswith("-") else 1

        results = (
            await Search.find(filter_query)
            .sort([(sort_field, direction)])
            .skip(skip)
            .limit(limit)
            .to_list()
        )

        return results, total

    async def get_by_id(self, *, search_id: ObjectId, user_id: ObjectId):
        return await Search.find_one({"_id": search_id, "user_id": user_id})

    async def delete(self, *, search_id: ObjectId, user_id: ObjectId) -> bool:
        result = await Search.find_one({"_id": search_id, "user_id": user_id})
        if not result:
            return False

        await result.delete()
        return True

    async def stats(self, *, user_id: ObjectId):
        pipeline = [
            {"$match": {"user_id": user_id}},
            {
                "$group": {
                    "_id": None,
                    "total_searches": {"$sum": 1},
                    "avg_cargo_weight": {"$avg": "$cargo_weight_kg"},
                    "total_co2_saved": {
                        "$sum": {
                            "$subtract": [
                                "$shortest_route.co2_emissions_kg",
                                "$efficient_route.co2_emissions_kg",
                            ]
                        }
                    },
                }
            },
        ]

        result = await Search.aggregate(pipeline).to_list()
        return result[0] if result else None
