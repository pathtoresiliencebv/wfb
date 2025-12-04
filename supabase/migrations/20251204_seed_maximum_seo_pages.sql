-- =====================================================
-- MAXIMUM SEO COVERAGE - All Keywords & Locations
-- Generated: December 2024
-- Target: 500+ pages for complete Belgian cannabis market dominance
-- =====================================================

-- Update page_type to allow 'general' type
ALTER TABLE seo_content_pages 
DROP CONSTRAINT IF EXISTS seo_content_pages_page_type_check;

ALTER TABLE seo_content_pages 
ADD CONSTRAINT seo_content_pages_page_type_check 
CHECK (page_type IN ('pillar', 'province', 'city', 'article', 'general', 'faq', 'directory'));

-- =====================================================
-- PART 1: PILLAR PAGES (Hub Content)
-- =====================================================

-- 1. Cannabis Wetgeving België (Update existing)
INSERT INTO seo_content_pages (slug, title, h1_title, meta_description, meta_keywords, content, page_type, is_published, last_updated)
VALUES (
  'cannabis-wetgeving-belgie-2025',
  'Cannabis Wetgeving België 2025: Complete Gids | Wietforum',
  'Cannabis Wetgeving in België 2025: Alles Wat Je Moet Weten',
  'Is wiet legaal in België in 2025? Complete gids over de Belgische cannabis wetgeving, gedoogbeleid, bezit, thuisteelt en boetes. Actuele informatie.',
  ARRAY['cannabis wetgeving belgie', 'wiet wetgeving belgie', 'is wiet legaal belgie', 'gedoogbeleid belgie', 'cannabis bezit belgie', 'wiet kweken belgie'],
  jsonb_build_object(
    'sections', jsonb_build_array(
      jsonb_build_object('heading', 'Is cannabis legaal in België?', 'content', '<p>Het korte antwoord is <strong>nee</strong>, maar er geldt een <em>gedoogbeleid</em> onder strikte voorwaarden. Cannabis valt onder de Drugswet van 1921, maar sinds de ministeriële richtlijnen van 2003 en 2005 heeft persoonlijk bezit de laagste vervolgingsprioriteit.</p><p>Dit betekent <strong>niet</strong> dat het legaal is zoals in Canada of sommige Amerikaanse staten. Het betekent dat politie en justitie andere prioriteiten hebben, zolang je je aan bepaalde regels houdt.</p>'),
      jsonb_build_object('heading', 'De Gedoogregels: Wat Mag Wel en Niet?', 'content', '<p><strong>Gedoogd (laagste prioriteit):</strong></p><ul><li>Bezit van maximaal 3 gram cannabis</li><li>Eén vrouwelijke plant per volwassene (18+)</li><li>Geen overlast of openbaar gebruik</li><li>Geen aanwezigheid van minderjarigen</li></ul><p><strong>Niet gedoogd (vervolging):</strong></p><ul><li>Bezit van meer dan 3 gram</li><li>Meerdere planten</li><li>Verkoop of handel</li><li>Gebruik in het openbaar</li><li>Gebruik in aanwezigheid van minderjarigen</li><li>Rijden onder invloed</li></ul>'),
      jsonb_build_object('heading', 'De 1 Plant Regel Uitgelegd', 'content', '<p>De bekende "1 plant regel" is geen wet maar een <strong>vervolgingsrichtlijn</strong>. Als je aan alle voorwaarden voldoet (volwassen, geen overlast, niet verkopen), heeft vervolging de laagste prioriteit.</p><p><strong>Let op:</strong> Bij een politiecontrole wordt de plant meestal wel in beslag genomen en vernietigd, maar volgt er in de regel geen verdere vervolging.</p>'),
      jsonb_build_object('heading', 'Boetes en Straffen', 'content', '<p><strong>Bezit (tot 3 gram, eerste keer):</strong> Meestal PV zonder gevolg of minnelijke schikking (€75-150)</p><p><strong>Bezit (recidive of > 3 gram):</strong> Hogere boete, mogelijk dagvaarding</p><p><strong>Teelt (meerdere planten):</strong> Geldboete €1.000-100.000 en/of gevangenisstraf 3 maanden - 5 jaar</p><p><strong>Handel:</strong> Zwaardere straffen, tot 15 jaar bij verzwarende omstandigheden</p>'),
      jsonb_build_object('heading', 'Cannabis in het Verkeer', 'content', '<p>Er geldt een <strong>nultolerantie</strong> voor drugs in het verkeer. Bij een positieve speekseltest:</p><ul><li>Onmiddellijke intrekking rijbewijs (15 dagen)</li><li>Boete €1.600-16.000</li><li>Mogelijke rijverbod 1-5 jaar</li></ul><p>THC is tot 24-72 uur detecteerbaar in speeksel, afhankelijk van gebruik.</p>')
    ),
    'faq', jsonb_build_array(
      jsonb_build_object('question', 'Hoeveel gram wiet mag ik bij hebben in België?', 'answer', 'Maximaal 3 gram wordt gedoogd voor persoonlijk gebruik. Boven de 3 gram riskeert u vervolging.'),
      jsonb_build_object('question', 'Hoeveel wietplanten mag ik hebben?', 'answer', 'Eén vrouwelijke plant per volwassene wordt gedoogd, mits er geen overlast of verkoop plaatsvindt.'),
      jsonb_build_object('question', 'Wat is de boete voor wietbezit?', 'answer', 'Een eerste overtreding met minder dan 3 gram leidt meestal tot een minnelijke schikking van €75-150.'),
      jsonb_build_object('question', 'Hoelang is THC aantoonbaar in speeksel?', 'answer', 'THC is gemiddeld 24-72 uur detecteerbaar, bij zwaar gebruik soms langer.'),
      jsonb_build_object('question', 'Wordt wiet legaal in België in 2025?', 'answer', 'Er zijn voorlopig geen concrete plannen voor volledige legalisatie. Het gedoogbeleid blijft van kracht.')
    )
  ),
  'pillar',
  true,
  now()
) ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  h1_title = EXCLUDED.h1_title,
  meta_description = EXCLUDED.meta_description,
  meta_keywords = EXCLUDED.meta_keywords,
  content = EXCLUDED.content,
  last_updated = now();

