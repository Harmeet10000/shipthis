/**
 * GeoJSON Validation Utilities
 *
 * Provides validation functions for GeoJSON geometry data used in route visualization.
 * Validates geometry type, coordinates, and coordinate pairs according to GeoJSON spec.
 *
 * Requirements: 9.1, 9.2, 9.3, 9.5
 */

import type {
  Coordinate,
  LineStringGeometry,
  GeometryValidationResult,
} from "../types/route.types";

// ============================================================================
// Validation Functions
// ============================================================================

/**
 * Validates that the geometry type is "LineString"
 *
 * @param geometryType - The geometry type to validate
 * @returns true if the type is "LineString", false otherwise
 *
 * Requirement 9.1: Validate that the geometry type is "LineString"
 */
export function validateGeometryType(
  geometryType: unknown,
): geometryType is "LineString" {
  return geometryType === "LineString";
}

/**
 * Validates that coordinates array is non-empty and has at least 2 points
 *
 * @param coordinates - The coordinates array to validate
 * @returns true if coordinates is a non-empty array with at least 2 points
 *
 * Requirement 9.2: Validate that coordinates is a non-empty array with minimum 2 points
 * Requirement 9.5: Handle coordinate arrays of any valid length (minimum 2 points)
 */
export function validateCoordinates(
  coordinates: unknown,
): coordinates is Coordinate[] {
  // Check if coordinates is an array
  if (!Array.isArray(coordinates)) {
    return false;
  }

  // Check if array is non-empty and has at least 2 points
  if (coordinates.length < 2) {
    return false;
  }

  return true;
}

/**
 * Validates that a coordinate pair contains valid longitude and latitude values
 *
 * @param coord - The coordinate pair to validate [longitude, latitude]
 * @returns true if coordinate pair is valid
 *
 * Requirement 9.3: Validate that each coordinate pair contains longitude [-180, 180] and latitude [-90, 90]
 */
export function validateCoordinatePair(coord: unknown): coord is Coordinate {
  // Check if coord is an array
  if (!Array.isArray(coord)) {
    return false;
  }

  // Check if array has exactly 2 elements
  if (coord.length !== 2) {
    return false;
  }

  const [lng, lat] = coord;

  // Check if both elements are numbers
  if (typeof lng !== "number" || typeof lat !== "number") {
    return false;
  }

  // Check if longitude is in valid range [-180, 180]
  if (lng < -180 || lng > 180) {
    return false;
  }

  // Check if latitude is in valid range [-90, 90]
  if (lat < -90 || lat > 90) {
    return false;
  }

  return true;
}

/**
 * Parses and validates GeoJSON LineString geometry
 *
 * @param geometry - The geometry object to validate
 * @returns Validation result with isValid flag and optional error message
 *
 * Requirements: 9.1, 9.2, 9.3, 9.5
 */
export function parseGeoJSON(geometry: unknown): GeometryValidationResult {
  // Check if geometry is an object
  if (typeof geometry !== "object" || geometry === null) {
    return {
      isValid: false,
      error: "Geometry must be an object",
    };
  }

  const geo = geometry as Partial<LineStringGeometry>;

  // Validate geometry type is "LineString" (Requirement 9.1)
  if (!validateGeometryType(geo.type)) {
    return {
      isValid: false,
      error: `Invalid geometry type: expected "LineString", got "${geo.type}"`,
    };
  }

  // Validate coordinates is a non-empty array with at least 2 points (Requirement 9.2, 9.5)
  if (!validateCoordinates(geo.coordinates)) {
    return {
      isValid: false,
      error: "Coordinates must be a non-empty array with at least 2 points",
    };
  }

  // Validate each coordinate pair (Requirement 9.3)
  for (let i = 0; i < geo.coordinates.length; i++) {
    const coord = geo.coordinates[i];
    if (!validateCoordinatePair(coord)) {
      return {
        isValid: false,
        error: `Invalid coordinate pair at index ${i}: longitude must be in [-180, 180] and latitude must be in [-90, 90]`,
      };
    }
  }

  // All validations passed
  return {
    isValid: true,
  };
}

/**
 * Type guard that validates and narrows geometry to LineStringGeometry
 *
 * @param geometry - The geometry object to validate
 * @returns true if geometry is a valid LineStringGeometry
 */
export function isValidLineStringGeometry(
  geometry: unknown,
): geometry is LineStringGeometry {
  const result = parseGeoJSON(geometry);
  return result.isValid;
}
