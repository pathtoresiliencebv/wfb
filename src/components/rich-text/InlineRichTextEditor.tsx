import React, { useState, useCallback, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ImageUpload } from '@/components/ui/image-upload';
import { useIsMobile } from '@/hooks/use-mobile';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import EmojiPicker, { EmojiClickData } from 'emoji-picker-react';
import { 
  Bold, 
  Italic, 
  Underline, 
  Link, 
  List, 
  ListOrdered, 
  Image,
  Smile,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import DOMPurify from 'dompurify';

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
  placeholder = "Schrijf je bericht...",
  minHeight = 200,
  maxHeight = 500,
  className,
}: InlineRichTextEditorProps) {
  const [showImageUpload, setShowImageUpload] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const isMobile = useIsMobile();
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const insertText = (before: string, after: string = '') => {
    if (!textareaRef.current) return;

    const textarea = textareaRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.substring(start, end);
    
    const newText = value.substring(0, start) + before + selectedText + after + value.substring(end);
    onChange(newText);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + before.length, end + before.length);
    }, 0);
  };

  const handleEmojiClick = (emojiData: EmojiClickData) => {
    if (!textareaRef.current) return;

    const textarea = textareaRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    
    const newText = value.substring(0, start) + emojiData.emoji + value.substring(end);
    onChange(newText);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + emojiData.emoji.length, start + emojiData.emoji.length);
    }, 0);

    setShowEmojiPicker(false);
  };

  const handleImageUploaded = useCallback((imageUrl: string) => {
    const imageMarkdown = `![Afbeelding](${imageUrl})`;
    insertText(imageMarkdown);
    setShowImageUpload(false);
  }, [value]);

  const toolbarButtons = [
    { icon: Bold, action: () => insertText('**', '**'), title: 'Vet (Ctrl+B)' },
    { icon: Italic, action: () => insertText('*', '*'), title: 'Cursief (Ctrl+I)' },
    { icon: Underline, action: () => insertText('<u>', '</u>'), title: 'Onderstreept' },
    { icon: Link, action: () => insertText('[', '](url)'), title: 'Link' },
    { icon: List, action: () => insertText('- '), title: 'Lijst' },
    { icon: ListOrdered, action: () => insertText('1. '), title: 'Genummerde lijst' },
    { icon: Image, action: () => setShowImageUpload(true), title: 'Afbeelding uploaden' },
  ];

  const renderPreview = (text: string) => {
    if (!text) return '';
    
    const html = text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/<u>(.*?)<\/u>/g, '<u>$1</u>')
      .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" class="text-primary hover:underline">$1</a>')
      .replace(/^> (.*$)/gim, '<blockquote class="border-l-4 border-muted-foreground pl-4 italic my-2">$1</blockquote>')
      .replace(/^- (.*$)/gim, '<li class="ml-4">$1</li>')
      .replace(/^1\. (.*$)/gim, '<li class="ml-4">$1</li>')
      .replace(/!\[(.*?)\]\((.*?)\)/g, '<img src="$2" alt="$1" class="max-w-full h-auto rounded-md my-2" />')
      .replace(/\n/g, '<br>');
    
    return DOMPurify.sanitize(html, {
      ALLOWED_TAGS: ['strong', 'em', 'u', 'a', 'blockquote', 'li', 'img', 'br'],
      ALLOWED_ATTR: ['href', 'class', 'src', 'alt'],
      ALLOW_DATA_ATTR: false
    });
  };

  return (
    <div className={cn('space-y-3', className)}>
      {/* Toolbar */}
      <div className="flex items-center gap-2 border-b pb-2 overflow-x-auto">
        <div className="flex items-center gap-1 flex-shrink-0">
          {toolbarButtons.map((button, index) => (
            <Button
              key={index}
              variant="ghost"
              size="sm"
              onClick={button.action}
              title={button.title}
              className="min-h-[44px] min-w-[44px] p-0 flex-shrink-0"
            >
              <button.icon className="h-4 w-4" />
            </Button>
          ))}
          
          {/* Emoji Picker */}
          <Popover open={showEmojiPicker} onOpenChange={setShowEmojiPicker}>
            <PopoverTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                title="Emoji toevoegen"
                className="min-h-[44px] min-w-[44px] p-0 flex-shrink-0"
              >
                <Smile className="h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 border-0" align="start">
              <EmojiPicker
                onEmojiClick={handleEmojiClick}
                width={isMobile ? 280 : 350}
                height={400}
                searchPlaceHolder="Zoek emoji..."
                previewConfig={{ showPreview: false }}
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      {/* Image Upload */}
      {showImageUpload && (
        <div className="border-t pt-3">
          <ImageUpload
            onImageUploaded={handleImageUploaded}
            onImageRemoved={() => setShowImageUpload(false)}
            showPreview={false}
          />
          <div className="flex justify-end gap-2 mt-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setShowImageUpload(false)}
              className="min-h-[44px]"
            >
              Annuleren
            </Button>
          </div>
        </div>
      )}

      {/* Editor + Live Preview overlay */}
      <div className="relative">
        {/* Textarea for input */}
        <Textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          className={cn(
            "resize-none font-mono text-sm",
            value && !isFocused && "opacity-0"
          )}
          style={{ minHeight, maxHeight }}
        />
        
        {/* Live Preview overlay - shown when there's content and not focused */}
        {value && !isFocused && (
          <div 
            className="absolute inset-0 p-3 rounded-md border bg-background pointer-events-none overflow-auto"
            style={{ minHeight, maxHeight }}
          >
            <div 
              className="prose prose-sm max-w-none text-sm"
              dangerouslySetInnerHTML={{ __html: renderPreview(value) }}
            />
          </div>
        )}
      </div>

      {/* Help text */}
      <div className="text-xs text-muted-foreground">
        <p>
          **vet** *cursief* [link](url) &gt; citaat • Klik buiten het tekstveld om de preview te zien
        </p>
      </div>
    </div>
  );
}
