// User types
export interface User {
  _id: string;
  name: string;
  emailAddress: string;
  phoneNumber?: {
    countryCode: string;
    isoCode: string;
    internationalNumber: string;
  };
  role: 'user' | 'admin' | 'moderator';
  timezone?: string;
  createdAt?: string;
  updatedAt?: string;
}

// Auth response types
export interface AuthResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: any;
}

// Request types
export interface RegisterRequest {
  name: string;
  emailAddress: string;
  phoneNumber: string;
  password: string;
  consent: boolean;
}

export interface LoginRequest {
  emailAddress: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}

export interface RegisterResponse {
  _id: string;
}

export interface ConfirmationRequest {
  email: string;
  code: string;
}

export interface ForgotPasswordRequest {
  emailAddress: string;
}

export interface ResetPasswordRequest {
  token: string;
  newPassword: string;
}

export interface ChangePasswordRequest {
  oldPassword: string;
  newPassword: string;
  confirmNewPassword: string;
}

export interface GoogleOAuthRequest {
  id: string;
  email: string;
  name: string;
  picture?: string;
}

export interface GoogleOAuthResponse {
  accessToken: string;
  refreshToken: string;
  domain: string;
}

// Auth state types
export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

// Error types
export interface ApiError {
  success: false;
  message: string;
  error?: {
    details?: string;
    [key: string]: any;
  };
}
