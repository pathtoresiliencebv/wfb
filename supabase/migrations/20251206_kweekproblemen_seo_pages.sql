-- =====================================================
-- KWEEKPROBLEMEN SEO PAGINA'S
-- Probleemoplossende content voor kwekers
-- =====================================================

-- 1. Gele Bladeren Wiet
INSERT INTO seo_content_pages (slug, title, h1_title, meta_description, meta_keywords, content, page_type, is_published, last_updated)
VALUES (
  'gele-bladeren-wiet',
  'Gele Bladeren bij Wiet: Oorzaken & Oplossingen | Wietforum',
  'Waarom Heeft Mijn Wietplant Gele Bladeren?',
  'Gele bladeren bij cannabis? Ontdek de oorzaak en oplossing. Van stikstoftekort tot pH problemen.',
  ARRAY['gele bladeren wiet', 'wietplant geel', 'bladeren verkleuren', 'yellow leaves'],
  jsonb_build_object(
    'sections', jsonb_build_array(
      jsonb_build_object('heading', 'Meest Voorkomende Oorzaken', 'content', '<p>Gele bladeren kunnen meerdere oorzaken hebben:</p><ol><li><strong>Stikstoftekort</strong> - Meest voorkomend</li><li><strong>pH probleem</strong> - Nutrient lockout</li><li><strong>Overwatering</strong> - Wortelproblemen</li><li><strong>Lichtverbranding</strong> - Te dicht bij lamp</li><li><strong>Natuurlijk afsterven</strong> - Oudere bladeren onderaan</li></ol>'),
      jsonb_build_object('heading', 'Stikstoftekort (N)', 'content', '<p><strong>Symptomen:</strong></p><ul><li>Geelkleuring begint onderaan de plant</li><li>Bladeren worden lichtgroen tot geel</li><li>Oude bladeren vallen af</li></ul><p><strong>Oplossing:</strong> Voeg stikstofrijke voeding toe (groeivoeding)</p>'),
      jsonb_build_object('heading', 'pH Probleem', 'content', '<p><strong>Symptomen:</strong></p><ul><li>Gevlekte gele bladeren</li><li>Willekeurig patroon</li><li>Andere tekorten verschijnen ook</li></ul><p><strong>Oplossing:</strong> Check en corrigeer pH (aarde: 6.0-7.0)</p>'),
      jsonb_build_object('heading', 'Overwatering', 'content', '<p><strong>Symptomen:</strong></p><ul><li>Geel en slap</li><li>Aarde blijft lang nat</li><li>Trage groei</li></ul><p><strong>Oplossing:</strong> Laat uitdrogen voor volgende watergift</p>'),
      jsonb_build_object('heading', 'Wanneer Normaal?', 'content', '<p>Tijdens late bloei is enige vergeling <strong>normaal</strong>. De plant trekt voedingsstoffen uit de bladeren naar de buds. Dit is geen probleem.</p>')
    ),
    'faq', jsonb_build_array(
      jsonb_build_object('question', 'Zijn gele bladeren ernstig?', 'answer', 'Hangt af van de oorzaak. Enkele gele bladeren onderaan is normaal. Massale vergeling duidt op een probleem.'),
      jsonb_build_object('question', 'Moet ik gele bladeren verwijderen?', 'answer', 'Wacht tot ze grotendeels geel zijn. De plant haalt nog voedingsstoffen eruit.')
    )
  ),
  'faq',
  true,
  now()
) ON CONFLICT (slug) DO UPDATE SET content = EXCLUDED.content, last_updated = now();

