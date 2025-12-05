-- =====================================================
-- TIER 1: WETGEVING & JURIDISCHE SEO PAGINA'S
-- Focus: Hoogste prioriteit zoekwoorden
-- =====================================================

-- =====================================================
-- 2.1 ALGEMENE WETGEVING (13 keywords)
-- =====================================================

-- 1. Cannabis Wetgeving België 2025
INSERT INTO seo_content_pages (slug, title, h1_title, meta_description, meta_keywords, content, page_type, is_published, last_updated)
VALUES (
  'cannabis-wetgeving-belgie-2025',
  'Cannabis Wetgeving België 2025: Actuele Regels & Gedoogbeleid | Wietforum',
  'Cannabis Wetgeving België 2025: De Actuele Stand van Zaken',
  'Wat zijn de cannabis regels in België in 2025? Complete uitleg over gedoogbeleid, bezit, thuisteelt en de laatste wetswijzigingen. Juridisch correct.',
  ARRAY['cannabis wetgeving belgie 2025', 'wiet regels 2025', 'gedoogbeleid 2025', 'cannabis wet belgie'],
  jsonb_build_object(
    'sections', jsonb_build_array(
      jsonb_build_object('heading', 'Cannabis Wetgeving 2025: Wat Is Er Veranderd?', 'content', '<p>In 2025 blijft het <strong>gedoogbeleid</strong> in België grotendeels ongewijzigd. De belangrijkste regels:</p><ul><li><strong>Bezit:</strong> Maximaal 3 gram voor persoonlijk gebruik</li><li><strong>Thuisteelt:</strong> 1 vrouwelijke plant per volwassene wordt gedoogd</li><li><strong>Verkeer:</strong> Nultolerantie blijft van kracht</li></ul><p>Er zijn in 2025 geen significante wetswijzigingen doorgevoerd, ondanks politieke discussies over legalisatie.</p>'),
      jsonb_build_object('heading', 'Het Gedoogbeleid in 2025', 'content', '<p>Het Belgische gedoogbeleid is geen legalisatie maar een <strong>prioriteitenstelling</strong> van het Openbaar Ministerie. Dit betekent:</p><ul><li>Kleine overtredingen worden niet actief vervolgd</li><li>Je kunt nog steeds worden gecontroleerd</li><li>Je cannabis kan in beslag worden genomen</li><li>Bij herhaling of verzwarende omstandigheden volgt wel vervolging</li></ul>'),
      jsonb_build_object('heading', 'Politieke Ontwikkelingen 2025', 'content', '<p>In 2025 blijft het debat over legalisatie actueel. Partijen als <strong>Groen</strong> en <strong>Vooruit</strong> pleiten voor een gereguleerd model naar Duits voorbeeld. De huidige regering heeft echter geen plannen voor wijzigingen.</p><p>Het Duitse Cannabis Social Club model wordt met interesse gevolgd, maar België wacht af.</p>'),
      jsonb_build_object('heading', 'Wat Betekent Dit voor Jou?', 'content', '<p>In de praktijk verandert er weinig voor de gewone gebruiker in 2025:</p><ul><li>Blijf binnen de gedoogregels (3 gram, 1 plant)</li><li>Vermijd gebruik in het openbaar</li><li>Rijd nooit onder invloed</li><li>Wees discreet bij thuisteelt</li></ul>')
    ),
    'faq', jsonb_build_array(
      jsonb_build_object('question', 'Is wiet legaal in België in 2025?', 'answer', 'Nee, cannabis is niet legaal maar wordt gedoogd onder voorwaarden: max 3 gram bezit en 1 plant thuisteelt.'),
      jsonb_build_object('question', 'Komt er legalisatie in 2025?', 'answer', 'Er zijn geen concrete plannen voor legalisatie in 2025. Het gedoogbeleid blijft van kracht.')
    )
  ),
  'article',
  true,
  now()
) ON CONFLICT (slug) DO UPDATE SET content = EXCLUDED.content, last_updated = now();