-- 2. Medicinale Cannabis België
INSERT INTO seo_content_pages (slug, title, h1_title, meta_description, meta_keywords, content, page_type, is_published, last_updated)
VALUES (
  'medicinale-cannabis-belgie',
  'Medicinale Cannabis België: Complete Gids voor Patiënten | Wietforum',
  'Medicinale Cannabis in België: Alles voor Patiënten',
  'Hoe krijg je medicinale cannabis in België? Complete gids over cannabis op voorschrift, Sativex, magistrale bereidingen en welke dokters het voorschrijven.',
  ARRAY['medicinale cannabis belgie', 'medische cannabis belgie', 'cannabis op voorschrift', 'sativex belgie', 'dokter cannabis', 'medicinale wiet'],
  jsonb_build_object(
    'sections', jsonb_build_array(
      jsonb_build_object('heading', 'Status van Medicinale Cannabis in België', 'content', '<p>Medicinale cannabis is in België <strong>beperkt legaal</strong>. Er zijn twee erkende routes om cannabis als medicijn te verkrijgen:</p><ol><li><strong>Sativex</strong> - Een geregistreerd geneesmiddel (spray) voor MS-patiënten</li><li><strong>Magistrale bereiding</strong> - Cannabis bereid door apothekers op voorschrift</li></ol>'),
      jsonb_build_object('heading', 'Sativex: Het Enige Geregistreerde Cannabismedicijn', 'content', '<p>Sativex is een mondspray met THC en CBD, goedgekeurd voor spasticiteit bij multiple sclerose. <strong>Prijs:</strong> Ongeveer €400-500 per flesje (90 sprays). <strong>Terugbetaling:</strong> Niet standaard terugbetaald door mutualiteit.</p>'),
      jsonb_build_object('heading', 'Magistrale Bereiding: Cannabis uit de Apotheek', 'content', '<p>Sinds 2015 kunnen artsen cannabis voorschrijven dat door apothekers wordt bereid. Dit is een <strong>complex proces:</strong></p><ul><li>Vind een arts die bereid is voor te schrijven (weinig specialisten)</li><li>De arts schrijft een magistrale bereiding voor</li><li>Een gespecialiseerde apotheek bereidt het product</li><li>Kosten zijn hoog en niet terugbetaald</li></ul>'),
      jsonb_build_object('heading', 'Welke Aandoeningen Komen in Aanmerking?', 'content', '<p>Artsen schrijven medicinale cannabis vooral voor bij:</p><ul><li>Chronische pijn (neuropathische pijn)</li><li>Multiple sclerose (spasticiteit)</li><li>Misselijkheid bij chemotherapie</li><li>Epilepsie (bepaalde vormen)</li><li>Slaapstoornissen</li></ul>'),
      jsonb_build_object('heading', 'Hoe Vind Ik een Arts die Cannabis Voorschrijft?', 'content', '<p>Dit is het moeilijkste onderdeel. Tips:</p><ul><li>Vraag uw huisarts om doorverwijzing naar pijnkliniek</li><li>UZ Leuven heeft ervaring met cannabinoïden</li><li>Neurologen voor MS-patiënten</li><li>Op ons forum delen leden ervaringen met artsen</li></ul>')
    ),
    'faq', jsonb_build_array(
      jsonb_build_object('question', 'Wordt medicinale cannabis terugbetaald?', 'answer', 'Nee, momenteel is er geen terugbetaling door de mutualiteit voor medicinale cannabis in België.'),
      jsonb_build_object('question', 'Kan mijn huisarts cannabis voorschrijven?', 'answer', 'Ja, elke arts mag medicinale cannabis voorschrijven, maar de meeste huisartsen hebben geen ervaring hiermee.'),
      jsonb_build_object('question', 'Wat kost medicinale cannabis in België?', 'answer', 'De kosten variëren van €200-500 per maand, afhankelijk van de dosis en bereiding.')
    )
  ),
  'pillar',
  true,
  now()
) ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  content = EXCLUDED.content,
  last_updated = now();

