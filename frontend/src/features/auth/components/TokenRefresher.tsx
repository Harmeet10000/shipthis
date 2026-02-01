import { useEffect, useRef } from 'react'
import { authService } from '@/features/auth/api/authApi'

// Calls /auth/refresh-token every 55 minutes while the user is authenticated.
export function TokenRefresher() {
  const intervalRef = useRef<number | null>(null)

  useEffect(() => {
    const MINUTES_55 = 55 * 60 * 1000

    const tick = async () => {
      if (!authService.isAuthenticated()) return
      try {
        await authService.refreshToken()
        // Optionally, you could log success or update UI state
      } catch (_err) {
        // If refresh fails, axios interceptor or subsequent requests will handle redirect.
        // Silently ignore here to avoid loops.
      }
    }

    // Schedule periodic refreshes every 55 minutes
    intervalRef.current = window.setInterval(tick, MINUTES_55)

    return () => {
      if (intervalRef.current) window.clearInterval(intervalRef.current)
    }
  }, [])

  return null
}
