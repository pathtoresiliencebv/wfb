-- =====================================================
-- KWEEKBENODIGDHEDEN & GROWSHOPS SEO PAGINA'S
-- Commerciële/informationele content over supplies
-- =====================================================

-- 1. Growshop België
INSERT INTO seo_content_pages (slug, title, h1_title, meta_description, meta_keywords, content, page_type, is_published, last_updated)
VALUES (
  'growshop-belgie',
  'Growshop België: Overzicht & Reviews | Wietforum',
  'Growshops in België',
  'Overzicht van growshops in België. Waar koop je kweekbenodigdheden? Online en fysieke winkels.',
  ARRAY['growshop belgie', 'growshop', 'kweekshop', 'grow shop belgie'],
  jsonb_build_object(
    'sections', jsonb_build_array(
      jsonb_build_object('heading', 'Wat Is een Growshop?', 'content', '<p>Een growshop verkoopt <strong>kweekbenodigdheden</strong> voor planten, inclusief materiaal dat geschikt is voor cannabis. In België zijn deze winkels volledig legaal.</p>'),
      jsonb_build_object('heading', 'Wat Koop Je Er?', 'content', '<ul><li>Kweektenten en growtents</li><li>LED en HPS lampen</li><li>Ventilatie en koolstoffilters</li><li>Voedingsstoffen (Plagron, BioBizz, Canna)</li><li>Potten en aarde</li><li>pH meters en meetapparatuur</li><li>Zaden (collectorsitems)</li></ul>'),
      jsonb_build_object('heading', 'Online vs Fysiek', 'content', '<p><strong>Online voordelen:</strong> Grotere keuze, discreter, vaak goedkoper</p><p><strong>Fysiek voordelen:</strong> Persoonlijk advies, producten bekijken, direct meenemen</p>'),
      jsonb_build_object('heading', 'Grote Steden', 'content', '<p>De meeste fysieke growshops vind je in:</p><ul><li>Antwerpen</li><li>Gent</li><li>Brussel</li><li>Leuven</li><li>Hasselt</li></ul>')
    ),
    'faq', jsonb_build_array(
      jsonb_build_object('question', 'Is een growshop legaal?', 'answer', 'Ja, growshops zijn volledig legaal. Ze verkopen kweekbenodigdheden, niet illegale producten.'),
      jsonb_build_object('question', 'Mag ik zaden kopen in een growshop?', 'answer', 'Ja, cannabis zaden zijn legaal te koop als "collectorsitems" of "souvenirs".')
    )
  ),
  'directory',
  true,
  now()
) ON CONFLICT (slug) DO UPDATE SET content = EXCLUDED.content, last_updated = now();

-- 2. Growshop Antwerpen
INSERT INTO seo_content_pages (slug, title, h1_title, meta_description, meta_keywords, content, page_type, is_published, last_updated)
VALUES (
  'growshop-antwerpen',
  'Growshop Antwerpen: Beste Winkels | Wietforum',
  'Growshops in Antwerpen',
  'Overzicht van growshops in Antwerpen en omgeving. Waar koop je kweekspullen in de Antwerpse regio?',
  ARRAY['growshop antwerpen', 'grow shop antwerpen', 'kweekshop antwerpen'],
  jsonb_build_object(
    'sections', jsonb_build_array(
      jsonb_build_object('heading', 'Growshops in Antwerpen', 'content', '<p>Antwerpen als grootste stad van Vlaanderen heeft meerdere growshops. Hier vind je alles voor je kweekproject.</p>'),
      jsonb_build_object('heading', 'Wat Te Verwachten', 'content', '<ul><li>Professioneel advies van ervaren medewerkers</li><li>Complete setups en losse onderdelen</li><li>Voedingsstoffen van alle grote merken</li><li>Hulp bij probleemdiagnose</li></ul>'),
      jsonb_build_object('heading', 'Tips', 'content', '<ul><li>Vraag naar startersets voor beginners</li><li>Vergelijk prijzen met online shops</li><li>Vraag om korting bij grotere aankopen</li></ul>')
    ),
    'faq', jsonb_build_array(
      jsonb_build_object('question', 'Zijn er veel growshops in Antwerpen?', 'answer', 'Ja, Antwerpen heeft meerdere growshops verspreid over de stad en randgemeenten.')
    )
  ),
  'directory',
  true,
  now()
) ON CONFLICT (slug) DO UPDATE SET content = EXCLUDED.content, last_updated = now();

