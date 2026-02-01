import { calculateTTL, scheduleTokenRefresh } from "../utils/tokenUtils";
import { TOKEN_REFRESH_THRESHOLD } from "../utils/constants";

/**
 * TokenManager handles proactive token refresh scheduling
 */
class TokenManager {
  private refreshTimeout: NodeJS.Timeout | null = null;

  /**
   * Start proactive token refresh
   * @param accessToken - Current access token
   * @param refreshFn - Function to call when refresh is needed
   */
  startProactiveRefresh(accessToken: string, refreshFn: () => void): void {
    // Clear any existing timeout
    this.stopProactiveRefresh();

    try {
      const ttl = calculateTTL(accessToken);
      const refreshTime = ttl * TOKEN_REFRESH_THRESHOLD;

      if (refreshTime > 0) {
        this.refreshTimeout = scheduleTokenRefresh(refreshTime, refreshFn);
      }
    } catch (error) {
      console.error("Failed to schedule token refresh:", error);
    }
  }

  /**
   * Stop proactive token refresh
   */
  stopProactiveRefresh(): void {
    if (this.refreshTimeout) {
      clearTimeout(this.refreshTimeout);
      this.refreshTimeout = null;
    }
  }
}

// Export singleton instance
export const tokenManager = new TokenManager();
