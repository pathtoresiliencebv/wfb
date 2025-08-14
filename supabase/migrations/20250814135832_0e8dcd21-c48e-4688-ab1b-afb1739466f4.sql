-- Create leverancier and testuser accounts
-- These will be created through the auth.users table and handled by our trigger

-- First, let's ensure we have proper test accounts in the auth system
-- We'll create these accounts with proper metadata for our handle_new_user trigger

-- Create leverancier account in auth.users (this will trigger profile creation)
DO $$
DECLARE
    leverancier_user_id UUID;
    testuser_user_id UUID;
BEGIN
    -- Insert leverancier into auth.users (simplified for development)
    INSERT INTO auth.users (
        id,
        email,
        encrypted_password,
        email_confirmed_at,
        created_at,
        updated_at,
        raw_user_meta_data,
        is_super_admin,
        role
    ) VALUES (
        gen_random_uuid(),
        'leverancier@test.com',
        crypt('12345678', gen_salt('bf')),
        now(),
        now(),
        now(),
        jsonb_build_object(
            'username', 'leverancier',
            'display_name', 'Test Leverancier',
            'role', 'supplier'
        ),
        false,
        'authenticated'
    ) ON CONFLICT (email) DO NOTHING
    RETURNING id INTO leverancier_user_id;

    -- Insert testuser into auth.users
    INSERT INTO auth.users (
        id,
        email,
        encrypted_password,
        email_confirmed_at,
        created_at,
        updated_at,
        raw_user_meta_data,
        is_super_admin,
        role
    ) VALUES (
        gen_random_uuid(),
        'testuser@test.com',
        crypt('testuser123', gen_salt('bf')),
        now(),
        now(),
        now(),
        jsonb_build_object(
            'username', 'testuser',
            'display_name', 'Test Gebruiker',
            'role', 'user'
        ),
        false,
        'authenticated'
    ) ON CONFLICT (email) DO NOTHING
    RETURNING id INTO testuser_user_id;

    -- If we got IDs, manually create profiles (in case trigger didn't fire)
    IF leverancier_user_id IS NOT NULL THEN
        INSERT INTO public.profiles (user_id, username, display_name, role)
        VALUES (leverancier_user_id, 'leverancier', 'Test Leverancier', 'supplier')
        ON CONFLICT (user_id) DO NOTHING;
        
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
            'Test Leverancier Shop',
            'Test leverancier voor ontwikkeling en testing',
            '{"phone": "+32 123 456 789", "address": "Test Straat 123, 1000 Brussel"}'::jsonb,
            '{"customers": 0, "rating": 5.0, "orders": 0}'::jsonb,
            ARRAY['Snelle levering', 'Discrete verpakking', 'Premium kwaliteit'],
            1,
            true
        ) ON CONFLICT (user_id) DO NOTHING;
    END IF;

    IF testuser_user_id IS NOT NULL THEN
        INSERT INTO public.profiles (user_id, username, display_name, role)
        VALUES (testuser_user_id, 'testuser', 'Test Gebruiker', 'user')
        ON CONFLICT (user_id) DO NOTHING;
    END IF;

    -- Also make sure to get existing user IDs for accounts that might already exist
    SELECT user_id INTO leverancier_user_id 
    FROM profiles WHERE username = 'leverancier' AND role = 'supplier';
    
    SELECT user_id INTO testuser_user_id 
    FROM profiles WHERE username = 'testuser' AND role = 'user';

    -- Create supplier profile if leverancier exists but no supplier profile
    IF leverancier_user_id IS NOT NULL THEN
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
            'Test Leverancier Shop',
            'Test leverancier voor ontwikkeling en testing',
            '{"phone": "+32 123 456 789", "address": "Test Straat 123, 1000 Brussel"}'::jsonb,
            '{"customers": 0, "rating": 5.0, "orders": 0}'::jsonb,
            ARRAY['Snelle levering', 'Discrete verpakking', 'Premium kwaliteit'],
            1,
            true
        ) ON CONFLICT (user_id) DO NOTHING;
    END IF;
END $$;

-- Update the email lookup function to handle our test accounts correctly
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
            WHEN 'admin' THEN user_email := 'jason__m@outlook.com';
            WHEN 'leverancier' THEN user_email := 'leverancier@test.com';
            WHEN 'testuser' THEN user_email := 'testuser@test.com';
            ELSE user_email := NULL;
        END CASE;
    END IF;
    
    RETURN user_email;
END;
$$;