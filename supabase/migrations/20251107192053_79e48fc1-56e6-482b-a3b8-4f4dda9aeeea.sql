-- Create function to get user rank based on reputation
CREATE OR REPLACE FUNCTION get_user_rank(user_id uuid)
RETURNS bigint AS $$
DECLARE
  user_rank bigint;
BEGIN
  SELECT row_number INTO user_rank
  FROM (
    SELECT 
      user_id as id,
      ROW_NUMBER() OVER (ORDER BY reputation DESC, created_at ASC) as row_number
    FROM profiles
  ) ranked
  WHERE id = user_id;
  
  RETURN COALESCE(user_rank, 0);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;