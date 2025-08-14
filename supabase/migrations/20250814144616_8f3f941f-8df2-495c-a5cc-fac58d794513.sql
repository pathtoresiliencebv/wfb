-- Create test accounts for development
-- This creates the missing accounts that users are trying to log in with

-- Insert test accounts into auth.users
-- Note: Passwords will be hashed by Supabase auth system
-- We'll use the auth.users table to create accounts with specific emails

-- Create admin account
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
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  gen_random_uuid(),
  'authenticated',
  'authenticated',
  'admin@wietforumbelgie.com',
  crypt('admin123', gen_salt('bf')),
  now(),
  '{"provider": "email", "providers": ["email"]}',
  '{"role": "admin"}',
  now(),
  now(),
  '',
  '',
  '',
  ''
) ON CONFLICT (email) DO NOTHING;

-- Create leverancier account  
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
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  gen_random_uuid(),
  'authenticated',
  'authenticated',
  'leverancier@wietforumbelgie.com',
  crypt('12345678', gen_salt('bf')),
  now(),
  '{"provider": "email", "providers": ["email"]}',
  '{"role": "supplier"}',
  now(),
  now(),
  '',
  '',
  '',
  ''
) ON CONFLICT (email) DO NOTHING;

-- Create testuser account
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
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  gen_random_uuid(),
  'authenticated',
  'authenticated',
  'testuser@wietforumbelgie.com',
  crypt('testuser123', gen_salt('bf')),
  now(),
  '{"provider": "email", "providers": ["email"]}',
  '{"role": "user"}',
  now(),
  now(),
  '',
  '',
  '',
  ''
) ON CONFLICT (email) DO NOTHING;

-- Create profiles for test accounts
-- Admin profile
INSERT INTO public.profiles (user_id, username, display_name, role, email)
SELECT 
  au.id,
  'admin',
  'WietForum Admin',
  'admin',
  'admin@wietforumbelgie.com'
FROM auth.users au 
WHERE au.email = 'admin@wietforumbelgie.com'
ON CONFLICT (user_id) DO UPDATE SET
  role = EXCLUDED.role,
  email = EXCLUDED.email;

-- Leverancier profile
INSERT INTO public.profiles (user_id, username, display_name, role, email)
SELECT 
  au.id,
  'leverancier',
  'Test Leverancier',
  'supplier',
  'leverancier@wietforumbelgie.com'
FROM auth.users au 
WHERE au.email = 'leverancier@wietforumbelgie.com'
ON CONFLICT (user_id) DO UPDATE SET
  role = EXCLUDED.role,
  email = EXCLUDED.email;

-- Test user profile
INSERT INTO public.profiles (user_id, username, display_name, role, email)
SELECT 
  au.id,
  'testuser',
  'Test User',
  'user',
  'testuser@wietforumbelgie.com'
FROM auth.users au 
WHERE au.email = 'testuser@wietforumbelgie.com'
ON CONFLICT (user_id) DO UPDATE SET
  role = EXCLUDED.role,
  email = EXCLUDED.email;

-- Create supplier profile for leverancier
INSERT INTO public.supplier_profiles (
  user_id,
  business_name,
  description,
  contact_info,
  stats,
  features,
  ranking,
  is_active
)
SELECT 
  au.id,
  'Test Leverancier BV',
  'Test supplier voor development doeleinden',
  '{"phone": "+32 123 456 789", "website": "https://testleverancier.be"}',
  '{"orders_completed": 0, "rating": 5.0, "reviews_count": 0}',
  '["delivery", "pickup", "online_payment"]',
  1,
  true
FROM auth.users au 
WHERE au.email = 'leverancier@wietforumbelgie.com'
ON CONFLICT (user_id) DO UPDATE SET
  business_name = EXCLUDED.business_name,
  description = EXCLUDED.description;

-- Create privacy settings for test accounts
INSERT INTO public.user_privacy_settings (user_id, profile_visibility)
SELECT au.id, 'public'
FROM auth.users au 
WHERE au.email IN ('admin@wietforumbelgie.com', 'leverancier@wietforumbelgie.com', 'testuser@wietforumbelgie.com')
ON CONFLICT (user_id) DO NOTHING;