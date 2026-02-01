import { createFileRoute } from '@tanstack/react-router'
import { SimplePage } from '@/components/common/SimplePage'

import { RequireAuthSection } from '@/features/auth/components/RequireAuthSection'

function Permissions() {
  return (
    <RequireAuthSection>
      <SimplePage title="Permissions" description="Manage roles and access controls." />
    </RequireAuthSection>
  )
}

export const Route = createFileRoute('/permissions')({ component: Permissions })
