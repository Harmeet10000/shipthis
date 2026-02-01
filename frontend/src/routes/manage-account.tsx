import { createFileRoute } from '@tanstack/react-router'
import { ManageAccountPage } from '@/features/account/pages/ManageAccountPage'

function ManageAccount() {
  return <ManageAccountPage />
}

export const Route = createFileRoute('/manage-account')({ component: ManageAccount })
