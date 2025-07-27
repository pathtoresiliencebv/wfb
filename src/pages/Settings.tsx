import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Upload } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { SecuritySection } from '@/components/settings/SecuritySection';
import { PasswordStrengthMeter } from '@/components/settings/PasswordStrengthMeter';
import { useAuditLog } from '@/hooks/useAuditLog';
import { validatePassword } from '@/lib/security';

const Settings = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const { logUserAction } = useAuditLog();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    username: '',
    display_name: '',
    bio: '',
    avatar_url: '',
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [isSaving, setIsSaving] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;
      
      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();
      
      if (data) {
        setFormData({
          username: data.username || '',
          display_name: data.display_name || '',
          bio: data.bio || '',
          avatar_url: data.avatar_url || '',
        });
      }
    };
    
    fetchProfile();
  }, [user]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAvatarUpload = async (file: File) => {
    if (!user) return;

    setIsUploading(true);
    try {
      if (!file.type.startsWith('image/')) {
        toast({
          title: "Fout",
          description: "Alleen afbeeldingen zijn toegestaan.",
          variant: "destructive",
        });
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "Fout", 
          description: "Bestand mag maximaal 5MB groot zijn.",
          variant: "destructive",
        });
        return;
      }

      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}-${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('assets')
        .upload(`avatars/${fileName}`, file, {
          upsert: true
        });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('assets')
        .getPublicUrl(`avatars/${fileName}`);

      setFormData(prev => ({
        ...prev,
        avatar_url: publicUrl,
      }));

      toast({
        title: "Avatar geüpload",
        description: "Je profielfoto is succesvol geüpload. Vergeet niet om je profiel op te slaan.",
      });
    } catch (error) {
      console.error('Error uploading avatar:', error);
      toast({
        title: "Fout",
        description: "Er is een fout opgetreden bij het uploaden van je avatar.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleAvatarUpload(file);
    }
  };

  const handleSaveProfile = async () => {
    if (!user) return;

    setIsSaving(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          username: formData.username,
          display_name: formData.display_name || null,
          bio: formData.bio || null,
          avatar_url: formData.avatar_url || null,
        })
        .eq('user_id', user.id);

      if (error) throw error;

      logUserAction('profile_update', {
        username: formData.username,
        display_name: formData.display_name,
        bio: formData.bio,
        timestamp: new Date().toISOString(),
      });

      toast({
        title: "Profiel bijgewerkt",
        description: "Je profiel is succesvol opgeslagen.",
      });
    } catch (error) {
      console.error('Error saving profile:', error);
      toast({
        title: "Fout",
        description: "Er is een fout opgetreden bij het opslaan van je profiel.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleChangePassword = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast({
        title: "Fout",
        description: "Wachtwoorden komen niet overeen",
        variant: "destructive",
      });
      return;
    }

    const passwordValidation = validatePassword(passwordData.newPassword);
    if (!passwordValidation.isValid) {
      toast({
        title: "Fout", 
        description: passwordValidation.error,
        variant: "destructive",
      });
      return;
    }

    setIsChangingPassword(true);
    try {
      const { error } = await supabase.auth.updateUser({
        password: passwordData.newPassword
      });

      if (error) throw error;

      // Log security event
      logUserAction('password_change', {
        timestamp: new Date().toISOString(),
        method: 'settings_page'
      });

      toast({
        title: "Wachtwoord gewijzigd",
        description: "Je wachtwoord is succesvol gewijzigd",
      });

      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    } catch (error) {
      console.error('Error changing password:', error);
      toast({
        title: "Fout",
        description: "Er is een fout opgetreden bij het wijzigen van je wachtwoord.",
        variant: "destructive",
      });
    } finally {
      setIsChangingPassword(false);
    }
  };

  if (!user) {
    return <div>Laden...</div>;
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(-1)}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Terug
          </Button>
          <h1 className="text-3xl font-bold">Instellingen</h1>
        </div>

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="profile">Profiel</TabsTrigger>
            <TabsTrigger value="security">Beveiliging</TabsTrigger>
            <TabsTrigger value="privacy">Privacy</TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="space-y-6">
            {/* Profile Picture Section */}
            <Card>
              <CardHeader>
                <CardTitle>Profielfoto</CardTitle>
                <CardDescription>
                  Upload een nieuwe profielfoto
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-4">
                  <Avatar className="h-20 w-20">
                    <AvatarImage src={formData.avatar_url || ''} />
                    <AvatarFallback>
                      {user?.email?.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <Button
                      variant="outline"
                      onClick={() => fileInputRef.current?.click()}
                      className="flex items-center gap-2"
                      disabled={isUploading}
                    >
                      <Upload className="h-4 w-4" />
                      {isUploading ? 'Uploaden...' : 'Nieuwe foto uploaden'}
                    </Button>
                    <p className="text-sm text-muted-foreground mt-2">
                      JPG, PNG of GIF. Max 5MB.
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

            {/* Profile Information Section */}
            <Card>
              <CardHeader>
                <CardTitle>Profiel informatie</CardTitle>
                <CardDescription>
                  Bewerk je profiel gegevens
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="username">Gebruikersnaam</Label>
                    <Input
                      id="username"
                      name="username"
                      value={formData.username}
                      onChange={handleInputChange}
                      placeholder="Voer je gebruikersnaam in"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="display_name">Weergavenaam</Label>
                    <Input
                      id="display_name"
                      name="display_name"
                      value={formData.display_name}
                      onChange={handleInputChange}
                      placeholder="Voer je weergavenaam in"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    name="bio"
                    value={formData.bio}
                    onChange={handleInputChange}
                    placeholder="Vertel iets over jezelf..."
                    rows={4}
                  />
                </div>
                <Button onClick={handleSaveProfile} disabled={isSaving}>
                  {isSaving ? 'Opslaan...' : 'Profiel opslaan'}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security" className="space-y-6">
            {/* Password Change Section */}
            <Card>
              <CardHeader>
                <CardTitle>Wachtwoord wijzigen</CardTitle>
                <CardDescription>
                  Update je wachtwoord voor betere beveiliging
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="currentPassword">Huidig wachtwoord</Label>
                  <Input
                    id="currentPassword"
                    name="currentPassword"
                    type="password"
                    value={passwordData.currentPassword}
                    onChange={handlePasswordChange}
                    placeholder="Voer je huidige wachtwoord in"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="newPassword">Nieuw wachtwoord</Label>
                  <Input
                    id="newPassword"
                    name="newPassword"
                    type="password"
                    value={passwordData.newPassword}
                    onChange={handlePasswordChange}
                    placeholder="Voer je nieuwe wachtwoord in"
                  />
                  {passwordData.newPassword && (
                    <PasswordStrengthMeter password={passwordData.newPassword} />
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Bevestig nieuw wachtwoord</Label>
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    value={passwordData.confirmPassword}
                    onChange={handlePasswordChange}
                    placeholder="Bevestig je nieuwe wachtwoord"
                  />
                </div>
                <Button 
                  onClick={handleChangePassword} 
                  variant="outline"
                  disabled={isChangingPassword}
                >
                  {isChangingPassword ? 'Wijzigen...' : 'Wachtwoord wijzigen'}
                </Button>
              </CardContent>
            </Card>

            <SecuritySection />
          </TabsContent>

          <TabsContent value="privacy">
            <SecuritySection />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Settings;