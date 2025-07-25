import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Mail, AlertCircle, Loader2 } from 'lucide-react';

export const EmailVerificationBanner: React.FC = () => {
  const { isAuthenticated, emailVerified, resendVerificationEmail } = useAuth();
  const [isResending, setIsResending] = useState(false);

  if (!isAuthenticated || emailVerified) {
    return null;
  }

  const handleResendEmail = async () => {
    setIsResending(true);
    await resendVerificationEmail();
    setIsResending(false);
  };

  return (
    <Alert className="border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-950">
      <AlertCircle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
      <AlertDescription className="flex items-center justify-between w-full">
        <div className="flex items-center gap-2">
          <Mail className="h-4 w-4 text-amber-600 dark:text-amber-400" />
          <span className="text-amber-800 dark:text-amber-200">
            Je e-mailadres is nog niet geverifieerd. Controleer je inbox en klik op de verificatielink.
          </span>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={handleResendEmail}
          disabled={isResending}
          className="ml-4 border-amber-300 text-amber-700 hover:bg-amber-100 dark:border-amber-700 dark:text-amber-300 dark:hover:bg-amber-900"
        >
          {isResending ? (
            <>
              <Loader2 className="mr-2 h-3 w-3 animate-spin" />
              Versturen...
            </>
          ) : (
            'Email opnieuw versturen'
          )}
        </Button>
      </AlertDescription>
    </Alert>
  );
};