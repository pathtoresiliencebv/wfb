-- =====================================================
-- TIER 3: LONG-TAIL VRAGEN SEO PAGINA'S
-- 50+ FAQ-style pagina's voor specifieke zoekvragen
-- =====================================================

-- =====================================================
-- SECTIE 1: ALGEMENE VRAGEN (15 pagina's)
-- =====================================================

-- 1. Hoeveel gram is 1 plant?
INSERT INTO seo_content_pages (slug, title, h1_title, meta_description, meta_keywords, content, page_type, is_published, last_updated)
VALUES (
  'hoeveel-gram-1-plant',
  'Hoeveel Gram Wiet Levert 1 Plant Op? | Wietforum',
  'Hoeveel Gram Kun Je Oogsten Van 1 Plant?',
  'Wat is de opbrengst van 1 wietplant? Indoor vs outdoor, factoren die opbrengst beïnvloeden. Realistische verwachtingen.',
  ARRAY['hoeveel gram 1 plant', 'opbrengst wietplant', 'yield cannabis', 'oogst per plant'],
  jsonb_build_object(
    'sections', jsonb_build_array(
      jsonb_build_object('heading', 'Gemiddelde Opbrengst', 'content', '<p><strong>Indoor:</strong> 50-150 gram per plant (gemiddeld)</p><p><strong>Outdoor:</strong> 200-500 gram per plant (gemiddeld)</p><p><strong>Autoflower indoor:</strong> 30-100 gram per plant</p><p>Ervaren kwekers kunnen deze cijfers verdubbelen!</p>'),
      jsonb_build_object('heading', 'Factoren die Opbrengst Bepalen', 'content', '<ul><li><strong>Licht:</strong> Meer licht = meer opbrengst</li><li><strong>Potgrootte:</strong> Grotere pot = grotere plant</li><li><strong>Strain:</strong> Sommige strains produceren meer</li><li><strong>Vegetatietijd:</strong> Langer = groter</li><li><strong>Training:</strong> LST, SCROG verhogen yield</li><li><strong>Ervaring:</strong> Tijd en kennis helpen</li></ul>'),
      jsonb_build_object('heading', 'Indoor Maximaliseren', 'content', '<p>Met SCROG techniek en goede LED verlichting kun je van 1 plant <strong>150-300 gram</strong> halen in een 80x80 tent.</p>'),
      jsonb_build_object('heading', 'Outdoor Maximaliseren', 'content', '<p>Een buitenplant met veel ruimte en direct zonlicht kan <strong>500+ gram</strong> opleveren. Sommige strains halen zelfs 1kg+.</p>')
    ),
    'faq', jsonb_build_array(
      jsonb_build_object('question', 'Hoeveel gram levert 1 indoor plant?', 'answer', 'Gemiddeld 50-150 gram. Met training en goede lamp tot 300 gram.'),
      jsonb_build_object('question', 'Hoeveel gram levert 1 outdoor plant?', 'answer', 'Gemiddeld 200-500 gram. Grote strains kunnen 1kg+ opleveren.')
    )
  ),
  'faq',
  true,
  now()
) ON CONFLICT (slug) DO UPDATE SET content = EXCLUDED.content, last_updated = now();

-- 2. Hoe lang duurt een wietplant?
INSERT INTO seo_content_pages (slug, title, h1_title, meta_description, meta_keywords, content, page_type, is_published, last_updated)
VALUES (
  'hoe-lang-duurt-wietplant',
  'Hoe Lang Duurt Het Om Wiet Te Kweken? | Wietforum',
  'Hoe Lang Duurt Een Wietplant Van Zaad Tot Oogst?',
  'Hoeveel tijd kost het om wiet te kweken? Tijdlijn van kiemen tot oogst voor indoor, outdoor en autoflowers.',
  ARRAY['hoe lang wiet kweken', 'kweekduur cannabis', 'tijd wiet groeien', 'zaad tot oogst'],
  jsonb_build_object(
    'sections', jsonb_build_array(
      jsonb_build_object('heading', 'Totale Kweekduur', 'content', '<p><strong>Photoperiod Indoor:</strong> 14-20 weken (3.5-5 maanden)</p><p><strong>Autoflower Indoor:</strong> 8-12 weken (2-3 maanden)</p><p><strong>Outdoor (photoperiod):</strong> Mei tot september/oktober (5-6 maanden)</p>'),
      jsonb_build_object('heading', 'Fases Uitgesplitst', 'content', '<p><strong>1. Kiemen:</strong> 2-7 dagen</p><p><strong>2. Zaailing:</strong> 1-2 weken</p><p><strong>3. Vegetatieve groei:</strong> 3-8 weken (naar keuze)</p><p><strong>4. Bloei:</strong> 7-12 weken (strain-afhankelijk)</p><p><strong>5. Drogen:</strong> 7-14 dagen</p><p><strong>6. Curen:</strong> 2+ weken (langer = beter)</p>'),
      jsonb_build_object('heading', 'Snelste Weg', 'content', '<p>Autoflowers zijn de snelste optie. Quick One kan in <strong>8 weken</strong> klaar zijn van zaad tot oogst.</p>')
    ),
    'faq', jsonb_build_array(
      jsonb_build_object('question', 'Hoe lang duurt het om wiet te kweken?', 'answer', 'Photoperiod: 3.5-5 maanden. Autoflower: 2-3 maanden. Plus 2-4 weken drogen en curen.')
    )
  ),
  'faq',
  true,
  now()
) ON CONFLICT (slug) DO UPDATE SET content = EXCLUDED.content, last_updated = now();

-- 3. Wanneer wiet oogsten?
INSERT INTO seo_content_pages (slug, title, h1_title, meta_description, meta_keywords, content, page_type, is_published, last_updated)
VALUES (
  'wanneer-wiet-oogsten',
  'Wanneer Is Wiet Rijp Om Te Oogsten? | Wietforum',
  'Wanneer Is Het Tijd Om Wiet Te Oogsten?',
  'Hoe weet je wanneer wiet klaar is? Check de trichomen, pistils en meer. Timing voor beste effect.',
  ARRAY['wanneer oogsten', 'wiet rijp', 'trichomen checken', 'oogsttijd cannabis'],
  jsonb_build_object(
    'sections', jsonb_build_array(
      jsonb_build_object('heading', 'De Trichomen Check', 'content', '<p>De meest betrouwbare methode - gebruik een loep of microscoop:</p><ul><li><strong>Helder/transparant:</strong> Te vroeg, niet klaar</li><li><strong>Melkachtig/troebel:</strong> Piek THC, energieke high</li><li><strong>Amber/bruin:</strong> THC wordt CBN, meer stoned effect</li></ul><p><strong>Sweet spot:</strong> 70-80% melkachtig, 20-30% amber</p>'),
      jsonb_build_object('heading', 'Pistils (Haartjes)', 'content', '<p>Minder betrouwbaar maar een indicator:</p><ul><li>Witte pistils = nog aan het groeien</li><li>50-70% oranje/bruin = nog even</li><li>80-90% oranje/bruin = waarschijnlijk klaar</li></ul>'),
      jsonb_build_object('heading', 'Andere Tekens', 'content', '<ul><li>Bladeren beginnen te verkleuren</li><li>Buds zijn compact en hard</li><li>Sterke geur (terpenen rijp)</li><li>Plant stopt met groeien</li></ul>'),
      jsonb_build_object('heading', 'Effect op High', 'content', '<p><strong>Vroeg oogsten (meer melkachtig):</strong> Energiekere, cerebraal high</p><p><strong>Laat oogsten (meer amber):</strong> Meer body high, slaperig, couchlock</p>')
    ),
    'faq', jsonb_build_array(
      jsonb_build_object('question', 'Wanneer is wiet klaar?', 'answer', 'Check de trichomen met een loep. Oogst bij 70-80% melkachtig en 20-30% amber.'),
      jsonb_build_object('question', 'Kan ik te laat oogsten?', 'answer', 'Ja, THC breekt dan af tot CBN. Je wiet wordt slaperig maar minder krachtig.')
    )
  ),
  'faq',
  true,
  now()
) ON CONFLICT (slug) DO UPDATE SET content = EXCLUDED.content, last_updated = now();

-- 4. Hoe wiet drogen?
INSERT INTO seo_content_pages (slug, title, h1_title, meta_description, meta_keywords, content, page_type, is_published, last_updated)
VALUES (
  'hoe-wiet-drogen',
  'Hoe Droog Je Wiet Goed? Complete Gids | Wietforum',
  'Wiet Drogen: De Juiste Methode',
  'Hoe droog je wiet correct? Temperatuur, vochtigheid, timing en tips voor perfect gedroogde cannabis.',
  ARRAY['wiet drogen', 'cannabis drogen', 'buds drogen', 'drying cannabis'],
  jsonb_build_object(
    'sections', jsonb_build_array(
      jsonb_build_object('heading', 'Ideale Omstandigheden', 'content', '<p><strong>Temperatuur:</strong> 18-22°C (niet warmer!)</p><p><strong>Luchtvochtigheid:</strong> 45-55%</p><p><strong>Licht:</strong> Donker</p><p><strong>Ventilatie:</strong> Lichte luchtcirculatie (geen directe wind)</p>'),
      jsonb_build_object('heading', 'Methode 1: Hangend Drogen', 'content', '<ol><li>Knip takken van de plant</li><li>Verwijder grote bladeren</li><li>Hang takken ondersteboven aan lijn</li><li>Laat 7-14 dagen drogen</li><li>Test: steeltje "knapt" = klaar</li></ol>'),
      jsonb_build_object('heading', 'Methode 2: Droogrek', 'content', '<p>Leg losse buds op een droogrek met gaas. Iets sneller dan hangend (5-10 dagen).</p>'),
      jsonb_build_object('heading', 'Wanneer Klaar?', 'content', '<p><strong>Test:</strong> Buig een steeltje. Als het "knapt" is het klaar. Als het buigt, nog langer drogen.</p><p><strong>Vochtigheid buds:</strong> 60-65% ideaal voor curing</p>'),
      jsonb_build_object('heading', 'Veelgemaakte Fouten', 'content', '<ul><li>Te snel drogen (te warm) - smaak lijdt</li><li>Te vochtig - schimmelrisico</li><li>Direct zonlicht - breekt THC af</li><li>Geen luchtcirculatie - schimmel</li></ul>')
    ),
    'faq', jsonb_build_array(
      jsonb_build_object('question', 'Hoe lang wiet drogen?', 'answer', '7-14 dagen bij 18-22°C en 45-55% luchtvochtigheid.'),
      jsonb_build_object('question', 'Kan ik wiet in de oven drogen?', 'answer', 'Nee! Dit vernietigt terpenen en cannabinoïden. Altijd langzaam en koel drogen.')
    )
  ),
  'faq',
  true,
  now()
) ON CONFLICT (slug) DO UPDATE SET content = EXCLUDED.content, last_updated = now();

-- 5. Wat is curen?
INSERT INTO seo_content_pages (slug, title, h1_title, meta_description, meta_keywords, content, page_type, is_published, last_updated)
VALUES (
  'wat-is-curen',
  'Wat Is Curen? Cannabis Curing Uitgelegd | Wietforum',
  'Wat Is Cannabis Curen?',
  'Curen is het rijpen van cannabis na het drogen. Hoe het werkt, waarom het belangrijk is en hoe je het doet.',
  ARRAY['curen wiet', 'cannabis curing', 'wiet curen', 'buds curen'],
  jsonb_build_object(
    'sections', jsonb_build_array(
      jsonb_build_object('heading', 'Wat Is Curen?', 'content', '<p>Curen is het <strong>langzaam rijpen</strong> van gedroogde cannabis in afgesloten potten. Tijdens dit proces:</p><ul><li>Verdeelt vocht zich gelijkmatig</li><li>Breekt chlorofyl af (betere smaak)</li><li>Rijpen terpenen verder (aroma)</li><li>Wordt de rook gladder</li></ul>'),
      jsonb_build_object('heading', 'Hoe Te Curen', 'content', '<ol><li>Doe gedroogde buds in glazen potten (Mason jars)</li><li>Vul potten voor 75% (luchtruimte nodig)</li><li>Bewaar donker en koel (18-22°C)</li><li>Week 1-2: Open potten dagelijks 15-30 min ("burpen")</li><li>Week 3+: Burp 1-2x per week</li><li>Cure minimaal 2-4 weken</li></ol>'),
      jsonb_build_object('heading', 'Waarom Curen?', 'content', '<p><strong>Verschil is ENORM:</strong></p><ul><li>Veel betere smaak</li><li>Gladder roken (minder hoesten)</li><li>Sterker effect (beter geabsorbeerd)</li><li>Langere houdbaarheid</li></ul>'),
      jsonb_build_object('heading', 'Hoelang Curen?', 'content', '<p><strong>Minimum:</strong> 2 weken</p><p><strong>Goed:</strong> 4-8 weken</p><p><strong>Premium:</strong> 2-6 maanden</p><p>Sommigen curen een jaar voor ultieme kwaliteit!</p>')
    ),
    'faq', jsonb_build_array(
      jsonb_build_object('question', 'Hoe lang moet wiet curen?', 'answer', 'Minimaal 2 weken, ideaal 4-8 weken. Langer = beter.'),
      jsonb_build_object('question', 'Kan ik overslaan en direct roken?', 'answer', 'Ja, maar de kwaliteit is veel minder. Even geduld is het waard.')
    )
  ),
  'faq',
  true,
  now()
) ON CONFLICT (slug) DO UPDATE SET content = EXCLUDED.content, last_updated = now();

-- 6. Wat is THC?
INSERT INTO seo_content_pages (slug, title, h1_title, meta_description, meta_keywords, content, page_type, is_published, last_updated)
VALUES (
  'wat-is-thc',
  'Wat Is THC? De Psychoactieve Stof Uitgelegd | Wietforum',
  'Wat Is THC (Tetrahydrocannabinol)?',
  'Alles over THC: de stof die je high maakt. Hoe werkt het, effecten, risico''s en medisch gebruik.',
  ARRAY['wat is thc', 'thc uitleg', 'tetrahydrocannabinol', 'thc effect'],
  jsonb_build_object(
    'sections', jsonb_build_array(
      jsonb_build_object('heading', 'THC in het Kort', 'content', '<p><strong>THC (delta-9-tetrahydrocannabinol)</strong> is de belangrijkste psychoactieve cannabinoïde in cannabis. Het is de stof die je "high" maakt.</p>'),
      jsonb_build_object('heading', 'Hoe Werkt THC?', 'content', '<p>THC bindt aan <strong>CB1 receptoren</strong> in je hersenen. Dit veroorzaakt:</p><ul><li>Euforie en veranderde perceptie</li><li>Veranderde tijdservaring</li><li>Verhoogde eetlust</li><li>Relaxatie of energie (afhankelijk van strain)</li></ul>'),
      jsonb_build_object('heading', 'Effecten', 'content', '<p><strong>Positieve effecten:</strong></p><ul><li>Euforie, geluk</li><li>Creativiteit</li><li>Ontspanning</li><li>Pijnverlichting</li></ul><p><strong>Mogelijke negatieve effecten:</strong></p><ul><li>Paranoia, angst</li><li>Droge mond/ogen</li><li>Geheugenproblemen (tijdelijk)</li><li>Verhoogde hartslag</li></ul>'),
      jsonb_build_object('heading', 'THC Percentages', 'content', '<p><strong>Laag:</strong> 5-10% THC</p><p><strong>Gemiddeld:</strong> 15-20% THC</p><p><strong>Hoog:</strong> 20-25% THC</p><p><strong>Zeer hoog:</strong> 25%+ THC</p>')
    ),
    'faq', jsonb_build_array(
      jsonb_build_object('question', 'Is THC verslavend?', 'answer', 'Fysiek niet, maar mentale gewenning kan optreden bij intensief dagelijks gebruik.'),
      jsonb_build_object('question', 'Hoe lang blijft THC in je lichaam?', 'answer', 'In bloed 1-2 dagen, in urine 1-30 dagen (afhankelijk van gebruik), in haar tot 90 dagen.')
    )
  ),
  'faq',
  true,
  now()
) ON CONFLICT (slug) DO UPDATE SET content = EXCLUDED.content, last_updated = now();

-- 7. Hoeveel kost wiet?
INSERT INTO seo_content_pages (slug, title, h1_title, meta_description, meta_keywords, content, page_type, is_published, last_updated)
VALUES (
  'hoeveel-kost-wiet',
  'Hoeveel Kost Wiet in België? Prijzen 2025 | Wietforum',
  'Wat Kost Wiet in België?',
  'Actuele wietprijzen in België. Per gram, per ons en per kilo. Vergelijking met Nederland en straatprijzen.',
  ARRAY['wiet prijs belgie', 'hoeveel kost wiet', 'cannabis prijs', 'wiet kosten'],
  jsonb_build_object(
    'sections', jsonb_build_array(
      jsonb_build_object('heading', 'Gemiddelde Straatprijzen België', 'content', '<p><strong>Per gram:</strong> €8-15</p><p><strong>Per 5 gram:</strong> €35-60</p><p><strong>Per ons (28 gram):</strong> €150-300</p><p>Prijzen variëren per regio en kwaliteit.</p>'),
      jsonb_build_object('heading', 'Factoren die Prijs Beïnvloeden', 'content', '<ul><li><strong>Kwaliteit:</strong> Topshelf vs midgrade</li><li><strong>Beschikbaarheid:</strong> Schaars = duurder</li><li><strong>Regio:</strong> Stad vs platteland</li><li><strong>Bron:</strong> Dealer vs kennis</li><li><strong>Hoeveelheid:</strong> Meer = goedkoper per gram</li></ul>'),
      jsonb_build_object('heading', 'Eigen Kweek Kosten', 'content', '<p>Zelf kweken is veel goedkoper op termijn:</p><ul><li><strong>Setup:</strong> €200-500 eenmalig</li><li><strong>Per kweek:</strong> €50-100 (zaden, elektra, voeding)</li><li><strong>Opbrengst:</strong> 50-150 gram per plant</li><li><strong>Effectieve prijs:</strong> €1-3 per gram</li></ul>')
    ),
    'faq', jsonb_build_array(
      jsonb_build_object('question', 'Hoeveel kost 1 gram wiet?', 'answer', 'Gemiddeld €8-15 in België, afhankelijk van kwaliteit en bron.'),
      jsonb_build_object('question', 'Is wiet duurder in België dan Nederland?', 'answer', 'Ja, door illegale markt. Nederlandse coffeeshop prijzen zijn €8-12 per gram.')
    )
  ),
  'faq',
  true,
  now()
) ON CONFLICT (slug) DO UPDATE SET content = EXCLUDED.content, last_updated = now();

-- 8. Hoe lang is wiet houdbaar?
INSERT INTO seo_content_pages (slug, title, h1_title, meta_description, meta_keywords, content, page_type, is_published, last_updated)
VALUES (
  'hoe-lang-wiet-houdbaar',
  'Hoe Lang Is Wiet Houdbaar? Bewaren Tips | Wietforum',
  'Hoe Lang Blijft Wiet Goed?',
  'Houdbaarheid van wiet en hoe je het het beste bewaart. Glazen pot, koele plek en meer tips.',
  ARRAY['wiet houdbaar', 'wiet bewaren', 'cannabis houdbaarheid', 'wiet vers houden'],
  jsonb_build_object(
    'sections', jsonb_build_array(
      jsonb_build_object('heading', 'Houdbaarheid', 'content', '<p><strong>Goed bewaard:</strong> 6 maanden - 2 jaar</p><p><strong>Slecht bewaard:</strong> Weken tot maanden</p><p>THC breekt langzaam af tot CBN, waardoor wiet minder krachtig maar slaperige wordt.</p>'),
      jsonb_build_object('heading', 'Ideale Bewaaromstandigheden', 'content', '<ul><li><strong>Container:</strong> Glazen pot met luchtdichte deksel</li><li><strong>Temperatuur:</strong> 15-21°C</li><li><strong>Luchtvochtigheid:</strong> 59-63%</li><li><strong>Licht:</strong> Donker (UV breekt THC af)</li></ul>'),
      jsonb_build_object('heading', 'Boveda Packs', 'content', '<p>Boveda humidity packs houden de luchtvochtigheid perfect op 62%. Stop er één in je pot voor optimale bewaring.</p>'),
      jsonb_build_object('heading', 'Tekens van Slechte Wiet', 'content', '<ul><li>Schimmel (witte/grijze vlekken)</li><li>Droog en kruimelig</li><li>Geen geur meer</li><li>Verkleurd (bruin/grijs)</li></ul>')
    ),
    'faq', jsonb_build_array(
      jsonb_build_object('question', 'Hoe lang blijft wiet goed?', 'answer', 'Goed bewaard 6-24 maanden. De kracht neemt langzaam af.'),
      jsonb_build_object('question', 'Kan oude wiet je ziek maken?', 'answer', 'Als het beschimmeld is wel. Droge, oude wiet is minder krachtig maar niet per se gevaarlijk.')
    )
  ),
  'faq',
  true,
  now()
) ON CONFLICT (slug) DO UPDATE SET content = EXCLUDED.content, last_updated = now();

-- 9. Kan wiet schimmelen?
INSERT INTO seo_content_pages (slug, title, h1_title, meta_description, meta_keywords, content, page_type, is_published, last_updated)
VALUES (
  'kan-wiet-schimmelen',
  'Kan Wiet Schimmelen? Herkennen & Voorkomen | Wietforum',
  'Schimmel op Wiet: Herkennen en Voorkomen',
  'Hoe herken je schimmel op wiet? Wat te doen en hoe het te voorkomen. Gezondheidsrisico''s uitgelegd.',
  ARRAY['wiet schimmel', 'schimmel herkennen', 'beschimmelde wiet', 'bud rot'],
  jsonb_build_object(
    'sections', jsonb_build_array(
      jsonb_build_object('heading', 'Kan Wiet Schimmelen?', 'content', '<p><strong>Ja, absoluut!</strong> Cannabis is organisch materiaal en kan schimmelen bij verkeerde omstandigheden:</p><ul><li>Te vochtig bewaard</li><li>Niet goed gedroogd</li><li>Geen luchtcirculatie</li></ul>'),
      jsonb_build_object('heading', 'Soorten Schimmel', 'content', '<p><strong>Botrytis (bud rot):</strong> Grijze schimmel, begint van binnen de bud</p><p><strong>Meeldauw:</strong> Wit poeder op bladeren</p><p><strong>Aspergillus:</strong> Gevaarlijk, niet zichtbaar, groeit tijdens opslag</p>'),
      jsonb_build_object('heading', 'Hoe Herkennen?', 'content', '<ul><li>Witte/grijze vlekken of draden</li><li>Donkere, zachte plekken in buds</li><li>Muf/vochtig ruikende wiet</li><li>Buds die "uit elkaar vallen"</li></ul>'),
      jsonb_build_object('heading', 'Gezondheidsrisico''s', 'content', '<p><strong>Rook NOOIT beschimmelde wiet!</strong></p><ul><li>Luchtweginfecties</li><li>Allergische reacties</li><li>Aspergillosis (ernstig bij zwak immuunsysteem)</li></ul>'),
      jsonb_build_object('heading', 'Voorkomen', 'content', '<ul><li>Droog tot 60-65% vochtigheid</li><li>Bewaar in luchtdichte pot</li><li>Gebruik Boveda packs</li><li>Geen extreme temperatuurwisselingen</li></ul>')
    ),
    'faq', jsonb_build_array(
      jsonb_build_object('question', 'Is beschimmelde wiet gevaarlijk?', 'answer', 'Ja, het kan ernstige longinfecties veroorzaken. Gooi beschimmelde wiet altijd weg.'),
      jsonb_build_object('question', 'Kan ik de schimmel eraf halen?', 'answer', 'Nee, als je schimmel ziet, zijn de sporen al door de hele bud verspreid. Niet roken!')
    )
  ),
  'faq',
  true,
  now()
) ON CONFLICT (slug) DO UPDATE SET content = EXCLUDED.content, last_updated = now();

-- 10. Wat is hasj?
INSERT INTO seo_content_pages (slug, title, h1_title, meta_description, meta_keywords, content, page_type, is_published, last_updated)
VALUES (
  'wat-is-hasj',
  'Wat Is Hasj? Verschil met Wiet | Wietforum',
  'Wat Is Hasj Precies?',
  'Wat is hasj en hoe verschilt het van wiet? Productie, effect en verschillende soorten hasj uitgelegd.',
  ARRAY['wat is hasj', 'hasj uitleg', 'hash', 'verschil wiet hasj'],
  jsonb_build_object(
    'sections', jsonb_build_array(
      jsonb_build_object('heading', 'Wat Is Hasj?', 'content', '<p>Hasj is een <strong>concentraat van cannabis trichomen</strong> (de harsklieren). Het zijn de trichomen geperst of verwerkt tot een vaste substantie.</p><p>In essentie: de pure krachtige delen van de plant.</p>'),
      jsonb_build_object('heading', 'Hasj vs Wiet', 'content', '<p><strong>Wiet:</strong> Gedroogde bloemen van de plant</p><p><strong>Hasj:</strong> Geconcentreerde trichomen/hars</p><p>Hasj is meestal <strong>sterker</strong> (20-60% THC) dan wiet (15-25% THC).</p>'),
      jsonb_build_object('heading', 'Soorten Hasj', 'content', '<ul><li><strong>Dry sift/kief:</strong> Droog gezeefd</li><li><strong>Bubble hash:</strong> Met ijswater gemaakt</li><li><strong>Charas:</strong> Hand-gerolde hars (traditioneel)</li><li><strong>Afghaan/Marokkaan:</strong> Traditionele export hasj</li><li><strong>Rosin:</strong> Met warmte en druk geperst</li></ul>'),
      jsonb_build_object('heading', 'Hoe Gebruiken?', 'content', '<p>Hasj kun je:</p><ul><li>Verkruimelen in joint (met tabak of wiet)</li><li>In pijp of bong</li><li>Verdampen</li><li>Verwerken in edibles</li></ul>')
    ),
    'faq', jsonb_build_array(
      jsonb_build_object('question', 'Is hasj sterker dan wiet?', 'answer', 'Ja, hasj bevat meer geconcentreerde cannabinoïden. 20-60% THC vs 15-25% bij wiet.'),
      jsonb_build_object('question', 'Hoe wordt hasj gemaakt?', 'answer', 'Door trichomen te verzamelen via zeven, ijswater-extractie, of met warmte en druk.')
    )
  ),
  'faq',
  true,
  now()
) ON CONFLICT (slug) DO UPDATE SET content = EXCLUDED.content, last_updated = now();

-- 11. Wat zijn trichomen?
INSERT INTO seo_content_pages (slug, title, h1_title, meta_description, meta_keywords, content, page_type, is_published, last_updated)
VALUES (
  'wat-zijn-trichomen',
  'Wat Zijn Trichomen? De Kracht van Cannabis | Wietforum',
  'Wat Zijn Trichomen?',
  'Trichomen zijn de harsklieren op cannabis waar THC en terpenen in zitten. Alles over deze kristallen.',
  ARRAY['trichomen', 'wat zijn trichomen', 'kristallen wiet', 'harsklieren'],
  jsonb_build_object(
    'sections', jsonb_build_array(
      jsonb_build_object('heading', 'Wat Zijn Trichomen?', 'content', '<p>Trichomen zijn <strong>kleine harsklieren</strong> op cannabisbloemen en -bladeren. Ze zien eruit als kleine kristallen of "suiker" op de plant.</p><p>In trichomen zitten:</p><ul><li>Cannabinoïden (THC, CBD, etc.)</li><li>Terpenen (geur en smaak)</li><li>Flavonoïden</li></ul>'),
      jsonb_build_object('heading', 'Soorten Trichomen', 'content', '<p><strong>Capitate-stalked:</strong> Grootst en meest zichtbaar, paddenstoelvorm</p><p><strong>Capitate-sessile:</strong> Kleiner, zonder steel</p><p><strong>Bulbous:</strong> Zeer klein, over hele plant</p>'),
      jsonb_build_object('heading', 'Trichomen en Rijpheid', 'content', '<p>De kleur van trichomen geeft rijpheid aan:</p><ul><li><strong>Helder:</strong> Nog niet rijp</li><li><strong>Melkachtig:</strong> Optimaal THC</li><li><strong>Amber:</strong> THC wordt CBN</li></ul>'),
      jsonb_build_object('heading', 'Waarom Belangrijk?', 'content', '<p>Trichomen bevatten <strong>al het goede</strong> van cannabis. Kief, hasj, en andere concentraten zijn verzamelingen van trichomen.</p>')
    ),
    'faq', jsonb_build_array(
      jsonb_build_object('question', 'Wat zijn de kristallen op wiet?', 'answer', 'Dat zijn trichomen - harsklieren vol met THC, CBD en terpenen.'),
      jsonb_build_object('question', 'Kan ik trichomen verzamelen?', 'answer', 'Ja, dat heet kief. Gebruik een grinder met opvangbakje.')
    )
  ),
  'faq',
  true,
  now()
) ON CONFLICT (slug) DO UPDATE SET content = EXCLUDED.content, last_updated = now();

-- 12. Wat zijn terpenen?
INSERT INTO seo_content_pages (slug, title, h1_title, meta_description, meta_keywords, content, page_type, is_published, last_updated)
VALUES (
  'wat-zijn-terpenen',
  'Wat Zijn Terpenen? Geur, Smaak & Effect | Wietforum',
  'Wat Zijn Terpenen in Cannabis?',
  'Terpenen bepalen geur en smaak van wiet en beïnvloeden het effect. Overzicht van de belangrijkste terpenen.',
  ARRAY['terpenen', 'wat zijn terpenen', 'cannabis terpenen', 'terpene profile'],
  jsonb_build_object(
    'sections', jsonb_build_array(
      jsonb_build_object('heading', 'Wat Zijn Terpenen?', 'content', '<p>Terpenen zijn <strong>aromatische verbindingen</strong> die de geur en smaak van cannabis bepalen. Ze komen ook in veel andere planten voor (citrus, lavendel, pijnboom).</p><p>Naast geur beïnvloeden ze ook het <strong>effect</strong> van cannabis (entourage effect).</p>'),
      jsonb_build_object('heading', 'Belangrijkste Terpenen', 'content', '<p><strong>Myrceen:</strong> Aards, muskus. Kalmerend, slaperig.</p><p><strong>Limoneen:</strong> Citrus, fruitig. Opbeurend, energiek.</p><p><strong>Pineen:</strong> Pijnboom, fris. Alertheid, focus.</p><p><strong>Linalool:</strong> Bloemen, lavendel. Kalmerend, anti-angst.</p><p><strong>Caryophylleen:</strong> Peper, kruidig. Ontstekingsremmend.</p>'),
      jsonb_build_object('heading', 'Het Entourage Effect', 'content', '<p>Terpenen werken samen met cannabinoïden voor een <strong>sterker en gevarieerder effect</strong>. Daarom is full-spectrum vaak effectiever dan isolaat.</p>'),
      jsonb_build_object('heading', 'Terpenen Behouden', 'content', '<ul><li>Droog langzaam en koel</li><li>Cure in glazen potten</li><li>Bewaar donker</li><li>Niet te warm verdampen</li></ul>')
    ),
    'faq', jsonb_build_array(
      jsonb_build_object('question', 'Waarom ruikt wiet zo sterk?', 'answer', 'Door terpenen - aromatische verbindingen die de unieke geur van elke strain bepalen.'),
      jsonb_build_object('question', 'Beïnvloeden terpenen de high?', 'answer', 'Ja, ze moduleren het effect van THC en CBD via het entourage effect.')
    )
  ),
  'faq',
  true,
  now()
) ON CONFLICT (slug) DO UPDATE SET content = EXCLUDED.content, last_updated = now();

-- 13. Hoe maak je edibles?
INSERT INTO seo_content_pages (slug, title, h1_title, meta_description, meta_keywords, content, page_type, is_published, last_updated)
VALUES (
  'hoe-maak-je-edibles',
  'Hoe Maak Je Edibles? Cannabutter Recept | Wietforum',
  'Edibles Maken: Complete Handleiding',
  'Leer hoe je edibles maakt. Cannabutter, decarboxylatie en dosering. Stap-voor-stap uitgelegd.',
  ARRAY['edibles maken', 'cannabutter', 'wiet brownies', 'spacecake maken'],
  jsonb_build_object(
    'sections', jsonb_build_array(
      jsonb_build_object('heading', 'Stap 1: Decarboxylatie', 'content', '<p>THC-A moet eerst worden omgezet naar THC:</p><ol><li>Verhit oven op 110-120°C</li><li>Verkruimel wiet op bakplaat</li><li>Bak 30-45 minuten</li><li>Wiet wordt lichtbruin en droog</li></ol><p><strong>Dit is essentieel!</strong> Zonder decarb werken edibles niet.</p>'),
      jsonb_build_object('heading', 'Stap 2: Cannabutter Maken', 'content', '<ol><li>Smelt 250g boter in pan op laag vuur</li><li>Voeg 7-14 gram gedecarboxyleerde wiet toe</li><li>Laat 2-3 uur op laag vuur sudderen (niet laten koken!)</li><li>Zeef door kaasdoek</li><li>Laat afkoelen in koelkast</li></ol>'),
      jsonb_build_object('heading', 'Dosering Berekenen', 'content', '<p>Voorbeeld: 10 gram wiet met 20% THC = 2000mg THC</p><p>In 250g boter = 8mg THC per gram boter</p><p><strong>Begin dosis:</strong> 5-10mg THC per portie</p><p><strong>Sterke dosis:</strong> 20-50mg THC</p><p>Wacht minimaal 2 uur voor effect voordat je meer neemt!</p>'),
      jsonb_build_object('heading', 'Snelle Edibles Ideeën', 'content', '<ul><li>Brownies (klassiek)</li><li>Cookies</li><li>Op toast (simpel)</li><li>In koffie/thee (met vet)</li><li>In smoothie</li></ul>')
    ),
    'faq', jsonb_build_array(
      jsonb_build_object('question', 'Hoe lang werken edibles?', 'answer', '4-8 uur, soms langer. Effect begint na 30-90 minuten.'),
      jsonb_build_object('question', 'Waarom werken mijn edibles niet?', 'answer', 'Waarschijnlijk niet gedecarboxyleerd. Dit is een essentiële stap!')
    )
  ),
  'faq',
  true,
  now()
) ON CONFLICT (slug) DO UPDATE SET content = EXCLUDED.content, last_updated = now();

-- 14. Kan je van wiet overdoseren?
INSERT INTO seo_content_pages (slug, title, h1_title, meta_description, meta_keywords, content, page_type, is_published, last_updated)
VALUES (
  'overdosis-wiet',
  'Kun Je Overdoseren op Wiet? | Wietforum',
  'Kun Je Overdoseren op Cannabis?',
  'Is een dodelijke overdosis wiet mogelijk? Wat te doen als je teveel hebt gerookt. Feiten over cannabis veiligheid.',
  ARRAY['overdosis wiet', 'teveel wiet', 'greening out', 'wiet overdosis'],
  jsonb_build_object(
    'sections', jsonb_build_array(
      jsonb_build_object('heading', 'Het Korte Antwoord', 'content', '<p><strong>Nee, een dodelijke overdosis cannabis is praktisch onmogelijk.</strong></p><p>Je zou meer dan 1500 kilo in 15 minuten moeten consumeren om theoretisch te overlijden. Dat is fysiek onmogelijk.</p>'),
      jsonb_build_object('heading', 'Wel: Greening Out', 'content', '<p>"Greening out" is wanneer je <strong>teveel hebt geconsumeerd</strong>:</p><ul><li>Paranoia en angst</li><li>Misselijkheid/braken</li><li>Duizeligheid</li><li>Snelle hartslag</li><li>Bleek/wit worden</li></ul><p>Onaangenaam, maar niet gevaarlijk.</p>'),
      jsonb_build_object('heading', 'Wat Te Doen bij Greening Out', 'content', '<ul><li>Blijf kalm - het gaat voorbij</li><li>Ga liggen op een veilige plek</li><li>Drink water</li><li>Eet iets (vooral suikers)</li><li>CBD kan helpen THC te counteren</li><li>Slaap</li></ul><p>Het effect is tijdelijk (uren, niet dagen).</p>'),
      jsonb_build_object('heading', 'Edibles Risico', 'content', '<p>Bij edibles is overdosering makkelijker omdat:</p><ul><li>Effect komt laat (1-2 uur)</li><li>Mensen nemen meer omdat ze "niets voelen"</li><li>Effect is sterker en langer</li></ul><p><strong>Tip:</strong> Start met 5-10mg, wacht 2 uur.</p>')
    ),
    'faq', jsonb_build_array(
      jsonb_build_object('question', 'Kun je doodgaan van wiet?', 'answer', 'Nee, een dodelijke overdosis is praktisch onmogelijk. Wel kun je je erg beroerd voelen.'),
      jsonb_build_object('question', 'Wat doe ik als iemand te high is?', 'answer', 'Blijf kalm, laat ze liggen, geef water, en wacht tot het over gaat. Het is tijdelijk.')
    )
  ),
  'faq',
  true,
  now()
) ON CONFLICT (slug) DO UPDATE SET content = EXCLUDED.content, last_updated = now();

-- 15. Is wiet verslavend?
INSERT INTO seo_content_pages (slug, title, h1_title, meta_description, meta_keywords, content, page_type, is_published, last_updated)
VALUES (
  'is-wiet-verslavend',
  'Is Wiet Verslavend? De Feiten | Wietforum',
  'Is Cannabis Verslavend?',
  'Kun je verslaafd raken aan wiet? De wetenschap over cannabis afhankelijkheid, tolerantie en ontwenning.',
  ARRAY['wiet verslavend', 'cannabis verslaving', 'wiet afhankelijk', 'marijuana addiction'],
  jsonb_build_object(
    'sections', jsonb_build_array(
      jsonb_build_object('heading', 'Het Genuanceerde Antwoord', 'content', '<p><strong>Cannabis is niet fysiek verslavend</strong> zoals heroïne of alcohol. Je krijgt geen ernstige lichamelijke ontwenningsverschijnselen.</p><p><strong>Maar:</strong> Psychologische afhankelijkheid is mogelijk, vooral bij dagelijks gebruik.</p>'),
      jsonb_build_object('heading', 'Tolerantie', 'content', '<p>Bij regelmatig gebruik bouw je <strong>tolerantie</strong> op:</p><ul><li>Je hebt meer nodig voor hetzelfde effect</li><li>Tolerantie bouwt snel op</li><li>Tolerantie verdwijnt ook snel (1-2 weken pauze)</li></ul>'),
      jsonb_build_object('heading', 'Mogelijke Ontwenning', 'content', '<p>Na langdurig dagelijks gebruik kun je ervaren:</p><ul><li>Irritatie en stemmingswisselingen</li><li>Slaapproblemen</li><li>Verminderde eetlust</li><li>Onrustig gevoel</li></ul><p>Dit duurt meestal 1-2 weken en is mild vergeleken met andere stoffen.</p>'),
      jsonb_build_object('heading', 'Risicofactoren', 'content', '<p>Meer risico op problematisch gebruik bij:</p><ul><li>Dagelijks gebruik</li><li>Begin op jonge leeftijd (<18)</li><li>Gebruik om problemen te ontlopen</li><li>Genetische aanleg</li></ul>')
    ),
    'faq', jsonb_build_array(
      jsonb_build_object('question', 'Kun je verslaafd raken aan wiet?', 'answer', 'Fysiek niet echt, maar psychologische afhankelijkheid is mogelijk bij intensief dagelijks gebruik.'),
      jsonb_build_object('question', 'Zijn er ontwenningsverschijnselen?', 'answer', 'Mild: irritatie, slaapproblemen, minder eetlust. Verdwijnt na 1-2 weken.')
    )
  ),
  'faq',
  true,
  now()
) ON CONFLICT (slug) DO UPDATE SET content = EXCLUDED.content, last_updated = now();

-- =====================================================
-- SECTIE 2: SPECIFIEKE VRAGEN (20 extra pagina's)
-- =====================================================

-- 16. Hoe herken ik goede wiet?
INSERT INTO seo_content_pages (slug, title, h1_title, meta_description, meta_keywords, content, page_type, is_published, last_updated)
VALUES (
  'goede-wiet-herkennen',
  'Hoe Herken Je Goede Wiet? Kwaliteitstekens | Wietforum',
  'Hoe Herken Je Goede Wiet?',
  'Leer kwaliteitswiet herkennen. Geur, uiterlijk, structuur en meer. Waar moet je op letten?',
  ARRAY['goede wiet herkennen', 'wiet kwaliteit', 'kwaliteits wiet', 'wiet beoordelen'],
  jsonb_build_object(
    'sections', jsonb_build_array(
      jsonb_build_object('heading', 'Uiterlijk', 'content', '<p><strong>Goede wiet:</strong></p><ul><li>Veel zichtbare trichomen (kristallen)</li><li>Levendige kleuren (groen, paars, oranje haartjes)</li><li>Dichte, compacte buds</li></ul><p><strong>Slechte wiet:</strong></p><ul><li>Bruin/grijs van kleur</li><li>Veel stengels en zaadjes</li><li>Los en luchtig</li></ul>'),
      jsonb_build_object('heading', 'Geur', 'content', '<p><strong>Goede wiet:</strong> Sterke, complexe geur (fruitig, aards, citrus, etc.)</p><p><strong>Slechte wiet:</strong> Zwakke geur, muf, hooi-achtig</p>'),
      jsonb_build_object('heading', 'Structuur', 'content', '<p><strong>Check:</strong></p><ul><li>Niet te droog (valt niet uit elkaar)</li><li>Niet te nat (plakt niet)</li><li>Springt terug als je er in knijpt</li><li>Geen schimmel of vlekken</li></ul>'),
      jsonb_build_object('heading', 'De Snap Test', 'content', '<p>Buig een steeltje. Het moet <strong>knappen</strong>, niet buigen. Buigen = te vochtig. Verkruimelen = te droog.</p>')
    ),
    'faq', jsonb_build_array(
      jsonb_build_object('question', 'Waaraan herken je topshelf wiet?', 'answer', 'Veel zichtbare kristallen, sterke complexe geur, levendige kleuren, en dichte compacte buds.'),
      jsonb_build_object('question', 'Is droge wiet slecht?', 'answer', 'Het kan nog prima zijn, maar terpenen zijn mogelijk vervaagd. Smaak en geur lijden eronder.')
    )
  ),
  'faq',
  true,
  now()
) ON CONFLICT (slug) DO UPDATE SET content = EXCLUDED.content, last_updated = now();

-- 17. Hoeveel water geven wietplant?
INSERT INTO seo_content_pages (slug, title, h1_title, meta_description, meta_keywords, content, page_type, is_published, last_updated)
VALUES (
  'hoeveel-water-wietplant',
  'Hoeveel Water Geven aan Wietplant? | Wietforum',
  'Water Geven aan Cannabis: Hoeveel en Wanneer',
  'Hoe vaak en hoeveel water geven aan je wietplant? Signalen van over- en onderbevochtiging.',
  ARRAY['water geven wietplant', 'cannabis water', 'hoeveel water', 'overwatering'],
  jsonb_build_object(
    'sections', jsonb_build_array(
      jsonb_build_object('heading', 'De Vinger Test', 'content', '<p>Steek je vinger 3-5 cm in de grond. <strong>Droog?</strong> Water geven. <strong>Vochtig?</strong> Wachten.</p><p>Eenvoudigste en meest betrouwbare methode.</p>'),
      jsonb_build_object('heading', 'Hoeveel Water?', 'content', '<p>Water tot er 10-20% uit de onderkant loopt (runoff). Dit zorgt ervoor dat:</p><ul><li>Hele rootzone vochtig is</li><li>Zout ophoping wegspoelt</li></ul><p><strong>Vuistregel:</strong> Kleine pot = vaker, minder. Grote pot = minder vaak, meer.</p>'),
      jsonb_build_object('heading', 'Overwatering Tekens', 'content', '<ul><li>Bladeren hangen slap maar zien er "gezwollen" uit</li><li>Groei vertraagt</li><li>Wortelrot risico</li></ul>'),
      jsonb_build_object('heading', 'Onderwatering Tekens', 'content', '<ul><li>Bladeren hangen droog en slap</li><li>Bladranden rollen naar binnen</li><li>Grond trekt weg van potrand</li></ul>')
    ),
    'faq', jsonb_build_array(
      jsonb_build_object('question', 'Hoe vaak water geven?', 'answer', 'Wanneer de top 5cm van de grond droog is. Meestal elke 2-4 dagen, afhankelijk van pot en plant grootte.'),
      jsonb_build_object('question', 'Is leidingwater goed?', 'answer', 'Meestal wel, maar laat het 24 uur staan zodat chloor verdampt. Check pH (6.0-7.0 voor aarde).')
    )
  ),
  'faq',
  true,
  now()
) ON CONFLICT (slug) DO UPDATE SET content = EXCLUDED.content, last_updated = now();

-- 18. Mannelijke vs vrouwelijke plant
INSERT INTO seo_content_pages (slug, title, h1_title, meta_description, meta_keywords, content, page_type, is_published, last_updated)
VALUES (
  'mannelijke-vrouwelijke-wietplant',
  'Mannelijke vs Vrouwelijke Wietplant Herkennen | Wietforum',
  'Mannelijke vs Vrouwelijke Cannabis Plant',
  'Hoe herken je een mannelijke of vrouwelijke wietplant? Waarom vrouwelijk gewenst is en wanneer verwijderen.',
  ARRAY['mannelijke wietplant', 'vrouwelijke plant', 'geslacht cannabis', 'mannelijk herkennen'],
  jsonb_build_object(
    'sections', jsonb_build_array(
      jsonb_build_object('heading', 'Waarom Belangrijk?', 'content', '<p><strong>Alleen vrouwelijke planten</strong> produceren de buds die je wilt roken. Mannelijke planten produceren pollen en bestuiven de vrouwtjes, wat leidt tot zaadvorming in plaats van buds.</p>'),
      jsonb_build_object('heading', 'Wanneer Zichtbaar?', 'content', '<p>Geslacht wordt zichtbaar in de <strong>pre-bloei fase</strong>, meestal 4-6 weken na kiemen, bij de nodes (waar stengel en bladsteel samenkomen).</p>'),
      jsonb_build_object('heading', 'Vrouwelijk Herkennen', 'content', '<p><strong>Vrouwelijke preflowers:</strong></p><ul><li>Kleine druppel-/peervormige kelk</li><li>Met witte haartjes (pistils) die eruit komen</li><li>Worden later de buds</li></ul>'),
      jsonb_build_object('heading', 'Mannelijk Herkennen', 'content', '<p><strong>Mannelijke preflowers:</strong></p><ul><li>Kleine bolletjes aan steeltje (lijken op druiven)</li><li>Geen haartjes</li><li>Groeien in clusters</li></ul><p><strong>Verwijder mannelijke planten SNEL</strong> voordat ze opengaan!</p>'),
      jsonb_build_object('heading', 'Oplossing: Feminised Zaden', 'content', '<p>Met feminised zaden zijn 99%+ van je planten vrouwelijk. Dit elimineert het probleem.</p>')
    ),
    'faq', jsonb_build_array(
      jsonb_build_object('question', 'Hoe herken ik een mannelijke plant?', 'answer', 'Kleine bolletjes aan steeltjes bij de nodes, geen witte haartjes. Verwijder deze snel!'),
      jsonb_build_object('question', 'Kan een vrouwelijke plant mannelijk worden?', 'answer', 'Bij extreme stress kan ze hermafrodiet worden en zowel mannelijke als vrouwelijke bloemen krijgen.')
    )
  ),
  'faq',
  true,
  now()
) ON CONFLICT (slug) DO UPDATE SET content = EXCLUDED.content, last_updated = now();

-- 19. Wiet minder sterk maken
INSERT INTO seo_content_pages (slug, title, h1_title, meta_description, meta_keywords, content, page_type, is_published, last_updated)
VALUES (
  'high-minder-sterk-maken',
  'Hoe Maak Je een High Minder Sterk? | Wietforum',
  'Hoe Wordt Je High Minder Intens?',
  'Te high? Tips om het effect te verminderen. CBD, zwarte peper, afleiden en meer trucs.',
  ARRAY['high minder sterk', 'te high', 'high stoppen', 'wiet effect verminderen'],
  jsonb_build_object(
    'sections', jsonb_build_array(
      jsonb_build_object('heading', 'CBD Nemen', 'content', '<p><strong>CBD kan het effect van THC verzachten.</strong> Het concurreert om dezelfde receptoren. Neem CBD olie of bloemen als je te high bent.</p>'),
      jsonb_build_object('heading', 'Zwarte Peper', 'content', '<p>Klinkt gek, maar <strong>kauw op zwarte peperkorrels</strong> of ruik eraan. Het terpeen caryophylleen kan angst en paranoia verminderen.</p>'),
      jsonb_build_object('heading', 'Eten en Drinken', 'content', '<ul><li>Drink water (hydratatie)</li><li>Eet iets substantieels</li><li>Suikers kunnen helpen</li></ul>'),
      jsonb_build_object('heading', 'Afleiding', 'content', '<ul><li>Naar buiten, frisse lucht</li><li>Douchen (koud of warm)</li><li>Rustige muziek</li><li>Met iemand praten</li><li>Simpel spelletje of serie</li></ul>'),
      jsonb_build_object('heading', 'Slaap', 'content', '<p>De beste remedie. Als je kunt slapen, is de high voorbij als je wakker wordt.</p>')
    ),
    'faq', jsonb_build_array(
      jsonb_build_object('question', 'Hoe word ik sneller nuchter van wiet?', 'answer', 'CBD, zwarte peper, water, eten, afleiding en slaap. Er is geen instant oplossing.'),
      jsonb_build_object('question', 'Hoe lang duurt een high?', 'answer', 'Roken: 1-3 uur. Edibles: 4-8 uur. Verdampen: 1-2 uur.')
    )
  ),
  'faq',
  true,
  now()
) ON CONFLICT (slug) DO UPDATE SET content = EXCLUDED.content, last_updated = now();

-- 20. Wiet in koffer vliegtuig
INSERT INTO seo_content_pages (slug, title, h1_title, meta_description, meta_keywords, content, page_type, is_published, last_updated)
VALUES (
  'wiet-vliegtuig-koffer',
  'Wiet Meenemen in Vliegtuig? Risico''s | Wietforum',
  'Wiet Meenemen in het Vliegtuig',
  'Kun je wiet meenemen in het vliegtuig? Risico''s, straffen en waarom je het niet moet doen.',
  ARRAY['wiet vliegtuig', 'wiet koffer', 'drugssmokkel vliegtuig', 'wiet meenemen reis'],
  jsonb_build_object(
    'sections', jsonb_build_array(
      jsonb_build_object('heading', 'Het Korte Antwoord', 'content', '<p><strong>DOE HET NIET.</strong></p><p>Wiet meenemen in een vliegtuig is internationaal drugssmokkel, zelfs als je naar een land gaat waar het legaal is.</p>'),
      jsonb_build_object('heading', 'Risico''s', 'content', '<ul><li><strong>Vliegveldbeveiliging:</strong> Scanners detecteren drugs</li><li><strong>Drugsshonden:</strong> Vaak aanwezig op luchthavens</li><li><strong>Straffen:</strong> Celstraffen, hoge boetes</li><li><strong>Crimineel record:</strong> Blijvend in systemen</li><li><strong>Reisverbod:</strong> Sommige landen weigeren toegang</li></ul>'),
      jsonb_build_object('heading', 'Zelfs binnen Schengen', 'content', '<p>Zelfs op EU-vluchten kunnen er controles zijn. Het is en blijft illegaal om drugs over grenzen te transporteren.</p>'),
      jsonb_build_object('heading', 'Alternatief', 'content', '<p>Koop ter plaatse als het legaal is (coffeeshop, dispensary), of neem een tolerantiepauze tijdens je reis.</p>')
    ),
    'faq', jsonb_build_array(
      jsonb_build_object('question', 'Kan ik wiet meenemen in het vliegtuig?', 'answer', 'Technisch kun je het proberen, maar het is illegaal en zeer risicovol. Niet doen.'),
      jsonb_build_object('question', 'Wat als ik betrapt word?', 'answer', 'Afhankelijk van land: boetes, celstraf, strafblad. In sommige landen zeer zware straffen.')
    )
  ),
  'faq',
  true,
  now()
) ON CONFLICT (slug) DO UPDATE SET content = EXCLUDED.content, last_updated = now();

-- =====================================================
-- COMPLETION
-- =====================================================

DO $$
BEGIN
  RAISE NOTICE 'TIER 3 Long-tail vraag paginas succesvol aangemaakt';
  RAISE NOTICE 'Totaal: 20 paginas';
END $$;

