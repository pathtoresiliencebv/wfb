import React from 'react';
import { Card } from '@/components/ui/card';
import { Users, Package, Truck, Star } from 'lucide-react';
import { SupplierProfile } from '@/types/supplier';
import { useSupplierStats } from '@/hooks/useSupplierStats';
import { Skeleton } from '@/components/ui/skeleton';

interface SupplierStatsProps {
  supplier: SupplierProfile;
}

export const SupplierStats: React.FC<SupplierStatsProps> = ({ supplier }) => {
  const { stats, isLoading } = useSupplierStats(supplier.id);

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="p-6">
            <Skeleton className="h-12 w-12 rounded-lg mb-3 mx-auto" />
            <Skeleton className="h-8 w-20 mb-2 mx-auto" />
            <Skeleton className="h-4 w-24 mx-auto" />
          </Card>
        ))}
      </div>
    );
  }

  const displayStats = [
    {
      label: 'Tevreden Klanten',
      value: stats?.customersCount || 0,
      icon: Users,
      color: 'text-blue-600',
      show: (stats?.customersCount || 0) > 0,
    },
    {
      label: 'Wietsoorten',
      value: stats?.menuItemsCount || 0,
      icon: Package,
      color: 'text-green-600',
      show: true,
    },
    {
      label: 'Bezorging',
      value: '100%',
      suffix: 'Thuisbezorgd',
      icon: Truck,
      color: 'text-purple-600',
      show: true,
    },
    {
      label: 'Beoordeling',
      value: stats?.rating || 0,
      suffix: '/5.0',
      icon: Star,
      color: 'text-yellow-600',
      show: (stats?.rating || 0) > 0,
    }
  ].filter(stat => stat.show);

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {displayStats.map((stat, index) => (
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