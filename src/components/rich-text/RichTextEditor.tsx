import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Bold, 
  Italic, 
  Underline, 
  Link, 
  List, 
  ListOrdered, 
  Quote, 
  Image,
  Eye,
  Edit3
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
}

export function RichTextEditor({
  value,
  onChange,
  placeholder = "Schrijf je bericht...",
  minHeight = 200,
  maxHeight = 500,
  className
}: RichTextEditorProps) {
  const [isPreview, setIsPreview] = useState(false);
  const [selectionStart, setSelectionStart] = useState(0);
  const [selectionEnd, setSelectionEnd] = useState(0);

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

  const toolbarButtons = [
    { icon: Bold, action: () => insertText('**', '**'), title: 'Vet (Ctrl+B)' },
    { icon: Italic, action: () => insertText('*', '*'), title: 'Cursief (Ctrl+I)' },
    { icon: Underline, action: () => insertText('<u>', '</u>'), title: 'Onderstreept' },
    { icon: Link, action: () => insertText('[', '](url)'), title: 'Link' },
    { icon: List, action: () => insertText('- '), title: 'Lijst' },
    { icon: ListOrdered, action: () => insertText('1. '), title: 'Genummerde lijst' },
    { icon: Quote, action: () => insertText('> '), title: 'Citaat' },
    { icon: Image, action: () => insertText('![alt tekst](', ')'), title: 'Afbeelding' },
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
      {/* Toolbar */}
      <div className="flex items-center justify-between border-b pb-3">
        <div className="flex items-center gap-1">
          {toolbarButtons.map((button, index) => (
            <Button
              key={index}
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
        
        <div className="flex items-center gap-2">
          <Button
            variant={isPreview ? "ghost" : "default"}
            size="sm"
            onClick={() => setIsPreview(false)}
            className="flex items-center gap-2"
          >
            <Edit3 className="h-4 w-4" />
            Bewerken
          </Button>
          <Button
            variant={isPreview ? "default" : "ghost"}
            size="sm"
            onClick={() => setIsPreview(true)}
            className="flex items-center gap-2"
          >
            <Eye className="h-4 w-4" />
            Preview
          </Button>
        </div>
      </div>

      {/* Editor/Preview Area */}
      <div style={{ minHeight, maxHeight }}>
        {isPreview ? (
          <Card>
            <CardContent className="p-4">
              <div 
                className="prose prose-sm max-w-none"
                dangerouslySetInnerHTML={{ __html: renderPreview(value) }}
              />
              {!value && (
                <p className="text-muted-foreground italic">Geen inhoud om te previewen...</p>
              )}
            </CardContent>
          </Card>
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
      </div>

      {/* Help text */}
      <div className="text-xs text-muted-foreground">
        <p>
          Ondersteunt Markdown: **vet**, *cursief*, [link](url), &gt; citaat, - lijst, ![afbeelding](url)
        </p>
      </div>
    </div>
  );
}