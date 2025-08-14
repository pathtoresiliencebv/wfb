-- Create test accounts for development
-- Admin account (already exists, just update profile if needed)
INSERT INTO public.profiles (user_id, username, display_name, role) 
SELECT au.id, 'admin', 'WietForum Admin', 'admin'
FROM auth.users au 
WHERE au.email = 'info@wietforumbelgie.com'
ON CONFLICT (user_id) DO UPDATE SET
  username = 'admin',
  display_name = 'WietForum Admin',
  role = 'admin';

-- Create supplier test account
DO $$
DECLARE
    supplier_user_id uuid;
    supplier_profile_id uuid;
BEGIN
    -- Insert supplier user (this would normally be done through Supabase Auth API)
    -- For testing purposes, we'll create a profile that references an auth user
    
    -- Check if supplier user exists
    SELECT id INTO supplier_user_id FROM auth.users WHERE email = 'leverancier@test.com' LIMIT 1;
    
    IF supplier_user_id IS NULL THEN
        -- We can't create auth.users directly from SQL, so we'll use a placeholder
        -- The application will need to create this via Supabase Auth
        RAISE NOTICE 'Supplier auth user needs to be created via application';
    ELSE
        -- Create/update supplier profile
        INSERT INTO public.profiles (user_id, username, display_name, role)
        VALUES (supplier_user_id, 'leverancier', 'Test Leverancier', 'supplier')
        ON CONFLICT (user_id) DO UPDATE SET
          username = 'leverancier',
          display_name = 'Test Leverancier',
          role = 'supplier';
          
        -- Create supplier profile
        INSERT INTO public.supplier_profiles (
          user_id, business_name, description, contact_info, stats, features, ranking, is_active
        ) VALUES (
          supplier_user_id,
          'Test Leverancier Shop',
          'Test leverancier voor ontwikkeling',
          '{}',
          '{}',
          '{}',
          0,
          true
        ) ON CONFLICT (user_id) DO UPDATE SET
          business_name = 'Test Leverancier Shop',
          description = 'Test leverancier voor ontwikkeling';
    END IF;
END $$;

-- Create regular test user
DO $$
DECLARE
    test_user_id uuid;
BEGIN
    -- Check if test user exists
    SELECT id INTO test_user_id FROM auth.users WHERE email = 'testuser@test.com' LIMIT 1;
    
    IF test_user_id IS NULL THEN
        RAISE NOTICE 'Test user auth account needs to be created via application';
    ELSE
        -- Create/update test user profile
        INSERT INTO public.profiles (user_id, username, display_name, role)
        VALUES (test_user_id, 'testuser', 'Test Gebruiker', 'user')
        ON CONFLICT (user_id) DO UPDATE SET
          username = 'testuser',
          display_name = 'Test Gebruiker',
          role = 'user';
    END IF;
END $$;

-- Function to lookup email by username for login
CREATE OR REPLACE FUNCTION public.get_email_by_username(input_username text)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
    user_email text;
BEGIN
    SELECT au.email INTO user_email
    FROM public.profiles p
    JOIN auth.users au ON p.user_id = au.id
    WHERE p.username = input_username;
    
    RETURN user_email;
END;
$$;