-- 2. Wiet Wetgeving België
INSERT INTO seo_content_pages (slug, title, h1_title, meta_description, meta_keywords, content, page_type, is_published, last_updated)
VALUES (
  'wiet-wetgeving-belgie',
  'Wiet Wetgeving België: Complete Uitleg Regels & Straffen | Wietforum',
  'Wiet Wetgeving in België: Alle Regels op een Rij',
  'Wat mag wel en niet met wiet in België? Uitgebreide uitleg over de wetgeving, gedoogbeleid, straffen en je rechten. Duidelijk en juridisch correct.',
  ARRAY['wiet wetgeving belgie', 'wiet regels', 'wiet wet belgie', 'wietgebruik wetgeving'],
  jsonb_build_object(
    'sections', jsonb_build_array(
      jsonb_build_object('heading', 'De Wietwetgeving in België Uitgelegd', 'content', '<p>De Belgische wietwetgeving is gebaseerd op de <strong>Drugswet van 1921</strong>, maar wordt in de praktijk genuanceerd door ministeriële richtlijnen. Het resultaat is een complex systeem waarbij wiet technisch illegaal is maar onder voorwaarden wordt gedoogd.</p>'),
      jsonb_build_object('heading', 'Wat Wordt Gedoogd?', 'content', '<p><strong>Gedoogd (laagste vervolgingsprioriteit):</strong></p><ul><li>Bezit van maximaal 3 gram wiet</li><li>Eén vrouwelijke plant per meerderjarige</li><li>Geen overlast veroorzaken</li><li>Geen minderjarigen betrekken</li><li>Geen verkoop of handel</li></ul>'),
      jsonb_build_object('heading', 'Wat Is Verboden?', 'content', '<p><strong>Actief vervolgd:</strong></p><ul><li>Bezit van meer dan 3 gram</li><li>Meerdere planten kweken</li><li>Verkoop, ook kleine hoeveelheden</li><li>Openbaar gebruik</li><li>Gebruik in aanwezigheid van minderjarigen</li><li>Rijden onder invloed</li></ul>'),
      jsonb_build_object('heading', 'Straffen en Boetes', 'content', '<p><strong>Eerste overtreding (klein bezit):</strong> Meestal PV zonder gevolg of minnelijke schikking €75-150</p><p><strong>Recidive of grotere hoeveelheden:</strong> Hogere boetes tot €8.000, mogelijke dagvaarding</p><p><strong>Teelt/handel:</strong> Gevangenisstraf van 3 maanden tot 5 jaar, boetes tot €100.000</p>')
    ),
    'faq', jsonb_build_array(
      jsonb_build_object('question', 'Wat is de boete voor wietbezit?', 'answer', 'Een eerste overtreding met max 3 gram leidt meestal tot een minnelijke schikking van €75-150.'),
      jsonb_build_object('question', 'Krijg ik een strafblad voor wiet?', 'answer', 'Bij een eerste klein bezit meestal niet. Bij vervolging en veroordeling wel.')
    )
  ),
  'pillar',
  true,
  now()
) ON CONFLICT (slug) DO UPDATE SET content = EXCLUDED.content, last_updated = now();

-- 3. Is Cannabis Legaal in België
INSERT INTO seo_content_pages (slug, title, h1_title, meta_description, meta_keywords, content, page_type, is_published, last_updated)
VALUES (
  'is-cannabis-legaal-belgie',
  'Is Cannabis Legaal in België? Nee, Maar... | Wietforum',
  'Is Cannabis Legaal in België?',
  'Het korte antwoord: Nee, cannabis is niet legaal in België. Maar er is een gedoogbeleid. Lees hier precies wat wel en niet mag.',
  ARRAY['is cannabis legaal belgie', 'cannabis legaal', 'is wiet legaal', 'legaal belgie'],
  jsonb_build_object(
    'sections', jsonb_build_array(
      jsonb_build_object('heading', 'Het Korte Antwoord', 'content', '<p><strong>Nee</strong>, cannabis is niet legaal in België. Het valt onder de Drugswet van 1921 en is officieel een verboden substantie.</p><p><strong>Maar:</strong> Er geldt een gedoogbeleid waarbij persoonlijk gebruik (max 3 gram) en bezit van 1 plant de laagste vervolgingsprioriteit hebben.</p>'),
      jsonb_build_object('heading', 'Wat Betekent "Gedoogd"?', 'content', '<p>Gedoogd betekent dat de overheid er niet actief tegen optreedt, maar het blijft <strong>technisch illegaal</strong>. Concreet:</p><ul><li>Je kunt nog steeds worden gecontroleerd</li><li>Je wiet kan worden afgepakt</li><li>Je krijgt mogelijk een waarschuwing of kleine boete</li><li>Bij herhaling of andere factoren kan wel worden vervolgd</li></ul>'),
      jsonb_build_object('heading', 'Waarom Geen Volledige Legalisatie?', 'content', '<p>België heeft geen politieke meerderheid voor legalisatie. De huidige situatie is een compromis: niet actief vervolgen, maar ook niet toestaan.</p>')
    ),
    'faq', jsonb_build_array(
      jsonb_build_object('question', 'Is cannabis legaal in België?', 'answer', 'Nee, cannabis is niet legaal maar wordt gedoogd voor persoonlijk gebruik (max 3 gram, 1 plant).'),
      jsonb_build_object('question', 'Kan ik worden gearresteerd voor wiet?', 'answer', 'Bij kleine hoeveelheden voor persoonlijk gebruik is arrestatie zeldzaam, maar je wiet kan wel worden afgepakt.')
    )
  ),
  'faq',
  true,
  now()
) ON CONFLICT (slug) DO UPDATE SET content = EXCLUDED.content, last_updated = now();

-- 4. Is Weed Legaal in België
INSERT INTO seo_content_pages (slug, title, h1_title, meta_description, meta_keywords, content, page_type, is_published, last_updated)
VALUES (
  'is-weed-legaal-belgie',
  'Is Weed Legaal in België? Uitleg Gedoogbeleid | Wietforum',
  'Is Weed Legaal in België?',
  'Is weed (wiet) legaal in België? Nee, maar er is een gedoogbeleid. Ontdek wat de regels zijn voor bezit en gebruik.',
  ARRAY['is weed legaal belgie', 'weed legaal', 'weed belgie', 'is weed toegestaan'],
  jsonb_build_object(
    'sections', jsonb_build_array(
      jsonb_build_object('heading', 'Weed in België: De Regels', 'content', '<p>Weed (wiet) is <strong>niet legaal</strong> in België, maar wordt onder bepaalde voorwaarden gedoogd. Dit betekent dat je niet actief wordt vervolgd als je je aan de regels houdt.</p>'),
      jsonb_build_object('heading', 'De Gedoogregels', 'content', '<ul><li><strong>Maximum 3 gram</strong> bij je hebben</li><li><strong>1 plant</strong> thuis kweken (vrouwelijk)</li><li><strong>Geen overlast</strong> veroorzaken</li><li><strong>Geen minderjarigen</strong> in de buurt</li><li><strong>Niet in het openbaar</strong> gebruiken</li></ul>')
    ),
    'faq', jsonb_build_array(
      jsonb_build_object('question', 'Is weed legaal in België?', 'answer', 'Nee, maar bezit tot 3 gram en 1 plant wordt gedoogd onder voorwaarden.')
    )
  ),
  'faq',
  true,
  now()
) ON CONFLICT (slug) DO UPDATE SET content = EXCLUDED.content, last_updated = now();

