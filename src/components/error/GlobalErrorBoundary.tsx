import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Home, LogIn } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class GlobalErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.href = '/';
  };

  private handleLogin = () => {
    this.setState({ hasError: false, error: null });
    window.location.href = '/login';
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-background p-4">
          <Card className="w-full max-w-md shadow-lg border-destructive/20">
            <CardHeader className="text-center space-y-2">
              <div className="mx-auto w-12 h-12 bg-destructive/10 rounded-full flex items-center justify-center mb-2">
                <AlertTriangle className="h-6 w-6 text-destructive" />
              </div>
              <CardTitle className="text-xl font-bold">Er is iets misgegaan</CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <p className="text-muted-foreground text-sm">
                We hebben een onverwachte fout gedetecteerd. Dit gebeurt vaak als je probeert toegang te krijgen tot beveiligde inhoud zonder ingelogd te zijn.
              </p>
              {process.env.NODE_ENV === 'development' && this.state.error && (
                <div className="p-2 bg-muted rounded text-xs text-left overflow-auto max-h-32">
                  <code>{this.state.error.toString()}</code>
                </div>
              )}
            </CardContent>
            <CardFooter className="flex flex-col sm:flex-row gap-2 justify-center">
              <Button variant="outline" onClick={this.handleReset} className="w-full sm:w-auto">
                <Home className="mr-2 h-4 w-4" />
                Naar Home
              </Button>
              <Button onClick={this.handleLogin} className="w-full sm:w-auto">
                <LogIn className="mr-2 h-4 w-4" />
                Inloggen
              </Button>
            </CardFooter>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}

