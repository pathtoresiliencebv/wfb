import React, { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Card } from '@/components/ui/card';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
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
  const { uploadImage, uploadProgress, isUploading } = useImageUpload();

  const handleFileSelect = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    const uploadedUrl = await uploadImage(file);
    
    if (uploadedUrl && onImageUploaded) {
      onImageUploaded(uploadedUrl);
    }

    // Reset the input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleRemoveImage = () => {
    if (onImageRemoved) {
      onImageRemoved();
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const files = e.dataTransfer.files;
    if (files.length === 0) return;

    const file = files[0];
    if (!file.type.startsWith('image/')) return;

    const uploadedUrl = await uploadImage(file);
    
    if (uploadedUrl && onImageUploaded) {
      onImageUploaded(uploadedUrl);
    }
  };

  return (
    <div className={cn("space-y-4", className)}>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple={multiple}
        onChange={handleFileChange}
        className="hidden"
      />

      {!value && (
        <Card
          className={cn(
            "border-2 border-dashed border-muted-foreground/25 hover:border-muted-foreground/50 transition-colors cursor-pointer",
            isUploading && "pointer-events-none opacity-50"
          )}
          onClick={handleFileSelect}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          <div className="p-8 text-center">
            <div className="mx-auto w-12 h-12 text-muted-foreground mb-4">
              {isUploading ? (
                <div className="animate-spin">
                  <Upload className="w-12 h-12" />
                </div>
              ) : (
                <ImageIcon className="w-12 h-12" />
              )}
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium">
                {isUploading ? 'Uploading...' : 'Upload een afbeelding'}
              </p>
              <p className="text-xs text-muted-foreground">
                Sleep een afbeelding hierheen of klik om te selecteren
              </p>
              <p className="text-xs text-muted-foreground">
                PNG, JPG, GIF tot 5MB
              </p>
            </div>
          </div>
        </Card>
      )}

      {isUploading && (
        <div className="space-y-2">
          <Progress value={uploadProgress.progress} className="w-full" />
          <p className="text-sm text-muted-foreground text-center">
            {uploadProgress.progress}% geüpload
          </p>
        </div>
      )}

      {value && showPreview && (
        <Card className="relative">
          <div className="relative group">
            <img
              src={value}
              alt="Uploaded image"
              className="w-full h-48 object-cover rounded-lg"
            />
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
              <Button
                variant="destructive"
                size="sm"
                onClick={handleRemoveImage}
                className="gap-2"
              >
                <X className="w-4 h-4" />
                Verwijderen
              </Button>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};