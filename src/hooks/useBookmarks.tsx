
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

interface UseBookmarksReturn {
  bookmarks: Set<string>;
  toggleBookmark: (itemId: string, itemType: 'topic' | 'reply') => void;
  isBookmarked: (itemId: string) => boolean;
}

export function useBookmarks(): UseBookmarksReturn {
  const [bookmarks, setBookmarks] = useState<Set<string>>(new Set());
  const { toast } = useToast();
  const { isAuthenticated, user } = useAuth();

  // Load bookmarks from Supabase on mount
  useEffect(() => {
    const loadBookmarks = async () => {
      if (!user) return;

      try {
        const { data, error } = await supabase
          .from('bookmarks')
          .select('item_id')
          .eq('user_id', user.id);

        if (error) {
          console.error('Error loading bookmarks:', error);
          return;
        }

        const bookmarkIds = new Set(data?.map(b => b.item_id) || []);
        setBookmarks(bookmarkIds);
      } catch (error) {
        console.error('Error loading bookmarks:', error);
      }
    };

    loadBookmarks();
  }, [user]);

  const toggleBookmark = async (itemId: string, itemType: 'topic' | 'reply') => {
    if (!isAuthenticated || !user) {
      toast({
        title: 'Inloggen vereist',
        description: 'Je moet ingelogd zijn om content op te slaan.',
        variant: 'destructive',
      });
      return;
    }

    const isCurrentlyBookmarked = bookmarks.has(itemId);

    try {
      if (isCurrentlyBookmarked) {
        // Remove bookmark
        const { error } = await supabase
          .from('bookmarks')
          .delete()
          .eq('user_id', user.id)
          .eq('item_id', itemId);

        if (error) throw error;

        setBookmarks(prev => {
          const newBookmarks = new Set(prev);
          newBookmarks.delete(itemId);
          return newBookmarks;
        });

        toast({
          title: 'Bladwijzer verwijderd',
          description: `${itemType === 'topic' ? 'Topic' : 'Reactie'} is uit je bladwijzers verwijderd.`,
        });
      } else {
        // Add bookmark
        const { error } = await supabase
          .from('bookmarks')
          .insert({
            user_id: user.id,
            item_id: itemId,
            item_type: itemType,
          });

        if (error) throw error;

        setBookmarks(prev => {
          const newBookmarks = new Set(prev);
          newBookmarks.add(itemId);
          return newBookmarks;
        });

        toast({
          title: 'Bladwijzer toegevoegd',
          description: `${itemType === 'topic' ? 'Topic' : 'Reactie'} is opgeslagen in je bladwijzers.`,
        });
      }
    } catch (error) {
      console.error('Error toggling bookmark:', error);
      toast({
        title: 'Fout bij opslaan',
        description: 'Er is een fout opgetreden bij het bijwerken van je bladwijzers.',
        variant: 'destructive',
      });
    }
  };

  const isBookmarked = (itemId: string): boolean => {
    return bookmarks.has(itemId);
  };

  return {
    bookmarks,
    toggleBookmark,
    isBookmarked,
  };
}
