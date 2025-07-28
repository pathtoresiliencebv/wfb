-- Insert basic forum categories with shorter color codes
INSERT INTO public.categories (name, description, slug, icon, color, sort_order, is_active) VALUES
('Algemene Discussie', 'Algemene gesprekken over cannabis en gerelateerde onderwerpen', 'algemene-discussie', 'MessageSquare', '#3b82f6', 1, true),
('Growtips & Technieken', 'Deel je groei-ervaring en leer van anderen', 'growtips-technieken', 'TrendingUp', '#10b981', 2, true),
('Community', 'Maak verbinding met andere community members', 'community', 'Users', '#8b5cf6', 3, true),
('Medisch Cannabis', 'Discussies over medisch gebruik van cannabis', 'medisch-cannabis', 'Heart', '#ef4444', 4, true),
('Wet & Regelgeving', 'Informatie over cannabis wetgeving in België', 'wet-regelgeving', 'Scale', '#f59e0b', 5, true),
('Strain Reviews', 'Reviews en ervaringen met verschillende cannabis soorten', 'strain-reviews', 'Star', '#ec4899', 6, true);

-- Insert basic achievements for the platform
INSERT INTO public.achievements (name, description, category, points, icon, rarity, criteria, is_active) VALUES
('first_post', 'Je eerste topic aangemaakt', 'participation', 10, '🎉', 'common', '{"posts_created": 1}', true),
('first_reply', 'Je eerste reactie geplaatst', 'participation', 5, '💬', 'common', '{"replies_created": 1}', true),
('conversation_starter', '10 topics aangemaakt', 'participation', 50, '🗣️', 'uncommon', '{"posts_created": 10}', true),
('community_leader', '50 topics aangemaakt', 'participation', 200, '👑', 'rare', '{"posts_created": 50}', true),
('helpful_member', '10 upvotes ontvangen', 'reputation', 25, '👍', 'uncommon', '{"upvotes_received": 10}', true),
('expert_helper', '100 upvotes ontvangen', 'reputation', 150, '⭐', 'rare', '{"upvotes_received": 100}', true),
('week_streak', '7 dagen op rij actief', 'engagement', 30, '🔥', 'uncommon', '{"login_streak": 7}', true),
('month_streak', '30 dagen op rij actief', 'engagement', 100, '💪', 'rare', '{"login_streak": 30}', true),
('hundred_day_streak', '100 dagen op rij actief', 'engagement', 500, '🏆', 'legendary', '{"login_streak": 100}', true);