-- 3. Growshop Gent
INSERT INTO seo_content_pages (slug, title, h1_title, meta_description, meta_keywords, content, page_type, is_published, last_updated)
VALUES (
  'growshop-gent',
  'Growshop Gent: Kweekwinkels Oost-Vlaanderen | Wietforum',
  'Growshops in Gent',
  'Growshops in Gent en Oost-Vlaanderen. Waar haal je kweekbenodigdheden in de regio?',
  ARRAY['growshop gent', 'grow shop gent', 'kweekwinkel gent'],
  jsonb_build_object(
    'sections', jsonb_build_array(
      jsonb_build_object('heading', 'Kweekwinkels Gent', 'content', '<p>Gent en omgeving heeft diverse opties voor kweekbenodigdheden, van gespecialiseerde growshops tot tuincentra met relevante producten.</p>'),
      jsonb_build_object('heading', 'Aanbod', 'content', '<p>Typisch assortiment:</p><ul><li>Growtents (60x60 tot 150x150+)</li><li>LED verlichting</li><li>Plagron, BioBizz, Canna voeding</li><li>Potten, aarde, coco</li><li>Meetapparatuur</li></ul>')
    ),
    'faq', jsonb_build_array(
      jsonb_build_object('question', 'Zijn er growshops in het centrum?', 'answer', 'De meeste zitten aan de rand van de stad met betere parkeermogelijkheden.')
    )
  ),
  'directory',
  true,
  now()
) ON CONFLICT (slug) DO UPDATE SET content = EXCLUDED.content, last_updated = now();

-- 4. Beste Aarde Wiet
INSERT INTO seo_content_pages (slug, title, h1_title, meta_description, meta_keywords, content, page_type, is_published, last_updated)
VALUES (
  'beste-aarde-wiet',
  'Beste Aarde voor Wiet: Reviews & Vergelijking | Wietforum',
  'Welke Aarde Is Het Beste voor Cannabis?',
  'Vergelijking van kweekgrond voor cannabis. Plagron, BioBizz, Canna en meer beoordeeld.',
  ARRAY['beste aarde wiet', 'kweekgrond cannabis', 'potgrond wiet', 'beste grond kweken'],
  jsonb_build_object(
    'sections', jsonb_build_array(
      jsonb_build_object('heading', 'Top Merken', 'content', '<ol><li><strong>Plagron Royalmix</strong> - Voorgemest, ideaal voor beginners</li><li><strong>BioBizz Light-Mix</strong> - Licht voorgemest, meer controle</li><li><strong>Canna Terra Professional</strong> - Professionele kwaliteit</li><li><strong>Plagron Grow-Mix</strong> - Organisch, goed geprijsd</li></ol>'),
      jsonb_build_object('heading', 'Voorgemest vs Niet', 'content', '<p><strong>Voorgemeste aarde (hot soil):</strong></p><ul><li>+ Geen voeding nodig eerste weken</li><li>- Minder controle</li><li>- Niet goed voor zaailingen</li></ul><p><strong>Light-mix:</strong></p><ul><li>+ Meer controle over voeding</li><li>+ Geschikt voor zaailingen</li><li>- Moet eerder bijvoeden</li></ul>'),
      jsonb_build_object('heading', 'Aarde vs Coco', 'content', '<p><strong>Aarde:</strong> Vergevingsgezinder, trager, organische smaak</p><p><strong>Coco:</strong> Snellere groei, meer controle, moet vaker voeden</p><p>Voor beginners: <strong>aarde</strong> (zoals Plagron Royalmix)</p>'),
      jsonb_build_object('heading', 'Hoeveel Nodig?', 'content', '<p><strong>11L pot:</strong> 1 zak van 25L = 2 potten</p><p><strong>25L pot:</strong> 1 zak van 50L = 2 potten</p><p>Reken op extra voor verpotten.</p>')
    ),
    'faq', jsonb_build_array(
      jsonb_build_object('question', 'Welke aarde voor beginners?', 'answer', 'Plagron Royalmix - voorgemest en vergevingsgezind, ideaal om mee te starten.'),
      jsonb_build_object('question', 'Kan ik tuinaarde gebruiken?', 'answer', 'Niet ideaal. Cannabis heeft luchtige, goed drainerende grond nodig. Koop speciale kweekgrond.')
    )
  ),
  'article',
  true,
  now()
) ON CONFLICT (slug) DO UPDATE SET content = EXCLUDED.content, last_updated = now();

