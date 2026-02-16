/**
 * MTB Credit Card Application - Error Boundary
 *
 * Catches React errors and displays user-friendly fallback UI.
 * Prevents white screen of death and provides recovery options.
 */

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, RefreshCw, Home } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      errorInfo: null,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log error to console in development
    if (import.meta.env.DEV) {
      console.error('Error caught by boundary:', error);
      console.error('Error info:', errorInfo);
    }

    // In production, send to error tracking service
    if (import.meta.env.PROD) {
      // TODO: Send to Sentry/LogRocket
      // Sentry.captureException(error, { contexts: { react: { errorInfo } } });
    }

    this.setState({
      error,
      errorInfo,
    });
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      // Use custom fallback if provided
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default error UI
      return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
          <Card className="w-full max-w-lg">
            <CardHeader className="text-center">
              <div className="mx-auto w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center mb-4">
                <AlertCircle className="h-6 w-6 text-destructive" />
              </div>
              <CardTitle className="text-2xl">Oops! Something went wrong</CardTitle>
              <CardDescription className="text-base mt-2">
                We encountered an unexpected error. Don't worry, your data is safe.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Show error details in development */}
              {import.meta.env.DEV && this.state.error && (
                <div className="bg-muted/50 rounded-lg p-4">
                  <p className="text-sm font-mono text-destructive mb-2">
                    {this.state.error.toString()}
                  </p>
                  {this.state.errorInfo && (
                    <details className="text-xs">
                      <summary className="cursor-pointer text-muted-foreground hover:text-foreground mb-2">
                        Component Stack
                      </summary>
                      <pre className="whitespace-pre-wrap text-muted-foreground">
                        {this.state.errorInfo.componentStack}
                      </pre>
                    </details>
                  )}
                </div>
              )}

              {/* Action buttons */}
              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  onClick={this.handleReload}
                  className="flex-1 gap-2"
                  size="lg"
                >
                  <RefreshCw className="h-4 w-4" />
                  Reload Page
                </Button>
                <Button
                  onClick={this.handleGoHome}
                  variant="outline"
                  className="flex-1 gap-2"
                  size="lg"
                >
                  <Home className="h-4 w-4" />
                  Go to Home
                </Button>
              </div>

              {/* Support info */}
              <p className="text-xs text-center text-muted-foreground">
                If this problem persists, please contact our support team
              </p>
            </CardContent>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}

/**
 * Functional wrapper for easier use with hooks
 */
export function withErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  fallback?: ReactNode
) {
  return function WithErrorBoundaryWrapper(props: P) {
    return (
      <ErrorBoundary fallback={fallback}>
        <Component {...props} />
      </ErrorBoundary>
    );
  };
}
