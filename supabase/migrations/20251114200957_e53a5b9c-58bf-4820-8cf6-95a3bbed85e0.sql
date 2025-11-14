-- SEO Content Pages tabel voor het beheren van alle SEO content
CREATE TABLE IF NOT EXISTS public.seo_content_pages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  meta_description TEXT,
  meta_keywords TEXT[],
  h1_title TEXT NOT NULL,
  content JSONB NOT NULL DEFAULT '{}'::jsonb,
  page_type TEXT NOT NULL CHECK (page_type IN ('pillar', 'province', 'city', 'general')),
  parent_slug TEXT,
  canonical_url TEXT,
  schema_markup JSONB DEFAULT '{}'::jsonb,
  is_published BOOLEAN DEFAULT false,
  publish_date TIMESTAMP WITH TIME ZONE,
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  author_id UUID REFERENCES auth.users(id),
  view_count INTEGER DEFAULT 0,
  seo_score INTEGER DEFAULT 0
);

-- SEO Redirects tabel voor het beheren van URL redirects
CREATE TABLE IF NOT EXISTS public.seo_redirects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  from_url TEXT NOT NULL,
  to_url TEXT NOT NULL,
  redirect_type INTEGER DEFAULT 301 CHECK (redirect_type IN (301, 302, 307, 308)),
  is_active BOOLEAN DEFAULT true,
  hit_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Internal Links tracking voor SEO link juice flow
CREATE TABLE IF NOT EXISTS public.seo_internal_links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source_page_id UUID REFERENCES public.seo_content_pages(id) ON DELETE CASCADE,
  target_page_id UUID REFERENCES public.seo_content_pages(id) ON DELETE CASCADE,
  anchor_text TEXT NOT NULL,
  link_position TEXT DEFAULT 'body' CHECK (link_position IN ('body', 'sidebar', 'footer', 'header')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(source_page_id, target_page_id, anchor_text)
);

-- Indexes voor performance
CREATE INDEX IF NOT EXISTS idx_seo_content_pages_slug ON public.seo_content_pages(slug);
CREATE INDEX IF NOT EXISTS idx_seo_content_pages_page_type ON public.seo_content_pages(page_type);
CREATE INDEX IF NOT EXISTS idx_seo_content_pages_is_published ON public.seo_content_pages(is_published);
CREATE INDEX IF NOT EXISTS idx_seo_content_pages_parent_slug ON public.seo_content_pages(parent_slug);
CREATE INDEX IF NOT EXISTS idx_seo_redirects_from_url ON public.seo_redirects(from_url);
CREATE INDEX IF NOT EXISTS idx_seo_redirects_is_active ON public.seo_redirects(is_active);
CREATE INDEX IF NOT EXISTS idx_seo_internal_links_source ON public.seo_internal_links(source_page_id);
CREATE INDEX IF NOT EXISTS idx_seo_internal_links_target ON public.seo_internal_links(target_page_id);

-- RLS Policies voor seo_content_pages
ALTER TABLE public.seo_content_pages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Published SEO content is viewable by everyone"
  ON public.seo_content_pages FOR SELECT
  USING (is_published = true);

CREATE POLICY "Admins can manage all SEO content"
  ON public.seo_content_pages FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.user_id = auth.uid()
      AND profiles.role IN ('admin', 'moderator')
    )
  );

-- RLS Policies voor seo_redirects
ALTER TABLE public.seo_redirects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Redirects are viewable by everyone"
  ON public.seo_redirects FOR SELECT
  USING (is_active = true);

CREATE POLICY "Admins can manage redirects"
  ON public.seo_redirects FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.user_id = auth.uid()
      AND profiles.role IN ('admin', 'moderator')
    )
  );

-- RLS Policies voor seo_internal_links
ALTER TABLE public.seo_internal_links ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Internal links are viewable by everyone"
  ON public.seo_internal_links FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage internal links"
  ON public.seo_internal_links FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.user_id = auth.uid()
      AND profiles.role IN ('admin', 'moderator')
    )
  );

-- Trigger voor updated_at
CREATE OR REPLACE FUNCTION update_seo_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_seo_content_pages_updated_at
  BEFORE UPDATE ON public.seo_content_pages
  FOR EACH ROW
  EXECUTE FUNCTION update_seo_updated_at();

CREATE TRIGGER update_seo_redirects_updated_at
  BEFORE UPDATE ON public.seo_redirects
  FOR EACH ROW
  EXECUTE FUNCTION update_seo_updated_at();