-- Fix conversations RLS policies for authenticated users
DROP POLICY IF EXISTS "Users can create conversations" ON public.conversations;
DROP POLICY IF EXISTS "Users can join conversations" ON public.conversation_participants;

-- Allow authenticated users to create conversations
CREATE POLICY "Authenticated users can create conversations" 
ON public.conversations
FOR INSERT 
TO authenticated
WITH CHECK (true);

-- Allow authenticated users to add themselves as participants
CREATE POLICY "Authenticated users can join conversations" 
ON public.conversation_participants
FOR INSERT 
TO authenticated
WITH CHECK (user_id = auth.uid());

-- Allow authenticated users to add other participants (needed for creating conversations)
CREATE POLICY "Users can add participants to their conversations" 
ON public.conversation_participants
FOR INSERT 
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.conversation_participants
    WHERE conversation_id = conversation_participants.conversation_id
    AND user_id = auth.uid()
  )
  OR NOT EXISTS (
    SELECT 1 FROM public.conversation_participants
    WHERE conversation_id = conversation_participants.conversation_id
  )
);