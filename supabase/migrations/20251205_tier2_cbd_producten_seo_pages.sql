-- =====================================================
-- TIER 2: CBD PRODUCTEN SEO PAGINA'S
-- 15 keywords over CBD olie, producten en medisch gebruik
-- =====================================================

-- 1. CBD Olie België
INSERT INTO seo_content_pages (slug, title, h1_title, meta_description, meta_keywords, content, page_type, is_published, last_updated)
VALUES (
  'cbd-olie-belgie',
  'CBD Olie België: Legaal Kopen & Gebruiken | Wietforum',
  'CBD Olie in België',
  'Alles over CBD olie in België. Waar kopen, is het legaal, werking en dosering. Complete gids.',
  ARRAY['cbd olie belgie', 'cbd olie kopen', 'cbd belgie', 'cannabidiol olie'],
  jsonb_build_object(
    'sections', jsonb_build_array(
      jsonb_build_object('heading', 'Is CBD Olie Legaal in België?', 'content', '<p><strong>Ja, CBD olie is legaal</strong> in België mits:</p><ul><li>THC-gehalte is lager dan 0,3%</li><li>Product is gemaakt van toegestane hennepvariëteiten</li><li>Het wordt verkocht als voedingssupplement (geen medische claims)</li></ul>'),
      jsonb_build_object('heading', 'Wat Is CBD?', 'content', '<p><strong>Cannabidiol (CBD)</strong> is een niet-psychoactieve cannabinoïde uit de cannabisplant. In tegenstelling tot THC word je er niet high van.</p><p>Veel mensen gebruiken CBD voor:</p><ul><li>Ontspanning en stressverlichting</li><li>Beter slapen</li><li>Pijn- en ontstekingsverlichting</li><li>Algemeen welzijn</li></ul>'),
      jsonb_build_object('heading', 'Waar CBD Olie Kopen?', 'content', '<p><strong>Online shops:</strong></p><ul><li>CBDenzo.be</li><li>Cibdol.nl</li><li>Nordic Oil</li></ul><p><strong>Fysieke winkels:</strong></p><ul><li>Apotheek (beperkt aanbod)</li><li>CBD specialzaken</li><li>Sommige biomarkten</li></ul>'),
      jsonb_build_object('heading', 'Dosering & Gebruik', 'content', '<p><strong>Start laag:</strong> Begin met 5-10 mg per dag</p><p><strong>Bouw op:</strong> Verhoog elke week met 5 mg tot gewenst effect</p><p><strong>Gebruik:</strong> Druppels onder de tong, 30-60 seconden houden</p><p><strong>Tijdstip:</strong> Afhankelijk van doel (ochtend voor focus, avond voor slaap)</p>')
    ),
    'faq', jsonb_build_array(
      jsonb_build_object('question', 'Is CBD olie legaal in België?', 'answer', 'Ja, CBD olie met minder dan 0,3% THC is legaal te koop in België.'),
      jsonb_build_object('question', 'Word je high van CBD?', 'answer', 'Nee, CBD is niet psychoactief en geeft geen high.')
    )
  ),
  'pillar',
  true,
  now()
) ON CONFLICT (slug) DO UPDATE SET content = EXCLUDED.content, last_updated = now();

-- 2. CBD Kopen België
INSERT INTO seo_content_pages (slug, title, h1_title, meta_description, meta_keywords, content, page_type, is_published, last_updated)
VALUES (
  'cbd-kopen-belgie',
  'CBD Kopen in België: Beste Shops & Producten | Wietforum',
  'CBD Producten Kopen in België',
  'Waar kun je CBD producten kopen in België? Vergelijking van beste CBD shops, olie, capsules en meer.',
  ARRAY['cbd kopen belgie', 'cbd producten', 'cbd winkel', 'cbd shop belgie'],
  jsonb_build_object(
    'sections', jsonb_build_array(
      jsonb_build_object('heading', 'Soorten CBD Producten', 'content', '<ul><li><strong>CBD Olie:</strong> Meest populair, druppels onder de tong</li><li><strong>CBD Capsules:</strong> Makkelijk doseren, geen smaak</li><li><strong>CBD E-liquid:</strong> Voor vapen</li><li><strong>CBD Crème:</strong> Lokale toepassing op huid</li><li><strong>CBD Bloemen:</strong> Te roken of verdampen</li><li><strong>CBD Edibles:</strong> Gummies, chocolade etc.</li></ul>'),
      jsonb_build_object('heading', 'Waar Kopen?', 'content', '<p><strong>Online (grootste keuze):</strong></p><ul><li>CBDenzo.be - Belgische webshop</li><li>Cibdol - Zwitserse kwaliteit</li><li>Nordic Oil - Premium producten</li></ul><p><strong>Fysiek (advies ter plaatse):</strong></p><ul><li>CBD specialzaken in grotere steden</li><li>Sommige apotheken</li><li>Biomarkten</li></ul>'),
      jsonb_build_object('heading', 'Kwaliteitstips', 'content', '<ul><li>Check labresultaten (COA - Certificate of Analysis)</li><li>Kies full-spectrum voor entourage effect</li><li>Let op THC-gehalte (<0,3%)</li><li>Biologisch hennep indien mogelijk</li><li>Lees reviews van andere gebruikers</li></ul>')
    ),
    'faq', jsonb_build_array(
      jsonb_build_object('question', 'Welke CBD product is het beste?', 'answer', 'CBD olie is het meest populair en effectief. Capsules zijn handig voor onderweg.'),
      jsonb_build_object('question', 'Hoeveel kost CBD olie?', 'answer', 'Kwaliteits CBD olie kost €25-50 voor een flesje van 10ml (5-10%).')
    )
  ),
  'article',
  true,
  now()
) ON CONFLICT (slug) DO UPDATE SET content = EXCLUDED.content, last_updated = now();

