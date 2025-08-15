import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Euro, Trash2, Edit, Save, X } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import type { SupplierPriceList } from '@/types/menuBuilder';

interface PriceListManagerProps {
  supplierId: string;
}

export function PriceListManager({ supplierId }: PriceListManagerProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isCreating, setIsCreating] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Fetch price lists
  const { data: priceLists = [], isLoading } = useQuery({
    queryKey: ['supplier-price-lists', supplierId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('supplier_price_lists')
        .select('*')
        .eq('supplier_id', supplierId)
        .eq('is_active', true)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as SupplierPriceList[];
    }
  });

  const [newPriceList, setNewPriceList] = useState({
    name: '',
    price_type: 'weight' as 'weight' | 'unit',
    unit_label: 'gram',
    pricing_data: {} as Record<string, number>
  });

  // Create price list mutation
  const createPriceListMutation = useMutation({
    mutationFn: async (data: typeof newPriceList) => {
      const { error } = await supabase
        .from('supplier_price_lists')
        .insert({
          supplier_id: supplierId,
          name: data.name,
          price_type: data.price_type,
          unit_label: data.unit_label,
          pricing_data: data.pricing_data
        });
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['supplier-price-lists'] });
      setIsCreating(false);
      setNewPriceList({
        name: '',
        price_type: 'weight',
        unit_label: 'gram',
        pricing_data: { '25': 0, '50': 0, '100': 0, '200': 0, '500': 0 }
      });
      toast({
        title: "Prijslijst aangemaakt",
        description: "Je nieuwe prijslijst is succesvol aangemaakt."
      });
    }
  });

  // Delete price list mutation
  const deletePriceListMutation = useMutation({
    mutationFn: async (priceListId: string) => {
      const { error } = await supabase
        .from('supplier_price_lists')
        .update({ is_active: false })
        .eq('id', priceListId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['supplier-price-lists'] });
      toast({
        title: "Prijslijst verwijderd",
        description: "De prijslijst is succesvol verwijderd."
      });
    }
  });

  const handleCreatePriceList = () => {
    if (!newPriceList.name.trim()) {
      toast({
        title: "Naam vereist",
        description: "Voer een naam in voor je prijslijst.",
        variant: "destructive"
      });
      return;
    }
    createPriceListMutation.mutate(newPriceList);
  };

  const handlePricingDataChange = (key: string, value: string) => {
    const numValue = parseFloat(value) || 0;
    setNewPriceList(prev => ({
      ...prev,
      pricing_data: { ...prev.pricing_data, [key]: numValue }
    }));
  };

  const weightOptions = ['10', '25', '50', '100', '200', '500'];
  const unitOptions = ['1', '2', '3', '5', '10'];

  if (isLoading) {
    return <div className="p-6 text-center">Laden...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Existing Price Lists */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Herbruikbare Prijslijsten</CardTitle>
              <CardDescription>
                Maak prijslijsten aan die je kunt hergebruiken voor meerdere categorieën
              </CardDescription>
            </div>
            <Button 
              onClick={() => setIsCreating(true)}
              className="flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Nieuwe Prijslijst
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {priceLists.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              Nog geen prijslijsten aangemaakt. Maak je eerste prijslijst aan om te beginnen.
            </div>
          ) : (
            <div className="space-y-4">
              {priceLists.map((priceList) => (
                <div key={priceList.id} className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium">{priceList.name}</h3>
                      <Badge variant="outline">
                        {priceList.price_type === 'weight' ? 'Op gewicht' : 'Per eenheid'}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => deletePriceListMutation.mutate(priceList.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-2 text-sm">
                    {Object.entries(priceList.pricing_data).map(([key, value]) => (
                      <div key={key} className="flex justify-between">
                        <span>{key}{priceList.unit_label || 'gr'}:</span>
                        <span>€{value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Create New Price List */}
      {isCreating && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Nieuwe Prijslijst Aanmaken</CardTitle>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setIsCreating(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Name and Type */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price_list_name">Naam Prijslijst</Label>
                <Input
                  id="price_list_name"
                  placeholder="Bijv. Standaard Wiet Prijzen"
                  value={newPriceList.name}
                  onChange={(e) => setNewPriceList(prev => ({ ...prev, name: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="price_type">Prijstype</Label>
                <Select
                  value={newPriceList.price_type}
                  onValueChange={(value: 'weight' | 'unit') => 
                    setNewPriceList(prev => ({ 
                      ...prev, 
                      price_type: value,
                      pricing_data: value === 'weight' 
                        ? { '25': 0, '50': 0, '100': 0, '200': 0, '500': 0 }
                        : { '1': 0, '2': 0, '3': 0, '5': 0, '10': 0 }
                    }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="weight">Op gewicht</SelectItem>
                    <SelectItem value="unit">Per eenheid</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Unit Label for Unit Pricing */}
            {newPriceList.price_type === 'unit' && (
              <div className="space-y-2">
                <Label htmlFor="unit_label">Eenheid Label</Label>
                <Input
                  id="unit_label"
                  placeholder="Bijv. stuks, cartridges, bollen"
                  value={newPriceList.unit_label}
                  onChange={(e) => setNewPriceList(prev => ({ ...prev, unit_label: e.target.value }))}
                />
              </div>
            )}

            {/* Pricing Grid */}
            <div className="space-y-2">
              <Label>Prijzen</Label>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {(newPriceList.price_type === 'weight' ? weightOptions : unitOptions).map((option) => (
                  <div key={option} className="space-y-1">
                    <Label className="text-sm">
                      {option}{newPriceList.price_type === 'weight' ? 'gr' : ` ${newPriceList.unit_label}`}
                    </Label>
                    <div className="relative">
                      <Euro className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        type="number"
                        placeholder="0"
                        className="pl-10"
                        value={newPriceList.pricing_data[option] || ''}
                        onChange={(e) => handlePricingDataChange(option, e.target.value)}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 pt-4">
              <Button 
                onClick={handleCreatePriceList}
                disabled={createPriceListMutation.isPending}
                className="flex items-center gap-2"
              >
                <Save className="h-4 w-4" />
                {createPriceListMutation.isPending ? 'Opslaan...' : 'Prijslijst Aanmaken'}
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setIsCreating(false)}
              >
                Annuleren
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
