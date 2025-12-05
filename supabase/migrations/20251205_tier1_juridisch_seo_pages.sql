-- =====================================================
-- TIER 1: JURIDISCHE SEO PAGINA'S (Vervolg)
-- Thuisteelt, Politie & Controle, Verkeer
-- =====================================================

-- =====================================================
-- 2.3 THUISTEELT & PLANTEN (10 keywords)
-- =====================================================

-- 1. Één Plant Regel België
INSERT INTO seo_content_pages (slug, title, h1_title, meta_description, meta_keywords, content, page_type, is_published, last_updated)
VALUES (
  'een-plant-regel-belgie',
  'De 1 Plant Regel in België: Alles Wat Je Moet Weten | Wietforum',
  'De Één Plant Regel in België Uitgelegd',
  'Mag je 1 wietplant hebben in België? Ja, onder voorwaarden. Complete uitleg over de gedoogregels voor thuisteelt.',
  ARRAY['een plant regel belgie', '1 plant belgie', 'wietplant thuis', 'mag 1 plant'],
  jsonb_build_object(
    'sections', jsonb_build_array(
      jsonb_build_object('heading', 'De Één Plant Regel', 'content', '<p>In België wordt het bezit van <strong>maximaal één vrouwelijke cannabisplant</strong> per volwassene gedoogd. Dit is geen wettelijk recht maar een <strong>vervolgingsrichtlijn</strong>.</p><p>Als je je aan de voorwaarden houdt, heeft vervolging de laagste prioriteit bij justitie.</p>'),
      jsonb_build_object('heading', 'De Voorwaarden', 'content', '<p>De 1 plant regel geldt alleen als je voldoet aan <strong>alle</strong> voorwaarden:</p><ul><li>Je bent 18 jaar of ouder</li><li>Het gaat om één vrouwelijke plant</li><li>De plant is voor persoonlijk gebruik</li><li>Je verkoopt niet (ook niet aan vrienden)</li><li>Er is geen sprake van overlast (geur, zicht)</li><li>Geen minderjarigen hebben toegang</li></ul>'),
      jsonb_build_object('heading', 'Wat Gebeurt Er Bij Controle?', 'content', '<p>Als politie je plant ontdekt en je voldoet aan de voorwaarden:</p><ul><li>De plant wordt <strong>altijd in beslag genomen</strong></li><li>Je krijgt een PV (proces-verbaal)</li><li>Meestal geen verdere vervolging</li><li>Geen boete bij eerste keer</li></ul>'),
      jsonb_build_object('heading', 'Wanneer Geldt De Regel Niet?', 'content', '<p>Je valt <strong>niet</strong> onder de gedoogregels bij:</p><ul><li>Meerdere planten (ook 2 is al te veel)</li><li>Mannelijke + vrouwelijke planten samen</li><li>Verkoop of weggeven</li><li>Klachten van buren (overlast)</li><li>Zichtbaar vanaf de straat</li><li>Professionele kweekopstelling</li></ul>')
    ),
    'faq', jsonb_build_array(
      jsonb_build_object('question', 'Hoeveel wietplanten mag je hebben in België?', 'answer', 'Eén vrouwelijke plant per volwassene wordt gedoogd onder voorwaarden.'),
      jsonb_build_object('question', 'Wordt mijn plant afgepakt?', 'answer', 'Ja, bij een controle wordt de plant altijd in beslag genomen, ook als je aan de voorwaarden voldoet.')
    )
  ),
  'article',
  true,
  now()
) ON CONFLICT (slug) DO UPDATE SET content = EXCLUDED.content, last_updated = now();

