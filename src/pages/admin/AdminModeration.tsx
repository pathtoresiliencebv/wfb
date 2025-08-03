import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { 
  Flag, Shield, MessageSquare, User, Calendar, Clock, 
  CheckCircle, XCircle, AlertTriangle, Eye, Trash2, Ban
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

interface Report {
  id: string;
  reporter_id: string;
  reported_item_id: string;
  reported_item_type: string;
  reason: string;
  description: string | null;
  status: string;
  created_at: string;
  resolved_at: string | null;
  resolved_by: string | null;
}

interface Topic {
  id: string;
  title: string;
  content: string;
  author_id: string;
  created_at: string;
  is_locked: boolean;
  profiles: {
    username: string;
    display_name: string | null;
  };
}

interface Reply {
  id: string;
  content: string;
  author_id: string;
  topic_id: string;
  created_at: string;
  profiles: {
    username: string;
    display_name: string | null;
  };
}

export default function AdminModeration() {
  const [statusFilter, setStatusFilter] = useState<string>('pending');
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [selectedContent, setSelectedContent] = useState<Topic | Reply | null>(null);
  const queryClient = useQueryClient();

  // Fetch reports
  const { data: reports, isLoading } = useQuery({
    queryKey: ['admin-reports', statusFilter],
    queryFn: async () => {
      let query = supabase
        .from('reports')
        .select('*')
        .order('created_at', { ascending: false });

      if (statusFilter !== 'all') {
        query = query.eq('status', statusFilter);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as Report[];
    }
  });

  // Fetch reported content details
  const fetchContentDetails = async (report: Report) => {
    if (report.reported_item_type === 'topic') {
      const { data, error } = await supabase
        .from('topics')
        .select(`
          *,
          profiles!topics_author_id_fkey(username, display_name)
        `)
        .eq('id', report.reported_item_id)
        .single();
      
      if (error) throw error;
      return data as Topic;
    } else if (report.reported_item_type === 'reply') {
      const { data, error } = await supabase
        .from('replies')
        .select(`
          *,
          profiles!replies_author_id_fkey(username, display_name)
        `)
        .eq('id', report.reported_item_id)
        .single();
      
      if (error) throw error;
      return data as Reply;
    }
    return null;
  };

  // Resolve report mutation
  const resolveReportMutation = useMutation({
    mutationFn: async ({ reportId, action }: { reportId: string; action: 'approved' | 'rejected' }) => {
      const { data: user } = await supabase.auth.getUser();
      
      const { error } = await supabase
        .from('reports')
        .update({ 
          status: action,
          resolved_at: new Date().toISOString(),
          resolved_by: user.user?.id
        })
        .eq('id', reportId);
      
      if (error) throw error;
    },
    onSuccess: (_, { action }) => {
      queryClient.invalidateQueries({ queryKey: ['admin-reports'] });
      queryClient.invalidateQueries({ queryKey: ['admin-pending-reports'] });
      toast.success(`Melding ${action === 'approved' ? 'goedgekeurd' : 'afgewezen'}`);
    },
    onError: (error) => {
      toast.error('Fout bij verwerken melding');
      console.error('Error resolving report:', error);
    }
  });

  // Delete content mutation
  const deleteContentMutation = useMutation({
    mutationFn: async ({ report }: { report: Report }) => {
      if (report.reported_item_type === 'topic') {
        const { error } = await supabase
          .from('topics')
          .delete()
          .eq('id', report.reported_item_id);
        if (error) throw error;
      } else if (report.reported_item_type === 'reply') {
        const { error } = await supabase
          .from('replies')
          .delete()
          .eq('id', report.reported_item_id);
        if (error) throw error;
      }
      
      // Also resolve the report
      await resolveReportMutation.mutateAsync({ reportId: report.id, action: 'approved' });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-reports'] });
      toast.success('Content verwijderd en melding opgelost');
    },
    onError: (error) => {
      toast.error('Fout bij verwijderen content');
      console.error('Error deleting content:', error);
    }
  });

  // Lock topic mutation
  const lockTopicMutation = useMutation({
    mutationFn: async ({ topicId }: { topicId: string }) => {
      const { error } = await supabase
        .from('topics')
        .update({ is_locked: true })
        .eq('id', topicId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-reports'] });
      toast.success('Topic vergrendeld');
    },
    onError: (error) => {
      toast.error('Fout bij vergrendelen topic');
      console.error('Error locking topic:', error);
    }
  });

  const getReasonIcon = (reason: string) => {
    const icons: Record<string, React.ComponentType<any>> = {
      'spam': AlertTriangle,
      'inappropriate': XCircle,
      'harassment': Flag,
      'illegal': Shield,
      'other': Flag
    };
    const IconComponent = icons[reason] || Flag;
    return <IconComponent className="h-4 w-4" />;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'approved': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'rejected': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const formatReason = (reason: string) => {
    const reasons: Record<string, string> = {
      'spam': 'Spam',
      'inappropriate': 'Ongepast',
      'harassment': 'Intimidatie',
      'illegal': 'Illegaal',
      'other': 'Anders'
    };
    return reasons[reason] || reason;
  };

  const handleViewContent = async (report: Report) => {
    try {
      const content = await fetchContentDetails(report);
      setSelectedContent(content);
      setSelectedReport(report);
    } catch (error) {
      toast.error('Fout bij ophalen content details');
      console.error('Error fetching content:', error);
    }
  };

  const filteredReports = reports || [];
  const pendingReports = filteredReports.filter(r => r.status === 'pending');
  const approvedReports = filteredReports.filter(r => r.status === 'approved');
  const rejectedReports = filteredReports.filter(r => r.status === 'rejected');

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Content Moderatie</h1>
          <p className="text-muted-foreground">Beheer gemelde content en modereer discussies</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="px-3 py-1">
            {filteredReports.length} meldingen
          </Badge>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Openstaand</CardTitle>
            <Clock className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingReports.length}</div>
            <p className="text-xs text-muted-foreground">Wacht op review</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Goedgekeurd</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{approvedReports.length}</div>
            <p className="text-xs text-muted-foreground">Actie ondernomen</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Afgewezen</CardTitle>
            <XCircle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{rejectedReports.length}</div>
            <p className="text-xs text-muted-foreground">Geen actie vereist</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Totaal</CardTitle>
            <Flag className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{filteredReports.length}</div>
            <p className="text-xs text-muted-foreground">Alle meldingen</p>
          </CardContent>
        </Card>
      </div>

      {/* Filter Controls */}
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="w-48">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Alle Statussen</SelectItem>
                  <SelectItem value="pending">Openstaand</SelectItem>
                  <SelectItem value="approved">Goedgekeurd</SelectItem>
                  <SelectItem value="rejected">Afgewezen</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Reports List */}
      <Card>
        <CardHeader>
          <CardTitle>Meldingen Overzicht</CardTitle>
          <CardDescription>Review en verwerk gemelde content</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-32 w-full" />
              ))}
            </div>
          ) : filteredReports.length > 0 ? (
            <div className="space-y-4">
              {filteredReports.map((report) => (
                <Card key={report.id} className="border-l-4 border-l-yellow-500">
                  <CardContent className="pt-6">
                    <div className="flex justify-between items-start">
                      <div className="space-y-3">
                        <div className="flex items-center gap-3">
                          <Badge variant="outline" className="flex items-center gap-1">
                            {getReasonIcon(report.reason)}
                            {formatReason(report.reason)}
                          </Badge>
                          <Badge className={getStatusColor(report.status)}>
                            {report.status === 'pending' && 'Openstaand'}
                            {report.status === 'approved' && 'Goedgekeurd'}
                            {report.status === 'rejected' && 'Afgewezen'}
                          </Badge>
                          <Badge variant="secondary">
                            {report.reported_item_type === 'topic' && 'Topic'}
                            {report.reported_item_type === 'reply' && 'Reactie'}
                            {report.reported_item_type === 'user' && 'Gebruiker'}
                          </Badge>
                        </div>

                        <div>
                          <h4 className="font-medium mb-1">Beschrijving</h4>
                          <p className="text-sm text-muted-foreground">
                            {report.description || 'Geen beschrijving opgegeven'}
                          </p>
                        </div>

                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            Gemeld op {new Date(report.created_at).toLocaleDateString()}
                          </div>
                          {report.resolved_at && (
                            <div className="flex items-center gap-1">
                              <CheckCircle className="h-3 w-3" />
                              Opgelost op {new Date(report.resolved_at).toLocaleDateString()}
                            </div>
                          )}
                        </div>
                      </div>

                      {report.status === 'pending' && (
                        <div className="flex gap-2">
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleViewContent(report)}
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            Bekijken
                          </Button>

                          {report.reported_item_type === 'topic' && (
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button size="sm" variant="outline">
                                  <Ban className="h-4 w-4 mr-1" />
                                  Vergrendelen
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Topic Vergrendelen</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Het topic zal worden vergrendeld en geen nieuwe reacties zijn toegestaan.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Annuleren</AlertDialogCancel>
                                  <AlertDialogAction 
                                    onClick={() => {
                                      lockTopicMutation.mutate({ topicId: report.reported_item_id });
                                      resolveReportMutation.mutate({ reportId: report.id, action: 'approved' });
                                    }}
                                  >
                                    Vergrendelen
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          )}

                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button size="sm" variant="destructive">
                                <Trash2 className="h-4 w-4 mr-1" />
                                Verwijderen
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Content Verwijderen</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Deze actie kan niet ongedaan worden gemaakt. Het content wordt permanent verwijderd.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Annuleren</AlertDialogCancel>
                                <AlertDialogAction 
                                  onClick={() => deleteContentMutation.mutate({ report })}
                                  disabled={deleteContentMutation.isPending}
                                >
                                  Verwijderen
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>

                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button size="sm" variant="outline">
                                <XCircle className="h-4 w-4 mr-1" />
                                Afwijzen
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Melding Afwijzen</AlertDialogTitle>
                                <AlertDialogDescription>
                                  De melding wordt afgewezen en geen verdere actie wordt ondernomen.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Annuleren</AlertDialogCancel>
                                <AlertDialogAction 
                                  onClick={() => resolveReportMutation.mutate({ 
                                    reportId: report.id, 
                                    action: 'rejected' 
                                  })}
                                  disabled={resolveReportMutation.isPending}
                                >
                                  Afwijzen
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Flag className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">Geen meldingen gevonden</h3>
              <p className="text-muted-foreground">
                {statusFilter === 'pending' 
                  ? 'Er zijn momenteel geen openstaande meldingen.'
                  : 'Geen meldingen voor de geselecteerde filter.'
                }
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Content Preview Modal */}
      {selectedContent && selectedReport && (
        <AlertDialog open={!!selectedContent} onOpenChange={() => {
          setSelectedContent(null);
          setSelectedReport(null);
        }}>
          <AlertDialogContent className="max-w-2xl">
            <AlertDialogHeader>
              <AlertDialogTitle>
                Gemelde Content - {selectedReport.reported_item_type === 'topic' ? 'Topic' : 'Reactie'}
              </AlertDialogTitle>
              <AlertDialogDescription asChild>
                <div className="space-y-4">
                  {'title' in selectedContent && (
                    <div>
                      <h4 className="font-medium mb-1">Titel:</h4>
                      <p className="text-sm">{selectedContent.title}</p>
                    </div>
                  )}
                  <div>
                    <h4 className="font-medium mb-1">Content:</h4>
                    <div className="bg-muted p-3 rounded-md text-sm max-h-48 overflow-y-auto">
                      {selectedContent.content}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium mb-1">Auteur:</h4>
                    <p className="text-sm">
                      {selectedContent.profiles.display_name || selectedContent.profiles.username}
                    </p>
                  </div>
                </div>
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Sluiten</AlertDialogCancel>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </div>
  );
}