import { apiClient } from "@/lib/axios";
import type {
  User,
  LoginRequest,
  RegisterRequest,
  AuthTokens,
} from "../types/auth.types";

/**
 * Auth API service for authentication-related requests
 */
export const authApi = {
  /**
   * Register a new user
   */
  register: async (data: RegisterRequest): Promise<User> => {
    const response = await apiClient.post<User>("/auth/register", data, {
      withCredentials: true,
    });
    // console.log(response.data);
    return response.data;
  },

  /**
   * Login with email and password
   */
  login: async (data: LoginRequest): Promise<AuthTokens> => {
    const response = await apiClient.post<AuthTokens>("/auth/login", data, {
      withCredentials: true,
    });
    // console.log("login response",response.data);
    return response.data;
  },

  /**
   * Refresh access token using refresh token
   */
  refresh: async (refreshToken: string): Promise<AuthTokens> => {
    console.log("Refreshing token with:", refreshToken);
    const response = await apiClient.post<AuthTokens>(
      "/auth/refresh",
      {},
      {
        headers: {
          Authorization: `Bearer ${refreshToken}`,
        },
        withCredentials: true,
      },
    );
    console.log(response.data);
    return response.data;
  },

  /**
   * Logout user
   */
  logout: async (): Promise<void> => {
    await apiClient.post("/auth/logout", {}, { withCredentials: true });
  },
};