-- 2. Wiet Kweken België Straf
INSERT INTO seo_content_pages (slug, title, h1_title, meta_description, meta_keywords, content, page_type, is_published, last_updated)
VALUES (
  'wiet-kweken-belgie-straf',
  'Wiet Kweken in België: Welke Straf Riskeer Je? | Wietforum',
  'Wiet Kweken in België: De Straffen',
  'Wat is de straf voor wiet kweken in België? Van gedoogd (1 plant) tot gevangenisstraf (plantage). Complete uitleg straffen.',
  ARRAY['wiet kweken belgie straf', 'cannabis kweken straf', 'straf wietplant', 'kweek straf'],
  jsonb_build_object(
    'sections', jsonb_build_array(
      jsonb_build_object('heading', 'Straffen voor Wiet Kweken', 'content', '<p>De straf voor wiet kweken in België hangt sterk af van de <strong>schaal</strong> van de kweek:</p>'),
      jsonb_build_object('heading', 'Strafoverzicht per Situatie', 'content', '<p><strong>1 plant (eigen gebruik, geen overlast):</strong></p><ul><li>Gedoogd - plant wordt in beslag genomen</li><li>Meestal geen boete of vervolging</li></ul><p><strong>2-5 planten:</strong></p><ul><li>Boetes €1.000-8.000</li><li>Mogelijke gevangenisstraf (voorwaardelijk)</li></ul><p><strong>6-20 planten:</strong></p><ul><li>Gevangenisstraf 3 maanden - 1 jaar</li><li>Boetes tot €25.000</li></ul><p><strong>Plantage (>20 planten):</strong></p><ul><li>Gevangenisstraf 1-5 jaar</li><li>Boetes tot €100.000</li></ul><p><strong>Met verzwarende omstandigheden:</strong></p><ul><li>Verkoop aan minderjarigen</li><li>Georganiseerde bende</li><li>Straffen tot 10-15 jaar mogelijk</li></ul>'),
      jsonb_build_object('heading', 'Verzwarende Omstandigheden', 'content', '<ul><li>Professionele apparatuur (lampen, tenten)</li><li>Elektriciteitsdiefstal</li><li>Betrokkenheid minderjarigen</li><li>Verkoop of handel</li><li>Recidive</li></ul>')
    ),
    'faq', jsonb_build_array(
      jsonb_build_object('question', 'Hoeveel jaar cel voor wietkweek?', 'answer', 'Van geen straf (1 plant) tot 5 jaar (plantage) of meer bij verzwarende omstandigheden.'),
      jsonb_build_object('question', 'Krijg ik straf voor 1 plant?', 'answer', 'In principe niet als je aan alle gedoogvoorwaarden voldoet. De plant wordt wel in beslag genomen.')
    )
  ),
  'article',
  true,
  now()
) ON CONFLICT (slug) DO UPDATE SET content = EXCLUDED.content, last_updated = now();

-- 3. Hennep Kweken Legaal
INSERT INTO seo_content_pages (slug, title, h1_title, meta_description, meta_keywords, content, page_type, is_published, last_updated)
VALUES (
  'hennep-kweken-legaal',
  'Hennep Kweken: Is Het Legaal in België? | Wietforum',
  'Is Hennep Kweken Legaal in België?',
  'Is industriële hennep kweken legaal? Ja, onder strenge voorwaarden. Uitleg over het verschil met cannabis en de regels.',
  ARRAY['hennep kweken legaal', 'industriele hennep', 'hennep teelt belgie', 'hennep vs cannabis'],
  jsonb_build_object(
    'sections', jsonb_build_array(
      jsonb_build_object('heading', 'Hennep vs Cannabis', 'content', '<p><strong>Hennep</strong> en <strong>cannabis</strong> zijn dezelfde plant (Cannabis sativa), maar juridisch is er een belangrijk verschil:</p><ul><li><strong>Hennep:</strong> Variëteiten met <0.2% THC, voor industriële doeleinden</li><li><strong>Cannabis:</strong> Variëteiten met >0.2% THC, voor recreatief/medicinaal gebruik</li></ul>'),
      jsonb_build_object('heading', 'Is Hennep Kweken Legaal?', 'content', '<p><strong>Ja</strong>, maar alleen onder strikte voorwaarden:</p><ul><li>Je hebt een <strong>vergunning</strong> nodig</li><li>Alleen goedgekeurde variëteiten (EU-catalogus)</li><li>THC-gehalte max 0.2%</li><li>Registratie bij het FAVV</li><li>Controles door de overheid</li></ul><p><strong>Let op:</strong> Zonder vergunning is het kweken van elke vorm van cannabis (ook hennep) illegaal.</p>'),
      jsonb_build_object('heading', 'Waarvoor Wordt Hennep Gebruikt?', 'content', '<ul><li>Textiel en vezels</li><li>Bouwmaterialen (hennepbeton)</li><li>Voedingsproducten (hennepzaad, olie)</li><li>CBD-extractie</li></ul>')
    ),
    'faq', jsonb_build_array(
      jsonb_build_object('question', 'Mag ik hennep kweken zonder vergunning?', 'answer', 'Nee, ook voor industriële hennep heb je in België een vergunning nodig.'),
      jsonb_build_object('question', 'Is hennep hetzelfde als wiet?', 'answer', 'Botanisch ja, juridisch nee. Hennep heeft <0.2% THC en is voor industriële doeleinden.')
    )
  ),
  'article',
  true,
  now()
) ON CONFLICT (slug) DO UPDATE SET content = EXCLUDED.content, last_updated = now();

