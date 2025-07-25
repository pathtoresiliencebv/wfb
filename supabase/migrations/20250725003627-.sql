-- Create storage buckets for assets
INSERT INTO storage.buckets (id, name, public) VALUES ('assets', 'assets', true)
ON CONFLICT (id) DO NOTHING;

-- Create policies for public access to assets
CREATE POLICY "Assets are publicly accessible" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'assets');

CREATE POLICY "Authenticated users can upload assets" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'assets' AND auth.role() = 'authenticated');