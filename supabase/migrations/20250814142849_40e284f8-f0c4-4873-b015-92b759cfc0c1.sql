-- Update admin account password (reset to 'admin123')
-- This updates the existing jason__m@outlook.com account
UPDATE auth.users 
SET encrypted_password = crypt('admin123', gen_salt('bf'))
WHERE email = 'jason__m@outlook.com';

-- Create leverancier account
INSERT INTO auth.users (
  id,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  raw_user_meta_data,
  role,
  aud
) VALUES (
  gen_random_uuid(),
  'leverancier@wietforumbelgie.com',
  crypt('12345678', gen_salt('bf')),
  now(),
  now(),
  now(),
  jsonb_build_object(
    'username', 'leverancier',
    'display_name', 'Test Leverancier',
    'role', 'supplier'
  ),
  'authenticated',
  'authenticated'
) ON CONFLICT (email) DO NOTHING;

-- Create testuser account
INSERT INTO auth.users (
  id,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  raw_user_meta_data,
  role,
  aud
) VALUES (
  gen_random_uuid(),
  'testuser@wietforumbelgie.com',
  crypt('testuser123', gen_salt('bf')),
  now(),
  now(),
  now(),
  jsonb_build_object(
    'username', 'testuser',
    'display_name', 'Test User',
    'role', 'user'
  ),
  'authenticated',
  'authenticated'
) ON CONFLICT (email) DO NOTHING;

-- Create profile for leverancier
INSERT INTO public.profiles (
  user_id,
  username,
  display_name,
  role,
  reputation,
  created_at,
  updated_at
) 
SELECT 
  u.id,
  'leverancier',
  'Test Leverancier',
  'supplier',
  100,
  now(),
  now()
FROM auth.users u 
WHERE u.email = 'leverancier@wietforumbelgie.com'
ON CONFLICT (user_id) DO NOTHING;

-- Create profile for testuser
INSERT INTO public.profiles (
  user_id,
  username,
  display_name,
  role,
  reputation,
  created_at,
  updated_at
) 
SELECT 
  u.id,
  'testuser',
  'Test User',
  'user',
  50,
  now(),
  now()
FROM auth.users u 
WHERE u.email = 'testuser@wietforumbelgie.com'
ON CONFLICT (user_id) DO NOTHING;

-- Create supplier profile for leverancier
INSERT INTO public.supplier_profiles (
  user_id,
  business_name,
  description,
  contact_info,
  stats,
  features,
  ranking,
  is_active,
  theme_color,
  delivery_areas,
  why_choose_us,
  created_at,
  updated_at
)
SELECT 
  u.id,
  'Test Leverancier BV',
  'Een test leverancier voor ontwikkeling en testing van het platform.',
  jsonb_build_object(
    'telegram', '@testleverancier',
    'email', 'leverancier@wietforumbelgie.com'
  ),
  jsonb_build_object(
    'customers', 25,
    'rating', 4.5,
    'delivery_time', '24-48u',
    'success_rate', 98,
    'strains', 15
  ),
  ARRAY['Snelle levering', 'Discrete verpakking', 'Premium kwaliteit'],
  1,
  true,
  '#10b981',
  ARRAY['Antwerpen', 'Gent', 'Brussel'],
  ARRAY['Ervaren leverancier sinds 2020', 'Uitstekende klantenservice', 'Breed assortiment'],
  now(),
  now()
FROM auth.users u 
WHERE u.email = 'leverancier@wietforumbelgie.com'
ON CONFLICT (user_id) DO NOTHING;