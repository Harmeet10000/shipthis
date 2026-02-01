import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { useAuthStore } from "@/features/auth/store/authStore";
import { REDIRECT_URL_KEY } from "@/features/auth/utils/constants";

export const Route = createFileRoute("/_authenticated")({
  beforeLoad: ({ location }) => {
    const { isAuthenticated } = useAuthStore.getState();

    if (!isAuthenticated) {
      // Store the current URL for redirect after login
      localStorage.setItem(REDIRECT_URL_KEY, location.pathname);
      throw redirect({ to: "/login" });
    }
  },
  component: AuthenticatedLayout,
});

function AuthenticatedLayout() {
  return <Outlet />;
}