-- 4. Thuisteelt Cannabis België
INSERT INTO seo_content_pages (slug, title, h1_title, meta_description, meta_keywords, content, page_type, is_published, last_updated)
VALUES (
  'thuisteelt-cannabis-belgie',
  'Thuisteelt Cannabis België: Regels & Risicos | Wietforum',
  'Thuisteelt van Cannabis in België',
  'Alles over cannabis thuisteelt in België. Wat is gedoogd, welke risicos loop je en hoe voorkom je problemen?',
  ARRAY['thuisteelt cannabis belgie', 'thuis wiet kweken', 'eigen kweek', 'thuiskweek cannabis'],
  jsonb_build_object(
    'sections', jsonb_build_array(
      jsonb_build_object('heading', 'Thuisteelt: De Regels', 'content', '<p>Cannabis thuisteelt is in België <strong>technisch illegaal</strong> maar wordt onder voorwaarden gedoogd. De bekende "1 plant regel" is een vervolgingsrichtlijn, geen wettelijk recht.</p>'),
      jsonb_build_object('heading', 'Gedoogde Thuisteelt', 'content', '<p>Je valt onder het gedoogbeleid als:</p><ul><li>Je maximaal 1 vrouwelijke plant hebt</li><li>De plant voor eigen gebruik is</li><li>Je niet verkoopt</li><li>Er geen overlast is</li><li>Geen minderjarigen toegang hebben</li></ul>'),
      jsonb_build_object('heading', 'Risicos bij Thuisteelt', 'content', '<p>Ook binnen het gedoogbeleid zijn er risicos:</p><ul><li>Plant wordt bij ontdekking altijd afgepakt</li><li>Burenklachten kunnen leiden tot vervolging</li><li>Elektriciteitsdiefstal wordt streng bestraft</li><li>Professionele apparatuur werkt verzwarend</li></ul>'),
      jsonb_build_object('heading', 'Tips voor Discrete Thuisteelt', 'content', '<ul><li>Gebruik een koolstoffilter voor de geur</li><li>Houd de plant uit het zicht</li><li>Praat er niet over</li><li>Steal geen elektriciteit</li><li>Voorkom overlast voor buren</li></ul>')
    ),
    'faq', jsonb_build_array(
      jsonb_build_object('question', 'Is thuisteelt legaal?', 'answer', 'Nee, maar 1 plant voor eigen gebruik zonder overlast wordt gedoogd.'),
      jsonb_build_object('question', 'Wat als mijn buren klagen?', 'answer', 'Overlast kan leiden tot vervolging, ook bij 1 plant. Discretie is belangrijk.')
    )
  ),
  'article',
  true,
  now()
) ON CONFLICT (slug) DO UPDATE SET content = EXCLUDED.content, last_updated = now();

-- 5. Wietplantage Straf
INSERT INTO seo_content_pages (slug, title, h1_title, meta_description, meta_keywords, content, page_type, is_published, last_updated)
VALUES (
  'wietplantage-straf',
  'Wietplantage Straf: Gevangenis & Hoge Boetes | Wietforum',
  'Welke Straf Krijg Je voor een Wietplantage?',
  'Een wietplantage wordt zwaar bestraft in België. Gevangenisstraf tot 5 jaar of meer. Lees de straffen per situatie.',
  ARRAY['wietplantage straf', 'plantage straf', 'grote kweek straf', 'hennepplantage belgie'],
  jsonb_build_object(
    'sections', jsonb_build_array(
      jsonb_build_object('heading', 'Straffen voor Wietplantages', 'content', '<p>Een wietplantage (grootschalige kweek) wordt in België als <strong>drugshandel</strong> beschouwd en zwaar bestraft.</p>'),
      jsonb_build_object('heading', 'Strafmaten', 'content', '<p><strong>Middelgrote plantage (20-100 planten):</strong></p><ul><li>Gevangenisstraf 1-5 jaar</li><li>Boetes €1.000-100.000</li></ul><p><strong>Grote plantage (100+ planten):</strong></p><ul><li>Gevangenisstraf 5-10 jaar</li><li>Boetes tot €100.000</li><li>Verbeurdverklaring bezittingen</li></ul><p><strong>Met verzwarende omstandigheden:</strong></p><ul><li>Tot 15-20 jaar gevangenis</li><li>Criminele organisatie</li><li>Internationale handel</li></ul>'),
      jsonb_build_object('heading', 'Bijkomende Gevolgen', 'content', '<ul><li>Strafblad</li><li>Verbeurdverklaring van pand en materiaal</li><li>Terugvordering elektriciteitskosten</li><li>Mogelijke uithuiszetting</li></ul>')
    ),
    'faq', jsonb_build_array(
      jsonb_build_object('question', 'Wanneer is het een plantage?', 'answer', 'In de praktijk wordt vanaf 20 planten vaak gesproken van een plantage.'),
      jsonb_build_object('question', 'Wat is de maximale straf?', 'answer', 'Tot 15-20 jaar bij georganiseerde criminaliteit en verzwarende omstandigheden.')
    )
  ),
  'article',
  true,
  now()
) ON CONFLICT (slug) DO UPDATE SET content = EXCLUDED.content, last_updated = now();

-- =====================================================
-- 2.4 POLITIE & CONTROLE (9 keywords)
-- =====================================================

