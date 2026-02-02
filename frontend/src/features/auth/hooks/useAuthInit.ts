import { useEffect, useState } from "react";
import { useAuthStore } from "../store/authStore";
import { tokenManager } from "../services/tokenManager";
import { authApi } from "../services/authApi";
import { isTokenExpired, calculateTTL } from "../utils/tokenUtils";

/**
 * Hook to initialize authentication state on app load
 */
export function useAuthInit() {
  const [isInitialized, setIsInitialized] = useState(false);
  const { accessToken, refreshToken, clearAuth, setTokens } = useAuthStore();

  useEffect(() => {
    const initAuth = async () => {
      try {
        // Check if we have stored tokens
        if (!accessToken || !refreshToken) {
          setIsInitialized(true);
          return;
        }

        // Check if access token is expired
        if (isTokenExpired(accessToken)) {
          // Try to refresh only if we have a valid refresh token
          if (!isTokenExpired(refreshToken)) {
            try {
              const newTokens = await authApi.refresh(refreshToken);
              const tokenExpiry =
                calculateTTL(newTokens.access_token) + Date.now();
              setTokens(newTokens, tokenExpiry);

              // Start proactive refresh
              tokenManager.startProactiveRefresh(
                newTokens.access_token,
                async () => {
                  try {
                    const tokens = await authApi.refresh(
                      newTokens.refresh_token,
                    );
                    const expiry =
                      calculateTTL(tokens.access_token) + Date.now();
                    useAuthStore.getState().setTokens(tokens, expiry);
                  } catch {
                    useAuthStore.getState().clearAuth();
                  }
                },
              );
            } catch {
              // Refresh failed, clear auth silently
              clearAuth();
            }
          } else {
            // Refresh token is also expired, clear auth
            clearAuth();
          }
        } else {
          // Token is still valid, start proactive refresh
          tokenManager.startProactiveRefresh(accessToken, async () => {
            try {
              const tokens = await authApi.refresh(refreshToken);
              const expiry = calculateTTL(tokens.access_token) + Date.now();
              useAuthStore.getState().setTokens(tokens, expiry);
            } catch {
              useAuthStore.getState().clearAuth();
            }
          });
        }
      } catch (error) {
        // Silent fail - just clear auth
        clearAuth();
      } finally {
        setIsInitialized(true);
      }
    };

    initAuth();
  }, []); // Run only once on mount

  return { isInitialized };
}
