import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import {
  getMapboxToken,
  isMapboxTokenConfigured,
  DEFAULT_MAP_CONFIG,
} from "@/lib/mapbox";
import { useRouteStore } from "../store/routeStore";
import type { Route } from "../types/route.types";
import { parseGeoJSON } from "../utils/geoJsonValidation";

/**
 * Route layer IDs and source IDs for Mapbox
 */
const ROUTE_LAYER_IDS = {
  shortest: {
    source: "shortest-route-source",
    layer: "shortest-route-layer",
  },
  efficient: {
    source: "efficient-route-source",
    layer: "efficient-route-layer",
  },
} as const;

/**
 * Route styling configuration
 */
const ROUTE_STYLES = {
  shortest: {
    color: "#EF4444", // Red
    width: 4,
    dasharray: undefined, // Solid line
  },
  efficient: {
    color: "#22C55E", // Green
    width: 4,
    dasharray: [2, 2] as number[], // Dashed line
  },
} as const;


export const MapRenderer = () => {
  // Ref to the map container DOM element
  const mapContainerRef = useRef<HTMLDivElement>(null);

  // Ref to store the map instance
  const mapRef = useRef<mapboxgl.Map | null>(null);

  // State for tracking map initialization
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const [mapError, setMapError] = useState<string | null>(null);

  // Subscribe to route store for route data and visibility states
  const {
    shortestRoute,
    efficientRoute,
    shortestRouteVisible,
    efficientRouteVisible,
  } = useRouteStore();

 
  const removeRouteLayer = (
    map: mapboxgl.Map,
    layerId: string,
    sourceId: string,
  ) => {
    // Remove layer if it exists
    if (map.getLayer(layerId)) {
      map.removeLayer(layerId);
    }

    // Remove source if it exists
    if (map.getSource(sourceId)) {
      map.removeSource(sourceId);
    }
  };


  const addRouteLayer = (
    map: mapboxgl.Map,
    route: Route,
    layerId: string,
    sourceId: string,
    style: {
      color: string;
      width: number;
      dasharray?: number[];
    },
  ): boolean => {
    // Remove existing layer and source if present
    removeRouteLayer(map, layerId, sourceId);

    // Validate GeoJSON geometry before rendering (Requirement 9.4)
    const validationResult = parseGeoJSON(route.geometry);

    if (!validationResult.isValid) {
      // Log error for invalid geometry and skip rendering (Requirement 9.4, 10.3)
      // console.error(
      //   `Invalid GeoJSON geometry for route layer ${layerId}:`,
      //   validationResult.error,
      //   {
      //     geometry: route.geometry,
      //     layerId,
      //     sourceId,
      //   },
      // );
      // Gracefully skip rendering without crashing (Requirement 10.3)
      return false;
    }

    try {
      // Add GeoJSON source
      map.addSource(sourceId, {
        type: "geojson",
        data: {
          type: "Feature",
          properties: {},
          geometry: route.geometry,
        },
      });

      // Add line layer with styling
      const layerConfig: mapboxgl.LayerSpecification = {
        id: layerId,
        type: "line",
        source: sourceId,
        layout: {
          "line-join": "round",
          "line-cap": "round",
        },
        paint: {
          "line-color": style.color,
          "line-width": style.width,
        },
      };

      // Add dasharray if specified (for dashed lines)
      if (style.dasharray) {
        layerConfig.paint = {
          ...layerConfig.paint,
          "line-dasharray": style.dasharray,
        };
      }

      map.addLayer(layerConfig);

      // console.log(`Added route layer: ${layerId}`);
      return true;
    } catch (error) {
      // console.error(`Failed to add route layer ${layerId}:`, error);
      return false;
    }
  };

 
  const fitBoundsToRoutes = (map: mapboxgl.Map, routes: Route[]) => {
    // Handle case when no routes are visible - preserve current view
    if (routes.length === 0) {
      // console.log("No visible routes - preserving current map view");
      return;
    }

    try {
      // Create bounds object to accumulate all coordinates
      const bounds = new mapboxgl.LngLatBounds();

      // Add all coordinates from all visible routes to bounds
      routes.forEach((route) => {
        route.geometry.coordinates.forEach((coord) => {
          bounds.extend(coord as [number, number]);
        });
      });

      // Fit map to calculated bounds with padding and max zoom
      map.fitBounds(bounds, {
        padding: {
          top: 50,
          bottom: 50,
          left: 50,
          right: 50,
        },
        maxZoom: 15, // Prevent over-zooming
        duration: 1000, // Smooth animation
      });

      // console.log(`Fitted bounds to ${routes.length} visible route(s)`);
    } catch (error) {
      // console.error("Failed to fit bounds to routes:", error);
    }
  };

  // Initialize map on component mount
  useEffect(() => {
    // Validate Mapbox token is configured
    if (!isMapboxTokenConfigured()) {
      setMapError(
        "Mapbox token is not configured. Please set VITE_MAPBOX_TOKEN in your environment variables.",
      );
      return;
    }

    // Ensure container ref is available
    if (!mapContainerRef.current) {
      setMapError("Map container is not available.");
      return;
    }

    // Prevent re-initialization if map already exists
    if (mapRef.current) {
      return;
    }

    try {
      // Set Mapbox access token
      mapboxgl.accessToken = getMapboxToken();

      // Initialize Mapbox map instance
      const map = new mapboxgl.Map({
        container: mapContainerRef.current,
        style: DEFAULT_MAP_CONFIG.style,
        center: DEFAULT_MAP_CONFIG.center,
        zoom: DEFAULT_MAP_CONFIG.zoom,
      });

      // Add standard map controls
      // Navigation control (zoom buttons and compass)
      const navigationControl = new mapboxgl.NavigationControl({
        showCompass: true,
        showZoom: true,
      });
      map.addControl(navigationControl, "top-right");

      // Handle map load event
      map.on("load", () => {
        setIsMapLoaded(true);
        // console.log("Map loaded successfully");
      });

      // Handle map errors
      map.on("error", (e) => {
        // console.error("Map error:", e);
        setMapError("Failed to load map. Please try refreshing the page.");
      });

      // Store map instance in ref
      mapRef.current = map;
    } catch (error) {
      // console.error("Failed to initialize map:", error);
      setMapError(
        "Failed to initialize map. Please check your configuration and try again.",
      );
    }

    // Cleanup function - remove map instance on unmount
    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
        setIsMapLoaded(false);
      }
    };
  }, []); // Empty dependency array - only run once on mount

  // Effect to render routes when route data or visibility changes
  useEffect(() => {
    const map = mapRef.current;

    // Only proceed if map is loaded
    if (!map || !isMapLoaded) {
      return;
    }

    // Collect visible routes for bounds calculation
    const visibleRoutes: Route[] = [];

    // Handle shortest route
    if (shortestRoute && shortestRouteVisible) {
      addRouteLayer(
        map,
        shortestRoute,
        ROUTE_LAYER_IDS.shortest.layer,
        ROUTE_LAYER_IDS.shortest.source,
        ROUTE_STYLES.shortest,
      );
      visibleRoutes.push(shortestRoute);
    } else {
      // Remove shortest route layer if not visible or no data
      removeRouteLayer(
        map,
        ROUTE_LAYER_IDS.shortest.layer,
        ROUTE_LAYER_IDS.shortest.source,
      );
    }

    // Handle efficient route
    if (efficientRoute && efficientRouteVisible) {
      addRouteLayer(
        map,
        efficientRoute,
        ROUTE_LAYER_IDS.efficient.layer,
        ROUTE_LAYER_IDS.efficient.source,
        ROUTE_STYLES.efficient,
      );
      visibleRoutes.push(efficientRoute);
    } else {
      // Remove efficient route layer if not visible or no data
      removeRouteLayer(
        map,
        ROUTE_LAYER_IDS.efficient.layer,
        ROUTE_LAYER_IDS.efficient.source,
      );
    }

    // Adjust map bounds to fit all visible routes
    // This handles:
    // - No routes visible: preserves current view
    // - One route visible: fits to that single route
    // - Both routes visible: fits to both routes
    fitBoundsToRoutes(map, visibleRoutes);
  }, [
    shortestRoute,
    efficientRoute,
    shortestRouteVisible,
    efficientRouteVisible,
    isMapLoaded,
  ]);

  // Render error message if map initialization failed
  if (mapError) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-gray-100">
        <div className="rounded-lg bg-white p-6 shadow-md">
          <div className="mb-2 flex items-center gap-2 text-red-600">
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <h3 className="font-semibold">Map Error</h3>
          </div>
          <p className="text-sm text-gray-600">{mapError}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-full w-full">
      {/* Map container */}
      <div ref={mapContainerRef} className="h-full w-full" />

      {/* Loading indicator */}
      {!isMapLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 bg-opacity-75">
          <div className="flex flex-col items-center gap-2">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-blue-600" />
            <p className="text-sm text-gray-600">Loading map...</p>
          </div>
        </div>
      )}
    </div>
  );
};
