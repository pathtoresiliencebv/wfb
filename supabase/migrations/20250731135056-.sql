-- Add missing foreign key constraints
ALTER TABLE public.user_levels 
ADD CONSTRAINT user_levels_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

ALTER TABLE public.user_points 
ADD CONSTRAINT user_points_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

ALTER TABLE public.user_points 
ADD CONSTRAINT user_points_category_id_fkey 
FOREIGN KEY (category_id) REFERENCES public.point_categories(id) ON DELETE CASCADE;

ALTER TABLE public.rewards 
ADD CONSTRAINT rewards_cost_category_id_fkey 
FOREIGN KEY (cost_category_id) REFERENCES public.point_categories(id) ON DELETE SET NULL;

ALTER TABLE public.user_rewards 
ADD CONSTRAINT user_rewards_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

ALTER TABLE public.user_rewards 
ADD CONSTRAINT user_rewards_reward_id_fkey 
FOREIGN KEY (reward_id) REFERENCES public.rewards(id) ON DELETE CASCADE;

-- Update the existing triggers to award XP for various activities
-- Update topic creation to award XP
CREATE OR REPLACE FUNCTION public.check_topic_achievements_with_xp()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  -- Award XP for creating a topic
  PERFORM public.award_xp(NEW.author_id, 25, 'topic_created');
  PERFORM public.award_category_points(NEW.author_id, 'content', 10);
  
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
$$;

-- Update reply creation to award XP
CREATE OR REPLACE FUNCTION public.check_reply_achievements_with_xp()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  -- Award XP for creating a reply
  PERFORM public.award_xp(NEW.author_id, 15, 'reply_created');
  PERFORM public.award_category_points(NEW.author_id, 'content', 5);
  
  -- Update streak
  PERFORM public.update_user_streak(NEW.author_id, 'post');
  
  -- Check first reply achievement
  IF NOT EXISTS (SELECT 1 FROM user_achievements ua JOIN achievements a ON ua.achievement_id = a.id 
                 WHERE ua.user_id = NEW.author_id AND a.name = 'first_reply') THEN
    PERFORM public.award_achievement(NEW.author_id, 'first_reply');
  END IF;
  
  RETURN NEW;
END;
$$;

-- Update vote achievements to award XP
CREATE OR REPLACE FUNCTION public.check_vote_achievements_with_xp()
RETURNS trigger
LANGUAGE plpgsql
AS $$
DECLARE
  target_user_id UUID;
  upvote_count INTEGER;
BEGIN
  -- Award XP to the voter
  PERFORM public.award_xp(NEW.user_id, 2, 'vote_cast');
  PERFORM public.award_category_points(NEW.user_id, 'social', 1);
  
  -- Get the author of the voted item
  IF NEW.item_type = 'topic' THEN
    SELECT author_id INTO target_user_id FROM topics WHERE id = NEW.item_id;
  ELSIF NEW.item_type = 'reply' THEN
    SELECT author_id INTO target_user_id FROM replies WHERE id = NEW.item_id;
  ELSE
    RETURN NEW;
  END IF;
  
  -- Only check for upvotes for the content author
  IF NEW.vote_type = 'up' THEN
    -- Award XP to content author
    PERFORM public.award_xp(target_user_id, 5, 'upvote_received');
    PERFORM public.award_category_points(target_user_id, 'helpful', 3);
    
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
$$;

-- Replace the existing triggers
DROP TRIGGER IF EXISTS check_topic_achievements_trigger ON public.topics;
CREATE TRIGGER check_topic_achievements_trigger
  AFTER INSERT ON public.topics
  FOR EACH ROW
  EXECUTE FUNCTION public.check_topic_achievements_with_xp();

DROP TRIGGER IF EXISTS check_reply_achievements_trigger ON public.replies;
CREATE TRIGGER check_reply_achievements_trigger
  AFTER INSERT ON public.replies
  FOR EACH ROW
  EXECUTE FUNCTION public.check_reply_achievements_with_xp();

DROP TRIGGER IF EXISTS check_vote_achievements_trigger ON public.votes;
CREATE TRIGGER check_vote_achievements_trigger
  AFTER INSERT ON public.votes
  FOR EACH ROW
  EXECUTE FUNCTION public.check_vote_achievements_with_xp();

-- Update login streak to award XP
CREATE OR REPLACE FUNCTION public.update_login_streak_with_xp()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  -- Award XP for logging in
  PERFORM public.award_xp(NEW.user_id, 5, 'daily_login');
  PERFORM public.award_category_points(NEW.user_id, 'general', 2);
  
  -- Update login streak when profile is accessed/updated
  PERFORM public.update_user_streak(NEW.user_id, 'login');
  RETURN NEW;
END;
$$;

-- Replace the login streak trigger
DROP TRIGGER IF EXISTS update_login_streak_trigger ON public.profiles;
CREATE TRIGGER update_login_streak_trigger
  AFTER UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_login_streak_with_xp();