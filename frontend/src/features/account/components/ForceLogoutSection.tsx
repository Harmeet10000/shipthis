import { Button } from '@/components/ui/button'
import { useLogout } from '@/features/auth/hooks/useAuth'

export function ForceLogoutSection() {
  const logout = useLogout()
  return (
    <div className="flex flex-wrap gap-2">
      <Button variant="destructive" onClick={() => logout.mutate()} disabled={logout.isPending}>
        {logout.isPending ? 'Signing out...' : 'Sign out of this device'}
      </Button>
      <Button variant="outline" disabled title="TODO: Wire to /auth/logout-all">
        Sign out of all devices
      </Button>
    </div>
  )
}
