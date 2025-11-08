import React, { useState } from 'react';
import { Send, X, Smile } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { InlineRichTextEditor } from '@/components/rich-text/InlineRichTextEditor';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { motion } from 'framer-motion';
import EmojiPicker from 'emoji-picker-react';
import { cn } from '@/lib/utils';

interface ModernReplyBoxProps {
  user: {
    username?: string;
    avatar_url?: string;
    email?: string;
  };
  replyContent: string;
  onReplyContentChange: (content: string) => void;
  onSubmit: () => void;
  isSubmitting: boolean;
  maxCharacters?: number;
}

export function ModernReplyBox({
  user,
  replyContent,
  onReplyContentChange,
  onSubmit,
  isSubmitting,
  maxCharacters = 5000,
}: ModernReplyBoxProps) {
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  
  const getInitials = (name?: string) => {
    if (!name) return user.email?.charAt(0).toUpperCase() || '?';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const handleEmojiClick = (emojiObject: any) => {
    onReplyContentChange(replyContent + emojiObject.emoji);
    setShowEmojiPicker(false);
  };

  const characterCount = replyContent.replace(/<[^>]*>/g, '').length;
  const isOverLimit = characterCount > maxCharacters;
  const isNearLimit = characterCount > maxCharacters * 0.8;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card 
        className="transition-all duration-300 border-2 border-border/50 shadow-sm hover:shadow-lg"
      >
        <div className="p-4 space-y-4">
          {/* Header with Avatar */}
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10 ring-2 ring-primary/10">
              <AvatarImage src={user.avatar_url} />
              <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                {getInitials(user.username)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <p className="font-semibold text-sm text-foreground">
                {user.username || user.email}
              </p>
              <p className="text-xs text-muted-foreground">Wat wil je delen?</p>
            </div>
          </div>

          {/* Editor Area */}
          <div className="relative">
            <InlineRichTextEditor
              value={replyContent}
              onChange={onReplyContentChange}
              placeholder="Deel je gedachten, ervaringen of stel een vraag..."
              minHeight={120}
            />
          </div>

          {/* Character Counter */}
          {characterCount > 0 && (
            <div className={cn(
              "text-xs text-right transition-colors",
              isOverLimit ? "text-destructive font-semibold" : 
              isNearLimit ? "text-warning" : "text-muted-foreground"
            )}>
              {characterCount} / {maxCharacters}
            </div>
          )}

          {/* Actions Bar */}
          <div className="flex items-center justify-between gap-2 pt-2 border-t border-border/50">
            {/* Left: Emoji Picker */}
            <div className="relative">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                className="h-9 px-3 hover:bg-primary/10 transition-all"
              >
                <Smile className="h-4 w-4 mr-1" />
                Emoji
              </Button>
              
              {showEmojiPicker && (
                <div className="absolute bottom-full left-0 mb-2 z-50">
                  <div className="relative">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowEmojiPicker(false)}
                      className="absolute -top-2 -right-2 z-10 h-6 w-6 p-0 rounded-full bg-background shadow-md"
                    >
                      <X className="h-3 w-3" />
                    </Button>
                    <EmojiPicker onEmojiClick={handleEmojiClick} />
                  </div>
                </div>
              )}
            </div>

            {/* Right: Action Buttons */}
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onReplyContentChange('')}
                disabled={!replyContent || isSubmitting}
                className="h-9 px-3"
              >
                Annuleren
              </Button>
              
              <Button
                onClick={onSubmit}
                disabled={!replyContent.trim() || isSubmitting || isOverLimit}
                className="h-9 px-4 gap-2 bg-primary hover:bg-primary/90 transition-all hover:scale-105 min-h-[44px]"
              >
                {isSubmitting ? (
                  <>
                    <LoadingSpinner size="sm" />
                    Verzenden...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4" />
                    Reageren
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
