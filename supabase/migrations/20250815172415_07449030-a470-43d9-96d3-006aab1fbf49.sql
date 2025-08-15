-- Add category pricing support to supplier_categories
ALTER TABLE public.supplier_categories 
ADD COLUMN category_pricing jsonb DEFAULT '{}';

-- Add column to track if menu item uses category or individual pricing
ALTER TABLE public.supplier_menu_items 
ADD COLUMN use_category_pricing boolean DEFAULT false;