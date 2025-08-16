import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Trash2, Search, Eye, Download, Calendar, FileImage } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { formatDistanceToNow } from 'date-fns';
import { nl } from 'date-fns/locale';

interface ImageData {
  id: string;
  filename: string;
  original_name: string;
  storage_path: string;
  file_size: number;
  mime_type: string;
  alt_text?: string;
  created_at: string;
  width?: number;
  height?: number;
  user_id: string;
  profiles: {
    username: string;
    display_name?: string;
    avatar_url?: string;
  };
}

export const AdminImageManager: React.FC = () => {
  const [images, setImages] = useState<ImageData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedImages, setSelectedImages] = useState<Set<string>>(new Set());
  const { toast } = useToast();

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    try {
      const { data, error } = await supabase
        .from('images')
        .select(`
          *,
          profiles!inner (
            username,
            display_name,
            avatar_url
          )
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching images:', error);
        toast({
          variant: "destructive",
          title: "Fout",
          description: "Kon afbeeldingen niet ophalen."
        });
        return;
      }

      setImages((data || []).filter(img => img.profiles && typeof img.profiles === 'object' && (img.profiles as any)?.username) as unknown as ImageData[]);
    } catch (error) {
      console.error('Unexpected error:', error);
      toast({
        variant: "destructive",
        title: "Fout",
        description: "Er ging iets mis bij het ophalen van afbeeldingen."
      });
    } finally {
      setLoading(false);
    }
  };

  const deleteImage = async (imageId: string, filename: string) => {
    try {
      // Delete from storage
      const { error: storageError } = await supabase.storage
        .from('assets')
        .remove([filename]);

      if (storageError) {
        console.error('Storage deletion error:', storageError);
      }

      // Delete from database
      const { error: dbError } = await supabase
        .from('images')
        .delete()
        .eq('id', imageId);

      if (dbError) {
        console.error('Database deletion error:', dbError);
        toast({
          variant: "destructive",
          title: "Fout",
          description: "Kon afbeelding niet verwijderen uit database."
        });
        return;
      }

      toast({
        title: "Succes",
        description: "Afbeelding succesvol verwijderd."
      });

      fetchImages();
    } catch (error) {
      console.error('Unexpected error:', error);
      toast({
        variant: "destructive",
        title: "Fout",
        description: "Er ging iets mis bij het verwijderen van de afbeelding."
      });
    }
  };

  const deleteSelectedImages = async () => {
    if (selectedImages.size === 0) return;

    try {
      const imagesToDelete = images.filter(img => selectedImages.has(img.id));
      
      // Delete from storage
      const filenames = imagesToDelete.map(img => img.filename);
      const { error: storageError } = await supabase.storage
        .from('assets')
        .remove(filenames);

      if (storageError) {
        console.error('Storage deletion error:', storageError);
      }

      // Delete from database
      const { error: dbError } = await supabase
        .from('images')
        .delete()
        .in('id', Array.from(selectedImages));

      if (dbError) {
        console.error('Database deletion error:', dbError);
        toast({
          variant: "destructive",
          title: "Fout",
          description: "Kon geselecteerde afbeeldingen niet verwijderen."
        });
        return;
      }

      toast({
        title: "Succes",
        description: `${selectedImages.size} afbeeldingen succesvol verwijderd.`
      });

      setSelectedImages(new Set());
      fetchImages();
    } catch (error) {
      console.error('Unexpected error:', error);
      toast({
        variant: "destructive",
        title: "Fout",
        description: "Er ging iets mis bij het verwijderen van de afbeeldingen."
      });
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getUserInitials = (username: string) => {
    return username.slice(0, 2).toUpperCase();
  };

  const filteredImages = images.filter(image =>
    image.original_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    image.alt_text?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    image.profiles.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleImageSelection = (imageId: string) => {
    const newSelection = new Set(selectedImages);
    if (newSelection.has(imageId)) {
      newSelection.delete(imageId);
    } else {
      newSelection.add(imageId);
    }
    setSelectedImages(newSelection);
  };

  const selectAllImages = () => {
    if (selectedImages.size === filteredImages.length) {
      setSelectedImages(new Set());
    } else {
      setSelectedImages(new Set(filteredImages.map(img => img.id)));
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Afbeeldingen beheren</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="mt-2 text-muted-foreground">Afbeeldingen laden...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileImage className="w-5 h-5" />
          Afbeeldingen beheren
        </CardTitle>
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Zoek afbeeldingen..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={selectAllImages}
            >
              {selectedImages.size === filteredImages.length ? 'Deselecteer alles' : 'Selecteer alles'}
            </Button>
            {selectedImages.size > 0 && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" size="sm">
                    <Trash2 className="w-4 h-4 mr-2" />
                    Verwijder geselecteerde ({selectedImages.size})
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Afbeeldingen verwijderen</AlertDialogTitle>
                    <AlertDialogDescription>
                      Weet je zeker dat je {selectedImages.size} afbeelding(en) wilt verwijderen? 
                      Deze actie kan niet ongedaan worden gemaakt.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Annuleren</AlertDialogCancel>
                    <AlertDialogAction onClick={deleteSelectedImages}>
                      Verwijderen
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {filteredImages.length === 0 ? (
          <div className="text-center py-8">
            <FileImage className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">
              {searchQuery ? 'Geen afbeeldingen gevonden' : 'Geen afbeeldingen geüpload'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredImages.map((image) => (
              <Card key={image.id} className={`relative ${selectedImages.has(image.id) ? 'ring-2 ring-primary' : ''}`}>
                <div className="absolute top-2 left-2 z-10">
                  <input
                    type="checkbox"
                    checked={selectedImages.has(image.id)}
                    onChange={() => toggleImageSelection(image.id)}
                    className="w-4 h-4"
                  />
                </div>
                <div className="aspect-video bg-muted rounded-t-lg overflow-hidden">
                  <img
                    src={image.storage_path}
                    alt={image.alt_text || image.original_name}
                    className="w-full h-full object-cover hover:scale-105 transition-transform"
                  />
                </div>
                <CardContent className="p-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <p className="font-medium text-sm truncate">
                        {image.original_name}
                      </p>
                      <Badge variant="secondary" className="text-xs">
                        {image.mime_type.split('/')[1].toUpperCase()}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Avatar className="w-4 h-4">
                        <AvatarImage src={image.profiles.avatar_url} />
                        <AvatarFallback className="text-xs">
                          {getUserInitials(image.profiles.username)}
                        </AvatarFallback>
                      </Avatar>
                      <span>{image.profiles.display_name || image.profiles.username}</span>
                    </div>
                    
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>{formatFileSize(image.file_size)}</span>
                      {image.width && image.height && (
                        <span>{image.width}×{image.height}</span>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Calendar className="w-3 h-3" />
                      <span>
                        {formatDistanceToNow(new Date(image.created_at), {
                          addSuffix: true,
                          locale: nl
                        })}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-2 pt-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        onClick={() => window.open(image.storage_path, '_blank')}
                      >
                        <Eye className="w-3 h-3 mr-1" />
                        Bekijk
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          const link = document.createElement('a');
                          link.href = image.storage_path;
                          link.download = image.original_name;
                          link.click();
                        }}
                      >
                        <Download className="w-3 h-3" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="destructive" size="sm">
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Afbeelding verwijderen</AlertDialogTitle>
                            <AlertDialogDescription>
                              Weet je zeker dat je deze afbeelding wilt verwijderen? 
                              Deze actie kan niet ongedaan worden gemaakt.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Annuleren</AlertDialogCancel>
                            <AlertDialogAction 
                              onClick={() => deleteImage(image.id, image.filename)}
                            >
                              Verwijderen
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};