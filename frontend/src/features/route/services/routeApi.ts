import { apiClient } from "@/lib/axios";
import type {
  RouteCalculationRequest,
  RouteCalculationResponse,
} from "../types/route.types";
import { AxiosError } from "axios";


export const routeApi = {

  calculateRoutes: async (
    data: RouteCalculationRequest,
  ): Promise<RouteCalculationResponse> => {
    try {
    
      // console.log("Sending route calculation request:", data);
      const response = await apiClient.post<RouteCalculationResponse>(
        "/routes/calculate",
        data,
      );
      // console.log("Route calculation response:", response.data);
      // Return the response data which contains shortest_route and efficient_route
      return response.data;
    } catch (error) {
      // Transform axios errors into more user-friendly error messages
      throw handleRouteApiError(error);
    }
  },
};

/**
 * Custom error class for route API errors
 * Provides structured error information for better error handling
 */
export class RouteApiError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public originalError?: unknown,
  ) {
    super(message);
    this.name = "RouteApiError";
  }
}


function handleRouteApiError(error: unknown): RouteApiError {
  // Handle axios errors (API responded with error status)
  if (error instanceof AxiosError) {
    const statusCode = error.response?.status;
    const errorMessage = error.response?.data?.message || error.message;

    switch (statusCode) {
      case 400:
        return new RouteApiError(
          `Invalid route parameters: ${errorMessage}`,
          400,
          error,
        );
      case 401:
        // 401 is handled by axios interceptor (token refresh or redirect to login)
        // This should rarely be reached, but included for completeness
        return new RouteApiError(
          "Authentication required. Please log in.",
          401,
          error,
        );
      case 404:
        return new RouteApiError(
          "Route calculation service not found. Please contact support.",
          404,
          error,
        );
      case 500:
      case 502:
      case 503:
        return new RouteApiError(
          "Server error. Please try again later.",
          statusCode,
          error,
        );
      default:
        return new RouteApiError(
          `Route calculation failed: ${errorMessage}`,
          statusCode,
          error,
        );
    }
  }

  // Handle network errors (no response from server)
  if (error instanceof Error) {
    if (error.message.includes("Network Error")) {
      return new RouteApiError(
        "Network error. Please check your internet connection.",
        undefined,
        error,
      );
    }

    if (error.message.includes("timeout")) {
      return new RouteApiError(
        "Request timeout. Please try again.",
        undefined,
        error,
      );
    }
  }

  // Handle unknown errors
  return new RouteApiError(
    "An unexpected error occurred. Please try again.",
    undefined,
    error,
  );
}