-- 5. Plagron Voeding
INSERT INTO seo_content_pages (slug, title, h1_title, meta_description, meta_keywords, content, page_type, is_published, last_updated)
VALUES (
  'plagron-voeding',
  'Plagron Voeding voor Cannabis: Complete Gids | Wietforum',
  'Plagron Voeding Handleiding',
  'Hoe gebruik je Plagron voeding voor cannabis? Schema, dosering en tips voor alle Plagron producten.',
  ARRAY['plagron', 'plagron voeding', 'plagron schema', 'plagron cannabis'],
  jsonb_build_object(
    'sections', jsonb_build_array(
      jsonb_build_object('heading', 'Over Plagron', 'content', '<p><strong>Plagron</strong> is een Nederlands merk gespecialiseerd in kweekproducten. Ze bieden aarde, voedingsstoffen en supplementen voor zowel hobby als professionele kwekers.</p>'),
      jsonb_build_object('heading', 'Basis Lijn', 'content', '<p><strong>Terra Grow:</strong> Vegetatieve fase (N-rijk)</p><p><strong>Terra Bloom:</strong> Bloei fase (P-K rijk)</p><p><strong>Power Roots:</strong> Wortelstimulant</p><p><strong>Green Sensation:</strong> Bloei booster</p>'),
      jsonb_build_object('heading', 'Voedingsschema', 'content', '<p><strong>Week 1-2 (zaailing):</strong> Alleen water</p><p><strong>Week 3-4 (vroege veg):</strong> 1ml/L Terra Grow</p><p><strong>Week 5-6 (late veg):</strong> 2-3ml/L Terra Grow</p><p><strong>Week 7-10 (bloei):</strong> 2-3ml/L Terra Bloom</p><p><strong>Week 11-12 (late bloei):</strong> 1ml/L + spoelen</p>'),
      jsonb_build_object('heading', 'Tips', 'content', '<ul><li>Start altijd met lagere dosis dan aangegeven</li><li>Check pH na mengen (6.0-6.5)</li><li>Combineer niet met voorgemeste aarde eerste weken</li><li>Less is more - onderbemesting is makkelijker te fixen</li></ul>')
    ),
    'faq', jsonb_build_array(
      jsonb_build_object('question', 'Is Plagron goed voor cannabis?', 'answer', 'Ja, Plagron is een van de populairste merken onder cannabis kwekers.'),
      jsonb_build_object('question', 'Plagron of BioBizz?', 'answer', 'Beide zijn uitstekend. Plagron is iets makkelijker, BioBizz 100% organisch.')
    )
  ),
  'article',
  true,
  now()
) ON CONFLICT (slug) DO UPDATE SET content = EXCLUDED.content, last_updated = now();