-- 3. CBD Bloemen Legaal België
INSERT INTO seo_content_pages (slug, title, h1_title, meta_description, meta_keywords, content, page_type, is_published, last_updated)
VALUES (
  'cbd-bloemen-legaal-belgie',
  'CBD Bloemen in België: Legaal of Niet? | Wietforum',
  'CBD Bloemen in België: Juridische Status',
  'Zijn CBD bloemen legaal in België? De ingewikkelde juridische situatie uitgelegd. Wat mag wel en niet?',
  ARRAY['cbd bloemen legaal', 'cbd wiet belgie', 'cbd cannabis', 'cbd buds legaal'],
  jsonb_build_object(
    'sections', jsonb_build_array(
      jsonb_build_object('heading', 'De Ingewikkelde Situatie', 'content', '<p>CBD bloemen bevinden zich in een <strong>juridisch grijs gebied</strong> in België:</p><ul><li>Ze zien eruit als "gewone" cannabis</li><li>Bevatten wettelijk toegestaan THC-niveau (<0,3%)</li><li>Maar politie kan niet ter plekke verschil zien</li></ul>'),
      jsonb_build_object('heading', 'Wat Zegt de Wet?', 'content', '<p><strong>Technisch gezien:</strong> CBD bloemen met <0,3% THC uit toegestane hennepvariëteiten zijn legaal.</p><p><strong>In de praktijk:</strong> Je kunt aangehouden worden, bloemen worden in beslag genomen voor analyse. Na analyse word je vrijgelaten als het CBD blijkt te zijn, maar het is gedoe.</p>'),
      jsonb_build_object('heading', 'Risico''s en Advies', 'content', '<ul><li>Draag altijd bewijs van aankoop (factuur met THC%)</li><li>Koop alleen bij gerenommeerde verkopers met labresultaten</li><li>Wees voorbereid op mogelijke controle</li><li>Overweeg alternatieven zoals CBD olie voor minder gedoe</li></ul>'),
      jsonb_build_object('heading', 'Alternatieven', 'content', '<p>Wil je geen risico lopen? Overweeg:</p><ul><li><strong>CBD olie:</strong> Duidelijk legaal product</li><li><strong>CBD capsules:</strong> Geen geur, geen vragen</li><li><strong>CBD vape:</strong> Discrete inname</li></ul>')
    ),
    'faq', jsonb_build_array(
      jsonb_build_object('question', 'Mag ik CBD bloemen op zak hebben?', 'answer', 'Technisch ja, maar je kunt aangehouden worden omdat het op THC-cannabis lijkt.'),
      jsonb_build_object('question', 'Kan ik CBD bloemen roken?', 'answer', 'Ja, CBD bloemen kun je roken of verdampen voor snelle absorptie.')
    )
  ),
  'article',
  true,
  now()
) ON CONFLICT (slug) DO UPDATE SET content = EXCLUDED.content, last_updated = now();

