import { apiClient } from '@/lib/axios';
import type {
  AuthResponse,
  RegisterRequest,
  RegisterResponse,
  LoginRequest,
  LoginResponse,
  ConfirmationRequest,
  ForgotPasswordRequest,
  ResetPasswordRequest,
  ChangePasswordRequest,
  GoogleOAuthRequest,
  GoogleOAuthResponse,
  User,
} from '../types';

const AUTH_ENDPOINTS = {
  REGISTER: '/auth/register',
  LOGIN: '/auth/login',
  LOGOUT: '/auth/logout',
  CONFIRMATION: '/auth/confirmation',
  REFRESH_TOKEN: '/auth/refresh-token',
  FORGOT_PASSWORD: '/auth/forgot-password',
  RESET_PASSWORD: '/auth/reset-password',
  CHANGE_PASSWORD: '/auth/change-password',
  GOOGLE_OAUTH_SIGNUP: '/auth/google-oauth/signup',
  GOOGLE_OAUTH_LOGIN: '/auth/google-oauth/login',
  ME: '/auth/me',
} as const;

class AuthService {
  // Register new user
  async register(data: RegisterRequest): Promise<AuthResponse<RegisterResponse>> {
    const response = await apiClient.post<AuthResponse<RegisterResponse>>(
      AUTH_ENDPOINTS.REGISTER,
      data
    );
    return response.data;
  }

  // Confirm email address
  async confirmEmail(email: string, code: string): Promise<AuthResponse> {
    const response = await apiClient.put<AuthResponse>(
      `${AUTH_ENDPOINTS.CONFIRMATION}/${email}`,
      null,
      { params: { code } }
    );
    return response.data;
  }

  // Login user
  async login(data: LoginRequest): Promise<AuthResponse<LoginResponse>> {
    const response = await apiClient.post<AuthResponse<LoginResponse>>(
      AUTH_ENDPOINTS.LOGIN,
      data
    );
    
    // Store tokens if login successful
    if (response.data.success && response.data.data) {
      const { accessToken, refreshToken } = response.data.data;
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
    }
    
    return response.data;
  }

  // Logout user
  async logout(): Promise<AuthResponse> {
    try {
      const response = await apiClient.put<AuthResponse>(AUTH_ENDPOINTS.LOGOUT);
      
      // Clear tokens
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      
      return response.data;
    } catch (error) {
      // Even if logout fails, clear local tokens
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      throw error;
    }
  }

  // Refresh access token
  async refreshToken(): Promise<AuthResponse<{ accessToken: string }>> {
    const response = await apiClient.post<AuthResponse<{ accessToken: string }>>(
      AUTH_ENDPOINTS.REFRESH_TOKEN
    );
    
    // Update stored access token
    if (response.data.success && response.data.data) {
      localStorage.setItem('accessToken', response.data.data.accessToken);
    }
    
    return response.data;
  }

  // Request password reset
  async forgotPassword(data: ForgotPasswordRequest): Promise<AuthResponse> {
    const response = await apiClient.put<AuthResponse>(
      AUTH_ENDPOINTS.FORGOT_PASSWORD,
      data
    );
    return response.data;
  }

  // Reset password with token
  async resetPassword(token: string, newPassword: string): Promise<AuthResponse> {
    const response = await apiClient.put<AuthResponse>(
      `${AUTH_ENDPOINTS.RESET_PASSWORD}/${token}`,
      { newPassword }
    );
    return response.data;
  }

  // Change password (authenticated)
  async changePassword(data: ChangePasswordRequest): Promise<AuthResponse> {
    const response = await apiClient.put<AuthResponse>(
      AUTH_ENDPOINTS.CHANGE_PASSWORD,
      data
    );
    return response.data;
  }

  // Google OAuth signup
  async googleOAuthSignup(data: GoogleOAuthRequest): Promise<AuthResponse<GoogleOAuthResponse>> {
    const response = await apiClient.post<AuthResponse<GoogleOAuthResponse>>(
      AUTH_ENDPOINTS.GOOGLE_OAUTH_SIGNUP,
      data
    );
    
    // Store tokens if successful
    if (response.data.success && response.data.data) {
      const { accessToken, refreshToken } = response.data.data;
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
    }
    
    return response.data;
  }

  // Google OAuth login
  async googleOAuthLogin(data: GoogleOAuthRequest): Promise<AuthResponse<LoginResponse>> {
    const response = await apiClient.post<AuthResponse<LoginResponse>>(
      AUTH_ENDPOINTS.GOOGLE_OAUTH_LOGIN,
      data
    );
    
    // Store tokens if successful
    if (response.data.success && response.data.data) {
      const { accessToken, refreshToken } = response.data.data;
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
    }
    
    return response.data;
  }

  // Get current user
  async getCurrentUser(): Promise<AuthResponse<User>> {
    const response = await apiClient.get<AuthResponse<User>>(AUTH_ENDPOINTS.ME);
    return response.data;
  }

  // Check if user is authenticated (has valid token)
  isAuthenticated(): boolean {
    return !!localStorage.getItem('accessToken');
  }

  // Get stored tokens
  getTokens(): { accessToken: string | null; refreshToken: string | null } {
    return {
      accessToken: localStorage.getItem('accessToken'),
      refreshToken: localStorage.getItem('refreshToken'),
    };
  }

  // Clear authentication data
  clearAuth(): void {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  }
}

export const authService = new AuthService();
export default authService;
