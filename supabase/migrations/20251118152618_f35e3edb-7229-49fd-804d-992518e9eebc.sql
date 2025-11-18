-- Fix remaining database function security warnings
-- Part 2: Functions that were missed in the first migration

-- 1. get_current_user_role - update from 'public' to 'public, pg_temp'
CREATE OR REPLACE FUNCTION public.get_current_user_role()
RETURNS text
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
  SELECT role FROM profiles WHERE user_id = auth.uid();
$$;

-- 2. update_updated_at_column
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- 3. update_seo_updated_at
CREATE OR REPLACE FUNCTION public.update_seo_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public, pg_temp
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- 4. update_seo_content_last_updated
CREATE OR REPLACE FUNCTION public.update_seo_content_last_updated()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public, pg_temp
AS $$
BEGIN
  NEW.last_updated = now();
  RETURN NEW;
END;
$$;

-- 5. has_role
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- 6. calculate_reply_depth
CREATE OR REPLACE FUNCTION public.calculate_reply_depth()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public, pg_temp
AS $$
BEGIN
  IF NEW.parent_reply_id IS NULL THEN
    NEW.depth := 0;
  ELSE
    SELECT COALESCE(depth, 0) + 1 INTO NEW.depth
    FROM replies
    WHERE id = NEW.parent_reply_id;
  END IF;
  RETURN NEW;
END;
$$;

-- 7. update_conversation_last_message
CREATE OR REPLACE FUNCTION public.update_conversation_last_message()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
  UPDATE conversations
  SET last_message_at = NEW.created_at,
      updated_at = NEW.created_at
  WHERE id = NEW.conversation_id;
  RETURN NEW;
END;
$$;

-- 8. set_message_expiry
CREATE OR REPLACE FUNCTION public.set_message_expiry()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public, pg_temp
AS $$
BEGIN
  NEW.expires_at := NEW.created_at + INTERVAL '7 days';
  RETURN NEW;
END;
$$;

-- 9. create_default_privacy_settings
CREATE OR REPLACE FUNCTION public.create_default_privacy_settings()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
  INSERT INTO user_privacy_settings (user_id, profile_visibility)
  VALUES (NEW.user_id, 'public')
  ON CONFLICT (user_id) DO NOTHING;
  
  RETURN NEW;
END;
$$;

-- 10. log_topic_activity
CREATE OR REPLACE FUNCTION public.log_topic_activity()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
  PERFORM create_activity_entry(
    NEW.author_id,
    'topic_created',
    jsonb_build_object(
      'topic_id', NEW.id,
      'topic_title', NEW.title,
      'category_id', NEW.category_id
    )
  );
  RETURN NEW;
END;
$$;

-- 11. log_reply_activity
CREATE OR REPLACE FUNCTION public.log_reply_activity()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
  PERFORM create_activity_entry(
    NEW.author_id,
    'reply_created',
    jsonb_build_object(
      'reply_id', NEW.id,
      'topic_id', NEW.topic_id
    )
  );
  RETURN NEW;
END;
$$;

-- 12. check_topic_achievements
CREATE OR REPLACE FUNCTION public.check_topic_achievements()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public, pg_temp
AS $$
BEGIN
  PERFORM update_user_streak(NEW.author_id, 'post');
  
  IF NOT EXISTS (SELECT 1 FROM user_achievements ua JOIN achievements a ON ua.achievement_id = a.id 
                 WHERE ua.user_id = NEW.author_id AND a.name = 'first_post') THEN
    PERFORM award_achievement(NEW.author_id, 'first_post');
  END IF;
  
  DECLARE
    topic_count INTEGER;
  BEGIN
    SELECT COUNT(*) INTO topic_count FROM topics WHERE author_id = NEW.author_id;
    
    IF topic_count = 10 THEN
      PERFORM award_achievement(NEW.author_id, 'conversation_starter');
    ELSIF topic_count = 50 THEN
      PERFORM award_achievement(NEW.author_id, 'community_leader');
    END IF;
  END;
  
  RETURN NEW;
END;
$$;

-- 13. check_reply_achievements
CREATE OR REPLACE FUNCTION public.check_reply_achievements()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public, pg_temp
AS $$
BEGIN
  PERFORM update_user_streak(NEW.author_id, 'post');
  
  IF NOT EXISTS (SELECT 1 FROM user_achievements ua JOIN achievements a ON ua.achievement_id = a.id 
                 WHERE ua.user_id = NEW.author_id AND a.name = 'first_reply') THEN
    PERFORM award_achievement(NEW.author_id, 'first_reply');
  END IF;
  
  RETURN NEW;
END;
$$;

-- 14. check_vote_achievements
CREATE OR REPLACE FUNCTION public.check_vote_achievements()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public, pg_temp
AS $$
DECLARE
  target_user_id UUID;
  upvote_count INTEGER;
