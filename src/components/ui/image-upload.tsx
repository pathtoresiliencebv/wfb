import React, { useRef, useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Card } from '@/components/ui/card';
import { Upload, X, Image as ImageIcon, Camera, Loader2 } from 'lucide-react';
import { useImageUpload } from '@/hooks/useImageUpload';
import { cn } from '@/lib/utils';

interface ImageUploadProps {
  onImageUploaded?: (url: string) => void;
  onImageRemoved?: () => void;
  value?: string;
  className?: string;
  multiple?: boolean;
  showPreview?: boolean;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({
  onImageUploaded,
  onImageRemoved,
  value,
  className,
  multiple = false,
  showPreview = true
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const { uploadImage, uploadProgress, isUploading, resetProgress } = useImageUpload();
  const [isDragging, setIsDragging] = useState(false);
  const [imageError, setImageError] = useState(false);

  const handleFileSelect = useCallback(() => {
    if (isUploading) return;
    fileInputRef.current?.click();
  }, [isUploading]);

  const handleCameraSelect = useCallback(() => {
    if (isUploading) return;
    cameraInputRef.current?.click();
  }, [isUploading]);

  const processFile = useCallback(async (file: File) => {
    if (isUploading) return;
    
    setImageError(false);
    const uploadedUrl = await uploadImage(file);
    
    if (uploadedUrl && onImageUploaded) {
      onImageUploaded(uploadedUrl);
    }
  }, [isUploading, uploadImage, onImageUploaded]);

  const handleFileChange = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    await processFile(files[0]);

    // Reset the input to allow re-selecting the same file
    event.target.value = '';
  }, [processFile]);

  const handleRemoveImage = useCallback(() => {
    setImageError(false);
    resetProgress();
    if (onImageRemoved) {
      onImageRemoved();
    }
  }, [onImageRemoved, resetProgress]);

  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isUploading) {
      setIsDragging(true);
    }
  }, [isUploading]);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // Only set dragging to false if we're leaving the container
    if (e.currentTarget === e.target) {
      setIsDragging(false);
    }
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback(async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    if (isUploading) return;
    
    const files = e.dataTransfer.files;
    if (files.length === 0) return;

    const file = files[0];
    if (!file.type.startsWith('image/')) return;

    await processFile(file);
  }, [isUploading, processFile]);

  const handleImageError = useCallback(() => {
    setImageError(true);
  }, []);

  return (
    <div className={cn("space-y-4", className)}>
      {/* Hidden file inputs */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple={multiple}
        onChange={handleFileChange}
        className="hidden"
        disabled={isUploading}
      />
      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleFileChange}
        className="hidden"
        disabled={isUploading}
      />

      {!value && (
        <Card
          className={cn(
            "border-2 border-dashed transition-all duration-200 cursor-pointer",
            "active:scale-[0.98]", // Touch feedback
            isDragging 
              ? "border-primary bg-primary/5 scale-[1.02]" 
              : "border-muted-foreground/25 hover:border-muted-foreground/50",
            isUploading && "pointer-events-none opacity-60"
          )}
          onClick={handleFileSelect}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          <div className="p-6 sm:p-8 text-center">
            <div className="mx-auto w-12 h-12 text-muted-foreground mb-4">
              {isUploading ? (
                <Loader2 className="w-12 h-12 animate-spin" />
              ) : isDragging ? (
                <Upload className="w-12 h-12 text-primary animate-bounce" />
              ) : (
                <ImageIcon className="w-12 h-12" />
              )}
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium">
                {isUploading ? 'Uploaden...' : isDragging ? 'Laat los om te uploaden' : 'Upload een afbeelding'}
              </p>
              <p className="text-xs text-muted-foreground">
                Sleep een afbeelding hierheen of klik om te selecteren
              </p>
              <p className="text-xs text-muted-foreground">
                PNG, JPG, GIF, WEBP tot 5MB
              </p>
            </div>
            
            {/* Mobile camera button - larger touch target */}
            <div className="mt-4 flex flex-col sm:flex-row gap-2 justify-center">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  handleCameraSelect();
                }}
                disabled={isUploading}
                className="min-h-[44px] gap-2 sm:hidden"
              >
                <Camera className="w-4 h-4" />
                Maak foto
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Upload progress */}
      {isUploading && (
        <div className="space-y-2 animate-in fade-in duration-200">
          <Progress value={uploadProgress.progress} className="w-full h-2" />
          <p className="text-sm text-muted-foreground text-center">
            {uploadProgress.progress}% geüpload
          </p>
        </div>
      )}

      {/* Error state */}
      {uploadProgress.status === 'error' && !isUploading && (
        <div className="text-center p-4 bg-destructive/10 rounded-lg border border-destructive/20 animate-in fade-in duration-200">
          <p className="text-sm text-destructive font-medium">Upload mislukt</p>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => {
              resetProgress();
              handleFileSelect();
            }}
            className="mt-2 min-h-[44px]"
          >
            Probeer opnieuw
          </Button>
        </div>
      )}

      {/* Success state */}
      {uploadProgress.status === 'complete' && !value && (
        <div className="text-center p-4 bg-primary/10 rounded-lg border border-primary/20 animate-in fade-in duration-200">
          <p className="text-sm text-primary font-medium">✓ Upload geslaagd!</p>
        </div>
      )}

      {/* Image preview */}
      {value && showPreview && (
        <Card className="relative overflow-hidden animate-in fade-in duration-200">
          <div className="relative group">
            {!imageError ? (
              <img
                src={value}
                alt="Uploaded image"
                className="w-full h-48 object-cover"
                onError={handleImageError}
              />
            ) : (
              <div className="w-full h-48 bg-muted flex items-center justify-center">
                <div className="text-center text-muted-foreground">
                  <ImageIcon className="w-8 h-8 mx-auto mb-2" />
                  <p className="text-sm">Afbeelding laden mislukt</p>
                </div>
              </div>
            )}
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <Button
                type="button"
                variant="destructive"
                size="sm"
                onClick={handleRemoveImage}
                className="gap-2 min-h-[44px]"
              >
                <X className="w-4 h-4" />
                Verwijderen
              </Button>
            </div>
            {/* Always visible remove button on mobile */}
            <Button
              type="button"
              variant="destructive"
              size="icon"
              onClick={handleRemoveImage}
              className="absolute top-2 right-2 sm:hidden min-h-[44px] min-w-[44px]"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
};
