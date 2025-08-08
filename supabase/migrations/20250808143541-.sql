-- Add image_url column to categories table for forum category photos
ALTER TABLE public.categories 
ADD COLUMN image_url TEXT;