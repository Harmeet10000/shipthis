import { useNavigate } from "@tanstack/react-router";
import { useAuthStore } from "../store/authStore";
import { tokenManager } from "../services/tokenManager";
import { authApi } from "../services/authApi";

/**
 * Custom hook for accessing auth state and actions
 */
export function useAuth() {
  const navigate = useNavigate();
  const authState = useAuthStore();
  // console.log("Current auth state:", authState);

  const logout = async () => {
    try {
      // Call logout API
      await authApi.logout();
    } catch (error) {
      console.error("Logout API error:", error);
    } finally {
      // Clear auth state and stop token refresh
      authState.clearAuth();
      tokenManager.stopProactiveRefresh();
      navigate({ to: "/login" });
    }
  };

  return {
    // State
    user: authState.user,
    accessToken: authState.accessToken,
    refreshToken: authState.refreshToken,
    tokenExpiry: authState.tokenExpiry,
    isAuthenticated: authState.isAuthenticated,
    isLoading: authState.isLoading,

    // Actions
    setAuth: authState.setAuth,
    clearAuth: authState.clearAuth,
    setUser: authState.setUser,
    setTokens: authState.setTokens,
    setLoading: authState.setLoading,
    logout,

    // Helper functions
    getUser: () => authState.user,
    getAccessToken: () => authState.accessToken,
  };
}
