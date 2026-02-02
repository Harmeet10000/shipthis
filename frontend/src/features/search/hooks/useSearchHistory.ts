import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { searchApi } from "../services/searchApi";
import type { SearchHistoryParams } from "../types/search.types";
import { toast } from "sonner";

/**
 * Hook for fetching search history
 */
export function useSearchHistory(params: SearchHistoryParams = {}) {
  return useQuery({
    queryKey: ["searchHistory", params],
    queryFn: () => searchApi.getSearchHistory(params),
    staleTime: 30000, // 30 seconds
  });
}

/**
 * Hook for fetching search statistics
 */
export function useSearchStats() {
  return useQuery({
    queryKey: ["searchStats"],
    queryFn: () => searchApi.getSearchStats(),
    staleTime: 60000, // 1 minute
  });
}

/**
 * Hook for deleting a search
 */
export function useDeleteSearch() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (searchId: string) => searchApi.deleteSearch(searchId),
    onSuccess: () => {
      // Invalidate search history queries to refetch
      queryClient.invalidateQueries({ queryKey: ["searchHistory"] });
      queryClient.invalidateQueries({ queryKey: ["searchStats"] });
      toast.success("Search deleted successfully");
    },
    onError: () => {
      toast.error("Failed to delete search");
    },
  });
}
