import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Edit, MapPin, Clock, Star } from 'lucide-react';
import { SupplierProfile } from '@/types/supplier';

interface SupplierHeaderProps {
  supplier: SupplierProfile;
  isOwner: boolean;
  onEdit: () => void;
}

export const SupplierHeader: React.FC<SupplierHeaderProps> = ({
  supplier,
  isOwner,
  onEdit
}) => {
  return (
    <div className="relative rounded-xl overflow-hidden">
      {/* Banner Background */}
      <div 
        className="h-64 bg-gradient-to-r from-green-600 to-green-800 relative"
        style={{
          backgroundImage: supplier.banner_image ? `url(${supplier.banner_image})` : undefined,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <div className="absolute inset-0 bg-black/40" />
        
        {/* Edit Button */}
        {isOwner && (
          <Button
            onClick={onEdit}
            size="sm"
            className="absolute top-4 right-4 bg-white/20 backdrop-blur-sm border-white/30 text-white hover:bg-white/30"
          >
            <Edit className="h-4 w-4 mr-2" />
            Bewerken
          </Button>
        )}
      </div>

      {/* Content */}
      <div className="relative px-6 pb-6">
        {/* Logo & Info */}
        <div className="flex items-end gap-6 -mt-16 relative z-10">
          <div className="bg-white rounded-2xl p-4 shadow-lg border">
            {supplier.logo_image ? (
              <img 
                src={supplier.logo_image} 
                alt={supplier.business_name}
                className="w-24 h-24 rounded-lg object-cover"
              />
            ) : (
              <div 
                className="w-24 h-24 rounded-lg flex items-center justify-center text-white font-bold text-2xl"
                style={{ backgroundColor: supplier.theme_color }}
              >
                {supplier.business_name.substring(0, 2).toUpperCase()}
              </div>
            )}
          </div>

          <div className="flex-1 text-white mb-4">
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-bold">{supplier.business_name}</h1>
              <Badge className="bg-green-500 text-white">
                <Star className="h-3 w-3 mr-1" />
                Geverifieerd
              </Badge>
            </div>
            
            {supplier.description && (
              <p className="text-white/90 mb-3">{supplier.description}</p>
            )}

            <div className="flex items-center gap-6 text-sm text-white/80">
              <div className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                <span>{supplier.delivery_areas?.length || 0} bezorggebieden</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span>24/7 service</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};