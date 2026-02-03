export interface User {
  _id: string;
  email: string;
  full_name: string;
  created_at: string;
  updated_at: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  full_name: string;
}

export interface AuthTokens {
  access_token: string;
  refresh_token: string;
  token_type: string;
}

export interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  tokenExpiry: number | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface AuthStore extends AuthState {
  setAuth: (tokens: AuthTokens, user: User, tokenExpiry: number) => void;
  clearAuth: () => void;
  setUser: (user: User) => void;
  setTokens: (tokens: AuthTokens, tokenExpiry: number) => void;
  setLoading: (isLoading: boolean) => void;
}

export interface TokenPayload {
  sub: string; // user_id
  email: string;
  type: string; // "access" or "refresh"
  jti: string;
  iat: number;
  exp: number;
}
