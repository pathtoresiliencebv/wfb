import React from 'react';
import { Button } from '@/components/ui/button';
import { ExternalLink, Copy } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface LinkPreviewProps {
  url: string;
  text: string;
  className?: string;
  variant?: "default" | "outline" | "secondary" | "ghost" | "link" | "destructive";
  size?: "default" | "sm" | "lg" | "icon";
}

export function LinkPreview({ url, text, className, variant = "outline", size = "sm" }: LinkPreviewProps) {
  const { toast } = useToast();

  const handleClick = () => {
    if (url) {
      window.open(url.startsWith('http') ? url : `https://wfb.pathtoresilience.dev/${url}`, '_blank', 'noopener,noreferrer');
    }
  };

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(url);
    toast({ title: 'Link gekopieerd!' });
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <Button 
        variant={variant} 
        size={size}
        onClick={handleClick}
        className="flex-1"
      >
        <ExternalLink className="h-4 w-4 mr-2" />
        {text}
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={handleCopy}
        className="h-8 w-8"
      >
        <Copy className="h-3 w-3" />
      </Button>
    </div>
  );
}