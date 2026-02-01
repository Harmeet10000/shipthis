import { createFileRoute } from '@tanstack/react-router';
import { ConfirmEmailPage } from '@/features/auth/pages';

export const Route = createFileRoute('/confirm-email')({
  component: ConfirmEmailPage,
});
