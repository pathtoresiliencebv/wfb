-- Create test leverancier account and profile data

-- First, create a user (this would normally be done through signup)
-- We'll create the profile directly since we can't create auth users via SQL

INSERT INTO public.profiles (
  user_id,
  username, 
  display_name,
  email,
  role,
  reputation,
  is_verified,
  bio,
  created_at,
  updated_at
) VALUES (
  gen_random_uuid(),
  'leverancier',
  'Cannabis Shop Amsterdam',
  'leverancier@cannabisshop.be',
  'supplier',
  150,
  true,
  'Premium cannabis leverancier met 5+ jaar ervaring in België. Kwaliteit gegarandeerd!',
  now(),
  now()
) 
ON CONFLICT (username) DO UPDATE SET
  display_name = EXCLUDED.display_name,
  role = EXCLUDED.role,
  reputation = EXCLUDED.reputation,
  is_verified = EXCLUDED.is_verified,
  bio = EXCLUDED.bio;

-- Get the user_id we just created/updated
DO $$
DECLARE
  supplier_user_id uuid;
  supplier_profile_id uuid;
BEGIN
  -- Get the user_id for username 'leverancier'
  SELECT user_id INTO supplier_user_id 
  FROM public.profiles 
  WHERE username = 'leverancier';
  
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
    banner_image,
    logo_image,
    theme_color,
    delivery_areas,
    opening_hours,
    minimum_order,
    delivery_fee,
    why_choose_us,
    created_at,
    updated_at
  ) VALUES (
    supplier_user_id,
    'Cannabis Shop Amsterdam',
    'Welkom bij Cannabis Shop Amsterdam! Wij zijn een premium cannabis leverancier met meer dan 5 jaar ervaring in de Belgische markt. Ons team bestaat uit echte cannabis experts die alleen de beste kwaliteit producten selecteren voor onze klanten.',
    jsonb_build_object(
      'telegram', '@cannabisshop_be',
      'wire', '@cannabis_amsterdam',
      'email', 'info@cannabisshop.be'
    ),
    jsonb_build_object(
      'customers', 850,
      'rating', 4.8,
      'delivery_time', '2-24 uur',
      'success_rate', 98,
      'strains', 35
    ),
    ARRAY[
      'Discrete levering',
      'Lab getest',
      '24/7 klantenservice',
      'Gratis bezorging boven €50',
      'Geld terug garantie',
      'Premium kwaliteit',
      'Snelle levering',
      'Veilige betaling'
    ],
    1,
    true,
    'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800&h=400&fit=crop',
    'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=200&h=200&fit=crop',
    '#10b981',
    ARRAY[
      'Amsterdam',
      'Rotterdam',
      'Den Haag',
      'Utrecht',
      'Eindhoven',
      'Groningen',
      'Antwerpen',
      'Brussel',
      'Gent',
      'Luik'
    ],
    jsonb_build_object(
      'monday', jsonb_build_object('open', '09:00', 'close', '22:00'),
      'tuesday', jsonb_build_object('open', '09:00', 'close', '22:00'),
      'wednesday', jsonb_build_object('open', '09:00', 'close', '22:00'),
      'thursday', jsonb_build_object('open', '09:00', 'close', '22:00'),
      'friday', jsonb_build_object('open', '09:00', 'close', '23:00'),
      'saturday', jsonb_build_object('open', '10:00', 'close', '23:00'),
      'sunday', jsonb_build_object('open', '12:00', 'close', '21:00')
    ),
    25.00,
    0,
    ARRAY[
      'Hoogste kwaliteit cannabis producten',
      'Discrete en snelle levering',
      'Lab getest voor puurheid en potentie',
      '5+ jaar ervaring in de markt',
      'Uitstekende klantenservice',
      'Competitieve prijzen',
      'Ruim assortiment strains',
      'Veilige en betrouwbare service'
    ],
    now(),
    now()
  )
  ON CONFLICT (user_id) DO UPDATE SET
    business_name = EXCLUDED.business_name,
    description = EXCLUDED.description,
    contact_info = EXCLUDED.contact_info,
    stats = EXCLUDED.stats,
    features = EXCLUDED.features,
    banner_image = EXCLUDED.banner_image,
    logo_image = EXCLUDED.logo_image,
    theme_color = EXCLUDED.theme_color,
    delivery_areas = EXCLUDED.delivery_areas,
    opening_hours = EXCLUDED.opening_hours,
    minimum_order = EXCLUDED.minimum_order,
    delivery_fee = EXCLUDED.delivery_fee,
    why_choose_us = EXCLUDED.why_choose_us,
    updated_at = now();
  
  -- Get the supplier profile ID
  SELECT id INTO supplier_profile_id 
  FROM public.supplier_profiles 
  WHERE user_id = supplier_user_id;
  
  -- Create supplier categories
  INSERT INTO public.supplier_categories (
    supplier_id,
    name,
    description,
    sort_order,
    is_active
  ) VALUES 
    (supplier_profile_id, 'Indica Strains', 'Ontspannende indica dominant strains', 1, true),
    (supplier_profile_id, 'Sativa Strains', 'Energieke sativa dominant strains', 2, true),
    (supplier_profile_id, 'Hybrid Strains', 'Gebalanceerde hybrid strains', 3, true),
    (supplier_profile_id, 'CBD Producten', 'Hoog CBD, laag THC producten', 4, true),
    (supplier_profile_id, 'Concentraten', 'Wax, shatter en andere concentraten', 5, true),
    (supplier_profile_id, 'Edibles', 'Cannabis eetbare producten', 6, true)
  ON CONFLICT (supplier_id, name) DO NOTHING;
  
  -- Create menu items
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
    pricing_tiers,
    weight_options,
    in_stock,
    image_url
  ) VALUES 
    -- Indica Strains
    (supplier_profile_id, 'Purple Kush', 'Premium indica strain met diepe ontspanning en zoete smaak', 12.50, 'gram', 'Indica Strains', ARRAY['indica', 'ontspannend', 'premium'], true, 1, 
     jsonb_build_object('1g', 12.50, '2.5g', 28.00, '5g', 50.00, '10g', 90.00), 
     ARRAY['1g', '2.5g', '5g', '10g'], true, 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&h=200&fit=crop'),
    
    (supplier_profile_id, 'Northern Lights', 'Klassieke indica met krachtige body high en aardse smaak', 11.00, 'gram', 'Indica Strains', ARRAY['indica', 'klassiek', 'krachtig'], true, 2,
     jsonb_build_object('1g', 11.00, '2.5g', 25.00, '5g', 45.00, '10g', 80.00),
     ARRAY['1g', '2.5g', '5g', '10g'], true, 'https://images.unsplash.com/photo-1530023367847-a683933f4172?w=300&h=200&fit=crop'),
    
    -- Sativa Strains  
    (supplier_profile_id, 'Green Crack', 'Energieke sativa perfect voor overdag gebruik', 13.00, 'gram', 'Sativa Strains', ARRAY['sativa', 'energiek', 'overdag'], true, 3,
     jsonb_build_object('1g', 13.00, '2.5g', 30.00, '5g', 55.00, '10g', 100.00),
     ARRAY['1g', '2.5g', '5g', '10g'], true, 'https://images.unsplash.com/photo-1605007493699-57108c4de6a5?w=300&h=200&fit=crop'),
    
    (supplier_profile_id, 'Amnesia Haze', 'Populaire sativa met citrus smaak en creatieve high', 14.00, 'gram', 'Sativa Strains', ARRAY['sativa', 'citrus', 'creatief'], true, 4,
     jsonb_build_object('1g', 14.00, '2.5g', 32.00, '5g', 60.00, '10g', 110.00),
     ARRAY['1g', '2.5g', '5g', '10g'], true, 'https://images.unsplash.com/photo-1564445636448-02f3bfc7b373?w=300&h=200&fit=crop'),
    
    -- Hybrid Strains
    (supplier_profile_id, 'Blue Dream', 'Gebalanceerde hybrid met zoete bes smaak', 12.00, 'gram', 'Hybrid Strains', ARRAY['hybrid', 'gebalanceerd', 'zoet'], true, 5,
     jsonb_build_object('1g', 12.00, '2.5g', 27.00, '5g', 48.00, '10g', 85.00),
     ARRAY['1g', '2.5g', '5g', '10g'], true, 'https://images.unsplash.com/photo-1536964549204-7cb9eaa11109?w=300&h=200&fit=crop'),
    
    (supplier_profile_id, 'White Widow', 'Legendarische hybrid met krachtige effecten', 13.50, 'gram', 'Hybrid Strains', ARRAY['hybrid', 'legendarisch', 'krachtig'], true, 6,
     jsonb_build_object('1g', 13.50, '2.5g', 31.00, '5g', 58.00, '10g', 105.00),
     ARRAY['1g', '2.5g', '5g', '10g'], true, 'https://images.unsplash.com/photo-1571019613549-83994aa01e41?w=300&h=200&fit=crop'),
    
    -- CBD Producten
    (supplier_profile_id, 'CBD Dominant 20:1', 'Hoog CBD product met minimaal THC', 15.00, 'gram', 'CBD Producten', ARRAY['cbd', 'medicinaal', 'laag-thc'], true, 7,
     jsonb_build_object('1g', 15.00, '2.5g', 35.00, '5g', 65.00, '10g', 120.00),
     ARRAY['1g', '2.5g', '5g', '10g'], true, 'https://images.unsplash.com/photo-1581126036849-29e5eaa5b4e1?w=300&h=200&fit=crop'),
    
    -- Concentraten
    (supplier_profile_id, 'Premium Wax', 'Hoogwaardige cannabis wax voor verdampen', 45.00, 'gram', 'Concentraten', ARRAY['wax', 'concentraat', 'premium'], true, 8,
     jsonb_build_object('0.5g', 25.00, '1g', 45.00, '2g', 80.00),
     ARRAY['0.5g', '1g', '2g'], true, 'https://images.unsplash.com/photo-1627389955262-2c4e9f9e2fc5?w=300&h=200&fit=crop'),
    
    (supplier_profile_id, 'Live Resin', 'Verse live resin met volle terpeen profiel', 55.00, 'gram', 'Concentraten', ARRAY['live-resin', 'terpenen', 'vers'], true, 9,
     jsonb_build_object('0.5g', 30.00, '1g', 55.00, '2g', 100.00),
     ARRAY['0.5g', '1g', '2g'], true, 'https://images.unsplash.com/photo-1607822973503-9c7b27fb4d78?w=300&h=200&fit=crop'),
    
    -- Edibles
    (supplier_profile_id, 'Space Brownies', 'Klassieke cannabis brownies (25mg THC per stuk)', 8.00, 'stuk', 'Edibles', ARRAY['edibles', 'brownies', '25mg'], true, 10,
     jsonb_build_object('1 stuk', 8.00, '4 stuks', 28.00, '8 stuks', 50.00),
     ARRAY['1 stuk', '4 stuks', '8 stuks'], true, 'https://images.unsplash.com/photo-1586444248902-2f64eddc13df?w=300&h=200&fit=crop'),
    
    (supplier_profile_id, 'Gummy Bears', 'Fruity cannabis gummies (10mg THC per stuk)', 3.50, 'stuk', 'Edibles', ARRAY['edibles', 'gummies', '10mg'], true, 11,
     jsonb_build_object('1 stuk', 3.50, '10 stuks', 30.00, '25 stuks', 65.00),
     ARRAY['1 stuk', '10 stuks', '25 stuks'], true, 'https://images.unsplash.com/photo-1602736587423-b11e729af553?w=300&h=200&fit=crop')
  ON CONFLICT (supplier_id, name) DO NOTHING;
END $$;