-- 5. Wordt Wiet Legaal in België
INSERT INTO seo_content_pages (slug, title, h1_title, meta_description, meta_keywords, content, page_type, is_published, last_updated)
VALUES (
  'wordt-wiet-legaal-belgie',
  'Wordt Wiet Legaal in België? Toekomst & Politiek | Wietforum',
  'Wordt Wiet Ooit Legaal in België?',
  'Komt er legalisatie van wiet in België? Analyse van de politieke situatie, partijstandpunten en wat we kunnen verwachten.',
  ARRAY['wordt wiet legaal belgie', 'legalisatie belgie', 'wiet legaal wanneer', 'cannabis legalisering'],
  jsonb_build_object(
    'sections', jsonb_build_array(
      jsonb_build_object('heading', 'De Stand van Zaken', 'content', '<p>Op dit moment zijn er <strong>geen concrete plannen</strong> voor volledige legalisatie van cannabis in België. Het huidige gedoogbeleid blijft van kracht.</p>'),
      jsonb_build_object('heading', 'Politieke Partijen en Cannabis', 'content', '<p><strong>Voor regulering/legalisatie:</strong></p><ul><li>Groen - Pleit voor gereguleerde teelt en verkoop</li><li>Vooruit - Wil Cannabis Social Clubs toestaan</li><li>PVDA - Steunt decriminalisatie</li></ul><p><strong>Tegen legalisatie:</strong></p><ul><li>CD&V - Wil huidige beleid behouden</li><li>N-VA - Tegen versoepeling</li><li>Vlaams Belang - Stricter drugsbeleid</li></ul>'),
      jsonb_build_object('heading', 'Het Duitse Voorbeeld', 'content', '<p>Duitsland heeft in 2024 cannabis deels gelegaliseerd met Cannabis Social Clubs. Dit wordt in België met interesse gevolgd, maar voorlopig is er geen meerderheid voor een vergelijkbaar model.</p>'),
      jsonb_build_object('heading', 'Onze Inschatting', 'content', '<p>Volledige legalisatie zoals in Canada lijkt op korte termijn onwaarschijnlijk. Een uitbreiding van het gedoogbeleid of proefproject met Cannabis Social Clubs is op langere termijn denkbaar, afhankelijk van de regeringssamenstelling.</p>')
    ),
    'faq', jsonb_build_array(
      jsonb_build_object('question', 'Wordt wiet legaal in België?', 'answer', 'Op korte termijn niet. Er zijn geen concrete plannen voor legalisatie, het gedoogbeleid blijft van kracht.'),
      jsonb_build_object('question', 'Welke partijen zijn voor legalisatie?', 'answer', 'Groen, Vooruit en PVDA zijn voorstander van een vorm van regulering of legalisatie.')
    )
  ),
  'article',
  true,
  now()
) ON CONFLICT (slug) DO UPDATE SET content = EXCLUDED.content, last_updated = now();

-- 6. Wordt Wiet Legaal in België 2025
INSERT INTO seo_content_pages (slug, title, h1_title, meta_description, meta_keywords, content, page_type, is_published, last_updated)
VALUES (
  'wordt-wiet-legaal-belgie-2025',
  'Wordt Wiet Legaal in België in 2025? | Wietforum',
  'Wordt Wiet Legaal in België in 2025?',
  'Komt er legalisatie van cannabis in België in 2025? Actuele analyse van de politieke situatie en verwachtingen.',
  ARRAY['wordt wiet legaal belgie 2025', 'legalisatie 2025', 'cannabis legaal 2025'],
  jsonb_build_object(
    'sections', jsonb_build_array(
      jsonb_build_object('heading', 'Verwachtingen voor 2025', 'content', '<p><strong>Kort antwoord: Nee</strong>, er wordt geen legalisatie verwacht in 2025. De huidige Belgische regering heeft geen plannen om de wetgeving te wijzigen.</p>'),
      jsonb_build_object('heading', 'Wat Wel Kan Veranderen', 'content', '<ul><li>Mogelijke discussie over Cannabis Social Clubs</li><li>Evaluatie van het gedoogbeleid</li><li>Meer focus op medicinale cannabis</li></ul>')
    ),
    'faq', jsonb_build_array(
      jsonb_build_object('question', 'Wordt wiet legaal in 2025?', 'answer', 'Nee, er zijn geen plannen voor legalisatie in 2025.')
    )
  ),
  'article',
  true,
  now()
) ON CONFLICT (slug) DO UPDATE SET content = EXCLUDED.content, last_updated = now();

