-- Create achievements table for tracking user achievements
CREATE TABLE public.achievements (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name CHARACTER VARYING NOT NULL,
  description TEXT,
  icon CHARACTER VARYING,
  points INTEGER NOT NULL DEFAULT 0,
  category CHARACTER VARYING NOT NULL DEFAULT 'general',
  rarity CHARACTER VARYING NOT NULL DEFAULT 'common', -- common, uncommon, rare, epic, legendary
  criteria JSONB NOT NULL DEFAULT '{}',
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create user achievements table for tracking earned achievements
CREATE TABLE public.user_achievements (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  achievement_id UUID NOT NULL REFERENCES public.achievements(id) ON DELETE CASCADE,
  earned_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  progress JSONB DEFAULT '{}',
  UNIQUE(user_id, achievement_id)
);

-- Create user streaks table for tracking daily activity
CREATE TABLE public.user_streaks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE,
  current_streak INTEGER NOT NULL DEFAULT 0,
  longest_streak INTEGER NOT NULL DEFAULT 0,
  last_activity_date DATE,
  streak_type CHARACTER VARYING NOT NULL DEFAULT 'login', -- login, post, vote
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create PWA user settings table
CREATE TABLE public.user_pwa_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE,
  push_notifications_enabled BOOLEAN NOT NULL DEFAULT false,
  offline_reading_enabled BOOLEAN NOT NULL DEFAULT true,
  sync_frequency CHARACTER VARYING NOT NULL DEFAULT 'hourly', -- realtime, hourly, daily
  last_sync_at TIMESTAMP WITH TIME ZONE,
  push_subscription JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create topic subscriptions table
CREATE TABLE public.topic_subscriptions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  topic_id UUID NOT NULL REFERENCES public.topics(id) ON DELETE CASCADE,
  notification_type CHARACTER VARYING NOT NULL DEFAULT 'all', -- all, mentions, replies
  subscribed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, topic_id)
);

-- Enable RLS
ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_streaks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_pwa_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.topic_subscriptions ENABLE ROW LEVEL SECURITY;

-- RLS Policies for achievements
CREATE POLICY "Achievements are viewable by everyone" 
ON public.achievements FOR SELECT USING (true);

CREATE POLICY "Admins can manage achievements" 
ON public.achievements FOR ALL 
USING (EXISTS (
  SELECT 1 FROM profiles 
  WHERE user_id = auth.uid() 
  AND role IN ('admin', 'moderator')
));

-- RLS Policies for user achievements
CREATE POLICY "Users can view their own achievements" 
ON public.user_achievements FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "User achievements are viewable by everyone" 
ON public.user_achievements FOR SELECT 
USING (true);

CREATE POLICY "System can create user achievements" 
ON public.user_achievements FOR INSERT 
WITH CHECK (true);

-- RLS Policies for user streaks
CREATE POLICY "Users can view their own streaks" 
ON public.user_streaks FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "System can manage user streaks" 
ON public.user_streaks FOR ALL 
USING (true);

-- RLS Policies for PWA settings
CREATE POLICY "Users can manage their own PWA settings" 
ON public.user_pwa_settings FOR ALL 
USING (auth.uid() = user_id) 
WITH CHECK (auth.uid() = user_id);

-- RLS Policies for topic subscriptions
CREATE POLICY "Users can manage their own subscriptions" 
ON public.topic_subscriptions FOR ALL 
USING (auth.uid() = user_id) 
WITH CHECK (auth.uid() = user_id);

-- Create function to award achievements
CREATE OR REPLACE FUNCTION public.award_achievement(
  target_user_id UUID,
  achievement_name VARCHAR,
  progress_data JSONB DEFAULT '{}'
) RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  achievement_record achievements%ROWTYPE;
  existing_award user_achievements%ROWTYPE;
