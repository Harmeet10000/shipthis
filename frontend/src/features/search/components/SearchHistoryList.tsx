import { useState } from "react";
import { useSearchHistory, useDeleteSearch } from "../hooks/useSearchHistory";
import type { SearchHistoryParams } from "../types/search.types";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Trash2 } from "lucide-react";

interface SearchHistoryListProps {
  onSelectSearch?: (searchId: string) => void;
}

/**
 * Search History List Component
 *
 * Displays paginated list of search history with filtering options
 */
export function SearchHistoryList({ onSelectSearch }: SearchHistoryListProps) {
  const [params, setParams] = useState<SearchHistoryParams>({
    page: 1,
    limit: 20,
    sort: "-created_at",
    mode: null,
  });

  const { data, isLoading, error } = useSearchHistory(params);
  const deleteSearch = useDeleteSearch();

  const handleModeChange = (value: string) => {
    setParams({
      ...params,
      mode: value === "all" ? null : (value as "land" | "sea" | "air"),
      page: 1,
    });
  };

  const handleSortChange = (value: string) => {
    setParams({
      ...params,
      sort: value,
      page: 1,
    });
  };

  const handlePageChange = (newPage: number) => {
    setParams({
      ...params,
      page: newPage,
    });
  };

  const handleDelete = (e: React.MouseEvent, searchId: string) => {
    e.stopPropagation();
    if (confirm("Are you sure you want to delete this search?")) {
      deleteSearch.mutate(searchId);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatCO2Savings = (shortest: number, efficient: number) => {
    const savings = shortest - efficient;
    return savings > 0 ? `${savings.toFixed(2)} kg saved` : "No savings";
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-gray-500">Loading search history...</div>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertDescription>
          Failed to load search history. Please try again.
        </AlertDescription>
      </Alert>
    );
  }

  if (!data || data.data.length === 0) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center text-gray-500">
          <p className="text-lg font-medium">No search history found</p>
          <p className="text-sm">Start by calculating a route</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex gap-4">
        <div className="flex-1">
          <label className="text-sm font-medium mb-2 block">
            Transport Mode
          </label>
          <Select value={params.mode || "all"} onValueChange={handleModeChange}>
            <SelectTrigger>
              <SelectValue placeholder="All modes" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All modes</SelectItem>
              <SelectItem value="land">Land</SelectItem>
              <SelectItem value="sea">Sea</SelectItem>
              <SelectItem value="air">Air</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex-1">
          <label className="text-sm font-medium mb-2 block">Sort By</label>
          <Select value={params.sort} onValueChange={handleSortChange}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="-created_at">Newest First</SelectItem>
              <SelectItem value="created_at">Oldest First</SelectItem>
              <SelectItem value="-cargo_weight_kg">Highest Weight</SelectItem>
              <SelectItem value="cargo_weight_kg">Lowest Weight</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Search List */}
      <div className="space-y-3">
        {data.data.map((search) => (
          <Card
            key={search.id}
            className="p-4 hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => onSelectSearch?.(search.id)}
          >
            <div className="space-y-2">
              {/* Route Info */}
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-semibold text-lg">
                    {search.origin.name} → {search.destination.name}
                  </p>
                  <p className="text-sm text-gray-500">
                    {formatDate(search.created_at)}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded">
                    {search.transport_mode.toUpperCase()}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => handleDelete(e, search.id)}
                    disabled={deleteSearch.isPending}
                    className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Metrics */}
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <p className="text-gray-500">Cargo Weight</p>
                  <p className="font-medium">{search.cargo_weight_kg} kg</p>
                </div>
                <div>
                  <p className="text-gray-500">Distance</p>
                  <p className="font-medium">
                    {search.shortest_route.distance_km.toFixed(1)} km
                  </p>
                </div>
                <div>
                  <p className="text-gray-500">CO₂ Savings</p>
                  <p className="font-medium text-green-600">
                    {formatCO2Savings(
                      search.shortest_route.co2_emissions_kg,
                      search.efficient_route.co2_emissions_kg,
                    )}
                  </p>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Pagination */}
      {data.pagination.total_pages > 1 && (
        <div className="flex justify-between items-center pt-4">
          <Button
            variant="outline"
            onClick={() => handlePageChange(params.page! - 1)}
            disabled={params.page === 1}
          >
            Previous
          </Button>
          <span className="text-sm text-gray-600">
            Page {data.pagination.page} of {data.pagination.total_pages}
          </span>
          <Button
            variant="outline"
            onClick={() => handlePageChange(params.page! + 1)}
            disabled={!data.pagination.has_next}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}