-- 6. BioBizz Voeding
INSERT INTO seo_content_pages (slug, title, h1_title, meta_description, meta_keywords, content, page_type, is_published, last_updated)
VALUES (
  'biobizz-voeding',
  'BioBizz Voeding: Organisch Kweken | Wietforum',
  'BioBizz voor Cannabis',
  '100% organische BioBizz voeding voor cannabis. Producten, schema en tips voor biologisch kweken.',
  ARRAY['biobizz', 'biobizz voeding', 'biobizz cannabis', 'organische voeding'],
  jsonb_build_object(
    'sections', jsonb_build_array(
      jsonb_build_object('heading', 'Waarom BioBizz?', 'content', '<p>BioBizz is <strong>100% organisch</strong> en gecertificeerd biologisch. Ideaal voor kwekers die waarde hechten aan een natuurlijke, schone smaak.</p>'),
      jsonb_build_object('heading', 'Producten', 'content', '<p><strong>Bio-Grow:</strong> Vegetatieve fase</p><p><strong>Bio-Bloom:</strong> Bloei fase</p><p><strong>Root-Juice:</strong> Wortelstimulator</p><p><strong>Top-Max:</strong> Bloei booster</p><p><strong>Acti-Vera:</strong> Plant versterker</p>'),
      jsonb_build_object('heading', 'Voedingsschema', 'content', '<p><strong>Zaailing:</strong> Root-Juice 1-4ml/L</p><p><strong>Vegetatie:</strong> Bio-Grow 2-4ml/L</p><p><strong>Bloei:</strong> Bio-Bloom 2-4ml/L + Top-Max 1-4ml/L</p><p><strong>Late bloei:</strong> Afbouwen, spoelen niet strikt nodig bij organisch</p>'),
      jsonb_build_object('heading', 'Organisch vs Mineraal', 'content', '<p><strong>Organisch (BioBizz):</strong></p><ul><li>Betere smaak</li><li>Beter voor bodemeeleven</li><li>Trager opneembaar</li><li>Moeilijker te over-voeden</li></ul>')
    ),
    'faq', jsonb_build_array(
      jsonb_build_object('question', 'Moet ik spoelen met BioBizz?', 'answer', 'Niet strikt nodig bij organische voeding. De plant verbruikt wat er is.'),
      jsonb_build_object('question', 'Is BioBizz beter dan Plagron?', 'answer', 'Beide zijn uitstekend. BioBizz is 100% organisch, Plagron heeft ook minerale opties.')
    )
  ),
  'article',
  true,
  now()
) ON CONFLICT (slug) DO UPDATE SET content = EXCLUDED.content, last_updated = now();

-- 7. Canna Voeding
INSERT INTO seo_content_pages (slug, title, h1_title, meta_description, meta_keywords, content, page_type, is_published, last_updated)
VALUES (
  'canna-voeding',
  'Canna Voeding: Professionele Kwaliteit | Wietforum',
  'Canna Voedingsstoffen',
  'Canna is een premium merk voor professionals. Complete gids over Canna Terra, Coco en Hydro lijnen.',
  ARRAY['canna voeding', 'canna terra', 'canna cannabis', 'canna mest'],
  jsonb_build_object(
    'sections', jsonb_build_array(
      jsonb_build_object('heading', 'Over Canna', 'content', '<p><strong>Canna</strong> is een premium Nederlands merk met een wetenschappelijke aanpak. Ze bieden gespecialiseerde lijnen voor aarde, coco en hydro.</p>'),
      jsonb_build_object('heading', 'Product Lijnen', 'content', '<p><strong>Terra (aarde):</strong></p><ul><li>Terra Vega - Groei</li><li>Terra Flores - Bloei</li></ul><p><strong>Coco:</strong></p><ul><li>Coco A+B - Twee-componenten systeem</li></ul><p><strong>Hydro:</strong></p><ul><li>Hydro Vega A+B</li><li>Hydro Flores A+B</li></ul>'),
      jsonb_build_object('heading', 'Boosters & Supplementen', 'content', '<ul><li><strong>Rhizotonic:</strong> Wortelstimulator</li><li><strong>Cannazym:</strong> Enzym complex</li><li><strong>PK 13/14:</strong> Bloei boost</li><li><strong>Boost:</strong> Metabolisme versterker</li></ul>'),
      jsonb_build_object('heading', 'Prijs vs Kwaliteit', 'content', '<p>Canna is duurder dan Plagron of BioBizz, maar levert consistente professionele resultaten. Populair bij commerciële kwekers.</p>')
    ),
    'faq', jsonb_build_array(
      jsonb_build_object('question', 'Is Canna het waard?', 'answer', 'Voor wie maximale kwaliteit wil, ja. Voor hobbyisten kan Plagron ook prima voldoen.'),
      jsonb_build_object('question', 'Kan ik Canna mengen met andere merken?', 'answer', 'Technisch ja, maar houd bij één merk voor consistentie en om problemen te voorkomen.')
    )
  ),
  'article',
  true,
  now()
) ON CONFLICT (slug) DO UPDATE SET content = EXCLUDED.content, last_updated = now();

