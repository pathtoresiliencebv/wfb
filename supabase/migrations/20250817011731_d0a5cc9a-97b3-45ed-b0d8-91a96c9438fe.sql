-- Fix foreign key relationship between images and profiles
-- Add foreign key constraint to ensure proper relationship
ALTER TABLE public.images 
ADD CONSTRAINT fk_images_user_profiles 
FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;