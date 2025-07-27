import { useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';

export interface ErrorHandlerOptions {
  showToast?: boolean;
  logError?: boolean;
  fallbackMessage?: string;
}

export function useErrorHandler() {
  const { toast } = useToast();

  const handleError = useCallback((
    error: unknown,
    options: ErrorHandlerOptions = {}
  ) => {
    const {
      showToast = true,
      logError = true,
      fallbackMessage = 'Er is een onverwachte fout opgetreden'
    } = options;

    let errorMessage = fallbackMessage;
    
    if (error instanceof Error) {
      errorMessage = error.message;
    } else if (typeof error === 'string') {
      errorMessage = error;
    }

    // Log error for debugging/monitoring
    if (logError) {
      console.error('Error handled:', error);
      
      // Here you could integrate with error monitoring services
      // like Sentry, LogRocket, etc.
    }

    // Show user-friendly toast notification
    if (showToast) {
      toast({
        variant: "destructive",
        title: "Fout",
        description: errorMessage,
      });
    }

    return errorMessage;
  }, [toast]);

  const handleAsyncError = useCallback(async (
    asyncFn: () => Promise<any>,
    options: ErrorHandlerOptions = {}
  ) => {
    try {
      return await asyncFn();
    } catch (error) {
      handleError(error, options);
      throw error; // Re-throw so calling code can handle it too if needed
    }
  }, [handleError]);

  return {
    handleError,
    handleAsyncError
  };
}