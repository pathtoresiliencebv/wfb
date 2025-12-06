-- =====================================================
-- TIER 2: KWEEK SEO PAGINA'S
-- Buitenkweek & Binnenkweek
-- =====================================================

-- =====================================================
-- 3.1 BUITENKWEEK (11 keywords)
-- =====================================================

-- 1. Buitenkweek Wiet
INSERT INTO seo_content_pages (slug, title, h1_title, meta_description, meta_keywords, content, page_type, is_published, last_updated)
VALUES (
  'buitenkweek-wiet',
  'Buitenkweek Wiet: Complete Gids voor België | Wietforum',
  'Buitenkweek Wiet: De Complete Handleiding',
  'Alles over wiet buitenkweek in België. Wanneer planten, welke strains, oogsten en juridische aspecten. Ervaring van kwekers.',
  ARRAY['buitenkweek wiet', 'wiet buiten kweken', 'outdoor wiet', 'buiten cannabis'],
  jsonb_build_object(
    'sections', jsonb_build_array(
      jsonb_build_object('heading', 'Waarom Buitenkweek?', 'content', '<p>Buitenkweek heeft vele voordelen:</p><ul><li><strong>Gratis zonlicht</strong> - geen elektriciteitskosten</li><li><strong>Grotere planten</strong> - meer opbrengst per plant</li><li><strong>Natuurlijke groei</strong> - minder stress voor de plant</li><li><strong>Discreet</strong> - geen verdachte apparatuur in huis</li></ul>'),
      jsonb_build_object('heading', 'Het Belgische Klimaat', 'content', '<p>België heeft een <strong>gematigd zeeklimaat</strong> dat prima geschikt is voor cannabis, mits je rekening houdt met:</p><ul><li>Korte zomers (mei-september)</li><li>Veel regenval en vocht</li><li>Schimmelrisico in de herfst</li><li>Onvoorspelbaar weer</li></ul>'),
      jsonb_build_object('heading', 'Kweekkalender België', 'content', '<p><strong>Maart-April:</strong> Zaden kiemen binnen onder licht</p><p><strong>Mei (na IJsheiligen):</strong> Plantjes naar buiten</p><p><strong>Juni-Juli:</strong> Vegetatieve groei, plant groeit snel</p><p><strong>Augustus:</strong> Bloei begint (photoperiod strains)</p><p><strong>September-Oktober:</strong> Bloei voltooid, oogst</p>'),
      jsonb_build_object('heading', 'Beste Strains voor België', 'content', '<p><strong>Aanbevolen photoperiod strains:</strong></p><ul><li>Northern Lights - Schimmelresistent, betrouwbaar</li><li>Early Skunk - Speciaal voor koud klimaat</li><li>Frisian Dew - Paarse outdoor specialist</li><li>Holland''s Hope - Nederlandse klassieker</li></ul><p><strong>Autoflowers (sneller klaar):</strong></p><ul><li>Royal Dwarf - Klein en snel</li><li>Auto Ultimate - Grote opbrengst</li><li>Northern Lights Auto - Betrouwbaar</li></ul>'),
      jsonb_build_object('heading', 'Juridische Aspecten', 'content', '<p>De <strong>1 plant regel</strong> geldt ook voor buitenkweek. Extra aandachtspunten:</p><ul><li>Plant moet uit het zicht zijn</li><li>Geen geuroverlast voor buren</li><li>Niet zichtbaar vanaf de straat</li><li>Geen klachten = geen problemen</li></ul>')
    ),
    'faq', jsonb_build_array(
      jsonb_build_object('question', 'Wanneer kan ik wiet buiten planten?', 'answer', 'Na de IJsheiligen (half mei) wanneer er geen nachtvorst meer is.'),
      jsonb_build_object('question', 'Hoeveel opbrengst per buitenplant?', 'answer', 'Een gezonde buitenplant kan 200-500 gram opleveren, afhankelijk van strain en omstandigheden.')
    )
  ),
  'pillar',
  true,
  now()
) ON CONFLICT (slug) DO UPDATE SET content = EXCLUDED.content, last_updated = now();

