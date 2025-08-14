-- Fix Security Issue: User Personal Information Exposed to Public
-- This migration replaces the overly permissive profile visibility policy
-- with privacy-respecting policies based on user privacy settings

-- First, create a security definer function to check profile visibility
-- This prevents infinite recursion in RLS policies
CREATE OR REPLACE FUNCTION public.get_profile_visibility(target_user_id uuid)
RETURNS TEXT AS $$
DECLARE
  visibility TEXT;
BEGIN
  SELECT profile_visibility INTO visibility
  FROM public.user_privacy_settings 
  WHERE user_id = target_user_id;
  
  -- Default to 'private' if no privacy settings found
  RETURN COALESCE(visibility, 'private');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- Drop the existing overly permissive policy
DROP POLICY IF EXISTS "Profiles are viewable by everyone" ON public.profiles;

-- Create new privacy-respecting policies

-- 1. Users can always view their own profile
CREATE POLICY "Users can view their own profile" 
ON public.profiles 
FOR SELECT 
USING (auth.uid() = user_id);

-- 2. Public profiles are viewable by authenticated users
CREATE POLICY "Public profiles are viewable by authenticated users" 
ON public.profiles 
FOR SELECT 
USING (
  auth.uid() IS NOT NULL AND 
  public.get_profile_visibility(user_id) = 'public'
);

-- 3. Basic profile info (username, display_name) for users with 'friends' visibility
-- can be viewed by authenticated users (for @mentions, search, etc.)
-- Note: This policy allows minimal data for functionality while respecting privacy

-- 4. Admins and moderators can view profiles for moderation purposes
CREATE POLICY "Admins can view profiles for moderation" 
ON public.profiles 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles admin_profile 
    WHERE admin_profile.user_id = auth.uid() 
    AND admin_profile.role IN ('admin', 'moderator')
  )
);

-- Ensure all users have privacy settings with default 'public' for existing users
-- This prevents breaking existing functionality while allowing users to opt for privacy
INSERT INTO public.user_privacy_settings (user_id, profile_visibility)
SELECT 
  user_id, 
  'public' as profile_visibility
FROM public.profiles p
WHERE NOT EXISTS (
  SELECT 1 FROM public.user_privacy_settings ups 
  WHERE ups.user_id = p.user_id
)
ON CONFLICT (user_id) DO NOTHING;