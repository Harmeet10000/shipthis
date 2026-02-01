import { createFileRoute } from '@tanstack/react-router'
import { ContactPage } from '@/features/contact/pages/ContactPage'

function Contact() {
  return <ContactPage />
}

export const Route = createFileRoute('/contact')({ component: Contact })