-- 8. Koolstoffilter
INSERT INTO seo_content_pages (slug, title, h1_title, meta_description, meta_keywords, content, page_type, is_published, last_updated)
VALUES (
  'koolstoffilter-kweek',
  'Koolstoffilter voor Kweek: Geurloos Kweken | Wietforum',
  'Koolstoffilter: Geen Geur Meer',
  'Alles over koolstoffilters voor cannabis kweek. Hoe werkt het, welke maat, en installatie tips.',
  ARRAY['koolstoffilter', 'carbon filter', 'geurfilter kweek', 'luchtfilter cannabis'],
  jsonb_build_object(
    'sections', jsonb_build_array(
      jsonb_build_object('heading', 'Waarom een Koolstoffilter?', 'content', '<p>Een bloeiende cannabis plant <strong>ruikt sterk</strong>. Een koolstoffilter neutraliseert deze geur voordat de lucht je ruimte verlaat. Essentieel voor discretie.</p>'),
      jsonb_build_object('heading', 'Hoe Werkt Het?', 'content', '<p>Lucht wordt door geactiveerde koolstof gefilterd. De koolstof absorbeert geurmoleculen. De uitgaande lucht is zo goed als geurloos.</p>'),
      jsonb_build_object('heading', 'Welke Maat?', 'content', '<p>Match je filter aan je afzuiger (m³/uur):</p><ul><li><strong>150 m³/uur:</strong> 60x60 tent</li><li><strong>300 m³/uur:</strong> 80x80 tent</li><li><strong>400-500 m³/uur:</strong> 100x100 tent</li><li><strong>600+ m³/uur:</strong> 120x120+ tent</li></ul>'),
      jsonb_build_object('heading', 'Installatie', 'content', '<ol><li>Hang filter binnen in de tent (bovenkant)</li><li>Verbind met afzuiger via slang</li><li>Afzuiger zuigt lucht door filter naar buiten</li><li>Creëer negatieve druk (lucht komt alleen binnen via openingen)</li></ol>'),
      jsonb_build_object('heading', 'Levensduur', 'content', '<p>Gemiddeld <strong>1-2 jaar</strong> bij normale kweek. Vervang als je geur ruikt ondanks werkende filter.</p>')
    ),
    'faq', jsonb_build_array(
      jsonb_build_object('question', 'Werkt een koolstoffilter echt?', 'answer', 'Ja, bij correcte installatie en de juiste maat is de geur 99%+ verdwenen.'),
      jsonb_build_object('question', 'Kan ik zonder koolstoffilter?', 'answer', 'Alleen als geur geen probleem is. In bloei ruiken planten zeer sterk.')
    )
  ),
  'article',
  true,
  now()
) ON CONFLICT (slug) DO UPDATE SET content = EXCLUDED.content, last_updated = now();

