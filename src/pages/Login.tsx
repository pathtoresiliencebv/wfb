
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';
import { useServerSideRateLimit } from '@/hooks/useServerSideRateLimit';
import { useAuditLog } from '@/hooks/useAuditLog';
import { validateEmail } from '@/lib/security';
import { TwoFactorModal } from '@/components/auth/TwoFactorModal';
import { use2FA } from '@/hooks/use2FA';
import { ModernSignIn } from '@/components/auth/ModernSignIn';

export default function Login() {
  const [show2FAModal, setShow2FAModal] = useState(false);
  const [pendingLogin, setPendingLogin] = useState<{email: string, password: string, rememberMe: boolean} | null>(null);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const [rateLimitInfo, setRateLimitInfo] = useState<{
    locked: boolean;
    remaining_attempts: number;
    locked_until?: string;
  } | null>(null);
  const { get2FAStatus } = use2FA();
  
  const { 
    recordFailedAttempt, 
    recordSuccessfulLogin,
    getRemainingLockoutTime 
  } = useServerSideRateLimit();
  const { logSecurityEvent } = useAuditLog();
  
  const from = location.state?.from?.pathname || '/';

  const handleLogin = async (email: string, password: string, rememberMe: boolean) => {
    const cleanEmail = email.toLowerCase().trim();
    
    if (!validateEmail(cleanEmail)) {
      toast({
        variant: "destructive",
        title: "Ongeldig e-mailadres",
        description: "Voer een geldig e-mailadres in.",
      });
      return;
    }
    
    // Check rate limit
    if (rateLimitInfo?.locked) {
      const remainingTime = getRemainingLockoutTime(rateLimitInfo.locked_until);
      const minutes = Math.ceil(remainingTime / (1000 * 60));
      
      toast({
        variant: "destructive",
        title: "Account vergrendeld",
        description: `Je account is vergrendeld vanwege te veel mislukte inlogpogingen. Probeer het over ${minutes} minuten opnieuw.`,
      });
      return;
    }

    setIsLoading(true);
    
    try {
      const loginSuccess = await login(cleanEmail, password);
      
      if (loginSuccess) {
        const twoFAStatus = await get2FAStatus();
        
        if (twoFAStatus?.is_enabled) {
          setPendingLogin({ email: cleanEmail, password, rememberMe });
          setShow2FAModal(true);
          setIsLoading(false);
          return;
        }
        
        await recordSuccessfulLogin(cleanEmail);
        setRateLimitInfo(null);
        logSecurityEvent('login_success', { email: cleanEmail });
        
        toast({
          title: "Welkom terug!",
          description: "Je bent succesvol ingelogd.",
        });
        
        navigate(from, { replace: true });
      }
    } catch (error) {
      const rateLimitResult = await recordFailedAttempt(cleanEmail);
      setRateLimitInfo(rateLimitResult);
      
      logSecurityEvent('login_failed', { email: cleanEmail, error: error instanceof Error ? error.message : 'Unknown error' });
      
      if (rateLimitResult?.locked) {
        toast({
          variant: "destructive",
          title: "Account vergrendeld",
          description: "Je account is vergrendeld vanwege te veel mislukte inlogpogingen. Probeer het over 15 minuten opnieuw.",
        });
      } else if (rateLimitResult) {
        toast({
          variant: "destructive",
          title: "Inloggen mislukt",
          description: `Ongeldige inloggegevens. Je hebt nog ${rateLimitResult.remaining_attempts} pogingen over.`,
        });
      } else {
        toast({
          variant: "destructive",
          title: "Inloggen mislukt",
          description: "Ongeldige inloggegevens.",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handle2FAComplete = async (success: boolean) => {
    setShow2FAModal(false);
    
    if (success && pendingLogin) {
      // Complete the login process
      await recordSuccessfulLogin(pendingLogin.email);
      setRateLimitInfo(null);
      logSecurityEvent('login_success', { email: pendingLogin.email, twofa_verified: true });
      
      toast({
        title: "Welkom terug!",
        description: "Je bent succesvol ingelogd.",
      });
      
      navigate(from, { replace: true });
    } else {
      // 2FA failed, logout the user
      await recordFailedAttempt(pendingLogin?.email || '');
      logSecurityEvent('login_failed', { email: pendingLogin?.email, error: '2FA verification failed' });
      
      toast({
        variant: "destructive",
        title: "2FA verificatie mislukt",
        description: "Inloggen geannuleerd.",
      });
    }
    
    setPendingLogin(null);
  };

  return (
    <>
      <ModernSignIn
        onSignIn={handleLogin}
        onCreateAccount={() => navigate('/register')}
      />
      
      <TwoFactorModal
        isOpen={show2FAModal}
        onComplete={handle2FAComplete}
        userEmail={pendingLogin?.email || ''}
      />
    </>
  );
}
