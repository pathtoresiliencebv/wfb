-- Fix the duplicate key constraint issue in user_streaks
-- First, make the constraint handle the combination properly
ALTER TABLE public.user_streaks DROP CONSTRAINT IF EXISTS user_streaks_user_id_key;
ALTER TABLE public.user_streaks ADD CONSTRAINT user_streaks_user_id_streak_type_key UNIQUE (user_id, streak_type);

-- Update the streak function to handle existing records properly
CREATE OR REPLACE FUNCTION public.update_user_streak(target_user_id uuid, streak_type character varying DEFAULT 'login'::character varying)
RETURNS integer
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
    -- Create new streak record with ON CONFLICT handling
    INSERT INTO user_streaks (user_id, current_streak, longest_streak, last_activity_date, streak_type)
    VALUES (target_user_id, 1, 1, today_date, streak_type)
    ON CONFLICT (user_id, streak_type) DO UPDATE SET
      current_streak = 1,
      longest_streak = GREATEST(user_streaks.longest_streak, 1),
      last_activity_date = today_date,
      updated_at = now();
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