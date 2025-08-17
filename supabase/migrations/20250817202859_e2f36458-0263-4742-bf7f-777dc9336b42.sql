-- Update existing supplier to ranking 1
UPDATE supplier_profiles 
SET ranking = 1 
WHERE business_name = 'KoninggHaze';

-- Insert test supplier for ranking 2
INSERT INTO profiles (user_id, username, display_name, role) 
VALUES (gen_random_uuid(), 'silversupplier', 'Silver Supplier', 'supplier');

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
) 
SELECT 
  p.user_id,
  'Silver Wiet Co',
  'Betrouwbare leverancier met uitstekende service en kwaliteitsproducten voor heel België.',
  '{"email": "info@silverwiet.be", "telegram": "@silverwiet", "wire": "@silverwiet"}'::jsonb,
  '{"customers": 650, "rating": 4.7, "delivery_time": "zelfde dag", "success_rate": 98}'::jsonb,
  '["Discrete levering", "Kwaliteitsgarantie", "Snelle service", "Competitive prijzen"]'::text[],
  2,
  true,
  'Stuur een bericht via Wire of Telegram voor snelle service.',
  'Wietproducten'
FROM profiles p 
WHERE p.username = 'silversupplier';

-- Insert test supplier for ranking 3
INSERT INTO profiles (user_id, username, display_name, role) 
VALUES (gen_random_uuid(), 'bronzesupplier', 'Bronze Supplier', 'supplier');

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
) 
SELECT 
  p.user_id,
  'Bronze Cannabis',
  'Eerlijke prijzen en goede kwaliteit voor beginners en ervaren gebruikers.',
  '{"email": "contact@bronzecannabis.be", "telegram": "@bronzecannabis", "wire": "@bronzecannabis"}'::jsonb,
  '{"customers": 400, "rating": 4.4, "delivery_time": "1-2 dagen", "success_rate": 95}'::jsonb,
  '["Beginner-vriendelijk", "Eerlijke prijzen", "Goede kwaliteit", "Betrouwbaar"]'::text[],
  3,
  true,
  'Neem contact op via je favoriete messaging app voor bestelling.',
  'Cannabis'
FROM profiles p 
WHERE p.username = 'bronzesupplier';