BEGIN
  -- Get achievement
  SELECT * INTO achievement_record 
  FROM achievements 
  WHERE name = achievement_name AND is_active = true;
  
  IF NOT FOUND THEN
    RETURN false;
  END IF;
  
  -- Check if already awarded
  SELECT * INTO existing_award 
  FROM user_achievements 
  WHERE user_id = target_user_id AND achievement_id = achievement_record.id;
  
  IF FOUND THEN
    RETURN false;
  END IF;
  
  -- Award achievement
  INSERT INTO user_achievements (user_id, achievement_id, progress)
  VALUES (target_user_id, achievement_record.id, progress_data);
  
  -- Update user reputation
  PERFORM public.update_user_reputation(
    target_user_id,
    achievement_record.points,
    'achievement_earned',
    achievement_record.id,
    'achievement'
  );
  
  -- Create notification
  PERFORM public.create_notification(
    target_user_id,
    'achievement_earned',
    'Prestatie Behaald!',
    'Je hebt de prestatie "' || achievement_record.name || '" behaald!',
    jsonb_build_object(
      'achievement_id', achievement_record.id,
      'achievement_name', achievement_record.name,
      'points', achievement_record.points
    )
  );
  
  RETURN true;
END;
$$;

-- Create function to update user streaks
CREATE OR REPLACE FUNCTION public.update_user_streak(
  target_user_id UUID,
  streak_type VARCHAR DEFAULT 'login'
) RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  current_streak INTEGER := 0;
  today_date DATE := CURRENT_DATE;
  existing_streak user_streaks%ROWTYPE;
BEGIN
  -- Get existing streak
  SELECT * INTO existing_streak 
  FROM user_streaks 
  WHERE user_id = target_user_id AND user_streaks.streak_type = update_user_streak.streak_type;
  
  IF NOT FOUND THEN
    -- Create new streak record
    INSERT INTO user_streaks (user_id, current_streak, longest_streak, last_activity_date, streak_type)
    VALUES (target_user_id, 1, 1, today_date, streak_type);
    current_streak := 1;
  ELSE
    -- Check if last activity was yesterday
    IF existing_streak.last_activity_date = today_date - INTERVAL '1 day' THEN
      -- Continue streak
      current_streak := existing_streak.current_streak + 1;
      UPDATE user_streaks 
      SET current_streak = current_streak,
          longest_streak = GREATEST(longest_streak, current_streak),
          last_activity_date = today_date,
          updated_at = now()
      WHERE id = existing_streak.id;
    ELSIF existing_streak.last_activity_date = today_date THEN
      -- Same day, no change
      current_streak := existing_streak.current_streak;
    ELSE
      -- Streak broken, reset
      current_streak := 1;
      UPDATE user_streaks 
      SET current_streak = 1,
          last_activity_date = today_date,
          updated_at = now()
      WHERE id = existing_streak.id;
    END IF;
  END IF;
  
  -- Check for streak achievements
  IF current_streak = 7 THEN
    PERFORM public.award_achievement(target_user_id, 'week_streak');
  ELSIF current_streak = 30 THEN
    PERFORM public.award_achievement(target_user_id, 'month_streak');
  ELSIF current_streak = 100 THEN
    PERFORM public.award_achievement(target_user_id, 'hundred_day_streak');
  END IF;
  
  RETURN current_streak;
END;
$$;

-- Insert default achievements
INSERT INTO public.achievements (name, description, icon, points, category, rarity, criteria) VALUES
('first_post', 'Maak je eerste topic aan', 'MessageCircle', 10, 'content', 'common', '{"posts_count": 1}'),
('first_reply', 'Geef je eerste reactie', 'Reply', 5, 'content', 'common', '{"replies_count": 1}'),
('helpful_member', 'Ontvang 10 upvotes', 'ThumbsUp', 25, 'engagement', 'uncommon', '{"upvotes_received": 10}'),
('popular_poster', 'Maak een topic met 50+ views', 'Eye', 30, 'content', 'uncommon', '{"topic_views": 50}'),
('week_streak', '7 dagen op rij actief', 'Calendar', 50, 'activity', 'rare', '{"streak_days": 7}'),
('month_streak', '30 dagen op rij actief', 'CalendarDays', 100, 'activity', 'epic', '{"streak_days": 30}'),
('hundred_day_streak', '100 dagen op rij actief', 'Crown', 500, 'activity', 'legendary', '{"streak_days": 100}'),
('expert_helper', 'Ontvang 100 upvotes', 'Award', 200, 'engagement', 'epic', '{"upvotes_received": 100}'),
('community_leader', '50 topics aangemaakt', 'Users', 150, 'content', 'rare', '{"topics_count": 50}'),
('conversation_starter', '10 topics aangemaakt', 'MessageSquare', 75, 'content', 'uncommon', '{"topics_count": 10}');

