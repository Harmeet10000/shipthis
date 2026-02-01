from enum import Enum


class Environment(str, Enum):
    """Application environment."""

    DEVELOPMENT = "development"
    PRODUCTION = "production"
    TESTING = "testing"


# Error messages
SOMETHING_WENT_WRONG = "Something went wrong"
INTERNAL_SERVER_ERROR = "Internal server error"
VALIDATION_ERROR = "Validation error"
NOT_FOUND = "Resource not found"
UNAUTHORIZED = "Unauthorized"
FORBIDDEN = "Forbidden"

EMISSION_FACTORS = {
    "land": {
        "truck_diesel": 0.062,  # kg CO2 per ton-km
        "truck_electric": 0.025,  # kg CO2 per ton-km (grid avg)
        "rail_diesel": 0.022,  # kg CO2 per ton-km
        "rail_electric": 0.008,  # kg CO2 per ton-km
        "default": 0.062,  # Conservative estimate
    },
    "sea": {
        "container_ship": 0.008,  # kg CO2 per ton-km
        "bulk_carrier": 0.005,  # kg CO2 per ton-km
        "default": 0.008,
    },
    "air": {
        "cargo_plane": 0.602,  # kg CO2 per ton-km
        "default": 0.602,
    },
}

ROUTE_EFFICIENCY_FACTORS = {
    "land": {
        "highway": 1.0,
        "urban": 1.3,  # 30% higher due to congestion
        "mountain": 1.4,  # 40% higher due to elevation
    },
    "sea": {
        "direct": 1.0,
        "coastal": 1.1,  # 10% higher due to maneuvering
    },
    "air": {
        "direct": 1.0,
        "with_stopover": 1.25,  # 25% higher due to takeoff/landing
    },
}
