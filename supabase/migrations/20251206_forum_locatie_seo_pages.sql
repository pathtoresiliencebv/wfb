-- =====================================================
-- FORUM + LOCATIE COMBINATIES SEO PAGINA'S
-- Stad-specifieke forum landing pages
-- =====================================================

-- 1. Wiet Forum Antwerpen
INSERT INTO seo_content_pages (slug, title, h1_title, meta_description, meta_keywords, content, page_type, is_published, last_updated)
VALUES (
  'wiet-forum-antwerpen',
  'Wiet Forum Antwerpen: Praat Mee met Kwekers | Wietforum',
  'Wiet Forum voor Antwerpen',
  'Het grootste wietforum voor Antwerpen en omgeving. Praat mee over kweken, wetgeving en ervaringen met lokale kwekers.',
  ARRAY['wiet forum antwerpen', 'cannabis antwerpen', 'wiet antwerpen', 'kweken antwerpen'],
  jsonb_build_object(
    'sections', jsonb_build_array(
      jsonb_build_object('heading', 'Welkom bij Wietforum Antwerpen', 'content', '<p>Welkom bij de <strong>Antwerpen community</strong> van Wietforum België. Hier vind je gelijkgestemden uit Antwerpen stad en de hele provincie - van Mechelen tot Turnhout, van Mortsel tot Herentals.</p>'),
      jsonb_build_object('heading', 'Waarover Praten We?', 'content', '<ul><li><strong>Lokale ervaringen</strong> met kweken in het Antwerpse klimaat</li><li><strong>Tips en advies</strong> van ervaren kwekers uit de regio</li><li><strong>Wetgeving updates</strong> specifiek voor Antwerpen</li><li><strong>Ontmoetingen</strong> met andere enthousiastelingen</li></ul>'),
      jsonb_build_object('heading', 'Populaire Topics', 'content', '<ul><li>Buitenkweek in Antwerpen: wanneer starten?</li><li>Beste growshops in de buurt</li><li>Ervaringen met controles</li><li>Strain tips voor het lokale klimaat</li></ul>'),
      jsonb_build_object('heading', 'Word Lid', 'content', '<p>Maak een <strong>gratis account</strong> aan en word deel van de grootste Belgische cannabis community. Stel vragen, deel ervaringen en leer van anderen uit jouw regio.</p>')
    ),
    'faq', jsonb_build_array(
      jsonb_build_object('question', 'Is dit forum legaal?', 'answer', 'Ja, praten over cannabis is volledig legaal. Wij promoten geen illegale activiteiten.'),
      jsonb_build_object('question', 'Zijn er meetups in Antwerpen?', 'answer', 'De community organiseert informele bijeenkomsten. Check het forum voor aankondigingen.')
    )
  ),
  'location',
  true,
  now()
) ON CONFLICT (slug) DO UPDATE SET content = EXCLUDED.content, last_updated = now();

-- 2. Wiet Forum Gent
INSERT INTO seo_content_pages (slug, title, h1_title, meta_description, meta_keywords, content, page_type, is_published, last_updated)
VALUES (
  'wiet-forum-gent',
  'Wiet Forum Gent: Oost-Vlaamse Community | Wietforum',
  'Wiet Forum voor Gent',
  'Wietforum voor Gent en Oost-Vlaanderen. Praat mee over kweken, CBD en cannabis met lokale enthousiastelingen.',
  ARRAY['wiet forum gent', 'cannabis gent', 'wiet gent', 'cannabis oost-vlaanderen'],
  jsonb_build_object(
    'sections', jsonb_build_array(
      jsonb_build_object('heading', 'Gentse Cannabis Community', 'content', '<p>De <strong>Gent sectie</strong> van Wietforum is dé plek voor cannabis enthousiasten uit Gent, Aalst, Sint-Niklaas, Dendermonde en heel Oost-Vlaanderen.</p>'),
      jsonb_build_object('heading', 'Onderwerpen', 'content', '<ul><li>Kweken in het Oost-Vlaamse klimaat</li><li>CBD shops en growshops in Gent</li><li>Lokale wetgeving en handhaving</li><li>Ervaringen delen met de community</li></ul>'),
      jsonb_build_object('heading', 'Studentenstad', 'content', '<p>Als studentenstad heeft Gent een levendige cannabis cultuur. Ons forum biedt een veilige plek om vragen te stellen en informatie te delen.</p>')
    ),
    'faq', jsonb_build_array(
      jsonb_build_object('question', 'Zijn er veel leden uit Gent?', 'answer', 'Ja, Gent is één van onze meest actieve regio''s met honderden leden.')
    )
  ),
  'location',
  true,
  now()
) ON CONFLICT (slug) DO UPDATE SET content = EXCLUDED.content, last_updated = now();

