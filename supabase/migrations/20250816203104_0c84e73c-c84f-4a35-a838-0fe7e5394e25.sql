-- Create a function to reset the admin password
CREATE OR REPLACE FUNCTION reset_admin_password()
RETURNS TEXT AS $$
DECLARE
  admin_user_id UUID;
BEGIN
  -- Find admin user by email
  SELECT id INTO admin_user_id
  FROM auth.users 
  WHERE email = 'info@wietforumbelgie.com';
  
  IF admin_user_id IS NULL THEN
    RETURN 'Admin user not found with email info@wietforumbelgie.com';
  END IF;
  
  -- Update the user to be email confirmed
  UPDATE auth.users 
  SET 
    email_confirmed_at = now(),
    confirmation_token = NULL,
    updated_at = now()
  WHERE id = admin_user_id;
  
  RETURN 'Admin user email confirmed and ready for login';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;