-- 6. Speekseltest Wiet
INSERT INTO seo_content_pages (slug, title, h1_title, meta_description, meta_keywords, content, page_type, is_published, last_updated)
VALUES (
  'speekseltest-wiet',
  'Speekseltest Wiet: Hoe Werkt Het & Hoelang Detecteerbaar? | Wietforum',
  'De Speekseltest voor Wiet Uitgelegd',
  'Hoe werkt de speekseltest op wiet? Hoelang blijft THC detecteerbaar? Wat gebeurt er bij een positieve test? Alle antwoorden.',
  ARRAY['speekseltest wiet', 'speekseltest cannabis', 'drugwipe test', 'speeksel thc'],
  jsonb_build_object(
    'sections', jsonb_build_array(
      jsonb_build_object('heading', 'Hoe Werkt de Speekseltest?', 'content', '<p>De politie gebruikt de <strong>DrugWipe</strong> speekseltest om THC in speeksel te detecteren. De test is snel (resultaat in 5-10 minuten) en kan uitgevoerd worden bij elke verkeerscontrole.</p>'),
      jsonb_build_object('heading', 'Detectietijd THC in Speeksel', 'content', '<p><strong>Gemiddelde detectietijd:</strong></p><ul><li>Incidenteel gebruik: 12-24 uur</li><li>Regelmatig gebruik: 24-72 uur</li><li>Zwaar gebruik: Tot 72+ uur mogelijk</li></ul><p><strong>Factoren die meespelen:</strong></p><ul><li>Frequentie van gebruik</li><li>Kwaliteit/sterkte van de wiet</li><li>Individueel metabolisme</li><li>Mondhygiëne</li></ul>'),
      jsonb_build_object('heading', 'Wat Bij een Positieve Test?', 'content', '<p>Bij een positieve speekseltest:</p><ol><li>Je rijbewijs wordt <strong>onmiddellijk ingetrokken</strong> (15 dagen)</li><li>Je moet een <strong>bloedtest</strong> laten afnemen ter bevestiging</li><li>Je auto kan worden geïmmobiliseerd</li><li>Er volgt een PV en mogelijke vervolging</li></ol>'),
      jsonb_build_object('heading', 'Straffen na Positieve Test', 'content', '<p><strong>Eerste overtreding:</strong></p><ul><li>Boete €1.600 - €16.000</li><li>Rijverbod 1 maand - 5 jaar</li></ul><p><strong>Recidive:</strong></p><ul><li>Hogere boetes</li><li>Langer rijverbod</li><li>Mogelijke gevangenisstraf</li></ul>')
    ),
    'faq', jsonb_build_array(
      jsonb_build_object('question', 'Hoelang is wiet aantoonbaar in speeksel?', 'answer', 'Gemiddeld 24-72 uur, afhankelijk van gebruik en individuele factoren.'),
      jsonb_build_object('question', 'Kan ik een speekseltest weigeren?', 'answer', 'Nee, weigeren wordt gelijkgesteld aan een positief resultaat en is strafbaar.')
    )
  ),
  'article',
  true,
  now()
) ON CONFLICT (slug) DO UPDATE SET content = EXCLUDED.content, last_updated = now();

-- 7. Drugstest Politie België
INSERT INTO seo_content_pages (slug, title, h1_title, meta_description, meta_keywords, content, page_type, is_published, last_updated)
VALUES (
  'drugstest-politie-belgie',
  'Drugstest Politie België: Speeksel, Bloed & Urine | Wietforum',
  'Drugstesten door de Politie in België',
  'Welke drugstesten gebruikt de Belgische politie? Speekseltest, bloedtest, urinetest. Hoe werken ze en wat zijn je rechten?',
  ARRAY['drugstest politie belgie', 'drugtest politie', 'controle drugs verkeer', 'politietest drugs'],
  jsonb_build_object(
    'sections', jsonb_build_array(
      jsonb_build_object('heading', 'Soorten Drugstesten', 'content', '<p>De Belgische politie kan verschillende tests uitvoeren:</p><ul><li><strong>Speekseltest (DrugWipe):</strong> Snelle screeningtest in het verkeer</li><li><strong>Bloedtest:</strong> Bevestigingstest na positieve speekseltest</li><li><strong>Urinetest:</strong> Soms gebruikt, vooral bij arbeidscontroles</li></ul>'),
      jsonb_build_object('heading', 'Wanneer Mag de Politie Testen?', 'content', '<p><strong>In het verkeer:</strong></p><ul><li>Bij elke verkeerscontrole</li><li>Na een ongeval</li><li>Bij vermoeden van druggebruik</li></ul><p><strong>Elders:</strong></p><ul><li>Bij arrestatie</li><li>Op bevel van een magistraat</li></ul>'),
      jsonb_build_object('heading', 'Je Rechten', 'content', '<p><strong>Je kunt NIET weigeren</strong> - weigering is strafbaar.</p><p><strong>Je kunt WEL:</strong></p><ul><li>Vragen om een bloedtest als tegenbewijs</li><li>De resultaten aanvechten</li><li>Een advocaat raadplegen</li></ul>')
    ),
    'faq', jsonb_build_array(
      jsonb_build_object('question', 'Mag ik een drugstest weigeren?', 'answer', 'Nee, weigering is strafbaar en wordt gelijkgesteld aan een positief resultaat.'),
      jsonb_build_object('question', 'Hoelang duurt een bloedtest?', 'answer', 'De afname duurt enkele minuten. Resultaten zijn er na enkele dagen tot weken.')
    )
  ),
  'article',
  true,
  now()
) ON CONFLICT (slug) DO UPDATE SET content = EXCLUDED.content, last_updated = now();

