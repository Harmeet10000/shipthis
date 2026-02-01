import { createFileRoute } from '@tanstack/react-router'
import { SimplePage } from '@/components/common/SimplePage'

import { RequireAuthSection } from '@/features/auth/components/RequireAuthSection'

function Subscriptions() {
  return (
    <RequireAuthSection>
      <SimplePage title="Subscriptions" description="Choose and manage your learning plan." />
    </RequireAuthSection>
  )
}

export const Route = createFileRoute('/subscriptions')({ component: Subscriptions })
