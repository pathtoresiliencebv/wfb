-- Create admin user via SQL if possible
-- First check current auth users
DO $$
DECLARE
    admin_user_id UUID;
BEGIN
    -- Try to create admin user directly in auth.users if we have permission
    INSERT INTO auth.users (
        instance_id,
        id,
        aud,
        role,
        email,
        encrypted_password,
        email_confirmed_at,
        created_at,
        updated_at,
        raw_user_meta_data,
        is_super_admin
    ) VALUES (
        '00000000-0000-0000-0000-000000000000',
        gen_random_uuid(),
        'authenticated',
        'authenticated', 
        'info@wietforumbelgie.com',
        crypt('Qwerty12345678!@', gen_salt('bf')),
        now(),
        now(),
        now(),
        '{"username": "wietforum-admin", "display_name": "WietForum Admin", "role": "admin"}'::jsonb,
        false
    ) RETURNING id INTO admin_user_id;
    
    RAISE NOTICE 'Admin user created with ID: %', admin_user_id;
    
EXCEPTION 
    WHEN OTHERS THEN
        RAISE NOTICE 'Could not create user directly in auth schema: %', SQLERRM;
END $$;