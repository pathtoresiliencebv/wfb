-- =====================================================
-- TIER 2: ZADEN & STRAINS SEO PAGINA'S
-- 16 keywords over cannabis zaden en variëteiten
-- =====================================================

-- 1. Cannabis Zaden Kopen België
INSERT INTO seo_content_pages (slug, title, h1_title, meta_description, meta_keywords, content, page_type, is_published, last_updated)
VALUES (
  'cannabis-zaden-kopen-belgie',
  'Cannabis Zaden Kopen in België: Legale Opties | Wietforum',
  'Cannabis Zaden Kopen in België',
  'Waar kun je legaal cannabis zaden kopen in België? Overzicht van betrouwbare zaadbanken en webshops.',
  ARRAY['cannabis zaden kopen belgie', 'wiet zaden kopen', 'zaden bestellen', 'zaadbank belgie'],
  jsonb_build_object(
    'sections', jsonb_build_array(
      jsonb_build_object('heading', 'Zijn Cannabis Zaden Legaal?', 'content', '<p><strong>Ja, cannabis zaden zijn legaal</strong> om te kopen en bezitten in België. Zaden bevatten geen THC en vallen daarom niet onder de drugswetgeving.</p><p>Het is alleen illegaal om de zaden te <strong>ontkiemen met de intentie tot kweek</strong>.</p>'),
      jsonb_build_object('heading', 'Waar Kopen?', 'content', '<p><strong>Online Zaadbanken:</strong></p><ul><li>Royal Queen Seeds (NL)</li><li>Dutch Passion (NL)</li><li>Sensi Seeds (NL)</li><li>Zamnesia (NL)</li></ul><p><strong>Fysieke Shops:</strong></p><ul><li>Headshops in België (bijv. Antwerpen, Gent)</li><li>Smart shops</li></ul>'),
      jsonb_build_object('heading', 'Tips bij Bestellen', 'content', '<ul><li>Bestel bij gerenommeerde zaadbanken</li><li>Check reviews van andere kwekers</li><li>Let op verzendkosten en levertijd</li><li>Bewaar zaden koel en droog</li></ul>'),
      jsonb_build_object('heading', 'Soorten Zaden', 'content', '<p><strong>Reguliere zaden:</strong> Kunnen mannelijk of vrouwelijk zijn</p><p><strong>Feminised zaden:</strong> Alleen vrouwelijke planten (99%+)</p><p><strong>Autoflower zaden:</strong> Bloeien automatisch, ideaal voor beginners</p>')
    ),
    'faq', jsonb_build_array(
      jsonb_build_object('question', 'Is het legaal om cannabis zaden te kopen?', 'answer', 'Ja, zaden kopen en bezitten is legaal in België. Ze bevatten geen THC.'),
      jsonb_build_object('question', 'Waar kan ik het beste zaden bestellen?', 'answer', 'Nederlandse zaadbanken zoals Royal Queen Seeds en Dutch Passion leveren betrouwbaar in België.')
    )
  ),
  'pillar',
  true,
  now()
) ON CONFLICT (slug) DO UPDATE SET content = EXCLUDED.content, last_updated = now();

-- 2. Wiet Zaden Bestellen
INSERT INTO seo_content_pages (slug, title, h1_title, meta_description, meta_keywords, content, page_type, is_published, last_updated)
VALUES (
  'wiet-zaden-bestellen',
  'Wiet Zaden Bestellen: Betrouwbare Shops | Wietforum',
  'Wiet Zaden Online Bestellen',
  'Betrouwbaar wiet zaden bestellen. Tips voor veilig online bestellen. Reviews van zaadbanken.',
  ARRAY['wiet zaden bestellen', 'zaden online', 'zaadbank bestellen', 'wiet zaden kopen'],
  jsonb_build_object(
    'sections', jsonb_build_array(
      jsonb_build_object('heading', 'Online Bestellen', 'content', '<p>Het bestellen van wiet zaden online is eenvoudig en legaal:</p><ol><li>Kies een betrouwbare zaadbank</li><li>Selecteer je strain(s)</li><li>Kies feminised of autoflower</li><li>Plaats bestelling en betaal</li><li>Wacht op discrete verzending</li></ol>'),
      jsonb_build_object('heading', 'Betrouwbare Zaadbanken', 'content', '<p><strong>Top Nederlandse zaadbanken:</strong></p><ul><li><strong>Royal Queen Seeds</strong> - Groot assortiment, goede kwaliteit</li><li><strong>Dutch Passion</strong> - Pionier, veel klassiekers</li><li><strong>Barney''s Farm</strong> - Award-winning strains</li><li><strong>Sensi Seeds</strong> - Originele genetica</li></ul>'),
      jsonb_build_object('heading', 'Betaalmethodes', 'content', '<p>De meeste zaadbanken accepteren:</p><ul><li>iDEAL</li><li>Creditcard</li><li>Bitcoin/Crypto</li><li>Bankoverschrijving</li></ul>'),
      jsonb_build_object('heading', 'Verzending', 'content', '<p>Verzending is meestal <strong>discreet</strong>:</p><ul><li>Neutrale verpakking</li><li>Geen vermelding van inhoud</li><li>Levertijd: 1-5 werkdagen</li></ul>')
    ),
    'faq', jsonb_build_array(
      jsonb_build_object('question', 'Is online bestellen veilig?', 'answer', 'Ja, bij gerenommeerde zaadbanken is online bestellen veilig en discreet.')
    )
  ),
  'article',
  true,
  now()
) ON CONFLICT (slug) DO UPDATE SET content = EXCLUDED.content, last_updated = now();

