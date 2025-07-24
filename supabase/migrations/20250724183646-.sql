-- Insert initial forum categories
INSERT INTO public.categories (name, description, slug, color, sort_order, is_active) VALUES
('Wetgeving & Nieuws', 'Actuele ontwikkelingen in de cannabiswetgeving en nieuwsberichten', 'wetgeving', 'bg-blue-500', 1, true),
('Medicinaal Gebruik', 'Informatie over medicinaal cannabisgebruik, CBD, en therapeutische toepassingen', 'medicinaal', 'bg-green-500', 2, true),
('Teelt & Horticultuur', 'Tips, tricks en discussies over het kweken van cannabis', 'teelt', 'bg-emerald-500', 3, true),
('Harm Reduction', 'Veilig gebruik, risicovermindering en gezondheidsadvies', 'harm-reduction', 'bg-orange-500', 4, true),
('Community', 'Algemene discussies, introductions en community events', 'community', 'bg-purple-500', 5, true);

-- Insert sample topics (using dummy UUIDs for now, real users would need to create these)
INSERT INTO public.topics (title, content, category_id, author_id, is_pinned, view_count, reply_count)
SELECT 
  'Welkom bij Wietforum België!',
  'Dit is ons welkomstbericht. Hier vind je alle informatie om te starten.',
  c.id,
  '00000000-0000-0000-0000-000000000001'::uuid,
  true,
  1500,
  25
FROM public.categories c WHERE c.slug = 'community'
LIMIT 1;

INSERT INTO public.topics (title, content, category_id, author_id, view_count, reply_count)
SELECT 
  'Nieuwe CBD wetgeving - Update 2024',
  'Overzicht van de nieuwste ontwikkelingen in de CBD wetgeving.',
  c.id,
  '00000000-0000-0000-0000-000000000001'::uuid,
  980,
  12
FROM public.categories c WHERE c.slug = 'wetgeving'
LIMIT 1;

INSERT INTO public.topics (title, content, category_id, author_id, view_count, reply_count)
SELECT 
  'LED groeilampen: Welke zijn het beste?',
  'Discussie over de beste LED lampen voor indoor teelt.',
  c.id,
  '00000000-0000-0000-0000-000000000001'::uuid,
  750,
  8
FROM public.categories c WHERE c.slug = 'teelt'
LIMIT 1;