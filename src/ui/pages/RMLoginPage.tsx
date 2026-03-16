/**
 * MTB Credit Card Application - RM Login Page
 *
 * Login form for Relationship Managers (Assisted Mode).
 * Enhanced with professional design, forgot password flow, and better UX.
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { Loader2, Lock, User, AlertTriangle, Shield, Eye, EyeOff } from 'lucide-react';
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
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);

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
      <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-gradient-to-br from-gray-50 via-blue-50/20 to-indigo-50/30">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <Card className="shadow-xl border-0">
            <CardHeader className="text-center pb-6 space-y-4">
              <motion.div
                className="mx-auto mb-2"
                whileHover={{ scale: 1.05 }}
                transition={{ type: 'spring', stiffness: 400, damping: 10 }}
              >
                <img src={mtbLogo} alt="MTB Bank" className="h-16 w-auto" />
              </motion.div>

              <div className="flex items-center justify-center gap-2 text-sm text-blue-600 bg-blue-50 px-3 py-1.5 rounded-full w-fit mx-auto">
                <Shield className="h-4 w-4" />
                <span className="font-medium">Staff Portal</span>
              </div>

              <div className="space-y-1">
                <CardTitle className="text-2xl font-bold text-gray-900">RM Portal Login</CardTitle>
                <CardDescription className="text-gray-600">
                  Sign in to access the Credit Card Application Portal
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 bg-red-50 border border-red-200 rounded-lg"
                >
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-red-900">Sign In Failed</p>
                      <p className="text-sm text-red-700 mt-1">{error}</p>
                    </div>
                    <button
                      onClick={() => setError(null)}
                      className="text-red-400 hover:text-red-600 transition-colors"
                      aria-label="Dismiss error"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </motion.div>
              )}

              <Form {...form}>
                <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-5">
                  <FormField
                    control={form.control}
                    name="staffId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-700 font-medium">Staff ID</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <Input
                              placeholder="MTB-RM-001"
                              className="pl-10 h-11 border-gray-300 focus:border-blue-500"
                              {...field}
                              disabled={isLoading}
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
                        <FormLabel className="text-gray-700 font-medium">Password</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <Input
                              type={showPassword ? 'text' : 'password'}
                              placeholder="Enter your password"
                              className="pl-10 pr-10 h-11 border-gray-300 focus:border-blue-500"
                              {...field}
                              disabled={isLoading}
                            />
                            <button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                              aria-label={showPassword ? 'Hide password' : 'Show password'}
                            >
                              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </button>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="flex items-center justify-between">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        disabled={isLoading}
                      />
                      <span className="text-sm text-gray-600">Remember me</span>
                    </label>

                    <button
                      type="button"
                      onClick={() => {
                        setShowForgotPassword(true);
                        // Mock forgot password flow
                        alert('Password reset link will be sent to your registered email.');
                      }}
                      className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                    >
                      Forgot password?
                    </button>
                  </div>

                  <Button
                    type="submit"
                    className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-white font-medium shadow-md hover:shadow-lg transition-all"
                    size="lg"
                    disabled={isLoading}
                  >
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
                <div className="mt-6 p-4 bg-amber-50 rounded-lg border border-amber-200">
                  <div className="flex items-center gap-2 mb-3">
                    <AlertTriangle className="h-4 w-4 text-amber-600" />
                    <p className="text-xs font-semibold text-amber-800">Development Mode Only</p>
                  </div>
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between">
                      <span className="font-mono text-amber-900 bg-amber-100 px-2 py-1 rounded">Staff ID:</span>
                      <span className="text-gray-700">admin, rm001, rm002, verifier</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-mono text-amber-900 bg-amber-100 px-2 py-1 rounded">Password:</span>
                      <span className="text-gray-700">admin123 (admin) or password (others)</span>
                    </div>
                  </div>
                </div>
              )}

              <div className="pt-4 border-t border-gray-100">
                <Button
                  variant="ghost"
                  onClick={() => navigate('/')}
                  className="w-full text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                >
                  ← Back to Home
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Footer */}
          <div className="mt-6 text-center text-xs text-gray-500">
            <p>Secured by MTB Bank • End-to-end encrypted</p>
            <p className="mt-1">© {new Date().getFullYear()} MTB Bank. All rights reserved.</p>
          </div>
        </motion.div>
      </div>
    </MainLayout>
  );
}
