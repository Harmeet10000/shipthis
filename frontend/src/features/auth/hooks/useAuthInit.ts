import { useEffect, useState } from "react";
import { useAuthStore } from "../store/authStore";
import { tokenManager } from "../services/tokenManager";
import { authApi } from "../services/authApi";
import {
  isTokenExpired,
  calculateTTL,
  extractUserFromToken,
} from "../utils/tokenUtils";
import type { User } from "../types/auth.types";

/**
 * Hook to initialize authentication state on app load
 */
export function useAuthInit() {
  const [isInitialized, setIsInitialized] = useState(false);
  const { accessToken, refreshToken, clearAuth, setTokens, setUser } =
    useAuthStore();

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

              // Extract and update user from new token
              const userFromToken = extractUserFromToken(
                newTokens.access_token,
              );
              const user: User = {
                _id: userFromToken._id || "",
                email: userFromToken.email || "",
                full_name: userFromToken.full_name || "",
                created_at:
                  userFromToken.created_at || new Date().toISOString(),
                updated_at:
                  userFromToken.updated_at || new Date().toISOString(),
              };

              setTokens(newTokens, tokenExpiry);
              setUser(user);

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
          // Token is still valid, ensure user is populated from token
          const currentUser = useAuthStore.getState().user;
          if (!currentUser || !currentUser._id) {
            const userFromToken = extractUserFromToken(accessToken);
            const user: User = {
              _id: userFromToken._id || "",
              email: userFromToken.email || "",
              full_name: userFromToken.full_name || "",
              created_at: userFromToken.created_at || new Date().toISOString(),
              updated_at: userFromToken.updated_at || new Date().toISOString(),
            };
            setUser(user);
          }

          // Start proactive refresh
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
