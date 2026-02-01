import { createFileRoute } from '@tanstack/react-router'
import { SimplePage } from '@/components/common/SimplePage'

import { RequireAuthSection } from '@/features/auth/components/RequireAuthSection'

function S3Storage() {
  return (
    <RequireAuthSection>
      <SimplePage title="S3 Storage" description="Configure storage buckets and policies." />
    </RequireAuthSection>
  )
}

export const Route = createFileRoute('/s3-storage')({ component: S3Storage })
