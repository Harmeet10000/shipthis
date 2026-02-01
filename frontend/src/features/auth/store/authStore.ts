import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { AuthStore, AuthTokens, User } from "../types/auth.types";
import { AUTH_STORAGE_KEY } from "../utils/constants";

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      // State
      user: null,
      accessToken: null,
      refreshToken: null,
      tokenExpiry: null,
      isAuthenticated: false,
      isLoading: false,

      // Actions
      setAuth: (tokens: AuthTokens, user: User, tokenExpiry: number) => {
        set({
          user,
          accessToken: tokens.access_token,
          refreshToken: tokens.refresh_token,
          tokenExpiry,
          isAuthenticated: true,
          isLoading: false,
        });
      },

      clearAuth: () => {
        set({
          user: null,
          accessToken: null,
          refreshToken: null,
          tokenExpiry: null,
          isAuthenticated: false,
          isLoading: false,
        });
      },

      setUser: (user: User) => {
        set({ user });
      },

      setTokens: (tokens: AuthTokens, tokenExpiry: number) => {
        set({
          accessToken: tokens.access_token,
          refreshToken: tokens.refresh_token,
          tokenExpiry,
        });
      },

      setLoading: (isLoading: boolean) => {
        set({ isLoading });
      },
    }),
    {
      name: AUTH_STORAGE_KEY,
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        tokenExpiry: state.tokenExpiry,
        isAuthenticated: state.isAuthenticated,
        // Exclude isLoading from persistence
      }),
    },
  ),
);
