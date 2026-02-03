import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { authApi } from "../services/authApi";
import { useAuthStore } from "../store/authStore";
import { tokenManager } from "../services/tokenManager";
import { calculateTTL, extractUserFromToken } from "../utils/tokenUtils";
import { REDIRECT_URL_KEY } from "../utils/constants";
import type { LoginRequest, User } from "../types/auth.types";

export function useLogin() {
  const navigate = useNavigate();
  const { setAuth, setLoading } = useAuthStore();

  return useMutation({
    mutationFn: (data: LoginRequest) => authApi.login(data),
    onMutate: () => {
      setLoading(true);
    },
    onSuccess: async (tokens) => {
      try {
        // Calculate token expiry
        const tokenExpiry = calculateTTL(tokens.access_token) + Date.now();

        // Extract user information from JWT token
        const userFromToken = extractUserFromToken(tokens.access_token);

        // Create user object with data from token
        const user: User = {
          _id: userFromToken._id || "",
          email: userFromToken.email || "",
          full_name: userFromToken.full_name || "",
          created_at: userFromToken.created_at || new Date().toISOString(),
          updated_at: userFromToken.updated_at || new Date().toISOString(),
        };

        // Update auth store
        setAuth(tokens, user, tokenExpiry);

        // Start proactive token refresh
        tokenManager.startProactiveRefresh(tokens.access_token, async () => {
          try {
            const newTokens = await authApi.refresh(tokens.refresh_token);
            const newExpiry = calculateTTL(newTokens.access_token) + Date.now();
            useAuthStore.getState().setTokens(newTokens, newExpiry);
            tokenManager.startProactiveRefresh(
              newTokens.access_token,
              () => {},
            );
          } catch {
            useAuthStore.getState().clearAuth();
            navigate({ to: "/login" });
          }
        });

        // Handle redirect
        const redirectUrl = localStorage.getItem(REDIRECT_URL_KEY);
        if (redirectUrl) {
          localStorage.removeItem(REDIRECT_URL_KEY);
          navigate({ to: redirectUrl });
        } else {
          navigate({ to: "/" });
        }

        toast.success("Login successful!");
      } catch {
        // Token extraction failed
        toast.error("Login failed. Please try again.");
      }
    },
    onError: (error: unknown) => {
      setLoading(false);
      const message =
        (error as { response?: { data?: { message?: string } } }).response?.data
          ?.message || "Login failed. Please try again.";
      toast.error(message);
    },
  });
}
