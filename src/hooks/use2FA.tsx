import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import * as speakeasy from 'speakeasy';
import QRCode from 'qrcode';

interface TwoFactorAuth {
  id?: string;
  is_enabled: boolean;
  secret?: string;
  backup_codes?: string[];
  setup_completed_at?: string;
}

export const use2FA = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [isLoading, setIsLoading] = useState(false);
  const [setupSecret, setSetupSecret] = useState<string | null>(null);
  const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null);

  // Generate 2FA setup
  const generate2FASetup = useCallback(async () => {
    if (!user) return null;

    setIsLoading(true);
    try {
      // Generate secret
      const secret = speakeasy.generateSecret({
        name: `WietForum (${user.email})`,
        issuer: 'WietForum',
        length: 32,
      });

      // Generate QR code
      const qrCodeDataUrl = await QRCode.toDataURL(secret.otpauth_url!);
      
      setSetupSecret(secret.base32);
      setQrCodeUrl(qrCodeDataUrl);

      return {
        secret: secret.base32,
        qrCode: qrCodeDataUrl,
        manualEntryKey: secret.base32,
      };
    } catch (error) {
      console.error('Error generating 2FA setup:', error);
      toast({
        title: "Fout",
        description: "Er is een fout opgetreden bij het genereren van 2FA setup.",
        variant: "destructive",
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [user, toast]);

  // Verify and enable 2FA
  const enable2FA = useCallback(async (token: string) => {
    if (!user || !setupSecret) return false;

    setIsLoading(true);
    try {
      // Verify token
      const verified = speakeasy.totp.verify({
        secret: setupSecret,
        encoding: 'base32',
        token,
        window: 2,
      });

      if (!verified) {
        toast({
          title: "Ongeldige code",
          description: "De verificatiecode is onjuist. Probeer opnieuw.",
          variant: "destructive",
        });
        return false;
      }

      // Generate backup codes
      const backupCodes = Array.from({ length: 10 }, () => 
        Math.random().toString(36).substring(2, 8).toUpperCase()
      );

      // Save to database
      const { error } = await supabase
        .from('user_2fa')
        .upsert({
          user_id: user.id,
          secret: setupSecret,
          is_enabled: true,
          backup_codes: backupCodes,
          backup_codes_used: [],
          setup_completed_at: new Date().toISOString(),
        });

      if (error) throw error;

      toast({
        title: "2FA ingeschakeld",
        description: "Twee-factor authenticatie is succesvol ingeschakeld.",
      });

      // Clear setup state
      setSetupSecret(null);
      setQrCodeUrl(null);

      return { success: true, backupCodes };
    } catch (error) {
      console.error('Error enabling 2FA:', error);
      toast({
        title: "Fout",
        description: "Er is een fout opgetreden bij het inschakelen van 2FA.",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [user, setupSecret, toast]);

  // Disable 2FA
  const disable2FA = useCallback(async (password: string) => {
    if (!user) return false;

    setIsLoading(true);
    try {
      // Verify password (simplified - in production, verify via auth)
      const { error } = await supabase
        .from('user_2fa')
        .update({ is_enabled: false })
        .eq('user_id', user.id);

      if (error) throw error;

      toast({
        title: "2FA uitgeschakeld",
        description: "Twee-factor authenticatie is uitgeschakeld.",
      });

      return true;
    } catch (error) {
      console.error('Error disabling 2FA:', error);
      toast({
        title: "Fout",
        description: "Er is een fout opgetreden bij het uitschakelen van 2FA.",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [user, toast]);

  // Verify 2FA token
  const verify2FAToken = useCallback(async (token: string) => {
    if (!user) return false;

    try {
      const { data: twoFAData, error } = await supabase
        .from('user_2fa')
        .select('secret, backup_codes, backup_codes_used')
        .eq('user_id', user.id)
        .eq('is_enabled', true)
        .single();

      if (error || !twoFAData) return false;

      // Try TOTP verification first
      const verified = speakeasy.totp.verify({
        secret: twoFAData.secret,
        encoding: 'base32',
        token,
        window: 2,
      });

      if (verified) {
        return true;
      }

      // Try backup codes
      const backupCodes = Array.isArray(twoFAData.backup_codes) ? twoFAData.backup_codes as string[] : [];
      if (backupCodes.includes(token.toUpperCase())) {
        const usedCodes = Array.isArray(twoFAData.backup_codes_used) ? twoFAData.backup_codes_used as string[] : [];
        
        if (!usedCodes.includes(token.toUpperCase())) {
          // Mark backup code as used
          await supabase
            .from('user_2fa')
            .update({
              backup_codes_used: [...usedCodes, token.toUpperCase()],
              last_used_at: new Date().toISOString(),
            })
            .eq('user_id', user.id);

          return true;
        }
      }

      return false;
    } catch (error) {
      console.error('Error verifying 2FA token:', error);
      return false;
    }
  }, [user]);

  // Get 2FA status
  const get2FAStatus = useCallback(async (): Promise<TwoFactorAuth | null> => {
    if (!user) return null;

    try {
      const { data, error } = await supabase
        .from('user_2fa')
        .select('id, is_enabled, backup_codes, setup_completed_at')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      
      return data || { is_enabled: false };
    } catch (error) {
      console.error('Error fetching 2FA status:', error);
      return { is_enabled: false };
    }
  }, [user]);

  return {
    isLoading,
    setupSecret,
    qrCodeUrl,
    generate2FASetup,
    enable2FA,
    disable2FA,
    verify2FAToken,
    get2FAStatus,
  };
};