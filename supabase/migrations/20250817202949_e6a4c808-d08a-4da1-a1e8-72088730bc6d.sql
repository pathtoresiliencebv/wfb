-- Update existing supplier to ranking 1
UPDATE supplier_profiles 
SET ranking = 1 
WHERE business_name = 'KoninggHaze';

-- Update existing user profiles to be suppliers and create supplier profiles
UPDATE profiles 
SET role = 'supplier', username = 'silversupplier', display_name = 'Silver Supplier'
WHERE user_id = 'a089a3f6-0037-477b-98a9-5d20a4230a76';

INSERT INTO supplier_profiles (
  user_id, 
  business_name, 
  description, 
  contact_info, 
  stats, 
  features, 
  ranking, 
  is_active,
  contact_description,
  product_name
) VALUES (
  'a089a3f6-0037-477b-98a9-5d20a4230a76',
  'Silver Wiet Co',
  'Betrouwbare leverancier met uitstekende service en kwaliteitsproducten voor heel België.',
  '{"email": "info@silverwiet.be", "telegram": "@silverwiet", "wire": "@silverwiet"}'::jsonb,
  '{"customers": 650, "rating": 4.7, "delivery_time": "zelfde dag", "success_rate": 98}'::jsonb,
  ARRAY['Discrete levering', 'Kwaliteitsgarantie', 'Snelle service', 'Competitive prijzen'],
  2,
  true,
  'Stuur een bericht via Wire of Telegram voor snelle service.',
  'Wietproducten'
);

-- Create third supplier
UPDATE profiles 
SET role = 'supplier', username = 'bronzesupplier', display_name = 'Bronze Supplier'
WHERE user_id = '8b25e569-53cc-47c9-a4f9-acb16cac161c';

INSERT INTO supplier_profiles (
  user_id, 
  business_name, 
  description, 
  contact_info, 
  stats, 
  features, 
  ranking, 
  is_active,
  contact_description,
  product_name
) VALUES (
  '8b25e569-53cc-47c9-a4f9-acb16cac161c',
  'Bronze Cannabis',
  'Eerlijke prijzen en goede kwaliteit voor beginners en ervaren gebruikers.',
  '{"email": "contact@bronzecannabis.be", "telegram": "@bronzecannabis", "wire": "@bronzecannabis"}'::jsonb,
  '{"customers": 400, "rating": 4.4, "delivery_time": "1-2 dagen", "success_rate": 95}'::jsonb,
  ARRAY['Beginner-vriendelijk', 'Eerlijke prijzen', 'Goede kwaliteit', 'Betrouwbaar'],
  3,
  true,
  'Neem contact op via je favoriete messaging app voor bestelling.',
  'Cannabis'
);