-- 7. Cannabis Legalisatie België
INSERT INTO seo_content_pages (slug, title, h1_title, meta_description, meta_keywords, content, page_type, is_published, last_updated)
VALUES (
  'cannabis-legalisatie-belgie',
  'Cannabis Legalisatie België: Huidige Stand & Toekomst | Wietforum',
  'Cannabis Legalisatie in België: Waar Staan We?',
  'Alles over cannabis legalisatie in België. Huidige wetgeving, politieke standpunten en vergelijking met Nederland en Duitsland.',
  ARRAY['cannabis legalisatie belgie', 'legalisatie cannabis', 'wiet legaliseren', 'cannabis wet veranderen'],
  jsonb_build_object(
    'sections', jsonb_build_array(
      jsonb_build_object('heading', 'Cannabis Legalisatie: De Huidige Situatie', 'content', '<p>België heeft geen <strong>volledige legalisatie</strong> van cannabis. In plaats daarvan is er een gedoogbeleid dat sinds 2003 van kracht is. Dit beleid betekent dat persoonlijk gebruik niet actief wordt vervolgd, maar cannabis blijft officieel illegaal.</p>'),
      jsonb_build_object('heading', 'Vergelijking met Buurlanden', 'content', '<p><strong>Nederland:</strong> Gedoogbeleid met coffeeshops (verkoop illegaal, maar gedoogd)</p><p><strong>Duitsland:</strong> Sinds 2024 gedeeltelijke legalisatie met Cannabis Social Clubs</p><p><strong>Luxemburg:</strong> Thuisteelt gelegaliseerd (tot 4 planten)</p><p><strong>Frankrijk:</strong> Strikt verbod, geen gedoogbeleid</p>'),
      jsonb_build_object('heading', 'Waarom Geen Legalisatie?', 'content', '<p>Er is in België geen politieke meerderheid voor legalisatie. De bevolking is verdeeld en politieke partijen nemen uiteenlopende standpunten in. Ook Europese regelgeving speelt een rol.</p>'),
      jsonb_build_object('heading', 'Mogelijke Ontwikkelingen', 'content', '<p>Mogelijke stappen richting regulering:</p><ul><li>Proefprojecten met Cannabis Social Clubs</li><li>Uitbreiding medicinale cannabis</li><li>Lokale experimenten in grote steden</li></ul>')
    ),
    'faq', jsonb_build_array(
      jsonb_build_object('question', 'Is cannabis gelegaliseerd in België?', 'answer', 'Nee, cannabis is niet legaal maar wordt onder voorwaarden gedoogd.'),
      jsonb_build_object('question', 'Komt er legalisatie zoals in Nederland?', 'answer', 'België heeft al een vergelijkbaar gedoogbeleid, maar coffeeshops zijn er niet. Volledige legalisatie lijkt voorlopig onwaarschijnlijk.')
    )
  ),
  'article',
  true,
  now()
) ON CONFLICT (slug) DO UPDATE SET content = EXCLUDED.content, last_updated = now();

-- 8. Wiet Legalisering België
INSERT INTO seo_content_pages (slug, title, h1_title, meta_description, meta_keywords, content, page_type, is_published, last_updated)
VALUES (
  'wiet-legalisering-belgie',
  'Wiet Legalisering België: Stand van Zaken 2025 | Wietforum',
  'Wiet Legalisering in België',
  'Komt wiet legalisering in België? Overzicht van de huidige wetgeving, politieke standpunten en toekomstverwachtingen.',
  ARRAY['wiet legalisering belgie', 'legalisering wiet', 'wiet legaal maken'],
  jsonb_build_object(
    'sections', jsonb_build_array(
      jsonb_build_object('heading', 'Wiet Legalisering: De Feiten', 'content', '<p>Wiet is in België <strong>niet gelegaliseerd</strong>. Er geldt een gedoogbeleid waarbij persoonlijk gebruik niet actief wordt vervolgd, maar het blijft officieel verboden.</p>'),
      jsonb_build_object('heading', 'Het Verschil met Legalisering', 'content', '<p><strong>Gedoogbeleid (huidige situatie):</strong> Wiet blijft illegaal, maar kleine overtredingen worden niet vervolgd.</p><p><strong>Legalisering:</strong> Wiet wordt wettelijk toegestaan, met regulering en eventueel belasting.</p>')
    ),
    'faq', jsonb_build_array(
      jsonb_build_object('question', 'Is wiet gelegaliseerd in België?', 'answer', 'Nee, wiet is gedoogd maar niet legaal.')
    )
  ),
  'article',
  true,
  now()
) ON CONFLICT (slug) DO UPDATE SET content = EXCLUDED.content, last_updated = now();

