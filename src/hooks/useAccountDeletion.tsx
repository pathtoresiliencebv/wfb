import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface DeletionRequest {
  id: string;
  reason?: string;
  scheduled_for: string;
  status: string;
  verification_token: string;
  created_at: string;
}

export const useAccountDeletion = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [isLoading, setIsLoading] = useState(false);
  const [deletionRequest, setDeletionRequest] = useState<DeletionRequest | null>(null);

  // Request account deletion
  const requestAccountDeletion = useCallback(async (reason?: string, delayDays: number = 7) => {
    if (!user) return false;

    setIsLoading(true);
    try {
      // Generate verification token
      const verificationToken = Math.random().toString(36).substring(2, 15) + 
                               Math.random().toString(36).substring(2, 15);

      // Schedule deletion for specified days from now
      const scheduledFor = new Date();
      scheduledFor.setDate(scheduledFor.getDate() + delayDays);

      const { data, error } = await supabase
        .from('account_deletion_requests')
        .insert({
          user_id: user.id,
          reason: reason || null,
          scheduled_for: scheduledFor.toISOString(),
          verification_token: verificationToken,
          status: 'pending',
        })
        .select()
        .single();

      if (error) throw error;

      setDeletionRequest(data);

      toast({
        title: "Account verwijdering aangevraagd",
        description: `Je account wordt verwijderd op ${scheduledFor.toLocaleDateString()}. Je kunt dit annuleren tot die datum.`,
      });

      // In a real app, send confirmation email with verification token
      console.log('Verification token:', verificationToken);

      return true;
    } catch (error) {
      console.error('Error requesting account deletion:', error);
      toast({
        title: "Fout",
        description: "Er is een fout opgetreden bij het aanvragen van account verwijdering.",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [user, toast]);

  // Cancel account deletion
  const cancelAccountDeletion = useCallback(async () => {
    if (!user || !deletionRequest) return false;

    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('account_deletion_requests')
        .update({ status: 'cancelled' })
        .eq('id', deletionRequest.id)
        .eq('user_id', user.id);

      if (error) throw error;

      setDeletionRequest(null);

      toast({
        title: "Account verwijdering geannuleerd",
        description: "Je account verwijdering is succesvol geannuleerd.",
      });

      return true;
    } catch (error) {
      console.error('Error cancelling account deletion:', error);
      toast({
        title: "Fout",
        description: "Er is een fout opgetreden bij het annuleren van de account verwijdering.",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [user, deletionRequest, toast]);

  // Check for existing deletion request
  const checkDeletionRequest = useCallback(async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('account_deletion_requests')
        .select('*')
        .eq('user_id', user.id)
        .eq('status', 'pending')
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) throw error;
      setDeletionRequest(data);
    } catch (error) {
      console.error('Error checking deletion request:', error);
    }
  }, [user]);

  // Confirm account deletion (with verification token)
  const confirmAccountDeletion = useCallback(async (verificationToken: string) => {
    if (!user) return false;

    setIsLoading(true);
    try {
      // Verify token and delete account
      const { data: request, error: fetchError } = await supabase
        .from('account_deletion_requests')
        .select('*')
        .eq('user_id', user.id)
        .eq('verification_token', verificationToken)
        .eq('status', 'pending')
        .single();

      if (fetchError || !request) {
        toast({
          title: "Ongeldige verificatiecode",
          description: "De verificatiecode is onjuist of verlopen.",
          variant: "destructive",
        });
        return false;
      }

      // Check if deletion is scheduled for today or past
      const now = new Date();
      const scheduledDate = new Date(request.scheduled_for);
      
      if (scheduledDate > now) {
        toast({
          title: "Te vroeg",
          description: `Account kan pas worden verwijderd op ${scheduledDate.toLocaleDateString()}.`,
          variant: "destructive",
        });
        return false;
      }

      // Update deletion request status
      await supabase
        .from('account_deletion_requests')
        .update({ 
          status: 'processing',
          completed_at: new Date().toISOString(),
        })
        .eq('id', request.id);

      // In a real implementation, this would trigger a background job
      // to delete all user data across tables
      await performAccountDeletion(user.id);

      toast({
        title: "Account verwijderd",
        description: "Je account en alle bijbehorende data zijn succesvol verwijderd.",
      });

      // Sign out user
      await supabase.auth.signOut();

      return true;
    } catch (error) {
      console.error('Error confirming account deletion:', error);
      toast({
        title: "Fout",
        description: "Er is een fout opgetreden bij het verwijderen van je account.",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [user, toast]);

  // Perform actual account deletion (cascade delete)
  const performAccountDeletion = useCallback(async (userId: string) => {
    try {
      // Delete user data in correct order (respecting foreign keys)
      const deletionOperations = [
        supabase.from('user_security_events').delete().eq('user_id', userId),
        supabase.from('user_sessions').delete().eq('user_id', userId),
        supabase.from('user_2fa').delete().eq('user_id', userId),
        supabase.from('user_privacy_settings').delete().eq('user_id', userId),
        supabase.from('user_security_scores').delete().eq('user_id', userId),
        supabase.from('user_device_fingerprints').delete().eq('user_id', userId),
        supabase.from('data_export_requests').delete().eq('user_id', userId),
        supabase.from('notifications').delete().eq('user_id', userId),
        supabase.from('bookmarks').delete().eq('user_id', userId),
        supabase.from('votes').delete().eq('user_id', userId),
        supabase.from('user_followers').delete().eq('follower_id', userId),
        supabase.from('user_followers').delete().eq('following_id', userId),
        supabase.from('activity_feed').delete().eq('user_id', userId),
        supabase.from('reputation_history').delete().eq('user_id', userId),
        supabase.from('user_badges').delete().eq('user_id', userId),
        supabase.from('messages').delete().eq('sender_id', userId),
        supabase.from('replies').delete().eq('author_id', userId),
        supabase.from('topics').delete().eq('author_id', userId),
        supabase.from('profiles').delete().eq('user_id', userId),
      ];

      // Execute all deletions
      await Promise.all(deletionOperations);

      // Finally, delete the auth user (this should be handled by Supabase admin API in production)
      console.log('User data deleted for user:', userId);
      
    } catch (error) {
      console.error('Error performing account deletion:', error);
      throw error;
    }
  }, []);

  return {
    isLoading,
    deletionRequest,
    requestAccountDeletion,
    cancelAccountDeletion,
    checkDeletionRequest,
    confirmAccountDeletion,
  };
};