-- 8. Huiszoeking Wiet
INSERT INTO seo_content_pages (slug, title, h1_title, meta_description, meta_keywords, content, page_type, is_published, last_updated)
VALUES (
  'huiszoeking-wiet',
  'Huiszoeking Wiet: Je Rechten & Wat Je Moet Weten | Wietforum',
  'Huiszoeking bij Vermoeden van Wiet',
  'Wanneer mag de politie een huiszoeking doen voor wiet? Wat zijn je rechten? Wat gebeurt er met je plant? Alles uitgelegd.',
  ARRAY['huiszoeking wiet', 'politie huiszoeking', 'huiszoeking drugs', 'rechten huiszoeking'],
  jsonb_build_object(
    'sections', jsonb_build_array(
      jsonb_build_object('heading', 'Wanneer Mag de Politie Binnen?', 'content', '<p>De politie mag alleen je woning betreden met:</p><ul><li><strong>Huiszoekingsbevel</strong> van een onderzoeksrechter</li><li><strong>Toestemming</strong> van de bewoner</li><li><strong>Heterdaad</strong> (beperkte omstandigheden)</li><li><strong>In sommige gevallen</strong> op bevel van de procureur (bij drugsonderzoek)</li></ul>'),
      jsonb_build_object('heading', 'Je Rechten bij een Huiszoeking', 'content', '<ul><li>Je hoeft geen toestemming te geven</li><li>Vraag altijd naar het bevel</li><li>Je mag aanwezig zijn bij de zoeking</li><li>Je hebt recht op bijstand van een advocaat</li><li>Je hoeft geen vragen te beantwoorden</li></ul>'),
      jsonb_build_object('heading', 'Wat Gebeurt Er als Ze Wiet Vinden?', 'content', '<p><strong>1 plant (gedoogd):</strong></p><ul><li>Plant wordt in beslag genomen</li><li>PV wordt opgemaakt</li><li>Meestal geen verdere vervolging</li></ul><p><strong>Meerdere planten:</strong></p><ul><li>Alles wordt in beslag genomen</li><li>Vervolging wordt ingesteld</li><li>Mogelijke arrestatie</li></ul>')
    ),
    'faq', jsonb_build_array(
      jsonb_build_object('question', 'Mag de politie zomaar binnenkomen?', 'answer', 'Nee, alleen met een huiszoekingsbevel, je toestemming, of in uitzonderlijke omstandigheden.'),
      jsonb_build_object('question', 'Moet ik meewerken aan een huiszoeking?', 'answer', 'Je hoeft geen toestemming te geven en geen vragen te beantwoorden. Je moet wel de zoeking zelf toelaten als er een bevel is.')
    )
  ),
  'article',
  true,
  now()
) ON CONFLICT (slug) DO UPDATE SET content = EXCLUDED.content, last_updated = now();

-- 9. Huiszoeking Zonder Bevel
INSERT INTO seo_content_pages (slug, title, h1_title, meta_description, meta_keywords, content, page_type, is_published, last_updated)
VALUES (
  'huiszoeking-zonder-bevel',
  'Huiszoeking Zonder Bevel: Wanneer Mag Het? | Wietforum',
  'Wanneer Mag de Politie Binnenkomen Zonder Bevel?',
  'In welke gevallen mag de politie je woning betreden zonder huiszoekingsbevel? De uitzonderingen uitgelegd.',
  ARRAY['huiszoeking zonder bevel', 'politie binnenkomen', 'politie geen bevel', 'wanneer huiszoeking'],
  jsonb_build_object(
    'sections', jsonb_build_array(
      jsonb_build_object('heading', 'Uitzonderingen op het Huiszoekingsbevel', 'content', '<p>De politie mag je woning betreden <strong>zonder bevel</strong> in specifieke situaties:</p><ul><li><strong>Met je toestemming:</strong> Als jij (of een bewoner) toestemming geeft</li><li><strong>Heterdaad:</strong> Bij ernstige misdrijven die net plaatsvinden</li><li><strong>Nood:</strong> Bij brand, overstromingen, om levens te redden</li><li><strong>Drugsonderzoek:</strong> Op bevel van de procureur (beperkt)</li></ul>'),
      jsonb_build_object('heading', 'Wat Te Doen?', 'content', '<p><strong>Geef niet zomaar toestemming.</strong> Als de politie aanbelt:</p><ul><li>Vraag naar de reden van hun komst</li><li>Vraag naar een huiszoekingsbevel</li><li>Zeg dat je geen toestemming geeft om binnen te treden</li><li>Blijf beleefd maar duidelijk</li></ul>'),
      jsonb_build_object('heading', 'Bij Illegale Huiszoeking', 'content', '<p>Als de politie onrechtmatig is binnengetreden, kan bewijs mogelijk worden uitgesloten in de rechtszaak. Raadpleeg altijd een advocaat.</p>')
    ),
    'faq', jsonb_build_array(
      jsonb_build_object('question', 'Mag de politie naar binnen als ik weiger?', 'answer', 'Alleen met een bevel of in uitzonderlijke omstandigheden (heterdaad, nood).'),
      jsonb_build_object('question', 'Wat als ze toch binnenkomen zonder bevel?', 'answer', 'Noteer alles en raadpleeg een advocaat. Onrechtmatig verkregen bewijs kan worden aangevochten.')
    )
  ),
  'article',
  true,
  now()
) ON CONFLICT (slug) DO UPDATE SET content = EXCLUDED.content, last_updated = now();