-- 3. Beste Cannabis Strains
INSERT INTO seo_content_pages (slug, title, h1_title, meta_description, meta_keywords, content, page_type, is_published, last_updated)
VALUES (
  'beste-cannabis-strains',
  'Beste Cannabis Strains 2025: Top 20 Review | Wietforum',
  'De Beste Cannabis Strains van 2025',
  'Overzicht van de beste cannabis strains. Van relaxte indica tot energieke sativa. Reviews en effecten.',
  ARRAY['beste cannabis strains', 'top strains', 'beste wiet soorten', 'populaire strains'],
  jsonb_build_object(
    'sections', jsonb_build_array(
      jsonb_build_object('heading', 'Top 5 Indica Strains', 'content', '<ol><li><strong>Northern Lights</strong> - Klassieker, diepe relaxatie</li><li><strong>Granddaddy Purple</strong> - Zoet, slaperig</li><li><strong>Afghan Kush</strong> - Pure indica, zeer relaxend</li><li><strong>Bubba Kush</strong> - Aardse smaak, zware stone</li><li><strong>Purple Punch</strong> - Zoet en fruitig, ontspannend</li></ol>'),
      jsonb_build_object('heading', 'Top 5 Sativa Strains', 'content', '<ol><li><strong>Sour Diesel</strong> - Energiek, creatief</li><li><strong>Jack Herer</strong> - Uplifting, helder</li><li><strong>Green Crack</strong> - Extreme energie</li><li><strong>Durban Poison</strong> - Pure sativa, focus</li><li><strong>Super Lemon Haze</strong> - Citrus, vrolijk</li></ol>'),
      jsonb_build_object('heading', 'Top 5 Hybrids', 'content', '<ol><li><strong>Girl Scout Cookies</strong> - Zoet, krachtig</li><li><strong>OG Kush</strong> - Iconische hybrid</li><li><strong>Blue Dream</strong> - Gebalanceerd, populair</li><li><strong>Gelato</strong> - Dessert-achtig, krachtig</li><li><strong>Wedding Cake</strong> - Rijk, ontspannend</li></ol>'),
      jsonb_build_object('heading', 'Top 5 Autoflowers', 'content', '<ol><li><strong>Northern Lights Auto</strong> - Makkelijk, betrouwbaar</li><li><strong>Gorilla Glue Auto</strong> - Krachtig, productief</li><li><strong>Wedding Cake Auto</strong> - Hoge THC</li><li><strong>Girl Scout Cookies Auto</strong> - Populair</li><li><strong>Zkittlez Auto</strong> - Fruitig, zoet</li></ol>')
    ),
    'faq', jsonb_build_array(
      jsonb_build_object('question', 'Wat is de sterkste strain?', 'answer', 'Strains als Gorilla Glue, Girl Scout Cookies en Wedding Cake kunnen 25-30% THC bevatten.'),
      jsonb_build_object('question', 'Welke strain voor beginners?', 'answer', 'Northern Lights - Makkelijk te kweken, vergevingsgezind, goede resultaten.')
    )
  ),
  'pillar',
  true,
  now()
) ON CONFLICT (slug) DO UPDATE SET content = EXCLUDED.content, last_updated = now();

