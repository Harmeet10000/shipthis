import { createFileRoute, redirect } from "@tanstack/react-router";
import { LoginForm } from "@/features/auth/components/LoginForm";
import { AuthLayout } from "@/features/auth/components/AuthLayout";
import { useAuthStore } from "@/features/auth/store/authStore";

export const Route = createFileRoute("/login")({
  beforeLoad: () => {
    const { isAuthenticated } = useAuthStore.getState();
    if (isAuthenticated) {
      throw redirect({ to: "/" });
    }
  },
  component: LoginPage,
});

function LoginPage() {
  return (
    <AuthLayout
      title="Welcome back"
      description="Enter your credentials to access your account"
    >
      <LoginForm />
    </AuthLayout>
  );
}
