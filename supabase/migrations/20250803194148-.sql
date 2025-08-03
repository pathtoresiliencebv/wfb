-- Add supplier role to existing enum
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'supplier';

-- Create supplier profiles table
CREATE TABLE public.supplier_profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.profiles(user_id) ON DELETE CASCADE,
  business_name VARCHAR(255) NOT NULL,
  description TEXT,
  contact_info JSONB DEFAULT '{}',
  stats JSONB DEFAULT '{}',
  features TEXT[] DEFAULT ARRAY[]::TEXT[],
  ranking INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);

-- Enable RLS
ALTER TABLE public.supplier_profiles ENABLE ROW LEVEL SECURITY;

-- Policies for supplier profiles
CREATE POLICY "Supplier profiles are viewable by everyone"
ON public.supplier_profiles
FOR SELECT
USING (true);

CREATE POLICY "Users can create their own supplier profile"
ON public.supplier_profiles
FOR INSERT
WITH CHECK (
  auth.uid() = user_id AND
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE user_id = auth.uid() AND role = 'supplier'
  )
);

CREATE POLICY "Users can update their own supplier profile"
ON public.supplier_profiles
FOR UPDATE
USING (
  auth.uid() = user_id AND
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE user_id = auth.uid() AND role = 'supplier'
  )
);

CREATE POLICY "Admins can manage all supplier profiles"
ON public.supplier_profiles
FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE user_id = auth.uid() AND role = 'admin'
  )
);

-- Create trigger for updated_at
CREATE TRIGGER update_supplier_profiles_updated_at
BEFORE UPDATE ON public.supplier_profiles
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default supplier categories for points
INSERT INTO public.point_categories (name, description, icon, color) VALUES
('supplier_activity', 'Leverancier Activiteit', 'truck', '#f59e0b'),
('customer_satisfaction', 'Klanttevredenheid', 'star', '#eab308')
ON CONFLICT (name) DO NOTHING;