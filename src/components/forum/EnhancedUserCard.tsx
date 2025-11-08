import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Building2, Star, MessageCircle, Users, Crown } from 'lucide-react';
import { Link } from 'react-router-dom';
import { BadgedText } from '@/lib/badgeParser';

interface UserProfile {
  username: string;
  display_name?: string;
  role: string;
  reputation: number;
  created_at: string;
  avatar_url?: string;
}

interface SupplierProfile {
  id: string;
  business_name: string;
  description?: string;
  contact_info: any;
  stats: any;
  features: string[];
  ranking: number;
  product_name?: string;
}

interface EnhancedUserCardProps {
  profile: UserProfile;
  supplierProfile?: SupplierProfile | null;
  showSupplierInfo?: boolean;
  isCompact?: boolean;
}

export function EnhancedUserCard({ 
  profile, 
  supplierProfile, 
  showSupplierInfo = true,
  isCompact = false 
}: EnhancedUserCardProps) {
  const getUserInitials = (username: string) => {
    return username.slice(0, 2).toUpperCase();
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'moderator': return 'bg-blue-500';
      case 'expert': return 'bg-green-500';
      case 'admin': return 'bg-red-500';
      case 'supplier': return 'bg-purple-500';
      default: return 'bg-gray-500';
    }
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'moderator': return <Badge variant="secondary" className="text-xs">MOD</Badge>;
      case 'expert': return <Badge variant="default" className="text-xs">EXPERT</Badge>;
      case 'admin': return <Badge variant="destructive" className="text-xs">ADMIN</Badge>;
      case 'supplier': return <Badge variant="outline" className="text-xs border-purple-500 text-purple-500">LEVERANCIER</Badge>;
      default: return null;
    }
  };

  const formatJoinDate = (dateString: string) => {
    return new Date(dateString).getFullYear();
  };

  if (isCompact) {
    return (
      <div className="flex items-center gap-3">
        <Avatar className="h-8 w-8">
          <AvatarImage src={profile.avatar_url} />
          <AvatarFallback className={getRoleColor(profile.role)}>
            {getUserInitials(profile.username)}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="font-medium text-sm">{profile.display_name || profile.username}</span>
            {getRoleBadge(profile.role)}
            {supplierProfile && showSupplierInfo && (
              <Building2 className="h-3 w-3 text-purple-500" />
            )}
          </div>
          <div className="text-xs text-muted-foreground">
            {profile.reputation} reputatie
            {supplierProfile && showSupplierInfo && (
              <span> • {supplierProfile.business_name}</span>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <Card className="w-full">
      <CardContent className="p-4">
        <div className="flex items-start gap-4">
          <Avatar className="h-12 w-12">
            <AvatarImage src={profile.avatar_url} />
            <AvatarFallback className={getRoleColor(profile.role)}>
              {getUserInitials(profile.username)}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex-1 space-y-2">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h4 className="font-medium">{profile.display_name || profile.username}</h4>
                {getRoleBadge(profile.role)}
                {profile.role === 'admin' && <Crown className="h-4 w-4 text-yellow-500" />}
              </div>
              
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Star className="h-3 w-3" />
                  <span>{profile.reputation} reputatie</span>
                </div>
                <span>Lid sinds {formatJoinDate(profile.created_at)}</span>
              </div>
            </div>

            {/* Supplier Information */}
            {supplierProfile && showSupplierInfo && (
              <div className="space-y-3 pt-2 border-t">
                <div className="flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-purple-500" />
                  <span className="font-medium text-purple-600">{supplierProfile.business_name}</span>
                  {supplierProfile.ranking <= 10 && (
                    <Badge variant="outline" className="text-xs border-yellow-500 text-yellow-600">
                      Top {supplierProfile.ranking}
                    </Badge>
                  )}
                </div>
                
                {supplierProfile.description && (
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    <BadgedText text={supplierProfile.description} />
                  </p>
                )}

                <div className="flex flex-wrap gap-2">
                  {supplierProfile.features.slice(0, 3).map((feature, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {feature}
                    </Badge>
                  ))}
                  {supplierProfile.features.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{supplierProfile.features.length - 3} meer
                    </Badge>
                  )}
                </div>

                {supplierProfile.stats && (
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    {supplierProfile.stats.customers && (
                      <div className="flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        <span>{supplierProfile.stats.customers} klanten</span>
                      </div>
                    )}
                    {supplierProfile.stats.rating && (
                      <div className="flex items-center gap-1">
                        <Star className="h-3 w-3" />
                        <span>{supplierProfile.stats.rating}/5</span>
                      </div>
                    )}
                    {supplierProfile.stats.delivery_time && (
                      <span>Levering: {supplierProfile.stats.delivery_time}</span>
                    )}
                  </div>
                )}

                <div className="flex gap-2">
                  <Button asChild size="sm" variant="outline" className="h-7">
                    <Link to={`/supplier/${supplierProfile.id}`}>
                      Bekijk Profiel
                    </Link>
                  </Button>
                  <Button asChild size="sm" variant="outline" className="h-7">
                    <Link to={`/supplier/${supplierProfile.id}/menu`}>
                      {supplierProfile.product_name || 'Producten'}
                    </Link>
                  </Button>
                  <Button asChild size="sm" variant="ghost" className="h-7 w-7 p-0">
                    <Link to="/messages">
                      <MessageCircle className="h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}