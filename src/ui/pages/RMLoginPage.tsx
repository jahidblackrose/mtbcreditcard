/**
 * MTB Credit Card Application - RM Login Page
 * 
 * Login form for Relationship Managers (Assisted Mode).
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2, Lock, User, Building2 } from 'lucide-react';
import { MainLayout } from '../layouts';
import { ErrorMessage } from '../components';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { rmLogin } from '@/api/auth.api';
import mtbLogo from '@/assets/mtb-logo.png';

const loginSchema = z.object({
  staffId: z.string().min(3, 'Staff ID is required'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export function RMLoginPage() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      staffId: '',
      password: '',
    },
  });

  const handleSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await rmLogin(data.staffId, data.password);

      if (response.status !== 200) {
        setError(response.message);
        return;
      }

      // Navigate to RM Dashboard
      navigate('/rm/dashboard');
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <MainLayout hideNav>
      <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-gradient-to-br from-background via-background to-muted/30">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4">
              <img src={mtbLogo} alt="MTB Bank" className="h-12 w-auto" />
            </div>
            <CardTitle className="text-2xl">RM Portal Login</CardTitle>
            <CardDescription>
              Sign in to access the Credit Card Application Portal
            </CardDescription>
          </CardHeader>
          <CardContent>
            {error && <ErrorMessage message={error} className="mb-4" />}

            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="staffId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Staff ID</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            placeholder="MTB-RM-001"
                            className="pl-10"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            type="password"
                            placeholder="Enter your password"
                            className="pl-10"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Signing in...
                    </>
                  ) : (
                    'Sign In'
                  )}
                </Button>
              </form>
            </Form>

            {/* Demo credentials */}
            <div className="mt-6 p-4 bg-muted/50 rounded-lg border border-border">
              <p className="text-xs font-medium text-muted-foreground mb-2">Demo Credentials:</p>
              <div className="space-y-1 text-xs text-muted-foreground">
                <p><span className="font-mono">Staff ID:</span> MTB-RM-001</p>
                <p><span className="font-mono">Password:</span> password123</p>
              </div>
            </div>

            <div className="mt-6 text-center">
              <Button variant="link" onClick={() => navigate('/')} className="text-sm">
                ← Back to Home
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