-- 2. Voedingstekort Cannabis
INSERT INTO seo_content_pages (slug, title, h1_title, meta_description, meta_keywords, content, page_type, is_published, last_updated)
VALUES (
  'voedingstekort-cannabis',
  'Voedingstekorten bij Cannabis Herkennen | Wietforum',
  'Voedingstekorten Diagnosticeren',
  'Leer voedingstekorten herkennen bij cannabis. Stikstof, fosfor, kalium en meer. Met foto voorbeelden.',
  ARRAY['voedingstekort wiet', 'deficiency cannabis', 'gebrek wiet', 'nutrient deficiency'],
  jsonb_build_object(
    'sections', jsonb_build_array(
      jsonb_build_object('heading', 'Mobiel vs Immobiel', 'content', '<p><strong>Mobiele nutriënten</strong> (N, P, K, Mg): Tekort verschijnt eerst ONDERAAN (plant verplaatst naar nieuwe groei)</p><p><strong>Immobiele nutriënten</strong> (Ca, Fe, Mn, B, Cu, Zn): Tekort verschijnt BOVENAAN (plant kan niet verplaatsen)</p>'),
      jsonb_build_object('heading', 'Stikstof (N) Tekort', 'content', '<p><strong>Symptomen:</strong> Lichtgroene tot gele bladeren, begint onderaan</p><p><strong>Rol:</strong> Groei, chlorofyl productie</p><p><strong>Fix:</strong> Groeivoeding, pH checken</p>'),
      jsonb_build_object('heading', 'Fosfor (P) Tekort', 'content', '<p><strong>Symptomen:</strong> Donkergroene bladeren met paarse stengels, vertraagde groei</p><p><strong>Rol:</strong> Wortelgroei, bloei, energie</p><p><strong>Fix:</strong> Bloeivoeding, pH checken</p>'),
      jsonb_build_object('heading', 'Kalium (K) Tekort', 'content', '<p><strong>Symptomen:</strong> Bruine randen, bladeren zien er "verbrand" uit</p><p><strong>Rol:</strong> Water regulatie, bloemontwikkeling</p><p><strong>Fix:</strong> Bloeivoeding, potassium supplement</p>'),
      jsonb_build_object('heading', 'Calcium (Ca) Tekort', 'content', '<p><strong>Symptomen:</strong> Vervorming nieuwe groei, bruine vlekken</p><p><strong>Rol:</strong> Celwandstructuur</p><p><strong>Fix:</strong> Cal-Mag supplement, pH omhoog</p>'),
      jsonb_build_object('heading', 'Magnesium (Mg) Tekort', 'content', '<p><strong>Symptomen:</strong> Intervenale chlorose (geel tussen de nerven)</p><p><strong>Rol:</strong> Chlorofyl productie</p><p><strong>Fix:</strong> Epsom zout, Cal-Mag</p>')
    ),
    'faq', jsonb_build_array(
      jsonb_build_object('question', 'Hoe weet ik welk tekort het is?', 'answer', 'Kijk waar symptomen beginnen (boven/onder) en het patroon. Foto vergelijking helpt ook.'),
      jsonb_build_object('question', 'Kan ik meerdere tekorten hebben?', 'answer', 'Ja, vaak is de onderliggende oorzaak pH probleem waardoor meerdere nutriënten niet opgenomen worden.')
    )
  ),
  'pillar',
  true,
  now()
) ON CONFLICT (slug) DO UPDATE SET content = EXCLUDED.content, last_updated = now();

