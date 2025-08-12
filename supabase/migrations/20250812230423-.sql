-- Allow admins and moderators to manage categories
CREATE POLICY IF NOT EXISTS "Admins and moderators can manage categories"
ON public.categories
AS PERMISSIVE
FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.profiles p
    WHERE p.user_id = auth.uid() AND p.role IN ('admin','moderator')
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.profiles p
    WHERE p.user_id = auth.uid() AND p.role IN ('admin','moderator')
  )
);
