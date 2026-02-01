import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import { authService } from '../api/authApi';
import { useAuthStore } from '@/store/auth';
import type {
  RegisterRequest,
  LoginRequest,
  ForgotPasswordRequest,
  ChangePasswordRequest,
  GoogleOAuthRequest,
} from '../types';

// Query keys
export const authKeys = {
  all: ['auth'] as const,
  user: () => [...authKeys.all, 'user'] as const,
  session: () => [...authKeys.all, 'session'] as const,
};

// Hook to get current user
export const useCurrentUser = () => {
  return useQuery({
    queryKey: authKeys.user(),
    queryFn: async () => {
      if (!authService.isAuthenticated()) {
        return null;
      }
      const response = await authService.getCurrentUser();
      return response.data || null;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: false,
  });
};

// Hook for user registration
export const useRegister = () => {
  const navigate = useNavigate();
  
  return useMutation({
    mutationFn: (data: RegisterRequest) => authService.register(data),
    onSuccess: (response, variables) => {
      if (response.success) {
        // Navigate to email confirmation page
        navigate({
          to: '/confirm-email',
          search: { email: variables.emailAddress },
        });
      }
    },
  });
};

// Hook for email confirmation
export const useConfirmEmail = () => {
  const navigate = useNavigate();
  
  return useMutation({
    mutationFn: ({ email, code }: { email: string; code: string }) =>
      authService.confirmEmail(email, code),
    onSuccess: (response) => {
      if (response.success) {
        // Navigate to login page after successful confirmation
        navigate({ to: '/login' });
      }
    },
  });
};

// Hook for user login
export const useLogin = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const setUser = useAuthStore(state => state.setUser);
  
  return useMutation({
    mutationFn: (data: LoginRequest) => authService.login(data),
    onSuccess: (response) => {
      if (response.success && response.data) {
        // Update user query cache
        queryClient.setQueryData(authKeys.user(), response.data.user);
        
        // Update Zustand store
        setUser(response.data.user);
        
        // Navigate to dashboard or return URL
        const returnUrl = new URLSearchParams(window.location.search).get('returnUrl');
        navigate({ to: returnUrl || '/' });
      }
    },
  });
};

// Hook for user logout
export const useLogout = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const clearAuth = useAuthStore(state => state.clearAuth);
  
  return useMutation({
    mutationFn: () => authService.logout(),
    onSuccess: () => {
      // Clear all auth-related queries
      queryClient.removeQueries({ queryKey: authKeys.all });
      
      // Clear Zustand store
      clearAuth();
      
      // Navigate to login page
      navigate({ to: '/login' });
    },
    onError: () => {
      // Even on error, clear local state and redirect
      authService.clearAuth();
      queryClient.removeQueries({ queryKey: authKeys.all });
      clearAuth();
      navigate({ to: '/login' });
    },
  });
};

// Hook for forgot password
export const useForgotPassword = () => {
  return useMutation({
    mutationFn: (data: ForgotPasswordRequest) => authService.forgotPassword(data),
  });
};

// Hook for reset password
export const useResetPassword = () => {
  const navigate = useNavigate();
  
  return useMutation({
    mutationFn: ({ token, newPassword }: { token: string; newPassword: string }) =>
      authService.resetPassword(token, newPassword),
    onSuccess: (response) => {
      if (response.success) {
        // Navigate to login page after successful reset
        navigate({ to: '/login' });
      }
    },
  });
};

// Hook for change password
export const useChangePassword = () => {
  return useMutation({
    mutationFn: (data: ChangePasswordRequest) => authService.changePassword(data),
  });
};

// Hook for Google OAuth signup
export const useGoogleOAuthSignup = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: GoogleOAuthRequest) => authService.googleOAuthSignup(data),
    onSuccess: (response) => {
      if (response.success && response.data) {
        // Fetch and update user data
        queryClient.invalidateQueries({ queryKey: authKeys.user() });
        
        // Navigate to home
        navigate({ to: '/' });
      }
    },
  });
};

// Hook for Google OAuth login
export const useGoogleOAuthLogin = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: GoogleOAuthRequest) => authService.googleOAuthLogin(data),
    onSuccess: (response) => {
      if (response.success && response.data) {
        // Update user query cache
        queryClient.setQueryData(authKeys.user(), response.data.user);
        
        // Navigate to dashboard or return URL
        const returnUrl = new URLSearchParams(window.location.search).get('returnUrl');
        navigate({ to: returnUrl || '/' });
      }
    },
  });
};

// Hook to check authentication status
export const useIsAuthenticated = () => {
  const { data: user, isLoading } = useCurrentUser();
  
  return {
    isAuthenticated: !!user,
    isLoading,
    user,
  };
};