-- 2. Buitenkweek Cannabis
INSERT INTO seo_content_pages (slug, title, h1_title, meta_description, meta_keywords, content, page_type, is_published, last_updated)
VALUES (
  'buitenkweek-cannabis',
  'Buitenkweek Cannabis: Handleiding voor Beginners | Wietforum',
  'Cannabis Buitenkweek voor Beginners',
  'Stap-voor-stap handleiding voor cannabis buitenkweek. Van zaad tot oogst. Speciaal voor het Belgische klimaat.',
  ARRAY['buitenkweek cannabis', 'cannabis buiten', 'outdoor cannabis', 'buiten kweken'],
  jsonb_build_object(
    'sections', jsonb_build_array(
      jsonb_build_object('heading', 'Stap 1: Locatie Kiezen', 'content', '<p>De perfecte locatie heeft:</p><ul><li>Minimaal 6 uur direct zonlicht</li><li>Beschutting tegen harde wind</li><li>Goede drainage (geen wateroverlast)</li><li>Privacy (niet zichtbaar)</li></ul>'),
      jsonb_build_object('heading', 'Stap 2: Grond Voorbereiden', 'content', '<p>Goede grond is essentieel:</p><ul><li>Graaf een gat van 50x50x50 cm</li><li>Vul met kweekgrond (Plagron, BioBizz)</li><li>Voeg perliet toe voor drainage</li><li>Mix eventueel compost erdoor</li></ul>'),
      jsonb_build_object('heading', 'Stap 3: Planten & Verzorgen', 'content', '<p><strong>Watergeven:</strong> Regelmatig, vooral bij droogte. Check de grond op 5cm diepte.</p><p><strong>Voeding:</strong> Start voeding na 3-4 weken. Gebruik organische mest of vloeibare voeding.</p><p><strong>Training:</strong> LST (Low Stress Training) kan de opbrengst verhogen.</p>'),
      jsonb_build_object('heading', 'Stap 4: Oogsten', 'content', '<p>Check de trichomen met een loep:</p><ul><li><strong>Helder:</strong> Te vroeg</li><li><strong>Melkachtig:</strong> Maximale THC</li><li><strong>Amber:</strong> Meer lichaamelijke high</li></ul><p>Oogst bij 70-80% melkachtige trichomen.</p>')
    ),
    'faq', jsonb_build_array(
      jsonb_build_object('question', 'Hoe vaak moet ik water geven?', 'answer', 'Afhankelijk van weer en grond. Check de grond op 5cm diepte - als het droog is, water geven.'),
      jsonb_build_object('question', 'Wanneer moet ik voeding geven?', 'answer', 'Start met voeding na 3-4 weken in de volle grond. Gebruik groeivoeding tot bloei, dan bloeivoeding.')
    )
  ),
  'pillar',
  true,
  now()
) ON CONFLICT (slug) DO UPDATE SET content = EXCLUDED.content, last_updated = now();

-- 3. Buitenkweek 2025
INSERT INTO seo_content_pages (slug, title, h1_title, meta_description, meta_keywords, content, page_type, is_published, last_updated)
VALUES (
  'buitenkweek-2025',
  'Buitenkweek 2025: Seizoenskalender & Tips | Wietforum',
  'Buitenkweek Seizoen 2025',
  'Plan je buitenkweek voor 2025. Complete kalender met zaai- en plantdata, beste strains en weerverwachtingen.',
  ARRAY['buitenkweek 2025', 'kweekseizoen 2025', 'wanneer planten 2025', 'outdoor 2025'],
  jsonb_build_object(
    'sections', jsonb_build_array(
      jsonb_build_object('heading', 'Kalender 2025', 'content', '<p><strong>Maart 2025:</strong> Begin met kiemen binnen</p><p><strong>April 2025:</strong> Vegetatieve groei onder kunstlicht</p><p><strong>13-15 Mei (IJsheiligen):</strong> Wacht tot hierna!</p><p><strong>16+ Mei 2025:</strong> Veilig om buiten te planten</p><p><strong>Juni-Juli:</strong> Vegetatieve groei buiten</p><p><strong>Augustus:</strong> Bloei start (rond 15 aug)</p><p><strong>September-Oktober:</strong> Oogst (afhankelijk van strain)</p>'),
      jsonb_build_object('heading', 'Beste Strains voor 2025', 'content', '<p>Nieuwe releases en beproefde klassiekers:</p><ul><li>Frisian Dew - Onze #1 aanrader</li><li>Northern Lights - Tijdloze klassieker</li><li>Auto Mazar - Snelle autoflower</li></ul>'),
      jsonb_build_object('heading', 'Tips voor 2025', 'content', '<ul><li>Begin op tijd met kiemen (maart)</li><li>Gebruik schimmelresistente strains</li><li>Houd het weer in de gaten</li><li>Oogst voor het echt koud wordt</li></ul>')
    ),
    'faq', jsonb_build_array(
      jsonb_build_object('question', 'Wanneer planten in 2025?', 'answer', 'Na de IJsheiligen, vanaf 16 mei 2025. Kiem alvast binnen vanaf maart.')
    )
  ),
  'article',
  true,
  now()
) ON CONFLICT (slug) DO UPDATE SET content = EXCLUDED.content, last_updated = now();

