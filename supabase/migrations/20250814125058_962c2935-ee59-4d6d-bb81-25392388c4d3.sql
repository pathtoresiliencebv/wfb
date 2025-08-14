-- Clean up existing test data and create proper test supplier setup
-- First, clean up any existing test data
DELETE FROM public.supplier_menu_items WHERE supplier_id IN (
  SELECT id FROM public.supplier_profiles WHERE business_name = 'Cannabis Shop Amsterdam'
);
DELETE FROM public.supplier_categories WHERE supplier_id IN (
  SELECT id FROM public.supplier_profiles WHERE business_name = 'Cannabis Shop Amsterdam'
);
DELETE FROM public.supplier_profiles WHERE business_name = 'Cannabis Shop Amsterdam';
DELETE FROM public.profiles WHERE username = 'leverancier';

-- Create a profile for the test leverancier (user will need to register first with email leverancier@test.com)
-- This will be linked once the user registers
INSERT INTO public.profiles (
  id, -- We'll use a fixed UUID that we can reference
  username,
  display_name,
  role,
  reputation,
  created_at
) VALUES (
  '11111111-1111-1111-1111-111111111111'::uuid,
  'leverancier',
  'Cannabis Shop Amsterdam',
  'supplier',
  100,
  now()
);

-- Create the supplier profile linked to the test profile
INSERT INTO public.supplier_profiles (
  id,
  user_id,
  business_name,
  description,
  contact_info,
  stats,
  features,
  ranking,
  is_active,
  banner_image,
  theme_color,
  delivery_areas,
  why_choose_us,
  opening_hours,
  minimum_order,
  delivery_fee
) VALUES (
  gen_random_uuid(),
  '11111111-1111-1111-1111-111111111111'::uuid,
  'Cannabis Shop Amsterdam',
  'Welkom bij Cannabis Shop Amsterdam - jouw betrouwbare leverancier voor premium cannabis producten. Wij bieden een uitgebreid assortiment van hoogwaardige wiet, hash en accessoires. Al sinds 2020 zorgen wij voor discrete en snelle levering in heel Nederland.',
  '{"telegram": "@cannabisshopams", "whatsapp": "+31612345678", "email": "info@cannabisshopams.nl"}'::jsonb,
  '{"customers": 450, "rating": 4.8, "reviews": 89, "orders": 1250}'::jsonb,
  ARRAY['Snelle levering', 'Discrete verpakking', 'Premium kwaliteit', '24/7 klantenservice', 'Lab getest', 'Geld terug garantie'],
  95,
  true,
  null,
  '#10b981',
  ARRAY['Amsterdam', 'Den Haag', 'Rotterdam', 'Utrecht', 'Eindhoven'],
  ARRAY['Meer dan 3 jaar ervaring', 'Alleen premium kwaliteit', 'Discrete en snelle levering', 'Uitstekende klantenservice', '24/7 beschikbaar'],
  '{"monday": "09:00-22:00", "tuesday": "09:00-22:00", "wednesday": "09:00-22:00", "thursday": "09:00-22:00", "friday": "09:00-22:00", "saturday": "10:00-22:00", "sunday": "12:00-20:00"}'::jsonb,
  25.00,
  5.50
);

-- Create categories for the supplier
WITH supplier_id AS (
  SELECT id FROM public.supplier_profiles WHERE user_id = '11111111-1111-1111-1111-111111111111'::uuid
)
INSERT INTO public.supplier_categories (supplier_id, name, description, sort_order, is_active) 
SELECT 
  supplier_id.id,
  category_name,
  category_desc,
  category_order,
  true
FROM supplier_id,
(VALUES 
  ('Wiet/Bloemen', 'Verse en gedroogde cannabis bloemen van premium kwaliteit', 1),
  ('Hash/Hasjiesj', 'Verschillende soorten hash en concentraten', 2),
  ('Edibles', 'Cannabis eetbare producten zoals brownies en gummies', 3),
  ('Accessoires', 'Grinders, papers, tips en andere rookaccessoires', 4),
  ('CBD Producten', 'CBD oliën, crèmes en andere therapeutische producten', 5)
) AS categories(category_name, category_desc, category_order);

