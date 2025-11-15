-- Create function to find existing conversation between two users
CREATE OR REPLACE FUNCTION find_existing_conversation(
  current_user_id UUID,
  other_user_id UUID
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  existing_conv_id UUID;
BEGIN
  -- Find conversation with exactly 2 participants (current user + other user)
  SELECT cp1.conversation_id INTO existing_conv_id
  FROM conversation_participants cp1
  WHERE cp1.user_id = current_user_id
  AND EXISTS (
    SELECT 1 FROM conversation_participants cp2
    WHERE cp2.conversation_id = cp1.conversation_id
    AND cp2.user_id = other_user_id
  )
  AND (
    SELECT COUNT(*) FROM conversation_participants cp3
    WHERE cp3.conversation_id = cp1.conversation_id
  ) = 2
  LIMIT 1;
  
  RETURN existing_conv_id;
END;
$$;

-- Cleanup duplicate conversations - keep only the most recent one per user pair
WITH duplicates AS (
  SELECT 
    c.id as conversation_id,
    ROW_NUMBER() OVER (
      PARTITION BY LEAST(cp1.user_id, cp2.user_id), GREATEST(cp1.user_id, cp2.user_id)
      ORDER BY c.created_at DESC
    ) as rn
  FROM conversations c
  JOIN conversation_participants cp1 ON c.id = cp1.conversation_id
  JOIN conversation_participants cp2 ON c.id = cp2.conversation_id
  WHERE cp1.user_id < cp2.user_id
)
DELETE FROM conversations
WHERE id IN (
  SELECT conversation_id FROM duplicates WHERE rn > 1
);