-- 4. Wanneer Wiet Buiten Zetten
INSERT INTO seo_content_pages (slug, title, h1_title, meta_description, meta_keywords, content, page_type, is_published, last_updated)
VALUES (
  'wanneer-wiet-buiten-zetten',
  'Wanneer Wiet Buiten Zetten in België? | Wietforum',
  'Wanneer Kun Je Wiet Buiten Zetten?',
  'De beste tijd om wiet buiten te zetten in België. Na de IJsheiligen (half mei). Complete uitleg met kalender.',
  ARRAY['wanneer wiet buiten zetten', 'wanneer buiten planten', 'wiet buiten wanneer', 'planten buiten'],
  jsonb_build_object(
    'sections', jsonb_build_array(
      jsonb_build_object('heading', 'Het Korte Antwoord', 'content', '<p><strong>Na de IJsheiligen</strong> - rond 15 mei of later. Dan is de kans op nachtvorst minimaal en zijn de temperaturen stabiel genoeg.</p>'),
      jsonb_build_object('heading', 'Waarom Wachten tot Half Mei?', 'content', '<p>Cannabis is gevoelig voor kou:</p><ul><li>Nachtvorst is dodelijk voor jonge planten</li><li>Temperaturen onder 10°C remmen groei</li><li>De plant heeft warmte nodig om te gedijen</li></ul><p>De IJsheiligen (11-15 mei) zijn traditioneel de laatste vorst in België.</p>'),
      jsonb_build_object('heading', 'De Stappen', 'content', '<ol><li><strong>Maart-April:</strong> Kiem zaden binnen</li><li><strong>April-Mei:</strong> Kweek plantjes binnen onder licht</li><li><strong>Mei (na 15e):</strong> Acclimatiseren (paar uur per dag buiten)</li><li><strong>Eind Mei:</strong> Definitief buiten planten</li></ol>'),
      jsonb_build_object('heading', 'Autoflowers', 'content', '<p>Autoflowers kun je later planten (tot half juni) omdat ze sneller klaar zijn. Ze bloeien automatisch na 3-4 weken, ongeacht de lichtcyclus.</p>')
    ),
    'faq', jsonb_build_array(
      jsonb_build_object('question', 'Wanneer wiet buiten zetten?', 'answer', 'Na de IJsheiligen, rond 15-20 mei. Eerder is risicovol vanwege nachtvorst.'),
      jsonb_build_object('question', 'Kan ik eerder buiten planten?', 'answer', 'Riskant. Gebruik dan een kas of bescherming. Bij nachtvorst kan de plant doodgaan.')
    )
  ),
  'faq',
  true,
  now()
) ON CONFLICT (slug) DO UPDATE SET content = EXCLUDED.content, last_updated = now();

-- 5. Wanneer Buiten Planten
INSERT INTO seo_content_pages (slug, title, h1_title, meta_description, meta_keywords, content, page_type, is_published, last_updated)
VALUES (
  'wanneer-buiten-planten-cannabis',
  'Wanneer Cannabis Buiten Planten? Kalender België | Wietforum',
  'Wanneer Cannabis Buiten Planten?',
  'Optimale timing voor cannabis buiten planten in België. Na de IJsheiligen voor beste resultaten.',
  ARRAY['wanneer buiten planten', 'planten buiten', 'outdoor timing', 'buiten planten wanneer'],
  jsonb_build_object(
    'sections', jsonb_build_array(
      jsonb_build_object('heading', 'Beste Plantdatum', 'content', '<p>Voor België: <strong>15-31 mei</strong></p><p>Dit is na de IJsheiligen wanneer nachtvorst onwaarschijnlijk is. De grondtemperatuur is dan ook warm genoeg (15°C+).</p>'),
      jsonb_build_object('heading', 'Te Vroeg vs Te Laat', 'content', '<p><strong>Te vroeg (voor 15 mei):</strong></p><ul><li>Risico op nachtvorst</li><li>Trage groei door kou</li><li>Stress voor de plant</li></ul><p><strong>Te laat (na 15 juni):</strong></p><ul><li>Minder vegetatieve groei</li><li>Kleinere plant</li><li>Minder opbrengst</li></ul>')
    ),
    'faq', jsonb_build_array(
      jsonb_build_object('question', 'Wat is de beste datum?', 'answer', 'Tussen 15 en 31 mei voor photoperiod strains. Autoflowers kunnen tot half juni.')
    )
  ),
  'faq',
  true,
  now()
) ON CONFLICT (slug) DO UPDATE SET content = EXCLUDED.content, last_updated = now();

