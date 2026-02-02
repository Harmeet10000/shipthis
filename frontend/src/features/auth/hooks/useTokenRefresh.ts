import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { authApi } from "../services/authApi";
import { useAuthStore } from "../store/authStore";
import { tokenManager } from "../services/tokenManager";
import { calculateTTL } from "../utils/tokenUtils";

export function useTokenRefresh() {
  const navigate = useNavigate();
  const { setTokens, clearAuth, refreshToken } = useAuthStore();

  return useMutation({
    mutationFn: () => {
      if (!refreshToken) {
        throw new Error("No refresh token available");
      }
      return authApi.refresh(refreshToken);
    },
    onSuccess: (tokens) => {
      // Calculate new token expiry
      const tokenExpiry = calculateTTL(tokens.access_token) + Date.now();

      // Update tokens in store
      setTokens(tokens, tokenExpiry);

      // Reschedule proactive refresh
      tokenManager.startProactiveRefresh(tokens.access_token, async () => {
        try {
          const newTokens = await authApi.refresh(tokens.refresh_token);
          const newExpiry = calculateTTL(newTokens.access_token) + Date.now();
          useAuthStore.getState().setTokens(newTokens, newExpiry);
        } catch (error) {
          useAuthStore.getState().clearAuth();
          navigate({ to: "/login" });
        }
      });
    },
    onError: () => {
      console.error("Token refresh failed");
      // Clear auth and redirect to login
      clearAuth();
      tokenManager.stopProactiveRefresh();
      navigate({ to: "/login" });
    },
  });
}
