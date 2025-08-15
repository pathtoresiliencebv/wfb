import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Store, User, Mail, Lock } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface CreateSupplierDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateSupplierDialog({ open, onOpenChange }: CreateSupplierDialogProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [description, setDescription] = useState('');
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Create supplier account mutation
  const createSupplierMutation = useMutation({
    mutationFn: async () => {
      // Create auth user by signing them up
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username,
            display_name: businessName,
            role: 'supplier'
          }
        }
      });

      if (authError) throw authError;
      if (!authData.user) throw new Error('Failed to create user');

      // The profile and supplier_profile will be created automatically by the trigger
      // Wait a moment for the trigger to complete, then optionally update business name and description
      await new Promise(resolve => setTimeout(resolve, 500));

      // Only update the supplier profile if we have a custom business name or description
      if (businessName !== username || description) {
        const { error: updateError } = await supabase
          .from('supplier_profiles')
          .update({
            business_name: businessName,
            description: description || null
          })
          .eq('user_id', authData.user.id);

        if (updateError) throw updateError;
      }

      return authData.user;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-suppliers'] });
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      toast({ 
        title: 'Leverancier aangemaakt', 
        description: `Nieuwe leverancier ${businessName} is succesvol aangemaakt.` 
      });
      handleClose();
    },
    onError: (error: any) => {
      toast({ 
        title: 'Fout', 
        description: error.message || 'Er is een fout opgetreden bij het aanmaken van de leverancier.',
        variant: 'destructive' 
      });
      console.error('Error creating supplier:', error);
    }
  });

  const handleClose = () => {
    setEmail('');
    setPassword('');
    setUsername('');
    setBusinessName('');
    setDescription('');
    onOpenChange(false);
  };

  const handleCreate = () => {
    if (!email.trim() || !password.trim() || !username.trim() || !businessName.trim()) {
      toast({
        title: 'Fout',
        description: 'Vul alle verplichte velden in.',
        variant: 'destructive'
      });
      return;
    }
    createSupplierMutation.mutate();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Store className="h-5 w-5" />
            Nieuwe Leverancier Aanmaken
          </DialogTitle>
          <DialogDescription>
            Maak een nieuw leverancier account aan
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label htmlFor="email">Email *</Label>
            <div className="relative mt-1">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="leverancier@example.com"
                className="pl-10"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="password">Wachtwoord *</Label>
            <div className="relative mt-1">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Minimaal 6 karakters"
                className="pl-10"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="username">Gebruikersnaam *</Label>
            <div className="relative mt-1">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))}
                placeholder="gebruikersnaam"
                className="pl-10"
              />
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Alleen kleine letters, cijfers en underscores
            </p>
          </div>

          <div>
            <Label htmlFor="business-name">Bedrijfsnaam *</Label>
            <Input
              id="business-name"
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
              placeholder="Bedrijfsnaam"
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="description">Beschrijving (optioneel)</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Beschrijf de leverancier..."
              className="mt-1"
              rows={3}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Annuleren
          </Button>
          <Button 
            onClick={handleCreate}
            disabled={createSupplierMutation.isPending || !email.trim() || !password.trim() || !username.trim() || !businessName.trim()}
          >
            {createSupplierMutation.isPending ? 'Aanmaken...' : 'Leverancier Aanmaken'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}