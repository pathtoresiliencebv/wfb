import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { SupplierMenuItem } from '@/types/supplier';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { Plus, Trash2, Save } from 'lucide-react';

interface SupplierMenuManagerProps {
  supplierId: string;
}

export const SupplierMenuManager: React.FC<SupplierMenuManagerProps> = ({ supplierId }) => {
  const queryClient = useQueryClient();
  const [newItem, setNewItem] = useState({
    name: '',
    price: '',
    unit: 'gram',
    category: '',
    description: '',
    is_available: true,
    position: 0,
  });

  const { data: items } = useQuery<SupplierMenuItem[]>({
    queryKey: ['supplier-menu-items', supplierId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('supplier_menu_items')
        .select('*')
        .eq('supplier_id', supplierId)
        .order('position', { ascending: true })
        .order('created_at', { ascending: true });
      if (error) throw error;
      return data as SupplierMenuItem[];
    },
    enabled: !!supplierId,
  });

  const addMutation = useMutation({
    mutationFn: async () => {
      const payload = {
        supplier_id: supplierId,
        name: newItem.name,
        price: parseFloat(newItem.price || '0'),
        unit: newItem.unit || 'gram',
        category: newItem.category || null,
        description: newItem.description || null,
        is_available: newItem.is_available,
        position: Number(newItem.position) || 0,
      };
      const { error } = await supabase.from('supplier_menu_items').insert(payload);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['supplier-menu-items', supplierId] });
      setNewItem({ name: '', price: '', unit: 'gram', category: '', description: '', is_available: true, position: 0 });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('supplier_menu_items').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['supplier-menu-items', supplierId] });
    },
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Menukaart / Prijzen</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Add Item */}
        <div className="grid md:grid-cols-6 gap-3">
          <div className="md:col-span-2 space-y-2">
            <Label>Naam</Label>
            <Input value={newItem.name} onChange={(e) => setNewItem({ ...newItem, name: e.target.value })} placeholder="Bijv. Amnesia Haze" />
          </div>
          <div className="space-y-2">
            <Label>Prijs (€)</Label>
            <Input type="number" step="0.01" value={newItem.price} onChange={(e) => setNewItem({ ...newItem, price: e.target.value })} placeholder="10.00" />
          </div>
          <div className="space-y-2">
            <Label>Eenheid</Label>
            <Input value={newItem.unit} onChange={(e) => setNewItem({ ...newItem, unit: e.target.value })} placeholder="gram / stuk" />
          </div>
          <div className="space-y-2">
            <Label>Categorie</Label>
            <Input value={newItem.category} onChange={(e) => setNewItem({ ...newItem, category: e.target.value })} placeholder="Bijv. Wietsoorten" />
          </div>
          <div className="flex items-end">
            <Button onClick={() => addMutation.mutate()} disabled={!newItem.name || !newItem.price}>
              <Plus className="h-4 w-4 mr-2" /> Toevoegen
            </Button>
          </div>
          <div className="md:col-span-6 space-y-2">
            <Label>Beschrijving</Label>
            <Input value={newItem.description} onChange={(e) => setNewItem({ ...newItem, description: e.target.value })} placeholder="Korte beschrijving (optioneel)" />
            <div className="flex items-center gap-2">
              <Checkbox id="available" checked={newItem.is_available} onCheckedChange={(v) => setNewItem({ ...newItem, is_available: Boolean(v) })} />
              <Label htmlFor="available">Beschikbaar</Label>
            </div>
          </div>
        </div>

        <Separator />

        {/* List Items */}
        <div className="space-y-3">
          {items && items.length > 0 ? (
            items.map((it) => (
              <div key={it.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                <div className="flex flex-col">
                  <div className="font-medium">{it.name} {it.unit ? <span className="text-muted-foreground text-sm">/ {it.unit}</span> : null}</div>
                  {it.description && <div className="text-sm text-muted-foreground">{it.description}</div>}
                  <div className="text-sm">€ {Number(it.price).toFixed(2)}</div>
                </div>
                <div className="flex items-center gap-2">
                  {!it.is_available && <span className="text-xs text-muted-foreground">Niet beschikbaar</span>}
                  <Button variant="outline" size="sm" onClick={() => deleteMutation.mutate(it.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))
          ) : (
            <div className="text-sm text-muted-foreground">Nog geen items op de menukaart.</div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default SupplierMenuManager;
