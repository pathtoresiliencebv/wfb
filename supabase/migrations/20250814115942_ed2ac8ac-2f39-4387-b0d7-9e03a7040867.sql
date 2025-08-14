-- Update the profiles role check constraint to include 'supplier'
ALTER TABLE public.profiles 
DROP CONSTRAINT IF EXISTS profiles_role_check;

ALTER TABLE public.profiles 
ADD CONSTRAINT profiles_role_check 
CHECK (role::text = ANY (ARRAY['user'::character varying, 'moderator'::character varying, 'expert'::character varying, 'admin'::character varying, 'supplier'::character varying]::text[]));