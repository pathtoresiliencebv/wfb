-- Supplier menu items table
CREATE TABLE IF NOT EXISTS public.supplier_menu_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  supplier_id UUID NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  price NUMERIC(10,2) NOT NULL DEFAULT 0,
  unit VARCHAR(50) DEFAULT 'stuk',
  category TEXT,
  tags TEXT[] DEFAULT ARRAY[]::text[],
  is_available BOOLEAN NOT NULL DEFAULT true,
  position INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT fk_supplier_menu_supplier
    FOREIGN KEY (supplier_id)
    REFERENCES public.supplier_profiles (id)
    ON DELETE CASCADE
);

-- Enable RLS
ALTER TABLE public.supplier_menu_items ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Menu items are viewable by everyone"
ON public.supplier_menu_items
FOR SELECT
USING (true);

CREATE POLICY "Suppliers can manage their own menu items (insert)"
ON public.supplier_menu_items
FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.supplier_profiles sp
    WHERE sp.id = supplier_id AND sp.user_id = auth.uid()
  )
);

CREATE POLICY "Suppliers can manage their own menu items (update)"
ON public.supplier_menu_items
FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.supplier_profiles sp
    WHERE sp.id = supplier_id AND sp.user_id = auth.uid()
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.supplier_profiles sp
    WHERE sp.id = supplier_id AND sp.user_id = auth.uid()
  )
);

CREATE POLICY "Suppliers can manage their own menu items (delete)"
ON public.supplier_menu_items
FOR DELETE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.supplier_profiles sp
    WHERE sp.id = supplier_id AND sp.user_id = auth.uid()
  )
);

CREATE POLICY "Admins can manage all supplier menu items"
ON public.supplier_menu_items
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

-- Trigger for updated_at
CREATE TRIGGER update_supplier_menu_items_updated_at
BEFORE UPDATE ON public.supplier_menu_items
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Indexes
CREATE INDEX IF NOT EXISTS idx_supplier_menu_items_supplier_id ON public.supplier_menu_items (supplier_id);
CREATE INDEX IF NOT EXISTS idx_supplier_menu_items_available ON public.supplier_menu_items (is_available);
CREATE INDEX IF NOT EXISTS idx_supplier_menu_items_position ON public.supplier_menu_items (position);
