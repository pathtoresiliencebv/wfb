import { Button } from '@/components/ui/button';
import { PostCard } from '@/components/feed/PostCard';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Skeleton } from '@/components/ui/skeleton';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';

export function RecentPosts() {
  const isMobile = useIsMobile();
  const { data: recentTopics = [], isLoading } = useQuery({
    queryKey: ['recentTopics'],
    queryFn: async () => {
    const { data: topics, error } = await supabase
      .from('topics')
      .select(`
        *,
        profiles!topics_author_id_fkey(username, avatar_url, is_verified),
        categories(name, slug)
      `)
      .order('created_at', { ascending: false })
      .limit(5);

      if (error) throw error;

    return topics?.map(topic => ({
      id: topic.id,
      title: topic.title,
      content: topic.content,
      author: {
        username: topic.profiles?.username || 'Anonymous',
        avatar: topic.profiles?.avatar_url || null,
        isVerified: topic.profiles?.is_verified || false,
      },
      category: topic.categories?.name || 'General',
      categorySlug: topic.categories?.slug || '',
      createdAt: new Date(topic.created_at),
      votes: 0,
      replyCount: topic.reply_count || 0,
      isSticky: topic.is_pinned || false,
    })) || [];
    },
    staleTime: 60000, // 1 minute
  });


  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-heading text-xl font-semibold">Recente Activiteit</h2>
        <Button variant="outline" size="sm" asChild>
          <a href="/forums">
            Alle Topics
          </a>
        </Button>
      </div>
      
      <div className={cn(
          "gap-4",
          isMobile 
            ? "flex flex-col" 
            : "grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3"
        )}>
          {recentTopics.map((post, index) => (
            <div key={post.id}>
              <PostCard post={post} />
            </div>
          ))}
        </div>
    </div>
  );
}