-- Add image and color fields to topics table
ALTER TABLE public.topics 
ADD COLUMN image_url text,
ADD COLUMN color character varying DEFAULT '#10b981';