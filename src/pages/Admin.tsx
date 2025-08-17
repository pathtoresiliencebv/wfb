import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import SecurityDashboard from '@/components/settings/SecurityDashboard';
import { ContentModerationPanel } from '@/components/admin/ContentModerationPanel';
import { AdminImageManager } from '@/components/admin/AdminImageManager';
import { CategoryManagement } from '@/components/admin/CategoryManagement';
import { TopicManagement } from '@/components/admin/TopicManagement';
import { TagManagement } from '@/components/admin/TagManagement';
import { ForumSettings } from '@/components/admin/ForumSettings';
import { Users, Shield, Flag, BarChart3, ImageIcon, Folder, MessageSquare, Tag, Settings, Search } from 'lucide-react';
import { AdminUserManagement } from '@/components/admin/AdminUserManagement';
import { AdminAnalytics } from '@/components/admin/AdminAnalytics';
import { SEOSettings } from '@/components/admin/SEOSettings';

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
        <TabsList className="grid w-full grid-cols-10 overflow-x-auto">
          <TabsTrigger value="moderation" className="flex items-center gap-2">
            <Flag className="h-4 w-4" />
            Moderatie
          </TabsTrigger>
          <TabsTrigger value="users" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Gebruikers
          </TabsTrigger>
          <TabsTrigger value="categories" className="flex items-center gap-2">
            <Folder className="h-4 w-4" />
            Categorieën
          </TabsTrigger>
          <TabsTrigger value="topics" className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            Topics
          </TabsTrigger>
          <TabsTrigger value="tags" className="flex items-center gap-2">
            <Tag className="h-4 w-4" />
            Tags
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
          <TabsTrigger value="settings" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Instellingen
          </TabsTrigger>
          <TabsTrigger value="seo" className="flex items-center gap-2">
            <Search className="h-4 w-4" />
            SEO
          </TabsTrigger>
        </TabsList>

        <TabsContent value="moderation" className="space-y-4">
          <ContentModerationPanel />
        </TabsContent>

        <TabsContent value="users" className="space-y-4">
          <AdminUserManagement />
        </TabsContent>

        <TabsContent value="categories" className="space-y-4">
          <CategoryManagement />
        </TabsContent>

        <TabsContent value="topics" className="space-y-4">
          <TopicManagement />
        </TabsContent>

        <TabsContent value="tags" className="space-y-4">
          <TagManagement />
        </TabsContent>

        <TabsContent value="images" className="space-y-4">
          <AdminImageManager />
        </TabsContent>

        <TabsContent value="security" className="space-y-4">
          <SecurityDashboard />
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <AdminAnalytics />
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <ForumSettings />
        </TabsContent>

        <TabsContent value="seo" className="space-y-4">
          <SEOSettings />
        </TabsContent>
      </Tabs>
    </div>
  );
}