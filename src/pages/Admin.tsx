import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import SecurityDashboard from '@/components/settings/SecurityDashboard';
import { ContentModerationPanel } from '@/components/admin/ContentModerationPanel';
import { AdminImageManager } from '@/components/admin/AdminImageManager';
import { Users, Shield, Flag, BarChart3, ImageIcon } from 'lucide-react';

export default function Admin() {
  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      <div className="flex items-center gap-3">
        <Shield className="h-8 w-8 text-primary" />
        <div>
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground">Beheer gebruikers, content en beveiliging</p>
        </div>
      </div>

      <Tabs defaultValue="moderation" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="moderation" className="flex items-center gap-2">
            <Flag className="h-4 w-4" />
            Moderatie
          </TabsTrigger>
          <TabsTrigger value="users" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Gebruikers
          </TabsTrigger>
          <TabsTrigger value="images" className="flex items-center gap-2">
            <ImageIcon className="h-4 w-4" />
            Afbeeldingen
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Beveiliging
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Analytics
          </TabsTrigger>
        </TabsList>

        <TabsContent value="moderation" className="space-y-4">
          <ContentModerationPanel />
        </TabsContent>

        <TabsContent value="users" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Gebruikers Beheer</CardTitle>
              <CardDescription>Beheer gebruikersaccounts en rollen</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Gebruikersbeheer komt binnenkort beschikbaar</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="images" className="space-y-4">
          <AdminImageManager />
        </TabsContent>

        <TabsContent value="security" className="space-y-4">
          <SecurityDashboard />
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Platform Analytics</CardTitle>
              <CardDescription>Statistieken en gebruiksgegevens</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Analytics dashboard komt binnenkort beschikbaar</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}