BEGIN
  IF NEW.item_type = 'topic' THEN
    SELECT author_id INTO target_user_id FROM topics WHERE id = NEW.item_id;
  ELSIF NEW.item_type = 'reply' THEN
    SELECT author_id INTO target_user_id FROM replies WHERE id = NEW.item_id;
  ELSE
    RETURN NEW;
  END IF;
  
  IF NEW.vote_type = 'up' THEN
    SELECT COUNT(*) INTO upvote_count 
    FROM votes v
    WHERE v.vote_type = 'up' 
    AND ((v.item_type = 'topic' AND EXISTS (SELECT 1 FROM topics t WHERE t.id = v.item_id AND t.author_id = target_user_id))
         OR (v.item_type = 'reply' AND EXISTS (SELECT 1 FROM replies r WHERE r.id = v.item_id AND r.author_id = target_user_id)));
    
    IF upvote_count = 10 THEN
      PERFORM award_achievement(target_user_id, 'helpful_member');
    ELSIF upvote_count = 100 THEN
      PERFORM award_achievement(target_user_id, 'expert_helper');
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$;

-- 15. update_login_streak
CREATE OR REPLACE FUNCTION public.update_login_streak()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public, pg_temp
AS $$
BEGIN
  PERFORM update_user_streak(NEW.user_id, 'login');
  RETURN NEW;
END;
$$;

-- 16. handle_new_user
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
  IF NEW.email = 'info@wietforumbelgie.com' THEN
    INSERT INTO profiles (user_id, username, display_name, role)
    VALUES (
      NEW.id,
      'wietforum-admin',
      'WietForum Admin',
      'admin'
    );
  ELSE
    IF NOT EXISTS (SELECT 1 FROM profiles WHERE user_id = NEW.id) THEN
      INSERT INTO profiles (user_id, username, display_name, role)
      VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'username', 'user_' || substr(NEW.id::text, 1, 8)),
        COALESCE(NEW.raw_user_meta_data->>'display_name', NEW.raw_user_meta_data->>'username', split_part(NEW.email, '@', 1)),
        COALESCE(NEW.raw_user_meta_data->>'role', 'user')
      );
      
      IF COALESCE(NEW.raw_user_meta_data->>'role', 'user') = 'supplier' THEN
        INSERT INTO supplier_profiles (
          user_id,
          business_name,
          description,
          contact_info,
          stats,
          features,
          ranking,
          is_active
        ) VALUES (
          NEW.id,
          COALESCE(NEW.raw_user_meta_data->>'display_name', NEW.raw_user_meta_data->>'username', split_part(NEW.email, '@', 1)),
          NULL,
          '{}',
          '{}',
          '{}',
          0,
          true
        );
      END IF;
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$;

-- 17. check_topic_achievements_with_xp
CREATE OR REPLACE FUNCTION public.check_topic_achievements_with_xp()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public, pg_temp
AS $$
BEGIN
  PERFORM award_xp(NEW.author_id, 25, 'topic_created');
  PERFORM award_category_points(NEW.author_id, 'content', 10);
  
  PERFORM update_user_streak(NEW.author_id, 'post');
  
  IF NOT EXISTS (SELECT 1 FROM user_achievements ua JOIN achievements a ON ua.achievement_id = a.id 
                 WHERE ua.user_id = NEW.author_id AND a.name = 'first_post') THEN
    PERFORM award_achievement(NEW.author_id, 'first_post');
  END IF;
  
  DECLARE
    topic_count INTEGER;
  BEGIN
    SELECT COUNT(*) INTO topic_count FROM topics WHERE author_id = NEW.author_id;
    
    IF topic_count = 10 THEN
      PERFORM award_achievement(NEW.author_id, 'conversation_starter');
    ELSIF topic_count = 50 THEN
      PERFORM award_achievement(NEW.author_id, 'community_leader');
    END IF;
  END;
  
  RETURN NEW;
END;
$$;

-- 18. check_reply_achievements_with_xp
CREATE OR REPLACE FUNCTION public.check_reply_achievements_with_xp()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public, pg_temp
AS $$
BEGIN
  PERFORM award_xp(NEW.author_id, 15, 'reply_created');
  PERFORM award_category_points(NEW.author_id, 'content', 5);
  
  PERFORM update_user_streak(NEW.author_id, 'post');
  
  IF NOT EXISTS (SELECT 1 FROM user_achievements ua JOIN achievements a ON ua.achievement_id = a.id 
                 WHERE ua.user_id = NEW.author_id AND a.name = 'first_reply') THEN
    PERFORM award_achievement(NEW.author_id, 'first_reply');
  END IF;
  
  RETURN NEW;
END;
$$;

-- 19. check_vote_achievements_with_xp
CREATE OR REPLACE FUNCTION public.check_vote_achievements_with_xp()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public, pg_temp
AS $$
DECLARE
  target_user_id UUID;
  upvote_count INTEGER;
