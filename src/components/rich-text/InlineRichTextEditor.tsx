import React, { useState, useRef } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { 
  Bold, 
  Italic, 
  Underline,
  Strikethrough,
  Link as LinkIcon, 
  List, 
  ListOrdered,
  ListChecks,
  Quote,
  Code,
  Code2,
  Image as ImageIcon,
  Heading1,
  Heading2,
  Heading3,
  Table,
  Minus,
  Hash,
  Braces,
  Smile,
  Paperclip,
  HelpCircle,
  MoreHorizontal,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import DOMPurify from 'dompurify';
import EmojiPicker, { EmojiClickData } from 'emoji-picker-react';

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
  const [isToolbarCollapsed, setIsToolbarCollapsed] = useState(true);
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

  // Keyboard shortcuts handler
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.ctrlKey || e.metaKey) {
      switch (e.key.toLowerCase()) {
        case 'b':
          e.preventDefault();
          insertText('**', '**');
          break;
        case 'i':
          e.preventDefault();
          insertText('*', '*');
          break;
        case 'u':
          e.preventDefault();
          insertText('<u>', '</u>');
          break;
        case 'k':
          e.preventDefault();
          insertText('[', '](url)');
          break;
        case 'e':
          e.preventDefault();
          insertText('`', '`');
          break;
        case 'x':
          if (e.shiftKey) {
            e.preventDefault();
            insertText('~~', '~~');
          }
          break;
      }
    }
    
    if (e.key === 'Tab') {
      e.preventDefault();
      insertText('  ');
    }
  };

  // Table insertion helper
  const insertTable = () => {
    const table = `
| Kolom 1 | Kolom 2 | Kolom 3 |
|---------|---------|---------|
| Rij 1   | Data    | Data    |
| Rij 2   | Data    | Data    |
`;
    insertText(table);
  };

  // Handle emoji selection
  const handleEmojiClick = (emojiData: EmojiClickData) => {
    insertText(emojiData.emoji);
    setShowEmojiPicker(false);
  };

  // Toolbar buttons
  const toolbarButtons = {
    text: [
      { icon: Bold, action: () => insertText('**', '**'), title: 'Vet (Ctrl+B)' },
      { icon: Italic, action: () => insertText('*', '*'), title: 'Cursief (Ctrl+I)' },
      { icon: Underline, action: () => insertText('<u>', '</u>'), title: 'Onderstreept (Ctrl+U)' },
      { icon: Strikethrough, action: () => insertText('~~', '~~'), title: 'Doorhalen (Ctrl+Shift+X)' },
    ],
    heading: [
      { icon: Heading1, action: () => insertText('# ', ''), title: 'Heading 1' },
      { icon: Heading2, action: () => insertText('## ', ''), title: 'Heading 2' },
      { icon: Heading3, action: () => insertText('### ', ''), title: 'Heading 3' },
    ],
    list: [
      { icon: List, action: () => insertText('- ', ''), title: 'Lijst' },
      { icon: ListOrdered, action: () => insertText('1. ', ''), title: 'Genummerde lijst' },
      { icon: ListChecks, action: () => insertText('- [ ] ', ''), title: 'Checklist' },
      { icon: Quote, action: () => insertText('> ', ''), title: 'Citaat' },
    ],
    code: [
      { icon: Code, action: () => insertText('`', '`'), title: 'Inline code (Ctrl+E)' },
      { icon: Code2, action: () => insertText('```\n', '\n```'), title: 'Code block' },
    ],
    media: [
      { icon: LinkIcon, action: () => insertText('[', '](url)'), title: 'Link (Ctrl+K)' },
      { icon: Table, action: insertTable, title: 'Tabel' },
      { icon: Minus, action: () => insertText('\n---\n'), title: 'Horizontale lijn' },
    ],
    special: [
      { icon: Hash, action: () => insertText('[', ']'), title: 'Primary badge [tag]' },
      { icon: Braces, action: () => insertText('{', '}'), title: 'Success badge {tag}' },
      { icon: Smile, action: () => setShowEmojiPicker(!showEmojiPicker), title: 'Emoji' },
    ],
  };

  const essentialButtons = [...toolbarButtons.text.slice(0, 2), ...toolbarButtons.list.slice(0, 1)];
  const advancedButtons = [
    ...toolbarButtons.text.slice(2),
    ...toolbarButtons.heading,
    ...toolbarButtons.list.slice(1),
    ...toolbarButtons.code,
    ...toolbarButtons.media,
    ...toolbarButtons.special,
  ];

  // Render preview with enhanced formatting
  const renderPreview = (text: string) => {
    let html = text;
    
    // Step 1: Escape HTML
    html = html.replace(/&/g, '&amp;')
               .replace(/</g, '&lt;')
               .replace(/>/g, '&gt;');
    
    // Step 2: Parse custom tags FIRST
    // [tag] -> primary badge
    html = html.replace(/\[([^\]]+)\]/g, (match, tagText) => {
      return `<span class="inline-flex items-center rounded-md bg-primary/10 px-2 py-1 text-xs font-medium text-primary ring-1 ring-inset ring-primary/20 mx-1">${tagText}</span>`;
    });
    
    // {tag} -> success badge
    html = html.replace(/\{([^\}]+)\}/g, (match, tagText) => {
      return `<span class="inline-flex items-center rounded-md bg-green-500/10 px-2 py-1 text-xs font-medium text-green-600 dark:text-green-400 ring-1 ring-inset ring-green-500/20 mx-1">${tagText}</span>`;
    });
    
    // Step 3: Markdown parsing
    // Code blocks (before inline code)
    html = html.replace(/```([^`]+)```/g, '<pre class="bg-muted p-3 rounded-lg overflow-x-auto my-2"><code>$1</code></pre>');
    
    // Inline code
    html = html.replace(/`([^`]+)`/g, '<code class="bg-muted px-1 py-0.5 rounded text-sm">$1</code>');
    
    // Headers
    html = html.replace(/^### (.*$)/gim, '<h3 class="text-lg font-bold mt-4 mb-2">$1</h3>');
    html = html.replace(/^## (.*$)/gim, '<h2 class="text-xl font-bold mt-4 mb-2">$1</h2>');
    html = html.replace(/^# (.*$)/gim, '<h1 class="text-2xl font-bold mt-4 mb-2">$1</h1>');
    
    // Bold & Italic (order matters!)
    html = html.replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>');
    html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
    html = html.replace(/\*(.+?)\*/g, '<em>$1</em>');
    
    // Strikethrough
    html = html.replace(/~~(.+?)~~/g, '<s>$1</s>');
    
    // Underline
    html = html.replace(/&lt;u&gt;(.+?)&lt;\/u&gt;/g, '<u>$1</u>');
    
    // Horizontal rule
    html = html.replace(/^---$/gim, '<hr class="my-4 border-t border-border" />');
    
    // Blockquotes
    html = html.replace(/^&gt; (.+)$/gim, '<blockquote class="border-l-4 border-primary pl-4 italic my-2">$1</blockquote>');
    
    // Checklists (before regular lists)
    html = html.replace(/^- \[ \] (.+)$/gim, '<li class="ml-4">☐ $1</li>');
    html = html.replace(/^- \[x\] (.+)$/gim, '<li class="ml-4">☑ $1</li>');
    
    // Lists (unordered)
    html = html.replace(/^- (.+)$/gim, '<li class="ml-4">$1</li>');
    
    // Lists (ordered)
    html = html.replace(/^\d+\. (.+)$/gim, '<li class="ml-4">$1</li>');
    
    // Wrap lists
    html = html.replace(/(<li>.*<\/li>)/s, '<ul class="list-disc pl-6 my-2">$1</ul>');
    
    // Tables
    html = html.replace(/\|(.+)\|/g, (match) => {
      const cells = match.split('|').filter(c => c.trim());
      return '<tr>' + cells.map(c => `<td class="border border-border px-2 py-1">${c.trim()}</td>`).join('') + '</tr>';
    });
    html = html.replace(/(<tr>.*<\/tr>)/s, '<table class="border-collapse border border-border my-2 w-full">$1</table>');
    
    // Images
    html = html.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" class="max-w-full h-auto rounded-lg my-2" />');
    
    // Links (after images)
    html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-primary hover:underline" target="_blank" rel="noopener noreferrer">$1</a>');
    
    // Line breaks
    html = html.replace(/\n/g, '<br>');
    
    return html;
  };

  const sanitizedPreview = DOMPurify.sanitize(renderPreview(value), {
    ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'u', 's', 'a', 'ul', 'ol', 'li', 'blockquote', 
                   'code', 'pre', 'h1', 'h2', 'h3', 'img', 'hr', 'table', 'tr', 'td', 'span'],
    ALLOWED_ATTR: ['href', 'src', 'alt', 'class', 'target', 'rel']
  });

  return (
    <div className={cn("space-y-2 border rounded-md relative", className)}>
      {/* Toggle button when collapsed and not focused */}
      {isToolbarCollapsed && !isFocused && (
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => setIsToolbarCollapsed(false)}
          className="absolute top-2 right-2 z-10 h-8 text-xs"
        >
          <MoreHorizontal className="h-4 w-4 mr-1" />
          Opmaak
        </Button>
      )}
      
      {/* Top Toolbar - Formatting */}
      {(isFocused || !isToolbarCollapsed) && (
        <div className="flex items-center gap-1 p-2 bg-muted/50 rounded-t-md border-b flex-wrap">
        {isMobile ? (
          <>
            {/* Essential buttons for mobile */}
            {essentialButtons.map((button, index) => (
              <Button
                key={index}
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
            
            {/* More options dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button type="button" variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="max-h-[400px] overflow-y-auto">
                {advancedButtons.map((button, index) => (
                  <DropdownMenuItem key={index} onClick={button.action}>
                    <button.icon className="h-4 w-4 mr-2" />
                    {button.title}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </>
        ) : (
          <>
            {/* Text Styling */}
            {toolbarButtons.text.map((button, index) => (
              <Button
                key={index}
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
            <Separator orientation="vertical" className="h-6" />
            
            {/* Headings */}
            {toolbarButtons.heading.map((button, index) => (
              <Button
                key={index}
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
            <Separator orientation="vertical" className="h-6" />
            
            {/* Lists */}
            {toolbarButtons.list.map((button, index) => (
              <Button
                key={index}
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
            <Separator orientation="vertical" className="h-6" />
            
            {/* Code */}
            {toolbarButtons.code.map((button, index) => (
              <Button
                key={index}
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
            <Separator orientation="vertical" className="h-6" />
            
            {/* Media */}
            {toolbarButtons.media.map((button, index) => (
              <Button
                key={index}
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
            <Separator orientation="vertical" className="h-6" />
            
            {/* Special */}
            {toolbarButtons.special.map((button, index) => (
              <Button
                key={index}
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
          </>
        )}
        </div>
      )}

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
          onFocus={() => {
            setIsFocused(true);
            setIsToolbarCollapsed(false);
          }}
          onBlur={() => setIsFocused(false)}
          onKeyDown={handleKeyDown}
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

      {/* Bottom Toolbar - Help */}
      <div className="flex items-center justify-between p-2 bg-muted/50 rounded-b-md border-t">
        <Collapsible>
          <CollapsibleTrigger asChild>
            <Button type="button" variant="ghost" size="sm" className="text-xs h-auto py-1">
              <HelpCircle className="h-3 w-3 mr-1" />
              Help
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-2 absolute z-50 left-2 right-2">
            <Card>
              <CardContent className="p-3 text-xs space-y-2">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <p className="font-semibold mb-1">Text</p>
                    <div className="space-y-0.5 text-muted-foreground">
                      <div><code className="bg-muted px-1 rounded">**bold**</code></div>
                      <div><code className="bg-muted px-1 rounded">*italic*</code></div>
                    </div>
                  </div>
                  <div>
                    <p className="font-semibold mb-1">Special</p>
                    <div className="space-y-0.5 text-muted-foreground">
                      <div><code className="bg-muted px-1 rounded">[tag]</code> Primary</div>
                      <div><code className="bg-muted px-1 rounded">{'{tag}'}</code> Success</div>
                    </div>
                  </div>
                </div>
                <Separator />
                <div className="text-muted-foreground">
                  <span><code className="bg-muted px-1 rounded">Ctrl+B</code> Bold</span>
                  {' • '}
                  <span><code className="bg-muted px-1 rounded">Ctrl+I</code> Italic</span>
                </div>
              </CardContent>
            </Card>
          </CollapsibleContent>
        </Collapsible>
      </div>
    </div>
  );
}