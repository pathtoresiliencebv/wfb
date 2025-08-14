-- Create leverancier profile (the auth user will be created via signup)
DO $$
DECLARE
    leverancier_user_id uuid;
    testuser_user_id uuid;
BEGIN
    -- Create leverancier profile with a placeholder user_id that will be updated
    INSERT INTO public.profiles (
        user_id,
        username,
        display_name,
        role,
        reputation,
        created_at,
        updated_at
    ) VALUES (
        gen_random_uuid(), -- This will be updated when the user signs up
        'leverancier',
        'Test Leverancier',
        'supplier',
        100,
        now(),
        now()
    ) ON CONFLICT (username) DO UPDATE SET
        display_name = EXCLUDED.display_name,
        role = EXCLUDED.role,
        updated_at = now();

    -- Create testuser profile with a placeholder user_id that will be updated  
    INSERT INTO public.profiles (
        user_id,
        username,
        display_name,
        role,
        reputation,
        created_at,
        updated_at
    ) VALUES (
        gen_random_uuid(), -- This will be updated when the user signs up
        'testuser',
        'Test User',
        'user',
        50,
        now(),
        now()
    ) ON CONFLICT (username) DO UPDATE SET
        display_name = EXCLUDED.display_name,
        role = EXCLUDED.role,
        updated_at = now();
END $$;