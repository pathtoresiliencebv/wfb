import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Building2, Users, Award, MapPin } from 'lucide-react';
import { BadgedText } from '@/lib/badgeParser';

interface SupplierAboutSectionProps {
  supplierName: string;
  description?: string;
  stats?: {
    customers?: number;
    rating?: number;
    delivery_time?: string;
    success_rate?: number;
    experience_years?: number;
  };
  deliveryAreas?: string[];
}

export const SupplierAboutSection: React.FC<SupplierAboutSectionProps> = ({
  supplierName,
  description,
  stats,
  deliveryAreas
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-2xl">
          <Building2 className="h-6 w-6 text-primary" />
          Over {supplierName}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Description */}
        {description && (
          <div className="text-muted-foreground leading-relaxed">
            <BadgedText text={description} />
          </div>
        )}

        {/* Key Stats Grid */}
        <div className="grid md:grid-cols-3 gap-4 mt-6">
          {stats?.experience_years && (
            <div className="flex items-start gap-3 p-4 rounded-lg bg-primary/5 border border-primary/10">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Award className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-primary">{stats.experience_years}+</p>
                <p className="text-sm text-muted-foreground">Jaar ervaring</p>
              </div>
            </div>
          )}

          {stats?.customers && (
            <div className="flex items-start gap-3 p-4 rounded-lg bg-primary/5 border border-primary/10">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Users className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-primary">{stats.customers}+</p>
                <p className="text-sm text-muted-foreground">Tevreden klanten</p>
              </div>
            </div>
          )}

          {stats?.rating && (
            <div className="flex items-start gap-3 p-4 rounded-lg bg-primary/5 border border-primary/10">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Award className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-primary">{stats.rating}/5</p>
                <p className="text-sm text-muted-foreground">Gemiddelde waardering</p>
              </div>
            </div>
          )}
        </div>

        {/* Delivery Areas */}
        {deliveryAreas && deliveryAreas.length > 0 && (
          <div className="mt-6">
            <div className="flex items-center gap-2 mb-3">
              <MapPin className="h-5 w-5 text-primary" />
              <h3 className="font-semibold">Bezorggebieden</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {deliveryAreas.map((area, index) => (
                <span 
                  key={index}
                  className="px-3 py-1 bg-muted rounded-full text-sm text-muted-foreground"
                >
                  {area}
                </span>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
