import { jwtDecode } from "jwt-decode";
import type { TokenPayload, User } from "../types/auth.types";

/**
 * Decodes a JWT token and returns its payload
 * @param token - The JWT token string
 * @returns The decoded token payload
 * @throws Error if token is invalid
 */
export function decodeToken(token: string): TokenPayload {
  try {
    return jwtDecode<TokenPayload>(token);
  } catch  {
    throw new Error("Invalid token format");
  }
}

/**
 * Extracts user information from JWT access token
 * @param accessToken - The JWT access token string
 * @returns Partial user object with id and email from token
 */
export function extractUserFromToken(accessToken: string): Partial<User> {
  try {
    const payload = decodeToken(accessToken);
    return {
      _id: payload.sub,
      email: payload.email,
      full_name: "", // Will be populated from /me endpoint if needed
      created_at: new Date(payload.iat * 1000).toISOString(),
      updated_at: new Date().toISOString(),
    };
  } catch  {
    throw new Error("Failed to extract user from token");
  }
}

/**
 * Calculates the time-to-live (TTL) for a token in milliseconds
 * @param token - The JWT token string
 * @returns TTL in milliseconds
 */
export function calculateTTL(token: string): number {
  const payload = decodeToken(token);
  const expiryTime = payload.exp * 1000; // Convert to milliseconds
  const currentTime = Date.now();
  const ttl = expiryTime - currentTime;
  return Math.max(0, ttl); // Ensure non-negative
}

/**
 * Schedules a token refresh at a specified time
 * @param ttl - Time-to-live in milliseconds
 * @param refreshFn - Function to call when refresh is needed
 * @returns Timeout reference for cleanup
 */
export function scheduleTokenRefresh(
  ttl: number,
  refreshFn: () => void,
): NodeJS.Timeout {
  return setTimeout(refreshFn, ttl);
}

/**
 * Checks if a token has expired
 * @param token - The JWT token string
 * @returns true if token is expired, false otherwise
 */
export function isTokenExpired(token: string): boolean {
  try {
    const ttl = calculateTTL(token);
    return ttl <= 0;
  } catch {
    return true; // Treat invalid tokens as expired
  }
}