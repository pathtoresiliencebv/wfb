import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { usePWA } from '@/hooks/usePWA';
import { Download, X, Smartphone } from 'lucide-react';

interface PWAInstallPromptProps {
  onDismiss?: () => void;
  compact?: boolean;
}

export function PWAInstallPrompt({ onDismiss, compact = false }: PWAInstallPromptProps) {
  const { isInstallable, isInstalled, installApp } = usePWA();

  if (!isInstallable || isInstalled) {
    return null;
  }

  const handleInstall = async () => {
    const success = await installApp();
    if (success && onDismiss) {
      onDismiss();
    }
  };

  if (compact) {
    return (
      <div className="fixed bottom-4 left-4 right-4 z-50 md:left-auto md:right-4 md:w-80">
        <Card className="border-2 border-primary/20 shadow-lg">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-primary/10 rounded-full">
                <Smartphone className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm">Installeer WietForum</p>
                <p className="text-xs text-muted-foreground">Voor een betere ervaring</p>
              </div>
              <div className="flex items-center space-x-1">
                <Button size="sm" onClick={handleInstall} className="h-8 px-3">
                  <Download className="w-3 h-3 mr-1" />
                  Install
                </Button>
                {onDismiss && (
                  <Button variant="ghost" size="sm" onClick={onDismiss} className="h-8 w-8 p-0">
                    <X className="w-3 h-3" />
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <Card className="border-2 border-primary/20">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-primary/10 rounded-full">
              <Smartphone className="w-5 h-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-lg">Installeer WietForum App</CardTitle>
              <CardDescription>
                Krijg snelle toegang en push notificaties
              </CardDescription>
            </div>
          </div>
          {onDismiss && (
            <Button variant="ghost" size="sm" onClick={onDismiss}>
              <X className="w-4 h-4" />
            </Button>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span>Offline lezen</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <span>Push notificaties</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
            <span>App-like ervaring</span>
          </div>
        </div>
        
        <div className="flex space-x-3">
          <Button onClick={handleInstall} className="flex-1">
            <Download className="w-4 h-4 mr-2" />
            Installeer Nu
          </Button>
          {onDismiss && (
            <Button variant="outline" onClick={onDismiss}>
              Later
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}