-- 6. Beste Strains Buitenkweek
INSERT INTO seo_content_pages (slug, title, h1_title, meta_description, meta_keywords, content, page_type, is_published, last_updated)
VALUES (
  'beste-strains-buitenkweek',
  'Beste Strains voor Buitenkweek in België | Wietforum',
  'De Beste Strains voor Buitenkweek',
  'Top 10 beste cannabis strains voor buitenkweek in het Belgische klimaat. Schimmelresistent en snel klaar.',
  ARRAY['beste strains buitenkweek', 'beste wiet buiten', 'outdoor strains', 'schimmelresistent'],
  jsonb_build_object(
    'sections', jsonb_build_array(
      jsonb_build_object('heading', 'Waar Moet Je Op Letten?', 'content', '<p>Voor het Belgische klimaat zijn belangrijk:</p><ul><li><strong>Schimmelresistentie</strong> - Veel regen en vocht</li><li><strong>Korte bloeitijd</strong> - Oogst voor de herfst</li><li><strong>Koude tolerantie</strong> - Kan tegen lagere temperaturen</li></ul>'),
      jsonb_build_object('heading', 'Top 5 Photoperiod Strains', 'content', '<ol><li><strong>Frisian Dew</strong> - Onze #1 voor België. Schimmelresistent, prachtige paarse buds</li><li><strong>Northern Lights</strong> - Betrouwbare klassieker, compact en sterk</li><li><strong>Early Skunk</strong> - Speciaal voor noord-Europa, vroege oogst</li><li><strong>Holland''s Hope</strong> - Nederlandse klassieker, bestand tegen vocht</li><li><strong>Durban Poison</strong> - Pure sativa, energieke high</li></ol>'),
      jsonb_build_object('heading', 'Top 5 Autoflowers', 'content', '<ol><li><strong>Northern Lights Auto</strong> - Snelle, betrouwbare klassieker</li><li><strong>Auto Ultimate</strong> - Grote opbrengst voor auto</li><li><strong>Quick One</strong> - Extra snel (8 weken)</li><li><strong>Auto Mazar</strong> - Indica dominant, relaxte high</li><li><strong>Gorilla Glue Auto</strong> - Krachtig en productief</li></ol>'),
      jsonb_build_object('heading', 'Onze Aanbeveling', 'content', '<p>Voor beginners: <strong>Northern Lights (Auto)</strong> - Foutloze groei, vergeeft fouten.</p><p>Voor ervaren kwekers: <strong>Frisian Dew</strong> - Maximale opbrengst en kwaliteit.</p>')
    ),
    'faq', jsonb_build_array(
      jsonb_build_object('question', 'Welke strain is het beste voor beginners?', 'answer', 'Northern Lights (Auto) - Vergeeft fouten, schimmelresistent, betrouwbaar.'),
      jsonb_build_object('question', 'Welke strain geeft de meeste opbrengst?', 'answer', 'Frisian Dew kan 500+ gram per plant opleveren buiten.')
    )
  ),
  'article',
  true,
  now()
) ON CONFLICT (slug) DO UPDATE SET content = EXCLUDED.content, last_updated = now();

-- 7. Outdoor Grow België
INSERT INTO seo_content_pages (slug, title, h1_title, meta_description, meta_keywords, content, page_type, is_published, last_updated)
VALUES (
  'outdoor-grow-belgie',
  'Outdoor Grow België: Tips van Ervaren Kwekers | Wietforum',
  'Outdoor Grow in België',
  'Outdoor cannabis grow tips specifiek voor België. Van locatiekeuze tot oogst. Ervaringen van de community.',
  ARRAY['outdoor grow belgie', 'outdoor cannabis', 'buiten groeien', 'outdoor tips'],
  jsonb_build_object(
    'sections', jsonb_build_array(
      jsonb_build_object('heading', 'Outdoor Groeien in België', 'content', '<p>België is prima geschikt voor outdoor cannabis. Het klimaat is vergelijkbaar met Nederland en Noord-Duitsland waar al decennia succesvol buiten wordt gekweekt.</p>'),
      jsonb_build_object('heading', 'Tips van de Community', 'content', '<ul><li>"Start binnen en verhuis naar buiten" - vroege start geeft voorsprong</li><li>"Gebruik altijd schimmelresistente strains" - het Belgische weer is onvoorspelbaar</li><li>"Kweek in potten voor flexibiliteit" - kun je verplaatsen bij slecht weer</li><li>"Check dagelijks op schimmel in september" - kritieke periode</li></ul>'),
      jsonb_build_object('heading', 'Veelgemaakte Fouten', 'content', '<ul><li>Te vroeg buiten planten (voor 15 mei)</li><li>Verkeerde strain kiezen (te lange bloei)</li><li>Onvoldoende drainage</li><li>Te laat oogsten (schimmel)</li></ul>')
    ),
    'faq', jsonb_build_array(
      jsonb_build_object('question', 'Is outdoor kweken moeilijk?', 'answer', 'Nee, het is eigenlijk makkelijker dan binnen. De natuur doet veel werk voor je.')
    )
  ),
  'article',
  true,
  now()
) ON CONFLICT (slug) DO UPDATE SET content = EXCLUDED.content, last_updated = now();

-- =====================================================
-- 3.2 BINNENKWEEK (15 keywords)
-- =====================================================

