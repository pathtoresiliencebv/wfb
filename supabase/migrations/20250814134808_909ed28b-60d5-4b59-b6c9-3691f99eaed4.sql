-- Fix test accounts for username/password login
-- Create proper test accounts with correct roles and profiles

-- First, let's ensure we have the test accounts with proper setup
DO $$
DECLARE
    admin_user_id UUID;
    supplier_user_id UUID;
    user_user_id UUID;
BEGIN
    -- Check if admin account exists with correct username
    UPDATE profiles 
    SET username = 'admin', role = 'admin'
    WHERE user_id IN (
        SELECT id FROM auth.users WHERE email = 'info@wietforumbelgie.com'
    );

    -- Create leverancier test account if it doesn't exist
    SELECT user_id INTO supplier_user_id 
    FROM profiles 
    WHERE username = 'leverancier' AND role = 'supplier';
    
    IF supplier_user_id IS NULL THEN
        -- Insert leverancier profile (assuming auth.users entry will be created via signup)
        INSERT INTO profiles (user_id, username, display_name, role)
        SELECT 
            gen_random_uuid(),
            'leverancier',
            'Test Leverancier', 
            'supplier'
        WHERE NOT EXISTS (
            SELECT 1 FROM profiles WHERE username = 'leverancier'
        );
        
        -- Get the user_id we just created
        SELECT user_id INTO supplier_user_id 
        FROM profiles 
        WHERE username = 'leverancier';
        
        -- Create supplier profile
        INSERT INTO supplier_profiles (
            user_id,
            business_name,
            description,
            contact_info,
            stats,
            features,
            ranking,
            is_active
        ) VALUES (
            supplier_user_id,
            'Test Leverancier Shop',
            'Test leverancier voor ontwikkeling en testing',
            '{"phone": "+32 123 456 789", "address": "Test Straat 123, 1000 Brussel"}'::jsonb,
            '{"customers": 0, "rating": 5.0, "orders": 0}'::jsonb,
            ARRAY['Snelle levering', 'Discrete verpakking', 'Premium kwaliteit'],
            1,
            true
        ) ON CONFLICT (user_id) DO NOTHING;
    END IF;

    -- Create testuser account if it doesn't exist
    SELECT user_id INTO user_user_id 
    FROM profiles 
    WHERE username = 'testuser' AND role = 'user';
    
    IF user_user_id IS NULL THEN
        -- Insert testuser profile
        INSERT INTO profiles (user_id, username, display_name, role)
        SELECT 
            gen_random_uuid(),
            'testuser',
            'Test Gebruiker',
            'user'
        WHERE NOT EXISTS (
            SELECT 1 FROM profiles WHERE username = 'testuser'
        );
    END IF;
END $$;

-- Create a function to help with username to email lookup
CREATE OR REPLACE FUNCTION public.get_email_by_username(input_username text)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    user_email text;
BEGIN
    -- First try direct username lookup in profiles
    SELECT au.email INTO user_email
    FROM profiles p
    JOIN auth.users au ON p.user_id = au.id
    WHERE p.username = input_username;
    
    -- If not found and it's a test account, return test email
    IF user_email IS NULL THEN
        CASE input_username
            WHEN 'admin' THEN user_email := 'info@wietforumbelgie.com';
            WHEN 'leverancier' THEN user_email := 'leverancier@test.com';
            WHEN 'testuser' THEN user_email := 'testuser@test.com';
            ELSE user_email := NULL;
        END CASE;
    END IF;
    
    RETURN user_email;
END;
$$;