-- 3. Schimmel Wietplant
INSERT INTO seo_content_pages (slug, title, h1_title, meta_description, meta_keywords, content, page_type, is_published, last_updated)
VALUES (
  'schimmel-wietplant',
  'Schimmel op Wietplant: Herkennen & Behandelen | Wietforum',
  'Schimmel bij Cannabis',
  'Schimmel op je wietplant? Leer botrytis (bud rot) en meeldauw herkennen en bestrijden.',
  ARRAY['schimmel wietplant', 'bud rot', 'botrytis cannabis', 'wiet schimmel'],
  jsonb_build_object(
    'sections', jsonb_build_array(
      jsonb_build_object('heading', 'Soorten Schimmel', 'content', '<p><strong>Botrytis (Bud Rot):</strong> Grijze schimmel, groeit VAN BINNEN de buds</p><p><strong>Meeldauw:</strong> Wit poeder op bladeren</p><p><strong>Pythium:</strong> Wortelrot</p>'),
      jsonb_build_object('heading', 'Bud Rot Herkennen', 'content', '<p><strong>Let op:</strong></p><ul><li>Grijze, dode bladeren die uit bud steken</li><li>Bruine, zachte buds van binnen</li><li>Muffe geur</li><li>Grijs-witte schimmeldraden</li></ul><p><strong>Vaak na:</strong> Veel regen, hoge luchtvochtigheid, slechte ventilatie</p>'),
      jsonb_build_object('heading', 'Behandeling', 'content', '<p><strong>Bud rot:</strong></p><ol><li>Verwijder aangetaste delen RUIM (schaar ontsmetten)</li><li>Verbeter ventilatie</li><li>Verlaag luchtvochtigheid</li><li>Check dagelijks op meer</li></ol><p><strong>Meeldauw:</strong></p><ul><li>Spray met melk-water oplossing (40:60)</li><li>Verwijder aangetaste bladeren</li><li>Verbeter luchtcirculatie</li></ul>'),
      jsonb_build_object('heading', 'Preventie', 'content', '<ul><li>Luchtvochtigheid onder 50% in bloei</li><li>Goede luchtcirculatie</li><li>Verwijder dicht blad (lollipopping)</li><li>Schimmelresistente strains kiezen</li><li>Niet te dichte planten</li></ul>')
    ),
    'faq', jsonb_build_array(
      jsonb_build_object('question', 'Kan ik beschimmelde wiet roken?', 'answer', 'ABSOLUUT NIET. Schimmelsporen kunnen ernstige longinfecties veroorzaken.'),
      jsonb_build_object('question', 'Hoe voorkom ik bud rot outdoor?', 'answer', 'Kies schimmelresistente strains, schud planten droog na regen, oogst niet te laat.')
    )
  ),
  'faq',
  true,
  now()
) ON CONFLICT (slug) DO UPDATE SET content = EXCLUDED.content, last_updated = now();

-- 4. Botrytis Cannabis
INSERT INTO seo_content_pages (slug, title, h1_title, meta_description, meta_keywords, content, page_type, is_published, last_updated)
VALUES (
  'botrytis-cannabis',
  'Botrytis (Bud Rot): De Grootste Vijand | Wietforum',
  'Botrytis: Bud Rot Voorkomen en Bestrijden',
  'Botrytis cinerea is de schimmel die bud rot veroorzaakt. Leer het herkennen en voorkomen.',
  ARRAY['botrytis cannabis', 'bud rot', 'gray mold', 'grauwe schimmel'],
  jsonb_build_object(
    'sections', jsonb_build_array(
      jsonb_build_object('heading', 'Wat Is Botrytis?', 'content', '<p><strong>Botrytis cinerea</strong> (grauwe schimmel) is de schimmel die "bud rot" veroorzaakt. Het is de meest verwoestende schimmelziekte bij cannabis, vooral outdoor en in vochtige klimaten zoals België.</p>'),
      jsonb_build_object('heading', 'Risicofactoren', 'content', '<ul><li><strong>Hoge luchtvochtigheid:</strong> >60%</li><li><strong>Slechte ventilatie</strong></li><li><strong>Dichte, compacte buds</strong></li><li><strong>Beschadigingen:</strong> Via wonden komt schimmel binnen</li><li><strong>Regen en dauw</strong></li></ul>'),
      jsonb_build_object('heading', 'Vroege Tekenen', 'content', '<ol><li>Kleine bruine/grijze vlekjes op suikerblaadjes</li><li>Bladeren die uit de bud steken worden geel/bruin</li><li>Buds voelen zachter aan</li><li>Muffe geur</li></ol><p>Check dagelijks in september/oktober!</p>'),
      jsonb_build_object('heading', 'Wat Te Doen', 'content', '<p><strong>Bij ontdekking:</strong></p><ol><li>Verwijder ALLE zichtbaar aangetaste delen</li><li>Snij 2-3 cm verder dan de schimmel</li><li>Ontsmet gereedschap tussen sneden</li><li>Overweeg vroeger oogsten</li><li>Droog en inspecteer alle buds</li></ol>')
    ),
    'faq', jsonb_build_array(
      jsonb_build_object('question', 'Kan ik botrytis behandelen?', 'answer', 'Je kunt het beperken door aangetaste delen te verwijderen, maar het is niet te genezen. Preventie is key.'),
      jsonb_build_object('question', 'Verspreidt botrytis naar andere planten?', 'answer', 'Ja, de sporen verspreiden via lucht. Isoleer of verwijder zwaar aangetaste planten.')
    )
  ),
  'article',
  true,
  now()
) ON CONFLICT (slug) DO UPDATE SET content = EXCLUDED.content, last_updated = now();

