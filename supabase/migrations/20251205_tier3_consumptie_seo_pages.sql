-- =====================================================
-- TIER 3: CONSUMPTIE METHODES SEO PAGINA'S
-- 24 keywords over roken, vapen, edibles en meer
-- =====================================================

-- =====================================================
-- SECTIE 1: ROKEN (8 pagina's)
-- =====================================================

-- 1. Joint Roken
INSERT INTO seo_content_pages (slug, title, h1_title, meta_description, meta_keywords, content, page_type, is_published, last_updated)
VALUES (
  'joint-roken',
  'Joint Roken: Complete Gids | Wietforum',
  'Joint Roken: Alles Wat Je Moet Weten',
  'Alles over joints roken. Hoe draai je een joint, effecten, tips en gezondheidsaspecten.',
  ARRAY['joint roken', 'wiet roken', 'joint effect', 'joints draaien'],
  jsonb_build_object(
    'sections', jsonb_build_array(
      jsonb_build_object('heading', 'Wat Is een Joint?', 'content', '<p>Een joint is cannabis gerold in <strong>vloeitje</strong> (sigaret papier). In België en Nederland vaak met tabak gemengd (spliff), in de VS meestal puur.</p>'),
      jsonb_build_object('heading', 'Hoe Draai Je een Joint?', 'content', '<ol><li>Maak een filter/tip van karton</li><li>Plaats filter aan één kant van het vloeitje</li><li>Verdeel wiet (en tabak) gelijkmatig</li><li>Rol het vloeitje op en neer om te vormen</li><li>Rol op, lik de lijmrand, sluit af</li><li>Stamp het topje aan</li></ol>'),
      jsonb_build_object('heading', 'Met of Zonder Tabak?', 'content', '<p><strong>Met tabak (spliff):</strong></p><ul><li>Brandt beter en gelijkmatiger</li><li>Minder wiet nodig</li><li>Tabaksverslaving risico</li></ul><p><strong>Puur:</strong></p><ul><li>Zuiverdere wiet-ervaring</li><li>Geen tabaksnadelen</li><li>Kan harder branden</li></ul>'),
      jsonb_build_object('heading', 'Effecten', 'content', '<p><strong>Aankomsttijd:</strong> Binnen seconden tot minuten</p><p><strong>Duur:</strong> 1-3 uur</p><p><strong>Piek:</strong> Na 10-30 minuten</p>')
    ),
    'faq', jsonb_build_array(
      jsonb_build_object('question', 'Hoe lang duurt een joint high?', 'answer', '1-3 uur, met piek na 10-30 minuten.'),
      jsonb_build_object('question', 'Is joint roken schadelijk?', 'answer', 'Roken is altijd schadelijk voor de longen. Vapen is een minder schadelijk alternatief.')
    )
  ),
  'article',
  true,
  now()
) ON CONFLICT (slug) DO UPDATE SET content = EXCLUDED.content, last_updated = now();

-- 2. Bong Roken
INSERT INTO seo_content_pages (slug, title, h1_title, meta_description, meta_keywords, content, page_type, is_published, last_updated)
VALUES (
  'bong-roken',
  'Bong Roken: Uitleg & Tips | Wietforum',
  'Bong Roken: Hoe Werkt Het?',
  'Alles over bong roken. Hoe gebruik je een bong, voordelen, schoonmaken en verschillende types.',
  ARRAY['bong roken', 'waterpijp wiet', 'bong gebruik', 'bong high'],
  jsonb_build_object(
    'sections', jsonb_build_array(
      jsonb_build_object('heading', 'Wat Is een Bong?', 'content', '<p>Een bong is een <strong>waterpijp</strong> voor cannabis. De rook gaat door water, wat het koelt en filtert voordat je inhaleert.</p>'),
      jsonb_build_object('heading', 'Hoe Gebruik Je een Bong?', 'content', '<ol><li>Vul de bong met water (net boven de downstem)</li><li>Maal wiet fijn en doe in de bowl</li><li>Houd vinger op carb (gat aan de zijkant) indien aanwezig</li><li>Breng vlam naar wiet terwijl je inhaleert</li><li>Als kamer gevuld is: laat carb los en inhaleer</li></ol>'),
      jsonb_build_object('heading', 'Voordelen', 'content', '<ul><li><strong>Koeler:</strong> Water koelt de rook</li><li><strong>Gladder:</strong> Minder irritatie keel</li><li><strong>Efficient:</strong> Sterker effect per hoeveelheid wiet</li><li><strong>Snel:</strong> Direct effect</li></ul>'),
      jsonb_build_object('heading', 'Schoonmaken', 'content', '<p>Maak je bong regelmatig schoon:</p><ol><li>Spoel met heet water</li><li>Vul met isopropyl alcohol + zout</li><li>Schud goed</li><li>Spoel grondig na</li></ol>')
    ),
    'faq', jsonb_build_array(
      jsonb_build_object('question', 'Is een bong beter dan een joint?', 'answer', 'Bong is efficiënter en koeler, maar roken blijft roken. Vapen is de gezondste inhalatie optie.'),
      jsonb_build_object('question', 'Hoe vaak bongwater verversen?', 'answer', 'Na elke sessie. Oud bongwater is vies en kan bacteriën bevatten.')
    )
  ),
  'article',
  true,
  now()
) ON CONFLICT (slug) DO UPDATE SET content = EXCLUDED.content, last_updated = now();

-- 3. Blunt Roken
INSERT INTO seo_content_pages (slug, title, h1_title, meta_description, meta_keywords, content, page_type, is_published, last_updated)
VALUES (
  'blunt-roken',
  'Blunt Roken: Wat Is Het? | Wietforum',
  'Wat Is een Blunt?',
  'Alles over blunts. Verschil met joint, hoe draai je een blunt, en voor- en nadelen.',
  ARRAY['blunt roken', 'blunt draaien', 'wat is blunt', 'blunt vs joint'],
  jsonb_build_object(
    'sections', jsonb_build_array(
      jsonb_build_object('heading', 'Wat Is een Blunt?', 'content', '<p>Een blunt is cannabis gerold in <strong>tabaksblad</strong> of een uitgehold sigaar. Groter dan een joint, bevat meer wiet, en heeft een kenmerkende smaak.</p>'),
      jsonb_build_object('heading', 'Blunt vs Joint', 'content', '<p><strong>Blunt:</strong></p><ul><li>Tabaksblad wikkel</li><li>Groter, meer wiet</li><li>Langzamer branden</li><li>Nicotine buzz</li></ul><p><strong>Joint:</strong></p><ul><li>Papieren vloeitje</li><li>Kleiner</li><li>Sneller branden</li><li>Zuiverder smaak</li></ul>'),
      jsonb_build_object('heading', 'Hoe Draai Je een Blunt?', 'content', '<ol><li>Snij sigaar/blunt wrap open</li><li>Verwijder tabak</li><li>Bevochtig het blad licht</li><li>Vul met fijn gemaakte wiet</li><li>Rol op en sluit af</li><li>Droog licht met vlam</li></ol>'),
      jsonb_build_object('heading', 'Populaire Blunt Wraps', 'content', '<ul><li>Backwoods</li><li>Swisher Sweets</li><li>Dutch Masters</li><li>Game</li></ul>')
    ),
    'faq', jsonb_build_array(
      jsonb_build_object('question', 'Bevat een blunt nicotine?', 'answer', 'Ja, het tabaksblad bevat nicotine. Je krijgt een lichte nicotine buzz naast de wiet high.'),
      jsonb_build_object('question', 'Hoeveel wiet in een blunt?', 'answer', 'Meestal 1-3 gram, afhankelijk van de grootte van de wrap.')
    )
  ),
  'article',
  true,
  now()
) ON CONFLICT (slug) DO UPDATE SET content = EXCLUDED.content, last_updated = now();

-- 4. Pijp Roken
INSERT INTO seo_content_pages (slug, title, h1_title, meta_description, meta_keywords, content, page_type, is_published, last_updated)
VALUES (
  'pijp-roken-wiet',
  'Wiet Roken met een Pijp | Wietforum',
  'Cannabis Pijp Gebruiken',
  'Hoe gebruik je een wietpijp? Verschillende soorten pijpen, tips en onderhoud.',
  ARRAY['wiet pijp', 'cannabis pijp', 'pijp roken', 'pipe wiet'],
  jsonb_build_object(
    'sections', jsonb_build_array(
      jsonb_build_object('heading', 'Soorten Pijpen', 'content', '<ul><li><strong>Spoon pipe:</strong> Klassieke handpijp met bowl</li><li><strong>One-hitter:</strong> Kleine pijp voor één hijs</li><li><strong>Chillum:</strong> Rechte buispijp</li><li><strong>Sherlock:</strong> Gebogen, klassieke vorm</li><li><strong>Steamroller:</strong> Grote hit, voor ervaren gebruikers</li></ul>'),
      jsonb_build_object('heading', 'Hoe Gebruiken', 'content', '<ol><li>Maal wiet fijn</li><li>Doe in de bowl (niet te vol)</li><li>Houd vinger op carb (indien aanwezig)</li><li>Breng vlam naar wiet, inhaleer</li><li>Laat carb los om te clearen</li></ol>'),
      jsonb_build_object('heading', 'Voordelen', 'content', '<ul><li>Snel en makkelijk</li><li>Geen rolling skills nodig</li><li>Geen papier/tabak</li><li>Herbruikbaar</li><li>Compact en portable</li></ul>'),
      jsonb_build_object('heading', 'Onderhoud', 'content', '<p>Regelmatig schoonmaken met isopropyl alcohol en zout. Laat geen as ophopen.</p>')
    ),
    'faq', jsonb_build_array(
      jsonb_build_object('question', 'Wat is de beste wiet pijp?', 'answer', 'Een glazen spoon pipe is veelzijdig en makkelijk schoon te maken. Goed voor beginners.'),
      jsonb_build_object('question', 'Is pijp roken beter dan joint?', 'answer', 'Geen papier/tabak verbranding, dus iets schoner. Maar roken blijft roken.')
    )
  ),
  'article',
  true,
  now()
) ON CONFLICT (slug) DO UPDATE SET content = EXCLUDED.content, last_updated = now();

-- =====================================================
-- SECTIE 2: VAPEN (6 pagina's)
-- =====================================================

-- 5. Wiet Vapen
INSERT INTO seo_content_pages (slug, title, h1_title, meta_description, meta_keywords, content, page_type, is_published, last_updated)
VALUES (
  'wiet-vapen',
  'Wiet Vapen: Complete Gids | Wietforum',
  'Cannabis Vapen: Alles Wat Je Moet Weten',
  'Alles over wiet vapen. Voordelen, vaporizers, temperaturen en vergelijking met roken.',
  ARRAY['wiet vapen', 'cannabis vaporizer', 'vapen vs roken', 'dry herb vape'],
  jsonb_build_object(
    'sections', jsonb_build_array(
      jsonb_build_object('heading', 'Wat Is Vapen?', 'content', '<p>Vapen is het <strong>verdampen</strong> van cannabis in plaats van verbranden. De wiet wordt verhit tot het punt waar cannabinoïden en terpenen verdampen, maar niet verbranden.</p>'),
      jsonb_build_object('heading', 'Voordelen van Vapen', 'content', '<ul><li><strong>Gezonder:</strong> Geen verbranding = minder schadelijke stoffen</li><li><strong>Efficiënter:</strong> Meer cannabinoïden benut</li><li><strong>Betere smaak:</strong> Terpenen blijven intact</li><li><strong>Discreter:</strong> Minder geur</li><li><strong>AVB:</strong> Al Vaped Bud kan nog voor edibles</li></ul>'),
      jsonb_build_object('heading', 'Soorten Vaporizers', 'content', '<p><strong>Dry herb vaporizers:</strong> Voor bloemen</p><p><strong>Concentrate vaporizers:</strong> Voor hasj, olie, wax</p><p><strong>Desktop:</strong> Thuisgebruik, krachtig</p><p><strong>Portable:</strong> Onderweg, handzaam</p>'),
      jsonb_build_object('heading', 'Temperaturen', 'content', '<p><strong>160-180°C:</strong> Licht, smaakvol, meer cerebraal</p><p><strong>180-200°C:</strong> Gebalanceerd, meeste terpenen</p><p><strong>200-220°C:</strong> Dikker damp, meer body effect</p><p><strong>220°C+:</strong> Maximale extractie, minder smaak</p>')
    ),
    'faq', jsonb_build_array(
      jsonb_build_object('question', 'Is vapen gezonder dan roken?', 'answer', 'Ja, geen verbranding betekent veel minder schadelijke stoffen. Niet 100% veilig, maar beter.'),
      jsonb_build_object('question', 'Welke vaporizer voor beginners?', 'answer', 'Pax, Mighty, of budget: Dynavap. Afhankelijk van budget en voorkeur.')
    )
  ),
  'pillar',
  true,
  now()
) ON CONFLICT (slug) DO UPDATE SET content = EXCLUDED.content, last_updated = now();

-- 6. Beste Vaporizer
INSERT INTO seo_content_pages (slug, title, h1_title, meta_description, meta_keywords, content, page_type, is_published, last_updated)
VALUES (
  'beste-vaporizer-wiet',
  'Beste Wiet Vaporizer 2025: Reviews | Wietforum',
  'De Beste Vaporizers voor Cannabis',
  'Reviews van de beste dry herb vaporizers. Mighty, Pax, Dynavap en meer vergeleken.',
  ARRAY['beste vaporizer', 'vaporizer review', 'wiet vape kopen', 'dry herb vape'],
  jsonb_build_object(
    'sections', jsonb_build_array(
      jsonb_build_object('heading', 'Onze Top 5', 'content', '<ol><li><strong>Storz & Bickel Mighty+</strong> - De gouden standaard. Beste damp kwaliteit, betrouwbaar. €350</li><li><strong>Pax 3</strong> - Stijlvol, makkelijk, app-gestuurd. €200</li><li><strong>Dynavap</strong> - Budget koning, aansteker nodig. €80</li><li><strong>Arizer Solo 2</strong> - Goede prijs/kwaliteit, glazen pad. €180</li><li><strong>Volcano Hybrid</strong> - Desktop koning, ballonnen. €600</li></ol>'),
      jsonb_build_object('heading', 'Budget Opties', 'content', '<ul><li><strong>Dynavap M</strong> - €80, geen batterij, werkt met aansteker</li><li><strong>XMAX V3 Pro</strong> - €100, on-demand heating</li><li><strong>Fury Edge</strong> - €150, compact en krachtig</li></ul>'),
      jsonb_build_object('heading', 'Waar Op Letten?', 'content', '<ul><li><strong>Convectie vs Conductie:</strong> Convectie = betere smaak, conductie = simpeler</li><li><strong>Batterijduur:</strong> Hoeveel sessies per lading?</li><li><strong>Opwarmtijd:</strong> On-demand vs session vapes</li><li><strong>Kwaliteit materialen:</strong> Geen plastic in luchtpad</li></ul>')
    ),
    'faq', jsonb_build_array(
      jsonb_build_object('question', 'Welke vaporizer is het beste?', 'answer', 'Mighty+ voor kwaliteit, Dynavap voor budget, Pax 3 voor stijl en gebruiksgemak.'),
      jsonb_build_object('question', 'Hoeveel kost een goede vaporizer?', 'answer', 'Budget: €80-150. Middenklasse: €150-250. Premium: €250-600.')
    )
  ),
  'article',
  true,
  now()
) ON CONFLICT (slug) DO UPDATE SET content = EXCLUDED.content, last_updated = now();

-- 7. Vapen vs Roken
INSERT INTO seo_content_pages (slug, title, h1_title, meta_description, meta_keywords, content, page_type, is_published, last_updated)
VALUES (
  'vapen-vs-roken',
  'Vapen vs Roken: Wat Is Beter? | Wietforum',
  'Cannabis Vapen vs Roken Vergeleken',
  'Vergelijking tussen vapen en roken. Gezondheid, effect, smaak en kosten. Welke is beter?',
  ARRAY['vapen vs roken', 'verschil vapen roken', 'vaporizer vs joint', 'gezonder vapen'],
  jsonb_build_object(
    'sections', jsonb_build_array(
      jsonb_build_object('heading', 'Gezondheid', 'content', '<p><strong>Vapen:</strong> Geen verbranding, 95%+ minder schadelijke stoffen</p><p><strong>Roken:</strong> Verbrand materiaal bevat teer, benzeen, etc.</p><p><strong>Winnaar:</strong> Vapen</p>'),
      jsonb_build_object('heading', 'Effect', 'content', '<p><strong>Vapen:</strong> Helder, cerebraal, terpenen-rijk effect</p><p><strong>Roken:</strong> Voller, meer sedatief (ook door CO)</p><p><strong>Winnaar:</strong> Persoonlijke voorkeur</p>'),
      jsonb_build_object('heading', 'Smaak', 'content', '<p><strong>Vapen:</strong> Vol terpenprofiel, ware smaak van de strain</p><p><strong>Roken:</strong> Verbrandingssmaak overheerst</p><p><strong>Winnaar:</strong> Vapen</p>'),
      jsonb_build_object('heading', 'Efficiëntie', 'content', '<p><strong>Vapen:</strong> Meer cannabinoïden benut, minder wiet nodig</p><p><strong>Roken:</strong> Veel gaat verloren in verbranding</p><p><strong>Winnaar:</strong> Vapen</p>'),
      jsonb_build_object('heading', 'Kosten', 'content', '<p><strong>Vapen:</strong> Hogere startkost (vaporizer), lagere lopende kosten</p><p><strong>Roken:</strong> Lage startkost, meer wiet nodig</p><p><strong>Winnaar:</strong> Vapen op lange termijn</p>')
    ),
    'faq', jsonb_build_array(
      jsonb_build_object('question', 'Is vapen beter dan roken?', 'answer', 'Voor gezondheid en efficiëntie: ja. Voor direct budget en ritueel: roken kan voorkeur hebben.'),
      jsonb_build_object('question', 'Geeft vapen dezelfde high?', 'answer', 'Vergelijkbaar maar anders. Vapen voelt vaak helderder, roken voller. Beide effectief.')
    )
  ),
  'article',
  true,
  now()
) ON CONFLICT (slug) DO UPDATE SET content = EXCLUDED.content, last_updated = now();

-- =====================================================
-- SECTIE 3: EDIBLES & ANDERE METHODES (10 pagina's)
-- =====================================================

-- 8. Edibles Effect
INSERT INTO seo_content_pages (slug, title, h1_title, meta_description, meta_keywords, content, page_type, is_published, last_updated)
VALUES (
  'edibles-effect',
  'Edibles Effect: Hoe Lang & Hoe Sterk? | Wietforum',
  'Het Effect van Cannabis Edibles',
  'Hoe werken edibles? Hoe lang duurt het effect, dosering en waarom het anders is dan roken.',
  ARRAY['edibles effect', 'spacecake effect', 'edibles high', 'edibles werking'],
  jsonb_build_object(
    'sections', jsonb_build_array(
      jsonb_build_object('heading', 'Hoe Werken Edibles?', 'content', '<p>Bij edibles wordt THC via je <strong>spijsvertering</strong> opgenomen. In de lever wordt THC omgezet naar <strong>11-hydroxy-THC</strong>, dat sterker en langer werkzaam is dan ingeademde THC.</p>'),
      jsonb_build_object('heading', 'Tijdlijn', 'content', '<p><strong>Begin effect:</strong> 30-90 minuten (soms tot 2 uur)</p><p><strong>Piek:</strong> 2-4 uur na inname</p><p><strong>Duur totaal:</strong> 4-8 uur, soms tot 12 uur</p><p><strong>Afterglow:</strong> Kan tot 24 uur voelbaar zijn</p>'),
      jsonb_build_object('heading', 'Waarom Zo Anders?', 'content', '<ul><li>11-hydroxy-THC is <strong>4-5x sterker</strong> dan normaal THC</li><li>Langzamere opname door spijsvertering</li><li>Voedsel en metabolisme beïnvloeden absorptie</li></ul>'),
      jsonb_build_object('heading', 'Dosering', 'content', '<p><strong>Beginner:</strong> 5mg THC</p><p><strong>Gemiddeld:</strong> 10-20mg THC</p><p><strong>Ervaren:</strong> 20-50mg THC</p><p><strong>Sterk:</strong> 50mg+ THC</p><p><em>Start laag, ga langzaam!</em></p>')
    ),
    'faq', jsonb_build_array(
      jsonb_build_object('question', 'Hoe lang werkt een edible?', 'answer', '4-8 uur, soms langer. Veel langer dan roken of vapen.'),
      jsonb_build_object('question', 'Waarom zijn edibles zo sterk?', 'answer', 'THC wordt omgezet naar 11-hydroxy-THC dat 4-5x sterker is dan normaal THC.')
    )
  ),
  'article',
  true,
  now()
) ON CONFLICT (slug) DO UPDATE SET content = EXCLUDED.content, last_updated = now();

-- 9. Spacecake
INSERT INTO seo_content_pages (slug, title, h1_title, meta_description, meta_keywords, content, page_type, is_published, last_updated)
VALUES (
  'spacecake',
  'Spacecake: Alles Over Cannabis Cake | Wietforum',
  'Spacecake: De Klassieke Cannabis Edible',
  'Wat is spacecake? Effect, dosering, hoe maak je het en tips voor veilig gebruik.',
  ARRAY['spacecake', 'space cake', 'wiet cake', 'cannabis brownie'],
  jsonb_build_object(
    'sections', jsonb_build_array(
      jsonb_build_object('heading', 'Wat Is Spacecake?', 'content', '<p>Spacecake is <strong>cake of brownie gemaakt met cannabis</strong>, meestal via cannabutter. Een klassieke edible, populair in Nederlandse coffeeshops.</p>'),
      jsonb_build_object('heading', 'Effect', 'content', '<p><strong>Begin:</strong> 30-90 minuten</p><p><strong>Duur:</strong> 4-8 uur</p><p><strong>Intensiteit:</strong> Vaak sterker dan roken</p><p>Het effect is lang en kan intens zijn. Neem niet meer omdat je "niets voelt"!</p>'),
      jsonb_build_object('heading', 'Dosering Tips', 'content', '<ul><li>Begin met klein stukje (1/4 van portie)</li><li>Wacht minimaal 2 uur voor meer</li><li>Eet niet op lege maag (te snel absorptie)</li><li>Heb snacks en water klaar</li></ul>'),
      jsonb_build_object('heading', 'Zelf Maken', 'content', '<p>Maak eerst <strong>cannabutter</strong> (zie onze gids), gebruik dan in je favoriete brownie of cake recept.</p>')
    ),
    'faq', jsonb_build_array(
      jsonb_build_object('question', 'Hoe lang werkt spacecake?', 'answer', '4-8 uur, soms langer. Effect begint na 30-90 minuten.'),
      jsonb_build_object('question', 'Hoeveel spacecake moet ik eten?', 'answer', 'Begin klein (1/4 portie) en wacht 2 uur. Elke spacecake heeft andere sterkte.')
    )
  ),
  'article',
  true,
  now()
) ON CONFLICT (slug) DO UPDATE SET content = EXCLUDED.content, last_updated = now();

-- 10. Cannabis Thee
INSERT INTO seo_content_pages (slug, title, h1_title, meta_description, meta_keywords, content, page_type, is_published, last_updated)
VALUES (
  'cannabis-thee',
  'Cannabis Thee Maken: Recept & Tips | Wietforum',
  'Cannabis Thee Zetten',
  'Hoe maak je cannabis thee? Recept met cannabutter of bloemen. Effect en dosering.',
  ARRAY['cannabis thee', 'wiet thee', 'thc thee', 'weed tea'],
  jsonb_build_object(
    'sections', jsonb_build_array(
      jsonb_build_object('heading', 'Werkt Cannabis Thee?', 'content', '<p>THC is <strong>niet wateroplosbaar</strong> maar wel vetoplosbaar. Gewoon wiet in heet water doen werkt niet goed. Je hebt vet nodig!</p>'),
      jsonb_build_object('heading', 'Methode 1: Met Cannabutter', 'content', '<ol><li>Zet je favoriete thee</li><li>Voeg 1-2 theelepels cannabutter toe</li><li>Roer goed tot opgelost</li><li>Drink terwijl het warm is</li></ol><p>Dit is de makkelijkste en meest effectieve methode.</p>'),
      jsonb_build_object('heading', 'Methode 2: Met Bloemen', 'content', '<ol><li>Decarboxyleer wiet eerst (110°C, 30-45 min)</li><li>Kook water met volle melk of boter</li><li>Voeg gedecarboxyleerde wiet toe</li><li>Laat 30-45 minuten zacht sudderen</li><li>Zeef en drink</li></ol>'),
      jsonb_build_object('heading', 'Effect', 'content', '<p>Vergelijkbaar met andere edibles:</p><ul><li>Begin na 30-90 minuten</li><li>Duur 4-8 uur</li><li>Zachter dan eten (langzamere absorptie)</li></ul>')
    ),
    'faq', jsonb_build_array(
      jsonb_build_object('question', 'Werkt cannabis thee?', 'answer', 'Ja, mits je vet toevoegt (boter, melk) omdat THC niet wateroplosbaar is.'),
      jsonb_build_object('question', 'Hoe lang duurt cannabis thee?', 'answer', 'Vergelijkbaar met edibles: 4-8 uur, beginnend na 30-90 minuten.')
    )
  ),
  'article',
  true,
  now()
) ON CONFLICT (slug) DO UPDATE SET content = EXCLUDED.content, last_updated = now();

-- 11. Dabben
INSERT INTO seo_content_pages (slug, title, h1_title, meta_description, meta_keywords, content, page_type, is_published, last_updated)
VALUES (
  'dabben',
  'Dabben: Concentraten Verdampen | Wietforum',
  'Dabben: Cannabis Concentraten Gebruiken',
  'Wat is dabben? Hoe werkt het, apparatuur, en waarom is het zo sterk? Complete gids.',
  ARRAY['dabben', 'dab wiet', 'concentraten', 'dab rig'],
  jsonb_build_object(
    'sections', jsonb_build_array(
      jsonb_build_object('heading', 'Wat Is Dabben?', 'content', '<p>Dabben is het verdampen van <strong>cannabis concentraten</strong> (wax, shatter, rosin, live resin) op een verhit oppervlak. Zeer krachtig en snel werkend.</p>'),
      jsonb_build_object('heading', 'Apparatuur', 'content', '<ul><li><strong>Dab rig:</strong> Speciale waterpijp voor concentraten</li><li><strong>Banger/nail:</strong> Verhit oppervlak (quartz, titanium)</li><li><strong>Carb cap:</strong> Dekt de banger af voor betere verdamping</li><li><strong>Dab tool:</strong> Om concentraat te hanteren</li><li><strong>Torch:</strong> Om te verhitten (of e-nail)</li></ul>'),
      jsonb_build_object('heading', 'Hoe Dab Je?', 'content', '<ol><li>Verhit de banger met torch tot roodgloeiend</li><li>Laat afkoelen (30-60 seconden)</li><li>Doe kleine hoeveelheid concentraat op de banger</li><li>Bedek met carb cap</li><li>Inhaleer langzaam</li></ol>'),
      jsonb_build_object('heading', 'Waarschuwing', 'content', '<p><strong>Concentraten zijn ZEER sterk</strong> (60-90% THC). Niet voor beginners! Start met minimale hoeveelheid.</p>')
    ),
    'faq', jsonb_build_array(
      jsonb_build_object('question', 'Hoe sterk is een dab?', 'answer', 'Zeer sterk. Concentraten bevatten 60-90% THC vs 15-25% bij bloemen.'),
      jsonb_build_object('question', 'Is dabben gevaarlijk?', 'answer', 'De concentraten zelf niet, maar de hitte en sterkte vereisen voorzichtigheid. Niet voor beginners.')
    )
  ),
  'article',
  true,
  now()
) ON CONFLICT (slug) DO UPDATE SET content = EXCLUDED.content, last_updated = now();

-- 12. Tincturen
INSERT INTO seo_content_pages (slug, title, h1_title, meta_description, meta_keywords, content, page_type, is_published, last_updated)
VALUES (
  'cannabis-tinctuur',
  'Cannabis Tinctuur: Sublinguaal Gebruik | Wietforum',
  'Cannabis Tincturen Uitgelegd',
  'Wat zijn cannabis tincturen? Hoe gebruik je ze, dosering en zelf maken. Sublinguaal THC/CBD.',
  ARRAY['cannabis tinctuur', 'wiet tinctuur', 'sublinguaal thc', 'green dragon'],
  jsonb_build_object(
    'sections', jsonb_build_array(
      jsonb_build_object('heading', 'Wat Is een Tinctuur?', 'content', '<p>Een tinctuur is een <strong>alcohol-extract</strong> van cannabis. Druppels onder de tong (sublinguaal) voor snelle absorptie, of toegevoegd aan eten/drinken.</p>'),
      jsonb_build_object('heading', 'Voordelen', 'content', '<ul><li><strong>Sublinguaal:</strong> Sneller dan edibles (15-30 min)</li><li><strong>Discreet:</strong> Geen geur of rook</li><li><strong>Nauwkeurig:</strong> Makkelijk doseren per druppel</li><li><strong>Langere houdbaarheid:</strong> Alcohol conserveert</li></ul>'),
      jsonb_build_object('heading', 'Gebruik', 'content', '<ol><li>Doe gewenste dosis onder de tong</li><li>Houd 30-60 seconden vast</li><li>Slik door</li></ol><p><strong>Sublinguaal:</strong> Effect na 15-30 min</p><p><strong>Ingeslikt:</strong> Effect na 30-90 min (als edible)</p>'),
      jsonb_build_object('heading', 'Zelf Maken', 'content', '<p><strong>Green Dragon recept:</strong></p><ol><li>Decarboxyleer wiet (110°C, 30-45 min)</li><li>Doe in glazen pot met hoog-gradige alcohol (Everclear)</li><li>Laat 2-4 weken trekken, schud dagelijks</li><li>Zeef en bewaar donker</li></ol>')
    ),
    'faq', jsonb_build_array(
      jsonb_build_object('question', 'Hoe snel werkt een tinctuur?', 'answer', 'Sublinguaal: 15-30 minuten. Ingeslikt: 30-90 minuten zoals edibles.'),
      jsonb_build_object('question', 'Hoeveel druppels moet ik nemen?', 'answer', 'Afhankelijk van sterkte. Start met 1-2 druppels, wacht 1 uur, bouw op.')
    )
  ),
  'article',
  true,
  now()
) ON CONFLICT (slug) DO UPDATE SET content = EXCLUDED.content, last_updated = now();

-- 13. Topicale Cannabis
INSERT INTO seo_content_pages (slug, title, h1_title, meta_description, meta_keywords, content, page_type, is_published, last_updated)
VALUES (
  'cannabis-creme-topicaal',
  'Cannabis Crème & Topicals: Werking | Wietforum',
  'Cannabis Crèmes en Zalven',
  'Hoe werken cannabis topicals? Crèmes, zalven en balsems voor lokale pijn zonder high.',
  ARRAY['cannabis creme', 'wiet zalf', 'topical cannabis', 'cbd creme'],
  jsonb_build_object(
    'sections', jsonb_build_array(
      jsonb_build_object('heading', 'Wat Zijn Topicals?', 'content', '<p>Topicals zijn <strong>cannabis-infused crèmes, zalven en balsems</strong> voor toepassing op de huid. Ze werken lokaal zonder je high te maken.</p>'),
      jsonb_build_object('heading', 'Hoe Werken Ze?', 'content', '<p>Cannabinoïden (THC, CBD) binden aan <strong>receptoren in de huid</strong> en werken lokaal:</p><ul><li>Pijnverlichting</li><li>Ontstekingsremming</li><li>Spierontspanning</li></ul><p>Ze bereiken de bloedbaan niet, dus geen psychoactief effect.</p>'),
      jsonb_build_object('heading', 'Toepassingen', 'content', '<ul><li>Gewrichtspijn / artritis</li><li>Spierpijn</li><li>Huidaandoeningen (eczeem, psoriasis)</li><li>Sportblessures</li><li>Hoofdpijn (slapen)</li></ul>'),
      jsonb_build_object('heading', 'Gebruik', 'content', '<ol><li>Reinig het gebied</li><li>Breng royaal aan op pijnlijke plek</li><li>Masseer in tot geabsorbeerd</li><li>Herhaal elke 4-6 uur indien nodig</li></ol>')
    ),
    'faq', jsonb_build_array(
      jsonb_build_object('question', 'Word je high van cannabis crème?', 'answer', 'Nee, topicals bereiken de bloedbaan niet en geven geen psychoactief effect.'),
      jsonb_build_object('question', 'Werkt cannabis crème echt?', 'answer', 'Veel gebruikers rapporteren verlichting. Wetenschappelijk bewijs groeit maar is nog beperkt.')
    )
  ),
  'article',
  true,
  now()
) ON CONFLICT (slug) DO UPDATE SET content = EXCLUDED.content, last_updated = now();

-- 14. Microdosing
INSERT INTO seo_content_pages (slug, title, h1_title, meta_description, meta_keywords, content, page_type, is_published, last_updated)
VALUES (
  'microdosing-cannabis',
  'Microdosing Cannabis: Subtiel & Effectief | Wietforum',
  'Microdosing Cannabis',
  'Wat is microdosing cannabis? Kleine doses voor subtiele effecten. Hoe, waarom en hoeveel.',
  ARRAY['microdosing cannabis', 'microdoseren wiet', 'lage dosis thc', 'micro dose'],
  jsonb_build_object(
    'sections', jsonb_build_array(
      jsonb_build_object('heading', 'Wat Is Microdosing?', 'content', '<p>Microdosing is het nemen van <strong>zeer kleine hoeveelheden cannabis</strong> - genoeg om subtiele effecten te voelen zonder echt high te worden.</p><p>Doel: functioneel blijven met lichte voordelen.</p>'),
      jsonb_build_object('heading', 'Typische Microdosis', 'content', '<p><strong>THC:</strong> 1-5 mg</p><p><strong>CBD:</strong> 5-15 mg</p><p>Ter vergelijking: normale dosis is 10-20+ mg THC.</p>'),
      jsonb_build_object('heading', 'Voordelen', 'content', '<ul><li>Subtiele stemming boost</li><li>Milde pijn/stress verlichting</li><li>Creativiteit zonder impairment</li><li>Geen tolerantie opbouw</li><li>Functioneel blijven</li></ul>'),
      jsonb_build_object('heading', 'Hoe Microdosen', 'content', '<p><strong>Beste methodes:</strong></p><ul><li>Tincturen (nauwkeurig doseren)</li><li>Low-dose edibles (1-2.5mg stukjes)</li><li>Vaporizer (1 kleine hijs)</li></ul><p>Start met 1-2mg, wacht 1-2 uur, pas aan.</p>')
    ),
    'faq', jsonb_build_array(
      jsonb_build_object('question', 'Hoeveel is een microdosis?', 'answer', '1-5 mg THC. Genoeg om subtiel te voelen, niet genoeg om echt high te zijn.'),
      jsonb_build_object('question', 'Kun je high worden van microdosing?', 'answer', 'Als je het goed doet, niet echt. Je voelt een subtiel effect maar blijft functioneel.')
    )
  ),
  'article',
  true,
  now()
) ON CONFLICT (slug) DO UPDATE SET content = EXCLUDED.content, last_updated = now();

-- =====================================================
-- SECTIE 4: PRAKTISCHE VRAGEN (6 pagina's)
-- =====================================================

-- 15. Hoelang High Roken
INSERT INTO seo_content_pages (slug, title, h1_title, meta_description, meta_keywords, content, page_type, is_published, last_updated)
VALUES (
  'hoelang-high-roken',
  'Hoelang Ben Je High na Roken? | Wietforum',
  'Hoelang Duurt een Wiet High?',
  'Hoe lang duurt de high van roken, vapen en edibles? Factoren die de duur beïnvloeden.',
  ARRAY['hoelang high', 'duur high', 'wiet high duur', 'hoe lang stoned'],
  jsonb_build_object(
    'sections', jsonb_build_array(
      jsonb_build_object('heading', 'Per Methode', 'content', '<p><strong>Roken/joint:</strong> 1-3 uur</p><p><strong>Vapen:</strong> 1-2 uur</p><p><strong>Edibles:</strong> 4-8 uur (soms 12+)</p><p><strong>Tinctuur:</strong> 2-4 uur</p><p><strong>Dabben:</strong> 1-3 uur (intense piek)</p>'),
      jsonb_build_object('heading', 'Factoren', 'content', '<ul><li><strong>Tolerantie:</strong> Hogere tolerantie = kortere high</li><li><strong>Dosis:</strong> Meer = langer</li><li><strong>Strain:</strong> Indica vaak langer, sativa korter</li><li><strong>Metabolisme:</strong> Sneller = kortere high</li><li><strong>Methode:</strong> Edibles duren het langst</li></ul>'),
      jsonb_build_object('heading', 'De Fases', 'content', '<p><strong>Opkomst:</strong> Effect bouwt op (5-30 min roken, 1-2 uur edibles)</p><p><strong>Piek:</strong> Maximale intensiteit</p><p><strong>Plateau:</strong> Stabiel effect</p><p><strong>Afdaling:</strong> Geleidelijke afname</p><p><strong>Afterglow:</strong> Subtiel resterend gevoel</p>')
    ),
    'faq', jsonb_build_array(
      jsonb_build_object('question', 'Hoelang duurt een joint high?', 'answer', 'Gemiddeld 1-3 uur, met piek na 10-30 minuten.'),
      jsonb_build_object('question', 'Waarom duurt edible high zo lang?', 'answer', 'THC wordt in de lever omgezet naar een sterkere verbinding die langzamer wordt afgebroken.')
    )
  ),
  'faq',
  true,
  now()
) ON CONFLICT (slug) DO UPDATE SET content = EXCLUDED.content, last_updated = now();

-- 16. Wiet Geur Verdoezelen
INSERT INTO seo_content_pages (slug, title, h1_title, meta_description, meta_keywords, content, page_type, is_published, last_updated)
VALUES (
  'wiet-geur-verdoezelen',
  'Wiet Geur Verdoezelen: Tips & Trucs | Wietforum',
  'Hoe Verdoezel Je de Geur van Wiet?',
  'Hoe verberg je de geur van wiet? Tips voor roken, bewaren en ruimte ontgeuren.',
  ARRAY['wiet geur verdoezelen', 'wiet geur weg', 'cannabis geur verbergen', 'smell proof'],
  jsonb_build_object(
    'sections', jsonb_build_array(
      jsonb_build_object('heading', 'Bij Het Roken', 'content', '<ul><li><strong>Buiten roken:</strong> Beste optie voor geen geur binnenshuis</li><li><strong>Raam open + ventilator:</strong> Blaas naar buiten</li><li><strong>Sploof:</strong> Blaas door kartonnen buis met droogvellen</li><li><strong>Vapen:</strong> Veel minder geur dan roken</li></ul>'),
      jsonb_build_object('heading', 'Na Het Roken', 'content', '<ul><li>Open ramen voor ventilatie</li><li>Gebruik geurkaars of wierook</li><li>Luchtverfrisser</li><li>Was je handen en poets tanden</li><li>Verwissel kleding indien mogelijk</li></ul>'),
      jsonb_build_object('heading', 'Bewaren', 'content', '<ul><li><strong>Luchtdichte pot:</strong> Mason jars met rubber seal</li><li><strong>Smell proof bags:</strong> Speciaal ontworpen zakjes</li><li><strong>Stash containers:</strong> Smell proof doosjes</li><li><strong>Dubbel verpakken:</strong> Extra zekerheid</li></ul>'),
      jsonb_build_object('heading', 'Kweekgeur', 'content', '<ul><li><strong>Koolstoffilter:</strong> Essentieel voor binnenkweek</li><li><strong>Goede afzuiging:</strong> Negatieve druk in tent</li><li><strong>ONA gel:</strong> Neutraliseert geuren</li></ul>')
    ),
    'faq', jsonb_build_array(
      jsonb_build_object('question', 'Hoe lang blijft wiet geur hangen?', 'answer', 'In de lucht: 1-3 uur. In kleding/stoffen: uren tot dagen zonder wassen.'),
      jsonb_build_object('question', 'Wat is de beste manier om geen geur te hebben?', 'answer', 'Vapen in plaats van roken, of buiten roken. Bewaren in luchtdichte pot.')
    )
  ),
  'faq',
  true,
  now()
) ON CONFLICT (slug) DO UPDATE SET content = EXCLUDED.content, last_updated = now();

-- 17. Wiet Grinder
INSERT INTO seo_content_pages (slug, title, h1_title, meta_description, meta_keywords, content, page_type, is_published, last_updated)
VALUES (
  'wiet-grinder',
  'Wiet Grinder: Welke Kiezen? | Wietforum',
  'De Beste Wiet Grinder Kiezen',
  'Alles over grinders. 2-delig vs 4-delig, materiaal en hoe gebruik je een grinder correct.',
  ARRAY['wiet grinder', 'crusher wiet', 'grinder kopen', 'kief vangen'],
  jsonb_build_object(
    'sections', jsonb_build_array(
      jsonb_build_object('heading', 'Waarom een Grinder?', 'content', '<p>Een grinder maalt wiet fijn voor:</p><ul><li>Betere verbranding/verdamping</li><li>Gelijkmatige joints</li><li>Kief verzamelen (4-delig)</li><li>Minder plakkerige vingers</li></ul>'),
      jsonb_build_object('heading', 'Soorten', 'content', '<p><strong>2-delig:</strong> Simpel, alleen malen</p><p><strong>3-delig:</strong> Met opvangbakje</p><p><strong>4-delig:</strong> Met kief-opvang (zeef)</p><p>Voor de meesten is <strong>4-delig</strong> de beste keuze.</p>'),
      jsonb_build_object('heading', 'Materiaal', 'content', '<ul><li><strong>Aluminium:</strong> Licht, betaalbaar, meest populair</li><li><strong>Zink:</strong> Zwaarder, duurzaam</li><li><strong>Plastic:</strong> Goedkoop maar breekt snel</li><li><strong>Hout:</strong> Traditioneel, geen kief-opvang</li></ul>'),
      jsonb_build_object('heading', 'Gebruik', 'content', '<ol><li>Breek buds in kleinere stukjes</li><li>Plaats tussen de tanden (niet in het midden)</li><li>Draai 10-15 keer</li><li>Open en gebruik gemalen wiet</li><li>Laat kief opbouwen in onderste compartiment</li></ol>')
    ),
    'faq', jsonb_build_array(
      jsonb_build_object('question', 'Welke grinder is het beste?', 'answer', '4-delige aluminium grinder met kief-opvang. Santa Cruz Shredder en Space Case zijn premium.'),
      jsonb_build_object('question', 'Hoe maak ik mijn grinder schoon?', 'answer', 'Week in isopropyl alcohol, gebruik tandenstoker voor restjes, spoel en droog goed.')
    )
  ),
  'faq',
  true,
  now()
) ON CONFLICT (slug) DO UPDATE SET content = EXCLUDED.content, last_updated = now();

-- 18. Kief Gebruiken
INSERT INTO seo_content_pages (slug, title, h1_title, meta_description, meta_keywords, content, page_type, is_published, last_updated)
VALUES (
  'kief-gebruiken',
  'Kief: Wat Is Het & Hoe Gebruik Je Het? | Wietforum',
  'Kief Verzamelen en Gebruiken',
  'Wat is kief, hoe verzamel je het en wat kun je ermee? De sterkste delen van de plant.',
  ARRAY['kief', 'kief gebruiken', 'trichomen verzamelen', 'dry sift'],
  jsonb_build_object(
    'sections', jsonb_build_array(
      jsonb_build_object('heading', 'Wat Is Kief?', 'content', '<p>Kief zijn de <strong>losgekomen trichomen</strong> (kristallen) van cannabis. Het is in feite puur cannabinoïden en terpenen - het sterkste deel van de plant.</p>'),
      jsonb_build_object('heading', 'Hoe Verzamelen', 'content', '<ul><li><strong>Grinder met kief-opvang:</strong> Bouwt langzaam op</li><li><strong>Droge zeef/pollen box:</strong> Grotere hoeveelheden</li><li><strong>Tip:</strong> Doe een muntje in je grinder voor meer kief</li></ul>'),
      jsonb_build_object('heading', 'Hoe Gebruiken', 'content', '<p><strong>Op joint/bowl:</strong> Strooi bovenop voor extra kracht</p><p><strong>Moon rocks:</strong> Bud + olie + kief = super sterk</p><p><strong>Hash maken:</strong> Pers kief met warmte tot hash</p><p><strong>Edibles:</strong> Decarboxyleer eerst, voeg toe aan recept</p><p><strong>Vapen:</strong> Voeg toe aan je vape chamber</p>'),
      jsonb_build_object('heading', 'Sterkte', 'content', '<p>Kief bevat <strong>40-60% THC</strong>, veel sterker dan bloemen (15-25%). Doseer voorzichtig!</p>')
    ),
    'faq', jsonb_build_array(
      jsonb_build_object('question', 'Is kief sterker dan wiet?', 'answer', 'Ja, aanzienlijk. Kief bevat 40-60% THC vs 15-25% bij bloemen.'),
      jsonb_build_object('question', 'Hoe maak ik hash van kief?', 'answer', 'Wikkel kief in perkamentpapier, warm op en pers met fles heet water of strijkijzer.')
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
  RAISE NOTICE 'TIER 3 Consumptie Methodes paginas succesvol aangemaakt';
  RAISE NOTICE 'Totaal: 18 paginas';
END $$;