-- 8. Binnenkweek Wiet
INSERT INTO seo_content_pages (slug, title, h1_title, meta_description, meta_keywords, content, page_type, is_published, last_updated)
VALUES (
  'binnenkweek-wiet',
  'Binnenkweek Wiet: Complete Beginnersgids | Wietforum',
  'Binnenkweek Wiet: Van Beginner tot Expert',
  'Alles over wiet binnenkweek. Kweektent, verlichting, voeding en meer. Stap-voor-stap handleiding.',
  ARRAY['binnenkweek wiet', 'indoor wiet', 'binnen kweken', 'wiet binnenshuis'],
  jsonb_build_object(
    'sections', jsonb_build_array(
      jsonb_build_object('heading', 'Waarom Binnenkweek?', 'content', '<p>Voordelen van binnen kweken:</p><ul><li><strong>Volledige controle</strong> over klimaat</li><li><strong>Jaarrond kweken</strong> - niet seizoensgebonden</li><li><strong>Meerdere oogsten</strong> per jaar mogelijk</li><li><strong>Consistente kwaliteit</strong></li><li><strong>Privacy</strong> - niemand ziet het</li></ul>'),
      jsonb_build_object('heading', 'Wat Heb Je Nodig?', 'content', '<p><strong>Basis setup:</strong></p><ul><li>Kweektent (80x80 of 100x100 cm voor 1-4 planten)</li><li>Verlichting (LED 100-300W)</li><li>Ventilatie (afzuiger + koolstoffilter)</li><li>Potten en grond</li><li>Voeding (groei + bloei)</li><li>Timer voor licht</li><li>pH meter</li></ul>'),
      jsonb_build_object('heading', 'De Lichtcyclus', 'content', '<p><strong>Vegetatieve fase:</strong> 18 uur licht / 6 uur donker</p><p><strong>Bloei fase:</strong> 12 uur licht / 12 uur donker</p><p>Autoflowers: 18-20 uur licht door de hele cyclus.</p>'),
      jsonb_build_object('heading', 'Budget Inschatting', 'content', '<p><strong>Basis setup:</strong> €200-400</p><p><strong>Gemiddelde setup:</strong> €400-700</p><p><strong>Premium setup:</strong> €700-1500+</p><p>Elektriciteitskosten: €20-50/maand (afhankelijk van lamp)</p>')
    ),
    'faq', jsonb_build_array(
      jsonb_build_object('question', 'Hoeveel kost een binnenkweek setup?', 'answer', 'Een basis setup kost €200-400. Met kwaliteitsmateriaal €400-700.'),
      jsonb_build_object('question', 'Hoeveel elektriciteit verbruikt het?', 'answer', 'Afhankelijk van de lamp: LED 100-300W. Reken op €20-50 per maand extra.')
    )
  ),
  'pillar',
  true,
  now()
) ON CONFLICT (slug) DO UPDATE SET content = EXCLUDED.content, last_updated = now();

-- 9. Indoor Kweek Cannabis
INSERT INTO seo_content_pages (slug, title, h1_title, meta_description, meta_keywords, content, page_type, is_published, last_updated)
VALUES (
  'indoor-kweek-cannabis',
  'Indoor Cannabis Kweek: Professionele Gids | Wietforum',
  'Indoor Cannabis Kweken',
  'Professionele gids voor indoor cannabis kweek. Van setup tot oogst. Maximaliseer je opbrengst.',
  ARRAY['indoor kweek cannabis', 'indoor cannabis', 'cannabis binnen', 'indoor grow'],
  jsonb_build_object(
    'sections', jsonb_build_array(
      jsonb_build_object('heading', 'De Indoor Setup', 'content', '<p>Een goede indoor setup bestaat uit:</p><ol><li><strong>Kweekruimte</strong> - Tent, kast of kamer</li><li><strong>Verlichting</strong> - LED of HPS</li><li><strong>Ventilatie</strong> - Verse lucht in, oude lucht uit</li><li><strong>Geurfiltering</strong> - Koolstoffilter</li><li><strong>Klimaatbeheersing</strong> - Temp 20-28°C, RV 40-60%</li></ol>'),
      jsonb_build_object('heading', 'Het Kweekproces', 'content', '<p><strong>Week 1-2:</strong> Kiemen en zaailing</p><p><strong>Week 3-6:</strong> Vegetatieve groei (18/6 licht)</p><p><strong>Week 7-14:</strong> Bloei (12/12 licht)</p><p><strong>Week 15-16:</strong> Oogst, drogen, curen</p><p>Totaal: 3-4 maanden per cyclus.</p>'),
      jsonb_build_object('heading', 'Veelgemaakte Fouten', 'content', '<ul><li>Te veel water geven</li><li>Verkeerde pH (moet 6.0-7.0 zijn in aarde)</li><li>Te veel voeding</li><li>Slechte ventilatie</li><li>Lichtlekkage tijdens bloei</li></ul>')
    ),
    'faq', jsonb_build_array(
      jsonb_build_object('question', 'Hoe lang duurt een indoor kweek?', 'answer', 'Gemiddeld 3-4 maanden van zaad tot oogst.'),
      jsonb_build_object('question', 'Hoeveel opbrengst per plant?', 'answer', 'Indoor gemiddeld 50-150 gram per plant, afhankelijk van setup en ervaring.')
    )
  ),
  'pillar',
  true,
  now()
) ON CONFLICT (slug) DO UPDATE SET content = EXCLUDED.content, last_updated = now();

