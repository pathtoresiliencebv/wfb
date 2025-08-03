import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Settings, Globe, Users, MessageSquare, Shield, Palette, Bell } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ForumSettings {
  // General Settings
  forum_name: string;
  forum_description: string;
  forum_url: string;
  forum_logo: string;
  
  // User Settings
  allow_registration: boolean;
  email_verification_required: boolean;
  auto_approve_users: boolean;
  min_username_length: number;
  max_username_length: number;
  
  // Content Settings
  max_topic_title_length: number;
  max_post_length: number;
  allow_html_posts: boolean;
  auto_link_urls: boolean;
  require_post_approval: boolean;
  
  // Moderation Settings
  spam_protection_enabled: boolean;
  rate_limit_posts: boolean;
  posts_per_hour_limit: number;
  auto_flag_suspicious_content: boolean;
  
  // Notification Settings
  email_notifications_enabled: boolean;
  push_notifications_enabled: boolean;
  digest_email_frequency: string;
  
  // Theme Settings
  primary_color: string;
  secondary_color: string;
  dark_mode_enabled: boolean;
  custom_css: string;
}

export function ForumSettings() {
  const { toast } = useToast();
  const [settings, setSettings] = useState<ForumSettings>({
    // General Settings
    forum_name: 'Wiet Forum België',
    forum_description: 'Het grootste cannabis forum van België',
    forum_url: 'wietforum.be',
    forum_logo: '',
    
    // User Settings
    allow_registration: true,
    email_verification_required: true,
    auto_approve_users: false,
    min_username_length: 3,
    max_username_length: 20,
    
    // Content Settings
    max_topic_title_length: 200,
    max_post_length: 10000,
    allow_html_posts: false,
    auto_link_urls: true,
    require_post_approval: false,
    
    // Moderation Settings
    spam_protection_enabled: true,
    rate_limit_posts: true,
    posts_per_hour_limit: 10,
    auto_flag_suspicious_content: true,
    
    // Notification Settings
    email_notifications_enabled: true,
    push_notifications_enabled: true,
    digest_email_frequency: 'weekly',
    
    // Theme Settings
    primary_color: '#10b981',
    secondary_color: '#f3f4f6',
    dark_mode_enabled: true,
    custom_css: ''
  });

  const [activeTab, setActiveTab] = useState('general');

  const handleSave = () => {
    // Here you would save the settings to your backend
    toast({ title: 'Instellingen opgeslagen' });
  };

  const updateSetting = (key: keyof ForumSettings, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const tabs = [
    { id: 'general', label: 'Algemeen', icon: Globe },
    { id: 'users', label: 'Gebruikers', icon: Users },
    { id: 'content', label: 'Content', icon: MessageSquare },
    { id: 'moderation', label: 'Moderatie', icon: Shield },
    { id: 'notifications', label: 'Notificaties', icon: Bell },
    { id: 'theme', label: 'Thema', icon: Palette }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="h-5 w-5" />
          Forum Instellingen
        </CardTitle>
        <CardDescription>
          Beheer de configuratie en voorkeuren van het forum
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex gap-6">
          {/* Navigation Tabs */}
          <div className="w-48 space-y-1">
            {tabs.map((tab) => (
              <Button
                key={tab.id}
                variant={activeTab === tab.id ? "secondary" : "ghost"}
                className="w-full justify-start"
                onClick={() => setActiveTab(tab.id)}
              >
                <tab.icon className="h-4 w-4 mr-2" />
                {tab.label}
              </Button>
            ))}
          </div>

          <Separator orientation="vertical" className="h-auto" />

          {/* Settings Content */}
          <div className="flex-1 space-y-6">
            {activeTab === 'general' && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Algemene Instellingen</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="forum_name">Forum Naam</Label>
                    <Input
                      id="forum_name"
                      value={settings.forum_name}
                      onChange={(e) => updateSetting('forum_name', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="forum_url">Forum URL</Label>
                    <Input
                      id="forum_url"
                      value={settings.forum_url}
                      onChange={(e) => updateSetting('forum_url', e.target.value)}
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="forum_description">Forum Beschrijving</Label>
                  <Textarea
                    id="forum_description"
                    value={settings.forum_description}
                    onChange={(e) => updateSetting('forum_description', e.target.value)}
                    rows={3}
                  />
                </div>
                <div>
                  <Label htmlFor="forum_logo">Forum Logo URL</Label>
                  <Input
                    id="forum_logo"
                    value={settings.forum_logo}
                    onChange={(e) => updateSetting('forum_logo', e.target.value)}
                    placeholder="https://example.com/logo.png"
                  />
                </div>
              </div>
            )}

            {activeTab === 'users' && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Gebruikers Instellingen</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="allow_registration">Registratie Toestaan</Label>
                      <p className="text-sm text-muted-foreground">Nieuwe gebruikers kunnen zich registreren</p>
                    </div>
                    <Switch
                      id="allow_registration"
                      checked={settings.allow_registration}
                      onCheckedChange={(checked) => updateSetting('allow_registration', checked)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="email_verification_required">Email Verificatie Vereist</Label>
                      <p className="text-sm text-muted-foreground">Gebruikers moeten hun email bevestigen</p>
                    </div>
                    <Switch
                      id="email_verification_required"
                      checked={settings.email_verification_required}
                      onCheckedChange={(checked) => updateSetting('email_verification_required', checked)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="auto_approve_users">Automatisch Goedkeuren</Label>
                      <p className="text-sm text-muted-foreground">Nieuwe gebruikers automatisch goedkeuren</p>
                    </div>
                    <Switch
                      id="auto_approve_users"
                      checked={settings.auto_approve_users}
                      onCheckedChange={(checked) => updateSetting('auto_approve_users', checked)}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="min_username_length">Min. Gebruikersnaam Lengte</Label>
                      <Input
                        id="min_username_length"
                        type="number"
                        value={settings.min_username_length}
                        onChange={(e) => updateSetting('min_username_length', parseInt(e.target.value))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="max_username_length">Max. Gebruikersnaam Lengte</Label>
                      <Input
                        id="max_username_length"
                        type="number"
                        value={settings.max_username_length}
                        onChange={(e) => updateSetting('max_username_length', parseInt(e.target.value))}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'content' && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Content Instellingen</h3>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="max_topic_title_length">Max. Topic Titel Lengte</Label>
                      <Input
                        id="max_topic_title_length"
                        type="number"
                        value={settings.max_topic_title_length}
                        onChange={(e) => updateSetting('max_topic_title_length', parseInt(e.target.value))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="max_post_length">Max. Post Lengte</Label>
                      <Input
                        id="max_post_length"
                        type="number"
                        value={settings.max_post_length}
                        onChange={(e) => updateSetting('max_post_length', parseInt(e.target.value))}
                      />
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="allow_html_posts">HTML in Posts Toestaan</Label>
                      <p className="text-sm text-muted-foreground">Gebruikers kunnen HTML gebruiken in posts</p>
                    </div>
                    <Switch
                      id="allow_html_posts"
                      checked={settings.allow_html_posts}
                      onCheckedChange={(checked) => updateSetting('allow_html_posts', checked)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="auto_link_urls">URLs Automatisch Linken</Label>
                      <p className="text-sm text-muted-foreground">URLs automatisch omzetten naar links</p>
                    </div>
                    <Switch
                      id="auto_link_urls"
                      checked={settings.auto_link_urls}
                      onCheckedChange={(checked) => updateSetting('auto_link_urls', checked)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="require_post_approval">Post Goedkeuring Vereist</Label>
                      <p className="text-sm text-muted-foreground">Posts moeten goedgekeurd worden voor publicatie</p>
                    </div>
                    <Switch
                      id="require_post_approval"
                      checked={settings.require_post_approval}
                      onCheckedChange={(checked) => updateSetting('require_post_approval', checked)}
                    />
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'moderation' && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Moderatie Instellingen</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="spam_protection_enabled">Spam Bescherming</Label>
                      <p className="text-sm text-muted-foreground">Automatische spam detectie inschakelen</p>
                    </div>
                    <Switch
                      id="spam_protection_enabled"
                      checked={settings.spam_protection_enabled}
                      onCheckedChange={(checked) => updateSetting('spam_protection_enabled', checked)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="rate_limit_posts">Rate Limiting</Label>
                      <p className="text-sm text-muted-foreground">Beperkt aantal posts per uur</p>
                    </div>
                    <Switch
                      id="rate_limit_posts"
                      checked={settings.rate_limit_posts}
                      onCheckedChange={(checked) => updateSetting('rate_limit_posts', checked)}
                    />
                  </div>
                  {settings.rate_limit_posts && (
                    <div>
                      <Label htmlFor="posts_per_hour_limit">Posts per Uur Limiet</Label>
                      <Input
                        id="posts_per_hour_limit"
                        type="number"
                        value={settings.posts_per_hour_limit}
                        onChange={(e) => updateSetting('posts_per_hour_limit', parseInt(e.target.value))}
                      />
                    </div>
                  )}
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="auto_flag_suspicious_content">Auto Markeren Verdachte Content</Label>
                      <p className="text-sm text-muted-foreground">Verdachte content automatisch markeren voor moderatie</p>
                    </div>
                    <Switch
                      id="auto_flag_suspicious_content"
                      checked={settings.auto_flag_suspicious_content}
                      onCheckedChange={(checked) => updateSetting('auto_flag_suspicious_content', checked)}
                    />
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'notifications' && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Notificatie Instellingen</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="email_notifications_enabled">Email Notificaties</Label>
                      <p className="text-sm text-muted-foreground">Email notificaties inschakelen</p>
                    </div>
                    <Switch
                      id="email_notifications_enabled"
                      checked={settings.email_notifications_enabled}
                      onCheckedChange={(checked) => updateSetting('email_notifications_enabled', checked)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="push_notifications_enabled">Push Notificaties</Label>
                      <p className="text-sm text-muted-foreground">Browser push notificaties inschakelen</p>
                    </div>
                    <Switch
                      id="push_notifications_enabled"
                      checked={settings.push_notifications_enabled}
                      onCheckedChange={(checked) => updateSetting('push_notifications_enabled', checked)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="digest_email_frequency">Digest Email Frequentie</Label>
                    <Select 
                      value={settings.digest_email_frequency} 
                      onValueChange={(value) => updateSetting('digest_email_frequency', value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="daily">Dagelijks</SelectItem>
                        <SelectItem value="weekly">Wekelijks</SelectItem>
                        <SelectItem value="monthly">Maandelijks</SelectItem>
                        <SelectItem value="never">Nooit</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'theme' && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Thema Instellingen</h3>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="primary_color">Primaire Kleur</Label>
                      <Input
                        id="primary_color"
                        type="color"
                        value={settings.primary_color}
                        onChange={(e) => updateSetting('primary_color', e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="secondary_color">Secundaire Kleur</Label>
                      <Input
                        id="secondary_color"
                        type="color"
                        value={settings.secondary_color}
                        onChange={(e) => updateSetting('secondary_color', e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="dark_mode_enabled">Dark Mode Ondersteuning</Label>
                      <p className="text-sm text-muted-foreground">Donkere modus optie voor gebruikers</p>
                    </div>
                    <Switch
                      id="dark_mode_enabled"
                      checked={settings.dark_mode_enabled}
                      onCheckedChange={(checked) => updateSetting('dark_mode_enabled', checked)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="custom_css">Custom CSS</Label>
                    <Textarea
                      id="custom_css"
                      value={settings.custom_css}
                      onChange={(e) => updateSetting('custom_css', e.target.value)}
                      placeholder="/* Custom CSS regels */"
                      rows={6}
                    />
                  </div>
                </div>
              </div>
            )}

            <div className="flex justify-end pt-6">
              <Button onClick={handleSave}>
                Instellingen Opslaan
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}