-- 10. Mag Politie Huis Binnen
INSERT INTO seo_content_pages (slug, title, h1_title, meta_description, meta_keywords, content, page_type, is_published, last_updated)
VALUES (
  'mag-politie-huis-binnen',
  'Mag de Politie Zomaar Je Huis Binnen? | Wietforum',
  'Mag de Politie Zomaar Je Huis Binnenkomen?',
  'Wanneer mag de politie je woning betreden? Je rechten als bewoner en wanneer je wel of niet moet opendoen.',
  ARRAY['mag politie huis binnen', 'politie woning', 'rechten woning', 'politie binnenkomen'],
  jsonb_build_object(
    'sections', jsonb_build_array(
      jsonb_build_object('heading', 'Het Korte Antwoord', 'content', '<p><strong>Nee</strong>, de politie mag niet zomaar je huis binnenkomen. Je woning is beschermd door de grondwet.</p><p>Er zijn slechts enkele uitzonderingen:</p><ul><li>Je geeft toestemming</li><li>Er is een huiszoekingsbevel</li><li>Heterdaad bij ernstige misdrijven</li><li>Noodsituaties</li></ul>'),
      jsonb_build_object('heading', 'Je Rechten', 'content', '<ul><li>Je hoeft de deur niet open te doen</li><li>Je hoeft geen toestemming te geven</li><li>Je hoeft geen vragen te beantwoorden</li><li>Je mag om een bevel vragen</li></ul>')
    ),
    'faq', jsonb_build_array(
      jsonb_build_object('question', 'Mag de politie zomaar binnenkomen?', 'answer', 'Nee, alleen met toestemming, een bevel, of in uitzonderlijke omstandigheden.')
    )
  ),
  'faq',
  true,
  now()
) ON CONFLICT (slug) DO UPDATE SET content = EXCLUDED.content, last_updated = now();

-- 11. Rechten Bij Drugscontrole
INSERT INTO seo_content_pages (slug, title, h1_title, meta_description, meta_keywords, content, page_type, is_published, last_updated)
VALUES (
  'rechten-bij-drugscontrole',
  'Je Rechten bij een Drugscontrole in België | Wietforum',
  'Je Rechten bij een Drugscontrole',
  'Wat zijn je rechten als je wordt gecontroleerd op drugs? Wat moet je doen, wat mag je weigeren? Complete gids.',
  ARRAY['rechten drugscontrole', 'controle rechten', 'wat mag politie', 'drugscontrole belgie'],
  jsonb_build_object(
    'sections', jsonb_build_array(
      jsonb_build_object('heading', 'Je Rechten bij een Controle', 'content', '<p><strong>Je moet:</strong></p><ul><li>Je identiteit tonen</li><li>Meewerken aan speekseltest (in verkeer)</li><li>Stoppen als de politie dat vraagt</li></ul><p><strong>Je hoeft niet:</strong></p><ul><li>Vragen te beantwoorden</li><li>Toestemming te geven voor fouillering (behalve bij aanhouding)</li><li>Je woning open te stellen</li></ul>'),
      jsonb_build_object('heading', 'Wat Te Doen', 'content', '<ul><li>Blijf kalm en beleefd</li><li>Vraag waarom je wordt gecontroleerd</li><li>Geef je identiteit</li><li>Zwijg verder - je hoeft niets te verklaren</li><li>Vraag naar een advocaat bij aanhouding</li></ul>')
    ),
    'faq', jsonb_build_array(
      jsonb_build_object('question', 'Moet ik vragen beantwoorden?', 'answer', 'Nee, je hebt het zwijgrecht. Je moet alleen je identiteit tonen.'),
      jsonb_build_object('question', 'Mag de politie mij fouilleren?', 'answer', 'Alleen bij aanhouding of met je toestemming. Een standaard controle geeft geen fouilleringrecht.')
    )
  ),
  'article',
  true,
  now()
) ON CONFLICT (slug) DO UPDATE SET content = EXCLUDED.content, last_updated = now();

-- =====================================================
-- 2.5 VERKEER & RIJDEN (8 keywords)
-- =====================================================