-- 4. CBD Werking
INSERT INTO seo_content_pages (slug, title, h1_title, meta_description, meta_keywords, content, page_type, is_published, last_updated)
VALUES (
  'cbd-werking',
  'Hoe Werkt CBD? De Wetenschap Uitgelegd | Wietforum',
  'De Werking van CBD',
  'Hoe werkt CBD in je lichaam? Het endocannabinoïde systeem, receptoren en effecten wetenschappelijk uitgelegd.',
  ARRAY['cbd werking', 'hoe werkt cbd', 'cbd effect', 'endocannabinoide systeem'],
  jsonb_build_object(
    'sections', jsonb_build_array(
      jsonb_build_object('heading', 'Het Endocannabinoïde Systeem', 'content', '<p>Je lichaam heeft een eigen <strong>endocannabinoïde systeem (ECS)</strong> dat veel lichaamsprocessen reguleert:</p><ul><li>Pijn en ontstekingen</li><li>Stemming en angst</li><li>Slaap en waak-cycli</li><li>Eetlust</li><li>Immuunsysteem</li></ul><p>CBD werkt met dit systeem samen.</p>'),
      jsonb_build_object('heading', 'Hoe CBD Werkt', 'content', '<p>CBD bindt niet direct aan cannabinoïde receptoren (CB1/CB2) zoals THC doet. In plaats daarvan:</p><ul><li>Remt afbraak van eigen cannabinoïden (anandamide)</li><li>Beïnvloedt serotonine receptoren (5-HT1A)</li><li>Activeert vanilloïde receptoren (TRPV1 - pijn)</li><li>Moduleert het immuunsysteem</li></ul>'),
      jsonb_build_object('heading', 'Gerapporteerde Effecten', 'content', '<p><strong>Veel gebruikers rapporteren:</strong></p><ul><li>Verminderde angst en stress</li><li>Betere slaapkwaliteit</li><li>Verlichting van pijn</li><li>Ontspanning zonder high</li><li>Verminderde ontstekingen</li></ul><p><strong>Let op:</strong> Wetenschappelijk onderzoek is nog beperkt.</p>'),
      jsonb_build_object('heading', 'Wanneer Voel Je Effect?', 'content', '<p><strong>Sublinguaal (onder de tong):</strong> 15-45 minuten</p><p><strong>Ingestie (capsules, edibles):</strong> 30-90 minuten</p><p><strong>Inhalatie (vape, roken):</strong> Binnen minuten</p><p><strong>Topicaal (crème):</strong> Lokaal, variabel</p>')
    ),
    'faq', jsonb_build_array(
      jsonb_build_object('question', 'Hoe snel werkt CBD?', 'answer', 'Afhankelijk van inname: inhalatie werkt binnen minuten, olie sublinguaal 15-45 min, capsules 30-90 min.'),
      jsonb_build_object('question', 'Is CBD wetenschappelijk bewezen?', 'answer', 'Er is toenemend bewijs, maar grootschalig klinisch onderzoek is nog beperkt. Epidiolex (CBD medicijn) is wel goedgekeurd voor epilepsie.')
    )
  ),
  'article',
  true,
  now()
) ON CONFLICT (slug) DO UPDATE SET content = EXCLUDED.content, last_updated = now();

-- 5. CBD Dosering
INSERT INTO seo_content_pages (slug, title, h1_title, meta_description, meta_keywords, content, page_type, is_published, last_updated)
VALUES (
  'cbd-dosering',
  'CBD Dosering: Hoeveel mg Heb Je Nodig? | Wietforum',
  'CBD Dosering Bepalen',
  'Hoeveel CBD moet je nemen? Doseringsgids per doel: slaap, angst, pijn. Begin laag, bouw langzaam op.',
  ARRAY['cbd dosering', 'hoeveel cbd', 'cbd mg', 'cbd dosis'],
  jsonb_build_object(
    'sections', jsonb_build_array(
      jsonb_build_object('heading', 'De Gulden Regel', 'content', '<p><strong>Start laag, ga langzaam omhoog.</strong></p><p>Begin met 5-10 mg CBD per dag. Verhoog elke week met 5-10 mg tot je het gewenste effect bereikt.</p>'),
      jsonb_build_object('heading', 'Doseringrichtlijnen per Doel', 'content', '<p><strong>Algemeen welzijn:</strong> 5-15 mg/dag</p><p><strong>Slaap:</strong> 25-75 mg voor het slapen</p><p><strong>Angst:</strong> 15-50 mg/dag</p><p><strong>Pijn:</strong> 20-100 mg/dag</p><p><strong>Chronische aandoeningen:</strong> Tot 200 mg/dag</p><p><em>Dit zijn richtlijnen, geen medisch advies!</em></p>'),
      jsonb_build_object('heading', 'Hoe Bereken Je De Dosis?', 'content', '<p><strong>Voorbeeld:</strong> 10ml flesje CBD olie 10% = 1000mg CBD</p><p>Druppeltje = ± 0,05 ml = 5 mg CBD</p><p>Dus: 2-4 druppels = 10-20 mg CBD</p><p><strong>Tip:</strong> Check het etiket voor exacte mg per druppel.</p>'),
      jsonb_build_object('heading', 'Factoren die Dosering Beïnvloeden', 'content', '<ul><li><strong>Lichaamsgewicht:</strong> Zwaardere mensen hebben meer nodig</li><li><strong>Metabolisme:</strong> Snel of traag</li><li><strong>Doel:</strong> Slaap vs pijn vs angst</li><li><strong>Tolerantie:</strong> Bouwt op bij regelmatig gebruik</li><li><strong>Producttype:</strong> Full-spectrum vs isolaat</li></ul>')
    ),
    'faq', jsonb_build_array(
      jsonb_build_object('question', 'Kan je teveel CBD nemen?', 'answer', 'CBD is veilig in hoge doses, maar bijwerkingen als moeheid of diarree kunnen optreden bij zeer hoge doses (>200mg).'),
      jsonb_build_object('question', 'Hoe vaak per dag CBD nemen?', 'answer', 'Meestal 1-3x per dag, afhankelijk van je doel en de gewenste duur van effect.')
    )
  ),
  'article',
  true,
  now()
) ON CONFLICT (slug) DO UPDATE SET content = EXCLUDED.content, last_updated = now();

