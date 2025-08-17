-- Update existing supplier to ranking 1
UPDATE supplier_profiles 
SET ranking = 1 
WHERE business_name = 'KoninggHaze';

-- Update the testuser to be a supplier and create supplier profile
UPDATE profiles 
SET role = 'supplier', username = 'silversupplier', display_name = 'Silver Supplier'
WHERE user_id = 'deb3f841-298a-46b4-8105-df88801a27cf';

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
  'deb3f841-298a-46b4-8105-df88801a27cf',
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

-- Create a new profile for the admin to use as third supplier
INSERT INTO profiles (user_id, username, display_name, role)
VALUES ('803dac2a-19e0-4a7d-b2dd-305a057fa101', 'bronzesupplier', 'Bronze Supplier', 'supplier')
ON CONFLICT (user_id) DO UPDATE SET 
  username = 'bronzesupplier',
  display_name = 'Bronze Supplier',
  role = 'supplier';

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
  '803dac2a-19e0-4a7d-b2dd-305a057fa101',
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