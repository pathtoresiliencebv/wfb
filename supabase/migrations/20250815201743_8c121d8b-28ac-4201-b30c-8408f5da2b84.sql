-- Create supplier_price_lists table for reusable price lists
CREATE TABLE public.supplier_price_lists (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  supplier_id UUID NOT NULL,
  name VARCHAR NOT NULL,
  pricing_data JSONB NOT NULL DEFAULT '{}',
  price_type VARCHAR NOT NULL DEFAULT 'weight', -- 'weight' or 'unit'
  unit_label VARCHAR DEFAULT 'gram',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create supplier_menu_settings table for general menu settings
CREATE TABLE public.supplier_menu_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  supplier_id UUID NOT NULL UNIQUE,
  menu_title VARCHAR DEFAULT 'Menu',
  contact_info JSONB DEFAULT '{}',
  footer_message TEXT,
  theme_settings JSONB DEFAULT '{}',
  is_published BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add new columns to supplier_categories for pricing models
ALTER TABLE public.supplier_categories 
ADD COLUMN price_list_id UUID,
ADD COLUMN pricing_model VARCHAR DEFAULT 'unique'; -- 'shared', 'unique', 'unit'

-- Enable Row Level Security
ALTER TABLE public.supplier_price_lists ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.supplier_menu_settings ENABLE ROW LEVEL SECURITY;

-- Create policies for supplier_price_lists
CREATE POLICY "Price lists are viewable by everyone" 
ON public.supplier_price_lists 
FOR SELECT 
USING (true);

CREATE POLICY "Suppliers can manage their own price lists" 
ON public.supplier_price_lists 
FOR ALL 
USING (EXISTS (
  SELECT 1 FROM supplier_profiles sp 
  WHERE sp.id = supplier_price_lists.supplier_id 
  AND sp.user_id = auth.uid()
))
WITH CHECK (EXISTS (
  SELECT 1 FROM supplier_profiles sp 
  WHERE sp.id = supplier_price_lists.supplier_id 
  AND sp.user_id = auth.uid()
));

CREATE POLICY "Admins can manage all price lists" 
ON public.supplier_price_lists 
FOR ALL 
USING (EXISTS (
  SELECT 1 FROM profiles p 
  WHERE p.user_id = auth.uid() 
  AND p.role = ANY(ARRAY['admin', 'moderator'])
))
WITH CHECK (EXISTS (
  SELECT 1 FROM profiles p 
  WHERE p.user_id = auth.uid() 
  AND p.role = ANY(ARRAY['admin', 'moderator'])
));

-- Create policies for supplier_menu_settings
CREATE POLICY "Menu settings are viewable by everyone" 
ON public.supplier_menu_settings 
FOR SELECT 
USING (true);

CREATE POLICY "Suppliers can manage their own menu settings" 
ON public.supplier_menu_settings 
FOR ALL 
USING (EXISTS (
  SELECT 1 FROM supplier_profiles sp 
  WHERE sp.id = supplier_menu_settings.supplier_id 
  AND sp.user_id = auth.uid()
))
WITH CHECK (EXISTS (
  SELECT 1 FROM supplier_profiles sp 
  WHERE sp.id = supplier_menu_settings.supplier_id 
  AND sp.user_id = auth.uid()
));

CREATE POLICY "Admins can manage all menu settings" 
ON public.supplier_menu_settings 
FOR ALL 
USING (EXISTS (
  SELECT 1 FROM profiles p 
  WHERE p.user_id = auth.uid() 
  AND p.role = ANY(ARRAY['admin', 'moderator'])
))
WITH CHECK (EXISTS (
  SELECT 1 FROM profiles p 
  WHERE p.user_id = auth.uid() 
  AND p.role = ANY(ARRAY['admin', 'moderator'])
));

-- Create triggers for updated_at
CREATE TRIGGER update_supplier_price_lists_updated_at
BEFORE UPDATE ON public.supplier_price_lists
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_supplier_menu_settings_updated_at
BEFORE UPDATE ON public.supplier_menu_settings
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();