-- 10. Kweektent
INSERT INTO seo_content_pages (slug, title, h1_title, meta_description, meta_keywords, content, page_type, is_published, last_updated)
VALUES (
  'kweektent',
  'Kweektent Kopen: Welke Maat & Merk? | Wietforum',
  'De Beste Kweektent Kiezen',
  'Alles over kweektenten. Welke maat, welk merk, waar op letten? Reviews en aanbevelingen.',
  ARRAY['kweektent', 'growtent', 'kweektent kopen', 'grow tent'],
  jsonb_build_object(
    'sections', jsonb_build_array(
      jsonb_build_object('heading', 'Waarom een Kweektent?', 'content', '<p>Een kweektent biedt:</p><ul><li><strong>Lichtdicht</strong> - Geen lichtlekkage</li><li><strong>Reflecterend</strong> - Meer licht voor planten</li><li><strong>Gecontroleerde omgeving</strong></li><li><strong>Makkelijk op te zetten</strong></li></ul>'),
      jsonb_build_object('heading', 'Welke Maat Kiezen?', 'content', '<p><strong>60x60 cm:</strong> 1-2 planten, klein en discreet</p><p><strong>80x80 cm:</strong> 2-4 planten, ideaal voor beginners</p><p><strong>100x100 cm:</strong> 4-6 planten, goede productie</p><p><strong>120x120 cm:</strong> 6-9 planten, serieuze opbrengst</p>'),
      jsonb_build_object('heading', 'Top Merken', 'content', '<ol><li><strong>Secret Jardin</strong> - Premium kwaliteit, duurzaam</li><li><strong>Mammoth</strong> - Professioneel, lichtdicht</li><li><strong>Homebox</strong> - Goede prijs/kwaliteit</li><li><strong>Budget opties</strong> - Mars Hydro, budget tenten</li></ol>'),
      jsonb_build_object('heading', 'Waar Op Letten?', 'content', '<ul><li>Reflectie binnenmateriaal (mylar)</li><li>Stevige rits (niet lichtdoorlatend)</li><li>Sterke frame (draagkracht)</li><li>Voldoende openingen voor kabels/ventilatie</li></ul>')
    ),
    'faq', jsonb_build_array(
      jsonb_build_object('question', 'Welke maat tent voor 1 plant?', 'answer', '60x60 of 80x80 cm is voldoende voor 1 plant.'),
      jsonb_build_object('question', 'Hoeveel kost een goede kweektent?', 'answer', 'Budget: €50-100, Middenklasse: €100-200, Premium: €200-400.')
    )
  ),
  'article',
  true,
  now()
) ON CONFLICT (slug) DO UPDATE SET content = EXCLUDED.content, last_updated = now();

-- 11. Beste Kweektent
INSERT INTO seo_content_pages (slug, title, h1_title, meta_description, meta_keywords, content, page_type, is_published, last_updated)
VALUES (
  'beste-kweektent',
  'Beste Kweektent 2025: Reviews & Vergelijking | Wietforum',
  'De Beste Kweektenten van 2025',
  'Review van de beste kweektenten. Secret Jardin, Mammoth, Homebox vergeleken. Tips voor de juiste keuze.',
  ARRAY['beste kweektent', 'kweektent review', 'growtent vergelijking', 'top kweektent'],
  jsonb_build_object(
    'sections', jsonb_build_array(
      jsonb_build_object('heading', 'Onze Top 3', 'content', '<ol><li><strong>Secret Jardin Dark Street</strong> - Beste algeheel. Premium kwaliteit, perfecte lichtafsluiting, 5 jaar garantie.</li><li><strong>Mammoth Classic</strong> - Professionele keuze. Extra dik materiaal, zeer duurzaam.</li><li><strong>Homebox Ambient</strong> - Beste prijs/kwaliteit. Degelijke tent voor beginners.</li></ol>'),
      jsonb_build_object('heading', 'Budget Opties', 'content', '<p>Als budget beperkt is:</p><ul><li><strong>Mars Hydro Tent</strong> - Goedkoop maar degelijk</li><li><strong>Amazon basics tenten</strong> - Functioneel, niet luxe</li></ul><p>Let op: goedkope tenten lekken soms licht langs de rits.</p>')
    ),
    'faq', jsonb_build_array(
      jsonb_build_object('question', 'Welke kweektent is de beste?', 'answer', 'Secret Jardin Dark Street is onze top keuze voor kwaliteit. Homebox Ambient voor prijs/kwaliteit.')
    )
  ),
  'article',
  true,
  now()
) ON CONFLICT (slug) DO UPDATE SET content = EXCLUDED.content, last_updated = now();

