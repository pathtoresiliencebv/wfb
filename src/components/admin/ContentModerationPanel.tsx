import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Eye, Flag, Trash2, Check, X, MessageSquare, FileText } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface ReportedContent {
  id: string;
  reported_item_id: string;
  reported_item_type: 'topic' | 'reply';
  reason: string;
  description: string;
  status: 'pending' | 'resolved' | 'dismissed';
  created_at: string;
  reporter: {
    username: string;
  };
  content: {
    title?: string;
    content: string;
    author: {
      username: string;
    };
  };
}

export function ContentModerationPanel() {
  const [reports, setReports] = useState<ReportedContent[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const { data, error } = await supabase
        .from('reports')
        .select(`
          id,
          reported_item_id,
          reported_item_type,
          reason,
          description,
          status,
          created_at,
          reporter:profiles!reports_reporter_id_fkey (
            username
          )
        `)
        .eq('status', 'pending')
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Fetch additional content details
      const reportsWithContent = await Promise.all(
        (data || []).map(async (report) => {
          let content = null;
          
          if (report.reported_item_type === 'topic') {
            const { data: topicData } = await supabase
              .from('topics')
              .select(`
                title,
                content,
                profiles (username)
              `)
              .eq('id', report.reported_item_id)
              .single();
            
            content = {
              title: topicData?.title,
              content: topicData?.content,
              author: { username: topicData?.profiles?.username }
            };
          } else if (report.reported_item_type === 'reply') {
            const { data: replyData } = await supabase
              .from('replies')
              .select(`
                content,
                profiles (username)
              `)
              .eq('id', report.reported_item_id)
              .single();
            
            content = {
              content: replyData?.content,
              author: { username: replyData?.profiles?.username }
            };
          }

          return {
            id: report.id,
            reported_item_id: report.reported_item_id,
            reported_item_type: report.reported_item_type as 'topic' | 'reply',
            reason: report.reason,
            description: report.description,
            status: report.status as 'pending' | 'resolved' | 'dismissed',
            created_at: report.created_at,
            reporter: { username: (report.reporter as any)?.username || 'Unknown' },
            content: content || { content: 'Content not found', author: { username: 'Unknown' } }
          };
        })
      );

      setReports(reportsWithContent);
    } catch (error) {
      console.error('Error fetching reports:', error);
      toast({
        title: 'Fout bij laden',
        description: 'Kon rapporten niet laden.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleReportAction = async (reportId: string, action: 'resolve' | 'dismiss', deleteContent = false) => {
    try {
      const { error } = await supabase
        .from('reports')
        .update({
          status: action === 'resolve' ? 'resolved' : 'dismissed',
          resolved_by: user?.id,
          resolved_at: new Date().toISOString()
        })
        .eq('id', reportId);

      if (error) throw error;

      if (deleteContent && action === 'resolve') {
        const report = reports.find(r => r.id === reportId);
        if (report) {
          if (report.reported_item_type === 'topic') {
            await supabase
              .from('topics')
              .delete()
              .eq('id', report.reported_item_id);
          } else if (report.reported_item_type === 'reply') {
            await supabase
              .from('replies')
              .delete()
              .eq('id', report.reported_item_id);
          }
        }
      }

      toast({
        title: 'Actie voltooid',
        description: `Rapport ${action === 'resolve' ? 'opgelost' : 'afgewezen'}.`,
      });

      fetchReports();
    } catch (error) {
      console.error('Error handling report:', error);
      toast({
        title: 'Fout',
        description: 'Kon actie niet uitvoeren.',
        variant: 'destructive',
      });
    }
  };

  const getReasonBadgeColor = (reason: string) => {
    switch (reason) {
      case 'spam': return 'bg-yellow-500';
      case 'harassment': return 'bg-red-500';
      case 'inappropriate': return 'bg-orange-500';
      case 'misinformation': return 'bg-purple-500';
      default: return 'bg-gray-500';
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-24 bg-muted rounded" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Flag className="h-5 w-5" />
          Content Moderatie
        </CardTitle>
        <CardDescription>
          Beheer gerapporteerde content en modereer de community
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="reports" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="reports">
              Rapporten ({reports.length})
            </TabsTrigger>
            <TabsTrigger value="stats">
              Statistieken
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="reports" className="space-y-4">
            {reports.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Flag className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Geen openstaande rapporten</p>
              </div>
            ) : (
              reports.map(report => (
                <Card key={report.id} className="border-l-4 border-l-yellow-500">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          {report.reported_item_type === 'topic' ? (
                            <FileText className="h-4 w-4" />
                          ) : (
                            <MessageSquare className="h-4 w-4" />
                          )}
                          <span className="font-medium">
                            {report.reported_item_type === 'topic' ? 'Topic' : 'Reactie'} gerapporteerd
                          </span>
                          <Badge 
                            className={`${getReasonBadgeColor(report.reason)} text-white`}
                          >
                            {report.reason}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Door {report.reporter?.username} • {new Date(report.created_at).toLocaleDateString('nl-BE')}
                        </p>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    {report.description && (
                      <div>
                        <p className="text-sm font-medium mb-1">Reden:</p>
                        <p className="text-sm text-muted-foreground">{report.description}</p>
                      </div>
                    )}
                    
                    <div className="border rounded-lg p-3 bg-muted/50">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-sm font-medium">
                          {report.content?.author?.username}
                        </span>
                        {report.content?.title && (
                          <>
                            <span className="text-muted-foreground">•</span>
                            <span className="text-sm font-medium">{report.content.title}</span>
                          </>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-3">
                        {report.content?.content}
                      </p>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleReportAction(report.id, 'dismiss')}
                      >
                        <X className="h-4 w-4 mr-1" />
                        Afwijzen
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleReportAction(report.id, 'resolve')}
                      >
                        <Check className="h-4 w-4 mr-1" />
                        Oplossen
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleReportAction(report.id, 'resolve', true)}
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        Verwijderen
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>
          
          <TabsContent value="stats">
            <div className="text-center py-8 text-muted-foreground">
              <p>Moderatie statistieken komen binnenkort beschikbaar</p>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}