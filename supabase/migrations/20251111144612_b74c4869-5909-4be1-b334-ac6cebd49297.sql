-- Create function to automatically create privacy settings for new profiles
CREATE OR REPLACE FUNCTION public.create_default_privacy_settings()
RETURNS TRIGGER AS $$
BEGIN
  -- Automatically create privacy settings with 'public' as default
  INSERT INTO public.user_privacy_settings (user_id, profile_visibility)
  VALUES (NEW.user_id, 'public')
  ON CONFLICT (user_id) DO NOTHING;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Create trigger to call function after profile insert
CREATE TRIGGER ensure_privacy_settings_on_profile_creation
AFTER INSERT ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION public.create_default_privacy_settings();

-- Fix existing users without privacy settings
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