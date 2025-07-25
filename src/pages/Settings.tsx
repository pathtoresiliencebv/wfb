import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Camera, Save, User, Mail, MapPin, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export default function Settings() {
  const navigate = useNavigate();
  const { user, updateUser } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: user?.username || '',
    email: user?.email || '',
    displayName: user?.displayName || '',
    bio: user?.bio || '',
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleAvatarUpload = async (file: File) => {
    if (!user) return;

    try {
      setIsLoading(true);
      
      // Validate file type and size
      if (!file.type.startsWith('image/')) {
        toast({
          title: 'Fout',
          description: 'Alleen afbeeldingen zijn toegestaan.',
          variant: 'destructive',
        });
        return;
      }

      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast({
          title: 'Fout',
          description: 'Afbeelding mag maximaal 5MB groot zijn.',
          variant: 'destructive',
        });
        return;
      }

      // Create unique filename
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}-${Date.now()}.${fileExt}`;

      // Upload to Supabase storage
      const { error: uploadError } = await supabase.storage
        .from('assets')
        .upload(`avatars/${fileName}`, file, {
          upsert: true
        });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('assets')
        .getPublicUrl(`avatars/${fileName}`);

      // Update user profile
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: publicUrl })
        .eq('user_id', user.id);

      if (updateError) throw updateError;

      // Update local auth context
      updateUser({ avatar: publicUrl });

      toast({
        title: 'Succes',
        description: 'Profielfoto succesvol bijgewerkt.',
      });

    } catch (error) {
      console.error('Avatar upload error:', error);
      toast({
        title: 'Fout',
        description: 'Er ging iets mis bij het uploaden van je profielfoto.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleAvatarUpload(file);
    }
  };

  const handleSaveProfile = async () => {
    if (!user) return;

    try {
      setIsLoading(true);

      // Update profile in database
      const { error } = await supabase
        .from('profiles')
        .update({
          username: formData.username,
          display_name: formData.displayName || null,
          bio: formData.bio || null,
        })
        .eq('user_id', user.id);

      if (error) throw error;

      // Update local auth context
      updateUser({
        username: formData.username,
        displayName: formData.displayName,
        bio: formData.bio,
      });

      toast({
        title: 'Succes',
        description: 'Profiel succesvol bijgewerkt.',
      });

    } catch (error) {
      console.error('Profile update error:', error);
      toast({
        title: 'Fout',
        description: 'Er ging iets mis bij het bijwerken van je profiel.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getUserInitials = (username: string) => {
    return username.slice(0, 2).toUpperCase();
  };

  if (!user) return null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Terug
        </Button>
        <h1 className="font-heading text-2xl font-bold">Instellingen</h1>
      </div>

      <div className="grid gap-6">
        {/* Profile Picture */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Camera className="h-5 w-5" />
              Profielfoto
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-6">
              <Avatar className="h-20 w-20">
                <AvatarImage src={user.avatar || undefined} />
                <AvatarFallback className="text-lg">
                  {getUserInitials(user.username)}
                </AvatarFallback>
              </Avatar>
              <div className="space-y-2">
                <Button 
                  variant="outline" 
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isLoading}
                >
                  <Camera className="h-4 w-4 mr-2" />
                  Nieuwe foto uploaden
                </Button>
                <p className="text-sm text-muted-foreground">
                  JPG, PNG of GIF. Maximaal 5MB.
                </p>
              </div>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
            />
          </CardContent>
        </Card>

        {/* Profile Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Profielinformatie
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="username">Gebruikersnaam</Label>
                <Input
                  id="username"
                  value={formData.username}
                  onChange={(e) => handleInputChange('username', e.target.value)}
                  placeholder="Je gebruikersnaam"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="displayName">Weergavenaam (optioneel)</Label>
                <Input
                  id="displayName"
                  value={formData.displayName}
                  onChange={(e) => handleInputChange('displayName', e.target.value)}
                  placeholder="Je volledige naam"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="email">E-mailadres</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  disabled
                  className="bg-muted"
                />
                <p className="text-xs text-muted-foreground">
                  E-mailadres kan niet worden gewijzigd
                </p>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  value={formData.bio}
                  onChange={(e) => handleInputChange('bio', e.target.value)}
                  placeholder="Vertel iets over jezelf..."
                  rows={4}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Save Button */}
        <div className="flex justify-end">
          <Button 
            onClick={handleSaveProfile}
            disabled={isLoading}
            className="min-w-[120px]"
          >
            <Save className="h-4 w-4 mr-2" />
            {isLoading ? 'Opslaan...' : 'Opslaan'}
          </Button>
        </div>
      </div>
    </div>
  );
}