-- 6. CBD vs THC
INSERT INTO seo_content_pages (slug, title, h1_title, meta_description, meta_keywords, content, page_type, is_published, last_updated)
VALUES (
  'cbd-vs-thc',
  'CBD vs THC: Wat Is Het Verschil? | Wietforum',
  'CBD vs THC: Het Complete Verschil',
  'CBD en THC zijn beide cannabinoïden maar totaal verschillend. Effecten, legaliteit en gebruik vergeleken.',
  ARRAY['cbd vs thc', 'verschil cbd thc', 'cannabidiol thc', 'cbd of thc'],
  jsonb_build_object(
    'sections', jsonb_build_array(
      jsonb_build_object('heading', 'Het Belangrijkste Verschil', 'content', '<p><strong>THC:</strong> Psychoactief - maakt je HIGH</p><p><strong>CBD:</strong> Niet-psychoactief - maakt je NIET high</p><p>Beide zijn cannabinoïden uit de cannabisplant, maar werken heel anders.</p>'),
      jsonb_build_object('heading', 'Effecten Vergeleken', 'content', '<table><tr><th>THC</th><th>CBD</th></tr><tr><td>High/stoned gevoel</td><td>Geen high</td></tr><tr><td>Euforie</td><td>Kalmte</td></tr><tr><td>Honger (munchies)</td><td>Geen eetlusteffect</td></tr><tr><td>Kan angst veroorzaken</td><td>Kan angst verminderen</td></tr><tr><td>Pijnverlichting</td><td>Pijnverlichting</td></tr></table>'),
      jsonb_build_object('heading', 'Legaliteit', 'content', '<p><strong>THC:</strong> Illegaal in België (gedoogd tot 3 gram)</p><p><strong>CBD:</strong> Legaal (<0,3% THC)</p><p>Je kunt CBD producten vrij kopen, THC niet.</p>'),
      jsonb_build_object('heading', 'Welke Kiezen?', 'content', '<p><strong>Kies CBD als je:</strong></p><ul><li>Geen high wilt</li><li>Moet rijden of werken</li><li>Legaal wilt blijven</li><li>Angst wilt verminderen</li></ul><p><strong>THC kan beter zijn voor:</strong></p><ul><li>Ernstige pijn</li><li>Misselijkheid (chemotherapie)</li><li>Recreatief gebruik</li></ul>')
    ),
    'faq', jsonb_build_array(
      jsonb_build_object('question', 'Kan CBD het effect van THC verminderen?', 'answer', 'Ja, CBD kan de psychoactieve effecten van THC verzachten door te concurreren om receptoren.'),
      jsonb_build_object('question', 'Zijn ze allebei verslavend?', 'answer', 'Nee, beide zijn niet fysiek verslavend. THC kan wel mentale gewenning veroorzaken.')
    )
  ),
  'pillar',
  true,
  now()
) ON CONFLICT (slug) DO UPDATE SET content = EXCLUDED.content, last_updated = now();