-- 3. Wiet Forum Brussel
INSERT INTO seo_content_pages (slug, title, h1_title, meta_description, meta_keywords, content, page_type, is_published, last_updated)
VALUES (
  'wiet-forum-brussel',
  'Wiet Forum Brussel: Hoofdstedelijke Community | Wietforum',
  'Wiet Forum voor Brussel',
  'Cannabis forum voor Brussel en omgeving. Nederlandstalige community voor de hoofdstad. Praat mee!',
  ARRAY['wiet forum brussel', 'cannabis brussel', 'wiet brussel', 'weed brussels'],
  jsonb_build_object(
    'sections', jsonb_build_array(
      jsonb_build_object('heading', 'Brussel Community', 'content', '<p>Welkom bij de <strong>Brusselse sectie</strong> van Wietforum. Als hoofdstad heeft Brussel een unieke positie - multicultureel, internationaal, en met eigen regels.</p>'),
      jsonb_build_object('heading', 'Specifieke Topics', 'content', '<ul><li>Brussel-specifieke wetgeving en handhaving</li><li>CBD shops in de hoofdstad</li><li>Internationale aspecten en expats</li><li>Kweken in stedelijke omgeving</li></ul>'),
      jsonb_build_object('heading', 'Tweetalig', 'content', '<p>Hoewel ons forum Nederlandstalig is, verwelkomen we ook Franstalige Brusselaars die Nederlands begrijpen of willen leren.</p>')
    ),
    'faq', jsonb_build_array(
      jsonb_build_object('question', 'Is de wetgeving anders in Brussel?', 'answer', 'Brussel volgt de federale wetgeving, maar lokale politiezones kunnen verschillend handhaven.')
    )
  ),
  'location',
  true,
  now()
) ON CONFLICT (slug) DO UPDATE SET content = EXCLUDED.content, last_updated = now();

-- 4. Wiet Forum Brugge
INSERT INTO seo_content_pages (slug, title, h1_title, meta_description, meta_keywords, content, page_type, is_published, last_updated)
VALUES (
  'wiet-forum-brugge',
  'Wiet Forum Brugge: West-Vlaamse Community | Wietforum',
  'Wiet Forum voor Brugge',
  'Wietforum voor Brugge en West-Vlaanderen. Van Oostende tot Kortrijk, praat mee met lokale enthousiastelingen.',
  ARRAY['wiet forum brugge', 'cannabis brugge', 'wiet brugge', 'cannabis west-vlaanderen'],
  jsonb_build_object(
    'sections', jsonb_build_array(
      jsonb_build_object('heading', 'West-Vlaamse Community', 'content', '<p>De <strong>Brugge sectie</strong> bedient heel West-Vlaanderen - van de kust (Oostende, Knokke, Blankenberge) tot het binnenland (Kortrijk, Roeselare, Ieper).</p>'),
      jsonb_build_object('heading', 'Kust Klimaat', 'content', '<p>Het kustklimaat van West-Vlaanderen brengt unieke uitdagingen voor buitenkwekers: meer wind, zoutlucht, maar ook zachte winters.</p>'),
      jsonb_build_object('heading', 'Onderwerpen', 'content', '<ul><li>Buitenkweek aan de kust</li><li>Lokale shops en leveranciers</li><li>Ervaringen delen</li><li>Vragen stellen aan ervaren kwekers</li></ul>')
    ),
    'faq', jsonb_build_array(
      jsonb_build_object('question', 'Is buitenkweek mogelijk aan de kust?', 'answer', 'Ja, maar kies windbestendige strains en zorg voor beschutting.')
    )
  ),
  'location',
  true,
  now()
) ON CONFLICT (slug) DO UPDATE SET content = EXCLUDED.content, last_updated = now();