BEGIN
  PERFORM award_xp(NEW.user_id, 2, 'vote_cast');
  PERFORM award_category_points(NEW.user_id, 'social', 1);
  
  IF NEW.item_type = 'topic' THEN
    SELECT author_id INTO target_user_id FROM topics WHERE id = NEW.item_id;
  ELSIF NEW.item_type = 'reply' THEN
    SELECT author_id INTO target_user_id FROM replies WHERE id = NEW.item_id;
  ELSE
    RETURN NEW;
  END IF;
  
  IF NEW.vote_type = 'up' THEN
    PERFORM award_xp(target_user_id, 5, 'upvote_received');
    PERFORM award_category_points(target_user_id, 'helpful', 3);
    
    SELECT COUNT(*) INTO upvote_count 
    FROM votes v
    WHERE v.vote_type = 'up' 
    AND ((v.item_type = 'topic' AND EXISTS (SELECT 1 FROM topics t WHERE t.id = v.item_id AND t.author_id = target_user_id))
         OR (v.item_type = 'reply' AND EXISTS (SELECT 1 FROM replies r WHERE r.id = v.item_id AND r.author_id = target_user_id)));
    
    IF upvote_count = 10 THEN
      PERFORM award_achievement(target_user_id, 'helpful_member');
    ELSIF upvote_count = 100 THEN
      PERFORM award_achievement(target_user_id, 'expert_helper');
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$;

-- 20. update_login_streak_with_xp
CREATE OR REPLACE FUNCTION public.update_login_streak_with_xp()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public, pg_temp
AS $$
BEGIN
  PERFORM award_xp(NEW.user_id, 5, 'daily_login');
  PERFORM award_category_points(NEW.user_id, 'general', 2);
  
  PERFORM update_user_streak(NEW.user_id, 'login');
  RETURN NEW;
END;
$$;

-- 21. trigger_security_score_update
CREATE OR REPLACE FUNCTION public.trigger_security_score_update()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
  PERFORM update_user_security_score(
    CASE 
      WHEN TG_TABLE_NAME = 'user_2fa' THEN COALESCE(NEW.user_id, OLD.user_id)
      WHEN TG_TABLE_NAME = 'user_security_events' THEN COALESCE(NEW.user_id, OLD.user_id)
      WHEN TG_TABLE_NAME = 'user_sessions' THEN COALESCE(NEW.user_id, OLD.user_id)
      ELSE NULL
    END
  );
  RETURN COALESCE(NEW, OLD);
END;
$$;

-- 22. create_conversation_with_participants
CREATE OR REPLACE FUNCTION public.create_conversation_with_participants(participant_user_ids uuid[])
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  new_conversation_id UUID;
  participant_id UUID;
BEGIN
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  IF NOT (auth.uid() = ANY(participant_user_ids)) THEN
    RAISE EXCEPTION 'Current user must be included in participants list';
  END IF;

  IF array_length(participant_user_ids, 1) < 2 THEN
    RAISE EXCEPTION 'Conversation must have at least 2 participants';
  END IF;
  
  IF EXISTS (
    SELECT 1 
    FROM unnest(participant_user_ids) AS uid
    WHERE NOT EXISTS (SELECT 1 FROM profiles WHERE user_id = uid)
  ) THEN
    RAISE EXCEPTION 'One or more participants do not exist';
  END IF;

  INSERT INTO conversations (created_at, updated_at, last_message_at)
  VALUES (NOW(), NOW(), NOW())
  RETURNING id INTO new_conversation_id;

  FOREACH participant_id IN ARRAY participant_user_ids
  LOOP
    INSERT INTO conversation_participants (conversation_id, user_id, joined_at, last_read_at)
    VALUES (new_conversation_id, participant_id, NOW(), NOW());
  END LOOP;

  RETURN new_conversation_id;
END;
$$;

-- 23. is_conversation_participant
CREATE OR REPLACE FUNCTION public.is_conversation_participant(_conversation_id uuid, _user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM conversation_participants
    WHERE conversation_id = _conversation_id
    AND user_id = _user_id
  )
$$;

-- 24. find_existing_conversation
CREATE OR REPLACE FUNCTION public.find_existing_conversation(current_user_id uuid, other_user_id uuid)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  existing_conv_id UUID;
BEGIN
  SELECT cp1.conversation_id INTO existing_conv_id
  FROM conversation_participants cp1
  WHERE cp1.user_id = current_user_id
  AND EXISTS (
    SELECT 1 FROM conversation_participants cp2
    WHERE cp2.conversation_id = cp1.conversation_id
    AND cp2.user_id = other_user_id
  )
  AND (
    SELECT COUNT(*) FROM conversation_participants cp3
    WHERE cp3.conversation_id = cp1.conversation_id
  ) = 2
  LIMIT 1;
  
  RETURN existing_conv_id;
END;
$$;