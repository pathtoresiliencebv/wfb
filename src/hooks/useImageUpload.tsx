import { useState } from 'react';
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
}

export const useImageUpload = (): UseImageUploadReturn => {
  const [uploadProgress, setUploadProgress] = useState<UploadProgress>({
    progress: 0,
    status: 'idle'
  });
  const { toast } = useToast();

  const uploadImage = async (file: File): Promise<string | null> => {
    try {
      setUploadProgress({ progress: 0, status: 'uploading' });

      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast({
          variant: "destructive",
          title: "Fout",
          description: "Alleen afbeeldingen zijn toegestaan."
        });
        setUploadProgress({ progress: 0, status: 'error' });
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
        return null;
      }

      // Generate unique filename
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;

      setUploadProgress({ progress: 30, status: 'uploading' });

      // Upload to Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('assets')
        .upload(fileName, file);

      if (uploadError) {
        console.error('Upload error:', uploadError);
        toast({
          variant: "destructive",
          title: "Upload fout",
          description: "Er ging iets mis bij het uploaden van de afbeelding."
        });
        setUploadProgress({ progress: 0, status: 'error' });
        return null;
      }

      setUploadProgress({ progress: 70, status: 'uploading' });

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('assets')
        .getPublicUrl(fileName);

      setUploadProgress({ progress: 90, status: 'uploading' });

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
          alt_text: file.name
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
          description: "Er ging iets mis bij het opslaan van de afbeelding metadata."
        });
        setUploadProgress({ progress: 0, status: 'error' });
        return null;
      }

      setUploadProgress({ progress: 100, status: 'complete' });
      
      toast({
        title: "Succes",
        description: "Afbeelding succesvol geüpload!"
      });

      return urlData.publicUrl;
    } catch (error) {
      console.error('Unexpected error:', error);
      toast({
        variant: "destructive",
        title: "Onverwachte fout",
        description: "Er ging iets mis bij het uploaden van de afbeelding."
      });
      setUploadProgress({ progress: 0, status: 'error' });
      return null;
    }
  };

  return {
    uploadImage,
    uploadProgress,
    isUploading: uploadProgress.status === 'uploading'
  };
};