-- 9. Gedoogbeleid België Wiet
INSERT INTO seo_content_pages (slug, title, h1_title, meta_description, meta_keywords, content, page_type, is_published, last_updated)
VALUES (
  'gedoogbeleid-belgie-wiet',
  'Gedoogbeleid België Wiet: Complete Uitleg | Wietforum',
  'Het Gedoogbeleid voor Wiet in België Uitgelegd',
  'Wat houdt het Belgische gedoogbeleid voor wiet precies in? Alle regels, grenzen en uitzonderingen duidelijk uitgelegd.',
  ARRAY['gedoogbeleid belgie wiet', 'gedoogbeleid cannabis', 'wiet gedoogd', 'gedoogregels'],
  jsonb_build_object(
    'sections', jsonb_build_array(
      jsonb_build_object('heading', 'Wat Is het Gedoogbeleid?', 'content', '<p>Het Belgische gedoogbeleid voor cannabis dateert uit 2003 en werd aangepast in 2005. Het is een <strong>vervolgingsbeleid</strong> van het Openbaar Ministerie dat bepaalt dat persoonlijk cannabisgebruik de laagste prioriteit heeft.</p><p><strong>Belangrijk:</strong> Gedoogd betekent niet legaal. Cannabis blijft verboden, maar wordt onder bepaalde voorwaarden niet actief vervolgd.</p>'),
      jsonb_build_object('heading', 'De Gedoogvoorwaarden', 'content', '<p>Je valt onder het gedoogbeleid als je voldoet aan <strong>alle</strong> voorwaarden:</p><ul><li>Je bent meerderjarig (18+)</li><li>Je hebt maximaal 3 gram bij je</li><li>Of je hebt maximaal 1 vrouwelijke plant thuis</li><li>Je veroorzaakt geen overlast</li><li>Je gebruikt niet in het openbaar</li><li>Er zijn geen minderjarigen bij betrokken</li><li>Je rijdt niet onder invloed</li></ul>'),
      jsonb_build_object('heading', 'Wanneer Geldt Het Niet?', 'content', '<p>Het gedoogbeleid geldt <strong>niet</strong> bij:</p><ul><li>Bezit van meer dan 3 gram</li><li>Meerdere planten</li><li>Elke vorm van verkoop of handel</li><li>Openbaar gebruik</li><li>Gebruik nabij scholen of jeugdinstellingen</li><li>Herhaalde overtredingen</li></ul>'),
      jsonb_build_object('heading', 'Wat Gebeurt Er Bij Controle?', 'content', '<p>Als je wordt gecontroleerd en je voldoet aan de gedoogvoorwaarden:</p><ul><li>Je wiet kan worden afgepakt</li><li>Je krijgt mogelijk een waarschuwing</li><li>Of een PV zonder verdere gevolgen</li><li>Meestal geen boete bij eerste keer</li></ul>')
    ),
    'faq', jsonb_build_array(
      jsonb_build_object('question', 'Wat is het gedoogbeleid voor wiet?', 'answer', 'Een vervolgingsbeleid waarbij persoonlijk gebruik (max 3 gram, 1 plant) de laagste prioriteit heeft bij justitie.'),
      jsonb_build_object('question', 'Betekent gedoogd dat het legaal is?', 'answer', 'Nee, gedoogd betekent dat het niet actief wordt vervolgd. Cannabis blijft officieel illegaal.')
    )
  ),
  'article',
  true,
  now()
) ON CONFLICT (slug) DO UPDATE SET content = EXCLUDED.content, last_updated = now();

-- 10. Drugswet België
INSERT INTO seo_content_pages (slug, title, h1_title, meta_description, meta_keywords, content, page_type, is_published, last_updated)
VALUES (
  'drugswet-belgie',
  'Drugswet België: De Wet van 1921 Uitgelegd | Wietforum',
  'De Drugswet van België: Wet van 1921',
  'Alles over de Belgische drugswet van 1921. Wat staat erin over cannabis, welke straffen zijn er en hoe wordt de wet toegepast?',
  ARRAY['drugswet belgie', 'wet 1921', 'drugswetgeving', 'verdovende middelen wet'],
  jsonb_build_object(
    'sections', jsonb_build_array(
      jsonb_build_object('heading', 'De Wet van 24 februari 1921', 'content', '<p>De Belgische drugswetgeving is gebaseerd op de <strong>Wet van 24 februari 1921</strong> betreffende het verhandelen van gifstoffen, slaapmiddelen en verdovende middelen, psychotrope stoffen, ontsmettingsstoffen en antiseptica.</p><p>Deze wet is meer dan 100 jaar oud maar vormt nog steeds de basis van het Belgische drugsbeleid.</p>'),
      jsonb_build_object('heading', 'Wat Zegt de Wet over Cannabis?', 'content', '<p>Cannabis (marihuana, wiet, hasj) valt onder de categorie <strong>verdovende middelen</strong>. De wet verbiedt:</p><ul><li>Invoer, uitvoer en doorvoer</li><li>Vervaardiging en bereiding</li><li>Bezit en verwerving</li><li>Verkoop en levering</li><li>Aanbieden</li></ul>'),
      jsonb_build_object('heading', 'Straffen Volgens de Wet', 'content', '<p><strong>Bezit voor persoonlijk gebruik:</strong> Gevangenisstraf 3 maanden - 1 jaar en/of boete €1.000-100.000</p><p><strong>Verkoop/handel:</strong> Gevangenisstraf 1-5 jaar en/of boete €1.000-100.000</p><p><strong>Met verzwarende omstandigheden:</strong> Tot 15-20 jaar gevangenisstraf</p><p><em>In de praktijk worden deze straffen zelden volledig toegepast bij klein bezit.</em></p>'),
      jsonb_build_object('heading', 'Ministeriële Richtlijnen', 'content', '<p>De strenge wettelijke straffen worden genuanceerd door <strong>ministeriële richtlijnen</strong> uit 2003 en 2005. Deze bepalen dat persoonlijk gebruik de laagste vervolgingsprioriteit heeft, wat heeft geleid tot het huidige gedoogbeleid.</p>')
    ),
    'faq', jsonb_build_array(
      jsonb_build_object('question', 'Hoe oud is de Belgische drugswet?', 'answer', 'De wet dateert uit 1921 en is dus meer dan 100 jaar oud.'),
      jsonb_build_object('question', 'Wat zijn de maximale straffen voor cannabis?', 'answer', 'Wettelijk tot 5 jaar gevangenis voor bezit, in praktijk worden deze zelden toegepast bij klein bezit.')
    )
  ),
  'pillar',
  true,
  now()
) ON CONFLICT (slug) DO UPDATE SET content = EXCLUDED.content, last_updated = now();