-- 3. Buitenkweek Gids België
INSERT INTO seo_content_pages (slug, title, h1_title, meta_description, meta_keywords, content, page_type, is_published, last_updated)
VALUES (
  'buitenkweek-gids-belgie',
  'Buitenkweek Cannabis België: Complete Handleiding 2025 | Wietforum',
  'Cannabis Buitenkweek in België: De Complete Gids',
  'Alles over cannabis buitenkweek in het Belgische klimaat. Wanneer planten, beste strains, oogsten en juridische aspecten. Ervaring van Belgische kwekers.',
  ARRAY['buitenkweek cannabis', 'buitenkweek belgie', 'wiet buiten kweken', 'outdoor grow belgie', 'wanneer buiten planten', 'beste strains buitenkweek'],
  jsonb_build_object(
    'sections', jsonb_build_array(
      jsonb_build_object('heading', 'Cannabis Buitenkweek in het Belgische Klimaat', 'content', '<p>Het Belgische klimaat is <strong>uitdagend maar geschikt</strong> voor cannabis buitenkweek. Met de juiste kennis, timing en strains kun je uitstekende resultaten behalen.</p><p><strong>Voordelen:</strong> Gratis zonlicht, grotere planten, natuurlijke groei</p><p><strong>Uitdagingen:</strong> Korte zomer, vochtig weer, schimmelrisico</p>'),
      jsonb_build_object('heading', 'Kweekkalender België 2025', 'content', '<p><strong>Maart-April:</strong> Zaden kiemen binnen<br><strong>Mei (na IJsheiligen):</strong> Plantjes naar buiten<br><strong>Juni-Juli:</strong> Vegetatieve groei<br><strong>Augustus:</strong> Bloei begint (photoperiod)<br><strong>September-Oktober:</strong> Oogst</p><p>Autoflowers kunnen later geplant worden (tot half juni) door hun snellere cyclus.</p>'),
      jsonb_build_object('heading', 'Beste Strains voor België', 'content', '<p><strong>Aanbevolen voor beginners:</strong></p><ul><li>Northern Lights - Schimmelresistent, snel klaar</li><li>Early Skunk - Speciaal voor noordelijk klimaat</li><li>Frisian Dew - Purple/groene outdoor specialist</li></ul><p><strong>Autoflowers voor België:</strong></p><ul><li>Royal Queen Seeds Quick One</li><li>Dutch Passion Auto Ultimate</li><li>Fast Buds Gorilla Glue Auto</li></ul>'),
      jsonb_build_object('heading', 'Geur en Buren: Overlast Voorkomen', 'content', '<p>Geurbeheersing is cruciaal bij buitenkweek:</p><ul><li>Kies low-odor strains</li><li>Plant ver van buren</li><li>Gebruik natuurlijke camouflage (tomaten, lavendel)</li><li>Wees discreet - praat er niet over</li></ul><p><strong>Let op:</strong> Overlast is een van de weinige redenen waarom het gedoogbeleid niet geldt!</p>'),
      jsonb_build_object('heading', 'Juridische Aspecten Buitenkweek', 'content', '<p>De 1-plant regel geldt ook voor buitenkweek. <strong>Echter:</strong> buitenplanten zijn vaak zichtbaarder en kunnen klachten opleveren.</p><p>Tips: Kweek in de achtertuin, niet zichtbaar vanaf de straat. Vermijd dat buren kunnen klagen.</p>')
    ),
    'faq', jsonb_build_array(
      jsonb_build_object('question', 'Wanneer mag ik wiet buiten zetten in België?', 'answer', 'Na de IJsheiligen (half mei) wanneer er geen nachtvorst meer is. Autoflowers kunnen tot half juni.'),
      jsonb_build_object('question', 'Welke strains zijn het beste voor België?', 'answer', 'Northern Lights, Early Skunk en Frisian Dew zijn bewezen strains voor het Belgische klimaat.'),
      jsonb_build_object('question', 'Wanneer is de oogst bij buitenkweek?', 'answer', 'De meeste photoperiod strains zijn klaar eind september tot half oktober. Autoflowers 8-10 weken na kieming.')
    )
  ),
  'pillar',
  true,
  now()
) ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  content = EXCLUDED.content,
  last_updated = now();

