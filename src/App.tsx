/**
 * MTB Credit Card Application - Root Component
 *
 * Application routing and providers setup.
 * Includes Error Boundary to catch React errors gracefully.
 * Implements code splitting for optimal performance.
 */

import { Suspense, lazy } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ErrorBoundary, PageLoader, SkipToContent } from "@/components";

// Code splitting with React.lazy() for optimal performance
const LandingPage = lazy(() => import("@/ui/pages/LandingPage").then(m => ({ default: m.LandingPage })));
const ApplicationPage = lazy(() => import("@/ui/pages/ApplicationPage").then(m => ({ default: m.ApplicationPage })));
const DashboardPage = lazy(() => import("@/ui/pages/DashboardPage").then(m => ({ default: m.DashboardPage })));
const RMLoginPage = lazy(() => import("@/ui/pages/RMLoginPage").then(m => ({ default: m.RMLoginPage })));
const RMDashboardPage = lazy(() => import("@/ui/pages/RMDashboardPage").then(m => ({ default: m.RMDashboardPage })));
const NotFound = lazy(() => import("./pages/NotFound").then(m => ({ default: m.default })));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes
    },
  },
});

// Wrapper component for lazy-loaded routes with error handling
const LazyRouteWrapper = ({ children }: { children: React.ReactNode }) => (
  <Suspense fallback={<PageLoader fullScreen size="lg" text="Loading page..." />}>
    {children}
  </Suspense>
);

const App = () => (
  <ErrorBoundary>
    <SkipToContent />
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Suspense fallback={<PageLoader fullScreen size="lg" text="Loading application..." />}>
            <Routes>
              {/* Main Application Routes */}
              <Route
                path="/"
                element={
                  <LazyRouteWrapper>
                    <LandingPage />
                  </LazyRouteWrapper>
                }
              />
              <Route
                path="/apply"
                element={
                  <LazyRouteWrapper>
                    <ApplicationPage />
                  </LazyRouteWrapper>
                }
              />
              <Route
                path="/dashboard"
                element={
                  <LazyRouteWrapper>
                    <DashboardPage />
                  </LazyRouteWrapper>
                }
              />

              {/* RM (Assisted Mode) Routes */}
              <Route
                path="/rm/login"
                element={
                  <LazyRouteWrapper>
                    <RMLoginPage />
                  </LazyRouteWrapper>
                }
              />
              <Route
                path="/rm/dashboard"
                element={
                  <LazyRouteWrapper>
                    <RMDashboardPage />
                  </LazyRouteWrapper>
                }
              />

              {/* Catch-all 404 */}
              <Route
                path="*"
                element={
                  <LazyRouteWrapper>
                    <NotFound />
                  </LazyRouteWrapper>
                }
              />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </ErrorBoundary>
);

export default App;
