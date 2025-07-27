import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error boundary caught an error:', error, errorInfo);
    
    // Log error to analytics/monitoring service
    if (typeof window !== 'undefined') {
      // You can integrate with services like Sentry here
      console.error('Error boundary:', {
        error: error.message,
        stack: error.stack,
        componentStack: errorInfo.componentStack
      });
    }
  }

  private handleRetry = () => {
    this.setState({ hasError: false, error: undefined });
  };

  private handleReload = () => {
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-background">
          <Card className="w-full max-w-md">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
                <AlertTriangle className="h-6 w-6 text-destructive" />
              </div>
              <CardTitle>Er is iets misgegaan</CardTitle>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Fout opgetreden</AlertTitle>
                <AlertDescription>
                  Er is een onverwachte fout opgetreden. Probeer de pagina te vernieuwen of probeer het later opnieuw.
                </AlertDescription>
              </Alert>

              {process.env.NODE_ENV === 'development' && this.state.error && (
                <Alert>
                  <AlertTitle>Debug informatie</AlertTitle>
                  <AlertDescription className="text-xs font-mono">
                    {this.state.error.message}
                  </AlertDescription>
                </Alert>
              )}
              
              <div className="flex gap-2">
                <Button onClick={this.handleRetry} variant="outline" className="flex-1">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Opnieuw proberen
                </Button>
                <Button onClick={this.handleReload} className="flex-1">
                  Pagina vernieuwen
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}