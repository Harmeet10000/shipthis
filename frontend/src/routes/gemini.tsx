import { createFileRoute } from '@tanstack/react-router'
import { SimplePage } from '@/components/common/SimplePage'

import { RequireAuthSection } from '@/features/auth/components/RequireAuthSection'

function Gemini() {
  return (
    <RequireAuthSection>
      <SimplePage title="Gemini" description="AI-assisted study tools and guidance." />
    </RequireAuthSection>
  )
}

export const Route = createFileRoute('/gemini')({ component: Gemini })
