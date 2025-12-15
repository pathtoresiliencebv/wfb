-- Admin RLS policies voor topics beheer
-- Admins kunnen alle topics verwijderen
CREATE POLICY "Admins can delete any topic"
ON public.topics
FOR DELETE
TO authenticated
USING (
  public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'moderator')
);

-- Admins kunnen alle topics updaten (pin, lock, move)
CREATE POLICY "Admins can update any topic"
ON public.topics
FOR UPDATE
TO authenticated
USING (
  public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'moderator')
);

-- Admin RLS policies voor supplier_profiles beheer
-- Admins kunnen supplier profiles verwijderen
CREATE POLICY "Admins can delete supplier profiles"
ON public.supplier_profiles
FOR DELETE
TO authenticated
USING (
  public.has_role(auth.uid(), 'admin')
);

-- Admins kunnen supplier profiles aanmaken voor andere users
CREATE POLICY "Admins can insert supplier profiles"
ON public.supplier_profiles
FOR INSERT
TO authenticated
WITH CHECK (
  public.has_role(auth.uid(), 'admin')
);