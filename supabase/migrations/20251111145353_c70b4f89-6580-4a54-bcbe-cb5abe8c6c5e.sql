-- Create indexes for better query performance
-- These indexes will significantly speed up common queries

-- Topics table indexes
CREATE INDEX IF NOT EXISTS idx_topics_created_at ON public.topics(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_topics_category_id ON public.topics(category_id);
CREATE INDEX IF NOT EXISTS idx_topics_author_id ON public.topics(author_id);
CREATE INDEX IF NOT EXISTS idx_topics_view_count ON public.topics(view_count DESC);
CREATE INDEX IF NOT EXISTS idx_topics_is_pinned ON public.topics(is_pinned) WHERE is_pinned = true;

-- Replies table indexes
CREATE INDEX IF NOT EXISTS idx_replies_topic_id ON public.replies(topic_id);
CREATE INDEX IF NOT EXISTS idx_replies_author_id ON public.replies(author_id);
CREATE INDEX IF NOT EXISTS idx_replies_created_at ON public.replies(created_at DESC);

-- Messages table indexes
CREATE INDEX IF NOT EXISTS idx_messages_conversation_id ON public.messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_messages_sender_id ON public.messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON public.messages(created_at DESC);

-- Conversations table indexes
CREATE INDEX IF NOT EXISTS idx_conversations_updated_at ON public.conversations(updated_at DESC);

-- Profiles table indexes
CREATE INDEX IF NOT EXISTS idx_profiles_username ON public.profiles(username);
CREATE INDEX IF NOT EXISTS idx_profiles_reputation ON public.profiles(reputation DESC);
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);

-- User online status indexes
CREATE INDEX IF NOT EXISTS idx_user_online_status_is_online ON public.user_online_status(is_online) WHERE is_online = true;
CREATE INDEX IF NOT EXISTS idx_user_online_status_last_seen ON public.user_online_status(last_seen DESC);

-- User achievements indexes
CREATE INDEX IF NOT EXISTS idx_user_achievements_user_id ON public.user_achievements(user_id);
CREATE INDEX IF NOT EXISTS idx_user_achievements_earned_at ON public.user_achievements(earned_at DESC);

-- Categories table index
CREATE INDEX IF NOT EXISTS idx_categories_slug ON public.categories(slug);
CREATE INDEX IF NOT EXISTS idx_categories_is_active ON public.categories(is_active) WHERE is_active = true;