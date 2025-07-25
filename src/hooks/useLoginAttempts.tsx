import { useState, useCallback } from 'react';

interface LoginAttempt {
  email: string;
  timestamp: number;
  attempts: number;
}

const MAX_ATTEMPTS = 5;
const LOCKOUT_DURATION = 15 * 60 * 1000; // 15 minutes

export const useLoginAttempts = () => {
  const [loginAttempts, setLoginAttempts] = useState<Map<string, LoginAttempt>>(new Map());

  const isAccountLocked = useCallback((email: string): boolean => {
    const attempt = loginAttempts.get(email);
    if (!attempt) return false;

    if (attempt.attempts >= MAX_ATTEMPTS) {
      const timeSinceLock = Date.now() - attempt.timestamp;
      return timeSinceLock < LOCKOUT_DURATION;
    }
    return false;
  }, [loginAttempts]);

  const recordFailedAttempt = useCallback((email: string) => {
    setLoginAttempts(prev => {
      const newMap = new Map(prev);
      const existing = newMap.get(email);
      
      if (existing) {
        newMap.set(email, {
          ...existing,
          attempts: existing.attempts + 1,
          timestamp: Date.now()
        });
      } else {
        newMap.set(email, {
          email,
          attempts: 1,
          timestamp: Date.now()
        });
      }
      
      return newMap;
    });
  }, []);

  const clearAttempts = useCallback((email: string) => {
    setLoginAttempts(prev => {
      const newMap = new Map(prev);
      newMap.delete(email);
      return newMap;
    });
  }, []);

  const getRemainingLockoutTime = useCallback((email: string): number => {
    const attempt = loginAttempts.get(email);
    if (!attempt || attempt.attempts < MAX_ATTEMPTS) return 0;

    const timeSinceLock = Date.now() - attempt.timestamp;
    const remaining = LOCKOUT_DURATION - timeSinceLock;
    return Math.max(0, remaining);
  }, [loginAttempts]);

  const getAttemptsRemaining = useCallback((email: string): number => {
    const attempt = loginAttempts.get(email);
    if (!attempt) return MAX_ATTEMPTS;
    return Math.max(0, MAX_ATTEMPTS - attempt.attempts);
  }, [loginAttempts]);

  return {
    isAccountLocked,
    recordFailedAttempt,
    clearAttempts,
    getRemainingLockoutTime,
    getAttemptsRemaining
  };
};