-- 11. Verdovende Middelen Wet België
INSERT INTO seo_content_pages (slug, title, h1_title, meta_description, meta_keywords, content, page_type, is_published, last_updated)
VALUES (
  'verdovende-middelen-wet-belgie',
  'Verdovende Middelen Wet België: Cannabis Classificatie | Wietforum',
  'De Verdovende Middelen Wet en Cannabis',
  'Hoe wordt cannabis geclassificeerd in de Belgische wet op verdovende middelen? Uitleg over de juridische status.',
  ARRAY['verdovende middelen wet belgie', 'cannabis classificatie', 'drugs classificatie belgie'],
  jsonb_build_object(
    'sections', jsonb_build_array(
      jsonb_build_object('heading', 'Cannabis als Verdovend Middel', 'content', '<p>In de Belgische wetgeving valt cannabis onder de categorie <strong>verdovende middelen</strong>. Dit betekent dat het dezelfde juridische status heeft als andere drugs, hoewel het gedoogbeleid in de praktijk onderscheid maakt.</p>'),
      jsonb_build_object('heading', 'De Internationale Context', 'content', '<p>De Belgische wetgeving volgt internationale verdragen van de Verenigde Naties over verdovende middelen. Dit beperkt de mogelijkheden voor volledige legalisatie.</p>')
    ),
    'faq', jsonb_build_array(
      jsonb_build_object('question', 'Is cannabis een verdovend middel volgens de wet?', 'answer', 'Ja, cannabis valt juridisch onder de categorie verdovende middelen in België.')
    )
  ),
  'article',
  true,
  now()
) ON CONFLICT (slug) DO UPDATE SET content = EXCLUDED.content, last_updated = now();

-- =====================================================
-- 2.2 BEZIT & STRAFMATEN (12 keywords)
-- =====================================================

-- 12. Hoeveel Gram Wiet Mag Je Hebben België
INSERT INTO seo_content_pages (slug, title, h1_title, meta_description, meta_keywords, content, page_type, is_published, last_updated)
VALUES (
  'hoeveel-gram-wiet-belgie',
  'Hoeveel Gram Wiet Mag Je Hebben in België? | Wietforum',
  'Hoeveel Gram Wiet Mag Je Bij Je Hebben?',
  'In België wordt bezit van maximaal 3 gram wiet gedoogd. Lees wat dit betekent, wat de risicos zijn en wat er gebeurt bij meer.',
  ARRAY['hoeveel gram wiet belgie', 'hoeveel wiet mag je hebben', '3 gram regel', 'wiet bezit hoeveelheid'],
  jsonb_build_object(
    'sections', jsonb_build_array(
      jsonb_build_object('heading', 'De 3 Gram Regel', 'content', '<p>In België wordt bezit van <strong>maximaal 3 gram</strong> cannabis voor persoonlijk gebruik gedoogd. Dit betekent dat je bij een controle met deze hoeveelheid in principe niet wordt vervolgd.</p><p><strong>Let op:</strong> Dit is geen recht, maar een vervolgingsrichtlijn. Je wiet kan nog steeds worden afgepakt.</p>'),
      jsonb_build_object('heading', 'Wat Telt als "3 Gram"?', 'content', '<p>De 3 gram betreft het <strong>totale gewicht</strong> van de cannabis die je bij je hebt:</p><ul><li>Wiet (toppen)</li><li>Hasj</li><li>Voorgedraaide joints (inhoud telt)</li></ul><p>Het totaal mag niet boven de 3 gram komen.</p>'),
      jsonb_build_object('heading', 'Wat Als Je Meer Hebt?', 'content', '<p>Bij bezit van meer dan 3 gram:</p><ul><li>Je valt niet meer onder het gedoogbeleid</li><li>Er wordt een PV opgemaakt</li><li>Mogelijke vervolging door het Openbaar Ministerie</li><li>Boetes van €1.000 tot €100.000 zijn wettelijk mogelijk</li></ul>')
    ),
    'faq', jsonb_build_array(
      jsonb_build_object('question', 'Hoeveel gram wiet mag je hebben?', 'answer', 'Maximaal 3 gram voor persoonlijk gebruik wordt gedoogd in België.'),
      jsonb_build_object('question', 'Wat gebeurt er met meer dan 3 gram?', 'answer', 'Bij meer dan 3 gram kan er worden vervolgd en riskeer je een boete.')
    )
  ),
  'faq',
  true,
  now()
) ON CONFLICT (slug) DO UPDATE SET content = EXCLUDED.content, last_updated = now();

