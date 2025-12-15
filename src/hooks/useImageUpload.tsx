import { useState, useRef, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface UploadProgress {
  progress: number;
  status: 'idle' | 'uploading' | 'complete' | 'error';
}

interface UseImageUploadReturn {
  uploadImage: (file: File) => Promise<string | null>;
  uploadProgress: UploadProgress;
  isUploading: boolean;
  resetProgress: () => void;
}

export const useImageUpload = (): UseImageUploadReturn => {
  const [uploadProgress, setUploadProgress] = useState<UploadProgress>({
    progress: 0,
    status: 'idle'
  });
  const { toast } = useToast();
  const uploadingRef = useRef(false);

  const resetProgress = useCallback(() => {
    setUploadProgress({ progress: 0, status: 'idle' });
  }, []);

  const uploadImage = useCallback(async (file: File): Promise<string | null> => {
    // Prevent double uploads
    if (uploadingRef.current) {
      console.log('Upload already in progress, skipping');
      return null;
    }

    try {
      uploadingRef.current = true;
      setUploadProgress({ progress: 0, status: 'uploading' });

      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast({
          variant: "destructive",
          title: "Fout",
          description: "Alleen afbeeldingen zijn toegestaan."
        });
        setUploadProgress({ progress: 0, status: 'error' });
        uploadingRef.current = false;
        return null;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          variant: "destructive",
          title: "Fout", 
          description: "Afbeelding mag maximaal 5MB groot zijn."
        });
        setUploadProgress({ progress: 0, status: 'error' });
        uploadingRef.current = false;
        return null;
      }

      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          variant: "destructive",
          title: "Fout",
          description: "Je moet ingelogd zijn om afbeeldingen te uploaden."
        });
        setUploadProgress({ progress: 0, status: 'error' });
        uploadingRef.current = false;
        return null;
      }

      // Generate unique filename with sanitized extension
      const fileExt = file.name.split('.').pop()?.toLowerCase() || 'jpg';
      const safeExt = ['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(fileExt) ? fileExt : 'jpg';
      const fileName = `${user.id}/${Date.now()}-${Math.random().toString(36).substring(2, 10)}.${safeExt}`;

      setUploadProgress({ progress: 20, status: 'uploading' });

      // Upload to Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('assets')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        console.error('Upload error:', uploadError);
        toast({
          variant: "destructive",
          title: "Upload fout",
          description: uploadError.message || "Er ging iets mis bij het uploaden."
        });
        setUploadProgress({ progress: 0, status: 'error' });
        uploadingRef.current = false;
        return null;
      }

      setUploadProgress({ progress: 60, status: 'uploading' });

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('assets')
        .getPublicUrl(fileName);

      setUploadProgress({ progress: 80, status: 'uploading' });

      // Save to images table
      const { data: imageData, error: dbError } = await supabase
        .from('images')
        .insert({
          user_id: user.id,
          filename: fileName,
          original_name: file.name,
          storage_path: urlData.publicUrl,
          file_size: file.size,
          mime_type: file.type,
          alt_text: file.name.replace(/\.[^/.]+$/, '') // Remove extension for alt text
        })
        .select()
        .single();

      if (dbError) {
        console.error('Database error:', dbError);
        // Clean up uploaded file if DB insert fails
        await supabase.storage.from('assets').remove([fileName]);
        toast({
          variant: "destructive",
          title: "Database fout",
          description: "Er ging iets mis bij het opslaan van de metadata."
        });
        setUploadProgress({ progress: 0, status: 'error' });
        uploadingRef.current = false;
        return null;
      }

      setUploadProgress({ progress: 100, status: 'complete' });
      
      toast({
        title: "Succes",
        description: "Afbeelding succesvol geüpload!"
      });

      // Reset progress after a short delay
      setTimeout(() => {
        setUploadProgress({ progress: 0, status: 'idle' });
      }, 1500);

      uploadingRef.current = false;
      return urlData.publicUrl;
    } catch (error) {
      console.error('Unexpected error:', error);
      toast({
        variant: "destructive",
        title: "Onverwachte fout",
        description: "Er ging iets mis bij het uploaden."
      });
      setUploadProgress({ progress: 0, status: 'error' });
      uploadingRef.current = false;
      return null;
    }
  }, [toast]);

  return {
    uploadImage,
    uploadProgress,
    isUploading: uploadProgress.status === 'uploading',
    resetProgress
  };
};
