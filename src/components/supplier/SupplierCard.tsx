import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CrownBadge } from '@/components/ui/crown-badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Star, Users, Clock, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { BadgedText } from '@/lib/badgeParser';

interface SupplierProfile {
  id: string;
  user_id: string;
  business_name: string;
  description?: string;
  stats: {
    customers?: number;
    rating?: number;
    delivery_time?: string;
    success_rate?: number;
  };
  ranking: number;
  profiles: {
    username: string;
    avatar_url?: string;
  };
}

interface SupplierCardProps {
  supplier: SupplierProfile;
  showRanking?: boolean;
}

export const SupplierCard: React.FC<SupplierCardProps> = ({ 
  supplier, 
  showRanking = false 
}) => {
  const navigate = useNavigate();

  const getRankBadge = () => {
    if (!showRanking || supplier.ranking === 0) return null;
    if (supplier.ranking <= 3) {
      return <CrownBadge rank={supplier.ranking as 1 | 2 | 3} size="md" />;
    }
    return null;
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <Card className="hover:shadow-lg transition-shadow cursor-pointer">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="h-12 w-12">
              <AvatarImage src={supplier.profiles.avatar_url} />
              <AvatarFallback>
                {getInitials(supplier.business_name)}
              </AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-lg flex items-center gap-2">
                {supplier.business_name}
                {getRankBadge()}
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                @{supplier.profiles.username}
              </p>
            </div>
          </div>
          <Badge variant="secondary">Leverancier</Badge>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        {supplier.description && (
          <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
            <BadgedText text={supplier.description} />
          </p>
        )}
        
        <div className="grid grid-cols-2 gap-3 mb-4">
          {supplier.stats.customers && (
            <div className="flex items-center gap-2 text-sm">
              <Users className="h-4 w-4 text-primary" />
              <span className="font-medium">{supplier.stats.customers}+</span>
              <span className="text-muted-foreground">klanten</span>
            </div>
          )}
          
          {supplier.stats.rating && (
            <div className="flex items-center gap-2 text-sm">
              <Star className="h-4 w-4 text-yellow-500 fill-current" />
              <span className="font-medium">{supplier.stats.rating}</span>
              <span className="text-muted-foreground">rating</span>
            </div>
          )}
          
          {supplier.stats.delivery_time && (
            <div className="flex items-center gap-2 text-sm">
              <Clock className="h-4 w-4 text-primary" />
              <span className="font-medium">{supplier.stats.delivery_time}</span>
            </div>
          )}
          
          {supplier.stats.success_rate && (
            <div className="flex items-center gap-2 text-sm">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span className="font-medium">{supplier.stats.success_rate}%</span>
              <span className="text-muted-foreground">succes</span>
            </div>
          )}
        </div>
        
        <Button 
          className="w-full" 
          onClick={() => navigate(`/leverancier/${supplier.profiles.username}`)}
        >
          Bekijk Profiel
        </Button>
      </CardContent>
    </Card>
  );
};