export interface SupplierPriceList {
  id: string;
  supplier_id: string;
  name: string;
  pricing_data: Record<string, number>;
  price_type: 'weight' | 'unit';
  unit_label?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface SupplierMenuSettings {
  id: string;
  supplier_id: string;
  menu_title?: string;
  contact_info: any;
  footer_message?: string;
  theme_settings: any;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

export type PricingModel = 'shared' | 'unique' | 'unit';

export interface MenuBuilderStep {
  id: string;
  title: string;
  description: string;
  completed: boolean;
}

export interface CategoryPricingData {
  categoryId: string;
  pricingModel: PricingModel;
  priceListId?: string;
  customPricing?: Record<string, number>;
  unitLabel?: string;
}