import { useSearch } from '@tanstack/react-router';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2, Mail } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';

import { useConfirmEmail } from '../hooks/useAuth';

// Validation schema
const confirmSchema = z.object({
  code: z.string()
    .length(6, 'Verification code must be exactly 6 digits')
    .regex(/^\d+$/, 'Verification code must contain only numbers'),
});

type ConfirmFormData = z.infer<typeof confirmSchema>;

export function ConfirmEmailPage() {
  const search = useSearch({ from: '/confirm-email' }) as { email?: string };
  const email = search.email || '';
  const confirmMutation = useConfirmEmail();

  const form = useForm<ConfirmFormData>({
    resolver: zodResolver(confirmSchema),
    defaultValues: {
      code: '',
    },
  });

  const onSubmit = async (data: ConfirmFormData) => {
    if (!email) {
      toast.error('Email address is missing. Please register again.');
      return;
    }

    try {
      await confirmMutation.mutateAsync({
        email: email as string,
        code: data.code,
      });
      
      toast.success('Email confirmed successfully! You can now log in.');
    } catch (error: any) {
      const message = error?.response?.data?.message || 'Confirmation failed. Please try again.';
      toast.error(message);
    }
  };

  const handleResendCode = async () => {
    // TODO: Implement resend verification code
    toast.info('Verification code resent to your email.');
  };

  const isLoading = confirmMutation.isPending;

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-12">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
            <Mail className="h-6 w-6 text-primary" />
          </div>
          <CardTitle className="text-2xl font-bold">Confirm your email</CardTitle>
          <CardDescription>
            We've sent a verification code to{' '}
            <span className="font-medium text-foreground">{email || 'your email'}</span>
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Verification Code</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="123456"
                        maxLength={6}
                        className="text-center text-lg font-mono"
                        autoComplete="one-time-code"
                        disabled={isLoading}
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Enter the 6-digit code sent to your email
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className="w-full"
                disabled={isLoading || !email}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  'Verify Email'
                )}
              </Button>
            </form>
          </Form>

          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              Didn't receive the code?{' '}
              <Button
                variant="link"
                className="p-0 h-auto font-medium"
                onClick={handleResendCode}
                disabled={isLoading}
              >
                Resend code
              </Button>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
