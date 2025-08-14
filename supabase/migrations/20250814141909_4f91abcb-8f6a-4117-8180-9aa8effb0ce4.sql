-- Create test users using supabase auth admin functions
-- Note: This requires admin privileges

-- Function to create test users with proper auth setup
CREATE OR REPLACE FUNCTION create_test_accounts()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  admin_user_id uuid;
  leverancier_user_id uuid;
  testuser_user_id uuid;
BEGIN
  -- Create admin account if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'admin@test.com') THEN
    INSERT INTO auth.users (
      instance_id,
      id,
      aud,
      role,
      email,
      encrypted_password,
      email_confirmed_at,
      recovery_sent_at,
      last_sign_in_at,
      raw_app_meta_data,
      raw_user_meta_data,
      created_at,
      updated_at,
      confirmation_token,
      email_change,
      email_change_token_new,
      recovery_token
    ) VALUES (
      '00000000-0000-0000-0000-000000000000',
      gen_random_uuid(),
      'authenticated',
      'authenticated',
      'admin@test.com',
      crypt('admin123', gen_salt('bf')),
      NOW(),
      NULL,
      NULL,
      '{"provider":"email","providers":["email"]}',
      '{"username":"admin","display_name":"Test Admin","role":"admin"}',
      NOW(),
      NOW(),
      '',
      '',
      '',
      ''
    ) RETURNING id INTO admin_user_id;
    
    -- Create profile for admin
    INSERT INTO public.profiles (user_id, username, display_name, role)
    VALUES (admin_user_id, 'admin', 'Test Admin', 'admin');
  END IF;

  -- Create leverancier account if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'leverancier@test.com') THEN
    INSERT INTO auth.users (
      instance_id,
      id,
      aud,
      role,
      email,
      encrypted_password,
      email_confirmed_at,
      recovery_sent_at,
      last_sign_in_at,
      raw_app_meta_data,
      raw_user_meta_data,
      created_at,
      updated_at,
      confirmation_token,
      email_change,
      email_change_token_new,
      recovery_token
    ) VALUES (
      '00000000-0000-0000-0000-000000000000',
      gen_random_uuid(),
      'authenticated',
      'authenticated',
      'leverancier@test.com',
      crypt('12345678', gen_salt('bf')),
      NOW(),
      NULL,
      NULL,
      '{"provider":"email","providers":["email"]}',
      '{"username":"leverancier","display_name":"Test Leverancier","role":"supplier"}',
      NOW(),
      NOW(),
      '',
      '',
      '',
      ''
    ) RETURNING id INTO leverancier_user_id;
    
    -- Create profile for leverancier
    INSERT INTO public.profiles (user_id, username, display_name, role)
    VALUES (leverancier_user_id, 'leverancier', 'Test Leverancier', 'supplier');
    
    -- Create supplier profile
    INSERT INTO public.supplier_profiles (
      user_id,
      business_name,
      description,
      contact_info,
      stats,
      features,
      ranking,
      is_active
    ) VALUES (
      leverancier_user_id,
      'Test Leverancier Business',
      'Test supplier account voor development',
      '{}',
      '{}',
      '{}',
      0,
      true
    );
  END IF;

  -- Create testuser account if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'testuser@test.com') THEN
    INSERT INTO auth.users (
      instance_id,
      id,
      aud,
      role,
      email,
      encrypted_password,
      email_confirmed_at,
      recovery_sent_at,
      last_sign_in_at,
      raw_app_meta_data,
      raw_user_meta_data,
      created_at,
      updated_at,
      confirmation_token,
      email_change,
      email_change_token_new,
      recovery_token
    ) VALUES (
      '00000000-0000-0000-0000-000000000000',
      gen_random_uuid(),
      'authenticated',
      'authenticated',
      'testuser@test.com',
      crypt('testuser123', gen_salt('bf')),
      NOW(),
      NULL,
      NULL,
      '{"provider":"email","providers":["email"]}',
      '{"username":"testuser","display_name":"Test User","role":"user"}',
      NOW(),
      NOW(),
      '',
      '',
      '',
      ''
    ) RETURNING id INTO testuser_user_id;
    
    -- Create profile for testuser
    INSERT INTO public.profiles (user_id, username, display_name, role)
    VALUES (testuser_user_id, 'testuser', 'Test User', 'user');
  END IF;
END;
$$;

-- Execute the function to create test accounts
SELECT create_test_accounts();

-- Drop the function after use
DROP FUNCTION create_test_accounts();