import { createFileRoute } from '@tanstack/react-router';
import { HomePage } from '@/features/home/pages/HomePage'

function IndexPage() {
  return <HomePage />
}

export const Route = createFileRoute('/')({
  component: IndexPage,
});

