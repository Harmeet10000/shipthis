import { createRootRoute, Outlet } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/router-devtools';
import { Toaster } from '@/components/ui/sonner';
import MainLayout from '@/layouts/MainLayout/MainLayout';
import { TokenRefresher } from '@/features/auth/components/TokenRefresher';

export const Route = createRootRoute({
  component: () => (
    <>
      <MainLayout>
        <TokenRefresher />
        <Outlet />
      </MainLayout>
      <Toaster position="top-right" />
      {import.meta.env.DEV && <TanStackRouterDevtools />}
    </>
  ),
});