-- 7. Medische Cannabis België
INSERT INTO seo_content_pages (slug, title, h1_title, meta_description, meta_keywords, content, page_type, is_published, last_updated)
VALUES (
  'medische-cannabis-belgie',
  'Medische Cannabis in België: Hoe Krijg Je Het? | Wietforum',
  'Medische Cannabis in België',
  'Alles over medische cannabis in België. Wie komt in aanmerking, hoe aanvragen, welke producten beschikbaar?',
  ARRAY['medische cannabis belgie', 'medicinale wiet', 'cannabis op recept', 'mediwiet belgie'],
  jsonb_build_object(
    'sections', jsonb_build_array(
      jsonb_build_object('heading', 'Status in België', 'content', '<p>België heeft <strong>beperkte mogelijkheden</strong> voor medische cannabis:</p><ul><li>Sativex (nabiximols) is goedgekeurd voor MS-spasticiteit</li><li>Epidiolex (CBD) voor epilepsie</li><li>Magistrale bereiding mogelijk (zeldzaam)</li></ul><p>Er is geen breed programma zoals in Nederland of Duitsland.</p>'),
      jsonb_build_object('heading', 'Wie Komt in Aanmerking?', 'content', '<p>Voornamelijk patiënten met:</p><ul><li>Multipele sclerose (spasticiteit)</li><li>Bepaalde vormen van epilepsie</li><li>Ernstige therapieresistente pijn (magistraal)</li><li>Misselijkheid bij chemotherapie (soms)</li></ul><p>Je huisarts of specialist bepaalt of je in aanmerking komt.</p>'),
      jsonb_build_object('heading', 'Hoe Aanvragen?', 'content', '<ol><li>Bespreek met je behandelend arts</li><li>Arts moet specialist zijn of overleggen</li><li>Voorschrift voor Sativex of Epidiolex</li><li>Ophalen bij apotheek</li></ol><p><strong>Let op:</strong> Niet iedere apotheek heeft voorraad.</p>'),
      jsonb_build_object('heading', 'Kosten & Vergoeding', 'content', '<p><strong>Sativex:</strong> ± €500/maand, deels vergoed</p><p><strong>Epidiolex:</strong> Variabel, via speciale regeling</p><p>Veel patiënten betalen een eigen bijdrage.</p>')
    ),
    'faq', jsonb_build_array(
      jsonb_build_object('question', 'Kan ik medicinale cannabis krijgen in België?', 'answer', 'Beperkt. Sativex voor MS en Epidiolex voor epilepsie zijn de hoofdopties. Magistrale bereiding is zeldzaam.'),
      jsonb_build_object('question', 'Is medicinale cannabis vergoed?', 'answer', 'Gedeeltelijk, afhankelijk van product en indicatie. Er blijft vaak een eigen bijdrage.')
    )
  ),
  'pillar',
  true,
  now()
) ON CONFLICT (slug) DO UPDATE SET content = EXCLUDED.content, last_updated = now();

-- 8. CBD voor Slaap
INSERT INTO seo_content_pages (slug, title, h1_title, meta_description, meta_keywords, content, page_type, is_published, last_updated)
VALUES (
  'cbd-voor-slaap',
  'CBD voor Slaap: Werkt Het Echt? | Wietforum',
  'CBD Gebruiken voor Betere Slaap',
  'Kan CBD je helpen slapen? Hoe werkt het, dosering en tips voor beter slapen met CBD.',
  ARRAY['cbd slaap', 'cbd voor slapen', 'cbd insomnia', 'cbd slapeloosheid'],
  jsonb_build_object(
    'sections', jsonb_build_array(
      jsonb_build_object('heading', 'Helpt CBD Bij Slapen?', 'content', '<p>Veel gebruikers rapporteren betere slaap met CBD, hoewel wetenschappelijk bewijs nog beperkt is.</p><p><strong>Mogelijke mechanismen:</strong></p><ul><li>Vermindert angst (vaak oorzaak slaapproblemen)</li><li>Ontspant lichaam en geest</li><li>Kan serotonine receptoren beïnvloeden</li><li>Reguleert dag/nacht ritme</li></ul>'),
      jsonb_build_object('heading', 'Dosering voor Slaap', 'content', '<p><strong>Aanbevolen:</strong> 25-75 mg CBD, 1 uur voor het slapen</p><p><strong>Begin met:</strong> 25 mg, verhoog indien nodig</p><p><strong>Beste vorm:</strong> CBD olie sublinguaal of capsule</p>'),
      jsonb_build_object('heading', 'Tips voor Optimaal Resultaat', 'content', '<ul><li>Neem 1 uur voor slaaptijd</li><li>Combineer met goede slaaphygiëne</li><li>Geen schermen 1 uur voor bed</li><li>Slaapkamer donker en koel</li><li>Full-spectrum CBD met wat myrceen terpeen kan extra helpen</li></ul>'),
      jsonb_build_object('heading', 'Wat Als Het Niet Werkt?', 'content', '<p>CBD werkt niet voor iedereen. Overweeg:</p><ul><li>Dosering verhogen (tot 100mg)</li><li>Andere toedieningsvorm proberen</li><li>CBN (cannabinol) toevoegen - specifieker voor slaap</li><li>Arts raadplegen bij ernstige slaapproblemen</li></ul>')
    ),
    'faq', jsonb_build_array(
      jsonb_build_object('question', 'Hoeveel CBD voor slapen?', 'answer', '25-75 mg CBD, 1 uur voor het slapen gaan. Begin met 25 mg en verhoog indien nodig.'),
      jsonb_build_object('question', 'Word ik slaperig van CBD?', 'answer', 'CBD is niet direct sederend, maar kan helpen bij ontspanning zodat je makkelijker in slaap valt.')
    )
  ),
  'article',
  true,
  now()
) ON CONFLICT (slug) DO UPDATE SET content = EXCLUDED.content, last_updated = now();

