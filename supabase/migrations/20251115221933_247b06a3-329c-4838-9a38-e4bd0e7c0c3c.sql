-- Complete fix for conversation_participants and messages RLS policies
-- This fixes the infinite recursion and enables proper message creation

-- Fix 1: Correct INSERT policy on conversation_participants
DROP POLICY IF EXISTS "Controlled participant insertion" ON conversation_participants;

CREATE POLICY "Controlled participant insertion"
ON conversation_participants
FOR INSERT
TO authenticated
WITH CHECK (
  user_id = auth.uid()
  OR
  EXISTS (
    SELECT 1 
    FROM conversation_participants cp
    WHERE cp.conversation_id = conversation_participants.conversation_id
    AND cp.user_id = auth.uid()
  )
);

-- Fix 2: Add proper messages table policies
DROP POLICY IF EXISTS "Users can insert messages in their conversations" ON messages;
DROP POLICY IF EXISTS "Users can select messages in their conversations" ON messages;

CREATE POLICY "Users can insert messages in their conversations"
ON messages
FOR INSERT
TO authenticated
WITH CHECK (
  sender_id = auth.uid() 
  AND public.is_conversation_participant(conversation_id, auth.uid())
);

CREATE POLICY "Users can select messages in their conversations"
ON messages
FOR SELECT
TO authenticated
USING (
  public.is_conversation_participant(conversation_id, auth.uid())
);