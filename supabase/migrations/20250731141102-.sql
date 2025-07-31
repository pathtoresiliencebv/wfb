-- Temporarily disable triggers
ALTER TABLE topics DISABLE TRIGGER check_topic_achievements_trigger;

-- Insert sample topics
INSERT INTO topics (title, content, category_id, author_id) VALUES 
('Welkom bij Wietforum België!', 'Welkom in onze community! Stel jezelf voor en laat ons weten waarom je hier bent. Dit is een veilige ruimte voor alle vragen en discussies over cannabis in België.', '429dd2b5-38a0-4ced-96c8-112691aea79b', (SELECT user_id FROM profiles LIMIT 1)),
('CBD dosering voor beginners', 'Ik ben net begonnen met CBD olie en wil graag weten welke dosering jullie adviseren voor beginners. Ik heb gelezen dat je laag moet starten, maar wat betekent dat precies?', 'f3dfeb8b-08f0-4aaf-a79b-e9d74cecf264', (SELECT user_id FROM profiles LIMIT 1)),
('Indoor setup tips', 'Ik wil beginnen met indoor kweken maar weet niet waar te starten. Welke apparatuur is echt noodzakelijk en wat zijn jullie ervaringen met verschillende LED lampen?', '85a3de51-f07e-4dbf-9e92-754ed0509cde', (SELECT user_id FROM profiles LIMIT 1)),
('Nieuwe wetgeving 2024', 'Hebben jullie al gehoord over de mogelijke wijzigingen in de cannabis wetgeving dit jaar? Wat denken jullie dat er gaat veranderen in België?', '429dd2b5-38a0-4ced-96c8-112691aea79b', (SELECT user_id FROM profiles LIMIT 1)),
('White Widow review', 'Net White Widow geprobeerd van een lokale shop. Hier is mijn uitgebreide review van deze klassieke strain - effecten, smaak, en waar ik het gekocht heb.', '6f53338e-6620-4666-8846-49a2c6b0b19a', (SELECT user_id FROM profiles LIMIT 1)),
('Beste CBD shops in België', 'Welke CBD shops kunnen jullie aanraden? Ik zoek betrouwbare plekken met goede kwaliteit producten en eerlijke prijzen.', 'e4407773-a31b-421c-9516-623f523afef7', (SELECT user_id FROM profiles LIMIT 1)),
('Autoflower vs Regulier', 'Voor beginners, wat is beter: autoflower of reguliere zaden? Wat zijn de voor- en nadelen van elk type?', '85a3de51-f07e-4dbf-9e92-754ed0509cde', (SELECT user_id FROM profiles LIMIT 1)),
('Cannabis en medicijnen', 'Ik gebruik medicijnen en wil graag CBD proberen. Zijn er interacties waar ik op moet letten? Heeft iemand ervaring hiermee?', 'f3dfeb8b-08f0-4aaf-a79b-e9d74cecf264', (SELECT user_id FROM profiles LIMIT 1));

-- Re-enable triggers
ALTER TABLE topics ENABLE TRIGGER check_topic_achievements_trigger;

-- Add some sample replies
INSERT INTO replies (content, topic_id, author_id) VALUES 
('Welkom! Ik ben hier voor de community en om te leren over medicinaal gebruik.', (SELECT id FROM topics WHERE title = 'Welkom bij Wietforum België!' LIMIT 1), (SELECT user_id FROM profiles LIMIT 1)),
('Start met 2.5mg CBD, 2x per dag. Je kunt dit elke week verhogen met 2.5mg tot je het gewenste effect bereikt.', (SELECT id FROM topics WHERE title = 'CBD dosering voor beginners' LIMIT 1), (SELECT user_id FROM profiles LIMIT 1)),
('Voor LED lampen kan ik Samsung LM301B chips aanraden. Quantum boards zijn zeer efficiënt.', (SELECT id FROM topics WHERE title = 'Indoor setup tips' LIMIT 1), (SELECT user_id FROM profiles LIMIT 1)),
('Ik heb gehoord dat er mogelijk meer tolerantie komt voor thuiskweek, maar officieel is er nog niets bevestigd.', (SELECT id FROM topics WHERE title = 'Nieuwe wetgeving 2024' LIMIT 1), (SELECT user_id FROM profiles LIMIT 1)),
('White Widow is inderdaad een klassieker! Welke effecten heb je ervaren?', (SELECT id FROM topics WHERE title = 'White Widow review' LIMIT 1), (SELECT user_id FROM profiles LIMIT 1));

-- Update topic reply counts
UPDATE topics SET reply_count = (
  SELECT COUNT(*) FROM replies WHERE replies.topic_id = topics.id
);

-- Update view counts to random numbers for realism
UPDATE topics SET view_count = floor(random() * 100 + 10);

-- Update category stats
UPDATE categories SET 
  topic_count = (SELECT COUNT(*) FROM topics WHERE topics.category_id = categories.id),
  reply_count = (SELECT COUNT(*) FROM replies r JOIN topics t ON r.topic_id = t.id WHERE t.category_id = categories.id);

-- Add column if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'categories' AND column_name = 'topic_count') THEN
        ALTER TABLE categories ADD COLUMN topic_count INTEGER DEFAULT 0;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'categories' AND column_name = 'reply_count') THEN
        ALTER TABLE categories ADD COLUMN reply_count INTEGER DEFAULT 0;
    END IF;
END $$;