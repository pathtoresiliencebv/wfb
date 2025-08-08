-- Clean up duplicate categories and fix data consistency
-- Keep only the categories with topics or the newer ones

-- Delete duplicate "Algemene Discussie" (keep the older "Algemeen" with topics)
DELETE FROM categories WHERE id = '9819e4be-762b-4198-95cb-712bb0385115';

-- Delete duplicate "Growtips & Technieken" (keep the older "Growtips" with topics)
DELETE FROM categories WHERE id = 'd07ec2bf-5f15-405d-ba5a-b7fedb48d2b6';

-- Delete duplicate "Community" (no topics)
DELETE FROM categories WHERE id = 'a2158f93-5f62-4748-88e4-16ba4b772251';

-- Delete duplicate "Medisch Cannabis" (keep the older "Medical" with topics)
DELETE FROM categories WHERE id = 'f09edf9b-fe79-44f6-808d-9ab0f592944f';

-- Delete duplicate "Wet & Regelgeving" (keep the older "Wetgeving")
DELETE FROM categories WHERE id = '3797e7e4-8902-444b-a4fd-af95872b7e6b';

-- Delete duplicate "Strain Reviews" (keep the older "Reviews")
DELETE FROM categories WHERE id = '3d0ad77d-33fb-4ec4-9589-55d71b263868';

-- Update sort_order to be unique and consecutive
UPDATE categories SET sort_order = 1 WHERE slug = 'algemeen';
UPDATE categories SET sort_order = 2 WHERE slug = 'growtips';
UPDATE categories SET sort_order = 3 WHERE slug = 'strains';
UPDATE categories SET sort_order = 4 WHERE slug = 'medical';
UPDATE categories SET sort_order = 5 WHERE slug = 'reviews';
UPDATE categories SET sort_order = 6 WHERE slug = 'wetgeving';

-- Add a "Teelt" category since the user is trying to access /forums/teelt
INSERT INTO categories (name, description, slug, icon, color, sort_order, is_active) VALUES
('Teelt', 'Alles over het telen en kweken van cannabis', 'teelt', 'TrendingUp', '#059669', 7, true)
ON CONFLICT (slug) DO NOTHING;