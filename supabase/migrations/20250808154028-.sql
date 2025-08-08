-- Fix the profile creation trigger with correct column names
-- Drop and recreate the profile creation function
DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  -- Only create profile if it doesn't already exist
  IF NOT EXISTS (SELECT 1 FROM public.profiles WHERE user_id = NEW.id) THEN
    INSERT INTO public.profiles (user_id, username, display_name, role)
    VALUES (
      NEW.id,
      COALESCE(NEW.raw_user_meta_data->>'username', 'user_' || substr(NEW.id::text, 1, 8)),
      COALESCE(NEW.raw_user_meta_data->>'display_name', NEW.raw_user_meta_data->>'username', split_part(NEW.email, '@', 1)),
      COALESCE(NEW.raw_user_meta_data->>'role', 'user')
    );
  END IF;
  RETURN NEW;
END;
$$;

-- Recreate the trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create missing profile for existing user if needed
DO $$
BEGIN
  -- Check if user a42c0b47-9a20-4b71-8b7d-c2eb8eb8c366 needs a profile
  IF NOT EXISTS (SELECT 1 FROM public.profiles WHERE user_id = 'a42c0b47-9a20-4b71-8b7d-c2eb8eb8c366') THEN
    INSERT INTO public.profiles (user_id, username, display_name, role)
    VALUES (
      'a42c0b47-9a20-4b71-8b7d-c2eb8eb8c366',
      'admin',
      'Administrator', 
      'admin'
    );
  END IF;
END;
$$;