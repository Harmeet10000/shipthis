import { apiClient } from "@/lib/axios";
import type {
  SearchHistoryParams,
  SearchHistoryResponse,
  SearchStatsResponse,
} from "../types/search.types";
import { AxiosError } from "axios";

/**
 * Search API service for search history requests
 */
export const searchApi = {
  /**
   * Get search history with pagination and filtering
   */
  getSearchHistory: async (
    params: SearchHistoryParams = {},
  ): Promise<SearchHistoryResponse> => {
    try {
      const queryParams = new URLSearchParams();

      if (params.page) queryParams.append("page", params.page.toString());
      if (params.limit) queryParams.append("limit", params.limit.toString());
      if (params.sort) queryParams.append("sort", params.sort);
      if (params.mode) queryParams.append("mode", params.mode);

      const response = await apiClient.get<SearchHistoryResponse>(
        `/searches?${queryParams.toString()}`,
      );

      return response.data;
    } catch (error) {
      throw handleSearchApiError(error);
    }
  },

  /**
   * Get search statistics
   */
  getSearchStats: async (): Promise<SearchStatsResponse> => {
    try {
      const response =
        await apiClient.get<SearchStatsResponse>("/searches/stats");
      return response.data;
    } catch (error) {
      throw handleSearchApiError(error);
    }
  },

  /**
   * Delete a search from history
   */
  deleteSearch: async (searchId: string): Promise<void> => {
    try {
      await apiClient.delete(`/searches/${searchId}`);
    } catch (error) {
      throw handleSearchApiError(error);
    }
  },
};

/**
 * Custom error class for search API errors
 */
export class SearchApiError extends Error {
  statusCode?: number;
  originalError?: unknown;

  constructor(message: string, statusCode?: number, originalError?: unknown) {
    super(message);
    this.name = "SearchApiError";
    this.statusCode = statusCode;
    this.originalError = originalError;
  }
}

/**
 * Handle and transform search API errors
 */
function handleSearchApiError(error: unknown): SearchApiError {
  if (error instanceof AxiosError) {
    const statusCode = error.response?.status;
    const errorMessage = error.response?.data?.message || error.message;

    switch (statusCode) {
      case 400:
        return new SearchApiError(
          `Invalid request: ${errorMessage}`,
          400,
          error,
        );
      case 401:
        return new SearchApiError(
          "Authentication required. Please log in.",
          401,
          error,
        );
      case 404:
        return new SearchApiError("Search not found.", 404, error);
      case 500:
      case 502:
      case 503:
        return new SearchApiError(
          "Server error. Please try again later.",
          statusCode,
          error,
        );
      default:
        return new SearchApiError(
          `Request failed: ${errorMessage}`,
          statusCode,
          error,
        );
    }
  }

  if (error instanceof Error) {
    if (error.message.includes("Network Error")) {
      return new SearchApiError(
        "Network error. Please check your internet connection.",
        undefined,
        error,
      );
    }

    if (error.message.includes("timeout")) {
      return new SearchApiError(
        "Request timeout. Please try again.",
        undefined,
        error,
      );
    }
  }

  return new SearchApiError(
    "An unexpected error occurred. Please try again.",
    undefined,
    error,
  );
}
