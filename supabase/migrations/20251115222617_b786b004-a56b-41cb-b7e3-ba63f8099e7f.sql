-- Drop oude policy op conversations
DROP POLICY IF EXISTS "Users can view conversations they participate in" ON conversations;

-- Nieuwe eenvoudige policy zonder afhankelijkheid van joins
CREATE POLICY "Users can view conversations they participate in"
ON conversations
FOR SELECT
TO authenticated
USING (
  id IN (
    SELECT conversation_id 
    FROM conversation_participants 
    WHERE user_id = auth.uid()
  )
);