-- 4. Autoflower Zaden
INSERT INTO seo_content_pages (slug, title, h1_title, meta_description, meta_keywords, content, page_type, is_published, last_updated)
VALUES (
  'autoflower-zaden',
  'Autoflower Zaden: Alles Wat Je Moet Weten | Wietforum',
  'Autoflower Cannabis Zaden Uitgelegd',
  'Complete gids over autoflower zaden. Wat zijn ze, voordelen, beste strains en kweektips.',
  ARRAY['autoflower zaden', 'auto zaden', 'autoflowering', 'automatische bloei'],
  jsonb_build_object(
    'sections', jsonb_build_array(
      jsonb_build_object('heading', 'Wat Zijn Autoflowers?', 'content', '<p>Autoflowers zijn cannabisplanten die <strong>automatisch gaan bloeien</strong> na 3-4 weken, ongeacht de lichtcyclus. Dit komt door genetica van Cannabis Ruderalis.</p><p>Je hoeft niet te switchen naar 12/12 - de plant doet het zelf!</p>'),
      jsonb_build_object('heading', 'Voordelen van Autoflowers', 'content', '<ul><li><strong>Snel klaar</strong> - 8-12 weken van zaad tot oogst</li><li><strong>Compact</strong> - Blijven klein, ideaal voor kleine ruimtes</li><li><strong>Makkelijk</strong> - Geen lichtschema wijzigen</li><li><strong>Meerdere oogsten</strong> - Meer rondes per jaar mogelijk</li><li><strong>Ideaal voor beginners</strong></li></ul>'),
      jsonb_build_object('heading', 'Nadelen', 'content', '<ul><li>Lagere opbrengst dan photoperiod</li><li>Kan niet gekloond worden</li><li>Minder tijd om fouten te herstellen</li><li>Training moet voorzichtig</li></ul>'),
      jsonb_build_object('heading', 'Beste Autoflower Strains', 'content', '<ol><li><strong>Northern Lights Auto</strong> - Betrouwbaar, makkelijk</li><li><strong>Gorilla Glue Auto</strong> - Krachtig, grote opbrengst</li><li><strong>Critical Auto</strong> - Snelle, commerciële strain</li><li><strong>Auto Ultimate</strong> - Maximale yield voor auto</li><li><strong>Quick One</strong> - Extra snelle afwerking</li></ol>')
    ),
    'faq', jsonb_build_array(
      jsonb_build_object('question', 'Hoeveel gram van een autoflower?', 'answer', 'Gemiddeld 30-100 gram per plant, afhankelijk van strain en omstandigheden.'),
      jsonb_build_object('question', 'Welk lichtschema voor autoflowers?', 'answer', '18-20 uur licht per dag gedurende de hele cyclus geeft de beste resultaten.')
    )
  ),
  'pillar',
  true,
  now()
) ON CONFLICT (slug) DO UPDATE SET content = EXCLUDED.content, last_updated = now();

-- 5. Feminised Zaden
INSERT INTO seo_content_pages (slug, title, h1_title, meta_description, meta_keywords, content, page_type, is_published, last_updated)
VALUES (
  'feminised-zaden',
  'Feminised Zaden: Alleen Vrouwelijke Planten | Wietforum',
  'Feminised Cannabis Zaden',
  'Wat zijn feminised zaden? Voordelen, hoe ze gemaakt worden en de beste feminised strains.',
  ARRAY['feminised zaden', 'gefeminiseerde zaden', 'vrouwelijke zaden', 'female seeds'],
  jsonb_build_object(
    'sections', jsonb_build_array(
      jsonb_build_object('heading', 'Wat Zijn Feminised Zaden?', 'content', '<p>Feminised zaden produceren voor <strong>99%+ vrouwelijke planten</strong>. Alleen vrouwelijke planten produceren de bloemen (buds) die je wilt oogsten.</p><p>Mannelijke planten bestuiven vrouwtjes, wat zaadvorming veroorzaakt - dat wil je niet!</p>'),
      jsonb_build_object('heading', 'Voordelen', 'content', '<ul><li><strong>Geen mannelijke planten</strong> - Geen verspilde ruimte en tijd</li><li><strong>Efficiënt</strong> - Alle planten produceren buds</li><li><strong>Ideaal voor kleine kweek</strong> - Elke plant telt</li><li><strong>Geen risico op bestuiving</strong></li></ul>'),
      jsonb_build_object('heading', 'Feminised vs Regulier', 'content', '<p><strong>Feminised:</strong> 99%+ vrouwelijk, duurder, geen breeding mogelijk</p><p><strong>Regulier:</strong> 50/50 kans, goedkoper, kun je mee kweken/fokken</p><p>Voor de meeste hobbyisten zijn feminised zaden de beste keuze.</p>'),
      jsonb_build_object('heading', 'Top Feminised Strains', 'content', '<ol><li>Girl Scout Cookies</li><li>Gorilla Glue</li><li>Wedding Cake</li><li>Northern Lights</li><li>Blue Dream</li></ol>')
    ),
    'faq', jsonb_build_array(
      jsonb_build_object('question', 'Kunnen feminised zaden mannelijk worden?', 'answer', 'In extreme stress kunnen ze hermafrodiet worden, maar bij normale omstandigheden zijn ze 99%+ vrouwelijk.')
    )
  ),
  'article',
  true,
  now()
) ON CONFLICT (slug) DO UPDATE SET content = EXCLUDED.content, last_updated = now();