-- 9. CBD voor Pijn
INSERT INTO seo_content_pages (slug, title, h1_title, meta_description, meta_keywords, content, page_type, is_published, last_updated)
VALUES (
  'cbd-voor-pijn',
  'CBD voor Pijn: Werking & Effectiviteit | Wietforum',
  'CBD Gebruiken voor Pijnverlichting',
  'Kan CBD helpen tegen pijn? Hoe werkt het, voor welke soorten pijn en hoe te gebruiken.',
  ARRAY['cbd pijn', 'cbd pijnverlichting', 'cbd chronische pijn', 'cbd ontstekingen'],
  jsonb_build_object(
    'sections', jsonb_build_array(
      jsonb_build_object('heading', 'Hoe CBD Pijn Kan Verlichten', 'content', '<p>CBD heeft meerdere mechanismen die pijnverlichting kunnen bieden:</p><ul><li><strong>Ontstekingsremming:</strong> Vermindert ontstekingen die pijn veroorzaken</li><li><strong>TRPV1 activatie:</strong> Vanilloïde receptoren betrokken bij pijnperceptie</li><li><strong>Endocannabinoïde boost:</strong> Verhoogt natuurlijke pijnstillers</li></ul>'),
      jsonb_build_object('heading', 'Soorten Pijn', 'content', '<p><strong>CBD kan mogelijk helpen bij:</strong></p><ul><li>Chronische pijn</li><li>Artritis en gewrichtspijn</li><li>Spierpijn en krampen</li><li>Zenuwpijn (neuropathie)</li><li>Hoofdpijn/migraine</li><li>Fibromyalgie</li></ul>'),
      jsonb_build_object('heading', 'Dosering', 'content', '<p><strong>Pijndosering:</strong> 20-100 mg per dag</p><p>Begin met 20-25 mg, verhoog wekelijks.</p><p><strong>Lokale pijn:</strong> CBD crème direct op pijnlijke plek</p><p><strong>Systemische pijn:</strong> CBD olie of capsules</p>'),
      jsonb_build_object('heading', 'Combinatie Met Andere Middelen', 'content', '<p><strong>Let op interacties:</strong> CBD kan interacteren met bloedverdunners en andere medicijnen. Raadpleeg je arts bij medicijngebruik.</p><p>CBD kan eventueel dosering van pijnstillers verlagen (in overleg met arts).</p>')
    ),
    'faq', jsonb_build_array(
      jsonb_build_object('question', 'Helpt CBD tegen artritis?', 'answer', 'Veel artritispatiënten rapporteren verlichting, vooral in combinatie met topicale CBD crème en orale CBD.'),
      jsonb_build_object('question', 'Hoeveel CBD voor chronische pijn?', 'answer', '20-100 mg per dag, opgebouwd vanaf lage dosis. Sommigen hebben meer nodig.')
    )
  ),
  'article',
  true,
  now()
) ON CONFLICT (slug) DO UPDATE SET content = EXCLUDED.content, last_updated = now();

-- 10. CBD voor Angst
INSERT INTO seo_content_pages (slug, title, h1_title, meta_description, meta_keywords, content, page_type, is_published, last_updated)
VALUES (
  'cbd-voor-angst',
  'CBD voor Angst: Werkt Het? | Wietforum',
  'CBD Gebruiken bij Angst en Stress',
  'Kan CBD angst verminderen? De wetenschap, ervaring en hoe het te gebruiken voor angst en stress.',
  ARRAY['cbd angst', 'cbd voor stress', 'cbd anxiety', 'cbd tegen angst'],
  jsonb_build_object(
    'sections', jsonb_build_array(
      jsonb_build_object('heading', 'CBD en Angst: De Wetenschap', 'content', '<p>CBD heeft in meerdere studies <strong>angstverminderende effecten</strong> getoond:</p><ul><li>Beïnvloedt serotonine receptoren (5-HT1A)</li><li>Vermindert activiteit in amygdala (angstcentrum brein)</li><li>Kan sociale angst verminderen</li></ul><p>Onderzoek is veelbelovend maar nog niet sluitend.</p>'),
      jsonb_build_object('heading', 'Waar Kan CBD Bij Helpen?', 'content', '<ul><li>Algemene angststoornis (GAD)</li><li>Sociale angst</li><li>Paniekaanvallen</li><li>PTSS-gerelateerde angst</li><li>Dagelijkse stress</li></ul>'),
      jsonb_build_object('heading', 'Dosering', 'content', '<p><strong>Angstdosering:</strong> 15-50 mg per dag</p><p><strong>Acute angst/paniek:</strong> 25-50 mg, effect binnen 15-30 min (sublinguaal)</p><p><strong>Dagelijks:</strong> 15-30 mg verdeeld over dag</p>'),
      jsonb_build_object('heading', 'Praktische Tips', 'content', '<ul><li>Houd CBD olie bij je voor acute momenten</li><li>Combineer met ademhalingsoefeningen</li><li>Neem preventief voor stressvolle situaties</li><li>Full-spectrum CBD heeft mogelijk extra effect (entourage)</li></ul>')
    ),
    'faq', jsonb_build_array(
      jsonb_build_object('question', 'Hoeveel CBD voor angst?', 'answer', '15-50 mg per dag. Bij acute angst 25-50 mg sublinguaal.'),
      jsonb_build_object('question', 'Kan CBD paniekaanvallen stoppen?', 'answer', 'CBD kan de intensiteit mogelijk verminderen, maar werkt niet instant. Houd het bij de hand.')
    )
  ),
  'article',
  true,
  now()
) ON CONFLICT (slug) DO UPDATE SET content = EXCLUDED.content, last_updated = now();

