import React, { useState, useCallback, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ImageUpload } from '@/components/ui/image-upload';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
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
  Edit3,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Type,
  Palette,
  Code,
  Table,
  Strikethrough,
  Building2
} from 'lucide-react';
import { cn } from '@/lib/utils';
import DOMPurify from 'dompurify';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';

interface AdvancedWYSIWYGEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  minHeight?: number;
  maxHeight?: number;
  className?: string;
  showAdminFeatures?: boolean;
}

interface SupplierProfile {
  id: string;
  business_name: string;
  description?: string;
  contact_info: any;
  stats: any;
  features: string[];
  profiles: {
    username: string;
    display_name?: string;
  };
}

export function AdvancedWYSIWYGEditor({
  value,
  onChange,
  placeholder = "Schrijf je bericht...",
  minHeight = 200,
  maxHeight = 500,
  className,
  showAdminFeatures = false
}: AdvancedWYSIWYGEditorProps) {
  const [isPreview, setIsPreview] = useState(false);
  const [showImageUpload, setShowImageUpload] = useState(false);
  const [showSupplierSelector, setShowSupplierSelector] = useState(false);
  const [selectedFontSize, setSelectedFontSize] = useState('14');
  const [selectedTextColor, setSelectedTextColor] = useState('#000000');
  const [selectedBgColor, setSelectedBgColor] = useState('#ffffff');
  
  const { user } = useAuth();
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Fetch suppliers for admin embedding feature
  const { data: suppliers } = useQuery({
    queryKey: ['suppliers-for-editor'],
    queryFn: async () => {
      if (!showAdminFeatures) return [];
      
      const { data } = await supabase
        .from('supplier_profiles')
        .select(`
          id,
          business_name,
          description,
          contact_info,
          stats,
          features,
          profiles (
            username,
            display_name
          )
        `)
        .eq('is_active', true);
      
      return data || [];
    },
    enabled: showAdminFeatures
  });

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

  const insertStyledText = (tag: string, style?: string) => {
    const styleAttr = style ? ` style="${style}"` : '';
    insertText(`<${tag}${styleAttr}>`, `</${tag}>`);
  };

  const handleImageUploaded = useCallback((imageUrl: string) => {
    const imageMarkdown = `![Afbeelding](${imageUrl})`;
    insertText(imageMarkdown);
    setShowImageUpload(false);
  }, []);

  const handleSupplierEmbed = (supplierId: string) => {
    const supplier = suppliers?.find(s => s.id === supplierId);
    if (!supplier) return;

    const embedMarkdown = `
[SUPPLIER_EMBED:${supplierId}]
**${supplier.business_name}**
${supplier.description || ''}

**Contact:** ${JSON.stringify(supplier.contact_info)}
**Features:** ${supplier.features.join(', ')}
[/SUPPLIER_EMBED]
    `;
    
    insertText(embedMarkdown);
    setShowSupplierSelector(false);
  };

  const basicToolbarButtons = [
    { icon: Bold, action: () => insertText('**', '**'), title: 'Vet (Ctrl+B)' },
    { icon: Italic, action: () => insertText('*', '*'), title: 'Cursief (Ctrl+I)' },
    { icon: Underline, action: () => insertStyledText('u'), title: 'Onderstreept' },
    { icon: Strikethrough, action: () => insertStyledText('s'), title: 'Doorhalen' },
    { icon: Link, action: () => insertText('[', '](url)'), title: 'Link' },
  ];

  const listToolbarButtons = [
    { icon: List, action: () => insertText('- '), title: 'Lijst' },
    { icon: ListOrdered, action: () => insertText('1. '), title: 'Genummerde lijst' },
    { icon: Quote, action: () => insertText('> '), title: 'Citaat' },
    { icon: Code, action: () => insertText('```\n', '\n```'), title: 'Code blok' },
  ];

  const alignmentButtons = [
    { icon: AlignLeft, action: () => insertText('<div style="text-align: left;">', '</div>'), title: 'Links uitlijnen' },
    { icon: AlignCenter, action: () => insertText('<div style="text-align: center;">', '</div>'), title: 'Centreren' },
    { icon: AlignRight, action: () => insertText('<div style="text-align: right;">', '</div>'), title: 'Rechts uitlijnen' },
    { icon: AlignJustify, action: () => insertText('<div style="text-align: justify;">', '</div>'), title: 'Uitvullen' },
  ];

  const insertTable = () => {
    const tableMarkdown = `
| Kolom 1 | Kolom 2 | Kolom 3 |
|---------|---------|---------|
| Cel 1   | Cel 2   | Cel 3   |
| Cel 4   | Cel 5   | Cel 6   |
    `;
    insertText(tableMarkdown);
  };

  const applyFontSize = () => {
    const style = `font-size: ${selectedFontSize}px;`;
    insertStyledText('span', style);
  };

  const applyTextColor = () => {
    const style = `color: ${selectedTextColor};`;
    insertStyledText('span', style);
  };

  const applyBackgroundColor = () => {
    const style = `background-color: ${selectedBgColor};`;
    insertStyledText('span', style);
  };

  const renderPreview = (text: string) => {
    // Enhanced markdown to HTML conversion
    let html = text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/<u>(.*?)<\/u>/g, '<u>$1</u>')
      .replace(/<s>(.*?)<\/s>/g, '<s>$1</s>')
      .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" class="text-primary hover:underline">$1</a>')
      .replace(/^> (.*$)/gim, '<blockquote class="border-l-4 border-muted-foreground pl-4 italic">$1</blockquote>')
      .replace(/^- (.*$)/gim, '<li>$1</li>')
      .replace(/^1\. (.*$)/gim, '<li>$1</li>')
      .replace(/!\[(.*?)\]\((.*?)\)/g, '<img src="$2" alt="$1" class="max-w-full h-auto rounded-md" />')
      .replace(/```\n([\s\S]*?)\n```/g, '<pre class="bg-muted p-4 rounded-md"><code>$1</code></pre>')
      .replace(/\n/g, '<br>');

    // Handle supplier embeds
    html = html.replace(/\[SUPPLIER_EMBED:(.*?)\]([\s\S]*?)\[\/SUPPLIER_EMBED\]/g, (match, supplierId, content) => {
      const supplier = suppliers?.find(s => s.id === supplierId);
      if (!supplier) return content;
      
      return `
        <div class="border-2 border-primary rounded-lg p-4 my-4 bg-primary/5">
          <div class="flex items-center gap-2 mb-2">
            <div class="w-2 h-2 bg-primary rounded-full"></div>
            <span class="text-sm font-medium text-primary">Leverancier Spotlight</span>
          </div>
          ${content}
          <div class="mt-3 pt-3 border-t border-primary/20">
            <a href="/supplier/${supplier.id}" class="text-primary text-sm hover:underline">
              Bekijk volledige leverancier pagina →
            </a>
          </div>
        </div>
      `;
    });
    
    // Handle tables
    html = html.replace(/\|(.*?)\|/g, (match, content) => {
      const cells = content.split('|').map(cell => cell.trim());
      return '<tr>' + cells.map(cell => `<td class="border border-muted p-2">${cell}</td>`).join('') + '</tr>';
    });

    // Sanitize HTML to prevent XSS attacks but allow more tags for advanced formatting
    return DOMPurify.sanitize(html, {
      ALLOWED_TAGS: ['strong', 'em', 'u', 's', 'a', 'blockquote', 'li', 'img', 'br', 'div', 'span', 'pre', 'code', 'table', 'tr', 'td'],
      ALLOWED_ATTR: ['href', 'class', 'src', 'alt', 'style'],
      ALLOW_DATA_ATTR: false
    });
  };

  return (
    <div className={cn('space-y-3', className)}>
      {/* Enhanced Toolbar */}
      <div className="border rounded-lg p-3 space-y-3">
        {/* Basic Formatting */}
        <div className="flex items-center gap-1 flex-wrap">
          {basicToolbarButtons.map((button, index) => (
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
          
          <Separator orientation="vertical" className="h-6 mx-2" />
          
          {/* Font Size */}
          <div className="flex items-center gap-2">
            <Type className="h-4 w-4" />
            <Select value={selectedFontSize} onValueChange={setSelectedFontSize}>
              <SelectTrigger className="w-20 h-8">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="12">12px</SelectItem>
                <SelectItem value="14">14px</SelectItem>
                <SelectItem value="16">16px</SelectItem>
                <SelectItem value="18">18px</SelectItem>
                <SelectItem value="24">24px</SelectItem>
                <SelectItem value="32">32px</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="ghost" size="sm" onClick={applyFontSize} className="h-8 px-2">
              Toepassen
            </Button>
          </div>

          <Separator orientation="vertical" className="h-6 mx-2" />

          {/* Colors */}
          <div className="flex items-center gap-2">
            <Palette className="h-4 w-4" />
            <input
              type="color"
              value={selectedTextColor}
              onChange={(e) => setSelectedTextColor(e.target.value)}
              className="w-8 h-8 rounded border cursor-pointer"
              title="Tekst kleur"
            />
            <Button variant="ghost" size="sm" onClick={applyTextColor} className="h-8 px-2">
              Tekst
            </Button>
            <input
              type="color"
              value={selectedBgColor}
              onChange={(e) => setSelectedBgColor(e.target.value)}
              className="w-8 h-8 rounded border cursor-pointer"
              title="Achtergrond kleur"
            />
            <Button variant="ghost" size="sm" onClick={applyBackgroundColor} className="h-8 px-2">
              Achtergrond
            </Button>
          </div>
        </div>

        <Separator />

        {/* Lists and Structure */}
        <div className="flex items-center gap-1 flex-wrap">
          {listToolbarButtons.map((button, index) => (
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
          
          <Separator orientation="vertical" className="h-6 mx-2" />
          
          {/* Alignment */}
          {alignmentButtons.map((button, index) => (
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
          
          <Separator orientation="vertical" className="h-6 mx-2" />
          
          {/* Table */}
          <Button
            variant="ghost"
            size="sm"
            onClick={insertTable}
            title="Tabel invoegen"
            className="h-8 w-8 p-0"
          >
            <Table className="h-4 w-4" />
          </Button>
          
          {/* Image */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowImageUpload(true)}
            title="Afbeelding uploaden"
            className="h-8 w-8 p-0"
          >
            <Image className="h-4 w-4" />
          </Button>

          {/* Admin Features */}
          {showAdminFeatures && (
            <>
              <Separator orientation="vertical" className="h-6 mx-2" />
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowSupplierSelector(true)}
                title="Leverancier Embedden"
                className="h-8 px-3"
              >
                <Building2 className="h-4 w-4 mr-1" />
                Leverancier
              </Button>
            </>
          )}
        </div>

        <Separator />

        {/* Preview Toggle */}
        <div className="flex items-center justify-end gap-2">
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

      {/* Image Upload Section */}
      {showImageUpload && (
        <Card>
          <CardContent className="p-4">
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
              >
                Annuleren
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Supplier Selector */}
      {showSupplierSelector && showAdminFeatures && (
        <Card>
          <CardContent className="p-4">
            <h4 className="font-medium mb-3">Selecteer Leverancier om in te voegen</h4>
            <div className="grid gap-2 max-h-40 overflow-y-auto">
              {suppliers?.map((supplier) => (
                <Button
                  key={supplier.id}
                  variant="outline"
                  onClick={() => handleSupplierEmbed(supplier.id)}
                  className="justify-start"
                >
                  <Building2 className="h-4 w-4 mr-2" />
                  {supplier.business_name}
                </Button>
              ))}
            </div>
            <div className="flex justify-end mt-3">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setShowSupplierSelector(false)}
              >
                Annuleren
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

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
          <textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="w-full p-4 border rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-primary"
            style={{ minHeight, maxHeight }}
          />
        )}
      </div>

      {/* Help text */}
      <div className="text-xs text-muted-foreground">
        <p>
          Ondersteunt uitgebreide opmaak: **vet**, *cursief*, [link](url), kleuren, tabellen, code blokken en meer. 
          {showAdminFeatures && " Als admin kun je ook leverancier profielen embedden."}
        </p>
      </div>
    </div>
  );
}