-- Create a test supplier account
-- First insert into auth.users (simulated via profiles)
-- Create test supplier user
DO $$
DECLARE
  test_user_id UUID := 'b47ac10b-58cc-4372-a567-0e02b2c3d479'; -- Fixed UUID for consistency
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
    is_active,
    theme_color,
    delivery_areas,
    why_choose_us
  ) VALUES (
    test_user_id,
    'Test Cannabis Shop',
    'Een test leverancier voor ontwikkeling en testen van het platform.',
    jsonb_build_object(
      'email', 'leverancier@test.com',
      'telegram', '@testleverancier',
      'wire', 'testleverancier'
    ),
    jsonb_build_object(
      'customers', 150,
      'rating', 4.8,
      'delivery_time', '24-48 uur',
      'success_rate', 98.5,
      'strains', 25
    ),
    ARRAY['Snelle levering', 'Discreet', '24/7 support', 'Kwaliteitsgarantie'],
    85,
    true,
    '#10b981',
    ARRAY['België', 'Nederland'],
    ARRAY[
      'Meer dan 5 jaar ervaring',
      'Getest op kwaliteit en zuiverheid', 
      'Discrete verpakking',
      'Snelle en betrouwbare levering',
      '24/7 klantenservice'
    ]
  ) ON CONFLICT (user_id) DO UPDATE SET
    business_name = EXCLUDED.business_name,
    description = EXCLUDED.description,
    updated_at = now();

  -- Add some sample menu items
  INSERT INTO public.supplier_menu_items (
    supplier_id,
    name,
    description,
    price,
    unit,
    category,
    tags,
    is_available,
    position,
    weight_options,
    in_stock,
    pricing_tiers
  ) 
  SELECT 
    sp.id,
    item.name,
    item.description,
    item.price,
    item.unit,
    item.category,
    item.tags,
    true,
    item.position,
    item.weight_options,
    true,
    item.pricing_tiers
  FROM supplier_profiles sp,
  (VALUES 
    ('Purple Haze', 'Premium sativa strain met fruitige smaak', 12.50, 'gram', 'Sativa', ARRAY['premium', 'sativa', 'fruitig'], 1, ARRAY['1g', '2.5g', '5g', '10g'], '{"1g": 12.50, "2.5g": 30.00, "5g": 55.00, "10g": 100.00}'::jsonb),
    ('OG Kush', 'Klassieke indica voor ontspanning', 11.00, 'gram', 'Indica', ARRAY['klassiek', 'indica', 'ontspanning'], 2, ARRAY['1g', '2.5g', '5g', '10g'], '{"1g": 11.00, "2.5g": 26.00, "5g": 50.00, "10g": 90.00}'::jsonb),
    ('White Widow', 'Bekende hybrid met evenwichtige effecten', 10.50, 'gram', 'Hybrid', ARRAY['populair', 'hybrid', 'evenwichtig'], 3, ARRAY['1g', '2.5g', '5g', '10g'], '{"1g": 10.50, "2.5g": 25.00, "5g": 47.50, "10g": 85.00}'::jsonb)
  ) AS item(name, description, price, unit, category, tags, position, weight_options, pricing_tiers)
  WHERE sp.user_id = test_user_id
  ON CONFLICT DO NOTHING;

END $$;