-- 5. Spintmijt Wiet
INSERT INTO seo_content_pages (slug, title, h1_title, meta_description, meta_keywords, content, page_type, is_published, last_updated)
VALUES (
  'spintmijt-wiet',
  'Spintmijt bij Cannabis: Bestrijden & Voorkomen | Wietforum',
  'Spintmijt op Wietplanten',
  'Spintmijt (spider mites) zijn een veelvoorkomende plaag. Leer ze herkennen en bestrijden.',
  ARRAY['spintmijt wiet', 'spider mites cannabis', 'spint bestrijden', 'mijten wietplant'],
  jsonb_build_object(
    'sections', jsonb_build_array(
      jsonb_build_object('heading', 'Wat Zijn Spintmijten?', 'content', '<p>Spintmijten zijn <strong>microscopisch kleine spinachtige</strong> die de onderkant van bladeren zuigen. Ze vermenigvuldigen extreem snel en kunnen een kweek vernietigen.</p>'),
      jsonb_build_object('heading', 'Herkennen', 'content', '<ul><li>Kleine gele/witte stipjes op bladeren (zuigschade)</li><li>Fijne webben aan onderkant bladeren (bij ernstige infectie)</li><li>Bladeren worden geel en vallen af</li><li>Kleine bewegende puntjes (met loep zichtbaar)</li></ul>'),
      jsonb_build_object('heading', 'Bestrijden', 'content', '<p><strong>Biologisch:</strong></p><ul><li>Roofmijten (Phytoseiulus persimilis)</li><li>Neemolie spray</li><li>Insecticidal soap</li></ul><p><strong>Chemisch (niet in bloei!):</strong></p><ul><li>Pyrethrine sprays</li><li>Miticides</li></ul><p><strong>Fysiek:</strong></p><ul><li>Bladeren afvegen/spoelen</li><li>Aangetaste bladeren verwijderen</li></ul>'),
      jsonb_build_object('heading', 'Preventie', 'content', '<ul><li>Quarantaine nieuwe planten/klonen</li><li>Schone kweekruimte</li><li>Niet te warm en droog (mijten houden van warmte)</li><li>Regelmatige inspectie</li></ul>')
    ),
    'faq', jsonb_build_array(
      jsonb_build_object('question', 'Hoe snel verspreiden spintmijten?', 'answer', 'Zeer snel. Een wijfje legt 20+ eitjes per dag. Binnen weken kan een kweek overgenomen zijn.'),
      jsonb_build_object('question', 'Kan ik in bloei nog spuiten?', 'answer', 'Alleen biologische middelen en voorzichtig. Chemische middelen kunnen residu achterlaten.')
    )
  ),
  'faq',
  true,
  now()
) ON CONFLICT (slug) DO UPDATE SET content = EXCLUDED.content, last_updated = now();

