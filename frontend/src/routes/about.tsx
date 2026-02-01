import { createFileRoute } from '@tanstack/react-router'
import { AboutPage } from '@/features/about/pages/AboutPage'

function About() {
  return <AboutPage />
}

export const Route = createFileRoute('/about')({ component: About })