-- 4. Cannabis Social Club België
INSERT INTO seo_content_pages (slug, title, h1_title, meta_description, meta_keywords, content, page_type, is_published, last_updated)
VALUES (
  'cannabis-social-club-belgie',
  'Cannabis Social Clubs België: Uitleg & Locaties | Wietforum',
  'Cannabis Social Clubs in België: Alles Wat Je Moet Weten',
  'Wat zijn cannabis social clubs? Zijn ze legaal in België? Vergelijking met Spanje en Duitsland. Actuele informatie en discussie op Wietforum.',
  ARRAY['cannabis social club belgie', 'cannabis club belgie', 'wietclub belgie', 'cannabis club antwerpen', 'cannabis club gent', 'cannabis club brussel'],
  jsonb_build_object(
    'sections', jsonb_build_array(
      jsonb_build_object('heading', 'Wat is een Cannabis Social Club?', 'content', '<p>Een Cannabis Social Club (CSC) is een <strong>niet-commerciële vereniging</strong> waar leden gezamenlijk cannabis telen voor eigen gebruik. Het model is bekend uit <strong>Spanje</strong> waar honderden clubs actief zijn.</p><p>Kernprincipes: non-profit, alleen leden, geen verkoop aan derden, collectieve teelt.</p>'),
      jsonb_build_object('heading', 'Zijn Cannabis Clubs Legaal in België?', 'content', '<p><strong>Momenteel niet.</strong> In België is er geen wettelijk kader voor cannabis social clubs. Initiatieven zijn er wel geweest (Trekt Uw Plant), maar deze opereren in een juridisch grijs gebied.</p><p>De Belgische wet maakt geen onderscheid tussen individuele en collectieve teelt - beide zijn technisch illegaal.</p>'),
      jsonb_build_object('heading', 'Het Spaanse Model', 'content', '<p>In Spanje functioneren CSC''s al jaren. Belangrijke elementen:</p><ul><li>Geregistreerd als culturele vereniging</li><li>Strikte ledenregistratie</li><li>Teelt alleen voor leden</li><li>Geen reclame, geen verkoop</li><li>Lokale tolerantie verschilt per regio</li></ul>'),
      jsonb_build_object('heading', 'Cannabis Clubs in Duitsland (2024)', 'content', '<p>Duitsland heeft in 2024 cannabis social clubs gelegaliseerd als onderdeel van hun legalisering. Dit opent mogelijkheden:</p><ul><li>Clubs tot 500 leden</li><li>Maximaal 50 gram/maand per lid</li><li>Strenge regels en vergunningen</li></ul><p>Dit Duitse model wordt door sommige Belgische politici bekeken als mogelijke inspiratie.</p>'),
      jsonb_build_object('heading', 'Toekomst in België?', 'content', '<p>Er zijn politieke partijen (Groen, Vooruit) die pleiten voor een CSC-model in België. Tot nu toe is er echter geen meerderheid voor legalisering.</p><p>Op ons forum houden we je op de hoogte van alle politieke ontwikkelingen.</p>')
    ),
    'faq', jsonb_build_array(
      jsonb_build_object('question', 'Zijn er cannabis clubs in België?', 'answer', 'Er zijn initiatieven geweest, maar deze opereren in een juridisch grijs gebied. Er is geen officieel legaal kader.'),
      jsonb_build_object('question', 'Kan ik lid worden van een cannabis club in Spanje?', 'answer', 'Ja, als toerist kun je vaak lid worden van een CSC in Barcelona of andere steden. Je hebt een sponsor (bestaand lid) nodig.'),
      jsonb_build_object('question', 'Komt er legalisering in België?', 'answer', 'Er is politieke discussie, maar voorlopig zijn er geen concrete plannen voor legalisering of CSC''s.')
    )
  ),
  'pillar',
  true,
  now()
) ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  content = EXCLUDED.content,
  last_updated = now();

-- 5. CBD Olie België
INSERT INTO seo_content_pages (slug, title, h1_title, meta_description, meta_keywords, content, page_type, is_published, last_updated)
VALUES (
  'cbd-olie-belgie',
  'CBD Olie Kopen in België: Complete Gids & Beste Shops | Wietforum',
  'CBD Olie in België: Waar Kopen & Wat Je Moet Weten',
  'Alles over CBD olie in België. Wetgeving, waar kopen (apotheek of webshop), beste merken en dosering. Onafhankelijke informatie.',
  ARRAY['cbd olie belgie', 'cbd olie kopen', 'beste cbd olie', 'cbd wetgeving belgie', 'cbd apotheek', 'cbd shop belgie'],
  jsonb_build_object(
    'sections', jsonb_build_array(
      jsonb_build_object('heading', 'Is CBD Legaal in België?', 'content', '<p><strong>Ja</strong>, CBD producten zijn legaal in België onder voorwaarden:</p><ul><li>Maximaal 0,2% THC</li><li>Afkomstig van goedgekeurde hennepvariëteiten</li><li>Als "novel food" geregistreerd (voor inname)</li></ul><p>Let op: niet alle CBD shops volgen deze regels. Koop bij betrouwbare bronnen.</p>'),
      jsonb_build_object('heading', 'Waar CBD Olie Kopen?', 'content', '<p><strong>Opties:</strong></p><ul><li><strong>Apotheek:</strong> Betrouwbaar, maar beperkt aanbod en duurder</li><li><strong>CBD Shops:</strong> Groter aanbod, wisselende kwaliteit</li><li><strong>Online:</strong> Grootste keuze, check reviews</li></ul><p>Wij raden aan om te kiezen voor merken met labanalyses (COA).</p>'),
      jsonb_build_object('heading', 'Hoe CBD Olie Gebruiken?', 'content', '<p><strong>Druppels onder de tong:</strong> Snelste opname (15-45 min)</p><p><strong>In eten/drinken:</strong> Langzamere opname (1-2 uur)</p><p><strong>Dosering:</strong> Start laag (5-10mg) en bouw langzaam op. Er is geen standaarddosis.</p>'),
      jsonb_build_object('heading', 'Full Spectrum vs Isolate', 'content', '<p><strong>Full Spectrum:</strong> Bevat alle cannabinoïden inclusief sporen THC (<0,2%). Mogelijk "entourage effect".</p><p><strong>Broad Spectrum:</strong> Meerdere cannabinoïden, maar THC verwijderd.</p><p><strong>Isolate:</strong> Puur CBD, geen andere cannabinoïden.</p>')
    ),
    'faq', jsonb_build_array(
      jsonb_build_object('question', 'Hoeveel kost CBD olie in België?', 'answer', 'Prijzen variëren van €20-100+ per flesje, afhankelijk van concentratie en merk.'),
      jsonb_build_object('question', 'Kan ik high worden van CBD olie?', 'answer', 'Nee, CBD is niet psychoactief. Legale CBD olie bevat max 0,2% THC wat geen effect heeft.'),
      jsonb_build_object('question', 'Is CBD olie gevaarlijk?', 'answer', 'CBD wordt over het algemeen goed verdragen. Bijwerkingen zijn zeldzaam en mild (vermoeidheid, droge mond).')
    )
  ),
  'pillar',
  true,
  now()
) ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  content = EXCLUDED.content,
  last_updated = now();