-- 6. Trips Cannabis
INSERT INTO seo_content_pages (slug, title, h1_title, meta_description, meta_keywords, content, page_type, is_published, last_updated)
VALUES (
  'trips-cannabis',
  'Trips bij Cannabis: Herkennen & Bestrijden | Wietforum',
  'Trips op Wietplanten',
  'Trips (thrips) veroorzaken zilveren vlekken op bladeren. Leer deze plaag herkennen en bestrijden.',
  ARRAY['trips cannabis', 'thrips wiet', 'trips bestrijden', 'zilveren vlekken'],
  jsonb_build_object(
    'sections', jsonb_build_array(
      jsonb_build_object('heading', 'Wat Zijn Trips?', 'content', '<p>Trips zijn kleine, langwerpige insecten (1-2mm) die plantensap zuigen. Ze komen vaak binnen via klonen of besmet materiaal.</p>'),
      jsonb_build_object('heading', 'Herkennen', 'content', '<ul><li><strong>Zilveren/bronzen vlekken</strong> op bladeren</li><li>Kleine zwarte stipjes (uitwerpselen)</li><li>Vervorming nieuwe groei</li><li>Kleine insecten zichtbaar met loep</li></ul>'),
      jsonb_build_object('heading', 'Bestrijden', 'content', '<p><strong>Biologisch:</strong></p><ul><li>Roofmijt Amblyseius cucumeris</li><li>Roofwants Orius</li><li>Neemolie</li><li>Spinosad</li></ul><p><strong>Fysiek:</strong></p><ul><li>Blauwe vangplaten</li><li>Aangetaste bladeren verwijderen</li></ul>'),
      jsonb_build_object('heading', 'Preventie', 'content', '<ul><li>Quarantaine klonen/nieuwe planten</li><li>Vangplaten voor early detection</li><li>Goede hygiëne in kweekruimte</li></ul>')
    ),
    'faq', jsonb_build_array(
      jsonb_build_object('question', 'Zijn trips gevaarlijk?', 'answer', 'Ze veroorzaken schade en kunnen virussen overbrengen, maar zijn meestal niet dodelijk voor de plant.'),
      jsonb_build_object('question', 'Waar komen trips vandaan?', 'answer', 'Vaak via klonen, besmet materiaal of outdoor via open ramen.')
    )
  ),
  'faq',
  true,
  now()
) ON CONFLICT (slug) DO UPDATE SET content = EXCLUDED.content, last_updated = now();

-- 7. Overbemesting Wiet
INSERT INTO seo_content_pages (slug, title, h1_title, meta_description, meta_keywords, content, page_type, is_published, last_updated)
VALUES (
  'overbemesting-wiet',
  'Overbemesting bij Cannabis: Nutrient Burn | Wietforum',
  'Overbemesting Herkennen en Oplossen',
  'Teveel voeding gegeven? Herken nutrient burn en leer hoe je het oplost zonder schade.',
  ARRAY['overbemesting wiet', 'nutrient burn', 'teveel voeding', 'verbranding bladeren'],
  jsonb_build_object(
    'sections', jsonb_build_array(
      jsonb_build_object('heading', 'Wat Is Overbemesting?', 'content', '<p>Overbemesting (nutrient burn) ontstaat wanneer je <strong>teveel voeding</strong> geeft. De bladpunten "verbranden" door te hoge zoutconcentratie in de grond.</p>'),
      jsonb_build_object('heading', 'Herkennen', 'content', '<ul><li><strong>Verbrande bladpunten:</strong> Geel/bruin, droog</li><li>Krullende bladeren</li><li>Donkergroene bladeren (te veel stikstof)</li><li>Bruine vlekken</li><li>Trage groei ondanks voeding</li></ul>'),
      jsonb_build_object('heading', 'Oplossing', 'content', '<ol><li><strong>Stop met voeding geven</strong></li><li><strong>Spoel de grond:</strong> 3x potvolume aan pH-neutraal water erdoor</li><li><strong>Laat uitdrogen</strong> voor volgende watergift</li><li><strong>Start opnieuw:</strong> Met HALVE dosis van wat je gaf</li></ol>'),
      jsonb_build_object('heading', 'Preventie', 'content', '<ul><li>Start altijd met minder dan de aanbevolen dosis</li><li>Bouw geleidelijk op</li><li>Check EC/PPM van je voedingswater</li><li>Minder is meer bij cannabis</li></ul>')
    ),
    'faq', jsonb_build_array(
      jsonb_build_object('question', 'Herstelt de plant van nutrient burn?', 'answer', 'Verbrande bladeren herstellen niet, maar de plant kan nieuwe gezonde groei maken na correctie.'),
      jsonb_build_object('question', 'Hoeveel spoelwater moet ik gebruiken?', 'answer', 'Minimaal 3x het potvolume. 11L pot = 33L spoelwater.')
    )
  ),
  'faq',
  true,
  now()
) ON CONFLICT (slug) DO UPDATE SET content = EXCLUDED.content, last_updated = now();

