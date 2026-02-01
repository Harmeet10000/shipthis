import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { useCurrentUser } from '@/features/auth/hooks/useAuth'

export function AccountStatusCard() {
  const { data: user } = useCurrentUser()
  return (
    <Card>
      <CardHeader>
        <CardTitle>Account Status</CardTitle>
        <CardDescription>Overview of your account state</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-2 text-sm">
        <div>
          <span className="text-muted-foreground">Status: </span>
          <span className="font-medium">{user ? 'Active' : 'Unknown'}</span>
        </div>
        <div>
          <span className="text-muted-foreground">Email: </span>
          <span className="font-medium">{user?.emailAddress ?? '—'}</span>
        </div>
        <div>
          <span className="text-muted-foreground">Role: </span>
          <span className="font-medium">{user?.role ?? '—'}</span>
        </div>
        <div>
          <span className="text-muted-foreground">Created: </span>
          <span className="font-medium">{user?.createdAt ? new Date(user.createdAt).toLocaleString() : '—'}</span>
        </div>
        <div>
          <span className="text-muted-foreground">Updated: </span>
          <span className="font-medium">{user?.updatedAt ? new Date(user.updatedAt).toLocaleString() : '—'}</span>
        </div>
      </CardContent>
    </Card>
  )
}
