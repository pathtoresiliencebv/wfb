import { Button } from '@/components/ui/button';
import { PostCard } from '@/components/feed/PostCard';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Skeleton } from '@/components/ui/skeleton';
import { motion } from 'framer-motion';
import { useEffect } from 'react';

export function RecentPosts() {
  const { data: recentTopics = [], isLoading } = useQuery({
    queryKey: ['recentTopics'],
    queryFn: async () => {
      const { data: topics, error } = await supabase
        .from('topics')
        .select(`
          *,
          profiles!topics_author_id_fkey(username, avatar_url, is_verified),
          categories(name)
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
        createdAt: new Date(topic.created_at),
        votes: 0,
        replyCount: topic.reply_count || 0,
        isSticky: topic.is_pinned || false,
      })) || [];
    },
    staleTime: 60000, // 1 minute
  });

  // Calculate masonry grid row spans based on card heights
  useEffect(() => {
    const updateRowSpans = () => {
      const items = document.querySelectorAll('.masonry-item');
      items.forEach(item => {
        const height = item.getBoundingClientRect().height;
        const rowSpan = Math.ceil(height / 8); // 8px = grid-auto-rows
        (item as HTMLElement).style.setProperty('--row-span', String(rowSpan));
      });
    };

    if (!isLoading && recentTopics.length > 0) {
      // Small delay to ensure DOM is ready
      setTimeout(updateRowSpans, 100);
      window.addEventListener('resize', updateRowSpans);
      return () => window.removeEventListener('resize', updateRowSpans);
    }
  }, [recentTopics, isLoading]);

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
      
      {/* Masonry Grid Layout */}
      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="p-4 border rounded-lg space-y-3">
              <Skeleton className="h-5 w-3/4" />
              <Skeleton className="h-4 w-full" />
              <div className="flex items-center space-x-2">
                <Skeleton className="h-6 w-6 rounded-full" />
                <Skeleton className="h-4 w-24" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="masonry-grid">
          {recentTopics.map((post, index) => (
            <motion.div
              key={post.id}
              className="masonry-item"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ 
                duration: 0.4,
                delay: index * 0.1,
                ease: "easeOut"
              }}
            >
              <PostCard post={post} />
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}