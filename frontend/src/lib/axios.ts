import axios, { AxiosError } from "axios";
import type { AxiosResponse, InternalAxiosRequestConfig } from "axios";

// Get API URL from environment variable or use default
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Create axios instance
export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // Important for cookies
});

// Helper to get auth store (lazy loaded to avoid circular dependency)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let authStoreCache: any = null;
const getAuthStore = async () => {
  if (!authStoreCache) {
    const module = await import("@/features/auth/store/authStore");
    authStoreCache = module.useAuthStore;
  }
  return authStoreCache;
};

// Track refresh failures to prevent infinite loops
let refreshFailureCount = 0;
const MAX_REFRESH_FAILURES = 5;
let isRefreshing = false;
let failedRefreshRequests: Array<{
  resolve: (value: unknown) => void;
  reject: (reason?: unknown) => void;
}> = [];

// Request interceptor
apiClient.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    const useAuthStore = await getAuthStore();
    const accessToken = useAuthStore.getState().accessToken;

    if (accessToken && config.headers) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  },
);

// Response interceptor
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    // Reset failure count on successful response (but not for refresh endpoint)
    if (!response.config.url?.includes("/auth/refresh")) {
      refreshFailureCount = 0;
    }
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    // Handle 401 errors and attempt token refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      // Check if we've exceeded max refresh failures
      if (refreshFailureCount >= MAX_REFRESH_FAILURES) {
        console.error(
          "Max refresh token failures reached. Redirecting to login.",
        );
        const useAuthStore = await getAuthStore();
        useAuthStore.getState().clearAuth();

        // Clear the queue
        failedRefreshRequests.forEach((req) =>
          req.reject(new Error("Max refresh failures reached")),
        );
        failedRefreshRequests = [];

        if (window.location.pathname !== "/login") {
          window.location.href = "/login";
        }
        return Promise.reject(
          new Error("Max refresh token failures reached. Please login again."),
        );
      }

      originalRequest._retry = true;

      // If already refreshing, queue this request
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedRefreshRequests.push({ resolve, reject });
        })
          .then(() => {
            // Retry with the new token
            return apiClient(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      isRefreshing = true;

      try {
        const useAuthStore = await getAuthStore();
        const refreshToken = useAuthStore.getState().refreshToken;

        if (!refreshToken) {
          throw new Error("No refresh token available");
        }

        // Attempt to refresh token
        const response = await apiClient.post(
          "/auth/refresh",
          {},
          {
            headers: {
              Authorization: `Bearer ${refreshToken}`,
            },
            withCredentials: true,
          },
        );
        const tokens = response.data;

        // Reset failure count on successful refresh
        refreshFailureCount = 0;
        isRefreshing = false;

        // Update tokens in store
        const { jwtDecode } = await import("jwt-decode");
        const payload = jwtDecode<{ exp: number }>(tokens.access_token);
        const tokenExpiry = payload.exp * 1000;

        useAuthStore.getState().setTokens(tokens, tokenExpiry);

        // Retry all queued requests
        failedRefreshRequests.forEach((req) => req.resolve(tokens));
        failedRefreshRequests = [];

        // Retry original request with new token
        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${tokens.access_token}`;
        }

        return apiClient(originalRequest);
      } catch (refreshError) {
        // Increment failure count
        refreshFailureCount++;
        isRefreshing = false;

        console.error(
          `Token refresh failed (${refreshFailureCount}/${MAX_REFRESH_FAILURES})`,
        );

        // Reject all queued requests
        failedRefreshRequests.forEach((req) => req.reject(refreshError));
        failedRefreshRequests = [];

        // If we've hit the limit, clear auth and redirect
        if (refreshFailureCount >= MAX_REFRESH_FAILURES) {
          const useAuthStore = await getAuthStore();
          useAuthStore.getState().clearAuth();

          if (window.location.pathname !== "/login") {
            window.location.href = "/login";
          }
        }

        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  },
);

export default apiClient;