-- 8. Hermafrodiet Wietplant
INSERT INTO seo_content_pages (slug, title, h1_title, meta_description, meta_keywords, content, page_type, is_published, last_updated)
VALUES (
  'hermafrodiet-wietplant',
  'Hermafrodiet Wietplant: Oorzaken & Oplossingen | Wietforum',
  'Hermafrodiet Cannabis Plant',
  'Je plant toont zowel mannelijke als vrouwelijke bloemen? Dit is hermafroditisme. Oorzaken en wat te doen.',
  ARRAY['hermafrodiet wiet', 'herm cannabis', 'bananen wiet', 'mannelijke bloemen vrouwelijke plant'],
  jsonb_build_object(
    'sections', jsonb_build_array(
      jsonb_build_object('heading', 'Wat Is Hermafroditisme?', 'content', '<p>Een hermafrodiet plant ontwikkelt zowel <strong>mannelijke als vrouwelijke bloemen</strong>. Dit kan leiden tot zelfbestuiving en zaadvorming in je buds.</p>'),
      jsonb_build_object('heading', 'Herkennen', 'content', '<ul><li><strong>Bananen:</strong> Gele, gebogen mannelijke bloemen tussen de buds</li><li><strong>Pollenozakjes:</strong> Balletjes aan steeltjes tussen vrouwelijke bloemen</li><li>Vaak laat in bloei, bij stress</li></ul>'),
      jsonb_build_object('heading', 'Oorzaken', 'content', '<p><strong>Stress factoren:</strong></p><ul><li>Lichtlekkage tijdens donkerperiode</li><li>Hittestress</li><li>Onregelmatig lichtschema</li><li>Fysieke schade</li><li>Te laat oogsten</li><li>Genetische aanleg (sommige strains)</li></ul>'),
      jsonb_build_object('heading', 'Wat Te Doen', 'content', '<p><strong>Weinig herms, vroeg ontdekt:</strong></p><ul><li>Verwijder mannelijke bloemen voorzichtig</li><li>Check dagelijks op meer</li><li>Minimaliseer stress</li></ul><p><strong>Veel herms/laat ontdekt:</strong></p><ul><li>Overweeg de plant te verwijderen</li><li>Of accepteer wat zaadjes in de oogst</li></ul>')
    ),
    'faq', jsonb_build_array(
      jsonb_build_object('question', 'Zijn zaden van herms bruikbaar?', 'answer', 'Ze groeien, maar hebben genetische aanleg voor hermafroditisme. Beter niet gebruiken.'),
      jsonb_build_object('question', 'Hoe voorkom ik hermafroditisme?', 'answer', 'Minimaliseer stress: consistent lichtschema, geen lichtlekkage, stabiele temperatuur.')
    )
  ),
  'faq',
  true,
  now()
) ON CONFLICT (slug) DO UPDATE SET content = EXCLUDED.content, last_updated = now();

-- 9. Meeldauw Wiet
INSERT INTO seo_content_pages (slug, title, h1_title, meta_description, meta_keywords, content, page_type, is_published, last_updated)
VALUES (
  'meeldauw-wiet',
  'Meeldauw op Wietplant: Bestrijden | Wietforum',
  'Meeldauw bij Cannabis',
  'Wit poeder op je bladeren? Dat is meeldauw. Leer het bestrijden en voorkomen.',
  ARRAY['meeldauw wiet', 'powdery mildew', 'wit poeder bladeren', 'witziekte cannabis'],
  jsonb_build_object(
    'sections', jsonb_build_array(
      jsonb_build_object('heading', 'Wat Is Meeldauw?', 'content', '<p>Meeldauw (powdery mildew) is een <strong>schimmelinfectie</strong> die een wit, poederachtig laagje op bladeren vormt. Het verspreidt via sporen door de lucht.</p>'),
      jsonb_build_object('heading', 'Herkennen', 'content', '<ul><li>Witte, poederige vlekken op bladeren</li><li>Begint vaak op oudere bladeren</li><li>Verspreidt zich snel naar hele plant</li><li>Bladeren kunnen geel worden en afsterven</li></ul>'),
      jsonb_build_object('heading', 'Bestrijden', 'content', '<p><strong>Biologische opties:</strong></p><ul><li><strong>Melk spray:</strong> 40% melk, 60% water</li><li><strong>Baksoda spray:</strong> 1 eetlepel per liter + druppel afwasmiddel</li><li><strong>Neemolie</strong></li><li><strong>Peroxide spray:</strong> H2O2 verdund</li></ul><p>Spray elke 3-5 dagen. NIET in bloei op buds sproeien!</p>'),
      jsonb_build_object('heading', 'Preventie', 'content', '<ul><li>Goede luchtcirculatie</li><li>Niet te vochtig (RV <60%)</li><li>Niet te dicht beplanten</li><li>Schone kweekruimte</li><li>Regelmatige inspectie</li></ul>')
    ),
    'faq', jsonb_build_array(
      jsonb_build_object('question', 'Is meeldauw schadelijk voor de oogst?', 'answer', 'Als het de buds bereikt, ja. Beschimmelde buds moet je niet consumeren.'),
      jsonb_build_object('question', 'Kan meeldauw zich naar andere planten verspreiden?', 'answer', 'Ja, via sporen door de lucht. Isoleer aangetaste planten.')
    )
  ),
  'faq',
  true,
  now()
) ON CONFLICT (slug) DO UPDATE SET content = EXCLUDED.content, last_updated = now();

