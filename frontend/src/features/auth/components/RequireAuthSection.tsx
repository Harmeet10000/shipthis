import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Link } from '@tanstack/react-router'
import { useIsAuthenticated } from '@/features/auth/hooks/useAuth'

export function RequireAuthSection({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useIsAuthenticated()

  if (isLoading) return <div className="text-sm text-muted-foreground">Loading...</div>

  if (!isAuthenticated) {
    return (
      <Alert>
        <AlertDescription>
          Please log in to see your info.{' '}
          <Button variant="link" asChild>
            <Link to="/login">Sign in</Link>
          </Button>
        </AlertDescription>
      </Alert>
    )
  }

  return <>{children}</>
}
