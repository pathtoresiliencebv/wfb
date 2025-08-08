import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { SupplierStats, SupplierContact } from '@/types/supplier';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { CrownBadge } from '@/components/ui/crown-badge';
import { useToast } from '@/hooks/use-toast';
import { 
  Store, 
  Settings, 
  TrendingUp, 
  Users, 
  Star,
  Plus,
  X
} from 'lucide-react';
import { Separator } from '@/components/ui/separator';

export const SupplierDashboard: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const [newFeature, setNewFeature] = useState('');

  const { data: supplierProfile, isLoading } = useQuery({
    queryKey: ['supplier-profile', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('supplier_profiles')
        .select('*')
        .eq('user_id', user?.id)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      return data;
    },
    enabled: !!user?.id,
  });

  const [formData, setFormData] = useState({
    business_name: '',
    description: '',
    contact_wire: '',
    contact_telegram: '',
    contact_email: '',
    customers: '',
    rating: '',
    delivery_time: '',
    success_rate: '',
    features: [] as string[],
  });

  React.useEffect(() => {
    if (supplierProfile) {
      const contactInfo = supplierProfile.contact_info as SupplierContact;
      const stats = supplierProfile.stats as SupplierStats;
      
      setFormData({
        business_name: supplierProfile.business_name || '',
        description: supplierProfile.description || '',
        contact_wire: contactInfo?.wire || '',
        contact_telegram: contactInfo?.telegram || '',
        contact_email: contactInfo?.email || '',
        customers: stats?.customers?.toString() || '',
        rating: stats?.rating?.toString() || '',
        delivery_time: stats?.delivery_time || '',
        success_rate: stats?.success_rate?.toString() || '',
        features: supplierProfile.features || [],
      });
    }
  }, [supplierProfile]);

  const updateProfileMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const profileData = {
        business_name: data.business_name,
        description: data.description,
        contact_info: {
          wire: data.contact_wire,
          telegram: data.contact_telegram,
          email: data.contact_email,
        },
        stats: {
          customers: data.customers ? parseInt(data.customers) : null,
          rating: data.rating ? parseFloat(data.rating) : null,
          delivery_time: data.delivery_time,
          success_rate: data.success_rate ? parseInt(data.success_rate) : null,
        },
        features: data.features,
      };

      if (supplierProfile) {
        const { error } = await supabase
          .from('supplier_profiles')
          .update(profileData)
          .eq('user_id', user?.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('supplier_profiles')
          .insert({ ...profileData, user_id: user?.id });
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['supplier-profile'] });
      setIsEditing(false);
      toast({
        title: 'Profiel bijgewerkt',
        description: 'Je leverancier profiel is succesvol bijgewerkt.',
      });
    },
    onError: (error) => {
      toast({
        title: 'Fout bij bijwerken',
        description: 'Er is een fout opgetreden bij het bijwerken van je profiel.',
        variant: 'destructive',
      });
      console.error(error);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfileMutation.mutate(formData);
  };

  const addFeature = () => {
    if (newFeature.trim()) {
      setFormData(prev => ({
        ...prev,
        features: [...prev.features, newFeature.trim()]
      }));
      setNewFeature('');
    }
  };

  const removeFeature = (index: number) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index)
    }));
  };

  const canAccess = ((user?.role as any) === 'supplier') || (user?.role === 'admin');
  if (!canAccess) {
    return (
      <div className="text-center p-8">
        <Store className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
        <h2 className="text-2xl font-bold mb-2">Alleen voor leveranciers</h2>
        <p className="text-muted-foreground">
          Je hebt geen toegang tot het leverancier dashboard.
        </p>
      </div>
    );
  }

  if (isLoading) {
    return <div className="p-8">Laden...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Store className="h-6 w-6 text-primary" />
            <h1 className="text-2xl font-bold">Leverancier Dashboard</h1>
          </div>
          {supplierProfile && <CrownBadge />}
        </div>
        <Button
          onClick={() => setIsEditing(!isEditing)}
          variant={isEditing ? 'outline' : 'default'}
        >
          <Settings className="h-4 w-4 mr-2" />
          {isEditing ? 'Annuleren' : 'Bewerken'}
        </Button>
      </div>

      {/* Stats Overview */}
      {supplierProfile && (
        <div className="grid md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6 text-center">
              <Users className="h-8 w-8 text-primary mx-auto mb-2" />
              <div className="text-2xl font-bold">
                {(supplierProfile.stats as SupplierStats)?.customers || 0}+
              </div>
              <p className="text-sm text-muted-foreground">Klanten</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6 text-center">
              <Star className="h-8 w-8 text-yellow-500 fill-current mx-auto mb-2" />
              <div className="text-2xl font-bold">
                {(supplierProfile.stats as SupplierStats)?.rating || 'N/A'}
              </div>
              <p className="text-sm text-muted-foreground">Rating</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6 text-center">
              <TrendingUp className="h-8 w-8 text-green-500 mx-auto mb-2" />
              <div className="text-2xl font-bold">
                {supplierProfile.ranking || 'Ongerangschikt'}
              </div>
              <p className="text-sm text-muted-foreground">Ranking</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6 text-center">
              <Badge variant="secondary" className="text-lg px-3 py-1">
                {supplierProfile.is_active ? 'Actief' : 'Inactief'}
              </Badge>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Profile Form */}
      <Card>
        <CardHeader>
          <CardTitle>Profiel Instellingen</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Info */}
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="business_name">Bedrijfsnaam *</Label>
                <Input
                  id="business_name"
                  value={formData.business_name}
                  onChange={(e) => setFormData(prev => ({ ...prev, business_name: e.target.value }))}
                  disabled={!isEditing}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Beschrijving</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                disabled={!isEditing}
                rows={4}
                placeholder="Vertel over je bedrijf en wat je aanbiedt..."
              />
            </div>

            <Separator />

            {/* Contact Info */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Contact Informatie</h3>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="wire">Wire Username</Label>
                  <Input
                    id="wire"
                    value={formData.contact_wire}
                    onChange={(e) => setFormData(prev => ({ ...prev, contact_wire: e.target.value }))}
                    disabled={!isEditing}
                    placeholder="@username"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="telegram">Telegram Username</Label>
                  <Input
                    id="telegram"
                    value={formData.contact_telegram}
                    onChange={(e) => setFormData(prev => ({ ...prev, contact_telegram: e.target.value }))}
                    disabled={!isEditing}
                    placeholder="@username"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.contact_email}
                    onChange={(e) => setFormData(prev => ({ ...prev, contact_email: e.target.value }))}
                    disabled={!isEditing}
                    placeholder="contact@bedrijf.be"
                  />
                </div>
              </div>
            </div>

            <Separator />

            {/* Statistics */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Statistieken</h3>
              <div className="grid md:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="customers">Aantal Klanten</Label>
                  <Input
                    id="customers"
                    type="number"
                    value={formData.customers}
                    onChange={(e) => setFormData(prev => ({ ...prev, customers: e.target.value }))}
                    disabled={!isEditing}
                    placeholder="800"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="rating">Rating</Label>
                  <Input
                    id="rating"
                    type="number"
                    step="0.1"
                    min="0"
                    max="5"
                    value={formData.rating}
                    onChange={(e) => setFormData(prev => ({ ...prev, rating: e.target.value }))}
                    disabled={!isEditing}
                    placeholder="4.8"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="delivery_time">Bezorgtijd</Label>
                  <Input
                    id="delivery_time"
                    value={formData.delivery_time}
                    onChange={(e) => setFormData(prev => ({ ...prev, delivery_time: e.target.value }))}
                    disabled={!isEditing}
                    placeholder="Zelfde dag"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="success_rate">Succespercentage</Label>
                  <Input
                    id="success_rate"
                    type="number"
                    min="0"
                    max="100"
                    value={formData.success_rate}
                    onChange={(e) => setFormData(prev => ({ ...prev, success_rate: e.target.value }))}
                    disabled={!isEditing}
                    placeholder="100"
                  />
                </div>
              </div>
            </div>

            <Separator />

            {/* Features */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Eigenschappen & Voordelen</h3>
              <div className="space-y-4">
                {formData.features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Input value={feature} disabled className="flex-1" />
                    {isEditing && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => removeFeature(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
                
                {isEditing && (
                  <div className="flex items-center gap-2">
                    <Input
                      value={newFeature}
                      onChange={(e) => setNewFeature(e.target.value)}
                      placeholder="Nieuwe eigenschap..."
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addFeature())}
                    />
                    <Button type="button" variant="outline" size="sm" onClick={addFeature}>
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>
            </div>

            {isEditing && (
              <div className="flex gap-2">
                <Button 
                  type="submit" 
                  disabled={updateProfileMutation.isPending}
                >
                  {updateProfileMutation.isPending ? 'Opslaan...' : 'Opslaan'}
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setIsEditing(false)}
                >
                  Annuleren
                </Button>
              </div>
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  );
};