-- 6. Indica vs Sativa
INSERT INTO seo_content_pages (slug, title, h1_title, meta_description, meta_keywords, content, page_type, is_published, last_updated)
VALUES (
  'indica-vs-sativa',
  'Indica vs Sativa: Wat Is Het Verschil? | Wietforum',
  'Indica vs Sativa: Het Complete Verschil',
  'Wat is het verschil tussen indica en sativa? Effecten, groei en welke past bij jou.',
  ARRAY['indica vs sativa', 'verschil indica sativa', 'indica of sativa', 'cannabis soorten'],
  jsonb_build_object(
    'sections', jsonb_build_array(
      jsonb_build_object('heading', 'Het Basisverschil', 'content', '<p><strong>Indica:</strong> Fysiek ontspannend, "body high", goed voor avondgebruik</p><p><strong>Sativa:</strong> Mentaal stimulerend, "head high", goed voor daggebruik</p><p><strong>Hybrid:</strong> Combinatie van beide, de meeste moderne strains</p>'),
      jsonb_build_object('heading', 'Indica Eigenschappen', 'content', '<p><strong>Effecten:</strong></p><ul><li>Lichamelijke ontspanning</li><li>Slaperigheid</li><li>Pijnverlichting</li><li>"Couch-lock"</li></ul><p><strong>Plant:</strong></p><ul><li>Kort en compact</li><li>Brede bladeren</li><li>Snellere bloei (7-9 weken)</li></ul>'),
      jsonb_build_object('heading', 'Sativa Eigenschappen', 'content', '<p><strong>Effecten:</strong></p><ul><li>Energie en creativiteit</li><li>Euforie</li><li>Focus</li><li>Sociaal</li></ul><p><strong>Plant:</strong></p><ul><li>Hoog en rank</li><li>Smalle bladeren</li><li>Langere bloei (10-14 weken)</li></ul>'),
      jsonb_build_object('heading', 'Welke Kiezen?', 'content', '<p><strong>Kies Indica als je:</strong></p><ul><li>Wilt ontspannen</li><li>Slaapproblemen hebt</li><li>Pijn wilt verlichten</li></ul><p><strong>Kies Sativa als je:</strong></p><ul><li>Productief wilt blijven</li><li>Creatief bezig bent</li><li>Sociale activiteiten plant</li></ul>')
    ),
    'faq', jsonb_build_array(
      jsonb_build_object('question', 'Is indica sterker dan sativa?', 'answer', 'Niet per se. De THC-inhoud bepaalt sterkte, niet het type. Er zijn sterke indica''s en sterke sativa''s.'),
      jsonb_build_object('question', 'Wat is een hybrid?', 'answer', 'Een kruising tussen indica en sativa. De meeste moderne strains zijn hybrids met kenmerken van beide.')
    )
  ),
  'pillar',
  true,
  now()
) ON CONFLICT (slug) DO UPDATE SET content = EXCLUDED.content, last_updated = now();

-- 7. Sterkste Wiet Strains
INSERT INTO seo_content_pages (slug, title, h1_title, meta_description, meta_keywords, content, page_type, is_published, last_updated)
VALUES (
  'sterkste-wiet-strains',
  'Sterkste Wiet Strains: Hoogste THC | Wietforum',
  'De Sterkste Wiet Strains',
  'Overzicht van de sterkste cannabis strains met de hoogste THC percentages. 25-30%+ THC.',
  ARRAY['sterkste wiet', 'hoogste thc', 'krachtige strains', 'sterke wiet'],
  jsonb_build_object(
    'sections', jsonb_build_array(
      jsonb_build_object('heading', 'Sterkste Strains 2025', 'content', '<ol><li><strong>Godfather OG</strong> - Tot 34% THC</li><li><strong>Gorilla Glue #4</strong> - 25-30% THC</li><li><strong>Girl Scout Cookies</strong> - 25-28% THC</li><li><strong>Bruce Banner</strong> - 25-29% THC</li><li><strong>Wedding Cake</strong> - 25-27% THC</li></ol>'),
      jsonb_build_object('heading', 'Waarschuwing', 'content', '<p><strong>Let op bij hoge THC:</strong></p><ul><li>Start met kleine hoeveelheden</li><li>Niet geschikt voor beginners</li><li>Kan angst/paranoia veroorzaken</li><li>Tolerantie bouwt snel op</li></ul>'),
      jsonb_build_object('heading', 'THC vs Effect', 'content', '<p>Meer THC betekent niet altijd beter. Het <strong>entourage effect</strong> van terpenen en andere cannabinoïden bepaalt mede de ervaring. Een strain met 20% THC kan subjectief sterker aanvoelen dan een met 25%.</p>')
    ),
    'faq', jsonb_build_array(
      jsonb_build_object('question', 'Wat is de sterkste wiet ter wereld?', 'answer', 'Strains als Godfather OG en Strawberry Banana kunnen tot 34% THC bevatten.'),
      jsonb_build_object('question', 'Is sterke wiet gevaarlijk?', 'answer', 'Niet direct gevaarlijk, maar kan ongewenste effecten veroorzaken bij onervaren gebruikers.')
    )
  ),
  'article',
  true,
  now()
) ON CONFLICT (slug) DO UPDATE SET content = EXCLUDED.content, last_updated = now();

