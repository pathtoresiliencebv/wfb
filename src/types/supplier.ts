export interface SupplierStats {
  customers?: number;
  rating?: number;
  delivery_time?: string;
  success_rate?: number;
  strains?: number;
}

export interface SupplierContact {
  wire?: string;
  telegram?: string;
  email?: string;
}

export interface SupplierMenuItem {
  id: string;
  supplier_id: string;
  name: string;
  description?: string;
  price: number;
  unit?: string;
  category?: string;
  tags?: string[];
  is_available: boolean;
  position: number;
  created_at: string;
  updated_at: string;
  // New fields
  pricing_tiers?: Record<string, number> | any;
  weight_options?: string[];
  in_stock?: boolean;
  image_url?: string;
  category_id?: string;
  use_category_pricing?: boolean;
}

export interface SupplierCategory {
  id: string;
  supplier_id: string;
  name: string;
  description?: string;
  sort_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  category_pricing?: Record<string, number> | any;
}

export interface SupplierProfile {
  id: string;
  user_id: string;
  business_name: string;
  description?: string;
  contact_info: SupplierContact | any;
  stats: SupplierStats | any;
  features: string[];
  ranking: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  // New fields
  banner_image?: string;
  logo_image?: string;
  theme_color?: string;
  delivery_areas?: string[];
  opening_hours?: any;
  minimum_order?: number;
  delivery_fee?: number;
  why_choose_us?: string[];
  // USP and process fields
  why_choose_us_descriptions?: Record<string, string> | any;
  ordering_process_descriptions?: Record<string, string> | any;
  contact_description?: string;
  product_name?: string;
  profiles: {
    username: string;
    display_name?: string;
    avatar_url?: string;
    reputation: number;
  };
}