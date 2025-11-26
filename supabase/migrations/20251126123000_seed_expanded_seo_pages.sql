-- Seed expanded SEO pages for keywords and locations
DO $$
DECLARE
  keywords TEXT[] := ARRAY[
    'Wiet forum', 'wietforum', 'Cannabis forum', 'cannabisforum', 
    '420 forum', 'Growweed', 'Canna forum', 'cannaforum', 
    'Ganjaforum', 'Ganja forum'
  ];
  
  -- Keywords with 'belgie' suffix for general pages
  belgium_keywords TEXT[] := ARRAY[
    'Wiet forum Belgie', 'wietforum Belgie', 'Cannabis forum Belgie', 'Cannabisforum Belgie', 
    'Ganja forum Belgie'
  ];
  
  locations TEXT[] := ARRAY[
    'Antwerpen', 'Limburg', 'Oost-Vlaanderen', 'West-Vlaanderen', 
    'Vlaams-Brabant', 'Waals-Brabant', 'Luik', 'Namen', 
    'Henegouwen', 'Luxemburg', 'Brussel'
  ];
  
  keyword TEXT;
  location TEXT;
  slug TEXT;
  page_title TEXT;
  h1_text TEXT;
  meta_desc TEXT;
  content_json JSONB;
  current_timestamp TIMESTAMPTZ := now();
  parent_slug_val TEXT;
  
  -- Helper variables
  clean_keyword TEXT;
  clean_location TEXT;
  