-- 5. Wiet Forum Leuven
INSERT INTO seo_content_pages (slug, title, h1_title, meta_description, meta_keywords, content, page_type, is_published, last_updated)
VALUES (
  'wiet-forum-leuven',
  'Wiet Forum Leuven: Vlaams-Brabant Community | Wietforum',
  'Wiet Forum voor Leuven',
  'Cannabis forum voor Leuven, Tienen, Aarschot en Vlaams-Brabant. Studentenstad met actieve community.',
  ARRAY['wiet forum leuven', 'cannabis leuven', 'wiet leuven', 'wiet vlaams-brabant'],
  jsonb_build_object(
    'sections', jsonb_build_array(
      jsonb_build_object('heading', 'Leuven Community', 'content', '<p>Als oudste universiteitsstad van België heeft Leuven een jonge, nieuwsgierige community. Ons forum biedt een platform voor veilige informatie-uitwisseling.</p>'),
      jsonb_build_object('heading', 'Vlaams-Brabant', 'content', '<p>Deze sectie dekt ook <strong>Tienen, Aarschot, Diest, Vilvoorde, Halle</strong> en andere gemeenten in Vlaams-Brabant.</p>'),
      jsonb_build_object('heading', 'Student-Friendly', 'content', '<p>Veel vragen van studenten over veilig gebruik, wetgeving en kweek. Onze community geeft objectieve, evidence-based informatie.</p>')
    ),
    'faq', jsonb_build_array(
      jsonb_build_object('question', 'Zijn er veel studenten actief?', 'answer', 'Ja, Leuven heeft een actieve studentenpopulatie op ons forum.')
    )
  ),
  'location',
  true,
  now()
) ON CONFLICT (slug) DO UPDATE SET content = EXCLUDED.content, last_updated = now();

-- 6. Wiet Forum Hasselt
INSERT INTO seo_content_pages (slug, title, h1_title, meta_description, meta_keywords, content, page_type, is_published, last_updated)
VALUES (
  'wiet-forum-hasselt',
  'Wiet Forum Hasselt: Limburgse Community | Wietforum',
  'Wiet Forum voor Hasselt',
  'Wietforum voor Hasselt, Genk en Limburg. Praat mee met kwekers en enthousiastelingen uit de regio.',
  ARRAY['wiet forum hasselt', 'cannabis hasselt', 'wiet limburg', 'cannabis limburg belgie'],
  jsonb_build_object(
    'sections', jsonb_build_array(
      jsonb_build_object('heading', 'Limburgse Community', 'content', '<p>De <strong>Limburg sectie</strong> brengt enthousiasten samen uit Hasselt, Genk, Tongeren, Sint-Truiden, Beringen en alle andere Limburgse gemeenten.</p>'),
      jsonb_build_object('heading', 'Grensregio', 'content', '<p>Als grensprovincie heeft Limburg een unieke positie: dicht bij Nederland en Duitsland, waar de wetgeving anders is.</p>'),
      jsonb_build_object('heading', 'Topics', 'content', '<ul><li>Kweken in Limburg</li><li>Grensoverschrijdende ervaringen</li><li>Lokale shops en leveranciers</li><li>Community ontmoetingen</li></ul>')
    ),
    'faq', jsonb_build_array(
      jsonb_build_object('question', 'Mag ik wiet uit Nederland meenemen?', 'answer', 'Nee, import is illegaal. Koop alleen in België wat je in België gebruikt.')
    )
  ),
  'location',
  true,
  now()
) ON CONFLICT (slug) DO UPDATE SET content = EXCLUDED.content, last_updated = now();

-- 7. Cannabis Forum Antwerpen
INSERT INTO seo_content_pages (slug, title, h1_title, meta_description, meta_keywords, content, page_type, is_published, last_updated)
VALUES (
  'cannabis-forum-antwerpen',
  'Cannabis Forum Antwerpen | Wietforum België',
  'Cannabis Forum voor Antwerpen',
  'Cannabis discussies voor Antwerpen. Van kweek tot wetgeving, van CBD tot medisch gebruik. Word lid!',
  ARRAY['cannabis forum antwerpen', 'cannabis antwerpen', 'wiet forum antwerpen'],
  jsonb_build_object(
    'sections', jsonb_build_array(
      jsonb_build_object('heading', 'Cannabis Discussies Antwerpen', 'content', '<p>Alles over cannabis in Antwerpen op één plek. Van beginnersvragen tot experttips, van wetgeving tot kweek.</p>'),
      jsonb_build_object('heading', 'Wat Vind Je Hier?', 'content', '<ul><li>Lokale kweek ervaringen</li><li>CBD en medische cannabis info</li><li>Wetgeving updates voor Antwerpen</li><li>Actieve community discussies</li></ul>')
    ),
    'faq', jsonb_build_array(
      jsonb_build_object('question', 'Is dit hetzelfde als wiet forum antwerpen?', 'answer', 'Ja, cannabis en wiet verwijzen naar hetzelfde. Dit is onze Antwerpen community.')
    )
  ),
  'location',
  true,
  now()
) ON CONFLICT (slug) DO UPDATE SET content = EXCLUDED.content, last_updated = now();

