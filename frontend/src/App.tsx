import { RouterProvider } from "@tanstack/react-router";
import { router } from "./router";
import { useAuthInit } from "./features/auth/hooks/useAuthInit";

function App() {
  const { isInitialized } = useAuthInit();

  if (!isInitialized) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto mb-4" />
          <p className="text-sm text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return <RouterProvider router={router} />;
}

export default App;