BEGIN
  -- 1. Generate Keyword + Location Combinations
  FOREACH keyword IN ARRAY keywords
  LOOP
    FOREACH location IN ARRAY locations
    LOOP
      -- Create clean slug
      clean_keyword := lower(regexp_replace(keyword, '[^a-zA-Z0-9]+', '-', 'g'));
      clean_location := lower(regexp_replace(location, '[^a-zA-Z0-9]+', '-', 'g'));
      slug := clean_keyword || '-' || clean_location;
      
      -- Set parent slug to the province page
      parent_slug_val := 'cannabis-belgie/' || clean_location;
      
      -- Create Titles
      page_title := keyword || ' ' || location || ' - #1 Cannabis Community van België';
      h1_text := 'Alles over ' || keyword || ' in ' || location;
      meta_desc := 'Op zoek naar een ' || keyword || ' in ' || location || '? Word lid van WietForum.be, de grootste cannabis community van België. Discussies, kweekverslagen en meer in ' || location || '.';
      
      -- Create Content JSON
      content_json := jsonb_build_object(
        'sections', jsonb_build_array(
          jsonb_build_object(
            'heading', 'Welkom op het ' || keyword || ' voor ' || location,
            'content', '<p>Ben je op zoek naar gelijkgestemden in <strong>' || location || '</strong>? WietForum.be is dé plek voor iedereen die geïnteresseerd is in cannabis, wiet kweken en de cultuur eromheen. Of je nu een ervaren kweker bent of net begint, op ons ' || lower(keyword) || ' vind je alle informatie die je nodig hebt.</p><p>In de regio ' || location || ' groeit onze community elke dag. Deel je ervaringen, stel vragen en leer van experts uit jouw buurt.</p>'
          ),
          jsonb_build_object(
            'heading', 'Cannabis Wetgeving en Cultuur in ' || location,
            'content', '<p>Hoewel de wetgeving rondom cannabis in heel België hetzelfde is, verschilt de lokale aanpak soms per gemeente in ' || location || '. Op ons forum bespreken leden de actuele situatie, gedoogbeleid en juridische ontwikkelingen die specifiek relevant kunnen zijn voor inwoners van ' || location || '.</p><p>Blijf op de hoogte van het laatste nieuws en discussieer mee over de toekomst van legalisatie in België.</p>'
          ),
          jsonb_build_object(
            'heading', 'Word lid van de ' || location || ' Community',
            'content', '<p>Maak vandaag nog een gratis account aan en krijg toegang tot exclusieve secties, waaronder:</p><ul><li>Lokale meetups en evenementen in ' || location || '</li><li>Ruilhandel en tips voor kweekbenodigdheden</li><li>Beoordelingen van shops en producten</li><li>Een veilige omgeving om vrijuit te praten</li></ul><p>Klik op de knop hieronder om je te registreren!</p>'
          )
        ),
        'faq', jsonb_build_array(
          jsonb_build_object(
            'question', 'Is het legaal om lid te worden van een ' || lower(keyword) || ' in ' || location || '?',
            'answer', 'Ja, het is volledig legaal om lid te zijn van een online community en te praten over cannabis. WietForum.be houdt zich aan de Belgische wetgeving en moedigt geen illegale handel aan.'
          ),
          jsonb_build_object(
            'question', 'Zijn er veel leden uit ' || location || ' actief?',
            'answer', 'Zeker! ' || location || ' is een van de actiefste regio''s op ons forum. Je zult snel aansluiting vinden bij andere hobbyisten uit de buurt.'
          )
        ),
        'og_title', page_title,
        'og_description', meta_desc
      );

      -- Insert or Update
      INSERT INTO public.seo_content_pages (
        slug, title, h1_title, meta_description, meta_keywords, 
        content, page_type, is_published, parent_slug, last_updated
      )
      VALUES (
        slug,
        page_title,
        h1_text,
        meta_desc,
        ARRAY[keyword, location, 'wiet forum', 'cannabis belgie', keyword || ' ' || location],
        content_json,
        'city',
        true,
        parent_slug_val,
        current_timestamp
      )
      ON CONFLICT (slug) DO UPDATE SET
        title = EXCLUDED.title,
        h1_title = EXCLUDED.h1_title,
        meta_description = EXCLUDED.meta_description,
        content = EXCLUDED.content,
        last_updated = EXCLUDED.last_updated,
        parent_slug = EXCLUDED.parent_slug;
        
    END LOOP;
  END LOOP;

  -- 2. Generate General Belgium Pages
  FOREACH keyword IN ARRAY belgium_keywords
  LOOP
      -- Create clean slug
      slug := lower(regexp_replace(keyword, '[^a-zA-Z0-9]+', '-', 'g'));
      
      -- Create Titles
      page_title := keyword || ' - De Grootste Community';
      h1_text := 'Alles over ' || keyword;
      meta_desc := 'De nummer 1 bestemming voor ' || keyword || '. Word lid van duizenden Belgische leden, deel kweekverslagen en bespreek alles over cannabis.';
      
      -- Create Content JSON
      content_json := jsonb_build_object(
        'sections', jsonb_build_array(
          jsonb_build_object(
            'heading', 'Welkom op het grootste ' || keyword,
            'content', '<p>WietForum.be is de thuisbasis voor cannabis liefhebbers in heel België. Of je nu zoekt naar kweekadvies, juridische info of gewoon gezelligheid, je vindt het hier.</p>'
          ),
          jsonb_build_object(
            'heading', 'Waarom kiezen voor WietForum.be?',
            'content', '<ul><li>100% Belgische focus</li><li>Actieve moderatie en veilige sfeer</li><li>Duizenden topics en kweekverslagen</li><li>Experten die klaarstaan om te helpen</li></ul>'
          )
        ),
        'faq', jsonb_build_array(
          jsonb_build_object(
            'question', 'Is dit forum gratis?',
            'answer', 'Ja, registratie en gebruik van WietForum.be is 100% gratis.'
          )
        ),
        'og_title', page_title,
        'og_description', meta_desc
      );

      -- Insert or Update
      INSERT INTO public.seo_content_pages (
        slug, title, h1_title, meta_description, meta_keywords, 
        content, page_type, is_published, parent_slug, last_updated
      )
      VALUES (
        slug,
        page_title,
        h1_text,
        meta_desc,
        ARRAY[keyword, 'wiet forum', 'cannabis belgie'],
        content_json,
        'general',
        true,
        'cannabis-belgie',
        current_timestamp
      )
      ON CONFLICT (slug) DO UPDATE SET
        title = EXCLUDED.title,
        h1_title = EXCLUDED.h1_title,
        meta_description = EXCLUDED.meta_description,
        content = EXCLUDED.content,
        last_updated = EXCLUDED.last_updated;
        
  END LOOP;

END $$;
