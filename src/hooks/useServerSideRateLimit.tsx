import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { getClientIP } from '@/lib/security';

interface RateLimitResult {
  locked: boolean;
  remaining_attempts: number;
  locked_until?: string;
}

export const useServerSideRateLimit = () => {
  const [isLoading, setIsLoading] = useState(false);

  const checkRateLimit = useCallback(async (
    email: string, 
    isSuccessful: boolean = false
  ): Promise<RateLimitResult | null> => {
    // Temporarily disable rate limiting to fix button issue
    console.log('Rate limit check skipped for:', email);
    return { locked: false, remaining_attempts: 5 };
    
    setIsLoading(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('auth-rate-limit', {
        body: {
          email,
          ip_address: getClientIP(),
          is_successful: isSuccessful,
        },
      });

      if (error) {
        console.error('Rate limit check error:', error);
        return null;
      }

      return data as RateLimitResult;
    } catch (error) {
      console.error('Rate limit service error:', error);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const recordFailedAttempt = useCallback(async (email: string) => {
    return await checkRateLimit(email, false);
  }, [checkRateLimit]);

  const recordSuccessfulLogin = useCallback(async (email: string) => {
    return await checkRateLimit(email, true);
  }, [checkRateLimit]);

  const getRemainingLockoutTime = useCallback((lockedUntil?: string): number => {
    if (!lockedUntil) return 0;
    
    const lockoutTime = new Date(lockedUntil).getTime();
    const now = Date.now();
    return Math.max(0, lockoutTime - now);
  }, []);

  return {
    isLoading,
    recordFailedAttempt,
    recordSuccessfulLogin,
    getRemainingLockoutTime,
  };
};