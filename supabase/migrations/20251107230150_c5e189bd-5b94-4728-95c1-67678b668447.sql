-- Fix infinite recursion in conversation_participants RLS policies
-- Drop the problematic circular policy that causes infinite recursion
DROP POLICY IF EXISTS "Users can view participants of their conversations" 
ON public.conversation_participants;

-- The remaining policies are sufficient and safe:
-- "Users can view their own participation" USING (user_id = auth.uid())
-- This allows users to see their own participation records without recursion

-- The conversations and messages policies can safely reference 
-- conversation_participants without causing recursion because 
-- they only trigger the simple user_id = auth.uid() check