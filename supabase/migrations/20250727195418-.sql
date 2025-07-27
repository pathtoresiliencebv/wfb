-- Create tags table
CREATE TABLE IF NOT EXISTS public.tags (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(50) NOT NULL UNIQUE,
  slug VARCHAR(50) NOT NULL UNIQUE,
  color VARCHAR(7) DEFAULT '#10b981',
  description TEXT,
  usage_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create topic_tags junction table
CREATE TABLE IF NOT EXISTS public.topic_tags (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  topic_id UUID NOT NULL REFERENCES public.topics(id) ON DELETE CASCADE,
  tag_id UUID NOT NULL REFERENCES public.tags(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(topic_id, tag_id)
);

-- Create images table for uploads
CREATE TABLE IF NOT EXISTS public.images (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  filename VARCHAR(255) NOT NULL,
  original_name VARCHAR(255) NOT NULL,
  file_size INTEGER NOT NULL,
  mime_type VARCHAR(100) NOT NULL,
  storage_path TEXT NOT NULL,
  alt_text TEXT,
  width INTEGER,
  height INTEGER,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on new tables
ALTER TABLE public.tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.topic_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.images ENABLE ROW LEVEL SECURITY;

-- RLS policies for tags
CREATE POLICY "Tags are viewable by everyone" 
ON public.tags 
FOR SELECT 
USING (true);

CREATE POLICY "Admins can manage tags" 
ON public.tags 
FOR ALL 
USING (EXISTS (
  SELECT 1 FROM profiles 
  WHERE profiles.user_id = auth.uid() 
  AND profiles.role IN ('admin', 'moderator')
))
WITH CHECK (EXISTS (
  SELECT 1 FROM profiles 
  WHERE profiles.user_id = auth.uid() 
  AND profiles.role IN ('admin', 'moderator')
));

-- RLS policies for topic_tags
CREATE POLICY "Topic tags are viewable by everyone" 
ON public.topic_tags 
FOR SELECT 
USING (true);

CREATE POLICY "Users can add tags to their own topics" 
ON public.topic_tags 
FOR INSERT 
WITH CHECK (EXISTS (
  SELECT 1 FROM topics 
  WHERE topics.id = topic_tags.topic_id 
  AND topics.author_id = auth.uid()
));

CREATE POLICY "Users can remove tags from their own topics" 
ON public.topic_tags 
FOR DELETE 
USING (EXISTS (
  SELECT 1 FROM topics 
  WHERE topics.id = topic_tags.topic_id 
  AND topics.author_id = auth.uid()
));

-- RLS policies for images
CREATE POLICY "Users can view images" 
ON public.images 
FOR SELECT 
USING (true);

CREATE POLICY "Users can upload their own images" 
ON public.images 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own images" 
ON public.images 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own images" 
ON public.images 
FOR DELETE 
USING (auth.uid() = user_id);

-- Add triggers for updated_at
CREATE TRIGGER update_tags_updated_at
  BEFORE UPDATE ON public.tags
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Insert some default tags
INSERT INTO public.tags (name, slug, color, description) VALUES
('CBD', 'cbd', '#10b981', 'Topics gerelateerd aan CBD producten en gebruik'),
('THC', 'thc', '#ef4444', 'Topics over THC en psychoactieve effecten'),
('Indoor', 'indoor', '#8b5cf6', 'Indoor kweek tips en technieken'),
('Outdoor', 'outdoor', '#22c55e', 'Outdoor kweek en tuinieren'),
('Beginner', 'beginner', '#f59e0b', 'Voor mensen die net beginnen'),
('Expert', 'expert', '#3b82f6', 'Geavanceerde topics en technieken'),
('Recept', 'recept', '#ec4899', 'Recepten en kooktips'),
('Review', 'review', '#6366f1', 'Product en shop reviews'),
('Nieuws', 'nieuws', '#dc2626', 'Laatste nieuws en updates'),
('Vraag', 'vraag', '#059669', 'Vragen van de community')
ON CONFLICT (slug) DO NOTHING;