-- 8. Snelst Bloeiende Strains
INSERT INTO seo_content_pages (slug, title, h1_title, meta_description, meta_keywords, content, page_type, is_published, last_updated)
VALUES (
  'snelst-bloeiende-strains',
  'Snelst Bloeiende Strains: Snelle Oogst | Wietforum',
  'De Snelst Bloeiende Cannabis Strains',
  'Strains met korte bloeitijd voor snelle oogst. Ideaal voor buitenkweek en ongedulige kwekers.',
  ARRAY['snelste bloei', 'snelle strains', 'korte bloeitijd', 'snel oogsten'],
  jsonb_build_object(
    'sections', jsonb_build_array(
      jsonb_build_object('heading', 'Snelste Photoperiod Strains', 'content', '<ol><li><strong>Quick Critical+</strong> - 6 weken bloei</li><li><strong>Early Skunk</strong> - 7 weken bloei</li><li><strong>Northern Lights</strong> - 7-8 weken bloei</li><li><strong>Critical</strong> - 7 weken bloei</li><li><strong>Royal Critical</strong> - 7 weken bloei</li></ol>'),
      jsonb_build_object('heading', 'Snelste Autoflowers', 'content', '<ol><li><strong>Quick One</strong> - 8 weken totaal</li><li><strong>Royal Dwarf</strong> - 8-9 weken totaal</li><li><strong>Fast Buds Fastberry</strong> - 8 weken totaal</li><li><strong>Speed+ Auto</strong> - 8 weken totaal</li></ol>'),
      jsonb_build_object('heading', 'Waarom Snelle Strains?', 'content', '<ul><li>Ideaal voor kort buitenseizoen</li><li>Meer oogsten per jaar indoor</li><li>Minder risico op schimmel (kortere bloei)</li><li>Sneller resultaat zien</li></ul>')
    ),
    'faq', jsonb_build_array(
      jsonb_build_object('question', 'Wat is de snelste strain?', 'answer', 'Autoflowers als Quick One zijn in 8 weken klaar van zaad tot oogst.')
    )
  ),
  'article',
  true,
  now()
) ON CONFLICT (slug) DO UPDATE SET content = EXCLUDED.content, last_updated = now();

-- 9. Schimmelresistente Strains
INSERT INTO seo_content_pages (slug, title, h1_title, meta_description, meta_keywords, content, page_type, is_published, last_updated)
VALUES (
  'schimmelresistente-strains',
  'Schimmelresistente Strains voor België | Wietforum',
  'Schimmelresistente Cannabis Strains',
  'De beste schimmelresistente cannabis strains voor het vochtige Belgische klimaat. Ideaal voor buitenkweek.',
  ARRAY['schimmelresistent', 'schimmel resistent', 'mold resistant', 'buiten strains belgie'],
  jsonb_build_object(
    'sections', jsonb_build_array(
      jsonb_build_object('heading', 'Waarom Belangrijk?', 'content', '<p>Het Belgische klimaat is <strong>vochtig</strong>. Vooral in september/oktober bij de oogst kan schimmel (botrytis, meeldauw) toeslaan. Schimmelresistente strains kunnen dit weerstaan.</p>'),
      jsonb_build_object('heading', 'Top 10 Schimmelresistente Strains', 'content', '<ol><li><strong>Frisian Dew</strong> - Onze #1 aanbeveling</li><li><strong>Northern Lights</strong> - Betrouwbare klassieker</li><li><strong>Early Skunk</strong> - Speciaal voor noord-Europa</li><li><strong>Holland''s Hope</strong> - Nederlandse buitenspecialist</li><li><strong>Durban Poison</strong> - Pure sativa, sterk</li><li><strong>Super Silver Haze</strong> - Ondanks sativa, goed bestand</li><li><strong>Power Plant</strong> - Zuid-Afrikaanse genetica</li><li><strong>Passion #1</strong> - Outdoor klassieker</li><li><strong>Critical Mass CBD</strong> - CBD variant, schimmelresistent</li><li><strong>Auto Mazar</strong> - Snelle autoflower variant</li></ol>'),
      jsonb_build_object('heading', 'Extra Tips Tegen Schimmel', 'content', '<ul><li>Kies luchtie groeiplaats met goede circulatie</li><li>Verwijder grote bladeren die vocht vasthouden</li><li>Check dagelijks in september</li><li>Oogst niet te laat</li><li>Bij regen: schud plant voorzichtig</li></ul>')
    ),
    'faq', jsonb_build_array(
      jsonb_build_object('question', 'Welke strain is het beste tegen schimmel?', 'answer', 'Frisian Dew is specifiek gekweekt voor het Nederlands/Belgische klimaat en zeer schimmelresistent.'),
      jsonb_build_object('question', 'Hoe herken ik schimmel?', 'answer', 'Grijze/bruine vlekken, wit poeder op bladeren, of buds die bruin en papperig worden.')
    )
  ),
  'article',
  true,
  now()
) ON CONFLICT (slug) DO UPDATE SET content = EXCLUDED.content, last_updated = now();

