-- Update the current user to admin role for testing
-- This assumes you are the first user in the system
UPDATE public.profiles 
SET role = 'admin' 
WHERE user_id IN (
  SELECT id FROM auth.users 
  ORDER BY created_at ASC 
  LIMIT 1
);

-- Also update any profile that might be yours if you have a specific email
-- Replace with your actual email if needed
-- UPDATE public.profiles 
-- SET role = 'admin' 
-- WHERE user_id = (SELECT id FROM auth.users WHERE email = 'your-email@example.com');