-- Create triggers for automatic achievement checking
CREATE OR REPLACE FUNCTION public.check_topic_achievements()
RETURNS TRIGGER AS $$
BEGIN
  -- Update streak
  PERFORM public.update_user_streak(NEW.author_id, 'post');
  
  -- Check first post achievement
  IF NOT EXISTS (SELECT 1 FROM user_achievements ua JOIN achievements a ON ua.achievement_id = a.id 
                 WHERE ua.user_id = NEW.author_id AND a.name = 'first_post') THEN
    PERFORM public.award_achievement(NEW.author_id, 'first_post');
  END IF;
  
  -- Check topic count achievements
  DECLARE
    topic_count INTEGER;
  BEGIN
    SELECT COUNT(*) INTO topic_count FROM topics WHERE author_id = NEW.author_id;
    
    IF topic_count = 10 THEN
      PERFORM public.award_achievement(NEW.author_id, 'conversation_starter');
    ELSIF topic_count = 50 THEN
      PERFORM public.award_achievement(NEW.author_id, 'community_leader');
    END IF;
  END;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION public.check_reply_achievements()
RETURNS TRIGGER AS $$
BEGIN
  -- Update streak
  PERFORM public.update_user_streak(NEW.author_id, 'post');
  
  -- Check first reply achievement
  IF NOT EXISTS (SELECT 1 FROM user_achievements ua JOIN achievements a ON ua.achievement_id = a.id 
                 WHERE ua.user_id = NEW.author_id AND a.name = 'first_reply') THEN
    PERFORM public.award_achievement(NEW.author_id, 'first_reply');
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION public.check_vote_achievements()
RETURNS TRIGGER AS $$
DECLARE
  target_user_id UUID;
  upvote_count INTEGER;
BEGIN
  -- Get the author of the voted item
  IF NEW.item_type = 'topic' THEN
    SELECT author_id INTO target_user_id FROM topics WHERE id = NEW.item_id;
  ELSIF NEW.item_type = 'reply' THEN
    SELECT author_id INTO target_user_id FROM replies WHERE id = NEW.item_id;
  ELSE
    RETURN NEW;
  END IF;
  
  -- Only check for upvotes
  IF NEW.vote_type = 'up' THEN
    -- Count total upvotes for user
    SELECT COUNT(*) INTO upvote_count 
    FROM votes v
    WHERE v.vote_type = 'up' 
    AND ((v.item_type = 'topic' AND EXISTS (SELECT 1 FROM topics t WHERE t.id = v.item_id AND t.author_id = target_user_id))
         OR (v.item_type = 'reply' AND EXISTS (SELECT 1 FROM replies r WHERE r.id = v.item_id AND r.author_id = target_user_id)));
    
    IF upvote_count = 10 THEN
      PERFORM public.award_achievement(target_user_id, 'helpful_member');
    ELSIF upvote_count = 100 THEN
      PERFORM public.award_achievement(target_user_id, 'expert_helper');
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers
CREATE TRIGGER topic_achievements_trigger
  AFTER INSERT ON topics
  FOR EACH ROW EXECUTE FUNCTION check_topic_achievements();

CREATE TRIGGER reply_achievements_trigger
  AFTER INSERT ON replies
  FOR EACH ROW EXECUTE FUNCTION check_reply_achievements();

CREATE TRIGGER vote_achievements_trigger
  AFTER INSERT ON votes
  FOR EACH ROW EXECUTE FUNCTION check_vote_achievements();

-- Create trigger for updating streaks on profile updates (login tracking)
CREATE OR REPLACE FUNCTION public.update_login_streak()
RETURNS TRIGGER AS $$
BEGIN
  -- Update login streak when profile is accessed/updated
  PERFORM public.update_user_streak(NEW.user_id, 'login');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER login_streak_trigger
  AFTER UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_login_streak();