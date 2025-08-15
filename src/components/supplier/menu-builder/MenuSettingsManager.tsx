import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Save, Globe, Eye } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import type { SupplierMenuSettings } from '@/types/menuBuilder';

interface MenuSettingsManagerProps {
  supplierId: string;
}

export function MenuSettingsManager({ supplierId }: MenuSettingsManagerProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // Fetch menu settings
  const { data: menuSettings, isLoading } = useQuery({
    queryKey: ['supplier-menu-settings', supplierId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('supplier_menu_settings')
        .select('*')
        .eq('supplier_id', supplierId)
        .maybeSingle();
      
      if (error) throw error;
      return data as SupplierMenuSettings | null;
    }
  });

  const [formData, setFormData] = useState({
    menu_title: '',
    contact_wire: '',
    contact_telegram: '',
    contact_email: '',
    footer_message: '',
    is_published: false
  });

  React.useEffect(() => {
    if (menuSettings) {
      setFormData({
        menu_title: menuSettings.menu_title || '',
        contact_wire: menuSettings.contact_info?.wire || '',
        contact_telegram: menuSettings.contact_info?.telegram || '',
        contact_email: menuSettings.contact_info?.email || '',
        footer_message: menuSettings.footer_message || '',
        is_published: menuSettings.is_published || false
      });
    }
  }, [menuSettings]);

  // Save menu settings
  const saveSettingsMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const settingsData = {
        supplier_id: supplierId,
        menu_title: data.menu_title,
        contact_info: {
          wire: data.contact_wire,
          telegram: data.contact_telegram,
          email: data.contact_email
        },
        footer_message: data.footer_message,
        is_published: data.is_published
      };

      if (menuSettings) {
        const { error } = await supabase
          .from('supplier_menu_settings')
          .update(settingsData)
          .eq('id', menuSettings.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('supplier_menu_settings')
          .insert(settingsData);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['supplier-menu-settings'] });
      toast({
        title: "Instellingen opgeslagen",
        description: "Je menu instellingen zijn succesvol bijgewerkt."
      });
    },
    onError: (error) => {
      toast({
        title: "Fout bij opslaan",
        description: "Er is een fout opgetreden bij het opslaan van de instellingen.",
        variant: "destructive"
      });
    }
  });

  const handleSave = () => {
    saveSettingsMutation.mutate(formData);
  };

  if (isLoading) {
    return <div className="p-6 text-center">Laden...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5" />
              Menu Instellingen
            </CardTitle>
            <CardDescription>
              Stel de algemene instellingen voor je menukaart in
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant={formData.is_published ? "default" : "secondary"}>
              {formData.is_published ? "Gepubliceerd" : "Concept"}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Menu Title */}
        <div className="space-y-2">
          <Label htmlFor="menu_title">Menu Titel</Label>
          <Input
            id="menu_title"
            placeholder="Bijv. KoninggHaze Menu"
            value={formData.menu_title}
            onChange={(e) => setFormData(prev => ({ ...prev, menu_title: e.target.value }))}
          />
        </div>

        {/* Contact Information */}
        <div className="space-y-4">
          <Label className="text-base font-medium">Contactinformatie</Label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="contact_wire">Wire</Label>
              <Input
                id="contact_wire"
                placeholder="KoninggHaze"
                value={formData.contact_wire}
                onChange={(e) => setFormData(prev => ({ ...prev, contact_wire: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contact_telegram">Telegram</Label>
              <Input
                id="contact_telegram"
                placeholder="@KoninggHaze"
                value={formData.contact_telegram}
                onChange={(e) => setFormData(prev => ({ ...prev, contact_telegram: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contact_email">Email</Label>
              <Input
                id="contact_email"
                type="email"
                placeholder="info@example.com"
                value={formData.contact_email}
                onChange={(e) => setFormData(prev => ({ ...prev, contact_email: e.target.value }))}
              />
            </div>
          </div>
        </div>

        {/* Footer Message */}
        <div className="space-y-2">
          <Label htmlFor="footer_message">Footer Bericht</Label>
          <Textarea
            id="footer_message"
            placeholder="Bijv. Belgische Chauffeurs Gezocht!"
            value={formData.footer_message}
            onChange={(e) => setFormData(prev => ({ ...prev, footer_message: e.target.value }))}
            rows={3}
          />
        </div>

        {/* Publication Settings */}
        <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
          <div className="space-y-1">
            <Label className="text-base">Menu Publiceren</Label>
            <p className="text-sm text-muted-foreground">
              Maak je menu publiek zichtbaar via een deelbare link
            </p>
          </div>
          <Switch
            checked={formData.is_published}
            onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_published: checked }))}
          />
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 pt-4">
          <Button 
            onClick={handleSave}
            disabled={saveSettingsMutation.isPending}
            className="flex items-center gap-2"
          >
            <Save className="h-4 w-4" />
            {saveSettingsMutation.isPending ? 'Opslaan...' : 'Opslaan'}
          </Button>
          
          {formData.is_published && (
            <Button variant="outline" className="flex items-center gap-2">
              <Eye className="h-4 w-4" />
              Preview Menu
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}