-- 12. Rijden Onder Invloed Wiet
INSERT INTO seo_content_pages (slug, title, h1_title, meta_description, meta_keywords, content, page_type, is_published, last_updated)
VALUES (
  'rijden-onder-invloed-wiet',
  'Rijden Onder Invloed Wiet: Straffen & Risicos | Wietforum',
  'Rijden Onder Invloed van Wiet in België',
  'Wat zijn de straffen voor rijden onder invloed van wiet? Hoe wordt het getest? Alles over de nultolerantie in het verkeer.',
  ARRAY['rijden onder invloed wiet', 'stoned rijden', 'auto drugs', 'cannabis verkeer'],
  jsonb_build_object(
    'sections', jsonb_build_array(
      jsonb_build_object('heading', 'Nultolerantie in het Verkeer', 'content', '<p>In België geldt <strong>nultolerantie</strong> voor drugs in het verkeer. Dit betekent dat je niet mag rijden als je onder invloed bent van cannabis, ongeacht de hoeveelheid.</p><p>Er is geen "veilige" hoeveelheid zoals bij alcohol - elke detectie is strafbaar.</p>'),
      jsonb_build_object('heading', 'Straffen', 'content', '<p><strong>Eerste overtreding:</strong></p><ul><li>Boete €1.600 - €16.000</li><li>Rijverbod 1 maand - 5 jaar</li><li>Onmiddellijke intrekking rijbewijs (15 dagen)</li></ul><p><strong>Recidive:</strong></p><ul><li>Dubbele minimumboete</li><li>Langer rijverbod</li><li>Mogelijke gevangenisstraf</li><li>Verplichte medische/psychologische proeven</li></ul>'),
      jsonb_build_object('heading', 'De Test', 'content', '<p>De politie gebruikt de <strong>speekseltest</strong> om THC te detecteren. Bij een positief resultaat volgt een bloedtest voor bevestiging.</p>'),
      jsonb_build_object('heading', 'Hoelang Na Gebruik Niet Rijden?', 'content', '<p>Er is geen exacte tijd. THC kan tot 72 uur in speeksel aantoonbaar zijn. Ons advies: <strong>Rijd niet binnen 24-48 uur na gebruik</strong>.</p>')
    ),
    'faq', jsonb_build_array(
      jsonb_build_object('question', 'Hoeveel wiet mag je hebben in het verkeer?', 'answer', 'Nultolerantie - elke detectie is strafbaar, ongeacht de hoeveelheid.'),
      jsonb_build_object('question', 'Hoelang na het roken mag ik rijden?', 'answer', 'Er is geen vaste tijd. THC kan tot 72 uur detecteerbaar zijn. Wacht minimaal 24-48 uur.')
    )
  ),
  'article',
  true,
  now()
) ON CONFLICT (slug) DO UPDATE SET content = EXCLUDED.content, last_updated = now();

-- 13. Rijbewijs Kwijt Wiet
INSERT INTO seo_content_pages (slug, title, h1_title, meta_description, meta_keywords, content, page_type, is_published, last_updated)
VALUES (
  'rijbewijs-kwijt-wiet',
  'Rijbewijs Kwijt Door Wiet: Wat Nu? | Wietforum',
  'Rijbewijs Kwijt Door Cannabis',
  'Je rijbewijs ingetrokken na positieve drugstest? Lees wat je kunt doen, hoe lang het duurt en hoe je je rijbewijs terugkrijgt.',
  ARRAY['rijbewijs kwijt wiet', 'rijbewijs ingetrokken drugs', 'rijbewijs terug', 'intrekking rijbewijs'],
  jsonb_build_object(
    'sections', jsonb_build_array(
      jsonb_build_object('heading', 'Onmiddellijke Intrekking', 'content', '<p>Bij een positieve drugstest in het verkeer wordt je rijbewijs <strong>onmiddellijk ingetrokken</strong> voor minimaal 15 dagen. Dit is een administratieve maatregel, los van eventuele straffen.</p>'),
      jsonb_build_object('heading', 'Wat Nu Te Doen?', 'content', '<ol><li>Blijf kalm en werk mee</li><li>Raadpleeg zo snel mogelijk een advocaat</li><li>Wacht de uitslag van de bloedtest af</li><li>Bereid je voor op de rechtszaak</li></ol>'),
      jsonb_build_object('heading', 'Hoe Krijg Je Je Rijbewijs Terug?', 'content', '<p>Na de intrekkingsperiode en eventuele veroordeling kun je je rijbewijs terugkrijgen:</p><ul><li>Na afloop van het opgelegde rijverbod</li><li>Soms na medische/psychologische proeven</li><li>Na betaling van eventuele boetes</li></ul>')
    ),
    'faq', jsonb_build_array(
      jsonb_build_object('question', 'Hoelang ben ik mijn rijbewijs kwijt?', 'answer', 'Minimaal 15 dagen onmiddellijke intrekking, plus eventueel rijverbod van 1 maand tot 5 jaar.'),
      jsonb_build_object('question', 'Kan ik beroep aantekenen?', 'answer', 'Ja, tegen de onmiddellijke intrekking kun je binnen 15 dagen beroep aantekenen bij de politierechter.')
    )
  ),
  'article',
  true,
  now()
) ON CONFLICT (slug) DO UPDATE SET content = EXCLUDED.content, last_updated = now();