-- =====================================================
-- PART 2: ALLE VLAAMSE STEDEN (Uitgebreid)
-- =====================================================

DO $$
DECLARE
  cities TEXT[][] := ARRAY[
    -- Antwerpen Provincie [stad, provincie-slug]
    ARRAY['Antwerpen', 'antwerpen'],
    ARRAY['Mechelen', 'antwerpen'],
    ARRAY['Turnhout', 'antwerpen'],
    ARRAY['Mortsel', 'antwerpen'],
    ARRAY['Boom', 'antwerpen'],
    ARRAY['Herentals', 'antwerpen'],
    ARRAY['Mol', 'antwerpen'],
    ARRAY['Geel', 'antwerpen'],
    ARRAY['Lier', 'antwerpen'],
    ARRAY['Brasschaat', 'antwerpen'],
    ARRAY['Schoten', 'antwerpen'],
    ARRAY['Hoogstraten', 'antwerpen'],
    ARRAY['Kontich', 'antwerpen'],
    ARRAY['Arendonk', 'antwerpen'],
    ARRAY['Westerlo', 'antwerpen'],
    -- Oost-Vlaanderen
    ARRAY['Gent', 'oost-vlaanderen'],
    ARRAY['Aalst', 'oost-vlaanderen'],
    ARRAY['Sint-Niklaas', 'oost-vlaanderen'],
    ARRAY['Dendermonde', 'oost-vlaanderen'],
    ARRAY['Lokeren', 'oost-vlaanderen'],
    ARRAY['Wetteren', 'oost-vlaanderen'],
    ARRAY['Beveren', 'oost-vlaanderen'],
    ARRAY['Temse', 'oost-vlaanderen'],
    ARRAY['Eeklo', 'oost-vlaanderen'],
    ARRAY['Geraardsbergen', 'oost-vlaanderen'],
    ARRAY['Zottegem', 'oost-vlaanderen'],
    ARRAY['Deinze', 'oost-vlaanderen'],
    ARRAY['Ronse', 'oost-vlaanderen'],
    ARRAY['Ninove', 'oost-vlaanderen'],
    ARRAY['Zele', 'oost-vlaanderen'],
    -- West-Vlaanderen
    ARRAY['Brugge', 'west-vlaanderen'],
    ARRAY['Kortrijk', 'west-vlaanderen'],
    ARRAY['Oostende', 'west-vlaanderen'],
    ARRAY['Roeselare', 'west-vlaanderen'],
    ARRAY['Ieper', 'west-vlaanderen'],
    ARRAY['Waregem', 'west-vlaanderen'],
    ARRAY['Knokke-Heist', 'west-vlaanderen'],
    ARRAY['Blankenberge', 'west-vlaanderen'],
    ARRAY['De Panne', 'west-vlaanderen'],
    ARRAY['Menen', 'west-vlaanderen'],
    ARRAY['Izegem', 'west-vlaanderen'],
    ARRAY['Harelbeke', 'west-vlaanderen'],
    ARRAY['Torhout', 'west-vlaanderen'],
    ARRAY['Diksmuide', 'west-vlaanderen'],
    ARRAY['Poperinge', 'west-vlaanderen'],
    -- Vlaams-Brabant
    ARRAY['Leuven', 'vlaams-brabant'],
    ARRAY['Vilvoorde', 'vlaams-brabant'],
    ARRAY['Halle', 'vlaams-brabant'],
    ARRAY['Tienen', 'vlaams-brabant'],
    ARRAY['Aarschot', 'vlaams-brabant'],
    ARRAY['Diest', 'vlaams-brabant'],
    ARRAY['Zaventem', 'vlaams-brabant'],
    ARRAY['Tervuren', 'vlaams-brabant'],
    ARRAY['Overijse', 'vlaams-brabant'],
    ARRAY['Grimbergen', 'vlaams-brabant'],
    -- Limburg
    ARRAY['Hasselt', 'limburg'],
    ARRAY['Genk', 'limburg'],
    ARRAY['Tongeren', 'limburg'],
    ARRAY['Sint-Truiden', 'limburg'],
    ARRAY['Beringen', 'limburg'],
    ARRAY['Lommel', 'limburg'],
    ARRAY['Maasmechelen', 'limburg'],
    ARRAY['Bilzen', 'limburg'],
    ARRAY['Maaseik', 'limburg'],
    ARRAY['Bree', 'limburg'],
    ARRAY['Lanaken', 'limburg'],
    ARRAY['Leopoldsburg', 'limburg']
  ];
  city_data TEXT[];
  city_name TEXT;
  province TEXT;
  city_slug TEXT;
  full_slug TEXT;