-- 10. Medische Cannabis Strains
INSERT INTO seo_content_pages (slug, title, h1_title, meta_description, meta_keywords, content, page_type, is_published, last_updated)
VALUES (
  'medische-cannabis-strains',
  'Medische Cannabis Strains: Overzicht | Wietforum',
  'Medische Cannabis Strains',
  'Strains voor medisch gebruik. CBD-rijk, pijnverlichting, slaap en meer. Overzicht en effecten.',
  ARRAY['medische cannabis strains', 'medicinale wiet', 'cbd strains', 'medische wiet'],
  jsonb_build_object(
    'sections', jsonb_build_array(
      jsonb_build_object('heading', 'Strains voor Pijnverlichting', 'content', '<ul><li><strong>ACDC</strong> - Hoog CBD, laag THC</li><li><strong>Harlequin</strong> - Gebalanceerd CBD:THC</li><li><strong>Afghan Kush</strong> - Sterke indica voor zware pijn</li><li><strong>White Widow</strong> - Effectief tegen chronische pijn</li></ul>'),
      jsonb_build_object('heading', 'Strains voor Slaap', 'content', '<ul><li><strong>Northern Lights</strong> - Klassieke slaapinduceerder</li><li><strong>Granddaddy Purple</strong> - Diep ontspannend</li><li><strong>Bubba Kush</strong> - Zware indica</li><li><strong>Purple Kush</strong> - Slaperig en kalm</li></ul>'),
      jsonb_build_object('heading', 'Strains voor Angst/Stress', 'content', '<ul><li><strong>CBD Critical Mass</strong> - Hoog CBD, kalmerend</li><li><strong>Cannatonic</strong> - Mild, ontspannend</li><li><strong>Remedy</strong> - Bijna geen THC</li></ul>'),
      jsonb_build_object('heading', 'CBD vs THC Ratio''s', 'content', '<p><strong>Hoog CBD, laag THC:</strong> Medicinaal zonder high (ACDC, Charlotte''s Web)</p><p><strong>1:1 CBD:THC:</strong> Gebalanceerd effect (Harlequin, Pennywise)</p><p><strong>Hoog THC:</strong> Sterke pijnverlichting maar wel high</p>')
    ),
    'faq', jsonb_build_array(
      jsonb_build_object('question', 'Welke strain is het beste voor pijn?', 'answer', 'ACDC en Harlequin bieden pijnverlichting zonder sterke high. Voor zware pijn werken sterke indica''s als Afghan Kush.')
    )
  ),
  'article',
  true,
  now()
) ON CONFLICT (slug) DO UPDATE SET content = EXCLUDED.content, last_updated = now();

-- 11. Cannabis Genetica
INSERT INTO seo_content_pages (slug, title, h1_title, meta_description, meta_keywords, content, page_type, is_published, last_updated)
VALUES (
  'cannabis-genetica',
  'Cannabis Genetica Uitgelegd | Wietforum',
  'Cannabis Genetica Begrijpen',
  'Alles over cannabis genetica. Landraces, hybrids, fenotypes en hoe nieuwe strains ontstaan.',
  ARRAY['cannabis genetica', 'wiet genetica', 'landraces', 'cannabis breeding'],
  jsonb_build_object(
    'sections', jsonb_build_array(
      jsonb_build_object('heading', 'Wat Is Cannabis Genetica?', 'content', '<p>Cannabis genetica bepaalt alle eigenschappen van een plant: groeipatroon, effect, smaak, THC/CBD gehalte, etc. Net als bij mensen wordt genetica overgedragen van ouders naar nakomelingen.</p>'),
      jsonb_build_object('heading', 'Landraces', 'content', '<p><strong>Landraces</strong> zijn originele, pure variëteiten uit specifieke regio''s:</p><ul><li><strong>Afghan</strong> - Puur indica, bergen</li><li><strong>Thai</strong> - Puur sativa, tropisch</li><li><strong>Durban</strong> - Zuid-Afrika, sativa</li><li><strong>Hindu Kush</strong> - Pakistan/Afghanistan</li></ul><p>Moderne strains zijn kruisingen van deze landraces.</p>'),
      jsonb_build_object('heading', 'Hybrids & Breeding', 'content', '<p>Door <strong>verschillende strains te kruisen</strong> ontstaan hybrids met gecombineerde eigenschappen. Breeders selecteren de beste planten en stabiliseren de genetica over meerdere generaties.</p>'),
      jsonb_build_object('heading', 'Fenotype vs Genotype', 'content', '<p><strong>Genotype:</strong> De genetische code (wat de plant KAN zijn)</p><p><strong>Fenotype:</strong> De fysieke expressie (wat de plant IS)</p><p>Zaden van dezelfde strain kunnen verschillende fenotypes geven.</p>')
    ),
    'faq', jsonb_build_array(
      jsonb_build_object('question', 'Wat is een landrace?', 'answer', 'Een pure cannabis variëteit die van nature groeit in een specifieke regio, niet gekruist met andere strains.')
    )
  ),
  'article',
  true,
  now()
) ON CONFLICT (slug) DO UPDATE SET content = EXCLUDED.content, last_updated = now();

