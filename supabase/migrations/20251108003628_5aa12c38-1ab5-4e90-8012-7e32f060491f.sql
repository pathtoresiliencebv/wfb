-- Add parent_reply_id for threaded replies
ALTER TABLE replies 
ADD COLUMN IF NOT EXISTS parent_reply_id uuid REFERENCES replies(id) ON DELETE CASCADE;

-- Add index for better performance on threaded queries
CREATE INDEX IF NOT EXISTS idx_replies_parent_id ON replies(parent_reply_id);

-- Add depth tracking for easier thread management
ALTER TABLE replies 
ADD COLUMN IF NOT EXISTS depth integer DEFAULT 0;

-- Function to calculate reply depth
CREATE OR REPLACE FUNCTION calculate_reply_depth()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.parent_reply_id IS NULL THEN
    NEW.depth := 0;
  ELSE
    SELECT COALESCE(depth, 0) + 1 INTO NEW.depth
    FROM replies
    WHERE id = NEW.parent_reply_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-calculate depth
DROP TRIGGER IF EXISTS set_reply_depth ON replies;
CREATE TRIGGER set_reply_depth
  BEFORE INSERT OR UPDATE ON replies
  FOR EACH ROW
  EXECUTE FUNCTION calculate_reply_depth();