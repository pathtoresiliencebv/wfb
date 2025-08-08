-- Fix infinite recursion in conversation_participants RLS policy
-- Drop the problematic policy first
DROP POLICY IF EXISTS "Users can view participants of their conversations" ON public.conversation_participants;

-- Create a new policy that avoids infinite recursion by using a direct approach
CREATE POLICY "Users can view participants of their conversations" 
ON public.conversation_participants 
FOR SELECT 
USING (
  user_id = auth.uid() OR 
  conversation_id IN (
    SELECT conversation_id 
    FROM public.conversation_participants 
    WHERE user_id = auth.uid()
  )
);

-- Ensure we have basic categories for topic creation
INSERT INTO public.categories (name, slug, description, icon, color, is_active, sort_order) 
VALUES 
  ('Medicinaal', 'medicinaal', 'Discussies over medicinaal cannabis gebruik', '🏥', '#059669', true, 1),
  ('Algemeen', 'algemeen', 'Algemene discussies over cannabis', '💬', '#3b82f6', true, 2),
  ('Groei & Kweek', 'groei-kweek', 'Tips en tricks voor het kweken van cannabis', '🌱', '#10b981', true, 3),
  ('Wetgeving', 'wetgeving', 'Juridische aspecten en wetgeving rond cannabis', '⚖️', '#8b5cf6', true, 4)
ON CONFLICT (slug) DO NOTHING;

-- Fix user_online_status foreign key relationship if it doesn't exist
-- First, let's ensure the foreign key constraint exists
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'user_online_status_user_id_fkey' 
    AND table_name = 'user_online_status'
  ) THEN
    -- Add foreign key constraint to profiles table instead of auth.users
    ALTER TABLE public.user_online_status 
    ADD CONSTRAINT user_online_status_user_id_fkey 
    FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;
  END IF;
END $$;