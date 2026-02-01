import { createFileRoute } from "@tanstack/react-router";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const Route = createFileRoute("/_authenticated/")({
  component: HomePage,
});

function HomePage() {
  const { user, logout } = useAuth();

  return (
    <div className="container mx-auto p-8">
      <Card>
        <CardHeader>
          <CardTitle>Welcome to Your Dashboard</CardTitle>
          <CardDescription>You are successfully authenticated!</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {user && (
            <div>
              <p className="text-sm text-muted-foreground">
                Logged in as: <span className="font-medium">{user.email}</span>
              </p>
              {user.full_name && (
                <p className="text-sm text-muted-foreground">
                  Name: <span className="font-medium">{user.full_name}</span>
                </p>
              )}
            </div>
          )}
          <Button onClick={logout} variant="outline">
            Log out
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
