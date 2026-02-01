import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import type { User } from '@/features/auth/types';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  setUser: (user: User | null) => void;
  setIsAuthenticated: (isAuthenticated: boolean) => void;
  setIsLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  clearAuth: () => void;
  
  // Computed values
  getUserDisplayName: () => string;
  getUserEmail: () => string | null;
  getUserRole: () => string | null;
  isAdmin: () => boolean;
}

export const useAuthStore = create<AuthState>()(
  devtools(
    persist(
      (set, get) => ({
        user: null,
        isAuthenticated: false,
        isLoading: true,
        error: null,
        
        setUser: (user) => set({ user, isAuthenticated: !!user }),
        setIsAuthenticated: (isAuthenticated) => set({ isAuthenticated }),
        setIsLoading: (isLoading) => set({ isLoading }),
        setError: (error) => set({ error }),
        
        clearAuth: () => set({
          user: null,
          isAuthenticated: false,
          error: null,
        }),
        
        getUserDisplayName: () => {
          const { user } = get();
          return user?.name || 'Guest';
        },
        
        getUserEmail: () => {
          const { user } = get();
          return user?.emailAddress || null;
        },
        
        getUserRole: () => {
          const { user } = get();
          return user?.role || null;
        },
        
        isAdmin: () => {
          const { user } = get();
          return user?.role === 'admin';
        },
      }),
      {
        name: 'auth-storage',
        partialize: (state) => ({ user: state.user, isAuthenticated: state.isAuthenticated }),
      }
    )
  )
);

// Selector hooks for backward compatibility
export const useUser = () => useAuthStore((state) => state.user);
export const useIsAuthenticated = () => useAuthStore((state) => state.isAuthenticated);
export const useAuthLoading = () => useAuthStore((state) => state.isLoading);
export const useAuthError = () => useAuthStore((state) => state.error);
export const useUserDisplayName = () => useAuthStore((state) => state.getUserDisplayName());
export const useUserEmail = () => useAuthStore((state) => state.getUserEmail());
export const useUserRole = () => useAuthStore((state) => state.getUserRole());
export const useIsAdmin = () => useAuthStore((state) => state.isAdmin());
