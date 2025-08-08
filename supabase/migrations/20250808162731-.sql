-- First, ensure the trigger exists for auto-creating profiles
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create the admin user account
INSERT INTO auth.users (
  id,
  email,
  encrypted_password,
  email_confirmed_at,
  raw_user_meta_data,
  created_at,
  updated_at,
  confirmation_token,
  email_change_token_new,
  recovery_token
) VALUES (
  gen_random_uuid(),
  'info@wietforumbelgie.com',
  crypt('Qwerty12345678!@', gen_salt('bf')),
  now(),
  jsonb_build_object(
    'username', 'wietforum-admin',
    'display_name', 'WietForum Admin',
    'role', 'admin'
  ),
  now(),
  now(),
  '',
  '',
  ''
) ON CONFLICT (email) DO NOTHING;

-- Get the user ID and update profile
DO $$
DECLARE
  admin_user_id UUID;
BEGIN
  -- Get the admin user ID
  SELECT id INTO admin_user_id 
  FROM auth.users 
  WHERE email = 'info@wietforumbelgie.com';
  
  -- Update the profile to ensure admin role is set
  UPDATE public.profiles 
  SET 
    role = 'admin',
    username = 'wietforum-admin',
    display_name = 'WietForum Admin',
    updated_at = now()
  WHERE user_id = admin_user_id;
  
  -- Create user level record if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM public.user_levels WHERE user_id = admin_user_id) THEN
    INSERT INTO public.user_levels (user_id, current_level, total_xp, xp_this_level, level_title)
    VALUES (admin_user_id, 1, 0, 0, 'Newbie');
  END IF;
  
  -- Create initial streak record if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM public.user_streaks WHERE user_id = admin_user_id AND streak_type = 'login') THEN
    INSERT INTO public.user_streaks (user_id, current_streak, longest_streak, last_activity_date, streak_type)
    VALUES (admin_user_id, 0, 0, CURRENT_DATE, 'login');
  END IF;
  
  -- Create privacy settings if they don't exist
  IF NOT EXISTS (SELECT 1 FROM public.user_privacy_settings WHERE user_id = admin_user_id) THEN
    INSERT INTO public.user_privacy_settings (user_id, email_notifications, activity_tracking, data_sharing, marketing_emails, security_alerts, profile_visibility)
    VALUES (admin_user_id, true, true, false, false, true, 'public');
  END IF;
  
END $$;