-- 9. Ventilator Kweektent
INSERT INTO seo_content_pages (slug, title, h1_title, meta_description, meta_keywords, content, page_type, is_published, last_updated)
VALUES (
  'ventilator-kweektent',
  'Ventilatie Kweektent: Afzuiging & Circulatie | Wietforum',
  'Ventilatie in de Kweektent',
  'Alles over ventilatie voor cannabis. Afzuiger, circulatieventilatoren en klimaatbeheersing.',
  ARRAY['ventilator kweektent', 'afzuiger kweek', 'ventilatie cannabis', 'luchtcirculatie'],
  jsonb_build_object(
    'sections', jsonb_build_array(
      jsonb_build_object('heading', 'Waarom Ventilatie?', 'content', '<p>Goede ventilatie is essentieel:</p><ul><li><strong>CO2 aanvoer:</strong> Planten hebben CO2 nodig</li><li><strong>Geurbeheersing:</strong> Via koolstoffilter</li><li><strong>Temperatuur:</strong> Warmte afvoeren</li><li><strong>Vochtigheid:</strong> Schimmelpreventie</li><li><strong>Sterke stengels:</strong> Wind stimuleert groei</li></ul>'),
      jsonb_build_object('heading', 'Afzuiging', 'content', '<p>De <strong>afzuiger</strong> trekt lucht uit de tent:</p><ul><li>Verbonden met koolstoffilter voor geurbeheersing</li><li>Creëert negatieve druk</li><li>Voert warmte af</li></ul><p><strong>Vuistregel:</strong> Vervang de lucht elke 1-3 minuten.</p>'),
      jsonb_build_object('heading', 'Circulatie', 'content', '<p><strong>Clipventilatoren</strong> of oscillerende ventilatoren zorgen voor luchtbeweging:</p><ul><li>Sterke stengels door beweging</li><li>Gelijkmatige temperatuur</li><li>Voorkomt hotspots en schimmel</li></ul>'),
      jsonb_build_object('heading', 'Welke Maat Afzuiger?', 'content', '<p><strong>60x60 tent:</strong> 150-200 m³/uur</p><p><strong>80x80 tent:</strong> 250-350 m³/uur</p><p><strong>100x100 tent:</strong> 400-500 m³/uur</p><p><strong>120x120 tent:</strong> 600-800 m³/uur</p>')
    ),
    'faq', jsonb_build_array(
      jsonb_build_object('question', 'Kan ik zonder afzuiger?', 'answer', 'Niet aan te raden. Zonder afzuiger krijg je problemen met temperatuur, vochtigheid en geur.'),
      jsonb_build_object('question', 'Hoe stil zijn afzuigers?', 'answer', 'Moderne inline fans zijn relatief stil. Kies een model met snelheidsregelaar voor meer controle.')
    )
  ),
  'article',
  true,
  now()
) ON CONFLICT (slug) DO UPDATE SET content = EXCLUDED.content, last_updated = now();

-- 10. pH Meter Cannabis
INSERT INTO seo_content_pages (slug, title, h1_title, meta_description, meta_keywords, content, page_type, is_published, last_updated)
VALUES (
  'ph-meter-cannabis',
  'pH Meter voor Cannabis: Waarom Essentieel | Wietforum',
  'pH Meten bij Cannabis Kweek',
  'Waarom is pH belangrijk voor cannabis? Welke pH meter, hoe gebruiken en optimale waarden.',
  ARRAY['ph meter cannabis', 'ph waarde wiet', 'ph meten', 'ph cannabis'],
  jsonb_build_object(
    'sections', jsonb_build_array(
      jsonb_build_object('heading', 'Waarom pH Meten?', 'content', '<p>pH bepaalt welke <strong>voedingsstoffen de plant kan opnemen</strong>. Bij verkeerde pH kan de plant geen voeding opnemen, zelfs als het er is.</p>'),
      jsonb_build_object('heading', 'Optimale pH Waarden', 'content', '<p><strong>Aarde:</strong> 6.0 - 7.0 (sweet spot: 6.5)</p><p><strong>Coco/Hydro:</strong> 5.5 - 6.5 (sweet spot: 5.8-6.2)</p><p>Meet de pH van je voedingswater NA het mengen van voeding.</p>'),
      jsonb_build_object('heading', 'pH Meters', 'content', '<p><strong>Budget:</strong> Gele pH pennen (€10-20) - Werkbaar maar minder nauwkeurig</p><p><strong>Beter:</strong> Digitale pH meter met kalibratie (€30-50)</p><p><strong>Premium:</strong> Apera of Bluelab (€80-150)</p>'),
      jsonb_build_object('heading', 'pH Aanpassen', 'content', '<p><strong>pH te hoog?</strong> pH Down (fosfor/salpeterzuur)</p><p><strong>pH te laag?</strong> pH Up (kaliumhydroxide)</p><p>Voeg druppelsgewijs toe en meet opnieuw.</p>')
    ),
    'faq', jsonb_build_array(
      jsonb_build_object('question', 'Moet ik pH altijd meten?', 'answer', 'Ja, bij elke keer voeden. pH fluctuaties zijn een veelvoorkomende oorzaak van problemen.'),
      jsonb_build_object('question', 'Waarom verkleuren mijn bladeren ondanks voeding?', 'answer', 'Vaak pH probleem. Bij verkeerde pH kan de plant voeding niet opnemen (nutrient lockout).')
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
  RAISE NOTICE 'Kweekbenodigdheden & Growshops paginas succesvol aangemaakt';
  RAISE NOTICE 'Totaal: 10 paginas';
END $$;

