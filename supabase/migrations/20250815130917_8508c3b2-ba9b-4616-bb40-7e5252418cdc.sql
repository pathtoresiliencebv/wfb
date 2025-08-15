-- Fix RLS infinite recursion by creating security definer function
CREATE OR REPLACE FUNCTION public.get_current_user_role()
RETURNS TEXT
LANGUAGE SQL
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
  SELECT role FROM public.profiles WHERE user_id = auth.uid();
$$;

-- Drop the problematic recursive policy
DROP POLICY IF EXISTS "Admins can view profiles for moderation" ON public.profiles;

-- Create new non-recursive policy using security definer function
CREATE POLICY "Admins can view profiles for moderation"
ON public.profiles
FOR SELECT
USING (public.get_current_user_role() = 'admin');

-- Ensure all existing users have profiles
INSERT INTO public.profiles (user_id, username, display_name, role)
SELECT 
  au.id,
  COALESCE(au.raw_user_meta_data->>'username', 'user_' || substr(au.id::text, 1, 8)),
  COALESCE(au.raw_user_meta_data->>'display_name', au.raw_user_meta_data->>'username', split_part(au.email, '@', 1)),
  COALESCE(au.raw_user_meta_data->>'role', 'user')::text
FROM auth.users au
WHERE NOT EXISTS (
  SELECT 1 FROM public.profiles p WHERE p.user_id = au.id
)
ON CONFLICT (user_id) DO NOTHING;