-- 10. Wortelrot Cannabis
INSERT INTO seo_content_pages (slug, title, h1_title, meta_description, meta_keywords, content, page_type, is_published, last_updated)
VALUES (
  'wortelrot-cannabis',
  'Wortelrot bij Cannabis: Oorzaken & Behandeling | Wietforum',
  'Wortelrot (Root Rot) bij Cannabis',
  'Bruine, slijmerige wortels? Dat is wortelrot. Oorzaken, behandeling en preventie.',
  ARRAY['wortelrot cannabis', 'root rot', 'pythium wiet', 'zieke wortels'],
  jsonb_build_object(
    'sections', jsonb_build_array(
      jsonb_build_object('heading', 'Wat Is Wortelrot?', 'content', '<p>Wortelrot wordt veroorzaakt door <strong>pathogene schimmels</strong> (Pythium, Fusarium) die wortels aantasten. Gezonde wortels zijn wit; zieke wortels bruin en slijmerig.</p>'),
      jsonb_build_object('heading', 'Oorzaken', 'content', '<ul><li><strong>Overwatering</strong> - Belangrijkste oorzaak</li><li>Slechte drainage</li><li>Te hoge temperatuur water/medium</li><li>Geen zuurstof bij wortels (hydro)</li><li>Besmette grond of klonen</li></ul>'),
      jsonb_build_object('heading', 'Symptomen', 'content', '<ul><li>Slap hangende plant ondanks natte grond</li><li>Trage/gestopte groei</li><li>Bruine, slijmerige wortels</li><li>Rotte geur uit pot/systeem</li><li>Bladeren worden geel</li></ul>'),
      jsonb_build_object('heading', 'Behandeling', 'content', '<p><strong>In aarde:</strong></p><ol><li>Laat grond volledig uitdrogen</li><li>Voeg beneficials toe (mycorrhiza, Trichoderma)</li><li>Verpot met schone grond en goede drainage</li></ol><p><strong>In hydro:</strong></p><ul><li>Hydrogen peroxide toevoegen</li><li>Watertemperatuur verlagen (<20°C)</li><li>Meer zuurstof (airstone)</li></ul>'),
      jsonb_build_object('heading', 'Preventie', 'content', '<ul><li>Water alleen als grond droog is</li><li>Goede drainage (perliet)</li><li>Niet te warm in rootzone</li><li>Beneficials toevoegen preventief</li></ul>')
    ),
    'faq', jsonb_build_array(
      jsonb_build_object('question', 'Kan een plant herstellen van wortelrot?', 'answer', 'Als vroeg genoeg ontdekt, ja. Ernstige gevallen zijn vaak niet te redden.'),
      jsonb_build_object('question', 'Hoe check ik wortels in aarde?', 'answer', 'Til de plant voorzichtig uit de pot. Gezonde wortels zijn wit, zieke bruin/slijmerig.')
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
  RAISE NOTICE 'Kweekproblemen paginas succesvol aangemaakt';
  RAISE NOTICE 'Totaal: 10 paginas';
END $$;

