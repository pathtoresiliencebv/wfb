-- Drop the overly permissive policy
DROP POLICY IF EXISTS "Function can add participants" ON conversation_participants;

-- Create better RLS policy that validates conversation membership
CREATE POLICY "Controlled participant insertion"
ON conversation_participants
FOR INSERT
TO authenticated
WITH CHECK (
  -- Allow if inserting yourself
  user_id = auth.uid()
  OR
  -- Allow if you're already a participant in this conversation
  EXISTS (
    SELECT 1 FROM conversation_participants cp
    WHERE cp.conversation_id = conversation_id
    AND cp.user_id = auth.uid()
  )
);

-- Improve the create_conversation_with_participants function with better validation
CREATE OR REPLACE FUNCTION create_conversation_with_participants(participant_user_ids UUID[])
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  new_conversation_id UUID;
  participant_id UUID;
BEGIN
  -- Validate current user is authenticated
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  -- Validate that the current user is in the participants list
  IF NOT (auth.uid() = ANY(participant_user_ids)) THEN
    RAISE EXCEPTION 'Current user must be included in participants list';
  END IF;

  -- Validate that we have at least 2 participants
  IF array_length(participant_user_ids, 1) < 2 THEN
    RAISE EXCEPTION 'Conversation must have at least 2 participants';
  END IF;
  
  -- Validate all participants exist in profiles table
  IF EXISTS (
    SELECT 1 
    FROM unnest(participant_user_ids) AS uid
    WHERE NOT EXISTS (SELECT 1 FROM profiles WHERE user_id = uid)
  ) THEN
    RAISE EXCEPTION 'One or more participants do not exist';
  END IF;

  -- Create the conversation
  INSERT INTO conversations (created_at, updated_at, last_message_at)
  VALUES (NOW(), NOW(), NOW())
  RETURNING id INTO new_conversation_id;

  -- Add all participants with initial last_read_at set to NOW
  FOREACH participant_id IN ARRAY participant_user_ids
  LOOP
    INSERT INTO conversation_participants (conversation_id, user_id, joined_at, last_read_at)
    VALUES (new_conversation_id, participant_id, NOW(), NOW());
  END LOOP;

  RETURN new_conversation_id;
END;
$$;