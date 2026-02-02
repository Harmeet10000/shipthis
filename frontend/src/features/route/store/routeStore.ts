import { create } from "zustand";
import type { Route, RouteCalculationResponse } from "../types/route.types";

/**
 * Route Store State Interface
 *
 * Manages route data, loading states, error states, and visibility toggles
 * for the route visualization feature.
 */
export interface RouteState {
  // Route Data
  /** The shortest route option (optimized for minimum distance) */
  shortestRoute: Route | null;
  /** The efficient route option (optimized for lower CO₂ emissions) */
  efficientRoute: Route | null;

  // UI State
  /** Loading state for route calculation requests */
  isLoading: boolean;
  /** Error message from failed route calculations */
  error: string | null;

  // Visibility State
  /** Whether the shortest route is visible on the map */
  shortestRouteVisible: boolean;
  /** Whether the efficient route is visible on the map */
  efficientRouteVisible: boolean;

  // Actions
  /** Update both routes with data from API response */
  setRoutes: (data: RouteCalculationResponse) => void;
  /** Clear all route data and reset to initial state */
  clearRoutes: () => void;
  /** Toggle visibility of the shortest route */
  toggleShortestRoute: () => void;
  /** Toggle visibility of the efficient route */
  toggleEfficientRoute: () => void;
  /** Set loading state */
  setLoading: (loading: boolean) => void;
  /** Set error message */
  setError: (error: string | null) => void;
}

/**
 * Initial state for the route store
 */
const initialState = {
  shortestRoute: null,
  efficientRoute: null,
  isLoading: false,
  error: null,
  shortestRouteVisible: true,
  efficientRouteVisible: true,
};

/**
 * Route Store
 *
 * Zustand store for managing route visualization state.
 * Provides centralized state management for route data, loading states,
 * error handling, and route visibility toggles.
 *
 * @example
 * ```tsx
 * // In a component
 * const { shortestRoute, efficientRoute, setRoutes, isLoading } = useRouteStore();
 *
 * // Update routes from API response
 * setRoutes(apiResponse);
 *
 * // Clear routes
 * clearRoutes();
 *
 * // Toggle route visibility
 * toggleShortestRoute();
 * ```
 */
export const useRouteStore = create<RouteState>()((set) => ({
  // Initial State
  ...initialState,

  // Actions
  setRoutes: (data: RouteCalculationResponse) => {
    // console.log("RouteStore.setRoutes - Received data:", data);
    // console.log("RouteStore.setRoutes - shortest_route:", data.shortest_route);
    // console.log(
    //   "RouteStore.setRoutes - efficient_route:",
    //   data.efficient_route,
    // );

    set({
      shortestRoute: data.shortest_route,
      efficientRoute: data.efficient_route,
      error: null, // Clear any previous errors
      isLoading: false, // Request completed successfully
      // Reset visibility to show both routes by default
      shortestRouteVisible: true,
      efficientRouteVisible: true,
    });
  },

  clearRoutes: () => {
    set(initialState);
  },

  toggleShortestRoute: () => {
    set((state) => ({
      shortestRouteVisible: !state.shortestRouteVisible,
    }));
  },

  toggleEfficientRoute: () => {
    set((state) => ({
      efficientRouteVisible: !state.efficientRouteVisible,
    }));
  },

  setLoading: (loading: boolean) => {
    set({ isLoading: loading });
  },

  setError: (error: string | null) => {
    set({
      error,
      isLoading: false, // Stop loading when error occurs
    });
  },
}));
