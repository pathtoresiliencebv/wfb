-- Create function to delete specific users
CREATE OR REPLACE FUNCTION delete_specific_users()
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  deleted_count INTEGER := 0;
  user_emails TEXT[] := ARRAY[
    'jason__m@outlook.com',
    'jmohabali@gmail.com', 
    'facturatie@pathtoresilience.nl',
    'pathtoresiliencebv@gmail.com',
    'contact@pathtoresilience.nl'
  ];
  email_item TEXT;
BEGIN
  -- Delete users from auth.users (cascades to profiles automatically)
  FOREACH email_item IN ARRAY user_emails
  LOOP
    DELETE FROM auth.users WHERE email = email_item;
    IF FOUND THEN
      deleted_count := deleted_count + 1;
    END IF;
  END LOOP;
  
  RETURN 'Successfully deleted ' || deleted_count || ' users';
END;
$$;

-- Execute the function to delete the users
SELECT delete_specific_users();

-- Drop the function after use
DROP FUNCTION delete_specific_users();