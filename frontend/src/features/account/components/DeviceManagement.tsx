import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { useState } from 'react'

// Placeholder device session type
type DeviceSession = {
  id: string
  device: string
  location?: string
  lastActive: string
}

export function DeviceManagement() {
  const [sessions, setSessions] = useState<DeviceSession[]>([
    { id: '1', device: 'Chrome on Linux', location: 'India', lastActive: 'Just now' },
    { id: '2', device: 'Firefox on Windows', location: 'US', lastActive: '2 days ago' },
  ])

  const revoke = (id: string) => {
    // TODO: Call /auth/sessions/:id/revoke
    setSessions((s) => s.filter((x) => x.id !== id))
  }

  return (
    <div className="space-y-3">
      {sessions.map((s) => (
        <Card key={s.id} className="flex flex-col md:flex-row md:items-center md:justify-between">
          <CardHeader>
            <CardTitle className="text-base">{s.device}</CardTitle>
            <CardDescription>{s.location ?? 'Unknown'}</CardDescription>
          </CardHeader>
          <CardContent className="flex items-center gap-3">
            <span className="text-xs text-muted-foreground">Last active: {s.lastActive}</span>
            <Button variant="outline" size="sm" onClick={() => revoke(s.id)}>Revoke</Button>
          </CardContent>
        </Card>
      ))}
      <div className="flex gap-2">
        <Button variant="outline" disabled title="TODO: Wire to /auth/sessions/revoke-all">Revoke all other sessions</Button>
      </div>
    </div>
  )
}
