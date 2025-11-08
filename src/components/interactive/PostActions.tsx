
import React from 'react';
import { MessageSquare, Share2, Bookmark, Flag, Quote, Bell, BellOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

interface PostActionsProps {
  itemId: string;
  itemType: 'topic' | 'reply';
  isBookmarked: boolean;
  onBookmark: () => void;
  onQuote?: () => void;
  replyCount?: number;
  showReplyButton?: boolean;
  isSubscribed?: boolean;
  onSubscribe?: () => void;
  showSubscribe?: boolean;
}

export function PostActions({
  itemId,
  itemType,
  isBookmarked,
  onBookmark,
  onQuote,
  replyCount,
  showReplyButton = false,
  isSubscribed = false,
  onSubscribe,
  showSubscribe = false
}: PostActionsProps) {
  const { toast } = useToast();
  const { isAuthenticated } = useAuth();

  const handleShare = async () => {
    const url = `${window.location.origin}/forums/wetgeving/topic/${itemId}`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Check dit topic uit',
          url: url,
        });
      } catch (error) {
        // User cancelled sharing
      }
    } else {
      await navigator.clipboard.writeText(url);
      toast({
        title: 'Link gekopieerd',
        description: 'De link is naar je klembord gekopieerd.',
      });
    }
  };

  const handleReport = () => {
    if (!isAuthenticated) {
      toast({
        title: 'Inloggen vereist',
        description: 'Je moet ingelogd zijn om content te rapporteren.',
        variant: 'destructive',
      });
      return;
    }

    toast({
      title: 'Content gerapporteerd',
      description: 'Bedankt voor je melding. We zullen dit bekijken.',
    });
  };

  return (
    <div className="flex items-center gap-2">
      {showReplyButton && (
        <Button variant="ghost" size="sm" className="gap-2">
          <MessageSquare className="h-3 w-3" />
          <span className="text-xs">{replyCount || 0} reacties</span>
        </Button>
      )}
      
      {onQuote && (
        <Button variant="ghost" size="sm" onClick={onQuote} title="Citeer">
          <Quote className="h-3 w-3" />
        </Button>
      )}
      
      <Button 
        variant="ghost" 
        size="sm" 
        onClick={onBookmark}
        className={isBookmarked ? 'text-primary' : ''}
        title={isBookmarked ? 'Opgeslagen' : 'Opslaan'}
      >
        <Bookmark className={`h-3 w-3 ${isBookmarked ? 'fill-current' : ''}`} />
      </Button>
      
      {showSubscribe && onSubscribe && (
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={onSubscribe}
          className={isSubscribed ? 'text-primary' : ''}
          title={isSubscribed ? 'Volgend' : 'Volg dit topic'}
        >
          {isSubscribed ? (
            <Bell className="h-3 w-3 fill-current" />
          ) : (
            <BellOff className="h-3 w-3" />
          )}
        </Button>
      )}
      
      <Button variant="ghost" size="sm" onClick={handleShare} title="Delen">
        <Share2 className="h-3 w-3" />
      </Button>
      
      <Button variant="ghost" size="sm" onClick={handleReport} title="Rapporteer">
        <Flag className="h-3 w-3" />
      </Button>
    </div>
  );
}
