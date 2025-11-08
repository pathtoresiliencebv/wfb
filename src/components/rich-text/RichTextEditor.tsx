import React, { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ImageUpload } from '@/components/ui/image-upload';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useIsMobile } from '@/hooks/use-mobile';
import { 
  Bold, 
  Italic, 
  Underline,
  Strikethrough,
  Link, 
  List, 
  ListOrdered,
  ListChecks,
  Quote,
  Code,
  Code2,
  Image,
  Heading1,
  Heading2,
  Heading3,
  Table,
  Minus,
  Hash,
  Braces,
  Eye,
  HelpCircle,
  MoreHorizontal,
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
  const [showPreview, setShowPreview] = useState(showLivePreview);
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

  const handleImageUploaded = useCallback((imageUrl: string) => {
    const imageMarkdown = `![Afbeelding](${imageUrl})`;
    insertText(imageMarkdown);
    setShowImageUpload(false);
  }, []);

  const toolbarButtons = {
    text: [
      { icon: Bold, action: () => insertText('**', '**'), title: 'Vet (Ctrl+B)', group: 'text' },
      { icon: Italic, action: () => insertText('*', '*'), title: 'Cursief (Ctrl+I)', group: 'text' },
      { icon: Underline, action: () => insertText('<u>', '</u>'), title: 'Onderstreept (Ctrl+U)', group: 'text' },
      { icon: Strikethrough, action: () => insertText('~~', '~~'), title: 'Doorhalen (Ctrl+Shift+X)', group: 'text' },
    ],
    heading: [
      { icon: Heading1, action: () => insertText('# ', ''), title: 'Heading 1', group: 'heading' },
      { icon: Heading2, action: () => insertText('## ', ''), title: 'Heading 2', group: 'heading' },
      { icon: Heading3, action: () => insertText('### ', ''), title: 'Heading 3', group: 'heading' },
    ],
    list: [
      { icon: List, action: () => insertText('- ', ''), title: 'Lijst', group: 'list' },
      { icon: ListOrdered, action: () => insertText('1. ', ''), title: 'Genummerde lijst', group: 'list' },
      { icon: ListChecks, action: () => insertText('- [ ] ', ''), title: 'Checklist', group: 'list' },
      { icon: Quote, action: () => insertText('> ', ''), title: 'Citaat', group: 'list' },
    ],
    code: [
      { icon: Code, action: () => insertText('`', '`'), title: 'Inline code (Ctrl+E)', group: 'code' },
      { icon: Code2, action: () => insertText('```\n', '\n```'), title: 'Code block', group: 'code' },
    ],
    media: [
      { icon: Link, action: () => insertText('[', '](url)'), title: 'Link (Ctrl+K)', group: 'media' },
      { icon: Image, action: () => setShowImageUpload(true), title: 'Afbeelding', group: 'media' },
      { icon: Table, action: insertTable, title: 'Tabel', group: 'media' },
      { icon: Minus, action: () => insertText('\n---\n'), title: 'Horizontale lijn', group: 'media' },
    ],
    special: [
      { icon: Hash, action: () => insertText('[', ']'), title: 'Primary badge [tag]', group: 'special' },
      { icon: Braces, action: () => insertText('{', '}'), title: 'Success badge {tag}', group: 'special' },
    ],
  };

  const essentialButtons = [...toolbarButtons.text.slice(0, 2), ...toolbarButtons.list.slice(0, 1), toolbarButtons.media[0]];
  const advancedButtons = [
    ...toolbarButtons.text.slice(2),
    ...toolbarButtons.heading,
    ...toolbarButtons.list.slice(1),
    ...toolbarButtons.code,
    ...toolbarButtons.media.slice(1),
    ...toolbarButtons.special,
  ];

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
    
    // Images (must be before links due to similar syntax)
    html = html.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" class="max-w-full h-auto rounded-lg my-2" />');
    
    // Links (after images)
    html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-primary hover:underline" target="_blank" rel="noopener noreferrer">$1</a>');
    
    // Line breaks
    html = html.replace(/\n/g, '<br>');
    
    // Step 4: Sanitize
    return DOMPurify.sanitize(html, {
      ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'u', 's', 'a', 'ul', 'ol', 'li', 'blockquote', 
                     'code', 'pre', 'h1', 'h2', 'h3', 'img', 'hr', 'table', 'tr', 'td', 'span'],
      ALLOWED_ATTR: ['href', 'src', 'alt', 'class', 'target', 'rel']
    });
  };

  return (
    <div className={cn('space-y-3', className)}>
      {/* Toolbar */}
      <div className="flex items-center gap-2 border-b pb-2 overflow-x-auto">
        {isMobile ? (
          <>
            {/* Essential buttons for mobile */}
            <div className="flex gap-1">
              {essentialButtons.map((button, index) => (
                <Button
                  key={index}
                  variant="ghost"
                  size="sm"
                  onClick={button.action}
                  title={button.title}
                  className="min-h-[44px] min-w-[44px] p-0"
                >
                  <button.icon className="h-4 w-4" />
                </Button>
              ))}
            </div>
            
            {/* More options dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="min-h-[44px] min-w-[44px] p-0">
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
            <div className="flex gap-1">
              {toolbarButtons.text.map((button, index) => (
                <Button
                  key={index}
                  variant="ghost"
                  size="sm"
                  onClick={button.action}
                  title={button.title}
                  className="h-9 w-9 p-0"
                >
                  <button.icon className="h-4 w-4" />
                </Button>
              ))}
            </div>
            <Separator orientation="vertical" className="h-6" />
            
            {/* Headings */}
            <div className="flex gap-1">
              {toolbarButtons.heading.map((button, index) => (
                <Button
                  key={index}
                  variant="ghost"
                  size="sm"
                  onClick={button.action}
                  title={button.title}
                  className="h-9 w-9 p-0"
                >
                  <button.icon className="h-4 w-4" />
                </Button>
              ))}
            </div>
            <Separator orientation="vertical" className="h-6" />
            
            {/* Lists */}
            <div className="flex gap-1">
              {toolbarButtons.list.map((button, index) => (
                <Button
                  key={index}
                  variant="ghost"
                  size="sm"
                  onClick={button.action}
                  title={button.title}
                  className="h-9 w-9 p-0"
                >
                  <button.icon className="h-4 w-4" />
                </Button>
              ))}
            </div>
            <Separator orientation="vertical" className="h-6" />
            
            {/* Code */}
            <div className="flex gap-1">
              {toolbarButtons.code.map((button, index) => (
                <Button
                  key={index}
                  variant="ghost"
                  size="sm"
                  onClick={button.action}
                  title={button.title}
                  className="h-9 w-9 p-0"
                >
                  <button.icon className="h-4 w-4" />
                </Button>
              ))}
            </div>
            <Separator orientation="vertical" className="h-6" />
            
            {/* Media */}
            <div className="flex gap-1">
              {toolbarButtons.media.map((button, index) => (
                <Button
                  key={index}
                  variant="ghost"
                  size="sm"
                  onClick={button.action}
                  title={button.title}
                  className="h-9 w-9 p-0"
                >
                  <button.icon className="h-4 w-4" />
                </Button>
              ))}
            </div>
            <Separator orientation="vertical" className="h-6" />
            
            {/* Special */}
            <div className="flex gap-1">
              {toolbarButtons.special.map((button, index) => (
                <Button
                  key={index}
                  variant="ghost"
                  size="sm"
                  onClick={button.action}
                  title={button.title}
                  className="h-9 w-9 p-0"
                >
                  <button.icon className="h-4 w-4" />
                </Button>
              ))}
            </div>
          </>
        )}
        
        {/* Preview Toggle */}
        <Separator orientation="vertical" className="h-6" />
        <Button
          variant={showPreview ? "default" : "ghost"}
          size="sm"
          onClick={() => setShowPreview(!showPreview)}
          title="Toggle preview"
          className={isMobile ? "min-h-[44px] min-w-[44px] p-0" : "h-9 w-9 p-0"}
        >
          <Eye className="h-4 w-4" />
        </Button>
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
      {showPreview ? (
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
              onKeyDown={handleKeyDown}
              placeholder={placeholder}
              className="resize-none font-mono text-sm"
              style={{ minHeight: isMobile ? 150 : minHeight, maxHeight }}
            />
          </div>

          {/* Live Preview */}
          <div>
            <label className="text-xs font-medium mb-1 block">Preview</label>
            <Card style={{ minHeight: isMobile ? 150 : minHeight, maxHeight }}>
              <CardContent className="p-3 overflow-auto h-full">
                {value ? (
                  <div 
                    className="prose prose-sm dark:prose-invert max-w-none text-sm"
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
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="resize-none"
          style={{ minHeight, maxHeight }}
        />
      )}

      {/* Markdown Help Cheatsheet */}
      <Collapsible>
        <CollapsibleTrigger asChild>
          <Button variant="ghost" size="sm" className="text-xs h-auto py-1">
            <HelpCircle className="h-3 w-3 mr-1" />
            Markdown Help & Shortcuts
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent className="mt-2">
          <Card>
            <CardContent className="p-3 text-xs space-y-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <p className="font-semibold mb-1">Text Styling</p>
                  <div className="space-y-0.5 text-muted-foreground">
                    <div><code className="bg-muted px-1 rounded">**bold**</code> → <strong>bold</strong></div>
                    <div><code className="bg-muted px-1 rounded">*italic*</code> → <em>italic</em></div>
                    <div><code className="bg-muted px-1 rounded">~~strike~~</code> → <s>strike</s></div>
                    <div><code className="bg-muted px-1 rounded">`code`</code> → <code className="bg-muted px-1 rounded">code</code></div>
                  </div>
                </div>
                <div>
                  <p className="font-semibold mb-1">Headings</p>
                  <div className="space-y-0.5 text-muted-foreground">
                    <div><code className="bg-muted px-1 rounded"># H1</code> → Heading 1</div>
                    <div><code className="bg-muted px-1 rounded">## H2</code> → Heading 2</div>
                    <div><code className="bg-muted px-1 rounded">### H3</code> → Heading 3</div>
                  </div>
                </div>
                <div>
                  <p className="font-semibold mb-1">Lists</p>
                  <div className="space-y-0.5 text-muted-foreground">
                    <div><code className="bg-muted px-1 rounded">- item</code> → bullet list</div>
                    <div><code className="bg-muted px-1 rounded">1. item</code> → numbered list</div>
                    <div><code className="bg-muted px-1 rounded">- [ ] task</code> → checklist</div>
                  </div>
                </div>
                <div>
                  <p className="font-semibold mb-1">Special Tags</p>
                  <div className="space-y-0.5 text-muted-foreground">
                    <div><code className="bg-muted px-1 rounded">[tag]</code> → Primary badge</div>
                    <div><code className="bg-muted px-1 rounded">{'{tag}'}</code> → Success badge</div>
                    <div><code className="bg-muted px-1 rounded">[text](url)</code> → Link</div>
                  </div>
                </div>
              </div>
              <Separator />
              <div>
                <p className="font-semibold mb-1">Keyboard Shortcuts</p>
                <div className="flex flex-wrap gap-2 text-muted-foreground">
                  <span><code className="bg-muted px-1 rounded">Ctrl+B</code> Bold</span>
                  <span><code className="bg-muted px-1 rounded">Ctrl+I</code> Italic</span>
                  <span><code className="bg-muted px-1 rounded">Ctrl+U</code> Underline</span>
                  <span><code className="bg-muted px-1 rounded">Ctrl+K</code> Link</span>
                  <span><code className="bg-muted px-1 rounded">Ctrl+E</code> Code</span>
                  <span><code className="bg-muted px-1 rounded">Tab</code> Indent</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
}