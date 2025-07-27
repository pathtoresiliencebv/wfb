import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Shield, Smartphone, AlertTriangle, Clock, MapPin, Monitor } from 'lucide-react';
import { useUserSecurity } from '@/hooks/useUserSecurity';
import { format } from 'date-fns';
import { nl } from 'date-fns/locale';

export const SecuritySection = () => {
  const {
    securityEvents,
    userSessions,
    privacySettings,
    twoFactorAuth,
    isLoading,
    updatePrivacySettings,
    terminateSession,
  } = useUserSecurity();

  const [showAllEvents, setShowAllEvents] = useState(false);

  const getRiskLevelColor = (level: string) => {
    switch (level) {
      case 'high': return 'destructive';
      case 'medium': return 'secondary';
      default: return 'default';
    }
  };

  const getEventIcon = (eventType: string) => {
    switch (eventType) {
      case 'login': return <Shield className="h-4 w-4" />;
      case 'password_change': return <AlertTriangle className="h-4 w-4" />;
      case 'settings_change': return <Monitor className="h-4 w-4" />;
      default: return <AlertTriangle className="h-4 w-4" />;
    }
  };

  if (!privacySettings) {
    return <div>Laden...</div>;
  }

  const displayedEvents = showAllEvents ? securityEvents : securityEvents.slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Two-Factor Authentication */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Smartphone className="h-5 w-5" />
            Twee-factor authenticatie
          </CardTitle>
          <CardDescription>
            Voeg een extra beveiligingslaag toe aan je account
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label>2FA Status</Label>
              <p className="text-sm text-muted-foreground">
                {twoFactorAuth?.is_enabled ? 'Ingeschakeld' : 'Uitgeschakeld'}
              </p>
            </div>
            <Badge variant={twoFactorAuth?.is_enabled ? 'default' : 'secondary'}>
              {twoFactorAuth?.is_enabled ? 'Actief' : 'Inactief'}
            </Badge>
          </div>
          <Button 
            variant={twoFactorAuth?.is_enabled ? 'outline' : 'default'}
            disabled={isLoading}
          >
            {twoFactorAuth?.is_enabled ? '2FA beheren' : '2FA instellen'}
          </Button>
        </CardContent>
      </Card>

      {/* Active Sessions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Monitor className="h-5 w-5" />
            Actieve sessies
          </CardTitle>
          <CardDescription>
            Beheer je actieve inlogsessies
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {userSessions.length === 0 ? (
            <p className="text-muted-foreground">Geen actieve sessies gevonden</p>
          ) : (
            userSessions.map((session) => (
              <div key={session.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Monitor className="h-4 w-4" />
                    <span className="font-medium">
                      {session.device_info?.browser || 'Onbekend apparaat'}
                    </span>
                  </div>
                  <div className="text-sm text-muted-foreground flex items-center gap-4">
                    {session.ip_address && (
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {String(session.ip_address)}
                      </span>
                    )}
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {format(new Date(session.last_activity_at), 'dd MMM yyyy HH:mm', { locale: nl })}
                    </span>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => terminateSession(session.id)}
                  disabled={isLoading}
                >
                  Beëindigen
                </Button>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      {/* Privacy Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Privacy instellingen</CardTitle>
          <CardDescription>
            Beheer je privacy voorkeuren
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Email notificaties</Label>
              <p className="text-sm text-muted-foreground">
                Ontvang email updates over account activiteit
              </p>
            </div>
            <Switch
              checked={privacySettings.email_notifications}
              onCheckedChange={(checked) => 
                updatePrivacySettings({ email_notifications: checked })
              }
              disabled={isLoading}
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Activiteit tracking</Label>
              <p className="text-sm text-muted-foreground">
                Sta toe dat we je activiteit bijhouden voor betere ervaring
              </p>
            </div>
            <Switch
              checked={privacySettings.activity_tracking}
              onCheckedChange={(checked) => 
                updatePrivacySettings({ activity_tracking: checked })
              }
              disabled={isLoading}
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Beveiligingsalerts</Label>
              <p className="text-sm text-muted-foreground">
                Ontvang waarschuwingen over verdachte activiteit
              </p>
            </div>
            <Switch
              checked={privacySettings.security_alerts}
              onCheckedChange={(checked) => 
                updatePrivacySettings({ security_alerts: checked })
              }
              disabled={isLoading}
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Marketing emails</Label>
              <p className="text-sm text-muted-foreground">
                Ontvang updates over nieuwe functies en promoties
              </p>
            </div>
            <Switch
              checked={privacySettings.marketing_emails}
              onCheckedChange={(checked) => 
                updatePrivacySettings({ marketing_emails: checked })
              }
              disabled={isLoading}
            />
          </div>
        </CardContent>
      </Card>

      {/* Security Events */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Recente beveiligingsactiviteit
          </CardTitle>
          <CardDescription>
            Overzicht van recente beveiligingsgebeurtenissen
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {securityEvents.length === 0 ? (
            <p className="text-muted-foreground">Geen beveiligingsgebeurtenissen gevonden</p>
          ) : (
            <>
              {displayedEvents.map((event) => (
                <div key={event.id} className="flex items-start gap-3 p-3 border rounded-lg">
                  <div className="mt-1">
                    {getEventIcon(event.event_type)}
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{event.event_description}</span>
                      <Badge variant={getRiskLevelColor(event.risk_level)}>
                        {event.risk_level}
                      </Badge>
                    </div>
                    <div className="text-sm text-muted-foreground flex items-center gap-4">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {format(new Date(event.created_at), 'dd MMM yyyy HH:mm', { locale: nl })}
                      </span>
                      {event.ip_address && (
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {String(event.ip_address)}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              
              {securityEvents.length > 5 && (
                <Button 
                  variant="outline" 
                  onClick={() => setShowAllEvents(!showAllEvents)}
                  className="w-full"
                >
                  {showAllEvents ? 'Minder tonen' : `${securityEvents.length - 5} meer gebeurtenissen tonen`}
                </Button>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};