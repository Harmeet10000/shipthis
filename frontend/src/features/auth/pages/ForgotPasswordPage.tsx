import { Link } from '@tanstack/react-router';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ArrowLeft, Loader2, Lock } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';

import { useForgotPassword } from '../hooks/useAuth';
import type { ForgotPasswordRequest } from '../types';

// Validation schema
const forgotPasswordSchema = z.object({
  emailAddress: z.string().email('Please enter a valid email address'),
});

export function ForgotPasswordPage() {
  const forgotPasswordMutation = useForgotPassword();

  const form = useForm<ForgotPasswordRequest>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      emailAddress: '',
    },
  });

  const onSubmit = async (data: ForgotPasswordRequest) => {
    try {
      await forgotPasswordMutation.mutateAsync(data);
      toast.success('Password reset email sent! Please check your inbox.');
      form.reset();
    } catch (error: any) {
      const message = error?.response?.data?.message || 'Failed to send reset email. Please try again.';
      toast.error(message);
    }
  };

  const isLoading = forgotPasswordMutation.isPending;
  const isSuccess = forgotPasswordMutation.isSuccess;

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-12">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
            <Lock className="h-6 w-6 text-primary" />
          </div>
          <CardTitle className="text-2xl font-bold">Forgot your password?</CardTitle>
          <CardDescription>
            No worries! Enter your email and we'll send you reset instructions.
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {isSuccess && (
            <Alert>
              <AlertDescription>
                If an account exists with this email, you will receive password reset instructions shortly.
                Please check your email inbox and spam folder.
              </AlertDescription>
            </Alert>
          )}

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="emailAddress"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email Address</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="john.doe@example.com"
                        autoComplete="email"
                        disabled={isLoading}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sending reset email...
                  </>
                ) : (
                  'Send Reset Email'
                )}
              </Button>
            </form>
          </Form>

          <div className="text-center">
            <Link
              to="/login"
              className="inline-flex items-center text-sm text-primary hover:underline"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to login
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
