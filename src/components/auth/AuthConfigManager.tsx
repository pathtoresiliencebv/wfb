import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const AuthConfigManager = () => {
  useEffect(() => {
    const configureAuthUrls = async () => {
      // Only run in production or when the hostname isn't localhost
      if (window.location.hostname === 'localhost') {
        return;
      }

      try {
        const currentUrl = window.location.origin;
        
        // Call our edge function to update auth configuration
        const { data, error } = await supabase.functions.invoke('update-auth-config', {
          body: { redirectUrl: currentUrl }
        });

        if (error) {
          console.error('Failed to configure auth URLs:', error);
        } else {
          console.log('Auth URLs configured successfully:', data);
        }
      } catch (error) {
        console.error('Error configuring auth URLs:', error);
      }
    };

    configureAuthUrls();
  }, []);

  return null; // This component doesn't render anything
};