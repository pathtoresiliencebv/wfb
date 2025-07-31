-- Update category statistics
UPDATE categories SET 
  topic_count = (SELECT COUNT(*) FROM topics WHERE topics.category_id = categories.id),
  reply_count = (SELECT COUNT(*) FROM replies r JOIN topics t ON r.topic_id = t.id WHERE t.category_id = categories.id);