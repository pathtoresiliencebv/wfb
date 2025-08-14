-- Create test accounts directly in auth.users table
-- Note: In production, passwords should be properly hashed. This is for development only.

-- First, let's create the test users in auth.users
-- We'll use a simplified approach for development

-- Insert admin user if not exists
INSERT INTO auth.users (
  id,
  instance_id,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  role,
  aud,
  confirmation_token,
  email_change_token_new,
  recovery_token,
  raw_app_meta_data,
  raw_user_meta_data
) VALUES (
  gen_random_uuid(),
  '00000000-0000-0000-0000-000000000000',
  'admin@test.com',
  crypt('admin123', gen_salt('bf')),
  now(),
  now(),
  now(),
  'authenticated',
  'authenticated',
  '',
  '',
  '',
  '{"provider": "email", "providers": ["email"]}',
  '{"username": "admin", "display_name": "Test Admin", "role": "admin"}'
) ON CONFLICT (email) DO NOTHING;

-- Insert leverancier user if not exists  
INSERT INTO auth.users (
  id,
  instance_id,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  role,
  aud,
  confirmation_token,
  email_change_token_new,
  recovery_token,
  raw_app_meta_data,
  raw_user_meta_data
) VALUES (
  gen_random_uuid(),
  '00000000-0000-0000-0000-000000000000',
  'leverancier@test.com',
  crypt('12345678', gen_salt('bf')),
  now(),
  now(),
  now(),
  'authenticated',
  'authenticated',
  '',
  '',
  '',
  '{"provider": "email", "providers": ["email"]}',
  '{"username": "leverancier", "display_name": "Test Leverancier", "role": "supplier"}'
) ON CONFLICT (email) DO NOTHING;

-- Insert testuser if not exists
INSERT INTO auth.users (
  id,
  instance_id,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  role,
  aud,
  confirmation_token,
  email_change_token_new,
  recovery_token,
  raw_app_meta_data,
  raw_user_meta_data
) VALUES (
  gen_random_uuid(),
  '00000000-0000-0000-0000-000000000000',
  'testuser@test.com',
  crypt('testuser123', gen_salt('bf')),
  now(),
  now(),
  now(),
  'authenticated',
  'authenticated',
  '',
  '',
  '',
  '{"provider": "email", "providers": ["email"]}',
  '{"username": "testuser", "display_name": "Test User", "role": "user"}'
) ON CONFLICT (email) DO NOTHING;

-- Now create profiles for these users using the trigger function
-- The trigger should handle this, but let's be explicit

-- Create admin profile
INSERT INTO public.profiles (user_id, username, display_name, role)
SELECT au.id, 'admin', 'Test Admin', 'admin'
FROM auth.users au 
WHERE au.email = 'admin@test.com'
AND NOT EXISTS (SELECT 1 FROM public.profiles p WHERE p.user_id = au.id);

-- Create leverancier profile  
INSERT INTO public.profiles (user_id, username, display_name, role)
SELECT au.id, 'leverancier', 'Test Leverancier', 'supplier'
FROM auth.users au 
WHERE au.email = 'leverancier@test.com'
AND NOT EXISTS (SELECT 1 FROM public.profiles p WHERE p.user_id = au.id);

-- Create testuser profile
INSERT INTO public.profiles (user_id, username, display_name, role)
SELECT au.id, 'testuser', 'Test User', 'user'
FROM auth.users au 
WHERE au.email = 'testuser@test.com'
AND NOT EXISTS (SELECT 1 FROM public.profiles p WHERE p.user_id = au.id);

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
  p.user_id,
  'Test Leverancier Business',
  'Test supplier account voor development',
  '{}',
  '{}',
  '{}',
  0,
  true
FROM public.profiles p
WHERE p.username = 'leverancier' AND p.role = 'supplier'
AND NOT EXISTS (SELECT 1 FROM public.supplier_profiles sp WHERE sp.user_id = p.user_id);