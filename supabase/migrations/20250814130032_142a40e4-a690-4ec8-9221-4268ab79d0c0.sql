-- Update existing admin profile to have admin role
UPDATE public.profiles 
SET role = 'admin' 
WHERE username = 'admin';

-- Update existing leverancier profile to have supplier role  
UPDATE public.profiles 
SET role = 'supplier' 
WHERE username = 'leverancier';