BEGIN
  FOREACH city_data SLICE 1 IN ARRAY cities
  LOOP
    city_name := city_data[1];
    province := city_data[2];
    city_slug := lower(regexp_replace(city_name, '[^a-zA-Z0-9]+', '-', 'g'));
    full_slug := 'cannabis-belgie/' || province || '/' || city_slug;
    
    INSERT INTO seo_content_pages (
      slug, title, h1_title, meta_description, meta_keywords, 
      content, page_type, parent_slug, is_published, last_updated
    )
    VALUES (
      full_slug,
      'Cannabis & Wiet in ' || city_name || ' | Wietforum België',
      'Cannabis in ' || city_name || ': Informatie & Community',
      'Alles over cannabis in ' || city_name || '. Lokaal beleid, CBD shops, community discussies en ervaringen van inwoners uit ' || city_name || '.',
      ARRAY['wiet ' || lower(city_name), 'cannabis ' || lower(city_name), 'cbd shop ' || lower(city_name), 'wietforum ' || lower(city_name)],
      jsonb_build_object(
        'sections', jsonb_build_array(
          jsonb_build_object(
            'heading', 'Cannabis Situatie in ' || city_name,
            'content', '<p>Hoewel de landelijke wetgeving overal in België hetzelfde is, kan de <strong>lokale handhaving</strong> verschillen. In ' || city_name || ' volgt de politie over het algemeen de nationale gedoogrichtlijnen.</p><p>Op ons forum delen inwoners uit ' || city_name || ' hun ervaringen over de lokale situatie.</p>'
          ),
          jsonb_build_object(
            'heading', 'CBD Shops en Growshops in de Buurt',
            'content', '<p>In en rond ' || city_name || ' vind je verschillende legale CBD winkels waar je cannabisproducten met minder dan 0,2% THC kunt kopen.</p><p>Ook zijn er growshops waar je kweekbenodigdheden kunt aanschaffen - dit is volledig legaal.</p>'
          ),
          jsonb_build_object(
            'heading', 'Word Lid van de ' || city_name || ' Community',
            'content', '<p>Op Wietforum België kun je in contact komen met andere enthousiastelingen uit ' || city_name || ' en omgeving. Deel ervaringen, stel vragen en blijf op de hoogte van lokaal nieuws.</p>'
          )
        ),
        'faq', jsonb_build_array(
          jsonb_build_object('question', 'Zijn er coffeeshops in ' || city_name || '?', 'answer', 'Nee, er zijn geen coffeeshops in ' || city_name || ' of elders in België. Dit is illegaal.'),
          jsonb_build_object('question', 'Waar kan ik CBD kopen in ' || city_name || '?', 'answer', 'In de meeste steden zijn CBD shops en sommige apotheken verkopen ook CBD producten.')
        )
      ),
      'city',
      'cannabis-belgie/' || province,
      true,
      now()
    )
    ON CONFLICT (slug) DO UPDATE SET
      title = EXCLUDED.title,
      content = EXCLUDED.content,
      last_updated = now();
  END LOOP;
END $$;

-- =====================================================
-- PART 3: FAQ PAGINA'S (Featured Snippets Target)
-- =====================================================

-- FAQ: Is wiet legaal
INSERT INTO seo_content_pages (slug, title, h1_title, meta_description, meta_keywords, content, page_type, is_published)
VALUES (
  'is-wiet-legaal-belgie',
  'Is Wiet Legaal in België? Antwoord + Uitleg | Wietforum',
  'Is Wiet Legaal in België?',
  'Nee, wiet is niet legaal in België, maar er geldt een gedoogbeleid. Lees hier wat wel en niet mag en wat de regels zijn.',
  ARRAY['is wiet legaal belgie', 'is cannabis legaal', 'is wiet legaal', 'wiet gedoogd'],
  jsonb_build_object(
    'sections', jsonb_build_array(
      jsonb_build_object('heading', 'Het Korte Antwoord', 'content', '<p><strong>Nee</strong>, wiet is niet legaal in België. Echter, er geldt een <strong>gedoogbeleid</strong> waarbij persoonlijk bezit (max 3 gram) en bezit van 1 plant de laagste vervolgingsprioriteit heeft.</p>'),
      jsonb_build_object('heading', 'Wat Betekent Gedoogd?', 'content', '<p>Gedoogd betekent dat de overheid er niet actief tegen optreedt, maar het blijft technisch illegaal. Je kunt dus nog steeds worden gecontroleerd en je wiet kwijtraken.</p>')
    ),
    'faq', jsonb_build_array(
      jsonb_build_object('question', 'Is wiet legaal in België?', 'answer', 'Nee, maar er is een gedoogbeleid voor bezit tot 3 gram en 1 plant.'),
      jsonb_build_object('question', 'Kan ik een boete krijgen voor wietbezit?', 'answer', 'Ja, ook onder het gedoogbeleid kun je een boete (minnelijke schikking) krijgen.')
    )
  ),
  'faq',
  true
) ON CONFLICT (slug) DO UPDATE SET content = EXCLUDED.content;

-- FAQ: Hoeveel planten
INSERT INTO seo_content_pages (slug, title, h1_title, meta_description, meta_keywords, content, page_type, is_published)
VALUES (
  'hoeveel-wietplanten-belgie',
  'Hoeveel Wietplanten Mag Je Hebben in België? | Wietforum',
  'Hoeveel Wietplanten Mag Je Hebben?',
  'In België wordt 1 vrouwelijke wietplant per volwassene gedoogd. Lees de voorwaarden en risico''s.',
  ARRAY['hoeveel wietplanten', 'hoeveel planten mag je hebben', '1 plant belgie', 'wiet kweken belgie'],
  jsonb_build_object(
    'sections', jsonb_build_array(
      jsonb_build_object('heading', 'De 1 Plant Regel', 'content', '<p><strong>Eén vrouwelijke plant</strong> per volwassene (18+) wordt gedoogd onder voorwaarden: geen overlast, geen verkoop, niet zichtbaar voor minderjarigen.</p>')
    ),
    'faq', jsonb_build_array(
      jsonb_build_object('question', 'Hoeveel wietplanten mag je hebben in België?', 'answer', '1 vrouwelijke plant per volwassene wordt gedoogd.')
    )
  ),
  'faq',
  true
) ON CONFLICT (slug) DO UPDATE SET content = EXCLUDED.content;