-- 11. CBD Bijwerkingen
INSERT INTO seo_content_pages (slug, title, h1_title, meta_description, meta_keywords, content, page_type, is_published, last_updated)
VALUES (
  'cbd-bijwerkingen',
  'CBD Bijwerkingen: Wat Moet Je Weten? | Wietforum',
  'Mogelijke Bijwerkingen van CBD',
  'Is CBD veilig? Overzicht van mogelijke bijwerkingen, interacties en waar je op moet letten.',
  ARRAY['cbd bijwerkingen', 'cbd veilig', 'cbd side effects', 'cbd risico'],
  jsonb_build_object(
    'sections', jsonb_build_array(
      jsonb_build_object('heading', 'Is CBD Veilig?', 'content', '<p><strong>Over het algemeen is CBD goed verdraagbaar.</strong> De WHO (Wereldgezondheidsorganisatie) heeft geconcludeerd dat CBD een goed veiligheidsprofiel heeft.</p><p>Bijwerkingen zijn meestal mild en dosisafhankelijk.</p>'),
      jsonb_build_object('heading', 'Mogelijke Bijwerkingen', 'content', '<ul><li><strong>Moeheid/slaperigheid:</strong> Vooral bij hogere doses</li><li><strong>Droge mond:</strong> CBD vermindert speekselproductie</li><li><strong>Lichte duizeligheid:</strong> Bij sommige mensen</li><li><strong>Diarree:</strong> Bij hoge doses of gevoelige maag</li><li><strong>Verminderde eetlust:</strong> Bij sommigen (bij anderen juist verhoogd)</li><li><strong>Bloeddrukdaling:</strong> Licht verlaagd</li></ul>'),
      jsonb_build_object('heading', 'Medicijn Interacties', 'content', '<p><strong>Let op bij:</strong></p><ul><li>Bloedverdunners (warfarine)</li><li>Anti-epileptica</li><li>Hartmedicatie</li><li>Medicijnen die via CYP450 worden afgebroken</li></ul><p><strong>Raadpleeg altijd je arts</strong> als je medicijnen gebruikt!</p>'),
      jsonb_build_object('heading', 'Wie Moet Voorzichtig Zijn?', 'content', '<ul><li>Zwangere en borstvoedende vrouwen (onvoldoende onderzoek)</li><li>Mensen met leverproblemen</li><li>Medicijngebruikers (interacties)</li><li>Kinderen (alleen onder medisch toezicht)</li></ul>')
    ),
    'faq', jsonb_build_array(
      jsonb_build_object('question', 'Kan je teveel CBD nemen?', 'answer', 'Een overdosis in traditionele zin is onwaarschijnlijk, maar hoge doses kunnen bijwerkingen versterken.'),
      jsonb_build_object('question', 'Is CBD verslavend?', 'answer', 'Nee, CBD is niet verslavend en veroorzaakt geen ontwenningsverschijnselen.')
    )
  ),
  'article',
  true,
  now()
) ON CONFLICT (slug) DO UPDATE SET content = EXCLUDED.content, last_updated = now();

