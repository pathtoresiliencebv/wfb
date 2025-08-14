-- Extend supplier_profiles table with additional fields for enhanced supplier pages
ALTER TABLE supplier_profiles ADD COLUMN IF NOT EXISTS banner_image TEXT;
ALTER TABLE supplier_profiles ADD COLUMN IF NOT EXISTS logo_image TEXT;
ALTER TABLE supplier_profiles ADD COLUMN IF NOT EXISTS theme_color VARCHAR(7) DEFAULT '#10b981';
ALTER TABLE supplier_profiles ADD COLUMN IF NOT EXISTS delivery_areas TEXT[] DEFAULT ARRAY[]::TEXT[];
ALTER TABLE supplier_profiles ADD COLUMN IF NOT EXISTS opening_hours JSONB DEFAULT '{}';
ALTER TABLE supplier_profiles ADD COLUMN IF NOT EXISTS minimum_order DECIMAL(10,2) DEFAULT 0;
ALTER TABLE supplier_profiles ADD COLUMN IF NOT EXISTS delivery_fee DECIMAL(10,2) DEFAULT 0;
ALTER TABLE supplier_profiles ADD COLUMN IF NOT EXISTS why_choose_us TEXT[] DEFAULT ARRAY[]::TEXT[];

-- Extend supplier_menu_items table with pricing tiers
ALTER TABLE supplier_menu_items ADD COLUMN IF NOT EXISTS pricing_tiers JSONB DEFAULT '{}';
ALTER TABLE supplier_menu_items ADD COLUMN IF NOT EXISTS weight_options TEXT[] DEFAULT ARRAY['1g', '2.5g', '5g', '10g', '25g', '50g', '100g'];
ALTER TABLE supplier_menu_items ADD COLUMN IF NOT EXISTS in_stock BOOLEAN DEFAULT true;
ALTER TABLE supplier_menu_items ADD COLUMN IF NOT EXISTS image_url TEXT;

-- Create supplier_categories table for menu organization
CREATE TABLE IF NOT EXISTS supplier_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  supplier_id UUID NOT NULL REFERENCES supplier_profiles(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on supplier_categories
ALTER TABLE supplier_categories ENABLE ROW LEVEL SECURITY;

-- RLS policies for supplier_categories
CREATE POLICY "Supplier categories are viewable by everyone" 
ON supplier_categories FOR SELECT USING (true);

CREATE POLICY "Suppliers can manage their own categories" 
ON supplier_categories FOR ALL 
USING (EXISTS (
  SELECT 1 FROM supplier_profiles sp 
  WHERE sp.id = supplier_categories.supplier_id 
  AND sp.user_id = auth.uid()
))
WITH CHECK (EXISTS (
  SELECT 1 FROM supplier_profiles sp 
  WHERE sp.id = supplier_categories.supplier_id 
  AND sp.user_id = auth.uid()
));

CREATE POLICY "Admins can manage all supplier categories" 
ON supplier_categories FOR ALL 
USING (EXISTS (
  SELECT 1 FROM profiles p 
  WHERE p.user_id = auth.uid() 
  AND p.role IN ('admin', 'moderator')
))
WITH CHECK (EXISTS (
  SELECT 1 FROM profiles p 
  WHERE p.user_id = auth.uid() 
  AND p.role IN ('admin', 'moderator')
));

-- Add category_id to supplier_menu_items
ALTER TABLE supplier_menu_items ADD COLUMN IF NOT EXISTS category_id UUID REFERENCES supplier_categories(id) ON DELETE SET NULL;

-- Create trigger for updated_at
CREATE OR REPLACE TRIGGER update_supplier_categories_updated_at
  BEFORE UPDATE ON supplier_categories
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();