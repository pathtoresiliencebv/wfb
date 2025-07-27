import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Shield, Copy, Download, QrCode, Smartphone } from 'lucide-react';
import { use2FA } from '@/hooks/use2FA';
import { useToast } from '@/hooks/use-toast';

interface TwoFactorSetupProps {
  currentStatus: { is_enabled: boolean } | null;
  onStatusChange: () => void;
}

const TwoFactorSetup: React.FC<TwoFactorSetupProps> = ({ currentStatus, onStatusChange }) => {
  const { toast } = useToast();
  const {
    isLoading,
    setupSecret,
    qrCodeUrl,
    generate2FASetup,
    enable2FA,
    disable2FA,
  } = use2FA();

  const [setupStep, setSetupStep] = useState<'initial' | 'setup' | 'verify'>('initial');
  const [verificationCode, setVerificationCode] = useState('');
  const [backupCodes, setBackupCodes] = useState<string[]>([]);
  const [showBackupCodes, setShowBackupCodes] = useState(false);

  const handleStartSetup = async () => {
    const setup = await generate2FASetup();
    if (setup) {
      setSetupStep('setup');
    }
  };

  const handleVerifyAndEnable = async () => {
    if (!verificationCode) {
      toast({
        title: "Verificatiecode vereist",
        description: "Voer de 6-cijferige code uit je authenticator app in.",
        variant: "destructive",
      });
      return;
    }

    const result = await enable2FA(verificationCode);
    if (result && typeof result === 'object' && 'backupCodes' in result) {
      setBackupCodes(result.backupCodes);
      setShowBackupCodes(true);
      setSetupStep('initial');
      onStatusChange();
    }
  };

  const handleDisable = async () => {
    const confirmed = window.confirm(
      'Weet je zeker dat je 2FA wilt uitschakelen? Dit vermindert de beveiliging van je account.'
    );
    
    if (confirmed) {
      const success = await disable2FA(''); // In production, require password
      if (success) {
        onStatusChange();
      }
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Gekopieerd",
      description: "Tekst is gekopieerd naar het klembord.",
    });
  };

  const downloadBackupCodes = () => {
    const text = backupCodes.join('\n');
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'wietforum-backup-codes.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (showBackupCodes) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Backup Codes
          </CardTitle>
          <CardDescription>
            Bewaar deze backup codes op een veilige plaats. Je kunt ze gebruiken om in te loggen als je je telefoon kwijt bent.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <AlertDescription>
              <strong>Belangrijk:</strong> Deze codes worden maar één keer getoond. Bewaar ze veilig!
            </AlertDescription>
          </Alert>

          <div className="grid grid-cols-2 gap-2 p-4 bg-muted rounded-lg font-mono text-sm">
            {backupCodes.map((code, index) => (
              <div key={index} className="flex items-center justify-between p-2 bg-background rounded">
                <span>{code}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => copyToClipboard(code)}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>

          <div className="flex gap-2">
            <Button onClick={downloadBackupCodes} variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Download Codes
            </Button>
            <Button onClick={() => setShowBackupCodes(false)}>
              Ik heb de codes veilig opgeslagen
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          Twee-Factor Authenticatie (2FA)
          {currentStatus?.is_enabled && (
            <Badge variant="secondary">Ingeschakeld</Badge>
          )}
        </CardTitle>
        <CardDescription>
          Voeg een extra beveiligingslaag toe aan je account met 2FA.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {!currentStatus?.is_enabled ? (
          <>
            {setupStep === 'initial' && (
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Twee-factor authenticatie vereist een authenticator app zoals Google Authenticator, 
                  Authy, of Microsoft Authenticator.
                </p>
                <Button onClick={handleStartSetup} disabled={isLoading}>
                  <Smartphone className="h-4 w-4 mr-2" />
                  2FA Instellen
                </Button>
              </div>
            )}

            {setupStep === 'setup' && qrCodeUrl && (
              <div className="space-y-4">
                <div className="text-center">
                  <h4 className="font-medium mb-2">Stap 1: Scan de QR Code</h4>
                  <div className="inline-block p-4 bg-white rounded-lg">
                    <img src={qrCodeUrl} alt="2FA QR Code" className="w-48 h-48" />
                  </div>
                </div>

                <Separator />

                <div>
                  <h4 className="font-medium mb-2">Of voer handmatig in:</h4>
                  <div className="flex items-center gap-2">
                    <Input 
                      value={setupSecret || ''} 
                      readOnly 
                      className="font-mono text-xs"
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyToClipboard(setupSecret || '')}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <Button onClick={() => setSetupStep('verify')}>
                  Volgende Stap
                </Button>
              </div>
            )}

            {setupStep === 'verify' && (
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Stap 2: Verifieer je Setup</h4>
                  <p className="text-sm text-muted-foreground mb-4">
                    Voer de 6-cijferige code uit je authenticator app in:
                  </p>
                  
                  <div className="space-y-2">
                    <Label htmlFor="verification-code">Verificatiecode</Label>
                    <Input
                      id="verification-code"
                      value={verificationCode}
                      onChange={(e) => setVerificationCode(e.target.value)}
                      placeholder="123456"
                      maxLength={6}
                      className="font-mono text-center text-lg tracking-widest"
                    />
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button onClick={() => setSetupStep('setup')} variant="outline">
                    Terug
                  </Button>
                  <Button 
                    onClick={handleVerifyAndEnable} 
                    disabled={isLoading || verificationCode.length !== 6}
                  >
                    2FA Inschakelen
                  </Button>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="space-y-4">
            <Alert>
              <Shield className="h-4 w-4" />
              <AlertDescription>
                Twee-factor authenticatie is ingeschakeld voor je account.
              </AlertDescription>
            </Alert>

            <Button onClick={handleDisable} variant="destructive" disabled={isLoading}>
              2FA Uitschakelen
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TwoFactorSetup;