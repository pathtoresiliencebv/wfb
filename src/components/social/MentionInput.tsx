import { useState, useRef, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';

interface User {
  id: string;
  username: string;
  display_name: string;
  avatar_url?: string;
}

interface MentionInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  onMention?: (user: User) => void;
}

export function MentionInput({
  value,
  onChange,
  placeholder,
  className,
  onMention
}: MentionInputProps) {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [mentionQuery, setMentionQuery] = useState('');
  const [cursorPosition, setCursorPosition] = useState(0);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Fetch users for mentions
  const { data: users = [] } = useQuery({
    queryKey: ['mention-users', mentionQuery],
    queryFn: async () => {
      if (!mentionQuery) return [];
      
      const { data, error } = await supabase
        .from('profiles')
        .select('id, username, display_name, avatar_url')
        .ilike('username', `%${mentionQuery}%`)
        .limit(10);
      
      if (error) throw error;
      return data as User[];
    },
    enabled: mentionQuery.length > 0,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    const position = e.target.selectionStart;
    
    onChange(newValue);
    setCursorPosition(position);
    
    // Check for mention trigger
    const textBeforeCursor = newValue.slice(0, position);
    const mentionMatch = textBeforeCursor.match(/@(\w*)$/);
    
    if (mentionMatch) {
      setMentionQuery(mentionMatch[1]);
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
      setMentionQuery('');
    }
  };

  const insertMention = (user: User) => {
    const textBeforeCursor = value.slice(0, cursorPosition);
    const textAfterCursor = value.slice(cursorPosition);
    
    // Replace the @query with @username
    const mentionMatch = textBeforeCursor.match(/@(\w*)$/);
    if (mentionMatch) {
      const beforeMention = textBeforeCursor.slice(0, mentionMatch.index);
      const newValue = `${beforeMention}@${user.username} ${textAfterCursor}`;
      
      onChange(newValue);
      setShowSuggestions(false);
      setMentionQuery('');
      onMention?.(user);
      
      // Focus back to textarea
      setTimeout(() => {
        textareaRef.current?.focus();
      }, 0);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (showSuggestions && (e.key === 'ArrowUp' || e.key === 'ArrowDown' || e.key === 'Enter')) {
      e.preventDefault();
      // Handle suggestion navigation (simplified for now)
      if (e.key === 'Enter' && users.length > 0) {
        insertMention(users[0]);
      }
    }
  };

  return (
    <div className="relative">
      <Textarea
        ref={textareaRef}
        value={value}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className={cn("min-h-[100px]", className)}
      />
      
      {showSuggestions && users.length > 0 && (
        <div className="absolute z-50 w-full mt-1 bg-background border border-border rounded-md shadow-lg max-h-48 overflow-y-auto">
          {users.map((user) => (
            <button
              key={user.id}
              onClick={() => insertMention(user)}
              className="w-full px-3 py-2 text-left hover:bg-muted flex items-center gap-2"
            >
              {user.avatar_url && (
                <img 
                  src={user.avatar_url} 
                  alt={user.username}
                  className="w-6 h-6 rounded-full"
                />
              )}
              <div className="flex flex-col">
                <span className="font-medium">@{user.username}</span>
                <span className="text-sm text-muted-foreground">
                  {user.display_name}
                </span>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}