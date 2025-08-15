-- Fix RLS infinite recursion by creating security definer function
CREATE OR REPLACE FUNCTION public.get_current_user_role()
RETURNS TEXT
LANGUAGE SQL
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
  SELECT role FROM public.profiles WHERE user_id = auth.uid();
$$;

-- Drop the problematic recursive policy
DROP POLICY IF EXISTS "Admins can view profiles for moderation" ON public.profiles;

-- Create new non-recursive policy using security definer function
CREATE POLICY "Admins can view profiles for moderation"
ON public.profiles
FOR SELECT
USING (public.get_current_user_role() = 'admin');

-- Create missing test accounts in auth.users
INSERT INTO auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  raw_app_meta_data,
  raw_user_meta_data,
  created_at,
  updated_at,
  confirmation_token,
  email_change,
  email_change_token_new,
  recovery_token
) VALUES 
-- Admin account
(
  '00000000-0000-0000-0000-000000000000',
  gen_random_uuid(),
  'authenticated',
  'authenticated',
  'admin@wietforumbelgie.com',
  crypt('admin123', gen_salt('bf')),
  now(),
  '{"provider":"email","providers":["email"]}',
  '{"username":"admin","display_name":"Administrator","role":"admin"}',
  now(),
  now(),
  '',
  '',
  '',
  ''
),
-- Supplier account  
(
  '00000000-0000-0000-0000-000000000000',
  gen_random_uuid(),
  'authenticated',
  'authenticated',
  'leverancier@wietforumbelgie.com',
  crypt('12345678', gen_salt('bf')),
  now(),
  '{"provider":"email","providers":["email"]}',
  '{"username":"leverancier","display_name":"Leverancier","role":"supplier"}',
  now(),
  now(),
  '',
  '',
  '',
  ''
),
-- Test user account
(
  '00000000-0000-0000-0000-000000000000',
  gen_random_uuid(),
  'authenticated',
  'authenticated',
  'testuser@wietforumbelgie.com',
  crypt('testuser123', gen_salt('bf')),
  now(),
  '{"provider":"email","providers":["email"]}',
  '{"username":"testuser","display_name":"Test User","role":"user"}',
  now(),
  now(),
  '',
  '',
  '',
  ''
)
ON CONFLICT (email) DO NOTHING;