-- Fix the admin user account and reset password
-- First, let's check if the admin user exists and fix any auth issues

-- Create or update admin user profile
INSERT INTO public.profiles (user_id, username, display_name, role, email, created_at, updated_at)
SELECT 
  au.id,
  'admin',
  'WietForum Admin',
  'admin',
  'info@wietforumbelgie.com',
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

-- Also ensure the admin profile exists even if user doesn't exist yet
-- This will be handled by the trigger when user signs up