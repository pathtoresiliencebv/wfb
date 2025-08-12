-- Policies for categories management by admins and moderators
CREATE POLICY "Admins and moderators can insert categories"
ON public.categories
FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.profiles p
    WHERE p.user_id = auth.uid() AND p.role IN ('admin','moderator')
  )
);

CREATE POLICY "Admins and moderators can update categories"
ON public.categories
FOR UPDATE
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

CREATE POLICY "Admins and moderators can delete categories"
ON public.categories
FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM public.profiles p
    WHERE p.user_id = auth.uid() AND p.role IN ('admin','moderator')
  )
);
