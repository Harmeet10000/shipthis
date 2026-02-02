/**
 * Route Visualization Types
 *
 * Type definitions for route calculation, visualization, and GeoJSON geometry.
 * These types align with the backend API response format and Mapbox requirements.
 */

// ============================================================================
// GeoJSON Geometry Types
// ============================================================================

/**
 * GeoJSON coordinate pair: [longitude, latitude]
 * Longitude range: -180 to 180
 * Latitude range: -90 to 90
 */
export type Coordinate = [number, number];

/**
 * GeoJSON LineString geometry for route paths
 * Represents a series of connected line segments
 */
export interface LineStringGeometry {
  type: "LineString";
  coordinates: Coordinate[];
}

// ============================================================================
// Route Data Models
// ============================================================================

/**
 * Route data including geometry and metrics
 * Represents a single route option (shortest or efficient)
 */
export interface Route {
  /** GeoJSON LineString geometry defining the route path */
  geometry: LineStringGeometry;
  /** Route distance in kilometers */
  distance_km: number;
  /** Route duration in hours */
  duration_hours: number;
  /** CO₂ emissions in kilograms */
  co2_emissions_kg: number;
}

// ============================================================================
// API Request/Response Types
// ============================================================================

/**
 * Point with name and coordinates
 */
export interface PointIn {
  /** Location name (e.g., "Delhi", "Mumbai") */
  name: string;
  /** Latitude coordinate */
  lat: number;
  /** Longitude coordinate */
  lng: number;
}

/**
 * Request payload for route calculation
 * Sent to POST /api/v1/routes/calculate
 */
export interface RouteCalculationRequest {
  /** Origin location with coordinates */
  origin: PointIn;
  /** Destination location with coordinates */
  destination: PointIn;
  /** Cargo weight in kilograms (required, must be > 0) */
  cargo_weight_kg: number;
  /** Transport mode for route optimization */
  transport_mode: "land" | "sea" | "air";
}

/**
 * Efficient route with savings information
 */
export interface EfficientRoute extends Route {
  /** CO₂ savings compared to shortest route */
  savings: {
    /** CO₂ saved in kilograms */
    co2_saved_kg: number;
    /** Percentage of CO₂ saved */
    percentage: number;
  };
}

/**
 * Response from route calculation API
 * Contains two route options: shortest and efficient
 */
export interface RouteCalculationResponse {
  /** Route optimized for minimum distance */
  shortest_route: Route;
  /** Route optimized for lower CO₂ emissions */
  efficient_route: EfficientRoute;
  /** Search ID for tracking */
  search_id?: string;
  /** Comparison data */
  comparison?: any;
}

// ============================================================================
// Validation Helper Types
// ============================================================================

/**
 * Coordinate bounds for validation
 * Used to validate that coordinates are within valid geographic ranges
 */
export interface CoordinateBounds {
  /** Minimum valid longitude */
  minLongitude: -180;
  /** Maximum valid longitude */
  maxLongitude: 180;
  /** Minimum valid latitude */
  minLatitude: -90;
  /** Maximum valid latitude */
  maxLatitude: 90;
}

/**
 * Result of geometry validation
 * Contains validation status and optional error message
 */
export interface GeometryValidationResult {
  /** Whether the geometry is valid */
  isValid: boolean;
  /** Error message if validation failed */
  error?: string;
}

/**
 * Type guard to check if a value is a valid Coordinate
 */
export function isValidCoordinate(coord: unknown): coord is Coordinate {
  if (!Array.isArray(coord) || coord.length !== 2) {
    return false;
  }
  const [lng, lat] = coord;
  return (
    typeof lng === "number" &&
    typeof lat === "number" &&
    lng >= -180 &&
    lng <= 180 &&
    lat >= -90 &&
    lat <= 90
  );
}

/**
 * Type guard to check if a value is a valid LineStringGeometry
 */
export function isValidLineStringGeometry(
  geometry: unknown,
): geometry is LineStringGeometry {
  if (typeof geometry !== "object" || geometry === null) {
    return false;
  }

  const geo = geometry as Partial<LineStringGeometry>;

  // Check type is "LineString"
  if (geo.type !== "LineString") {
    return false;
  }

  // Check coordinates is a non-empty array
  if (!Array.isArray(geo.coordinates) || geo.coordinates.length < 2) {
    return false;
  }

  // Check all coordinates are valid
  return geo.coordinates.every(isValidCoordinate);
}

/**
 * Type guard to check if a value is a valid Route
 */
export function isValidRoute(route: unknown): route is Route {
  if (typeof route !== "object" || route === null) {
    return false;
  }

  const r = route as Partial<Route>;

  // Check geometry is valid
  if (!isValidLineStringGeometry(r.geometry)) {
    return false;
  }

  // Check numeric fields are positive numbers
  if (
    typeof r.distance_km !== "number" ||
    r.distance_km <= 0 ||
    typeof r.duration_hours !== "number" ||
    r.duration_hours <= 0 ||
    typeof r.co2_emissions_kg !== "number" ||
    r.co2_emissions_kg < 0
  ) {
    return false;
  }

  return true;
}

// ============================================================================
// Constant Bounds
// ============================================================================

/**
 * Standard coordinate bounds for validation
 */
export const COORDINATE_BOUNDS: CoordinateBounds = {
  minLongitude: -180,
  maxLongitude: 180,
  minLatitude: -90,
  maxLatitude: 90,
} as const;
