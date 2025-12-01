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
import { InteractiveMenuBuilder } from '@/components/supplier/menu-builder/InteractiveMenuBuilder';

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
    why_choose_us_descriptions: {} as Record<string, string>,
    ordering_process_descriptions: {} as Record<string, string>,
    contact_description: '',
    product_name: '',
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
        why_choose_us_descriptions: (supplierProfile.why_choose_us_descriptions as Record<string, string>) || {},
        ordering_process_descriptions: (supplierProfile.ordering_process_descriptions as Record<string, string>) || {},
        contact_description: supplierProfile.contact_description || '',
        product_name: supplierProfile.product_name || '',
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
        why_choose_us_descriptions: data.why_choose_us_descriptions,
        ordering_process_descriptions: data.ordering_process_descriptions,
        contact_description: data.contact_description,
        product_name: data.product_name,
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
    <div className="space-y-4 md:space-y-6 px-2 sm:px-0">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 w-full">
        <div className="flex flex-wrap items-center gap-2 md:gap-3">
          <div className="flex items-center gap-2">
            <Store className="h-5 w-5 md:h-6 md:w-6 text-primary shrink-0" />
            <h1 className="text-lg sm:text-xl md:text-2xl font-bold break-words">Leverancier Dashboard</h1>
          </div>
          {supplierProfile && <CrownBadge />}
        </div>
        <Button
          onClick={() => setIsEditing(!isEditing)}
          variant={isEditing ? 'outline' : 'default'}
          className="min-h-[44px] px-4 w-full sm:w-auto"
        >
          <Settings className="h-4 w-4 mr-2" />
          <span className="hidden sm:inline">{isEditing ? 'Annuleren' : 'Bewerken'}</span>
          <span className="sm:hidden">{isEditing ? 'Stop' : 'Edit'}</span>
        </Button>
      </div>

      {/* Stats Overview */}
      {supplierProfile && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
          <Card>
            <CardContent className="p-4 md:p-6 text-center">
              <Users className="h-6 w-6 md:h-8 md:w-8 text-primary mx-auto mb-2" />
              <div className="text-lg md:text-2xl font-bold">
                {(supplierProfile.stats as SupplierStats)?.customers || 0}+
              </div>
              <p className="text-xs md:text-sm text-muted-foreground">Klanten</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 md:p-6 text-center">
              <Star className="h-6 w-6 md:h-8 md:w-8 text-yellow-500 fill-current mx-auto mb-2" />
              <div className="text-lg md:text-2xl font-bold">
                {(supplierProfile.stats as SupplierStats)?.rating || 'N/A'}
              </div>
              <p className="text-xs md:text-sm text-muted-foreground">Rating</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 md:p-6 text-center">
              <TrendingUp className="h-6 w-6 md:h-8 md:w-8 text-green-500 mx-auto mb-2" />
              <div className="text-lg md:text-2xl font-bold">
                {supplierProfile.ranking || 'Ongerangschikt'}
              </div>
              <p className="text-xs md:text-sm text-muted-foreground">Ranking</p>
            </CardContent>
          </Card>
          
          <Card className="col-span-2 lg:col-span-1">
            <CardContent className="p-4 md:p-6 text-center flex items-center justify-center">
              <Badge variant="secondary" className="text-sm md:text-lg px-3 py-1">
                {supplierProfile.is_active ? 'Actief' : 'Inactief'}
              </Badge>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Profile Form */}
      <Card>
        <CardHeader className="p-4 md:p-6">
          <CardTitle className="text-lg md:text-xl">Profiel Instellingen</CardTitle>
        </CardHeader>
        <CardContent className="p-4 md:p-6">
          <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
            {/* Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="business_name" className="text-sm font-medium">Bedrijfsnaam *</Label>
                <Input
                  id="business_name"
                  value={formData.business_name}
                  onChange={(e) => setFormData(prev => ({ ...prev, business_name: e.target.value }))}
                  disabled={!isEditing}
                  required
                  className="min-h-[44px]"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description" className="text-sm font-medium">Beschrijving</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                disabled={!isEditing}
                rows={3}
                className="min-h-[100px] resize-y"
                placeholder="Vertel over je bedrijf en wat je aanbiedt..."
              />
            </div>

            <Separator />

            {/* Contact Info */}
            <div>
              <h3 className="text-base md:text-lg font-semibold mb-3 md:mb-4">Contact Informatie</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="wire" className="text-sm font-medium">Wire Username</Label>
                  <Input
                    id="wire"
                    value={formData.contact_wire}
                    onChange={(e) => setFormData(prev => ({ ...prev, contact_wire: e.target.value }))}
                    disabled={!isEditing}
                    placeholder="@username"
                    className="min-h-[44px]"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="telegram" className="text-sm font-medium">Telegram Username</Label>
                  <Input
                    id="telegram"
                    value={formData.contact_telegram}
                    onChange={(e) => setFormData(prev => ({ ...prev, contact_telegram: e.target.value }))}
                    disabled={!isEditing}
                    placeholder="@username"
                    className="min-h-[44px]"
                  />
                </div>
                <div className="space-y-2 sm:col-span-2 lg:col-span-1">
                  <Label htmlFor="email" className="text-sm font-medium">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.contact_email}
                    onChange={(e) => setFormData(prev => ({ ...prev, contact_email: e.target.value }))}
                    disabled={!isEditing}
                    placeholder="contact@bedrijf.be"
                    className="min-h-[44px]"
                  />
                </div>
              </div>
            </div>

            <Separator />

            {/* Statistics */}
            <div>
              <h3 className="text-base md:text-lg font-semibold mb-3 md:mb-4">Statistieken</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="customers" className="text-sm font-medium">Aantal Klanten</Label>
                  <Input
                    id="customers"
                    type="number"
                    value={formData.customers}
                    onChange={(e) => setFormData(prev => ({ ...prev, customers: e.target.value }))}
                    disabled={!isEditing}
                    placeholder="800"
                    className="min-h-[44px]"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="rating" className="text-sm font-medium">Rating</Label>
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
                    className="min-h-[44px]"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="delivery_time" className="text-sm font-medium">Bezorgtijd</Label>
                  <Input
                    id="delivery_time"
                    value={formData.delivery_time}
                    onChange={(e) => setFormData(prev => ({ ...prev, delivery_time: e.target.value }))}
                    disabled={!isEditing}
                    placeholder="Zelfde dag"
                    className="min-h-[44px]"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="success_rate" className="text-sm font-medium">Succespercentage</Label>
                  <Input
                    id="success_rate"
                    type="number"
                    min="0"
                    max="100"
                    value={formData.success_rate}
                    onChange={(e) => setFormData(prev => ({ ...prev, success_rate: e.target.value }))}
                    disabled={!isEditing}
                    placeholder="100"
                    className="min-h-[44px]"
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

            <Separator />

            {/* USP Descriptions */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Waarom Bestellen Bij Ons - Omschrijvingen</h3>
              <div className="space-y-4">
                {['experience', 'delivery', 'appointments', 'quality', 'service', 'reliability'].map((uspKey) => (
                  <div key={uspKey} className="space-y-2">
                    <Label className="text-sm font-medium capitalize">{uspKey.replace('_', ' ')}</Label>
                    <Textarea
                      value={formData.why_choose_us_descriptions?.[uspKey] || ''}
                      onChange={(e) => setFormData(prev => ({ 
                        ...prev, 
                        why_choose_us_descriptions: {
                          ...prev.why_choose_us_descriptions,
                          [uspKey]: e.target.value
                        }
                      }))}
                      disabled={!isEditing}
                      placeholder={`Omschrijving voor ${uspKey.replace('_', ' ')}...`}
                      rows={2}
                    />
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            {/* Product Name */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Product Naam</h3>
              <div className="space-y-2">
                <Label htmlFor="product_name">Naam voor je producten (bijv. "cannabis", "wiet", "producten")</Label>
                <Input
                  id="product_name"
                  value={formData.product_name || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, product_name: e.target.value }))}
                  disabled={!isEditing}
                  placeholder="producten"
                />
              </div>
            </div>

            <Separator />

            {/* Ordering Process Descriptions */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Bestelproces - Omschrijvingen</h3>
              <div className="space-y-4">
                {['contact', 'menu', 'order', 'address', 'delivery', 'complete'].map((stepKey) => (
                  <div key={stepKey} className="space-y-2">
                    <Label className="text-sm font-medium capitalize">{stepKey.replace('_', ' ')}</Label>
                    <Textarea
                      value={formData.ordering_process_descriptions?.[stepKey] || ''}
                      onChange={(e) => setFormData(prev => ({ 
                        ...prev, 
                        ordering_process_descriptions: {
                          ...prev.ordering_process_descriptions,
                          [stepKey]: e.target.value
                        }
                      }))}
                      disabled={!isEditing}
                      placeholder={`Omschrijving voor ${stepKey.replace('_', ' ')} stap...`}
                      rows={2}
                    />
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            {/* Contact Description */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Contact Sectie Omschrijving</h3>
              <div className="space-y-2">
                <Label htmlFor="contact_description">Omschrijving voor de contact sectie</Label>
                <Textarea
                  id="contact_description"
                  value={formData.contact_description || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, contact_description: e.target.value }))}
                  disabled={!isEditing}
                  placeholder="Heb je vragen of wil je een bestelling plaatsen? Neem dan contact met ons op..."
                  rows={3}
                />
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

      {/* Interactive Menu Builder */}
      {supplierProfile?.id && (
        <InteractiveMenuBuilder supplierId={supplierProfile.id} />
      )}
    </div>
  );
};