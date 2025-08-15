-- Add new fields to supplier_profiles table for USP and process descriptions
ALTER TABLE public.supplier_profiles 
ADD COLUMN why_choose_us_descriptions jsonb DEFAULT '{}'::jsonb,
ADD COLUMN ordering_process_descriptions jsonb DEFAULT '{}'::jsonb,
ADD COLUMN contact_description text,
ADD COLUMN product_name text DEFAULT 'producten';