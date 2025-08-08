-- Update topic counts in categories table to match actual counts
UPDATE categories SET topic_count = (
  SELECT COUNT(*) FROM topics WHERE topics.category_id = categories.id
) WHERE id IN (
  SELECT c.id 
  FROM categories c 
  LEFT JOIN topics t ON c.id = t.category_id 
  GROUP BY c.id 
  HAVING c.topic_count != COUNT(t.id)
);