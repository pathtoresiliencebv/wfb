import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { usePWA } from '@/hooks/usePWA';
import { 
  Bell, 
  Download, 
  RefreshCw, 
  Wifi, 
  WifiOff, 
  Smartphone,
  Settings,
  Clock,
  CheckCircle
} from 'lucide-react';

export function PWASettings() {
  const {
    pwaSettings,
    isInstallable,
    isInstalled,
    isOnline,
    isSupported,
    installApp,
    enablePushNotifications,
    disablePushNotifications,
    syncData,
    updateSettings,
    isUpdating,
  } = usePWA();

  const handlePushToggle = async (enabled: boolean) => {
    if (enabled) {
      await enablePushNotifications();
    } else {
      await disablePushNotifications();
    }
  };

  const handleSyncFrequencyChange = (frequency: string) => {
    updateSettings({ sync_frequency: frequency as 'realtime' | 'hourly' | 'daily' });
  };

  const handleOfflineToggle = (enabled: boolean) => {
    updateSettings({ offline_reading_enabled: enabled });
  };

  return (
    <div className="space-y-6">
      {/* Connection Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            {isOnline ? <Wifi className="w-5 h-5 text-green-600" /> : <WifiOff className="w-5 h-5 text-red-600" />}
            <span>Verbindingsstatus</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <Badge variant={isOnline ? "default" : "destructive"}>
                {isOnline ? 'Online' : 'Offline'}
              </Badge>
              <p className="text-sm text-muted-foreground mt-1">
                {isOnline 
                  ? 'Je bent verbonden met het internet'
                  : 'Offline modus - sommige functies zijn beperkt'
                }
              </p>
            </div>
            <Button variant="outline" onClick={syncData} disabled={!isOnline || isUpdating}>
              <RefreshCw className="w-4 h-4 mr-2" />
              Sync Nu
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* App Installation */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Smartphone className="w-5 h-5" />
            <span>App Installatie</span>
          </CardTitle>
          <CardDescription>
            Installeer WietForum als app voor een betere ervaring
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              {isInstalled ? (
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span className="font-medium">App is geïnstalleerd</span>
                </div>
              ) : isInstallable ? (
                <span>App kan worden geïnstalleerd</span>
              ) : (
                <span className="text-muted-foreground">
                  Installatie niet beschikbaar in deze browser
                </span>
              )}
            </div>
            
            {!isInstalled && isInstallable && (
              <Button onClick={installApp}>
                <Download className="w-4 h-4 mr-2" />
                Installeer App
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Push Notifications */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Bell className="w-5 h-5" />
            <span>Push Notificaties</span>
          </CardTitle>
          <CardDescription>
            Ontvang meldingen voor nieuwe berichten en activiteit
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Push notificaties inschakelen</p>
              <p className="text-sm text-muted-foreground">
                {isSupported.pushNotifications 
                  ? 'Krijg direct bericht van nieuwe activiteit'
                  : 'Niet ondersteund in deze browser'
                }
              </p>
            </div>
            <Switch
              checked={pwaSettings?.push_notifications_enabled || false}
              onCheckedChange={handlePushToggle}
              disabled={!isSupported.pushNotifications || isUpdating}
            />
          </div>
        </CardContent>
      </Card>

      {/* Offline Reading */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <WifiOff className="w-5 h-5" />
            <span>Offline Lezen</span>
          </CardTitle>
          <CardDescription>
            Sla content op voor offline toegang
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Offline modus inschakelen</p>
              <p className="text-sm text-muted-foreground">
                {isSupported.offline
                  ? 'Recente content wordt opgeslagen voor offline gebruik'
                  : 'Niet ondersteund in deze browser'
                }
              </p>
            </div>
            <Switch
              checked={pwaSettings?.offline_reading_enabled ?? true}
              onCheckedChange={handleOfflineToggle}
              disabled={!isSupported.offline || isUpdating}
            />
          </div>
        </CardContent>
      </Card>

      {/* Sync Frequency */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Clock className="w-5 h-5" />
            <span>Synchronisatie</span>
          </CardTitle>
          <CardDescription>
            Hoe vaak moet je data worden bijgewerkt?
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Sync frequentie</p>
              <p className="text-sm text-muted-foreground">
                Bepaalt hoe vaak nieuwe content wordt opgehaald
              </p>
            </div>
            <Select
              value={pwaSettings?.sync_frequency || 'hourly'}
              onValueChange={handleSyncFrequencyChange}
              disabled={isUpdating}
            >
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="realtime">Real-time</SelectItem>
                <SelectItem value="hourly">Elk uur</SelectItem>
                <SelectItem value="daily">Dagelijks</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {pwaSettings?.last_sync_at && (
            <div className="mt-3 pt-3 border-t">
              <p className="text-xs text-muted-foreground">
                Laatst gesynchroniseerd: {new Date(pwaSettings.last_sync_at).toLocaleString('nl-NL')}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Support Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Settings className="w-5 h-5" />
            <span>Browser Ondersteuning</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm">
            <div className="flex items-center justify-between">
              <span>App Installatie</span>
              <Badge variant={isSupported.install ? "default" : "secondary"}>
                {isSupported.install ? 'Ondersteund' : 'Niet ondersteund'}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span>Push Notificaties</span>
              <Badge variant={isSupported.pushNotifications ? "default" : "secondary"}>
                {isSupported.pushNotifications ? 'Ondersteund' : 'Niet ondersteund'}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span>Offline Functionaliteit</span>
              <Badge variant={isSupported.offline ? "default" : "secondary"}>
                {isSupported.offline ? 'Ondersteund' : 'Niet ondersteund'}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}