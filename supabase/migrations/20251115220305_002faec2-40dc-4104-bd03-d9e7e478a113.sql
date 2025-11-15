-- Fix conversation_participants RLS policy
-- Drop restrictive policy that only allows viewing own participation
DROP POLICY IF EXISTS "Users can view their own participation" ON conversation_participants;

-- Create new policy: users can view all participants in conversations they're part of
CREATE POLICY "Users can view participants in their conversations"
ON conversation_participants
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 
    FROM conversation_participants cp
    WHERE cp.conversation_id = conversation_participants.conversation_id
    AND cp.user_id = auth.uid()
  )
);

-- Ensure profiles are viewable by authenticated users for messaging
DROP POLICY IF EXISTS "Authenticated users can view all profiles" ON profiles;

CREATE POLICY "Authenticated users can view all profiles"
ON profiles
FOR SELECT
TO authenticated
USING (auth.uid() IS NOT NULL);