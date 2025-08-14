import React from 'react';
import { Card } from '@/components/ui/card';
import { Users, Package, Truck, Star } from 'lucide-react';
import { SupplierProfile } from '@/types/supplier';

interface SupplierStatsProps {
  supplier: SupplierProfile;
}

export const SupplierStats: React.FC<SupplierStatsProps> = ({ supplier }) => {
  const stats = [
    {
      label: 'Tevreden Klanten',
      value: supplier.stats?.customers || '800+',
      icon: Users,
      color: 'text-blue-600'
    },
    {
      label: 'Wietsoorten',
      value: supplier.stats?.strains || '25+',
      icon: Package,
      color: 'text-green-600'
    },
    {
      label: 'Bezorging',
      value: '100%',
      suffix: 'Thuisbezorgd',
      icon: Truck,
      color: 'text-purple-600'
    },
    {
      label: 'Beoordeling',
      value: supplier.stats?.rating || '4.8',
      suffix: '/5.0',
      icon: Star,
      color: 'text-yellow-600'
    }
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <Card key={index} className="p-6 text-center hover:shadow-lg transition-shadow">
          <div className={`inline-flex items-center justify-center w-12 h-12 rounded-lg bg-muted mb-3 ${stat.color}`}>
            <stat.icon className="h-6 w-6" />
          </div>
          <div className="text-2xl font-bold text-foreground">{stat.value}</div>
          {stat.suffix && (
            <div className="text-sm text-muted-foreground">{stat.suffix}</div>
          )}
          <div className="text-sm text-muted-foreground mt-1">{stat.label}</div>
        </Card>
      ))}
    </div>
  );
};