-- Create missing profiles for existing users without profiles
INSERT INTO public.profiles (user_id, username, display_name, role)
SELECT 
  au.id,
  'user_' || substr(au.id::text, 1, 8),
  split_part(au.email, '@', 1),
  'user'
FROM auth.users au
LEFT JOIN public.profiles p ON au.id = p.user_id
WHERE p.user_id IS NULL;

-- Create the handle_new_user function to automatically create profiles
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  -- Check if this is the admin email
  IF NEW.email = 'info@wietforumbelgie.com' THEN
    -- Create admin profile with admin role
    INSERT INTO public.profiles (user_id, username, display_name, role)
    VALUES (
      NEW.id,
      'wietforum-admin',
      'WietForum Admin',
      'admin'
    );
  ELSE
    -- Only create profile if it doesn't already exist
    IF NOT EXISTS (SELECT 1 FROM public.profiles WHERE user_id = NEW.id) THEN
      INSERT INTO public.profiles (user_id, username, display_name, role)
      VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'username', 'user_' || substr(NEW.id::text, 1, 8)),
        COALESCE(NEW.raw_user_meta_data->>'display_name', NEW.raw_user_meta_data->>'username', split_part(NEW.email, '@', 1)),
        COALESCE(NEW.raw_user_meta_data->>'role', 'user')
      );
      
      -- If the role is supplier, also create supplier profile
      IF COALESCE(NEW.raw_user_meta_data->>'role', 'user') = 'supplier' THEN
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
          NEW.id,
          COALESCE(NEW.raw_user_meta_data->>'display_name', NEW.raw_user_meta_data->>'username', split_part(NEW.email, '@', 1)),
          NULL,
          '{}',
          '{}',
          '{}',
          0,
          true
        );
      END IF;
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$;

-- Create the trigger to call the function when a new user is created
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();