-- 13. Cannabis Bezit België
INSERT INTO seo_content_pages (slug, title, h1_title, meta_description, meta_keywords, content, page_type, is_published, last_updated)
VALUES (
  'cannabis-bezit-belgie',
  'Cannabis Bezit België: Regels, Straffen & Gedoogbeleid | Wietforum',
  'Cannabis Bezit in België: Wat Je Moet Weten',
  'Alles over cannabis bezit in België. Hoeveel mag je hebben, wat zijn de straffen en wanneer wordt je vervolgd?',
  ARRAY['cannabis bezit belgie', 'wiet bezit', 'bezit cannabis straf', 'cannabis bij je hebben'],
  jsonb_build_object(
    'sections', jsonb_build_array(
      jsonb_build_object('heading', 'Regels voor Cannabis Bezit', 'content', '<p>Cannabis bezit in België valt onder de Drugswet van 1921. In theorie is elk bezit strafbaar, maar het gedoogbeleid maakt onderscheid tussen persoonlijk gebruik en grotere hoeveelheden.</p>'),
      jsonb_build_object('heading', 'Gedoogde Hoeveelheden', 'content', '<ul><li><strong>Tot 3 gram:</strong> Gedoogd, laagste vervolgingsprioriteit</li><li><strong>Meer dan 3 gram:</strong> Wordt als handel gezien, vervolging mogelijk</li></ul>'),
      jsonb_build_object('heading', 'Straffen bij Vervolging', 'content', '<p><strong>Klein bezit (eerste keer):</strong> Meestal minnelijke schikking €75-150</p><p><strong>Groter bezit:</strong> Boetes tot €8.000, mogelijke gevangenisstraf</p><p><strong>Met vermoeden van handel:</strong> Zwaardere straffen tot 5 jaar</p>')
    ),
    'faq', jsonb_build_array(
      jsonb_build_object('question', 'Is cannabis bezit strafbaar in België?', 'answer', 'Officieel ja, maar bezit tot 3 gram voor eigen gebruik wordt gedoogd.'),
      jsonb_build_object('question', 'Wat is de straf voor cannabisbezit?', 'answer', 'Bij klein bezit meestal een minnelijke schikking van €75-150. Bij grotere hoeveelheden hogere boetes.')
    )
  ),
  'article',
  true,
  now()
) ON CONFLICT (slug) DO UPDATE SET content = EXCLUDED.content, last_updated = now();

-- 14. Boete Wiet Bezit
INSERT INTO seo_content_pages (slug, title, h1_title, meta_description, meta_keywords, content, page_type, is_published, last_updated)
VALUES (
  'boete-wiet-bezit',
  'Boete Wiet Bezit: Hoeveel Betaal Je in België? | Wietforum',
  'Welke Boete Krijg Je voor Wiet Bezit?',
  'Wat is de boete voor wietbezit in België? Van €75 minnelijke schikking tot €100.000 bij grote hoeveelheden. Complete uitleg.',
  ARRAY['boete wiet bezit', 'boete cannabis', 'minnelijke schikking wiet', 'straf wiet'],
  jsonb_build_object(
    'sections', jsonb_build_array(
      jsonb_build_object('heading', 'Boetes voor Wietbezit', 'content', '<p>De boete voor wietbezit hangt af van de hoeveelheid, of het een eerste overtreding is, en of er verzwarende omstandigheden zijn.</p>'),
      jsonb_build_object('heading', 'Overzicht Boetes', 'content', '<p><strong>Klein bezit (tot 3 gram, eerste keer):</strong></p><ul><li>Meestal geen boete, alleen PV</li><li>Of minnelijke schikking: €75-150</li></ul><p><strong>Klein bezit (herhaling):</strong></p><ul><li>Minnelijke schikking: €150-250</li><li>Of dagvaarding</li></ul><p><strong>Groter bezit (>3 gram):</strong></p><ul><li>Boetes van €1.000-8.000</li><li>Mogelijke dagvaarding</li></ul><p><strong>Grote hoeveelheden/handel:</strong></p><ul><li>Boetes tot €100.000</li><li>Gevangenisstraf mogelijk</li></ul>'),
      jsonb_build_object('heading', 'Wat Is een Minnelijke Schikking?', 'content', '<p>Een minnelijke schikking is een <strong>voorstel van het parket</strong> om een boete te betalen in ruil voor het laten vallen van verdere vervolging. Als je betaalt, krijg je geen strafblad.</p>')
    ),
    'faq', jsonb_build_array(
      jsonb_build_object('question', 'Hoeveel boete voor wiet?', 'answer', 'Eerste overtreding met klein bezit: meestal €75-150 minnelijke schikking.'),
      jsonb_build_object('question', 'Krijg ik een strafblad?', 'answer', 'Bij een minnelijke schikking niet. Alleen bij veroordeling door de rechter.')
    )
  ),
  'article',
  true,
  now()
) ON CONFLICT (slug) DO UPDATE SET content = EXCLUDED.content, last_updated = now();

