-- Create SEO content pages table if not exists (idempotent)
CREATE TABLE IF NOT EXISTS seo_content_pages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  h1_title TEXT NOT NULL,
  meta_description TEXT,
  meta_keywords TEXT[],
  content JSONB NOT NULL,
  page_type TEXT CHECK (page_type IN ('pillar', 'city', 'article')),
  parent_slug TEXT,
  canonical_url TEXT,
  is_published BOOLEAN DEFAULT false,
  publish_date TIMESTAMPTZ DEFAULT now(),
  last_updated TIMESTAMPTZ DEFAULT now(),
  view_count INTEGER DEFAULT 0,
  schema_markup JSONB,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE seo_content_pages ENABLE ROW LEVEL SECURITY;

-- Policies (Public Read, Admin Write)
CREATE POLICY "Public can view published SEO pages" ON seo_content_pages
  FOR SELECT
  USING (is_published = true);

-- Insert Seed Data: 1. Pillar Page (Hub) - Cannabis Wetgeving België
INSERT INTO seo_content_pages (slug, title, h1_title, meta_description, meta_keywords, content, page_type, is_published)
VALUES (
  'cannabis-wetgeving-belgie',
  'Cannabis Wetgeving België 2025: De Complete Gids | Wietforum',
  'Cannabis Wetgeving in België: Alles wat je moet weten (2025)',
  'Is wiet legaal in België? Lees onze complete gids over de Belgische cannabis wetgeving, het gedoogbeleid, en wat wel en niet mag in 2025.',
  ARRAY['cannabis wetgeving belgië', 'is wiet legaal belgië', 'cannabis bezit', 'gedoogbeleid', 'wiet kweken straf'],
  '{
    "og_title": "Cannabis Wetgeving België 2025: De Complete Gids",
    "og_description": "Is wiet legaal in België? Ontdek het antwoord, de regels rond bezit en kweek, en vermijd boetes.",
    "sections": [
      {
        "heading": "Is cannabis legaal in België?",
        "content": "<p>Het korte antwoord is: <strong>Nee</strong>, maar er is sprake van een <em>gedoogbeleid</em> onder strikte voorwaarden.</p><p>Sinds de ministeriële richtlijn van 2005 (herzien in latere jaren) heeft de vervolging van persoonlijk bezit van cannabis de <strong>laagste prioriteit</strong>. Dit betekent echter niet dat het legaal is zoals in Canada of delen van de VS.</p>"
      },
      {
        "heading": "Regels voor Persoonlijk Bezit",
        "content": "<ul><li><strong>Maximum 3 gram:</strong> Bezit tot 3 gram wordt gezien als persoonlijk gebruik.</li><li><strong>Geen overlast:</strong> Gebruik in het openbaar of in aanwezigheid van minderjarigen is verboden.</li><li><strong>Verkeer:</strong> Nultolerantie in het verkeer (speekseltest).</li></ul>"
      },
      {
        "heading": "Thuisteelt: De ''1 Plant'' Regel",
        "content": "<p>Het bezit van maximaal <strong>één vrouwelijke cannabisplant</strong> per persoon wordt gedoogd, mits er geen sprake is van overlast of verkoop. Let op: bij een inval wordt de plant vaak wel in beslag genomen (en vernietigd), maar volgt er meestal geen verdere vervolging als je aan de voorwaarden voldoet.</p>"
      }
    ],
    "faq": [
      {
        "question": "Mag ik wiet roken op straat?",
        "answer": "Nee, gebruik in de openbare ruimte is verboden en kan leiden tot een boete en inbeslagname."
      },
      {
        "question": "Hoeveel wietplanten mag ik hebben?",
        "answer": "Maximaal één plant per volwassene wordt gedoogd, zolang er geen sprake is van verkoop of overlast."
      }
    ]
  }'::jsonb,
  'pillar',
  true
) ON CONFLICT (slug) DO UPDATE SET 
  content = EXCLUDED.content,
  title = EXCLUDED.title,
  h1_title = EXCLUDED.h1_title;

-- Insert Seed Data: 2. City Page (Spoke/Local) - Antwerpen
INSERT INTO seo_content_pages (slug, title, h1_title, meta_description, meta_keywords, content, page_type, parent_slug, is_published)
VALUES (
  'cannabis-wetgeving-belgie/antwerpen',
  'Cannabis in Antwerpen: Wetgeving & Info | Wietforum',
  'Cannabis in Antwerpen: Wat moet je weten?',
  'Alles over cannabis in Antwerpen. Lokale handhaving, CBD shops, en community discussies uit de regio Antwerpen.',
  ARRAY['wiet kopen antwerpen', 'cbd winkel antwerpen', 'cannabis antwerpen', 'politie antwerpen drugs'],
  '{
    "og_title": "Cannabis in Antwerpen: De Lokale Gids",
    "og_description": "Woon je in Antwerpen? Lees hier alles over het lokale cannabisbeleid en vind de beste CBD shops.",
    "sections": [
      {
        "heading": "Het Beleid in Antwerpen",
        "content": "<p>Antwerpen staat bekend om zijn strenge aanpak in de ''War on Drugs''. Hoewel de nationale gedoogregels gelden, voert de lokale politie (PZ Antwerpen) vaak gerichte acties uit, vooral in het kader van overlast en straatdealers.</p><p>Voor de gewone gebruiker die thuis discreet consumeert, geldt in principe hetzelfde als elders in België, maar voorzichtigheid is geboden.</p>"
      },
      {
        "heading": "CBD Shops in Antwerpen",
        "content": "<p>Er zijn diverse legale CBD winkels in het centrum van Antwerpen waar je cannabisproducten met <0.2% THC kunt kopen. Deze zijn volledig legaal.</p>"
      }
    ],
    "faq": [
      {
        "question": "Zijn er coffeeshops in Antwerpen?",
        "answer": "Nee, er zijn geen coffeeshops in Antwerpen waar je THC-wiet kunt kopen zoals in Nederland. Dit is illegaal."
      }
    ]
  }'::jsonb,
  'city',
  'cannabis-wetgeving-belgie',
  true
) ON CONFLICT (slug) DO UPDATE SET 
  content = EXCLUDED.content,
  title = EXCLUDED.title;

