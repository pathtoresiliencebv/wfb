import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class PerformanceErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('PerformanceErrorBoundary caught an error:', error, errorInfo);
    
    // Track error for performance monitoring
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }

    // In a real app, you'd send this to your error tracking service
    const errorDetails = {
      message: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href,
    };

    console.error('Error Details:', errorDetails);
  }

  private handleRetry = () => {
    this.setState({ hasError: false, error: undefined });
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <Card className="m-4">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-600">
              <AlertTriangle className="h-5 w-5" />
              Er ging iets mis
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              Er is een onverwachte fout opgetreden. Probeer de pagina te vernieuwen.
            </p>
            
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="mt-4">
                <summary className="cursor-pointer text-sm font-medium">
                  Technische details (alleen zichtbaar in development)
                </summary>
                <pre className="mt-2 text-xs bg-muted p-3 rounded overflow-auto">
                  {this.state.error.stack}
                </pre>
              </details>
            )}

            <div className="flex gap-2">
              <Button onClick={this.handleRetry} variant="outline" size="sm">
                <RefreshCw className="h-4 w-4 mr-2" />
                Opnieuw proberen
              </Button>
              <Button 
                onClick={() => window.location.reload()} 
                variant="default" 
                size="sm"
              >
                Pagina vernieuwen
              </Button>
            </div>
          </CardContent>
        </Card>
      );
    }

    return this.props.children;
  }
}