-- 12. Zaden Kiemen
INSERT INTO seo_content_pages (slug, title, h1_title, meta_description, meta_keywords, content, page_type, is_published, last_updated)
VALUES (
  'zaden-kiemen',
  'Cannabis Zaden Kiemen: Stap voor Stap | Wietforum',
  'Cannabis Zaden Kiemen',
  'Hoe kiem je cannabis zaden? De beste methodes: papiertje, direct in aarde, waterglas. Stap-voor-stap.',
  ARRAY['zaden kiemen', 'cannabis kiemen', 'wiet zaden kiemen', 'germination'],
  jsonb_build_object(
    'sections', jsonb_build_array(
      jsonb_build_object('heading', 'Methode 1: Natte Tissue', 'content', '<p>De meest populaire methode:</p><ol><li>Leg zaadjes tussen 2 vochtige tissues</li><li>Plaats in afgesloten bakje (niet luchtdicht)</li><li>Bewaar donker en warm (20-25°C)</li><li>Check dagelijks, houd vochtig</li><li>Na 2-5 dagen: worteltje verschijnt</li><li>Plant met worteltje naar beneden</li></ol>'),
      jsonb_build_object('heading', 'Methode 2: Direct in Aarde', 'content', '<p>De makkelijkste methode:</p><ol><li>Maak gaatje van 1-2 cm diep</li><li>Leg zaadje erin, punt naar beneden</li><li>Dek licht af met aarde</li><li>Besproei licht</li><li>Wacht 3-10 dagen</li></ol><p>Minder controle maar minder stress voor het zaad.</p>'),
      jsonb_build_object('heading', 'Methode 3: Waterglas', 'content', '<p><strong>Let op:</strong> Zaad mag niet langer dan 24-32 uur in water!</p><ol><li>Zet zaad in glas lauw water</li><li>Plaats donker en warm</li><li>Na 12-24 uur: zaad zinkt (is goed)</li><li>Als worteltje komt: plant meteen!</li></ol>'),
      jsonb_build_object('heading', 'Tips voor Succes', 'content', '<ul><li><strong>Temperatuur:</strong> 20-25°C ideaal</li><li><strong>Vochtigheid:</strong> Vochtig, niet nat</li><li><strong>Donker:</strong> Zaden kiemen in het donker</li><li><strong>Geduld:</strong> Sommige zaden doen 7-10 dagen</li></ul>')
    ),
    'faq', jsonb_build_array(
      jsonb_build_object('question', 'Hoe lang duurt kiemen?', 'answer', 'Meestal 2-5 dagen. Oudere zaden kunnen tot 10 dagen doen.'),
      jsonb_build_object('question', 'Waarom kiemen mijn zaden niet?', 'answer', 'Mogelijk te oud, te koud, te nat of te droog. Probeer de tissue methode bij 22-24°C.')
    )
  ),
  'article',
  true,
  now()
) ON CONFLICT (slug) DO UPDATE SET content = EXCLUDED.content, last_updated = now();

