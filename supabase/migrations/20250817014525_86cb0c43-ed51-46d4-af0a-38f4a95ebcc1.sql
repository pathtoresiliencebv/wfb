-- Create SEO settings table
CREATE TABLE public.seo_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  setting_key VARCHAR NOT NULL UNIQUE,
  setting_value JSONB NOT NULL DEFAULT '{}',
  setting_type VARCHAR NOT NULL DEFAULT 'general',
  description TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.seo_settings ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Admins can manage SEO settings" 
ON public.seo_settings 
FOR ALL 
USING (EXISTS (
  SELECT 1 FROM public.profiles p 
  WHERE p.user_id = auth.uid() 
  AND p.role IN ('admin', 'moderator')
))
WITH CHECK (EXISTS (
  SELECT 1 FROM public.profiles p 
  WHERE p.user_id = auth.uid() 
  AND p.role IN ('admin', 'moderator')
));

-- SEO settings are viewable by everyone for public usage
CREATE POLICY "SEO settings are viewable by everyone" 
ON public.seo_settings 
FOR SELECT 
USING (true);

-- Add SEO fields to categories table
ALTER TABLE public.categories 
ADD COLUMN meta_title VARCHAR(60),
ADD COLUMN meta_description VARCHAR(160),
ADD COLUMN og_title VARCHAR(60),
ADD COLUMN og_description VARCHAR(160),
ADD COLUMN og_image TEXT;

-- Add SEO fields to topics table  
ALTER TABLE public.topics
ADD COLUMN meta_title VARCHAR(60),
ADD COLUMN meta_description VARCHAR(160),
ADD COLUMN og_title VARCHAR(60), 
ADD COLUMN og_description VARCHAR(160),
ADD COLUMN og_image TEXT;

-- Insert default SEO settings
INSERT INTO public.seo_settings (setting_key, setting_value, setting_type, description) VALUES
('site_title', '{"value": "WietForum België"}', 'general', 'Hoofdtitel van de website'),
('site_description', '{"value": "Het grootste cannabis forum van België voor gebruikers, growers en leveranciers."}', 'general', 'Hoofdbeschrijving van de website'),
('default_og_image', '{"value": "/wietforum-logo.png"}', 'general', 'Standaard Open Graph afbeelding'),
('schema_organization', '{"name": "WietForum België", "type": "Organization", "url": "https://wietforumbelgie.com"}', 'schema', 'Schema.org organisatie data'),
('robots_txt', '{"value": "User-agent: *\\nDisallow: /admin/\\nSitemap: /sitemap.xml"}', 'general', 'Robots.txt inhoud'),
('canonical_domain', '{"value": "wietforumbelgie.com"}', 'general', 'Hoofddomein voor canonical URLs');