
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

interface UseBookmarksReturn {
  bookmarks: Set<string>;
  toggleBookmark: (itemId: string, itemType: 'topic' | 'reply') => void;
  isBookmarked: (itemId: string) => boolean;
}

export function useBookmarks(): UseBookmarksReturn {
  const [bookmarks, setBookmarks] = useState<Set<string>>(new Set());
  const { toast } = useToast();
  const { isAuthenticated } = useAuth();

  const toggleBookmark = (itemId: string, itemType: 'topic' | 'reply') => {
    if (!isAuthenticated) {
      toast({
        title: 'Inloggen vereist',
        description: 'Je moet ingelogd zijn om content op te slaan.',
        variant: 'destructive',
      });
      return;
    }

    setBookmarks(prev => {
      const newBookmarks = new Set(prev);
      const isCurrentlyBookmarked = newBookmarks.has(itemId);
      
      if (isCurrentlyBookmarked) {
        newBookmarks.delete(itemId);
        toast({
          title: 'Bladwijzer verwijderd',
          description: `${itemType === 'topic' ? 'Topic' : 'Reactie'} is uit je bladwijzers verwijderd.`,
        });
      } else {
        newBookmarks.add(itemId);
        toast({
          title: 'Bladwijzer toegevoegd',
          description: `${itemType === 'topic' ? 'Topic' : 'Reactie'} is opgeslagen in je bladwijzers.`,
        });
      }
      
      return newBookmarks;
    });
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
