import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MessageSquare, TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function PresentationTab() {
  const navigate = useNavigate();

  const { data: recentTopics = [] } = useQuery({
    queryKey: ['presentation-recent'],
    queryFn: async () => {
      const { data } = await supabase
        .from('topics')
        .select('id, title, reply_count, view_count, created_at')
        .order('created_at', { ascending: false })
        .limit(5);
      return data || [];
    },
  });

  const { data: popularTopics = [] } = useQuery({
    queryKey: ['presentation-popular'],
    queryFn: async () => {
      const { data } = await supabase
        .from('topics')
        .select('id, title, reply_count, view_count, created_at')
        .order('view_count', { ascending: false })
        .limit(5);
      return data || [];
    },
  });

  const TopicItem = ({ topic }: any) => (
    <div
      className="p-2 rounded-md hover:bg-accent cursor-pointer transition-colors"
      onClick={() => navigate(`/topic/${topic.id}`)}
    >
      <p className="text-sm font-medium truncate mb-1">{topic.title}</p>
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <div className="flex items-center gap-1">
          <MessageSquare className="h-3 w-3" />
          <span>{topic.reply_count || 0}</span>
        </div>
        <div className="flex items-center gap-1">
          <TrendingUp className="h-3 w-3" />
          <span>{topic.view_count || 0}</span>
        </div>
      </div>
    </div>
  );

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">Presentatie</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="recent" className="w-full">
          <TabsList className="w-full grid grid-cols-2">
            <TabsTrigger value="recent" className="text-xs">Recent</TabsTrigger>
            <TabsTrigger value="populair" className="text-xs">Populair</TabsTrigger>
          </TabsList>
          
          <TabsContent value="recent" className="mt-3 space-y-2">
            {recentTopics.length > 0 ? (
              recentTopics.map(topic => <TopicItem key={topic.id} topic={topic} />)
            ) : (
              <p className="text-xs text-muted-foreground text-center py-4">
                Geen recente topics
              </p>
            )}
          </TabsContent>
          
          <TabsContent value="populair" className="mt-3 space-y-2">
            {popularTopics.length > 0 ? (
              popularTopics.map(topic => <TopicItem key={topic.id} topic={topic} />)
            ) : (
              <p className="text-xs text-muted-foreground text-center py-4">
                Geen populaire topics
              </p>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
