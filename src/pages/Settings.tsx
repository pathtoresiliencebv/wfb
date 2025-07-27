import { useState, useRef, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Upload, Shield, Eye, User, FileWarning, AlertTriangle, Clock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useIsMobile } from '@/hooks/use-mobile';
import { SettingsBreadcrumb } from '@/components/ui/settings-breadcrumb';
import { SettingsProfileSkeleton, SettingsSecuritySkeleton, SettingsPrivacySkeleton } from '@/components/ui/settings-skeleton';
import { SecuritySection } from '@/components/settings/SecuritySection';
import SecurityDashboard from '@/components/settings/SecurityDashboard';
import TwoFactorSetup from '@/components/settings/TwoFactorSetup';
import DataExportSection from '@/components/settings/DataExportSection';
import AccountDeletionSection from '@/components/settings/AccountDeletionSection';
import { PasswordStrengthMeter } from '@/components/settings/PasswordStrengthMeter';
import { useAuditLog } from '@/hooks/useAuditLog';
import { useUserSecurity } from '@/hooks/useUserSecurity';
import { useSecurityDashboard } from '@/hooks/useSecurityDashboard';
import { useDataExport } from '@/hooks/useDataExport';
import { validatePassword } from '@/lib/security';

const Settings = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { user } = useAuth();
  const { toast } = useToast();
  const { logUserAction } = useAuditLog();
  const { twoFactorAuth, refreshData } = useUserSecurity();
  const { dashboard } = useSecurityDashboard();
  const { exportRequests } = useDataExport();
  const isMobile = useIsMobile();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Get active tab from URL params or default to profile
  const activeTab = searchParams.get('tab') || 'profile';
  
  // Set active tab and update URL
  const setActiveTab = (tab: string) => {
    setSearchParams({ tab });
  };

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
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;
      
      setIsInitialLoading(true);
      try {
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
      } catch (error) {
        console.error('Error fetching profile:', error);
      } finally {
        setIsInitialLoading(false);
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

  // Get tab status indicators
  const getTabBadges = () => {
    const badges: Record<string, React.ReactNode> = {};
    
    // Security tab badges
    if (twoFactorAuth?.is_enabled) {
      badges.security = <Badge variant="secondary" className="ml-1 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"><Shield className="h-3 w-3 mr-1" />2FA</Badge>;
    }
    
    // Privacy tab badges  
    if (exportRequests && exportRequests.length > 0) {
      const pendingExports = exportRequests.filter(req => req.status === 'processing').length;
      if (pendingExports > 0) {
        badges.privacy = <Badge variant="secondary" className="ml-1 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"><Clock className="h-3 w-3 mr-1" />{pendingExports}</Badge>;
      }
    }
    
    return badges;
  };

  const tabBadges = getTabBadges();

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-muted rounded w-48"></div>
            <div className="h-10 bg-muted rounded"></div>
            <div className="space-y-4">
              <div className="h-32 bg-muted rounded"></div>
              <div className="h-32 bg-muted rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6 sm:py-8 max-w-4xl">
        {/* Breadcrumb Navigation */}
        <SettingsBreadcrumb activeTab={activeTab} />

        {/* Header */}
        <div className="flex items-center gap-4 mb-6 sm:mb-8">
          {!isMobile && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 transition-colors hover:bg-muted"
            >
              <ArrowLeft className="h-4 w-4" />
              Terug
            </Button>
          )}
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Instellingen</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Beheer je account, beveiliging en privacy
            </p>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className={`grid w-full ${isMobile ? 'grid-cols-1 gap-1 h-auto' : 'grid-cols-3'} bg-muted/50 p-1`}>
            <TabsTrigger 
              value="profile" 
              className={`flex items-center gap-2 transition-all ${isMobile ? 'justify-start px-4 py-3' : 'justify-center'} data-[state=active]:bg-background data-[state=active]:shadow-sm`}
            >
              <User className="h-4 w-4" />
              <span>Profiel</span>
              {tabBadges.profile}
            </TabsTrigger>
            <TabsTrigger 
              value="security" 
              className={`flex items-center gap-2 transition-all ${isMobile ? 'justify-start px-4 py-3' : 'justify-center'} data-[state=active]:bg-background data-[state=active]:shadow-sm`}
            >
              <Shield className="h-4 w-4" />
              <span>Beveiliging</span>
              {tabBadges.security}
            </TabsTrigger>
            <TabsTrigger 
              value="privacy" 
              className={`flex items-center gap-2 transition-all ${isMobile ? 'justify-start px-4 py-3' : 'justify-center'} data-[state=active]:bg-background data-[state=active]:shadow-sm`}
            >
              <Eye className="h-4 w-4" />
              <span>Privacy</span>
              {tabBadges.privacy}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="space-y-6 animate-fade-in">
            {isInitialLoading ? (
              <SettingsProfileSkeleton />
            ) : (
              <>
                {/* Profile Picture Section */}
                <Card className="transition-all hover:shadow-md border-border/50">
                  <CardHeader className="space-y-1">
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <User className="h-5 w-5 text-primary" />
                      Profielfoto
                    </CardTitle>
                    <CardDescription>
                      Upload een nieuwe profielfoto om je profiel te personaliseren
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className={`flex ${isMobile ? 'flex-col' : 'flex-row'} items-center gap-4`}>
                      <Avatar className="h-20 w-20 ring-2 ring-primary/10">
                        <AvatarImage src={formData.avatar_url || ''} />
                        <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                          {user?.email?.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className={`${isMobile ? 'text-center' : 'text-left'} space-y-2`}>
                        <Button
                          variant="outline"
                          onClick={() => fileInputRef.current?.click()}
                          className="flex items-center gap-2 transition-all hover:scale-105"
                          disabled={isUploading}
                        >
                          <Upload className="h-4 w-4" />
                          {isUploading ? 'Uploaden...' : 'Nieuwe foto uploaden'}
                        </Button>
                        <p className="text-sm text-muted-foreground">
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
                <Card className="transition-all hover:shadow-md border-border/50">
                  <CardHeader className="space-y-1">
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <User className="h-5 w-5 text-primary" />
                      Profiel informatie
                    </CardTitle>
                    <CardDescription>
                      Bewerk je profiel gegevens en laat anderen weten wie je bent
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="username" className="text-sm font-medium">Gebruikersnaam</Label>
                        <Input
                          id="username"
                          name="username"
                          value={formData.username}
                          onChange={handleInputChange}
                          placeholder="Voer je gebruikersnaam in"
                          className="transition-all focus:ring-2 focus:ring-primary/20"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="display_name" className="text-sm font-medium">Weergavenaam</Label>
                        <Input
                          id="display_name"
                          name="display_name"
                          value={formData.display_name}
                          onChange={handleInputChange}
                          placeholder="Voer je weergavenaam in"
                          className="transition-all focus:ring-2 focus:ring-primary/20"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="bio" className="text-sm font-medium">Bio</Label>
                      <Textarea
                        id="bio"
                        name="bio"
                        value={formData.bio}
                        onChange={handleInputChange}
                        placeholder="Vertel iets over jezelf..."
                        rows={4}
                        className="transition-all focus:ring-2 focus:ring-primary/20 resize-none"
                      />
                    </div>
                    <Button 
                      onClick={handleSaveProfile} 
                      disabled={isSaving}
                      className="transition-all hover:scale-105"
                    >
                      {isSaving ? 'Opslaan...' : 'Profiel opslaan'}
                    </Button>
                  </CardContent>
                </Card>
              </>
            )}
          </TabsContent>

          <TabsContent value="security" className="space-y-6 animate-fade-in">
            {isInitialLoading ? (
              <SettingsSecuritySkeleton />
            ) : (
              <>
                {/* Security Dashboard */}
                <div className="transition-all animate-scale-in">
                  <SecurityDashboard />
                </div>

                {/* Two-Factor Authentication */}
                <div className="transition-all animate-scale-in">
                  <TwoFactorSetup 
                    currentStatus={twoFactorAuth} 
                    onStatusChange={refreshData}
                  />
                </div>

                {/* Password Change Section */}
                <Card className="transition-all hover:shadow-md border-border/50">
                  <CardHeader className="space-y-1">
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Shield className="h-5 w-5 text-primary" />
                      Wachtwoord wijzigen
                    </CardTitle>
                    <CardDescription>
                      Update je wachtwoord regelmatig voor optimale beveiliging
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="currentPassword" className="text-sm font-medium">Huidig wachtwoord</Label>
                      <Input
                        id="currentPassword"
                        name="currentPassword"
                        type="password"
                        value={passwordData.currentPassword}
                        onChange={handlePasswordChange}
                        placeholder="Voer je huidige wachtwoord in"
                        className="transition-all focus:ring-2 focus:ring-primary/20"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="newPassword" className="text-sm font-medium">Nieuw wachtwoord</Label>
                      <Input
                        id="newPassword"
                        name="newPassword"
                        type="password"
                        value={passwordData.newPassword}
                        onChange={handlePasswordChange}
                        placeholder="Voer je nieuwe wachtwoord in"
                        className="transition-all focus:ring-2 focus:ring-primary/20"
                      />
                      {passwordData.newPassword && (
                        <div className="mt-3">
                          <PasswordStrengthMeter password={passwordData.newPassword} />
                        </div>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword" className="text-sm font-medium">Bevestig nieuw wachtwoord</Label>
                      <Input
                        id="confirmPassword"
                        name="confirmPassword"
                        type="password"
                        value={passwordData.confirmPassword}
                        onChange={handlePasswordChange}
                        placeholder="Bevestig je nieuwe wachtwoord"
                        className="transition-all focus:ring-2 focus:ring-primary/20"
                      />
                    </div>
                    <Button 
                      onClick={handleChangePassword} 
                      variant="outline"
                      disabled={isChangingPassword}
                      className="transition-all hover:scale-105"
                    >
                      {isChangingPassword ? 'Wijzigen...' : 'Wachtwoord wijzigen'}
                    </Button>
                  </CardContent>
                </Card>

                {/* Additional Security Settings */}
                <div className="transition-all animate-scale-in">
                  <SecuritySection />
                </div>
              </>
            )}
          </TabsContent>

          <TabsContent value="privacy" className="space-y-6 animate-fade-in">
            {isInitialLoading ? (
              <SettingsPrivacySkeleton />
            ) : (
              <>
                {/* Data Export */}
                <div className="transition-all animate-scale-in">
                  <DataExportSection />
                </div>

                {/* Account Deletion */}
                <div className="transition-all animate-scale-in">
                  <AccountDeletionSection />
                </div>

                {/* Privacy Settings */}
                <div className="transition-all animate-scale-in">
                  <SecuritySection />
                </div>
              </>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Settings;