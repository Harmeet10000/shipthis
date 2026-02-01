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
let authStoreCache: any = null;
const getAuthStore = async () => {
  if (!authStoreCache) {
    const module = await import("@/features/auth/store/authStore");
    authStoreCache = module.useAuthStore;
  }
  return authStoreCache;
};

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
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    // Handle 401 errors and attempt token refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

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
          },
        );
        const tokens = response.data;

        // Update tokens in store
        const { jwtDecode } = await import("jwt-decode");
        const payload = jwtDecode<{ exp: number }>(tokens.access_token);
        const tokenExpiry = payload.exp * 1000;

        useAuthStore.getState().setTokens(tokens, tokenExpiry);

        // Retry original request with new token
        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${tokens.access_token}`;
        }

        return apiClient(originalRequest);
      } catch (refreshError) {
        const useAuthStore = await getAuthStore();
        useAuthStore.getState().clearAuth();
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  },
);

export default apiClient;
