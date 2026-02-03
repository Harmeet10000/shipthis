/**
 * Mapbox GL JS Configuration
 *
 * This module exports the Mapbox access token from environment variables
 * and provides configuration for Mapbox GL JS integration.
 */

/**
 * Mapbox public access token from environment variables
 * This token is required for initializing Mapbox GL JS maps
 */
export const MAPBOX_ACCESS_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN as string;

/**
 * Default map configuration
 */
export const DEFAULT_MAP_CONFIG = {
  style: "mapbox://styles/mapbox/streets-v12",
  center: [0, 0] as [number, number],
  zoom: 2,
} as const;

/**
 * Validates that the Mapbox token is configured
 * @returns true if token is configured, false otherwise
 */
export const isMapboxTokenConfigured = (): boolean => {
  return Boolean(
    MAPBOX_ACCESS_TOKEN && MAPBOX_ACCESS_TOKEN !== "your_mapbox_token_here",
  );
};

/**
 * Gets the Mapbox access token with validation
 * @throws Error if token is not configured
 * @returns The Mapbox access token
 */
export const getMapboxToken = (): string => {
  if (!isMapboxTokenConfigured()) {
    throw new Error(
      "Mapbox token is not configured. Please set VITE_MAPBOX_TOKEN in your environment variables.",
    );
  }
  return MAPBOX_ACCESS_TOKEN;
};
