-- Create a test supplier account
DO $$
DECLARE
  test_user_id UUID := 'b47ac10b-58cc-4372-a567-0e02b2c3d479';
BEGIN
  -- Insert profile with supplier role
  INSERT INTO public.profiles (
    user_id, 
    username, 
    display_name, 
    role, 
    reputation,
    is_verified,
    created_at
  ) VALUES (
    test_user_id,
    'test-leverancier',
    'Test Leverancier',
    'supplier',
    100,
    true,
    now()
  ) ON CONFLICT (user_id) DO UPDATE SET
    role = 'supplier',
    updated_at = now();

  -- Create supplier profile
  INSERT INTO public.supplier_profiles (
    user_id,
    business_name,
    description,
    contact_info,
    stats,
    features,
    ranking,
    is_active
  ) VALUES (
    test_user_id,
    'Test Cannabis Shop',
    'Een test leverancier voor ontwikkeling en testen.',
    '{"email": "leverancier@test.com", "telegram": "@testleverancier"}'::jsonb,
    '{"customers": 150, "rating": 4.8, "delivery_time": "24-48 uur"}'::jsonb,
    ARRAY['Snelle levering', 'Discreet', '24/7 support'],
    85,
    true
  ) ON CONFLICT (user_id) DO UPDATE SET
    business_name = EXCLUDED.business_name,
    updated_at = now();

END $$;