-- FAQ: Speekseltest
INSERT INTO seo_content_pages (slug, title, h1_title, meta_description, meta_keywords, content, page_type, is_published)
VALUES (
  'speekseltest-wiet-hoelang',
  'Speekseltest Wiet: Hoelang Detecteerbaar? | Wietforum',
  'Speekseltest Wiet: Hoelang Blijft THC Detecteerbaar?',
  'THC is 24-72 uur detecteerbaar in speeksel. Bij zwaar gebruik soms langer. Lees alles over de speekseltest.',
  ARRAY['speekseltest wiet', 'speekseltest cannabis', 'hoelang thc speeksel', 'drugstest politie'],
  jsonb_build_object(
    'sections', jsonb_build_array(
      jsonb_build_object('heading', 'Detectietijd THC in Speeksel', 'content', '<p><strong>Gemiddeld:</strong> 24-72 uur na gebruik<br><strong>Incidenteel gebruik:</strong> 24 uur<br><strong>Regelmatig gebruik:</strong> Tot 72+ uur</p><p>De speekseltest (DrugWipe) meet de aanwezigheid van THC. Bij een positieve test volgt een bloedtest voor bevestiging.</p>')
    ),
    'faq', jsonb_build_array(
      jsonb_build_object('question', 'Hoelang is THC aantoonbaar in speeksel?', 'answer', 'Gemiddeld 24-72 uur, bij zwaar gebruik mogelijk langer.')
    )
  ),
  'faq',
  true
) ON CONFLICT (slug) DO UPDATE SET content = EXCLUDED.content;

-- =====================================================
-- PART 4: FORUM ZOEKWOORD PAGINA'S
-- =====================================================

DO $$
DECLARE
  forum_keywords TEXT[] := ARRAY[
    'wietforum', 'wiet forum', 'cannabis forum', 'cannabisforum',
    '420 forum', 'canna forum', 'cannaforum', 'ganja forum', 'ganjaforum',
    'weed forum', 'grow forum', 'growforum', 'kweek forum'
  ];
  keyword TEXT;
  slug TEXT;
BEGIN
  FOREACH keyword IN ARRAY forum_keywords
  LOOP
    slug := lower(regexp_replace(keyword, '[^a-zA-Z0-9]+', '-', 'g'));
    
    INSERT INTO seo_content_pages (
      slug, title, h1_title, meta_description, meta_keywords,
      content, page_type, is_published, last_updated
    )
    VALUES (
      slug,
      keyword || ' België - De Grootste Cannabis Community | WietForum.be',
      'Welkom op het ' || keyword || ' van België',
      'Het beste ' || keyword || ' van België. Word lid van duizenden enthousiastelingen. Discussies, kweektips, ervaringen en meer.',
      ARRAY[keyword, 'cannabis belgie', 'wiet belgie', keyword || ' belgie'],
      jsonb_build_object(
        'sections', jsonb_build_array(
          jsonb_build_object('heading', 'Het Grootste ' || keyword || ' van België', 'content', '<p>Welkom op <strong>WietForum.be</strong>, dé plek voor cannabis enthousiastelingen in België. Of je nu een ervaren kweker bent of gewoon geïnteresseerd in de cultuur - je bent hier aan het juiste adres.</p>'),
          jsonb_build_object('heading', 'Wat Vind Je Op Ons Forum?', 'content', '<ul><li>Kweekverslagen en tips van ervaren leden</li><li>Discussies over wetgeving en nieuws</li><li>Strain reviews en ervaringen</li><li>Vragen stellen aan de community</li><li>Lokale meetups en evenementen</li></ul>'),
          jsonb_build_object('heading', 'Word Vandaag Nog Lid', 'content', '<p>Registratie is <strong>100% gratis</strong> en anoniem. Word lid en krijg toegang tot alle secties van het forum.</p>')
        ),
        'faq', jsonb_build_array(
          jsonb_build_object('question', 'Is dit forum gratis?', 'answer', 'Ja, registratie en gebruik van WietForum.be is volledig gratis.'),
          jsonb_build_object('question', 'Is het anoniem?', 'answer', 'Ja, je hoeft alleen een gebruikersnaam en e-mail op te geven.')
        )
      ),
      'general',
      true,
      now()
    )
    ON CONFLICT (slug) DO UPDATE SET
      title = EXCLUDED.title,
      content = EXCLUDED.content,
      last_updated = now();
  END LOOP;
END $$;

-- =====================================================
-- PART 5: FORUM + LOCATIE COMBINATIES
-- =====================================================

DO $$
DECLARE
  forum_terms TEXT[] := ARRAY['wiet forum', 'cannabis forum', 'wietforum'];
  locations TEXT[] := ARRAY['antwerpen', 'gent', 'brussel', 'brugge', 'leuven', 'hasselt', 'kortrijk', 'oostende', 'mechelen', 'genk'];
  forum_term TEXT;
  location TEXT;
  slug TEXT;
  title_text TEXT;
