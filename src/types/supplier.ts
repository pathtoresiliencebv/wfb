export interface SupplierStats {
  customers?: number;
  rating?: number;
  delivery_time?: string;
  success_rate?: number;
}

export interface SupplierContact {
  wire?: string;
  telegram?: string;
  email?: string;
}

export interface SupplierProfile {
  id: string;
  user_id: string;
  business_name: string;
  description?: string;
  contact_info: SupplierContact;
  stats: SupplierStats;
  features: string[];
  ranking: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  profiles: {
    username: string;
    display_name?: string;
    avatar_url?: string;
    reputation: number;
  };
}