-- 14. Hoelang THC in Bloed
INSERT INTO seo_content_pages (slug, title, h1_title, meta_description, meta_keywords, content, page_type, is_published, last_updated)
VALUES (
  'hoelang-thc-in-bloed',
  'Hoelang is THC Detecteerbaar in Bloed? | Wietforum',
  'Hoelang Blijft THC in Je Bloed?',
  'Detectietijden van THC in bloed voor drugstesten. Hoelang na gebruik is wiet nog aantoonbaar? Complete informatie.',
  ARRAY['hoelang thc in bloed', 'thc bloed detectie', 'bloedtest thc', 'wiet in bloed'],
  jsonb_build_object(
    'sections', jsonb_build_array(
      jsonb_build_object('heading', 'Detectietijden THC in Bloed', 'content', '<p>THC (de psychoactieve stof in cannabis) blijft beperkt in het bloed aanwezig:</p><ul><li><strong>Actieve THC:</strong> 2-24 uur</li><li><strong>THC-metabolieten:</strong> Tot 7 dagen</li></ul><p>De bloedtest meet vooral actieve THC, wat een recenter gebruik aantoont.</p>'),
      jsonb_build_object('heading', 'Factoren die Meespelen', 'content', '<ul><li>Frequentie van gebruik</li><li>Sterkte van de cannabis</li><li>Lichaamsvet (THC is vetoplosbaar)</li><li>Metabolisme</li><li>Hydratie</li></ul>'),
      jsonb_build_object('heading', 'Vergelijking Testen', 'content', '<p><strong>Bloed:</strong> 2-24 uur (actieve THC)</p><p><strong>Speeksel:</strong> 24-72 uur</p><p><strong>Urine:</strong> 3-30 dagen (bij zwaar gebruik langer)</p><p><strong>Haar:</strong> Tot 90 dagen</p>')
    ),
    'faq', jsonb_build_array(
      jsonb_build_object('question', 'Hoelang is wiet aantoonbaar in bloed?', 'answer', 'Actieve THC: 2-24 uur. Metabolieten: tot 7 dagen.'),
      jsonb_build_object('question', 'Welke test is het nauwkeurigst?', 'answer', 'De bloedtest is het meest betrouwbaar voor recent gebruik.')
    )
  ),
  'faq',
  true,
  now()
) ON CONFLICT (slug) DO UPDATE SET content = EXCLUDED.content, last_updated = now();

-- 15. Urinetest Wiet
INSERT INTO seo_content_pages (slug, title, h1_title, meta_description, meta_keywords, content, page_type, is_published, last_updated)
VALUES (
  'urinetest-wiet',
  'Urinetest Wiet: Hoelang Detecteerbaar? | Wietforum',
  'De Urinetest voor Cannabis',
  'Hoelang blijft THC detecteerbaar in urine? Van 3 dagen tot meer dan een maand. Alle factoren uitgelegd.',
  ARRAY['urinetest wiet', 'thc urine', 'drugstest urine', 'hoelang wiet urine'],
  jsonb_build_object(
    'sections', jsonb_build_array(
      jsonb_build_object('heading', 'Detectietijd in Urine', 'content', '<p>De urinetest meet THC-metabolieten die zich ophopen in het lichaam. Detectietijden variëren sterk:</p><ul><li><strong>Eenmalig gebruik:</strong> 3-5 dagen</li><li><strong>Regelmatig gebruik (2-3x/week):</strong> 7-21 dagen</li><li><strong>Dagelijks gebruik:</strong> 30+ dagen</li><li><strong>Chronisch zwaar gebruik:</strong> Tot 60-90 dagen</li></ul>'),
      jsonb_build_object('heading', 'Waarom Zo Lang?', 'content', '<p>THC is <strong>vetoplosbaar</strong> en slaat op in lichaamsvet. Bij afbraak komen metabolieten langzaam vrij, waardoor ze lang in urine aantoonbaar blijven - veel langer dan in bloed of speeksel.</p>'),
      jsonb_build_object('heading', 'Kan Je Sneller Clean Worden?', 'content', '<p>Er zijn geen bewezen methodes om significant sneller clean te worden. Tips die soms helpen:</p><ul><li>Veel water drinken (verdunning)</li><li>Sporten (versnelt metabolisme)</li><li>Gezond eten</li></ul><p><strong>Let op:</strong> Detox-producten werken meestal niet betrouwbaar.</p>')
    ),
    'faq', jsonb_build_array(
      jsonb_build_object('question', 'Hoelang is wiet aantoonbaar in urine?', 'answer', 'Van 3 dagen (eenmalig) tot 60+ dagen (chronisch gebruik).'),
      jsonb_build_object('question', 'Kan ik sneller clean worden?', 'answer', 'Niet significant. Tijd is de enige betrouwbare factor.')
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
  RAISE NOTICE 'TIER 1 Juridische paginas (vervolg) succesvol aangemaakt';
  RAISE NOTICE 'Totaal: 15 paginas in deze migration';
  RAISE NOTICE 'Onderwerpen: Thuisteelt, Politie, Verkeer';
END $$;

