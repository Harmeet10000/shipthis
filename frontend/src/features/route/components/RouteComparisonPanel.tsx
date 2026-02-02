import { useRouteStore } from "../store/routeStore";
import type { Route } from "../types/route.types";


// ============================================================================
// Helper Functions
// ============================================================================


function formatDistance(km: number | undefined): string {
  if (km === undefined || km === null || isNaN(km)) {
    return "N/A";
  }
  return `${km.toFixed(1)} km`;
}


function formatDuration(hours: number | undefined): string {
  if (hours === undefined || hours === null || isNaN(hours)) {
    return "N/A";
  }

  const wholeHours = Math.floor(hours);
  const minutes = Math.round((hours - wholeHours) * 60);

  if (wholeHours > 0 && minutes > 0) {
    return `${wholeHours} hr ${minutes} min`;
  } else if (wholeHours > 0) {
    return `${wholeHours} hr`;
  } else {
    return `${minutes} min`;
  }
}


function formatCO2(kg: number | undefined): string {
  if (kg === undefined || kg === null || isNaN(kg)) {
    return "N/A";
  }
  return `${kg.toFixed(2)} kg`;
}


function calculateCO2Savings(
  shortestRoute: Route,
  efficientRoute: Route,
): number {
  return Math.abs(
    shortestRoute.co2_emissions_kg - efficientRoute.co2_emissions_kg,
  );
}

// ============================================================================
// Sub-Components
// ============================================================================

interface RouteMetricsCardProps {
  title: string;
  route: Route;
  className?: string;
}

/**
 * Route Metrics Card
 *
 * Displays metrics for a single route including distance, duration, and CO₂ emissions.
 */
function RouteMetricsCard({
  title,
  route,
  className = "",
}: RouteMetricsCardProps) {
  return (
    <div className={`rounded-lg border bg-card p-4 ${className}`}>
      <h3 className="mb-3 text-lg font-semibold">{title}</h3>
      <div className="space-y-2">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Distance:</span>
          <span className="font-medium">
            {formatDistance(route.distance_km)}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Duration:</span>
          <span className="font-medium">
            {formatDuration(route.duration_hours)}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">CO₂ Emissions:</span>
          <span className="font-medium">
            {formatCO2(route.co2_emissions_kg)}
          </span>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// Main Component
// ============================================================================

/**
 * Route Comparison Panel
 *
 * Subscribes to routeStore and displays comparison of route metrics.
 * Highlights CO₂ savings when the efficient route has lower emissions.
 */
export function RouteComparisonPanel() {
  const { shortestRoute, efficientRoute } = useRouteStore();

  // console.log("RouteComparisonPanel - shortestRoute:", shortestRoute);
  // console.log("RouteComparisonPanel - efficientRoute:", efficientRoute);
// 
  // Don't render if no routes are available
  if (!shortestRoute || !efficientRoute) {
    return null;
  }

  // Validate route data has required fields
  const hasValidShortestRoute =
    shortestRoute.distance_km !== undefined &&
    shortestRoute.duration_hours !== undefined &&
    shortestRoute.co2_emissions_kg !== undefined;

  const hasValidEfficientRoute =
    efficientRoute.distance_km !== undefined &&
    efficientRoute.duration_hours !== undefined &&
    efficientRoute.co2_emissions_kg !== undefined;

  if (!hasValidShortestRoute || !hasValidEfficientRoute) {
    // console.error("Invalid route data:", { shortestRoute, efficientRoute });
    return (
      <div className="w-full rounded-lg border border-red-200 bg-red-50 p-4">
        <p className="text-sm text-red-800">
          Unable to display route comparison. Invalid route data received from
          server.
        </p>
      </div>
    );
  }

  // Calculate CO₂ savings
  const co2Savings = calculateCO2Savings(shortestRoute, efficientRoute);
  const efficientHasLowerEmissions =
    efficientRoute.co2_emissions_kg < shortestRoute.co2_emissions_kg;

  return (
    <div className="w-full space-y-4">
      <h2 className="text-2xl font-bold">Route Comparison</h2>

      {/* Route Metrics Cards */}
      <div className="grid gap-4 md:grid-cols-2">
        <RouteMetricsCard
          title="Shortest Route"
          route={shortestRoute}
          className="border-red-200 bg-red-50/50"
        />
        <RouteMetricsCard
          title="Efficient Route"
          route={efficientRoute}
          className="border-green-200 bg-green-50/50"
        />
      </div>

      {/* CO₂ Savings Display */}
      {co2Savings > 0 && (
        <div
          className={`rounded-lg border p-4 ${
            efficientHasLowerEmissions
              ? "border-green-300 bg-green-50 text-green-900"
              : "border-gray-300 bg-gray-50 text-gray-900"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="font-semibold">CO₂ Savings:</span>
            <span className="text-lg font-bold">
              {efficientHasLowerEmissions ? "−" : "+"}
              {formatCO2(co2Savings)}
            </span>
          </div>
          {efficientHasLowerEmissions && (
            <p className="mt-2 text-sm">
              The efficient route saves {formatCO2(co2Savings)} of CO₂ emissions
              compared to the shortest route.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
