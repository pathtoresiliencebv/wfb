-- Fix search_path security warnings for all database functions
-- This prevents SQL injection via schema poisoning attacks

-- 1. reset_admin_password
CREATE OR REPLACE FUNCTION public.reset_admin_password()
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  admin_user_id UUID;
BEGIN
  SELECT id INTO admin_user_id
  FROM auth.users 
  WHERE email = 'info@wietforumbelgie.com';
  
  IF admin_user_id IS NULL THEN
    RETURN 'Admin user not found with email info@wietforumbelgie.com';
  END IF;
  
  UPDATE auth.users 
  SET 
    email_confirmed_at = now(),
    confirmation_token = NULL,
    updated_at = now()
  WHERE id = admin_user_id;
  
  RETURN 'Admin user email confirmed and ready for login';
END;
$$;

-- 2. handle_login_attempt
CREATE OR REPLACE FUNCTION public.handle_login_attempt(
  attempt_email character varying,
  attempt_ip inet,
  is_successful boolean DEFAULT false
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  existing_attempt login_attempts%ROWTYPE;
  max_attempts INTEGER := 5;
  lockout_duration INTERVAL := '15 minutes';
  result JSONB;
BEGIN
  SELECT * INTO existing_attempt
  FROM login_attempts
  WHERE email = attempt_email AND ip_address = attempt_ip;
  
  IF is_successful THEN
    IF existing_attempt.id IS NOT NULL THEN
      DELETE FROM login_attempts WHERE id = existing_attempt.id;
    END IF;
    RETURN jsonb_build_object('locked', false, 'remaining_attempts', max_attempts);
  END IF;
  
  IF existing_attempt.locked_until IS NOT NULL AND existing_attempt.locked_until > now() THEN
    RETURN jsonb_build_object(
      'locked', true,
      'remaining_attempts', 0,
      'locked_until', existing_attempt.locked_until
    );
  END IF;
  
  IF existing_attempt.id IS NOT NULL THEN
    UPDATE login_attempts
    SET attempt_count = CASE 
      WHEN locked_until IS NOT NULL AND locked_until <= now() THEN 1
      ELSE attempt_count + 1
    END,
    last_attempt_at = now(),
    locked_until = CASE 
      WHEN (CASE WHEN locked_until IS NOT NULL AND locked_until <= now() THEN 1 ELSE attempt_count + 1 END) >= max_attempts 
      THEN now() + lockout_duration
      ELSE NULL
    END,
    updated_at = now()
    WHERE id = existing_attempt.id
    RETURNING * INTO existing_attempt;
  ELSE
    INSERT INTO login_attempts (email, ip_address, attempt_count, last_attempt_at)
    VALUES (attempt_email, attempt_ip, 1, now())
    RETURNING * INTO existing_attempt;
  END IF;
  
  RETURN jsonb_build_object(
    'locked', existing_attempt.locked_until IS NOT NULL AND existing_attempt.locked_until > now(),
    'remaining_attempts', GREATEST(0, max_attempts - existing_attempt.attempt_count),
    'locked_until', existing_attempt.locked_until
  );
END;
$$;

-- 3. update_user_reputation
CREATE OR REPLACE FUNCTION public.update_user_reputation(
  target_user_id uuid,
  change_amount integer,
  reason character varying,
  related_item_id uuid DEFAULT NULL::uuid,
  related_item_type character varying DEFAULT NULL::character varying
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
  UPDATE profiles
  SET reputation = reputation + change_amount,
      updated_at = now()
  WHERE user_id = target_user_id;
  
  INSERT INTO reputation_history (
    user_id, change_amount, reason, related_item_id, related_item_type
  ) VALUES (
    target_user_id, change_amount, reason, related_item_id, related_item_type
  );
END;
$$;

-- 4. calculate_user_security_score
CREATE OR REPLACE FUNCTION public.calculate_user_security_score(target_user_id uuid)
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  score INTEGER := 0;
  has_2fa BOOLEAN := false;
  recent_suspicious_activity INTEGER := 0;
  session_count INTEGER := 0;
BEGIN
  SELECT is_enabled INTO has_2fa 
  FROM user_2fa 
  WHERE user_id = target_user_id;
  
  IF has_2fa THEN
    score := score + 30;
  END IF;
  
  score := score + 20;
  
  SELECT COUNT(*) INTO recent_suspicious_activity
  FROM user_security_events
  WHERE user_id = target_user_id 
    AND risk_level IN ('high', 'critical')
    AND created_at > now() - INTERVAL '30 days';
  
  score := score - (recent_suspicious_activity * 5);
  
  SELECT COUNT(*) INTO session_count
  FROM user_sessions
  WHERE user_id = target_user_id 
    AND expires_at > now();
  
  IF session_count <= 3 THEN
    score := score + 20;
  ELSIF session_count <= 5 THEN
    score := score + 10;
  END IF;
  
  score := score + 30;
  score := GREATEST(0, LEAST(100, score));
  
  RETURN score;
END;
$$;

-- 5. create_security_event
CREATE OR REPLACE FUNCTION public.create_security_event(
  target_user_id uuid,
  event_type character varying,
  event_description text,
  risk_level character varying DEFAULT 'low'::character varying,
  metadata jsonb DEFAULT '{}'::jsonb
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  event_id UUID;
BEGIN
  INSERT INTO user_security_events (
    user_id,
    event_type,
    event_description,
    ip_address,
    user_agent,
    risk_level,
    metadata
  ) VALUES (
    target_user_id,
    event_type,
    event_description,
    get_client_ip(),
    current_setting('request.headers', true)::json->>'user-agent',
    risk_level,
    metadata
  ) RETURNING id INTO event_id;
  
  RETURN event_id;
END;
$$;

-- 6. award_achievement
CREATE OR REPLACE FUNCTION public.award_achievement(
  target_user_id uuid,
  achievement_name character varying,
  progress_data jsonb DEFAULT '{}'::jsonb
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  achievement_record achievements%ROWTYPE;
  existing_award user_achievements%ROWTYPE;
BEGIN
  SELECT * INTO achievement_record 
  FROM achievements 
  WHERE name = achievement_name AND is_active = true;
  
  IF NOT FOUND THEN
    RETURN false;
  END IF;
  
  SELECT * INTO existing_award 
  FROM user_achievements 
  WHERE user_id = target_user_id AND achievement_id = achievement_record.id;
  
  IF FOUND THEN
    RETURN false;
  END IF;
  
  INSERT INTO user_achievements (user_id, achievement_id, progress)
  VALUES (target_user_id, achievement_record.id, progress_data);
  
  PERFORM update_user_reputation(
    target_user_id,
    achievement_record.points,
    'achievement_earned',
    achievement_record.id,
    'achievement'
  );
  
  PERFORM create_notification(
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

-- 7. award_xp
CREATE OR REPLACE FUNCTION public.award_xp(
  target_user_id uuid,
  xp_amount integer,
  reason character varying DEFAULT 'general_activity'::character varying
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  user_level_record user_levels%ROWTYPE;
  new_total_xp INTEGER;
  level_info RECORD;
  old_level INTEGER;
BEGIN
  SELECT * INTO user_level_record FROM user_levels WHERE user_id = target_user_id;
  
  IF NOT FOUND THEN
    INSERT INTO user_levels (user_id, current_level, total_xp, xp_this_level, level_title)
    VALUES (target_user_id, 1, xp_amount, xp_amount, 'Newbie')
    RETURNING * INTO user_level_record;
  ELSE
    new_total_xp := user_level_record.total_xp + xp_amount;
    old_level := user_level_record.current_level;
    
    SELECT * INTO level_info FROM calculate_user_level(new_total_xp);
    
    UPDATE user_levels 
    SET total_xp = new_total_xp,
        current_level = level_info.level_number,
        level_title = level_info.title,
        xp_this_level = new_total_xp - level_info.xp_for_current,
        updated_at = now()
    WHERE user_id = target_user_id;
    
    IF level_info.level_number > old_level THEN
      PERFORM create_notification(
        target_user_id,
        'level_up',
        'Level Up!',
        'Gefeliciteerd! Je bent nu level ' || level_info.level_number || ' - ' || level_info.title,
        jsonb_build_object(
          'new_level', level_info.level_number,
          'new_title', level_info.title,
          'total_xp', new_total_xp
        )
      );
    END IF;
  END IF;
  
  RETURN true;
END;
$$;

-- 8. calculate_user_level
CREATE OR REPLACE FUNCTION public.calculate_user_level(total_xp integer)
RETURNS TABLE(level_number integer, title character varying, xp_for_current integer, xp_for_next integer)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  current_level INTEGER := 1;
  current_title VARCHAR := 'Newbie';
  xp_current INTEGER := 0;
  xp_next INTEGER := 100;
BEGIN
  SELECT ld.level_number, ld.title, ld.required_xp INTO current_level, current_title, xp_current
  FROM level_definitions ld
  WHERE ld.required_xp <= total_xp
  ORDER BY ld.level_number DESC
  LIMIT 1;
  
  SELECT ld.required_xp INTO xp_next
  FROM level_definitions ld
  WHERE ld.level_number = current_level + 1;
  
  IF xp_next IS NULL THEN
    xp_next := xp_current;
  END IF;
  
  RETURN QUERY SELECT current_level, current_title, xp_current, xp_next;
END;
$$;

-- 9. create_activity_entry
CREATE OR REPLACE FUNCTION public.create_activity_entry(
  user_id uuid,
  activity_type character varying,
  activity_data jsonb DEFAULT '{}'::jsonb
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  activity_id UUID;
BEGIN
  INSERT INTO activity_feed (user_id, activity_type, activity_data)
  VALUES (user_id, activity_type, activity_data)
  RETURNING id INTO activity_id;
  
  RETURN activity_id;
END;
$$;

-- 10. create_notification
CREATE OR REPLACE FUNCTION public.create_notification(
  recipient_id uuid,
  notification_type character varying,
  notification_title character varying,
  notification_message text DEFAULT NULL::text,
  notification_data jsonb DEFAULT '{}'::jsonb
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  notification_id UUID;
BEGIN
  INSERT INTO notifications (
    user_id,
    type,
    title,
    message,
    data
  ) VALUES (
    recipient_id,
    notification_type,
    notification_title,
    notification_message,
    notification_data
  ) RETURNING id INTO notification_id;
  
  RETURN notification_id;
END;
$$;

-- 11. delete_expired_messages
CREATE OR REPLACE FUNCTION public.delete_expired_messages()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
  DELETE FROM messages 
  WHERE expires_at < now() 
  AND is_deleted = false;
END;
$$;

-- 12. get_profile_visibility
CREATE OR REPLACE FUNCTION public.get_profile_visibility(target_user_id uuid)
RETURNS text
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  visibility TEXT;
BEGIN
  SELECT profile_visibility INTO visibility
  FROM user_privacy_settings 
  WHERE user_id = target_user_id;
  
  RETURN COALESCE(visibility, 'private');
END;
$$;

-- 13. handle_vote_reputation
CREATE OR REPLACE FUNCTION public.handle_vote_reputation()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  target_user_id UUID;
  rep_change INTEGER;
BEGIN
  IF NEW.item_type = 'topic' THEN
    SELECT author_id INTO target_user_id FROM topics WHERE id = NEW.item_id;
  ELSIF NEW.item_type = 'reply' THEN
    SELECT author_id INTO target_user_id FROM replies WHERE id = NEW.item_id;
  ELSE
    RETURN NEW;
  END IF;
  
  IF NEW.vote_type = 'up' THEN
    rep_change := 5;
  ELSIF NEW.vote_type = 'down' THEN
    rep_change := -2;
  ELSE
    RETURN NEW;
  END IF;
  
  PERFORM update_user_reputation(
    target_user_id,
    rep_change,
    'vote_received',
    NEW.item_id,
    NEW.item_type
  );
  
  RETURN NEW;
END;
$$;

-- 14. log_profile_role_change
CREATE OR REPLACE FUNCTION public.log_profile_role_change()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
  IF TG_OP = 'UPDATE' AND OLD.role != NEW.role THEN
    INSERT INTO audit_logs (
      user_id, 
      action, 
      table_name, 
      record_id, 
      old_values, 
      new_values
    ) VALUES (
      auth.uid(),
      'role_change',
      'profiles',
      NEW.id,
      jsonb_build_object('role', OLD.role),
      jsonb_build_object('role', NEW.role)
    );
  END IF;
  RETURN NEW;
END;
$$;

-- 15. notify_topic_reply
CREATE OR REPLACE FUNCTION public.notify_topic_reply()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  topic_author_id UUID;
  topic_title VARCHAR;
  reply_author_username VARCHAR;
BEGIN
  SELECT author_id, title INTO topic_author_id, topic_title
  FROM topics
  WHERE id = NEW.topic_id;
  
  SELECT username INTO reply_author_username
  FROM profiles
  WHERE user_id = NEW.author_id;
  
  IF topic_author_id != NEW.author_id THEN
    PERFORM create_notification(
      topic_author_id,
      'topic_reply',
      'Nieuwe reactie op je topic',
      reply_author_username || ' heeft gereageerd op "' || topic_title || '"',
      jsonb_build_object(
        'topic_id', NEW.topic_id,
        'reply_id', NEW.id,
        'author_id', NEW.author_id,
        'author_username', reply_author_username
      )
    );
  END IF;
  
  RETURN NEW;
END;
$$;

-- 16. update_topic_stats
CREATE OR REPLACE FUNCTION public.update_topic_stats()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE topics
    SET reply_count = reply_count + 1,
        last_activity_at = NEW.created_at
    WHERE id = NEW.topic_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE topics
    SET reply_count = reply_count - 1
    WHERE id = OLD.topic_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$;

-- 17. update_user_security_score
CREATE OR REPLACE FUNCTION public.update_user_security_score(target_user_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  new_score INTEGER;
  score_factors JSONB;
  recommendations JSONB;
BEGIN
  new_score := calculate_user_security_score(target_user_id);
  
  score_factors := jsonb_build_object(
    'two_factor_auth', CASE WHEN EXISTS(SELECT 1 FROM user_2fa WHERE user_id = target_user_id AND is_enabled = true) THEN 30 ELSE 0 END,
    'password_security', 20,
    'session_management', 20,
    'base_security', 30
  );
  
  recommendations := '[]'::jsonb;
  
  IF NOT EXISTS(SELECT 1 FROM user_2fa WHERE user_id = target_user_id AND is_enabled = true) THEN
    recommendations := recommendations || '[{"type": "enable_2fa", "message": "Enable two-factor authentication", "priority": "high"}]'::jsonb;
  END IF;
  
  INSERT INTO user_security_scores (
    user_id, score, factors, recommendations
  ) VALUES (
    target_user_id, new_score, score_factors, recommendations
  );
END;
$$;

-- 18. award_category_points
CREATE OR REPLACE FUNCTION public.award_category_points(
  target_user_id uuid,
  category_name character varying,
  points_amount integer
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  category_record point_categories%ROWTYPE;
BEGIN
  SELECT * INTO category_record FROM point_categories WHERE name = category_name;
  
  IF NOT FOUND THEN
    RETURN false;
  END IF;
  
  INSERT INTO user_points (user_id, category_id, points)
  VALUES (target_user_id, category_record.id, points_amount)
  ON CONFLICT (user_id, category_id)
  DO UPDATE SET 
    points = user_points.points + points_amount,
    updated_at = now();
  
  PERFORM award_xp(target_user_id, points_amount, category_name || '_points');
  
  RETURN true;
END;
$$;

-- 19. update_user_streak
CREATE OR REPLACE FUNCTION public.update_user_streak(
  target_user_id uuid,
  p_streak_type character varying DEFAULT 'login'::character varying
)
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  current_streak_count INTEGER := 0;
  today_date DATE := CURRENT_DATE;
  existing_streak user_streaks%ROWTYPE;
BEGIN
  SELECT * INTO existing_streak 
  FROM user_streaks 
  WHERE user_id = target_user_id AND user_streaks.streak_type = p_streak_type;
  
  IF NOT FOUND THEN
    INSERT INTO user_streaks (user_id, current_streak, longest_streak, last_activity_date, streak_type)
    VALUES (target_user_id, 1, 1, today_date, p_streak_type)
    ON CONFLICT (user_id, streak_type) DO UPDATE SET
      current_streak = 1,
      longest_streak = GREATEST(user_streaks.longest_streak, 1),
      last_activity_date = today_date,
      updated_at = now();
    current_streak_count := 1;
  ELSE
    IF existing_streak.last_activity_date = today_date - INTERVAL '1 day' THEN
      current_streak_count := existing_streak.current_streak + 1;
      UPDATE user_streaks 
      SET current_streak = current_streak_count,
          longest_streak = GREATEST(longest_streak, current_streak_count),
          last_activity_date = today_date,
          updated_at = now()
      WHERE id = existing_streak.id;
    ELSIF existing_streak.last_activity_date = today_date THEN
      current_streak_count := existing_streak.current_streak;
    ELSE
      current_streak_count := 1;
      UPDATE user_streaks 
      SET current_streak = 1,
          last_activity_date = today_date,
          updated_at = now()
      WHERE id = existing_streak.id;
    END IF;
  END IF;
  
  RETURN current_streak_count;
END;
$$;

-- 20. get_client_ip
CREATE OR REPLACE FUNCTION public.get_client_ip()
RETURNS inet
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  headers jsonb;
  client_ip text;
BEGIN
  headers := current_setting('request.headers', true)::jsonb;
  
  client_ip := COALESCE(
    headers->>'x-forwarded-for',
    headers->>'x-real-ip',
    headers->>'cf-connecting-ip',
    '127.0.0.1'
  );
  
  IF position(',' in client_ip) > 0 THEN
    client_ip := trim(split_part(client_ip, ',', 1));
  END IF;
  
  RETURN client_ip::inet;
EXCEPTION
  WHEN OTHERS THEN
    RETURN '127.0.0.1'::inet;
END;
$$;

-- 21. verify_user_password
CREATE OR REPLACE FUNCTION public.verify_user_password(
  user_email text,
  password_to_verify text
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  user_exists boolean := false;
BEGIN
  SELECT EXISTS(
    SELECT 1 FROM auth.users WHERE email = user_email
  ) INTO user_exists;
  
  RETURN user_exists;
END;
$$;

-- 22. get_user_rank
CREATE OR REPLACE FUNCTION public.get_user_rank(user_id uuid)
RETURNS bigint
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  user_rank bigint;
BEGIN
  SELECT row_number INTO user_rank
  FROM (
    SELECT 
      user_id as id,
      ROW_NUMBER() OVER (ORDER BY reputation DESC, created_at ASC) as row_number
    FROM profiles
  ) ranked
  WHERE id = user_id;
  
  RETURN COALESCE(user_rank, 0);
END;
$$;