/**
 * Search History Types
 *
 * Type definitions for search history listing and filtering.
 */

// ============================================================================
// Search Data Models
// ============================================================================

export interface Location {
  name: string;
  coordinates: [number, number]; // [longitude, latitude]
}

export interface RouteInfo {
  distance_km: number;
  duration_hours: number;
  co2_emissions_kg: number;
  geometry: {
    type: "LineString";
    coordinates: [number, number][];
  };
}

export interface Metadata {
  api_version: string;
  calculation_method: string;
}

export interface SearchHistoryItem {
  id: string;
  user_id: string;
  origin: Location;
  destination: Location;
  cargo_weight_kg: number;
  transport_mode: "land" | "sea" | "air";
  shortest_route: RouteInfo;
  efficient_route: RouteInfo;
  metadata: Metadata;
  created_at: string;
}

// ============================================================================
// API Request/Response Types
// ============================================================================

export interface SearchHistoryParams {
  page?: number;
  limit?: number;
  sort?: string;
  mode?: "land" | "sea" | "air" | null;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  total_pages: number;
  has_next: boolean;
}

export interface SearchHistoryResponse {
  data: SearchHistoryItem[];
  pagination: Pagination;
}

export interface SearchStatsResponse {
  total_searches: number;
  total_co2_saved: number;
  avg_cargo_weight: number;
}
