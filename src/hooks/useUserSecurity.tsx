import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface SecurityEvent {
  id: string;
  event_type: string;
  event_description: string;
  ip_address?: unknown;
  user_agent?: string;
  risk_level: string;
  created_at: string;
  metadata?: any;
}

interface UserSession {
  id: string;
  device_info?: any;
  ip_address?: unknown;
  location?: string;
  last_activity_at: string;
  created_at: string;
  expires_at: string;
}

interface PrivacySettings {
  profile_visibility: string;
  email_notifications: boolean;
  activity_tracking: boolean;
  data_sharing: boolean;
  marketing_emails: boolean;
  security_alerts: boolean;
}

interface TwoFactorAuth {
  id?: string;
  is_enabled: boolean;
  secret?: string;
  backup_codes?: string[];
}

export const useUserSecurity = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [securityEvents, setSecurityEvents] = useState<SecurityEvent[]>([]);
  const [userSessions, setUserSessions] = useState<UserSession[]>([]);
  const [privacySettings, setPrivacySettings] = useState<PrivacySettings | null>(null);
  const [twoFactorAuth, setTwoFactorAuth] = useState<TwoFactorAuth | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch security events
  const fetchSecurityEvents = useCallback(async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('user_security_events')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;
      setSecurityEvents(data || []);
    } catch (error) {
      console.error('Error fetching security events:', error);
    }
  }, [user]);

  // Fetch user sessions
  const fetchUserSessions = useCallback(async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('user_sessions')
        .select('*')
        .eq('user_id', user.id)
        .order('last_activity_at', { ascending: false });

      if (error) throw error;
      setUserSessions(data || []);
    } catch (error) {
      console.error('Error fetching user sessions:', error);
    }
  }, [user]);

  // Fetch privacy settings
  const fetchPrivacySettings = useCallback(async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('user_privacy_settings')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      
      if (data) {
        setPrivacySettings(data);
      } else {
        // Create default privacy settings
        const defaultSettings = {
          user_id: user.id,
          profile_visibility: 'public',
          email_notifications: true,
          activity_tracking: true,
          data_sharing: false,
          marketing_emails: false,
          security_alerts: true,
        };

        const { data: newSettings, error: createError } = await supabase
          .from('user_privacy_settings')
          .insert(defaultSettings)
          .select()
          .single();

        if (createError) throw createError;
        setPrivacySettings(newSettings);
      }
    } catch (error) {
      console.error('Error fetching privacy settings:', error);
    }
  }, [user]);

  // Fetch 2FA settings
  const fetch2FASettings = useCallback(async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('user_2fa')
        .select('id, is_enabled, backup_codes')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      
      if (data) {
        setTwoFactorAuth(data);
      } else {
        setTwoFactorAuth({ is_enabled: false });
      }
    } catch (error) {
      console.error('Error fetching 2FA settings:', error);
    }
  }, [user]);

  // Update privacy settings
  const updatePrivacySettings = useCallback(async (updates: Partial<PrivacySettings>) => {
    if (!user || !privacySettings) return;

    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('user_privacy_settings')
        .update(updates)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) throw error;
      setPrivacySettings(data);
      
      toast({
        title: "Privacy instellingen bijgewerkt",
        description: "Je privacy voorkeuren zijn succesvol opgeslagen.",
      });
    } catch (error) {
      console.error('Error updating privacy settings:', error);
      toast({
        title: "Fout",
        description: "Er is een fout opgetreden bij het bijwerken van je privacy instellingen.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [user, privacySettings, toast]);

  // Terminate session
  const terminateSession = useCallback(async (sessionId: string) => {
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('user_sessions')
        .delete()
        .eq('id', sessionId);

      if (error) throw error;
      
      setUserSessions(prev => prev.filter(session => session.id !== sessionId));
      
      toast({
        title: "Sessie beëindigd",
        description: "De sessie is succesvol beëindigd.",
      });
    } catch (error) {
      console.error('Error terminating session:', error);
      toast({
        title: "Fout",
        description: "Er is een fout opgetreden bij het beëindigen van de sessie.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  // Create security event
  const createSecurityEvent = useCallback(async (
    eventType: string,
    description: string,
    riskLevel: string = 'low',
    metadata: Record<string, any> = {}
  ) => {
    if (!user) return;

    try {
      const { error } = await supabase.rpc('create_security_event', {
        target_user_id: user.id,
        event_type: eventType,
        event_description: description,
        risk_level: riskLevel,
        metadata,
      });

      if (error) throw error;
      await fetchSecurityEvents();
    } catch (error) {
      console.error('Error creating security event:', error);
    }
  }, [user, fetchSecurityEvents]);

  useEffect(() => {
    if (user) {
      fetchSecurityEvents();
      fetchUserSessions();
      fetchPrivacySettings();
      fetch2FASettings();
    }
  }, [user, fetchSecurityEvents, fetchUserSessions, fetchPrivacySettings, fetch2FASettings]);

  return {
    securityEvents,
    userSessions,
    privacySettings,
    twoFactorAuth,
    isLoading,
    updatePrivacySettings,
    terminateSession,
    createSecurityEvent,
    refreshData: () => {
      fetchSecurityEvents();
      fetchUserSessions();
      fetchPrivacySettings();
      fetch2FASettings();
    },
  };
};