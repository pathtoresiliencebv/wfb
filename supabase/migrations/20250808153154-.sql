-- Remove all dummy topics and replies
DELETE FROM replies WHERE topic_id IN (
  SELECT id FROM topics WHERE author_id IN (
    SELECT user_id FROM profiles WHERE username LIKE 'user_%' 
    OR username = 'testtest' 
    OR username = 'test'
    OR username = 'junkie'
  )
);

DELETE FROM topic_tags WHERE topic_id IN (
  SELECT id FROM topics WHERE author_id IN (
    SELECT user_id FROM profiles WHERE username LIKE 'user_%' 
    OR username = 'testtest' 
    OR username = 'test'
    OR username = 'junkie'
  )
);

DELETE FROM topics WHERE author_id IN (
  SELECT user_id FROM profiles WHERE username LIKE 'user_%' 
  OR username = 'testtest' 
  OR username = 'test'
  OR username = 'junkie'
);

-- Clean up dummy/test user profiles (keep only admin user)
DELETE FROM profiles WHERE username LIKE 'user_%' 
OR username = 'testtest' 
OR username = 'test'
OR username = 'junkie';

-- Reset category topic counts to 0
UPDATE categories SET topic_count = 0, reply_count = 0;

-- Clean up any other dummy data in related tables
DELETE FROM votes WHERE user_id NOT IN (SELECT user_id FROM profiles);
DELETE FROM bookmarks WHERE user_id NOT IN (SELECT user_id FROM profiles);
DELETE FROM user_achievements WHERE user_id NOT IN (SELECT user_id FROM profiles);
DELETE FROM user_levels WHERE user_id NOT IN (SELECT user_id FROM profiles);
DELETE FROM user_streaks WHERE user_id NOT IN (SELECT user_id FROM profiles);
DELETE FROM notifications WHERE user_id NOT IN (SELECT user_id FROM profiles);
DELETE FROM activity_feed WHERE user_id NOT IN (SELECT user_id FROM profiles);
DELETE FROM user_points WHERE user_id NOT IN (SELECT user_id FROM profiles);
DELETE FROM reputation_history WHERE user_id NOT IN (SELECT user_id FROM profiles);

-- Reset auto-generated IDs and sequences where possible
-- This ensures clean slate for new data