-- 13. Zaadbank Reviews
INSERT INTO seo_content_pages (slug, title, h1_title, meta_description, meta_keywords, content, page_type, is_published, last_updated)
VALUES (
  'zaadbank-reviews',
  'Zaadbank Reviews: Beste Shops Vergeleken | Wietforum',
  'Zaadbank Reviews en Vergelijking',
  'Eerlijke reviews van cannabis zaadbanken. Royal Queen Seeds, Dutch Passion, Sensi Seeds en meer vergeleken.',
  ARRAY['zaadbank reviews', 'zaadbank vergelijking', 'beste zaadbank', 'seedbank review'],
  jsonb_build_object(
    'sections', jsonb_build_array(
      jsonb_build_object('heading', 'Top Zaadbanken Beoordeeld', 'content', '<p>Onze beoordelingen zijn gebaseerd op kiempercentage, klantenservice, verzending en prijs/kwaliteit.</p>'),
      jsonb_build_object('heading', 'Royal Queen Seeds ⭐⭐⭐⭐⭐', 'content', '<p><strong>Pro''s:</strong> Groot assortiment, uitstekende kiemgarantie, snelle verzending, goede prijs</p><p><strong>Con''s:</strong> Populaire strains soms uitverkocht</p><p><strong>Beoordeling:</strong> Beste algehele keuze</p>'),
      jsonb_build_object('heading', 'Dutch Passion ⭐⭐⭐⭐⭐', 'content', '<p><strong>Pro''s:</strong> Pionier sinds 1987, originele genetica, hoge kwaliteit</p><p><strong>Con''s:</strong> Iets duurder</p><p><strong>Beoordeling:</strong> Premium kwaliteit</p>'),
      jsonb_build_object('heading', 'Sensi Seeds ⭐⭐⭐⭐', 'content', '<p><strong>Pro''s:</strong> Historische genetica, betrouwbaar</p><p><strong>Con''s:</strong> Duur, website gedateerd</p><p><strong>Beoordeling:</strong> Voor de klassieker-liefhebber</p>'),
      jsonb_build_object('heading', 'Barney''s Farm ⭐⭐⭐⭐', 'content', '<p><strong>Pro''s:</strong> Award-winning strains, unieke genetica</p><p><strong>Con''s:</strong> Prijzig</p><p><strong>Beoordeling:</strong> Voor speciale strains</p>')
    ),
    'faq', jsonb_build_array(
      jsonb_build_object('question', 'Welke zaadbank is het beste?', 'answer', 'Royal Queen Seeds biedt de beste combinatie van prijs, kwaliteit en service voor de Belgische markt.')
    )
  ),
  'article',
  true,
  now()
) ON CONFLICT (slug) DO UPDATE SET content = EXCLUDED.content, last_updated = now();

-- 14. Zaden Bewaren
INSERT INTO seo_content_pages (slug, title, h1_title, meta_description, meta_keywords, content, page_type, is_published, last_updated)
VALUES (
  'zaden-bewaren',
  'Cannabis Zaden Bewaren: Hoe Lang Houdbaar? | Wietforum',
  'Cannabis Zaden Goed Bewaren',
  'Hoe bewaar je cannabis zaden het beste? Temperatuur, vochtigheid en houdbaarheid uitgelegd.',
  ARRAY['zaden bewaren', 'zaden houdbaarheid', 'cannabis zaden opslaan', 'zaden storage'],
  jsonb_build_object(
    'sections', jsonb_build_array(
      jsonb_build_object('heading', 'Ideale Bewaaromstandigheden', 'content', '<p><strong>Temperatuur:</strong> 6-8°C (koelkast)</p><p><strong>Vochtigheid:</strong> Droog (8-10% RV)</p><p><strong>Licht:</strong> Donker (originele verpakking)</p><p><strong>Lucht:</strong> Afgesloten container</p>'),
      jsonb_build_object('heading', 'Hoe Lang Houdbaar?', 'content', '<ul><li><strong>Kamertemperatuur:</strong> 1-2 jaar</li><li><strong>Koelkast (6-8°C):</strong> 3-5 jaar</li><li><strong>Vriezer:</strong> 5-10+ jaar (voorzichtig!)</li></ul><p>Oudere zaden kiemen langzamer en minder betrouwbaar.</p>'),
      jsonb_build_object('heading', 'Bewaarmethode', 'content', '<ol><li>Houd zaden in originele verpakking</li><li>Plaats in luchtdicht potje</li><li>Voeg silicagel toe (absorbeert vocht)</li><li>Bewaar in koelkast (niet vriezer)</li><li>Haal pas uit koelkast als je gaat planten</li></ol>'),
      jsonb_build_object('heading', 'Veelgemaakte Fouten', 'content', '<ul><li>Zaden in vochtige omgeving</li><li>Temperatuurwisselingen</li><li>Direct zonlicht</li><li>Open verpakking laten</li></ul>')
    ),
    'faq', jsonb_build_array(
      jsonb_build_object('question', 'Hoe lang zijn zaden houdbaar?', 'answer', 'In de koelkast 3-5 jaar. Bij kamertemperatuur 1-2 jaar met afnemend kiempercentage.'),
      jsonb_build_object('question', 'Kunnen oude zaden nog kiemen?', 'answer', 'Ja, maar het kiempercentage daalt. Week oude zaden eerst in water met waterstofperoxide.')
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
  RAISE NOTICE 'TIER 2 Zaden & Strains paginas succesvol aangemaakt';
  RAISE NOTICE 'Totaal: 14 paginas';
END $$;

