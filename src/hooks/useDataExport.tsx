import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface ExportRequest {
  id: string;
  request_type: string;
  status: string;
  file_url?: string;
  file_size_bytes?: number;
  created_at: string;
  completed_at?: string;
  expires_at?: string;
}

export const useDataExport = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [isLoading, setIsLoading] = useState(false);
  const [exportRequests, setExportRequests] = useState<ExportRequest[]>([]);

  // Request data export
  const requestDataExport = useCallback(async (exportType: 'full' | 'activity' | 'messages' | 'profile') => {
    if (!user) return false;

    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('data_export_requests')
        .insert({
          user_id: user.id,
          request_type: exportType,
          status: 'pending',
        })
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Export aangevraagd",
        description: "Je data export is aangevraagd en wordt verwerkt. Je ontvangt een melding wanneer deze klaar is.",
      });

      // Trigger background processing (in a real app, this would be handled by a background job)
      await processDataExport(data.id, exportType);

      await fetchExportRequests();
      return true;
    } catch (error) {
      console.error('Error requesting data export:', error);
      toast({
        title: "Fout",
        description: "Er is een fout opgetreden bij het aanvragen van de data export.",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [user, toast]);

  // Process data export (simplified version)
  const processDataExport = useCallback(async (requestId: string, exportType: string) => {
    if (!user) return;

    try {
      let exportData: any = {};

      // Gather data based on export type
      switch (exportType) {
        case 'full':
          // Get all user data
          const [profile, topics, replies, votes, bookmarks] = await Promise.all([
            supabase.from('profiles').select('*').eq('user_id', user.id).single(),
            supabase.from('topics').select('*').eq('author_id', user.id),
            supabase.from('replies').select('*').eq('author_id', user.id),
            supabase.from('votes').select('*').eq('user_id', user.id),
            supabase.from('bookmarks').select('*').eq('user_id', user.id),
          ]);
          
          exportData = {
            profile: profile.data,
            topics: topics.data,
            replies: replies.data,
            votes: votes.data,
            bookmarks: bookmarks.data,
            export_date: new Date().toISOString(),
          };
          break;

        case 'activity':
          const activity = await supabase
            .from('activity_feed')
            .select('*')
            .eq('user_id', user.id);
          exportData = { activity: activity.data };
          break;

        case 'messages':
          const messages = await supabase
            .from('messages')
            .select('*')
            .eq('sender_id', user.id);
          exportData = { messages: messages.data };
          break;

        case 'profile':
          const profileData = await supabase
            .from('profiles')
            .select('*')
            .eq('user_id', user.id)
            .single();
          exportData = { profile: profileData.data };
          break;
      }

      // Convert to JSON
      const jsonData = JSON.stringify(exportData, null, 2);
      const blob = new Blob([jsonData], { type: 'application/json' });
      
      // In a real implementation, this would be uploaded to storage
      // For now, we'll create a data URL
      const dataUrl = URL.createObjectURL(blob);
      
      // Update request status
      await supabase
        .from('data_export_requests')
        .update({
          status: 'completed',
          file_url: dataUrl,
          file_size_bytes: blob.size,
          completed_at: new Date().toISOString(),
          expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days
        })
        .eq('id', requestId);

    } catch (error) {
      console.error('Error processing data export:', error);
      
      // Update request status to failed
      await supabase
        .from('data_export_requests')
        .update({ status: 'failed' })
        .eq('id', requestId);
    }
  }, [user]);

  // Fetch export requests
  const fetchExportRequests = useCallback(async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('data_export_requests')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setExportRequests(data || []);
    } catch (error) {
      console.error('Error fetching export requests:', error);
    }
  }, [user]);

  // Download export file
  const downloadExport = useCallback((request: ExportRequest) => {
    if (!request.file_url) return;

    const link = document.createElement('a');
    link.href = request.file_url;
    link.download = `wiet-forum-belgie-export-${request.request_type}-${new Date(request.created_at).toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, []);

  return {
    isLoading,
    exportRequests,
    requestDataExport,
    fetchExportRequests,
    downloadExport,
  };
};