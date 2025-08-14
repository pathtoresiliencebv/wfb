-- Create test admin user
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
  'admin@wietforum.com',
  crypt('admin123', gen_salt('bf')),
  now(),
  '{"provider": "email", "providers": ["email"]}',
  '{"username": "admin", "display_name": "Administrator"}',
  now(),
  now(),
  '',
  '',
  '',
  ''
);

-- Create test supplier user
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
  'leverancier@test.com',
  crypt('12345678', gen_salt('bf')),
  now(),
  '{"provider": "email", "providers": ["email"]}',
  '{"username": "leverancier", "display_name": "Test Leverancier"}',
  now(),
  now(),
  '',
  '',
  '',
  ''
);

-- Create profiles for these users
INSERT INTO public.profiles (user_id, username, display_name, role, email)
SELECT u.id, 'admin', 'Administrator', 'admin', u.email 
FROM auth.users u WHERE u.email = 'admin@wietforum.com';

INSERT INTO public.profiles (user_id, username, display_name, role, email)
SELECT u.id, 'leverancier', 'Test Leverancier', 'supplier', u.email 
FROM auth.users u WHERE u.email = 'leverancier@test.com';

-- Update supplier_profiles to link to the correct user
UPDATE public.supplier_profiles 
SET user_id = (SELECT id FROM auth.users WHERE email = 'leverancier@test.com')
WHERE business_name = 'Test Leverancier';