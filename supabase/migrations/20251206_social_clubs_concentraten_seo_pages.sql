-- =====================================================
-- CANNABIS SOCIAL CLUBS & CONCENTRATEN SEO PAGINA'S
-- Trending topics en geavanceerde verwerking
-- =====================================================

-- =====================================================
-- SECTIE 1: CANNABIS SOCIAL CLUBS (11 pagina's)
-- =====================================================

-- 1. Cannabis Social Club België
INSERT INTO seo_content_pages (slug, title, h1_title, meta_description, meta_keywords, content, page_type, is_published, last_updated)
VALUES (
  'cannabis-social-club-belgie',
  'Cannabis Social Club België: Alles Wat Je Moet Weten | Wietforum',
  'Cannabis Social Clubs in België',
  'Wat zijn Cannabis Social Clubs? Bestaan ze in België? Status, mogelijkheden en vergelijking met buitenland.',
  ARRAY['cannabis social club belgie', 'cannabis club belgie', 'wietclub', 'csc belgie'],
  jsonb_build_object(
    'sections', jsonb_build_array(
      jsonb_build_object('heading', 'Wat Is een Cannabis Social Club?', 'content', '<p>Een Cannabis Social Club (CSC) is een <strong>besloten vereniging</strong> waar leden gezamenlijk cannabis telen voor eigen gebruik. Het model is populair in Spanje en wordt nu ingevoerd in Duitsland.</p>'),
      jsonb_build_object('heading', 'Status in België', 'content', '<p><strong>Momenteel:</strong> Cannabis Social Clubs zijn <strong>niet legaal</strong> in België. Er bestaat geen wettelijk kader zoals in Spanje of het nieuwe Duitse model.</p><p>Enkele initiatieven hebben geprobeerd CSC''s op te richten, maar dit gebeurt in een juridisch grijs gebied.</p>'),
      jsonb_build_object('heading', 'Het Spaanse Model', 'content', '<p>In Spanje functioneren CSC''s door:</p><ul><li>Besloten lidmaatschap (geen verkoop aan publiek)</li><li>Non-profit structuur</li><li>Teelt alleen voor leden</li><li>Geen reclame of publieke aanwezigheid</li></ul>'),
      jsonb_build_object('heading', 'Duitsland 2024', 'content', '<p>Duitsland heeft in 2024 Cannabis Social Clubs gelegaliseerd. Dit model wordt nauwlettend gevolgd door Belgische politici en activisten.</p>'),
      jsonb_build_object('heading', 'De Toekomst', 'content', '<p>Er zijn signalen dat België de ontwikkelingen in Duitsland volgt. Houd onze nieuwssectie in de gaten voor updates.</p>')
    ),
    'faq', jsonb_build_array(
      jsonb_build_object('question', 'Zijn Cannabis Social Clubs legaal in België?', 'answer', 'Nee, momenteel is er geen wettelijk kader voor CSC''s in België.'),
      jsonb_build_object('question', 'Komt er legalisatie zoals in Duitsland?', 'answer', 'Mogelijk. Politieke discussie is gaande, maar er is nog geen concrete wetgeving.')
    )
  ),
  'pillar',
  true,
  now()
) ON CONFLICT (slug) DO UPDATE SET content = EXCLUDED.content, last_updated = now();

-- 2. Cannabis Club Oprichten
INSERT INTO seo_content_pages (slug, title, h1_title, meta_description, meta_keywords, content, page_type, is_published, last_updated)
VALUES (
  'cannabis-club-oprichten',
  'Cannabis Club Oprichten in België: Is Het Mogelijk? | Wietforum',
  'Een Cannabis Club Oprichten',
  'Kun je een cannabis club oprichten in België? Juridische status, risico''s en alternatieven.',
  ARRAY['cannabis club oprichten', 'wietclub starten', 'csc oprichten', 'cannabis vereniging'],
  jsonb_build_object(
    'sections', jsonb_build_array(
      jsonb_build_object('heading', 'Kan Het Legaal?', 'content', '<p><strong>Kort antwoord: Nee.</strong> In België is er geen wettelijk kader voor Cannabis Social Clubs. Het oprichten ervan bevindt zich in een juridisch grijs gebied en brengt risico''s met zich mee.</p>'),
      jsonb_build_object('heading', 'Juridische Risico''s', 'content', '<ul><li><strong>Collectieve teelt</strong> is strafbaar (meerdere planten)</li><li><strong>Verstrekking</strong> aan anderen kan als dealen gezien worden</li><li><strong>Verenigingsstructuur</strong> beschermt niet tegen vervolging</li></ul>'),
      jsonb_build_object('heading', 'Wat Sommigen Doen', 'content', '<p>Enkele groepen opereren als "studiekring" of "belangenvereniging" zonder actieve teelt. Dit is legaal zolang er geen cannabis wordt geteeld of verstrekt.</p>'),
      jsonb_build_object('heading', 'Alternatieven', 'content', '<ul><li>Volg de politieke ontwikkelingen</li><li>Sluit je aan bij belangenorganisaties</li><li>Individuele kweek (1 plant regel)</li><li>Wacht op wetgeving</li></ul>')
    ),
    'faq', jsonb_build_array(
      jsonb_build_object('question', 'Kan ik een VZW oprichten rond cannabis?', 'answer', 'Een belangenvereniging is legaal. Actieve teelt of verstrekking niet.'),
      jsonb_build_object('question', 'Wat zijn de straffen als het misgaat?', 'answer', 'Collectieve teelt kan leiden tot zware straffen voor drugshandel, zelfs als non-profit.')
    )
  ),
  'article',
  true,
  now()
) ON CONFLICT (slug) DO UPDATE SET content = EXCLUDED.content, last_updated = now();

-- 3. Cannabis Club Legaal
INSERT INTO seo_content_pages (slug, title, h1_title, meta_description, meta_keywords, content, page_type, is_published, last_updated)
VALUES (
  'cannabis-club-legaal',
  'Zijn Cannabis Clubs Legaal? Per Land Uitgelegd | Wietforum',
  'Waar Zijn Cannabis Clubs Legaal?',
  'In welke landen zijn Cannabis Social Clubs legaal? Spanje, Duitsland, België en meer vergeleken.',
  ARRAY['cannabis club legaal', 'csc legaal', 'waar legaal cannabis club', 'legalisatie clubs'],
  jsonb_build_object(
    'sections', jsonb_build_array(
      jsonb_build_object('heading', 'Legale Status per Land', 'content', '<p><strong>Legaal met regulering:</strong></p><ul><li>🇩🇪 Duitsland (2024)</li><li>🇪🇸 Spanje (regionale tolerantie)</li><li>🇲🇹 Malta (2021)</li></ul><p><strong>Illegaal:</strong></p><ul><li>🇧🇪 België</li><li>🇫🇷 Frankrijk</li><li>🇳🇱 Nederland (paradoxaal)</li></ul>'),
      jsonb_build_object('heading', 'Spanje Model', 'content', '<p>Spanje heeft geen nationale wetgeving, maar regionale <strong>tolerantie</strong>. CSC''s opereren in een grijs gebied, getolereerd in Catalonië en andere regio''s.</p>'),
      jsonb_build_object('heading', 'Duitsland Model (2024)', 'content', '<p>Duitsland heeft CSC''s <strong>volledig gelegaliseerd</strong>:</p><ul><li>Max 500 leden per club</li><li>Max 25 gram/dag per lid</li><li>Geen winst, besloten lidmaatschap</li><li>Strenge regulering en controle</li></ul>'),
      jsonb_build_object('heading', 'België Toekomst', 'content', '<p>Belgische politici volgen Duitsland nauwlettend. Er zijn voorstellen gedaan, maar nog geen concrete wetgeving.</p>')
    ),
    'faq', jsonb_build_array(
      jsonb_build_object('question', 'Kunnen Belgen lid worden van een Spaanse club?', 'answer', 'Sommige Spaanse clubs accepteren toeristen, maar dit is controversieel en hangt af van de club.'),
      jsonb_build_object('question', 'Komt legalisatie naar België?', 'answer', 'Mogelijk, maar er is geen concrete tijdlijn. Volg het nieuws voor updates.')
    )
  ),
  'article',
  true,
  now()
) ON CONFLICT (slug) DO UPDATE SET content = EXCLUDED.content, last_updated = now();

-- 4. Cannabis Duitsland Legaal
INSERT INTO seo_content_pages (slug, title, h1_title, meta_description, meta_keywords, content, page_type, is_published, last_updated)
VALUES (
  'cannabis-duitsland-legaal',
  'Cannabis Legaal in Duitsland: Wat Betekent Dit? | Wietforum',
  'Cannabis Legalisatie Duitsland',
  'Duitsland heeft cannabis gelegaliseerd. Wat zijn de regels? En wat betekent dit voor België?',
  ARRAY['cannabis duitsland legaal', 'duitsland wiet', 'legalisatie duitsland', 'german cannabis'],
  jsonb_build_object(
    'sections', jsonb_build_array(
      jsonb_build_object('heading', 'De Nieuwe Duitse Wet (2024)', 'content', '<p>Vanaf april 2024 is cannabis <strong>gedeeltelijk gelegaliseerd</strong> in Duitsland:</p><ul><li>Bezit tot 25 gram toegestaan</li><li>Thuisteelt: max 3 planten</li><li>Cannabis Social Clubs toegestaan</li><li>Verkoop via apotheken (toekomst)</li></ul>'),
      jsonb_build_object('heading', 'Wat Mag Wel', 'content', '<ul><li>25 gram bezit (buitenshuis)</li><li>50 gram thuis</li><li>3 planten thuis kweken</li><li>Lid worden van een Cannabis Social Club</li></ul>'),
      jsonb_build_object('heading', 'Wat Mag Niet', 'content', '<ul><li>Verkoop aan individuen</li><li>Roken nabij scholen, speeltuinen</li><li>Rijden onder invloed</li><li>Export naar andere landen</li></ul>'),
      jsonb_build_object('heading', 'Impact voor België', 'content', '<p>De Duitse legalisatie zet <strong>druk op België</strong>:</p><ul><li>Politiek debat intensiveert</li><li>Grensproblematiek (Belgische recreanten)</li><li>Mogelijke beleidswijziging</li></ul>')
    ),
    'faq', jsonb_build_array(
      jsonb_build_object('question', 'Mag ik naar Duitsland voor wiet?', 'answer', 'Je kunt er legaal bezitten, maar NIET terugbrengen naar België. Dat is import/smokkelen.'),
      jsonb_build_object('question', 'Volgt België het Duitse model?', 'answer', 'Mogelijk op termijn. De politieke discussie is gestart, maar er is nog geen concrete wetgeving.')
    )
  ),
  'article',
  true,
  now()
) ON CONFLICT (slug) DO UPDATE SET content = EXCLUDED.content, last_updated = now();

-- =====================================================
-- SECTIE 2: CONCENTRATEN MAKEN (8 pagina's)
-- =====================================================

-- 5. Hasj Maken
INSERT INTO seo_content_pages (slug, title, h1_title, meta_description, meta_keywords, content, page_type, is_published, last_updated)
VALUES (
  'hasj-maken',
  'Hasj Maken: Complete Handleiding | Wietforum',
  'Hoe Maak Je Hasj?',
  'Leer zelf hasj maken. Dry sift, bubble hash, hand-rolled. Stap-voor-stap methodes uitgelegd.',
  ARRAY['hasj maken', 'hash maken', 'zelf hasj', 'hoe hasj maken'],
  jsonb_build_object(
    'sections', jsonb_build_array(
      jsonb_build_object('heading', 'Wat Is Hasj?', 'content', '<p>Hasj is <strong>geconcentreerde trichomen</strong> (harsklieren) van de cannabis plant, geperst of verwerkt tot een vaste substantie. Het bevat hogere concentraties THC dan bloemen.</p>'),
      jsonb_build_object('heading', 'Methode 1: Dry Sift', 'content', '<p>De eenvoudigste methode:</p><ol><li>Vries gedroogde wiet/trim in (maakt trichomen bros)</li><li>Zeef over fijnmazig gaas (100-200 micron)</li><li>Schud/wrijf het materiaal over de zeef</li><li>Verzamel het poeder (kief) dat erdoor valt</li><li>Pers met warmte tot hasj</li></ol>'),
      jsonb_build_object('heading', 'Methode 2: Bubble Hash', 'content', '<p>Met water en ijs:</p><ol><li>Vul emmer met ijswater en wiet/trim</li><li>Roer 15-20 minuten</li><li>Giet door bubble bags (verschillende micron)</li><li>Verzamel de residu van elke bag</li><li>Droog en pers</li></ol><p>Dit levert hogere kwaliteit dan dry sift.</p>'),
      jsonb_build_object('heading', 'Persen', 'content', '<p>Om kief tot hasj te persen:</p><ul><li>Wikkel in perkamentpapier</li><li>Warm op (met fles heet water of strijkijzer)</li><li>Pers stevig</li><li>Herhaal warmte + druk</li></ul>')
    ),
    'faq', jsonb_build_array(
      jsonb_build_object('question', 'Hoeveel hasj krijg ik uit wiet?', 'answer', 'Typisch 10-20% van het drooggewicht, afhankelijk van kwaliteit en methode.'),
      jsonb_build_object('question', 'Wat zijn bubble bags?', 'answer', 'Speciale zakken met gaas van verschillende micronmaten om hasj van verschillende kwaliteit te scheiden.')
    )
  ),
  'article',
  true,
  now()
) ON CONFLICT (slug) DO UPDATE SET content = EXCLUDED.content, last_updated = now();

-- 6. Bubble Hash Maken
INSERT INTO seo_content_pages (slug, title, h1_title, meta_description, meta_keywords, content, page_type, is_published, last_updated)
VALUES (
  'bubble-hash-maken',
  'Bubble Hash Maken: IJswater Extractie | Wietforum',
  'Bubble Hash Maken',
  'Leer bubble hash maken met ijswater. De beste solventless extractie methode voor thuis.',
  ARRAY['bubble hash maken', 'ice water hash', 'ijswater hasj', 'bubble bags'],
  jsonb_build_object(
    'sections', jsonb_build_array(
      jsonb_build_object('heading', 'Wat Is Bubble Hash?', 'content', '<p>Bubble hash is hasj gemaakt met <strong>ijswater extractie</strong>. De kou maakt trichomen bros, het water scheidt ze van het plantmateriaal. Het heet "bubble" omdat kwaliteitshash bubbelt als je het aansteekt.</p>'),
      jsonb_build_object('heading', 'Benodigdheden', 'content', '<ul><li>Bubble bags set (5-8 zakken, 25-220 micron)</li><li>2 emmers (20L)</li><li>Veel ijs</li><li>Koud water</li><li>Mixstaaf of lepel</li><li>Cannabis trim of buds</li></ul>'),
      jsonb_build_object('heading', 'Stap-voor-Stap', 'content', '<ol><li>Leg bubble bags in emmer (kleinste micron onderaan)</li><li>Voeg bevroren wiet, ijs en koud water toe</li><li>Roer 15-20 minuten (niet te agressief)</li><li>Laat 15 min bezinken</li><li>Til bags één voor één op</li><li>Schraap hash van elke bag</li><li>Droog minimaal 1 week</li></ol>'),
      jsonb_build_object('heading', 'Kwaliteitsgraden', 'content', '<p><strong>73-90 micron:</strong> Full melt, hoogste kwaliteit</p><p><strong>90-120 micron:</strong> Excellent</p><p><strong>120-160 micron:</strong> Goede kwaliteit</p><p><strong>160-220 micron:</strong> Meer plantmateriaal</p>'),
      jsonb_build_object('heading', 'Drogen', 'content', '<p>KRITISCH: droog je hash goed!</p><ul><li>Spreid uit op karton</li><li>Verkruimel groot materiaal</li><li>Droog koel en donker</li><li>Minimaal 1 week, liever 2</li><li>Vochtige hash beschimmelt!</li></ul>')
    ),
    'faq', jsonb_build_array(
      jsonb_build_object('question', 'Wat is "full melt"?', 'answer', 'Full melt hash is zo puur dat het volledig smelt/verdampt zonder residu. De hoogste kwaliteit.'),
      jsonb_build_object('question', 'Kan ik bubble hash roken?', 'answer', 'Ja, in een joint, pijp, bong of verdampen. Verkruimel het voor gelijkmatige verdeling.')
    )
  ),
  'article',
  true,
  now()
) ON CONFLICT (slug) DO UPDATE SET content = EXCLUDED.content, last_updated = now();

-- 7. Rosin Maken
INSERT INTO seo_content_pages (slug, title, h1_title, meta_description, meta_keywords, content, page_type, is_published, last_updated)
VALUES (
  'rosin-maken',
  'Rosin Maken: Solventless Concentraat | Wietforum',
  'Rosin Maken Thuis',
  'Maak rosin met alleen warmte en druk. De veiligste manier om concentraat thuis te maken.',
  ARRAY['rosin maken', 'rosin press', 'solventless dabs', 'rosin techniek'],
  jsonb_build_object(
    'sections', jsonb_build_array(
      jsonb_build_object('heading', 'Wat Is Rosin?', 'content', '<p>Rosin is een <strong>solventless concentraat</strong> gemaakt met alleen warmte en druk. Geen chemische oplosmiddelen nodig, dus veilig om thuis te maken.</p>'),
      jsonb_build_object('heading', 'Waarom Rosin?', 'content', '<ul><li><strong>Veilig:</strong> Geen ontvlambare oplosmiddelen</li><li><strong>Puur:</strong> Geen residuen</li><li><strong>Snel:</strong> Direct klaar</li><li><strong>Kwaliteit:</strong> Behoudt terpenen</li></ul>'),
      jsonb_build_object('heading', 'DIY Methode (Strijkijzer)', 'content', '<ol><li>Stel strijkijzer in op 80-100°C</li><li>Wikkel bud in perkamentpapier</li><li>Pers 3-7 seconden met strijkijzer</li><li>Open papier, schraap rosin eraf</li><li>Herhaal met dezelfde bud</li></ol>'),
      jsonb_build_object('heading', 'Rosin Press', 'content', '<p>Voor serieuze productie is een <strong>rosin press</strong> beter:</p><ul><li>Consistente temperatuur en druk</li><li>Hogere opbrengst</li><li>Prijzen vanaf €200-2000+</li></ul>'),
      jsonb_build_object('heading', 'Tips', 'content', '<ul><li>Gebruik kwaliteitswiet (garbage in = garbage out)</li><li>Verse, licht vochtige buds werken beter</li><li>Experimenteer met temperatuur</li><li>Lagere temp = meer terpenen, minder yield</li></ul>')
    ),
    'faq', jsonb_build_array(
      jsonb_build_object('question', 'Hoeveel rosin krijg ik uit wiet?', 'answer', 'Typisch 15-25% van het gewicht bij kwaliteitswiet.'),
      jsonb_build_object('question', 'Kan ik rosin van hash maken?', 'answer', 'Ja! Hash rosin is premium kwaliteit. Gebruik een rosin bag.')
    )
  ),
  'article',
  true,
  now()
) ON CONFLICT (slug) DO UPDATE SET content = EXCLUDED.content, last_updated = now();

-- 8. Cannabis Olie Maken
INSERT INTO seo_content_pages (slug, title, h1_title, meta_description, meta_keywords, content, page_type, is_published, last_updated)
VALUES (
  'cannabis-olie-maken',
  'Cannabis Olie Maken (RSO/FECO) | Wietforum',
  'Cannabis Olie Maken',
  'Hoe maak je cannabis olie (RSO)? Rick Simpson Oil methode uitgelegd. Let op: dit is gevaarlijk!',
  ARRAY['cannabis olie maken', 'rso olie', 'rick simpson oil', 'feco maken'],
  jsonb_build_object(
    'sections', jsonb_build_array(
      jsonb_build_object('heading', 'Wat Is RSO/FECO?', 'content', '<p><strong>RSO</strong> (Rick Simpson Oil) of <strong>FECO</strong> (Full Extract Cannabis Oil) is een geconcentreerde cannabis olie gemaakt met een oplosmiddel zoals ethanol.</p><p><strong>⚠️ WAARSCHUWING:</strong> Dit proces is GEVAARLIJK door ontvlambare oplosmiddelen!</p>'),
      jsonb_build_object('heading', 'Veiligheidsrisico''s', 'content', '<ul><li><strong>Brand/explosiegevaar:</strong> Ethanol en andere oplosmiddelen zijn zeer ontvlambaar</li><li><strong>Giftige dampen:</strong> Goede ventilatie ESSENTIEEL</li><li><strong>Residuen:</strong> Bij slechte uitvoering kunnen oplosmiddelen achterblijven</li></ul><p>Doe dit ALLEEN buiten met goede ventilatie!</p>'),
      jsonb_build_object('heading', 'Basis Methode', 'content', '<ol><li>Week gedecarboxyleerde wiet in food-grade ethanol</li><li>Filter plantmateriaal eruit</li><li>Verdamp de ethanol (buiten, geen vuur!)</li><li>Wat overblijft is de olie</li></ol><p><em>Gedetailleerde instructies bewust weggelaten vanwege veiligheidsrisico''s.</em></p>'),
      jsonb_build_object('heading', 'Alternatieven', 'content', '<p>Veiligere alternatieven:</p><ul><li><strong>Cannabutter:</strong> Geen oplosmiddelen</li><li><strong>Rosin:</strong> Alleen warmte en druk</li><li><strong>CBD olie kopen:</strong> Legaal en veilig</li></ul>')
    ),
    'faq', jsonb_build_array(
      jsonb_build_object('question', 'Is RSO maken legaal?', 'answer', 'Het maken van cannabis concentraten is illegaal in België, ongeacht de methode.'),
      jsonb_build_object('question', 'Is er een veilige manier?', 'answer', 'Rosin (warmte+druk) en bubble hash (water+ijs) zijn veel veiliger dan solvent extracties.')
    )
  ),
  'article',
  true,
  now()
) ON CONFLICT (slug) DO UPDATE SET content = EXCLUDED.content, last_updated = now();

-- 9. Kief Verzamelen
INSERT INTO seo_content_pages (slug, title, h1_title, meta_description, meta_keywords, content, page_type, is_published, last_updated)
VALUES (
  'kief-verzamelen',
  'Kief Verzamelen: Tips & Trucs | Wietforum',
  'Kief Verzamelen en Gebruiken',
  'Hoe verzamel je kief met je grinder? Tips om meer kief te krijgen en wat je ermee kunt doen.',
  ARRAY['kief verzamelen', 'kief grinder', 'trichomen opvangen', 'pollen catcher'],
  jsonb_build_object(
    'sections', jsonb_build_array(
      jsonb_build_object('heading', 'Wat Is Kief?', 'content', '<p>Kief zijn de <strong>losse trichomen</strong> die van je wiet vallen tijdens het malen. Het is eigenlijk mini-hasj: puur cannabinoïden en terpenen.</p>'),
      jsonb_build_object('heading', 'Meer Kief Verzamelen', 'content', '<p><strong>Tips:</strong></p><ul><li>Gebruik een 4-delige grinder met kief-opvang</li><li>Leg een muntje in het middelste compartiment</li><li>Schud je grinder na het malen</li><li>Vries je grinder periodiek in (maakt trichomen brozer)</li><li>Verzamel trimmings in de vriezer</li></ul>'),
      jsonb_build_object('heading', 'Wat Ermee Doen', 'content', '<ul><li><strong>Op joint/bowl:</strong> Strooi bovenop voor extra kick</li><li><strong>Moon rocks:</strong> Bud + olie + kief</li><li><strong>Edibles:</strong> Decarboxyleer en voeg toe</li><li><strong>Hash persen:</strong> Maak je eigen hasj</li><li><strong>Vapen:</strong> Voeg toe aan je vape</li></ul>'),
      jsonb_build_object('heading', 'Kief Persen tot Hash', 'content', '<ol><li>Verzamel voldoende kief (1-2 gram minimum)</li><li>Wikkel in perkamentpapier</li><li>Rol met fles gevuld met heet water</li><li>Pers en rol 5-10 minuten</li><li>Laat afkoelen: je hebt nu hasj!</li></ol>')
    ),
    'faq', jsonb_build_array(
      jsonb_build_object('question', 'Hoeveel kief krijg je per gram wiet?', 'answer', 'Hangt af van kwaliteit en strain, maar typisch 5-15% bouwt langzaam op in je grinder.'),
      jsonb_build_object('question', 'Is kief sterker dan wiet?', 'answer', 'Ja, significant. Kief kan 40-60% THC bevatten vs 15-25% bij bloemen.')
    )
  ),
  'article',
  true,
  now()
) ON CONFLICT (slug) DO UPDATE SET content = EXCLUDED.content, last_updated = now();

-- 10. Dab Wax Shatter
INSERT INTO seo_content_pages (slug, title, h1_title, meta_description, meta_keywords, content, page_type, is_published, last_updated)
VALUES (
  'dab-wax-shatter',
  'Dab, Wax, Shatter: Concentraten Uitgelegd | Wietforum',
  'Cannabis Concentraten: Soorten en Verschillen',
  'Wat zijn wax, shatter, budder, live resin? Alle cannabis concentraten uitgelegd.',
  ARRAY['dab wax', 'shatter', 'cannabis concentraat', 'wax vs shatter'],
  jsonb_build_object(
    'sections', jsonb_build_array(
      jsonb_build_object('heading', 'Concentraten Overzicht', 'content', '<p>Cannabis concentraten zijn <strong>geconcentreerde vormen</strong> van THC en andere cannabinoïden. Ze bevatten 60-90%+ THC, veel sterker dan bloemen.</p>'),
      jsonb_build_object('heading', 'Soorten Concentraten', 'content', '<p><strong>Shatter:</strong> Glasachtig, hard, doorschijnend. Breekt/versplintert.</p><p><strong>Wax:</strong> Zacht, wasachtig, ondoorzichtig. Makkelijk te hanteren.</p><p><strong>Budder:</strong> Romige textuur, geslagen wax. Zeer zacht.</p><p><strong>Crumble:</strong> Droog, kruimelig. Makkelijk te doseren.</p><p><strong>Live Resin:</strong> Gemaakt van verse plant, rijk aan terpenen.</p><p><strong>Rosin:</strong> Solventless, gemaakt met warmte en druk.</p>'),
      jsonb_build_object('heading', 'Hoe Gebruiken', 'content', '<p>Concentraten worden meestal <strong>gedabd</strong>:</p><ol><li>Verhit de nail/banger met torch</li><li>Laat afkoelen tot juiste temperatuur</li><li>Dab kleine hoeveelheid op oppervlak</li><li>Inhaleer de damp</li></ol><p>Je kunt ook toevoegen aan joints of vapen.</p>'),
      jsonb_build_object('heading', 'Waarschuwing', 'content', '<p><strong>Concentraten zijn ZEER sterk!</strong></p><ul><li>Start met minimale hoeveelheid (rijstkorrel)</li><li>Niet voor beginners</li><li>Tolerantie bouwt snel op</li><li>In België illegaal</li></ul>')
    ),
    'faq', jsonb_build_array(
      jsonb_build_object('question', 'Wat is het verschil tussen wax en shatter?', 'answer', 'Textuur. Shatter is glasachtig en hard, wax is zacht en wasachtig. Potentie is vergelijkbaar.'),
      jsonb_build_object('question', 'Kan ik concentraten zelf maken?', 'answer', 'Solventless (rosin, hash) kan thuis. BHO/PHO met oplosmiddelen is zeer gevaarlijk en afgeraden.')
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
  RAISE NOTICE 'Cannabis Social Clubs & Concentraten paginas succesvol aangemaakt';
  RAISE NOTICE 'Totaal: 10 paginas';
END $$;

