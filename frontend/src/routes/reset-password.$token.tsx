import { createFileRoute } from '@tanstack/react-router';
import { ResetPasswordPage } from '@/features/auth/pages';

export const Route = createFileRoute('/reset-password/$token')({
  component: ResetPasswordPage,
});
