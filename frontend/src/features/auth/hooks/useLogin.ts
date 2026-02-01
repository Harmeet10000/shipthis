import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { authApi } from "../services/authApi";
import { useAuthStore } from "../store/authStore";
import { tokenManager } from "../services/tokenManager";
import { calculateTTL } from "../utils/tokenUtils";
import { REDIRECT_URL_KEY } from "../utils/constants";
import type { LoginRequest } from "../types/auth.types";

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

        // For now, we'll create a minimal user object from the token
        // In a real app, you might want to fetch user details from an endpoint
        const user = {
          _id: "",
          email: "",
          full_name: "",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
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
          } catch (error) {
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
      } catch (error) {
        console.error("Login success handler error:", error);
        toast.error("Login failed. Please try again.");
      }
    },
    onError: (error: any) => {
      setLoading(false);
      const message =
        error.response?.data?.message || "Login failed. Please try again.";
      toast.error(message);
    },
  });
}
