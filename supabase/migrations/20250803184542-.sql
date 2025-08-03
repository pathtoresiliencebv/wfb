-- Insert initial categories for Wiet Forum België
INSERT INTO public.categories (name, description, slug, color, icon, sort_order, is_active) VALUES
('Algemene Discussie', 'Algemene gesprekken over cannabis en gerelateerde onderwerpen', 'algemene-discussie', '#10b981', 'MessageSquare', 1, true),
('Teelt & Growen', 'Alles over het kweken van cannabis planten', 'teelt-growen', '#f59e0b', 'Leaf', 2, true),
('Strains & Variëteiten', 'Discussies over verschillende cannabis variëteiten en hun effecten', 'strains-varieteit', '#8b5cf6', 'Star', 3, true),
('Medisch Gebruik', 'Medische toepassingen en ervaringen met medicinale cannabis', 'medisch-gebruik', '#ef4444', 'Heart', 4, true),
('Wetgeving & Nieuws', 'Updates over cannabiswetgeving en nieuws uit België en Europa', 'wetgeving-nieuws', '#3b82f6', 'Scale', 5, true),
('Beginners Corner', 'Vragen en tips voor mensen die nieuw zijn in de cannabiswereld', 'beginners-corner', '#06b6d4', 'Users', 6, true);

-- Insert initial tags
INSERT INTO public.tags (name, description, slug, color) VALUES
('indoor', 'Indoor teelt gerelateerde topics', 'indoor', '#10b981'),
('outdoor', 'Outdoor teelt gerelateerde topics', 'outdoor', '#f59e0b'),
('cbd', 'CBD gerelateerde discussies', 'cbd', '#8b5cf6'),
('thc', 'THC gerelateerde discussies', 'thc', '#ef4444'),
('autoflower', 'Autoflower variëteiten', 'autoflower', '#3b82f6'),
('feminized', 'Gefeminiseerde zaden', 'feminized', '#06b6d4'),
('beginner', 'Geschikt voor beginners', 'beginner', '#84cc16'),
('advanced', 'Voor gevorderde gebruikers', 'advanced', '#f97316'),
('belgie', 'Specifiek over België', 'belgie', '#dc2626'),
('europa', 'Europees nieuws en wetgeving', 'europa', '#7c3aed'),
('pain-relief', 'Pijnverlichting', 'pain-relief', '#059669'),
('anxiety', 'Angst en stress', 'anxiety', '#0891b2'),
('sleep', 'Slaapproblemen', 'sleep', '#7c2d12'),
('nutrients', 'Voeding en meststoffen', 'nutrients', '#ca8a04'),
('pests', 'Plagen en ziektes', 'pests', '#be123c');

-- Insert level definitions for gamification
INSERT INTO public.level_definitions (level_number, title, required_xp, color, icon, perks) VALUES
(1, 'Seedling', 0, '#22c55e', 'Sprout', '["Toegang tot beginners forum"]'),
(2, 'Sprout', 100, '#84cc16', 'Leaf', '["Kan afbeeldingen uploaden"]'),
(3, 'Groentje', 250, '#65a30d', 'TreePine', '["Kan privé berichten versturen"]'),
(4, 'Grower', 500, '#16a34a', 'Trees', '["Kan topics pinnen in eigen posts"]'),
(5, 'Kweker', 1000, '#15803d', 'Mountain', '["Toegang tot VIP forum"]'),
(6, 'Expert', 2000, '#166534', 'Crown', '["Kan andere gebruikers helpen"]'),
(7, 'Master Grower', 4000, '#14532d', 'Award', '["Kan eigen badges toekennen"]'),
(8, 'Cannabis Guru', 8000, '#052e16', 'Star', '["Alle forum privileges"]');

-- Insert point categories
INSERT INTO public.point_categories (name, description, color, icon) VALUES
('content', 'Punten voor het maken van content', '#10b981', 'Edit'),
('social', 'Punten voor sociale interacties', '#3b82f6', 'Users'),
('helpful', 'Punten voor hulp aan anderen', '#f59e0b', 'Heart'),
('general', 'Algemene activiteit punten', '#8b5cf6', 'Star');

-- Insert initial achievements
INSERT INTO public.achievements (name, description, category, points, criteria, rarity, icon, is_active) VALUES
('first_post', 'Je eerste topic gemaakt', 'content', 50, '{"action": "create_topic", "count": 1}', 'common', 'MessageSquare', true),
('first_reply', 'Je eerste reactie geplaatst', 'content', 25, '{"action": "create_reply", "count": 1}', 'common', 'Reply', true),
('conversation_starter', '10 topics gemaakt', 'content', 200, '{"action": "create_topic", "count": 10}', 'uncommon', 'MessageCircle', true),
('community_leader', '50 topics gemaakt', 'content', 500, '{"action": "create_topic", "count": 50}', 'rare', 'Crown', true),
('helpful_member', '10 upvotes ontvangen', 'helpful', 150, '{"action": "receive_upvote", "count": 10}', 'uncommon', 'ThumbsUp', true),
('expert_helper', '100 upvotes ontvangen', 'helpful', 750, '{"action": "receive_upvote", "count": 100}', 'epic', 'Award', true),
('socializer', '25 reacties geplaatst', 'social', 300, '{"action": "create_reply", "count": 25}', 'uncommon', 'Users', true),
('daily_visitor', '7 dagen op rij ingelogd', 'general', 100, '{"action": "login_streak", "count": 7}', 'common', 'Calendar', true),
('dedicated_member', '30 dagen op rij ingelogd', 'general', 400, '{"action": "login_streak", "count": 30}', 'rare', 'Trophy', true);

-- Update category counts (will be updated by triggers as content is added)
UPDATE public.categories SET topic_count = 0, reply_count = 0;