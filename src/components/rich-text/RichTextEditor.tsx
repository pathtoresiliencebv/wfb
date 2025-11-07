import React, { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ImageUpload } from '@/components/ui/image-upload';
import { useIsMobile } from '@/hooks/use-mobile';
import { 
  Bold, 
  Italic, 
  Underline, 
  Link, 
  List, 
  ListOrdered, 
  Quote, 
  Image,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import DOMPurify from 'dompurify';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  minHeight?: number;
  maxHeight?: number;
  className?: string;
  showLivePreview?: boolean;
}

export function RichTextEditor({
  value,
  onChange,
  placeholder = "Schrijf je bericht...",
  minHeight = 200,
  maxHeight = 500,
  className,
  showLivePreview = false,
}: RichTextEditorProps) {
  const [selectionStart, setSelectionStart] = useState(0);
  const [selectionEnd, setSelectionEnd] = useState(0);
  const [showImageUpload, setShowImageUpload] = useState(false);
  const isMobile = useIsMobile();

  const textareaRef = React.useRef<HTMLTextAreaElement>(null);

  const handleSelectionChange = () => {
    if (textareaRef.current) {
      setSelectionStart(textareaRef.current.selectionStart);
      setSelectionEnd(textareaRef.current.selectionEnd);
    }
  };

  const insertText = (before: string, after: string = '') => {
    if (!textareaRef.current) return;

    const textarea = textareaRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.substring(start, end);
    
    const newText = value.substring(0, start) + before + selectedText + after + value.substring(end);
    onChange(newText);

    // Restore cursor position
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + before.length, end + before.length);
    }, 0);
  };

  const handleImageUploaded = useCallback((imageUrl: string) => {
    const imageMarkdown = `![Afbeelding](${imageUrl})`;
    insertText(imageMarkdown);
    setShowImageUpload(false);
  }, []);

  const toolbarButtons = [
    { icon: Bold, action: () => insertText('**', '**'), title: 'Vet (Ctrl+B)' },
    { icon: Italic, action: () => insertText('*', '*'), title: 'Cursief (Ctrl+I)' },
    { icon: Underline, action: () => insertText('<u>', '</u>'), title: 'Onderstreept' },
    { icon: Link, action: () => insertText('[', '](url)'), title: 'Link' },
    { icon: List, action: () => insertText('- '), title: 'Lijst' },
    { icon: ListOrdered, action: () => insertText('1. '), title: 'Genummerde lijst' },
    { icon: Quote, action: () => insertText('> '), title: 'Citaat' },
    { icon: Image, action: () => setShowImageUpload(true), title: 'Afbeelding uploaden' },
  ];

  const renderPreview = (text: string) => {
    // Basic markdown to HTML conversion for preview
    const html = text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/<u>(.*?)<\/u>/g, '<u>$1</u>')
      .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" class="text-primary hover:underline">$1</a>')
      .replace(/^> (.*$)/gim, '<blockquote class="border-l-4 border-muted-foreground pl-4 italic">$1</blockquote>')
      .replace(/^- (.*$)/gim, '<li>$1</li>')
      .replace(/^1\. (.*$)/gim, '<li>$1</li>')
      .replace(/!\[(.*?)\]\((.*?)\)/g, '<img src="$2" alt="$1" class="max-w-full h-auto rounded-md" />')
      .replace(/\n/g, '<br>');
    
    // Sanitize HTML to prevent XSS attacks
    return DOMPurify.sanitize(html, {
      ALLOWED_TAGS: ['strong', 'em', 'u', 'a', 'blockquote', 'li', 'img', 'br'],
      ALLOWED_ATTR: ['href', 'class', 'src', 'alt'],
      ALLOW_DATA_ATTR: false
    });
  };

  return (
    <div className={cn('space-y-3', className)}>
      {/* Toolbar - Compacter op mobiel */}
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

      {/* Editor + Live Preview */}
      {showLivePreview ? (
        <div className={cn(
          "grid gap-3",
          isMobile ? "grid-cols-1" : "grid-cols-2"
        )}>
          {/* Editor */}
          <div>
            <label className="text-xs font-medium mb-1 block">Bewerken</label>
            <Textarea
              ref={textareaRef}
              value={value}
              onChange={(e) => onChange(e.target.value)}
              onSelect={handleSelectionChange}
              placeholder={placeholder}
              className="resize-none font-mono text-sm"
              style={{ minHeight: isMobile ? 150 : minHeight, maxHeight }}
            />
          </div>

          {/* Live Preview */}
          <div>
            <label className="text-xs font-medium mb-1 block">Live Preview</label>
            <Card style={{ minHeight: isMobile ? 150 : minHeight, maxHeight }}>
              <CardContent className="p-3 overflow-auto h-full">
                {value ? (
                  <div 
                    className="prose prose-sm max-w-none text-sm"
                    dangerouslySetInnerHTML={{ __html: renderPreview(value) }}
                  />
                ) : (
                  <p className="text-muted-foreground italic text-sm">
                    {placeholder}
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      ) : (
        <Textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onSelect={handleSelectionChange}
          placeholder={placeholder}
          className="resize-none"
          style={{ minHeight, maxHeight }}
        />
      )}

      {/* Help text - Compacter */}
      <div className="text-xs text-muted-foreground">
        <p>
          **vet** *cursief* [link](url) &gt; citaat
        </p>
      </div>
    </div>
  );
}