BEGIN
  FOREACH forum_term IN ARRAY forum_terms
  LOOP
    FOREACH location IN ARRAY locations
    LOOP
      slug := lower(regexp_replace(forum_term || '-' || location, '[^a-zA-Z0-9]+', '-', 'g'));
      title_text := forum_term || ' ' || initcap(location);
      
      INSERT INTO seo_content_pages (
        slug, title, h1_title, meta_description, meta_keywords,
        content, page_type, is_published, last_updated
      )
      VALUES (
        slug,
        initcap(title_text) || ' - Cannabis Community | WietForum.be',
        initcap(title_text) || ': Lokale Cannabis Community',
        'Het beste ' || forum_term || ' voor ' || initcap(location) || '. Ontmoet andere enthousiastelingen uit ' || initcap(location) || ' en omgeving.',
        ARRAY[forum_term || ' ' || location, 'cannabis ' || location, 'wiet ' || location],
        jsonb_build_object(
          'sections', jsonb_build_array(
            jsonb_build_object('heading', 'Cannabis Community ' || initcap(location), 'content', '<p>Woon je in <strong>' || initcap(location) || '</strong> of omgeving? Op WietForum.be vind je andere enthousiastelingen uit jouw regio.</p>'),
            jsonb_build_object('heading', 'Lokale Discussies', 'content', '<p>Bespreek de lokale situatie, deel ervaringen en ontmoet gelijkgestemden uit ' || initcap(location) || '.</p>')
          )
        ),
        'city',
        true,
        now()
      )
      ON CONFLICT (slug) DO UPDATE SET
        content = EXCLUDED.content,
        last_updated = now();
    END LOOP;
  END LOOP;
END $$;

-- =====================================================
-- PART 6: KWEEK ARTIKELEN
-- =====================================================

-- Autoflower Artikel
INSERT INTO seo_content_pages (slug, title, h1_title, meta_description, meta_keywords, content, page_type, is_published)
VALUES (
  'autoflower-zaden-gids',
  'Autoflower Zaden: Complete Gids voor Beginners | Wietforum',
  'Autoflower Zaden: Alles Wat Je Moet Weten',
  'Wat zijn autoflower zaden? Voordelen, nadelen en beste autoflowers voor België. Complete gids voor beginners.',
  ARRAY['autoflower zaden', 'autoflower', 'beste autoflower', 'autoflower kweken'],
  jsonb_build_object(
    'sections', jsonb_build_array(
      jsonb_build_object('heading', 'Wat zijn Autoflowers?', 'content', '<p>Autoflower cannabis planten gaan <strong>automatisch bloeien</strong> na 2-4 weken, ongeacht de lichtcyclus. Dit in tegenstelling tot photoperiod planten die 12 uur duisternis nodig hebben om te bloeien.</p>'),
      jsonb_build_object('heading', 'Voordelen Autoflowers', 'content', '<ul><li>Snel klaar (8-10 weken totaal)</li><li>Klein en discreet</li><li>Ideaal voor beginners</li><li>Meerdere oogsten per seizoen</li></ul>'),
      jsonb_build_object('heading', 'Beste Autoflowers voor België', 'content', '<p><strong>Top picks:</strong></p><ul><li>Northern Lights Auto - Betrouwbaar en schimmelresistent</li><li>Gorilla Glue Auto - Hoge opbrengst</li><li>Girl Scout Cookies Auto - Grote smaak</li></ul>')
    )
  ),
  'article',
  true
) ON CONFLICT (slug) DO UPDATE SET content = EXCLUDED.content;

-- Wiet Drogen Artikel
INSERT INTO seo_content_pages (slug, title, h1_title, meta_description, meta_keywords, content, page_type, is_published)
VALUES (
  'wiet-drogen-gids',
  'Wiet Drogen: Complete Gids voor Perfecte Resultaten | Wietforum',
  'Wiet Drogen: Stap voor Stap naar Perfecte Buds',
  'Hoe droog je wiet correct? Complete handleiding voor het drogen en curen van cannabis. Tips voor optimale smaak en potentie.',
  ARRAY['wiet drogen', 'cannabis drogen', 'wiet curen', 'buds drogen'],
  jsonb_build_object(
    'sections', jsonb_build_array(
      jsonb_build_object('heading', 'Waarom Drogen Belangrijk Is', 'content', '<p>Correct drogen is <strong>cruciaal</strong> voor smaak, potentie en houdbaarheid. Nat geoogste wiet bevat 75-80% vocht - dit moet terug naar 10-15%.</p>'),
      jsonb_build_object('heading', 'De Droogomstandigheden', 'content', '<ul><li><strong>Temperatuur:</strong> 18-22°C</li><li><strong>Luchtvochtigheid:</strong> 45-55%</li><li><strong>Geen direct licht</strong></li><li><strong>Lichte luchtstroom</strong></li></ul>'),
      jsonb_build_object('heading', 'Methodes', 'content', '<p><strong>Hangen:</strong> Hang takken ondersteboven aan een lijn. Duurt 7-14 dagen.</p><p><strong>Droogrek:</strong> Voor losse buds. Keer regelmatig om.</p>'),
      jsonb_build_object('heading', 'Wanneer Is Het Klaar?', 'content', '<p>De wiet is klaar wanneer kleine takjes <strong>knapperig breken</strong> (niet buigen). De buds voelen droog aan de buitenkant maar nog iets sticky van binnen.</p>')
    )
  ),
  'article',
  true
) ON CONFLICT (slug) DO UPDATE SET content = EXCLUDED.content;

-- =====================================================
-- UPDATE SITEMAP REFERENTIE
-- =====================================================

-- Log completion
DO $$
BEGIN
  RAISE NOTICE 'SEO Maximum Coverage migration completed successfully';
  RAISE NOTICE 'Created/updated: Pillar pages, 70+ city pages, FAQ pages, forum keyword pages, and article content';
END $$;

