-- Drop the problematic RLS policy and create a simpler one
DROP POLICY IF EXISTS "Authenticated users can join conversations" ON conversation_participants;
DROP POLICY IF EXISTS "Users can add participants to their conversations" ON conversation_participants;

-- Create simplified INSERT policy for conversation_participants
CREATE POLICY "Function can add participants"
ON conversation_participants
FOR INSERT
TO authenticated
WITH CHECK (true);

-- Create function to create conversation with participants
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
  -- Validate that the current user is in the participants list
  IF NOT (auth.uid() = ANY(participant_user_ids)) THEN
    RAISE EXCEPTION 'Current user must be included in participants list';
  END IF;

  -- Validate that we have at least 2 participants
  IF array_length(participant_user_ids, 1) < 2 THEN
    RAISE EXCEPTION 'Conversation must have at least 2 participants';
  END IF;

  -- Create the conversation
  INSERT INTO conversations (created_at, updated_at, last_message_at)
  VALUES (NOW(), NOW(), NOW())
  RETURNING id INTO new_conversation_id;

  -- Add all participants
  FOREACH participant_id IN ARRAY participant_user_ids
  LOOP
    INSERT INTO conversation_participants (conversation_id, user_id, joined_at)
    VALUES (new_conversation_id, participant_id, NOW());
  END LOOP;

  RETURN new_conversation_id;
END;
$$;