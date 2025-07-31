import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';

interface RateLimitConfig {
  maxRequests: number;
  windowMs: number;
  blockDurationMs?: number;
}

interface RateLimitState {
  requests: number[];
  isBlocked: boolean;
  blockUntil: number | null;
}

const DEFAULT_CONFIGS: Record<string, RateLimitConfig> = {
  'topic_creation': { maxRequests: 5, windowMs: 60000, blockDurationMs: 300000 }, // 5 topics per minute, 5min block
  'reply_creation': { maxRequests: 10, windowMs: 60000, blockDurationMs: 180000 }, // 10 replies per minute, 3min block
  'voting': { maxRequests: 30, windowMs: 60000, blockDurationMs: 60000 }, // 30 votes per minute, 1min block
  'search': { maxRequests: 20, windowMs: 60000 }, // 20 searches per minute
  'profile_update': { maxRequests: 3, windowMs: 300000, blockDurationMs: 600000 }, // 3 updates per 5min, 10min block
};

export function useRateLimit(action: string, customConfig?: RateLimitConfig) {
  const { user } = useAuth();
  const [state, setState] = useState<RateLimitState>({
    requests: [],
    isBlocked: false,
    blockUntil: null,
  });

  const config = customConfig || DEFAULT_CONFIGS[action] || DEFAULT_CONFIGS['search'];
  const storageKey = `rateLimit_${action}_${user?.id || 'anonymous'}`;

  // Load state from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        const now = Date.now();
        
        // Remove expired requests
        const validRequests = parsed.requests.filter(
          (timestamp: number) => now - timestamp < config.windowMs
        );
        
        // Check if still blocked
        const isBlocked = parsed.blockUntil && now < parsed.blockUntil;
        
        setState({
          requests: validRequests,
          isBlocked: Boolean(isBlocked),
          blockUntil: isBlocked ? parsed.blockUntil : null,
        });
      } catch (error) {
        console.error('Error parsing rate limit state:', error);
      }
    }
  }, [storageKey, config.windowMs]);

  // Clean up expired requests and blocks
  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      setState(prev => {
        const validRequests = prev.requests.filter(
          timestamp => now - timestamp < config.windowMs
        );
        
        const isBlocked = prev.blockUntil && now < prev.blockUntil;
        
        const newState = {
          requests: validRequests,
          isBlocked: Boolean(isBlocked),
          blockUntil: isBlocked ? prev.blockUntil : null,
        };
        
        // Save to localStorage
        localStorage.setItem(storageKey, JSON.stringify(newState));
        
        return newState;
      });
    }, 5000); // Check every 5 seconds

    return () => clearInterval(interval);
  }, [storageKey, config.windowMs]);

  const checkRateLimit = (): { allowed: boolean; remaining: number; resetTime: number } => {
    const now = Date.now();
    
    // If blocked, return immediately
    if (state.isBlocked && state.blockUntil && now < state.blockUntil) {
      return {
        allowed: false,
        remaining: 0,
        resetTime: state.blockUntil,
      };
    }
    
    // Count valid requests in current window
    const validRequests = state.requests.filter(
      timestamp => now - timestamp < config.windowMs
    );
    
    const remaining = Math.max(0, config.maxRequests - validRequests.length);
    const oldestRequest = validRequests.length > 0 ? Math.min(...validRequests) : now;
    const resetTime = oldestRequest + config.windowMs;
    
    return {
      allowed: remaining > 0,
      remaining,
      resetTime,
    };
  };

  const attemptAction = (): { success: boolean; message?: string; retryAfter?: number } => {
    const now = Date.now();
    
    // Check if currently blocked
    if (state.isBlocked && state.blockUntil && now < state.blockUntil) {
      return {
        success: false,
        message: 'Actie geblokkeerd wegens te veel verzoeken',
        retryAfter: state.blockUntil,
      };
    }
    
    // Count valid requests
    const validRequests = state.requests.filter(
      timestamp => now - timestamp < config.windowMs
    );
    
    // Check if at limit
    if (validRequests.length >= config.maxRequests) {
      // Block if configured
      const blockUntil = config.blockDurationMs ? now + config.blockDurationMs : null;
      
      setState(prev => {
        const newState = {
          ...prev,
          isBlocked: Boolean(blockUntil),
          blockUntil,
        };
        localStorage.setItem(storageKey, JSON.stringify(newState));
        return newState;
      });
      
      return {
        success: false,
        message: `Te veel verzoeken. Probeer over ${Math.ceil((validRequests[0] + config.windowMs - now) / 1000)} seconden opnieuw`,
        retryAfter: blockUntil || (validRequests[0] + config.windowMs),
      };
    }
    
    // Add current request
    setState(prev => {
      const newState = {
        ...prev,
        requests: [...validRequests, now],
        isBlocked: false,
        blockUntil: null,
      };
      localStorage.setItem(storageKey, JSON.stringify(newState));
      return newState;
    });
    
    return { success: true };
  };

  const getRemainingTime = (): number => {
    if (state.blockUntil) {
      return Math.max(0, state.blockUntil - Date.now());
    }
    return 0;
  };

  const reset = () => {
    setState({
      requests: [],
      isBlocked: false,
      blockUntil: null,
    });
    localStorage.removeItem(storageKey);
  };

  return {
    checkRateLimit,
    attemptAction,
    getRemainingTime,
    reset,
    isBlocked: state.isBlocked,
    remainingRequests: Math.max(0, config.maxRequests - state.requests.length),
  };
}