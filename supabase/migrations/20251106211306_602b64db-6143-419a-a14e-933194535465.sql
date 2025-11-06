-- Cleanup orphaned records in user_online_status (if any)
DELETE FROM user_online_status
WHERE user_id NOT IN (SELECT id FROM auth.users);

-- Zorg dat elke user een online_status heeft
INSERT INTO user_online_status (user_id, is_online, last_seen)
SELECT p.user_id, false, p.created_at
FROM profiles p
WHERE p.user_id NOT IN (SELECT user_id FROM user_online_status)
ON CONFLICT (user_id) DO NOTHING;

-- Voeg kolommen toe aan messages tabel voor edit/delete functionaliteit
ALTER TABLE messages 
ADD COLUMN IF NOT EXISTS is_deleted BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS is_edited BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS edited_at TIMESTAMP WITH TIME ZONE;

-- Index voor performance
CREATE INDEX IF NOT EXISTS idx_messages_not_deleted ON messages(conversation_id) 
WHERE is_deleted = false;