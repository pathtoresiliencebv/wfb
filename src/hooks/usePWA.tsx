import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface PWASettings {
  id: string;
  user_id: string;
  push_notifications_enabled: boolean;
  offline_reading_enabled: boolean;
  sync_frequency: 'realtime' | 'hourly' | 'daily';
  last_sync_at?: string;
  push_subscription?: any;
}

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export function usePWA() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  // Get PWA settings
  const { data: pwaSettings, isLoading } = useQuery({
    queryKey: ['pwa-settings', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      
      const { data, error } = await supabase
        .from('user_pwa_settings')
        .select('*')
        .eq('user_id', user.id)
        .single();
      
      if (error && error.code !== 'PGRST116') throw error;
      return data as PWASettings | null;
    },
    enabled: !!user?.id,
  });

  // Update PWA settings mutation
  const updateSettingsMutation = useMutation({
    mutationFn: async (settings: Partial<PWASettings>) => {
      if (!user?.id) throw new Error('Not authenticated');
      
      const { data, error } = await supabase
        .from('user_pwa_settings')
        .upsert({
          user_id: user.id,
          ...settings,
          updated_at: new Date().toISOString(),
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pwa-settings'] });
      toast({
        title: 'Instellingen bijgewerkt',
        description: 'Je PWA instellingen zijn opgeslagen.',
      });
    },
  });

  // Handle install prompt
  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setIsInstallable(true);
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setIsInstallable(false);
      setDeferredPrompt(null);
      toast({
        title: 'App geïnstalleerd!',
        description: 'Wiet Forum België is nu geïnstalleerd op je apparaat.',
      });
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    // Check if already installed
    if (window.matchMedia && window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, [toast]);

  // Handle online/offline status
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Install app
  const installApp = async () => {
    if (!deferredPrompt) return false;

    try {
      await deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      
      if (outcome === 'accepted') {
        setIsInstalled(true);
        setIsInstallable(false);
        setDeferredPrompt(null);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error installing app:', error);
      return false;
    }
  };

  // Enable push notifications
  const enablePushNotifications = async () => {
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
      toast({
        title: 'Niet ondersteund',
        description: 'Push notificaties worden niet ondersteund door je browser.',
        variant: 'destructive',
      });
      return false;
    }

    try {
      const permission = await Notification.requestPermission();
      if (permission !== 'granted') {
        toast({
          title: 'Toestemming geweigerd',
          description: 'Je hebt geen toestemming gegeven voor notificaties.',
          variant: 'destructive',
        });
        return false;
      }

      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: process.env.VITE_VAPID_PUBLIC_KEY,
      });

      await updateSettingsMutation.mutateAsync({
        push_notifications_enabled: true,
        push_subscription: subscription.toJSON(),
      });

      return true;
    } catch (error) {
      console.error('Error enabling push notifications:', error);
      toast({
        title: 'Fout',
        description: 'Kon push notificaties niet inschakelen.',
        variant: 'destructive',
      });
      return false;
    }
  };

  // Disable push notifications
  const disablePushNotifications = async () => {
    try {
      if ('serviceWorker' in navigator) {
        const registration = await navigator.serviceWorker.ready;
        const subscription = await registration.pushManager.getSubscription();
        if (subscription) {
          await subscription.unsubscribe();
        }
      }

      await updateSettingsMutation.mutateAsync({
        push_notifications_enabled: false,
        push_subscription: null,
      });

      return true;
    } catch (error) {
      console.error('Error disabling push notifications:', error);
      return false;
    }
  };

  // Sync data
  const syncData = async () => {
    try {
      // Trigger data sync - invalidate all queries
      await queryClient.invalidateQueries();
      
      await updateSettingsMutation.mutateAsync({
        last_sync_at: new Date().toISOString(),
      });

      toast({
        title: 'Gesynchroniseerd',
        description: 'Je data is bijgewerkt.',
      });
      
      return true;
    } catch (error) {
      console.error('Error syncing data:', error);
      toast({
        title: 'Sync fout',
        description: 'Kon data niet synchroniseren.',
        variant: 'destructive',
      });
      return false;
    }
  };

  // Check if feature is supported
  const isSupported = {
    install: 'serviceWorker' in navigator,
    pushNotifications: 'serviceWorker' in navigator && 'PushManager' in window,
    offline: 'serviceWorker' in navigator && 'caches' in window,
  };

  return {
    pwaSettings,
    isLoading,
    isInstallable,
    isInstalled,
    isOnline,
    isSupported,
    installApp,
    enablePushNotifications,
    disablePushNotifications,
    syncData,
    updateSettings: updateSettingsMutation.mutate,
    isUpdating: updateSettingsMutation.isPending,
  };
}