import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { authenticator } from '@otplib/preset-browser';
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
      const secret = authenticator.generateSecret();
      
      // Generate OTP auth URL
      const otpauthUrl = authenticator.keyuri(
        user.email,
        'WietForum',
        secret
      );

      // Generate QR code
      const qrCodeDataUrl = await QRCode.toDataURL(otpauthUrl);
      
      setSetupSecret(secret);
      setQrCodeUrl(qrCodeDataUrl);

      return {
        secret: secret,
        qrCode: qrCodeDataUrl,
        manualEntryKey: secret,
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
      const verified = authenticator.verify({
        token,
        secret: setupSecret,
      });

      if (!verified) {
        toast({
          title: "Ongeldige code",
          description: "De verificatiecode is onjuist. Probeer opnieuw.",
          variant: "destructive",
        });
        return false;
      }

      // Generate cryptographically secure backup codes (SECURITY FIX)
      const backupCodes = Array.from({ length: 10 }, () => {
        const array = new Uint8Array(4);
        crypto.getRandomValues(array);
        return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('').toUpperCase();
      });

      // Create security event for 2FA enable
      await supabase.rpc('create_security_event', {
        target_user_id: user.id,
        event_type: 'security_2fa_enabled',
        event_description: 'Two-factor authentication was enabled',
        risk_level: 'low'
      });

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

  // Disable 2FA (SECURITY FIXED - requires password verification)
  const disable2FA = useCallback(async (password: string) => {
    if (!user) return false;

    setIsLoading(true);
    try {
      // Verify password before disabling 2FA (SECURITY FIX)
      const { data: isValid, error: verifyError } = await supabase
        .rpc('verify_user_password', {
          user_email: user.email,
          password_to_verify: password
        });

      if (verifyError) throw verifyError;
      
      if (!isValid) {
        toast({
          title: "Ongeldig wachtwoord",
          description: "Het ingevoerde wachtwoord is onjuist.",
          variant: "destructive",
        });
        return false;
      }

      // Create security event for 2FA disable
      await supabase.rpc('create_security_event', {
        target_user_id: user.id,
        event_type: 'security_2fa_disabled',
        event_description: 'Two-factor authentication was disabled',
        risk_level: 'medium'
      });

      const { error } = await supabase
        .from('user_2fa')
        .update({ 
          is_enabled: false,
          secret: null,
          backup_codes: null,
          backup_codes_used: '[]'
        })
        .eq('user_id', user.id);

      if (error) throw error;

      toast({
        title: "2FA uitgeschakeld",
        description: "Twee-factor authenticatie is succesvol uitgeschakeld.",
      });

      return true;
    } catch (error) {
      console.error('Error disabling 2FA:', error);
      toast({
        title: "Fout",
        description: "Er ging iets mis bij het uitschakelen van 2FA.",
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
      const verified = authenticator.verify({
        token,
        secret: twoFAData.secret,
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