-- 15. Straf Wiet België
INSERT INTO seo_content_pages (slug, title, h1_title, meta_description, meta_keywords, content, page_type, is_published, last_updated)
VALUES (
  'straf-wiet-belgie',
  'Straf voor Wiet in België: Van Boete tot Gevangenis | Wietforum',
  'Welke Straf Krijg Je voor Wiet in België?',
  'Overzicht van alle straffen voor wiet in België. Van waarschuwing tot gevangenisstraf. Wat kun je verwachten bij bezit, teelt of verkoop?',
  ARRAY['straf wiet belgie', 'strafmaat cannabis', 'gevangenisstraf wiet', 'wiet straf'],
  jsonb_build_object(
    'sections', jsonb_build_array(
      jsonb_build_object('heading', 'Straffen voor Wiet: Overzicht', 'content', '<p>De straf voor wiet in België hangt af van meerdere factoren: hoeveelheid, doel (eigen gebruik of verkoop), eerdere veroordelingen en verzwarende omstandigheden.</p>'),
      jsonb_build_object('heading', 'Strafschaal per Overtreding', 'content', '<p><strong>Bezit voor eigen gebruik (tot 3 gram):</strong></p><ul><li>Eerste keer: Meestal geen straf, PV of minnelijke schikking</li><li>Herhaling: Minnelijke schikking €150-250</li></ul><p><strong>Teelt (1 plant, eigen gebruik):</strong></p><ul><li>Gedoogd indien geen overlast</li><li>Plant wordt in beslag genomen</li></ul><p><strong>Teelt (meerdere planten):</strong></p><ul><li>Boetes €1.000-100.000</li><li>Gevangenisstraf 3 maanden - 5 jaar</li></ul><p><strong>Verkoop/handel:</strong></p><ul><li>Gevangenisstraf 1-5 jaar</li><li>Boetes tot €100.000</li></ul><p><strong>Georganiseerde handel:</strong></p><ul><li>Gevangenisstraf 10-15 jaar mogelijk</li></ul>')
    ),
    'faq', jsonb_build_array(
      jsonb_build_object('question', 'Wat is de maximale straf voor wiet?', 'answer', 'Wettelijk tot 5 jaar gevangenis voor bezit, tot 15 jaar bij handel met verzwarende omstandigheden.'),
      jsonb_build_object('question', 'Krijg je altijd straf voor wiet?', 'answer', 'Nee, bij klein bezit voor eigen gebruik wordt meestal niet gestraft dankzij het gedoogbeleid.')
    )
  ),
  'article',
  true,
  now()
) ON CONFLICT (slug) DO UPDATE SET content = EXCLUDED.content, last_updated = now();

-- 16. Minnelijke Schikking Drugs
INSERT INTO seo_content_pages (slug, title, h1_title, meta_description, meta_keywords, content, page_type, is_published, last_updated)
VALUES (
  'minnelijke-schikking-drugs',
  'Minnelijke Schikking Drugs: Wat Is Het & Moet Je Betalen? | Wietforum',
  'Minnelijke Schikking bij Drugs: Uitleg & Advies',
  'Wat is een minnelijke schikking voor drugs? Moet je betalen? Krijg je een strafblad? Alle vragen beantwoord.',
  ARRAY['minnelijke schikking drugs', 'minnelijke schikking wiet', 'schikking cannabis', 'moet ik betalen'],
  jsonb_build_object(
    'sections', jsonb_build_array(
      jsonb_build_object('heading', 'Wat Is een Minnelijke Schikking?', 'content', '<p>Een minnelijke schikking is een <strong>voorstel van het Openbaar Ministerie</strong> (parket) om een geldbedrag te betalen. Als je betaalt, wordt de zaak geseponeerd en kom je niet voor de rechter.</p><p>Het is geen schulderkenning en je krijgt <strong>geen strafblad</strong>.</p>'),
      jsonb_build_object('heading', 'Bedragen voor Drugsschikkingen', 'content', '<p><strong>Cannabis - eerste overtreding:</strong> €75-150</p><p><strong>Cannabis - herhaling:</strong> €150-250</p><p><strong>Grotere hoeveelheden:</strong> €250-500+</p>'),
      jsonb_build_object('heading', 'Moet Je Betalen?', 'content', '<p>Je bent <strong>niet verplicht</strong> om een minnelijke schikking te aanvaarden. Als je niet betaalt:</p><ul><li>De zaak kan worden geseponeerd (vaak bij kleine overtredingen)</li><li>Of je wordt gedagvaard voor de rechtbank</li></ul><p>Bij kleine hoeveelheden wiet voor eigen gebruik wordt vaak alsnog geseponeerd als je niet betaalt.</p>'),
      jsonb_build_object('heading', 'Advies', 'content', '<p>Bij een kleine overtreding (eerste keer, klein bezit) is betalen vaak de makkelijkste optie. Bij twijfel: raadpleeg een advocaat voordat je beslist.</p>')
    ),
    'faq', jsonb_build_array(
      jsonb_build_object('question', 'Krijg je een strafblad bij minnelijke schikking?', 'answer', 'Nee, bij betaling van een minnelijke schikking krijg je geen strafblad.'),
      jsonb_build_object('question', 'Moet je een minnelijke schikking betalen?', 'answer', 'Nee, het is een voorstel. Je kunt weigeren, maar dan kan de zaak naar de rechtbank gaan.')
    )
  ),
  'article',
  true,
  now()
) ON CONFLICT (slug) DO UPDATE SET content = EXCLUDED.content, last_updated = now();

-- =====================================================
-- COMPLETION MESSAGE
-- =====================================================

DO $$
BEGIN
  RAISE NOTICE 'TIER 1 Wetgeving paginas succesvol aangemaakt/bijgewerkt';
  RAISE NOTICE 'Totaal: 16 paginas in deze migration';
END $$;

