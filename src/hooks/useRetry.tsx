import { useState, useCallback } from 'react';

interface UseRetryOptions {
  maxAttempts?: number;
  delay?: number;
  backoff?: boolean;
}

export function useRetry(options: UseRetryOptions = {}) {
  const { maxAttempts = 3, delay = 1000, backoff = true } = options;
  const [isRetrying, setIsRetrying] = useState(false);
  const [attempts, setAttempts] = useState(0);

  const retry = useCallback(async function <T>(
    fn: () => Promise<T>,
    currentAttempt: number = 0
  ): Promise<T> {
    setIsRetrying(true);
    setAttempts(currentAttempt + 1);

    try {
      const result = await fn();
      setIsRetrying(false);
      setAttempts(0);
      return result;
    } catch (error) {
      if (currentAttempt >= maxAttempts - 1) {
        setIsRetrying(false);
        setAttempts(0);
        throw error;
      }

      const retryDelay = backoff ? delay * Math.pow(2, currentAttempt) : delay;
      
      await new Promise(resolve => setTimeout(resolve, retryDelay));
      return retry(fn, currentAttempt + 1);
    }
  }, [maxAttempts, delay, backoff]);

  const reset = useCallback(() => {
    setIsRetrying(false);
    setAttempts(0);
  }, []);

  return {
    retry,
    isRetrying,
    attempts,
    reset
  };
}