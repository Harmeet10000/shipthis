import mapboxgl from "mapbox-gl";
import { getMapboxToken } from "@/lib/mapbox";
import type { PointIn } from "../types/route.types";

/**
 * Geocoding Service
 *
 * Provides functions to convert location names to geographic coordinates
 * using the Mapbox Geocoding API.
 */

export async function geocodePlace(query: string): Promise<PointIn> {
  try {
    // Ensure Mapbox token is set
    if (!mapboxgl.accessToken) {
      mapboxgl.accessToken = getMapboxToken();
    }

    // Build Mapbox Geocoding API URL
    const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json?access_token=${mapboxgl.accessToken}&limit=1`;

    // Fetch geocoding results
    const res = await fetch(url);

    if (!res.ok) {
      throw new Error(`Geocoding API error: ${res.status} ${res.statusText}`);
    }

    const data = await res.json();

    // Check if any results were found
    if (!data.features || data.features.length === 0) {
      throw new Error(`Place not found: "${query}"`);
    }

    // Extract first result
    const feature = data.features[0];

    // Return formatted PointIn object
    return {
      name: feature.place_name,
      lng: feature.center[0],
      lat: feature.center[1],
    };
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error(`Failed to geocode location: ${query}`);
  }
}

export async function geocodePlaces(queries: string[]): Promise<PointIn[]> {
  const promises = queries.map((query) => geocodePlace(query));
  return Promise.all(promises);
}

/**
 * Custom error class for geocoding errors
 */
export class GeocodingError extends Error {
  public query: string;

  constructor(message: string, query: string) {
    super(message);
    this.name = "GeocodingError";
    this.query = query;
  }
}
