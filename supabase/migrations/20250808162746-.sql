-- Create a function to create admin user and profile
CREATE OR REPLACE FUNCTION create_admin_user()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  admin_user_id UUID;
BEGIN
  -- Generate a UUID for the admin user
  admin_user_id := gen_random_uuid();
  
  -- Create the profile directly (since we can't insert into auth.users via SQL)
  INSERT INTO public.profiles (
    user_id,
    username,
    display_name,
    role,
    email,
    created_at,
    updated_at
  ) VALUES (
    admin_user_id,
    'wietforum-admin',
    'WietForum Admin',
    'admin',
    'info@wietforumbelgie.com',
    now(),
    now()
  ) ON CONFLICT (user_id) DO UPDATE SET
    role = 'admin',
    username = 'wietforum-admin',
    display_name = 'WietForum Admin',
    updated_at = now();
  
  -- Create user level record
  INSERT INTO public.user_levels (user_id, current_level, total_xp, xp_this_level, level_title)
  VALUES (admin_user_id, 1, 0, 0, 'Newbie')
  ON CONFLICT DO NOTHING;
  
  -- Create initial streak record
  INSERT INTO public.user_streaks (user_id, current_streak, longest_streak, last_activity_date, streak_type)
  VALUES (admin_user_id, 0, 0, CURRENT_DATE, 'login')
  ON CONFLICT DO NOTHING;
  
  -- Create privacy settings
  INSERT INTO public.user_privacy_settings (user_id, email_notifications, activity_tracking, data_sharing, marketing_emails, security_alerts, profile_visibility)
  VALUES (admin_user_id, true, true, false, false, true, 'public')
  ON CONFLICT DO NOTHING;
  
  RAISE NOTICE 'Admin user profile created with ID: %', admin_user_id;
  RAISE NOTICE 'Please register this user through the signup form with email: info@wietforumbelgie.com';
END;
$$;

-- Execute the function
SELECT create_admin_user();