-- Create menu items for the supplier  
WITH supplier_data AS (
  SELECT id as supplier_id FROM public.supplier_profiles WHERE user_id = '11111111-1111-1111-1111-111111111111'::uuid
),
category_data AS (
  SELECT sc.id as category_id, sc.name as category_name, sp.id as supplier_id
  FROM public.supplier_categories sc
  JOIN public.supplier_profiles sp ON sc.supplier_id = sp.id
  WHERE sp.user_id = '11111111-1111-1111-1111-111111111111'::uuid
)
INSERT INTO public.supplier_menu_items (
  supplier_id, name, description, price, unit, category, tags, weight_options, is_available, in_stock, position, category_id
)
SELECT 
  cd.supplier_id,
  item_name,
  item_description,
  item_price,
  'gram',
  cd.category_name,
  item_tags,
  ARRAY['1g', '2.5g', '5g', '10g', '25g', '50g']::text[],
  true,
  true,
  item_position,
  cd.category_id
FROM category_data cd,
(VALUES 
  -- Wiet/Bloemen
  ('Wiet/Bloemen', 'Amnesia Haze', 'Klassieke sativa dominant strain met een frisse, citrusachtige smaak', 12.50, ARRAY['sativa', 'energiek', 'citrus'], 1),
  ('Wiet/Bloemen', 'White Widow', 'Bekende hybrid strain met uitgebalanceerde effecten', 11.00, ARRAY['hybrid', 'uitgebalanceerd', 'classic'], 2),
  ('Wiet/Bloemen', 'OG Kush', 'Premium indica met krachtige ontspannende effecten', 14.00, ARRAY['indica', 'ontspannend', 'premium'], 3),
  ('Wiet/Bloemen', 'Purple Haze', 'Iconische strain met unieke paarse kleuren', 13.50, ARRAY['sativa', 'creatief', 'iconisch'], 4),
  
  -- Hash/Hasjiesj
  ('Hash/Hasjiesj', 'Marokkaanse Hash', 'Traditionele Marokkaanse hash van hoge kwaliteit', 18.00, ARRAY['traditioneel', 'marokko', 'classic'], 5),
  ('Hash/Hasjiesj', 'Afghaanse Hash', 'Donkere, krachtige hash uit Afghanistan', 22.00, ARRAY['afghanistaan', 'krachtig', 'donker'], 6),
  ('Hash/Hasjiesj', 'Bubble Hash', 'Premium ice-o-lator hash met hoge potentie', 35.00, ARRAY['premium', 'ice-o-lator', 'potent'], 7),
  
  -- Edibles
  ('Edibles', 'Space Brownies', 'Heerlijke brownies met 25mg THC per stuk', 8.50, ARRAY['brownie', '25mg', 'sweet'], 8),
  ('Edibles', 'Cannabis Gummies', 'Fruitige gummies met 10mg THC per stuk (5 stuks)', 15.00, ARRAY['gummy', '10mg', 'fruit'], 9),
  ('Edibles', 'Weed Cookies', 'Chocolade chip cookies met cannabis', 6.00, ARRAY['cookie', 'chocolade', 'classic'], 10),
  
  -- Accessoires  
  ('Accessoires', 'Premium Grinder', 'Hoogwaardige aluminium grinder met 4 compartimenten', 25.00, ARRAY['grinder', 'aluminium', '4-delig'], 11),
  ('Accessoires', 'Rolling Papers', 'OCB premium rolling papers (50 stuks)', 3.50, ARRAY['papers', 'ocb', 'rolling'], 12),
  ('Accessoires', 'Glass Pipe', 'Handgeblazen glazen pijp voor droge kruiden', 18.00, ARRAY['pipe', 'glas', 'handgemaakt'], 13),
  
  -- CBD Producten
  ('CBD Producten', 'CBD Olie 10%', 'Hoogwaardige CBD olie met 10% CBD (10ml)', 45.00, ARRAY['cbd', '10%', 'olie'], 14),
  ('CBD Producten', 'CBD Creme', 'Verzorgende CBD crème voor lokale toepassing', 28.00, ARRAY['cbd', 'creme', 'verzorging'], 15),
  ('CBD Producten', 'CBD Capsules', 'Gemakkelijke CBD capsules, 25mg per capsule (30 stuks)', 55.00, ARRAY['cbd', 'capsules', '25mg'], 16)
) AS items(category_name, item_name, item_description, item_price, item_tags, item_position)
WHERE cd.category_name = items.category_name;