-- 8. Cannabis Forum Gent
INSERT INTO seo_content_pages (slug, title, h1_title, meta_description, meta_keywords, content, page_type, is_published, last_updated)
VALUES (
  'cannabis-forum-gent',
  'Cannabis Forum Gent | Wietforum België',
  'Cannabis Forum voor Gent',
  'Cannabis community voor Gent en Oost-Vlaanderen. Praat mee over alle cannabis-gerelateerde onderwerpen.',
  ARRAY['cannabis forum gent', 'cannabis gent', 'wiet forum gent'],
  jsonb_build_object(
    'sections', jsonb_build_array(
      jsonb_build_object('heading', 'Gentse Cannabis Community', 'content', '<p>Het cannabis forum voor <strong>Gent en omgeving</strong>. Deel je ervaringen, stel vragen en leer van anderen.</p>'),
      jsonb_build_object('heading', 'Actieve Discussies', 'content', '<ul><li>Kweek tips voor beginners</li><li>CBD producten en shops</li><li>Wetgeving en rechten</li><li>Medisch cannabis gebruik</li></ul>')
    ),
    'faq', jsonb_build_array(
      jsonb_build_object('question', 'Hoe word ik lid?', 'answer', 'Maak gratis een account aan en je kunt direct meepraten.')
    )
  ),
  'location',
  true,
  now()
) ON CONFLICT (slug) DO UPDATE SET content = EXCLUDED.content, last_updated = now();

-- 9. Cannabis Forum Brussel
INSERT INTO seo_content_pages (slug, title, h1_title, meta_description, meta_keywords, content, page_type, is_published, last_updated)
VALUES (
  'cannabis-forum-brussel',
  'Cannabis Forum Brussel | Wietforum België',
  'Cannabis Forum voor Brussel',
  'Cannabis forum voor de Brusselse regio. Nederlandstalige community in de hoofdstad.',
  ARRAY['cannabis forum brussel', 'cannabis brussel', 'wiet forum brussel'],
  jsonb_build_object(
    'sections', jsonb_build_array(
      jsonb_build_object('heading', 'Brussel Cannabis Forum', 'content', '<p>De Nederlandstalige cannabis community voor <strong>Brussel en omgeving</strong>. Van Schaarbeek tot Ukkel, van Elsene tot Jette.</p>'),
      jsonb_build_object('heading', 'Hoofdstedelijke Onderwerpen', 'content', '<ul><li>CBD shops in Brussel</li><li>Lokale wetgeving info</li><li>Internationale community</li><li>Kweek in de stad</li></ul>')
    ),
    'faq', jsonb_build_array(
      jsonb_build_object('question', 'Is het forum ook in het Frans?', 'answer', 'Het forum is Nederlandstalig, maar iedereen is welkom.')
    )
  ),
  'location',
  true,
  now()
) ON CONFLICT (slug) DO UPDATE SET content = EXCLUDED.content, last_updated = now();

-- 10. Cannabis Forum Vlaanderen
INSERT INTO seo_content_pages (slug, title, h1_title, meta_description, meta_keywords, content, page_type, is_published, last_updated)
VALUES (
  'cannabis-forum-vlaanderen',
  'Cannabis Forum Vlaanderen: Heel Vlaanderen Verbonden | Wietforum',
  'Cannabis Forum voor Heel Vlaanderen',
  'Het grootste Vlaamse cannabis forum. Van Antwerpen tot Limburg, van West-Vlaanderen tot Vlaams-Brabant.',
  ARRAY['cannabis forum vlaanderen', 'wiet forum vlaanderen', 'vlaamse cannabis community'],
  jsonb_build_object(
    'sections', jsonb_build_array(
      jsonb_build_object('heading', 'Heel Vlaanderen Verbonden', 'content', '<p>Wietforum België is <strong>het centrale forum voor heel Vlaanderen</strong>. Met lokale secties voor elke provincie en stad, maar ook een algemene Vlaamse community.</p>'),
      jsonb_build_object('heading', 'Provincies', 'content', '<ul><li><strong>Antwerpen:</strong> Antwerpen stad, Mechelen, Turnhout</li><li><strong>Oost-Vlaanderen:</strong> Gent, Aalst, Sint-Niklaas</li><li><strong>West-Vlaanderen:</strong> Brugge, Kortrijk, Oostende</li><li><strong>Vlaams-Brabant:</strong> Leuven, Vilvoorde, Halle</li><li><strong>Limburg:</strong> Hasselt, Genk, Tongeren</li></ul>'),
      jsonb_build_object('heading', 'Waarom Wietforum?', 'content', '<ul><li>Grootste Nederlandstalige cannabis community</li><li>Lokale en algemene discussies</li><li>Betrouwbare informatie</li><li>Actieve moderatie</li></ul>')
    ),
    'faq', jsonb_build_array(
      jsonb_build_object('question', 'Hoeveel leden heeft het forum?', 'answer', 'Onze community groeit dagelijks. Word ook lid en draag bij!'),
      jsonb_build_object('question', 'Is het forum gratis?', 'answer', 'Ja, aanmelden en meepraten is volledig gratis.')
    )
  ),
  'pillar',
  true,
  now()
) ON CONFLICT (slug) DO UPDATE SET content = EXCLUDED.content, last_updated = now();

