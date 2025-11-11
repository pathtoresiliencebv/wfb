import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface ProgressiveImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  placeholder?: string;
  alt: string;
  containerClassName?: string;
}

export function ProgressiveImage({ 
  src, 
  placeholder, 
  alt,
  className,
  containerClassName,
  ...props 
}: ProgressiveImageProps) {
  const [currentSrc, setCurrentSrc] = useState(placeholder || src);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    // Preload the full image
    const img = new Image();
    img.src = src;
    
    img.onload = () => {
      setCurrentSrc(src);
      setLoading(false);
    };
    
    img.onerror = () => {
      setError(true);
      setLoading(false);
    };
  }, [src]);

  if (error) {
    return (
      <div className={cn("bg-muted flex items-center justify-center", containerClassName)}>
        <span className="text-muted-foreground text-sm">Afbeelding niet beschikbaar</span>
      </div>
    );
  }

  return (
    <div className={cn("relative overflow-hidden", containerClassName)}>
      <img 
        src={currentSrc}
        alt={alt}
        className={cn(
          "transition-all duration-500",
          loading && placeholder && "blur-sm scale-105",
          className
        )}
        {...props}
      />
      {loading && (
        <div className="absolute inset-0 bg-muted/20 animate-pulse" />
      )}
    </div>
  );
}
