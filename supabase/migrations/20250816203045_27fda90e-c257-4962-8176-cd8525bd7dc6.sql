-- Fix the admin user account 
-- Create or update admin user profile without email column
INSERT INTO public.profiles (user_id, username, display_name, role, created_at, updated_at)
SELECT 
  au.id,
  'admin',
  'WietForum Admin',
  'admin',
  now(),
  now()
FROM auth.users au
WHERE au.email = 'info@wietforumbelgie.com'
ON CONFLICT (user_id) 
DO UPDATE SET 
  role = 'admin',
  username = 'admin',
  display_name = 'WietForum Admin',
  updated_at = now();