-- 11. Kweek Forum
INSERT INTO seo_content_pages (slug, title, h1_title, meta_description, meta_keywords, content, page_type, is_published, last_updated)
VALUES (
  'kweek-forum',
  'Kweek Forum: Tips van Ervaren Kwekers | Wietforum',
  'Cannabis Kweek Forum',
  'Het kweek forum voor Belgische cannabis kwekers. Van beginner tot expert, deel je kennis en leer van anderen.',
  ARRAY['kweek forum', 'grow forum', 'cannabis kweek forum', 'wiet kweek forum'],
  jsonb_build_object(
    'sections', jsonb_build_array(
      jsonb_build_object('heading', 'Het Kweek Forum', 'content', '<p>Welkom bij het <strong>kweek forum</strong> - dé plek voor iedereen die cannabis kweekt of wil leren kweken. Van je eerste plantje tot geavanceerde technieken.</p>'),
      jsonb_build_object('heading', 'Categorieën', 'content', '<ul><li><strong>Beginners:</strong> Starten met kweken, basis vragen</li><li><strong>Buitenkweek:</strong> Kweken in de tuin, balkon, guerrilla</li><li><strong>Binnenkweek:</strong> Tent, verlichting, ventilatie</li><li><strong>Problemen:</strong> Ziektes, plagen, tekorten</li><li><strong>Oogst & Verwerking:</strong> Drogen, curen, hasj maken</li></ul>'),
      jsonb_build_object('heading', 'Waarom Hier?', 'content', '<ul><li>Ervaren kwekers helpen beginners</li><li>Belgische community (lokaal klimaat)</li><li>Geen reclame of promotie</li><li>Praktische, geteste tips</li></ul>')
    ),
    'faq', jsonb_build_array(
      jsonb_build_object('question', 'Mag ik foto''s plaatsen van mijn kweek?', 'answer', 'Ja, maar verwijder metadata en herkenbare details voor je privacy.'),
      jsonb_build_object('question', 'Krijg ik hulp als beginner?', 'answer', 'Absoluut! Onze community helpt graag beginners op weg.')
    )
  ),
  'pillar',
  true,
  now()
) ON CONFLICT (slug) DO UPDATE SET content = EXCLUDED.content, last_updated = now();

-- 12. Grow Forum
INSERT INTO seo_content_pages (slug, title, h1_title, meta_description, meta_keywords, content, page_type, is_published, last_updated)
VALUES (
  'grow-forum',
  'Grow Forum België: Cannabis Kweken | Wietforum',
  'Grow Forum voor Belgische Kwekers',
  'Nederlands grow forum voor België. Tips, ervaringen en hulp bij het kweken van cannabis.',
  ARRAY['grow forum', 'growforum', 'cannabis grow', 'growing forum'],
  jsonb_build_object(
    'sections', jsonb_build_array(
      jsonb_build_object('heading', 'Grow Forum België', 'content', '<p>Het <strong>grow forum</strong> voor Belgische en Nederlandstalige kwekers. Praat mee over setups, strains, technieken en meer.</p>'),
      jsonb_build_object('heading', 'Populaire Topics', 'content', '<ul><li>Setup reviews en ervaringen</li><li>Strain tests en vergelijkingen</li><li>DIY oplossingen</li><li>Problemen diagnosticeren</li><li>Oogst rapportages</li></ul>'),
      jsonb_build_object('heading', 'Word Lid', 'content', '<p>Maak een gratis account en krijg toegang tot alle discussies, growlogs en de expertise van onze community.</p>')
    ),
    'faq', jsonb_build_array(
      jsonb_build_object('question', 'Wat is een growlog?', 'answer', 'Een dagboek van je kweek met foto''s en updates. Ideaal om feedback te krijgen.')
    )
  ),
  'pillar',
  true,
  now()
) ON CONFLICT (slug) DO UPDATE SET content = EXCLUDED.content, last_updated = now();

-- =====================================================
-- COMPLETION
-- =====================================================

DO $$
BEGIN
  RAISE NOTICE 'Forum + Locatie paginas succesvol aangemaakt';
  RAISE NOTICE 'Totaal: 12 paginas';
END $$;

