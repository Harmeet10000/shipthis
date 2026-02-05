
from fastapi import Depends

from app.config.settings import get_settings
from app.connections.mongodb import get_db
from app.features.routes.mapbox import MapboxClient
from app.features.routes.repository import RouteRepository
from app.features.routes.service import RouteService

# from app.utils.logger import logger


def get_route_service(db=Depends(get_db)) -> RouteService:
    settings = get_settings()
    mapbox = MapboxClient(settings.MAPBOX_TOKEN)
    repo = RouteRepository(db)
    return RouteService(mapbox, repo)
