-- Add product_count and description_lines to supplier_categories table
ALTER TABLE public.supplier_categories 
ADD COLUMN product_count integer DEFAULT 0,
ADD COLUMN description_lines jsonb DEFAULT '[]'::jsonb;