-- 12. LED Lampen Kweek
INSERT INTO seo_content_pages (slug, title, h1_title, meta_description, meta_keywords, content, page_type, is_published, last_updated)
VALUES (
  'led-lampen-kweek',
  'LED Lampen voor Cannabis Kweek: Gids & Reviews | Wietforum',
  'LED Groeilampen voor Cannabis',
  'Alles over LED lampen voor cannabis kweek. Welk wattage, welk merk, LED vs HPS. Complete koopgids.',
  ARRAY['led lampen kweek', 'led groeilamp', 'led cannabis', 'kweeklamp led'],
  jsonb_build_object(
    'sections', jsonb_build_array(
      jsonb_build_object('heading', 'Waarom LED?', 'content', '<p>LED verlichting heeft vele voordelen:</p><ul><li><strong>Zuiniger</strong> - 30-50% minder elektriciteit dan HPS</li><li><strong>Minder warmte</strong> - Makkelijker klimaatbeheersing</li><li><strong>Langere levensduur</strong> - 50.000+ uur</li><li><strong>Full spectrum</strong> - Optimaal licht voor de plant</li></ul>'),
      jsonb_build_object('heading', 'Hoeveel Watt?', 'content', '<p>Vuistregel: <strong>30-50W per plant</strong> of <strong>400-600W per m²</strong></p><p><strong>60x60 tent:</strong> 100-150W LED</p><p><strong>80x80 tent:</strong> 150-250W LED</p><p><strong>100x100 tent:</strong> 250-400W LED</p><p><strong>120x120 tent:</strong> 400-600W LED</p>'),
      jsonb_build_object('heading', 'Beste Merken', 'content', '<ol><li><strong>Samsung LM301 chips</strong> - Premium, hoogste efficientie</li><li><strong>Spider Farmer</strong> - Goede prijs/kwaliteit</li><li><strong>Mars Hydro</strong> - Budget vriendelijk</li><li><strong>Sanlight</strong> - Europees premium merk</li></ol>'),
      jsonb_build_object('heading', 'LED vs HPS', 'content', '<p><strong>LED:</strong> Zuiniger, minder warmte, hogere aanschafprijs</p><p><strong>HPS:</strong> Goedkoper in aanschaf, meer warmte, bewezen resultaten</p><p>Voor beginners raden wij LED aan vanwege het gemak.</p>')
    ),
    'faq', jsonb_build_array(
      jsonb_build_object('question', 'Hoeveel watt LED per plant?', 'answer', 'Minimaal 30-50W per plant voor goede resultaten.'),
      jsonb_build_object('question', 'Welke LED lamp is het beste?', 'answer', 'Spider Farmer en Mars Hydro bieden de beste prijs/kwaliteit voor hobbyisten.')
    )
  ),
  'article',
  true,
  now()
) ON CONFLICT (slug) DO UPDATE SET content = EXCLUDED.content, last_updated = now();

-- 13. Kweekschema Wiet
INSERT INTO seo_content_pages (slug, title, h1_title, meta_description, meta_keywords, content, page_type, is_published, last_updated)
VALUES (
  'kweekschema-wiet',
  'Kweekschema Wiet: Week voor Week | Wietforum',
  'Kweekschema: Week voor Week Guide',
  'Compleet kweekschema voor wiet. Van kiemen tot oogst, week voor week uitgelegd. Voeding, licht en meer.',
  ARRAY['kweekschema wiet', 'week schema', 'groei schema', 'kweek planning'],
  jsonb_build_object(
    'sections', jsonb_build_array(
      jsonb_build_object('heading', 'Week 1-2: Kiemen & Zaailing', 'content', '<p><strong>Licht:</strong> 18/6 (laag vermogen of afstand)</p><p><strong>Voeding:</strong> Geen, alleen water</p><p><strong>RV:</strong> 65-70%</p><p><strong>Acties:</strong> Kiem zaadjes, plant in kleine pot</p>'),
      jsonb_build_object('heading', 'Week 3-4: Vroege Vegetatie', 'content', '<p><strong>Licht:</strong> 18/6 (vol vermogen)</p><p><strong>Voeding:</strong> Start met 1/4 dosis groeivoeding</p><p><strong>RV:</strong> 60-70%</p><p><strong>Acties:</strong> Verpot naar grotere pot, start training</p>'),
      jsonb_build_object('heading', 'Week 5-6: Late Vegetatie', 'content', '<p><strong>Licht:</strong> 18/6</p><p><strong>Voeding:</strong> Volledige dosis groeivoeding</p><p><strong>RV:</strong> 50-60%</p><p><strong>Acties:</strong> Laatste verpotting, LST/topping</p>'),
      jsonb_build_object('heading', 'Week 7-10: Bloei Begin', 'content', '<p><strong>Licht:</strong> 12/12</p><p><strong>Voeding:</strong> Schakel naar bloeivoeding</p><p><strong>RV:</strong> 40-50%</p><p><strong>Acties:</strong> Stop training, plant gaat stretchen</p>'),
      jsonb_build_object('heading', 'Week 11-14: Bloei Midden/Laat', 'content', '<p><strong>Licht:</strong> 12/12</p><p><strong>Voeding:</strong> Volle bloeivoeding, stop laatste 2 weken (spoelen)</p><p><strong>RV:</strong> 40-45%</p><p><strong>Acties:</strong> Check trichomen, bepaal oogsttijdstip</p>'),
      jsonb_build_object('heading', 'Week 15-16: Oogst & Drogen', 'content', '<p><strong>Oogst:</strong> Bij 70-80% melkachtige trichomen</p><p><strong>Drogen:</strong> 7-14 dagen bij 18-22°C, 45-55% RV</p><p><strong>Curen:</strong> Minimaal 2 weken in glazen potten</p>')
    ),
    'faq', jsonb_build_array(
      jsonb_build_object('question', 'Hoe lang duurt een complete kweek?', 'answer', 'Gemiddeld 14-16 weken (3.5-4 maanden) van zaad tot gedroogde wiet.'),
      jsonb_build_object('question', 'Wanneer switch ik naar bloei?', 'answer', 'Als de plant de gewenste grootte heeft, meestal na 4-6 weken vegetatie. Plant verdubbelt vaak in bloei.')
    )
  ),
  'article',
  true,
  now()
) ON CONFLICT (slug) DO UPDATE SET content = EXCLUDED.content, last_updated = now();

