-- Update default weight options for supplier menu items
ALTER TABLE public.supplier_menu_items 
ALTER COLUMN weight_options SET DEFAULT ARRAY['10g'::text, '25g'::text, '50g'::text, '100g'::text, '200g'::text];