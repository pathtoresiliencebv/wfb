-- Fix foreign key relationship between images and profiles
-- First drop the existing constraint if it exists
ALTER TABLE public.images DROP CONSTRAINT IF EXISTS fk_images_user_profiles;

-- Add the correct foreign key constraint linking to profiles table
ALTER TABLE public.images 
ADD CONSTRAINT fk_images_user_profiles 
FOREIGN KEY (user_id) REFERENCES public.profiles(user_id) ON DELETE CASCADE;