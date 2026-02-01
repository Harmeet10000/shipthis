import { createFileRoute, redirect } from "@tanstack/react-router";
import { RegisterForm } from "@/features/auth/components/RegisterForm";
import { AuthLayout } from "@/features/auth/components/AuthLayout";
import { useAuthStore } from "@/features/auth/store/authStore";

export const Route = createFileRoute("/register")({
  beforeLoad: () => {
    const { isAuthenticated } = useAuthStore.getState();
    if (isAuthenticated) {
      throw redirect({ to: "/" });
    }
  },
  component: RegisterPage,
});

function RegisterPage() {
  return (
    <AuthLayout
      title="Create an account"
      description="Enter your information to get started"
    >
      <RegisterForm />
    </AuthLayout>
  );
}