-- 12. Full Spectrum vs Isolaat
INSERT INTO seo_content_pages (slug, title, h1_title, meta_description, meta_keywords, content, page_type, is_published, last_updated)
VALUES (
  'full-spectrum-vs-isolaat',
  'Full Spectrum vs CBD Isolaat: Welke Kiezen? | Wietforum',
  'Full Spectrum CBD vs Isolaat',
  'Verschil tussen full spectrum, broad spectrum en CBD isolaat. Welke is beter en wanneer kiezen?',
  ARRAY['full spectrum cbd', 'cbd isolaat', 'broad spectrum', 'entourage effect'],
  jsonb_build_object(
    'sections', jsonb_build_array(
      jsonb_build_object('heading', 'De Drie Types', 'content', '<p><strong>Full Spectrum:</strong> Alle cannabinoïden + terpenen + flavonoïden (inclusief THC <0,3%)</p><p><strong>Broad Spectrum:</strong> Alle componenten MINUS THC</p><p><strong>CBD Isolaat:</strong> Puur CBD, 99%+ zuiver, niets anders</p>'),
      jsonb_build_object('heading', 'Het Entourage Effect', 'content', '<p>Het <strong>entourage effect</strong> is de theorie dat alle componenten van de plant samen beter werken dan geïsoleerd:</p><ul><li>CBD + THC + terpenen = sterker effect</li><li>Componenten versterken elkaar</li><li>Lagere dosis nodig voor zelfde resultaat</li></ul>'),
      jsonb_build_object('heading', 'Wanneer Welke Kiezen?', 'content', '<p><strong>Full Spectrum:</strong></p><ul><li>Maximaal effect gewenst</li><li>Geen drugstests</li><li>Geen bezwaar tegen sporen THC</li></ul><p><strong>Broad Spectrum:</strong></p><ul><li>Entourage effect, maar geen THC</li><li>Drugstests mogelijk</li><li>Persoonlijke voorkeur</li></ul><p><strong>Isolaat:</strong></p><ul><li>Absoluut geen THC</li><li>Regelmatige drugstests</li><li>Specifieke CBD-dosis nodig</li></ul>'),
      jsonb_build_object('heading', 'Onze Aanbeveling', 'content', '<p>Voor de meeste mensen is <strong>full spectrum</strong> de beste keuze vanwege het entourage effect. Broad spectrum als je THC wilt vermijden maar wel de andere voordelen wilt.</p>')
    ),
    'faq', jsonb_build_array(
      jsonb_build_object('question', 'Kan ik zakken voor drugstest met full spectrum?', 'answer', 'Theoretisch mogelijk bij zeer hoog gebruik, maar onwaarschijnlijk bij normale doseringen (<50mg/dag).'),
      jsonb_build_object('question', 'Welke is sterker?', 'answer', 'Full spectrum wordt vaak als effectiever ervaren door het entourage effect.')
    )
  ),
  'article',
  true,
  now()
) ON CONFLICT (slug) DO UPDATE SET content = EXCLUDED.content, last_updated = now();

-- 13. CBD Olie Percentage
INSERT INTO seo_content_pages (slug, title, h1_title, meta_description, meta_keywords, content, page_type, is_published, last_updated)
VALUES (
  'cbd-olie-percentage',
  'CBD Olie Percentage: 5%, 10% of 20%? | Wietforum',
  'Welk CBD Percentage Kiezen?',
  'Welk percentage CBD olie heb je nodig? 5%, 10%, 20% uitgelegd. Hoe kiezen en doseren.',
  ARRAY['cbd percentage', 'cbd olie 10%', 'cbd concentratie', 'cbd sterkte'],
  jsonb_build_object(
    'sections', jsonb_build_array(
      jsonb_build_object('heading', 'Percentages Uitgelegd', 'content', '<p><strong>5% CBD olie:</strong> 500mg CBD per 10ml (± 2,5mg per druppel)</p><p><strong>10% CBD olie:</strong> 1000mg CBD per 10ml (± 5mg per druppel)</p><p><strong>20% CBD olie:</strong> 2000mg CBD per 10ml (± 10mg per druppel)</p><p><strong>30% CBD olie:</strong> 3000mg CBD per 10ml (± 15mg per druppel)</p>'),
      jsonb_build_object('heading', 'Welke Kiezen?', 'content', '<p><strong>5%:</strong> Beginners, lichte klachten, kinderen</p><p><strong>10%:</strong> Meest verkocht, gemiddeld gebruik</p><p><strong>20%:</strong> Ervaren gebruikers, sterkere klachten</p><p><strong>30%+:</strong> Chronische/ernstige klachten, hoge tolerantie</p>'),
      jsonb_build_object('heading', 'Prijs per mg CBD', 'content', '<p>Hogere percentages zijn vaak <strong>voordeliger per mg CBD</strong>:</p><p>Voorbeeld:</p><ul><li>10ml 5% (500mg) voor €25 = €0,05/mg</li><li>10ml 10% (1000mg) voor €40 = €0,04/mg</li><li>10ml 20% (2000mg) voor €70 = €0,035/mg</li></ul>'),
      jsonb_build_object('heading', 'Onze Tip', 'content', '<p><strong>Start met 10%</strong> - Dit is de gouden middenweg. Je kunt makkelijk doseren en opschalen zonder te veel druppels nodig te hebben.</p>')
    ),
    'faq', jsonb_build_array(
      jsonb_build_object('question', 'Welk percentage voor beginners?', 'answer', '5% of 10%. Begin met weinig druppels en bouw op.'),
      jsonb_build_object('question', 'Is 20% beter dan 10%?', 'answer', 'Niet per se "beter", maar je hebt minder druppels nodig voor dezelfde dosis CBD.')
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
  RAISE NOTICE 'TIER 2 CBD Producten paginas succesvol aangemaakt';
  RAISE NOTICE 'Totaal: 13 paginas';
END $$;

