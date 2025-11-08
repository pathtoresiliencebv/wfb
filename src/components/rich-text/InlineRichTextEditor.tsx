import React, { useState, useRef, useEffect } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Bold, Italic, Link as LinkIcon, List, Image as ImageIcon, Smile, Paperclip } from 'lucide-react';
import { cn } from '@/lib/utils';
import DOMPurify from 'dompurify';
import EmojiPicker, { EmojiClickData } from 'emoji-picker-react';
import { useImageUpload } from '@/hooks/useImageUpload';
import { ImageUpload } from '@/components/ui/image-upload';

interface InlineRichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  minHeight?: number;
  maxHeight?: number;
  className?: string;
}

export function InlineRichTextEditor({
  value,
  onChange,
  placeholder = 'Schrijf je bericht...',
  minHeight = 120,
  maxHeight,
  className
}: InlineRichTextEditorProps) {
  const [isFocused, setIsFocused] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showImageUpload, setShowImageUpload] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

  // Insert text or apply formatting at cursor position
  const insertText = (before: string, after: string = '') => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.substring(start, end);
    const newText = value.substring(0, start) + before + selectedText + after + value.substring(end);
    
    onChange(newText);
    
    // Restore focus and cursor position
    setTimeout(() => {
      textarea.focus();
      const newCursorPos = start + before.length + selectedText.length;
      textarea.setSelectionRange(newCursorPos, newCursorPos);
    }, 0);
  };

  // Handle emoji selection
  const handleEmojiClick = (emojiData: EmojiClickData) => {
    insertText(emojiData.emoji);
    setShowEmojiPicker(false);
  };

  // Handle image upload
  const handleImageUploaded = async (files: File[]) => {
    if (files.length === 0) return;
    // For now, just show the user they can upload, actual implementation would upload to Supabase
    setShowImageUpload(false);
  };

  // Toolbar buttons
  const toolbarButtons = [
    { icon: Bold, action: () => insertText('**', '**'), title: 'Vet (Ctrl+B)' },
    { icon: Italic, action: () => insertText('*', '*'), title: 'Cursief (Ctrl+I)' },
    { icon: LinkIcon, action: () => insertText('[', '](url)'), title: 'Link' },
    { icon: List, action: () => insertText('- ', ''), title: 'Lijst' },
    { icon: Paperclip, action: () => {}, title: 'Bijlage (komt binnenkort)' },
    { icon: Smile, action: () => setShowEmojiPicker(!showEmojiPicker), title: 'Emoji' },
    { icon: ImageIcon, action: () => setShowImageUpload(!showImageUpload), title: 'Afbeelding' },
  ];

  // Render preview with basic formatting
  const renderPreview = (text: string) => {
    let html = text;
    
    // Bold
    html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
    
    // Italic
    html = html.replace(/\*(.+?)\*/g, '<em>$1</em>');
    
    // Underline
    html = html.replace(/_(.+?)_/g, '<u>$1</u>');
    
    // Links
    html = html.replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2" class="text-primary underline" target="_blank" rel="noopener noreferrer">$1</a>');
    
    // Blockquotes
    html = html.replace(/^&gt; (.+)$/gm, '<blockquote class="border-l-4 border-primary pl-4 italic">$1</blockquote>');
    
    // Lists
    html = html.replace(/^- (.+)$/gm, '<li>$1</li>');
    html = html.replace(/(<li>.*<\/li>)/s, '<ul class="list-disc pl-6">$1</ul>');
    
    // Images
    html = html.replace(/!\[(.+?)\]\((.+?)\)/g, '<img src="$2" alt="$1" class="max-w-full h-auto rounded-md" />');
    
    // Line breaks
    html = html.replace(/\n/g, '<br>');
    
    return html;
  };

  const sanitizedPreview = DOMPurify.sanitize(renderPreview(value), {
    ALLOWED_TAGS: ['strong', 'em', 'u', 'a', 'br', 'blockquote', 'ul', 'li', 'img'],
    ALLOWED_ATTR: ['href', 'target', 'rel', 'src', 'alt', 'class']
  });

  return (
    <div className={cn("space-y-2 border rounded-md", className)}>
      {/* Top Toolbar - Formatting */}
      <div className="flex items-center gap-1 p-2 bg-muted/50 rounded-t-md border-b flex-wrap">
        {toolbarButtons.slice(0, 4).map((button) => (
          <Button
            key={button.title}
            type="button"
            variant="ghost"
            size="sm"
            onClick={button.action}
            title={button.title}
            className="h-8 w-8 p-0"
          >
            <button.icon className="h-4 w-4" />
          </Button>
        ))}
      </div>

      {/* Image Upload Section - Commented out for now */}
      {/* {showImageUpload && (
        <div className="p-4 border-b bg-muted/20">
          <p className="text-sm text-muted-foreground">Afbeelding upload komt binnenkort...</p>
        </div>
      )} */}

      {/* Emoji Picker */}
      {showEmojiPicker && (
        <div className="absolute z-50 mt-2">
          <EmojiPicker onEmojiClick={handleEmojiClick} />
        </div>
      )}

      {/* Editor Area */}
      <div className="relative">
        <Textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          className={cn(
            "min-h-[120px] resize-none font-mono text-sm border-0 focus-visible:ring-0",
            "focus-visible:ring-offset-0",
            minHeight && `min-h-[${minHeight}px]`,
            maxHeight && `max-h-[${maxHeight}px]`,
            className
          )}
        />
        
        {!isFocused && value && (
          <div 
            className="absolute inset-0 p-3 pointer-events-none overflow-auto bg-background/50 backdrop-blur-sm rounded-md"
            dangerouslySetInnerHTML={{ __html: sanitizedPreview }}
          />
        )}
      </div>

      {/* Bottom Toolbar - Media & Emoji (Right Aligned) */}
      <div className="flex items-center justify-between p-2 bg-muted/50 rounded-b-md border-t">
        <div className="text-xs text-muted-foreground">
          **vet** *cursief* [link](url)
        </div>
        <div className="flex items-center gap-1">
          {toolbarButtons.slice(4).map((button) => (
            <Button
              key={button.title}
              type="button"
              variant="ghost"
              size="sm"
              onClick={button.action}
              title={button.title}
              className="h-8 w-8 p-0"
            >
              <button.icon className="h-4 w-4" />
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}
