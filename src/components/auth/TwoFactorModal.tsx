import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, AlertCircle } from 'lucide-react';
import { use2FA } from '@/hooks/use2FA';

interface TwoFactorModalProps {
  isOpen: boolean;
  onComplete: (success: boolean) => void;
  userEmail: string;
}

export const TwoFactorModal: React.FC<TwoFactorModalProps> = ({ 
  isOpen, 
  onComplete, 
  userEmail 
}) => {
  const [code, setCode] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState('');
  const { verify2FAToken } = use2FA();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!code || code.length < 6) {
      setError('Voer een geldige 6-cijferige code in');
      return;
    }

    setIsVerifying(true);
    setError('');

    try {
      const isValid = await verify2FAToken(code);
      
      if (isValid) {
        onComplete(true);
      } else {
        setError('Ongeldige verificatiecode. Controleer je authenticator app en probeer opnieuw.');
      }
    } catch (error) {
      console.error('2FA verification error:', error);
      setError('Er ging iets mis bij de verificatie. Probeer opnieuw.');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleCancel = () => {
    setCode('');
    setError('');
    onComplete(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleCancel}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Twee-factor authenticatie</DialogTitle>
          <DialogDescription>
            Voer de 6-cijferige code uit je authenticator app in om je identiteit te bevestigen.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          <div className="space-y-2">
            <Label htmlFor="verification-code">Verificatiecode</Label>
            <Input
              id="verification-code"
              type="text"
              placeholder="123456"
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 8))}
              className="text-center text-lg font-mono tracking-widest"
              disabled={isVerifying}
              autoFocus
            />
            <p className="text-sm text-muted-foreground">
              Je kunt ook een van je backup codes gebruiken
            </p>
          </div>
          
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              disabled={isVerifying}
              className="flex-1"
            >
              Annuleren
            </Button>
            <Button
              type="submit"
              disabled={isVerifying || !code}
              className="flex-1"
            >
              {isVerifying && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Verifiëren
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};