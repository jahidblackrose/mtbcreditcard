/**
 * MTB Credit Card Application - RM Login Page
 * 
 * Premium navy-themed login for Relationship Managers.
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2, Lock, User, AlertTriangle, Shield } from 'lucide-react';
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
import { env } from '@/config';
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

      navigate('/rm/dashboard');
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <MainLayout hideNav>
      <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-background">
        <Card className="w-full max-w-md shadow-[0_2px_8px_0_rgb(0_0_0/0.06)]">
          <CardHeader className="text-center pb-4">
            <div className="mx-auto mb-3">
              <img src={mtbLogo} alt="MTB Bank" className="h-11 w-auto" />
            </div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary/8 text-primary text-[11px] font-medium mx-auto mb-3">
              <Shield className="h-3 w-3" />
              Secure Staff Portal
            </div>
            <CardTitle className="text-xl">RM Portal Login</CardTitle>
            <CardDescription className="text-[13px]">
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
                      <FormLabel className="text-[13px]">Staff ID</FormLabel>
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
                      <FormLabel className="text-[13px]">Password</FormLabel>
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

            {/* Demo credentials - MOCK MODE ONLY */}
            {env.MODE === 'MOCK' && (
              <div className="mt-5 p-3.5 bg-warning/8 rounded-lg border border-warning/20">
                <div className="flex items-center gap-2 mb-1.5">
                  <AlertTriangle className="h-3.5 w-3.5 text-warning" />
                  <p className="text-[11px] font-semibold text-warning">Development Mode Only</p>
                </div>
                <div className="space-y-0.5 text-[11px] text-muted-foreground">
                  <p><span className="font-mono">Staff ID:</span> admin, rm001, rm002, verifier</p>
                  <p><span className="font-mono">Password:</span> admin123 (admin) or password (others)</p>
                </div>
              </div>
            )}

            <div className="mt-5 text-center">
              <Button variant="link" onClick={() => navigate('/')} className="text-[13px]">
                ← Back to Home
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
