import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  MapRenderer,
  RouteCalculationForm,
  RouteComparisonPanel,
} from "@/features/route/components";
import { SearchHistoryList } from "@/features/search/components";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/_authenticated/search")({
  component: SearchPage,
});

/**
 * Search Page Component
 *
 * Route visualization page that integrates:
 * - RouteCalculationForm: For submitting route calculation requests
 * - MapRenderer: For displaying routes on an interactive map
 * - RouteComparisonPanel: For comparing route metrics
 * - SearchHistoryList: For viewing past searches
 */
function SearchPage() {
  const [showHistory, setShowHistory] = useState(false);

  return (
    <div className="flex h-screen flex-col">
      {/* Header */}
      <div className="border-b bg-white p-4 shadow-sm">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">Route Search</h1>
            <p className="text-sm text-gray-600">
              Calculate and compare route options with CO₂ emissions
            </p>
          </div>
          <Button
            variant={showHistory ? "default" : "outline"}
            onClick={() => setShowHistory(!showHistory)}
          >
            {showHistory ? "Back to Map" : "See History"}
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {showHistory ? (
          /* History View */
          <div className="w-full overflow-y-auto bg-gray-50 p-6">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-xl font-bold mb-4">Search History</h2>
              <SearchHistoryList />
            </div>
          </div>
        ) : (
          /* Map View */
          <>
            {/* Left Panel: Form and Comparison */}
            <div className="w-full md:w-1/3 overflow-y-auto border-r bg-gray-50 p-4 space-y-6">
              <RouteCalculationForm />
              <RouteComparisonPanel />
            </div>

            {/* Right Panel: Map */}
            <div className="flex-1">
              <MapRenderer />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