-- 14. Sea of Green (SOG)
INSERT INTO seo_content_pages (slug, title, h1_title, meta_description, meta_keywords, content, page_type, is_published, last_updated)
VALUES (
  'sea-of-green',
  'Sea of Green (SOG): Maximale Opbrengst | Wietforum',
  'Sea of Green Methode Uitgelegd',
  'De Sea of Green (SOG) kweektechniek. Veel kleine planten voor maximale opbrengst. Hoe werkt het?',
  ARRAY['sea of green', 'SOG methode', 'sog techniek', 'veel planten'],
  jsonb_build_object(
    'sections', jsonb_build_array(
      jsonb_build_object('heading', 'Wat Is Sea of Green?', 'content', '<p>Sea of Green (SOG) is een kweektechniek waarbij je <strong>veel kleine planten</strong> kweekt in plaats van weinig grote planten. De planten worden snel na kiemen in bloei gezet.</p>'),
      jsonb_build_object('heading', 'Hoe Werkt Het?', 'content', '<ol><li>Veel planten op kleine ruimte (4-16 per m²)</li><li>Korte vegetatieve fase (1-2 weken)</li><li>Snel naar bloei (12/12)</li><li>Elke plant produceert 1 grote top</li></ol>'),
      jsonb_build_object('heading', 'Voordelen', 'content', '<ul><li>Snellere oogstcyclus</li><li>Maximale benutting van licht</li><li>Minder vegetatietijd = sneller resultaat</li></ul>'),
      jsonb_build_object('heading', 'Nadelen & Let Op', 'content', '<ul><li>Meer planten = meer juridisch risico</li><li>Vereist klonen voor uniformiteit</li><li>Meer werk (meer planten verzorgen)</li></ul><p><strong>Let op:</strong> In België is 1 plant gedoogd. SOG met meerdere planten valt daar niet onder!</p>')
    ),
    'faq', jsonb_build_array(
      jsonb_build_object('question', 'Hoeveel planten voor SOG?', 'answer', '4-16 planten per m², afhankelijk van potmaat.'),
      jsonb_build_object('question', 'Is SOG legaal?', 'answer', 'In België is alleen 1 plant gedoogd. SOG met meerdere planten is illegaal.')
    )
  ),
  'article',
  true,
  now()
) ON CONFLICT (slug) DO UPDATE SET content = EXCLUDED.content, last_updated = now();

-- 15. SCROG Techniek
INSERT INTO seo_content_pages (slug, title, h1_title, meta_description, meta_keywords, content, page_type, is_published, last_updated)
VALUES (
  'scrog-techniek',
  'SCROG Techniek: Screen of Green Uitgelegd | Wietforum',
  'SCROG: Screen of Green Methode',
  'De SCROG kweektechniek voor maximale opbrengst met 1 plant. Gebruik een net om de canopy gelijk te houden.',
  ARRAY['scrog techniek', 'screen of green', 'scrog methode', 'net training'],
  jsonb_build_object(
    'sections', jsonb_build_array(
      jsonb_build_object('heading', 'Wat Is SCROG?', 'content', '<p>SCROG (Screen of Green) is een trainingstechniek waarbij je een <strong>net of gaas</strong> boven je plant(en) plaatst. Je weeft de takken door het net om een <strong>gelijkmatige canopy</strong> te creëren.</p>'),
      jsonb_build_object('heading', 'Voordelen voor 1 Plant', 'content', '<p>SCROG is ideaal voor de <strong>1 plant regel</strong> in België:</p><ul><li>Maximale opbrengst uit 1 plant</li><li>Gelijkmatig licht voor alle toppen</li><li>Meer hoofdtoppen door training</li><li>Betere luchtcirculatie</li></ul>'),
      jsonb_build_object('heading', 'Hoe Toe Te Passen', 'content', '<ol><li>Plaats net op 20-40 cm boven de pot</li><li>Top de plant om vertakking te stimuleren</li><li>Weef takken horizontaal door het net</li><li>Vul 70-80% van het net voor je naar bloei gaat</li><li>Eerste 2 weken bloei: blijf weven</li></ol>'),
      jsonb_build_object('heading', 'Verwachte Resultaten', 'content', '<p>Met een goede SCROG kun je van <strong>1 plant 100-300 gram</strong> oogsten, afhankelijk van tentgrootte en verlichtging. Veel meer dan zonder training.</p>')
    ),
    'faq', jsonb_build_array(
      jsonb_build_object('question', 'Hoeveel opbrengst met SCROG?', 'answer', 'Een goed uitgevoerde SCROG kan 100-300 gram per plant opleveren.'),
      jsonb_build_object('question', 'Wanneer begin ik met SCROG?', 'answer', 'Plaats het net vroeg en begin met weven zodra takken het net bereiken, meestal in week 3-4.')
    )
  ),
  'article',
  true,
  now()
) ON CONFLICT (slug) DO UPDATE SET content = EXCLUDED.content, last_updated = now();

-- =====================================================
-- COMPLETION
-- =====================================================

DO $$
BEGIN
  RAISE NOTICE 'TIER 2 Kweek paginas succesvol aangemaakt';
  RAISE NOTICE 'Totaal: 15 paginas (7 buitenkweek + 8 binnenkweek)';
END $$;

