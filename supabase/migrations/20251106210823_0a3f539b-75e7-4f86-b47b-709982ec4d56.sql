-- Cleanup: Verwijder ongeldige test data voor messaging
-- Dit verwijdert conversaties en berichten die verwijzen naar niet-bestaande gebruikers

-- Stap 1: Verwijder oude messages die verwijzen naar niet-bestaande users
DELETE FROM messages 
WHERE conversation_id IN (
  SELECT DISTINCT conversation_id 
  FROM conversation_participants 
  WHERE user_id NOT IN (SELECT user_id FROM profiles)
);

-- Stap 2: Verwijder oude conversation_participants met niet-bestaande users
DELETE FROM conversation_participants 
WHERE user_id NOT IN (SELECT user_id FROM profiles);

-- Stap 3: Verwijder conversations zonder participants (opruimen)
DELETE FROM conversations 
WHERE id NOT IN (SELECT DISTINCT conversation_id FROM conversation_participants);