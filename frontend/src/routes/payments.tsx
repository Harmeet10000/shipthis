import { createFileRoute } from '@tanstack/react-router'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'

import { RequireAuthSection } from '@/features/auth/components/RequireAuthSection'

function Payments() {
  return (
    <RequireAuthSection>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Payments</h1>
          <p className="text-muted-foreground">Manage invoices, methods, and charges.</p>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {['Invoices', 'Payment Methods', 'Billing'].map((t) => (
            <Card key={t} className="transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
              <CardHeader>
                <CardTitle>{t}</CardTitle>
                <CardDescription>Overview and quick actions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-16 rounded bg-muted/30" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </RequireAuthSection>
  )
}

export const Route = createFileRoute('/payments')({ component: Payments })
