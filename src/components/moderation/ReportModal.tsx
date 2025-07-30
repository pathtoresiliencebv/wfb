import React, { useState } from 'react';
import { Flag, AlertTriangle, X } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface ReportModalProps {
  itemId: string;
  itemType: 'topic' | 'reply';
  children?: React.ReactNode;
}

const reportReasons = [
  { value: 'spam', label: 'Spam of Reclame', description: 'Ongewenste commerciële content' },
  { value: 'harassment', label: 'Intimidatie of Pesterijen', description: 'Ongepast gedrag tegen andere gebruikers' },
  { value: 'hate_speech', label: 'Haatzaaiende Taal', description: 'Discriminerende of beledigende taal' },
  { value: 'misinformation', label: 'Verkeerde Informatie', description: 'Bewust verspreiden van onjuiste informatie' },
  { value: 'inappropriate', label: 'Ongepaste Content', description: 'Content die niet geschikt is voor het platform' },
  { value: 'copyright', label: 'Auteursrecht Schending', description: 'Ongeautoriseerd gebruik van beschermd materiaal' },
  { value: 'other', label: 'Anders', description: 'Een andere reden niet hierboven vermeld' },
];

export function ReportModal({ itemId, itemType, children }: ReportModalProps) {
  const [open, setOpen] = useState(false);
  const [selectedReason, setSelectedReason] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const handleSubmit = async () => {
    if (!user) {
      toast({
        title: 'Inloggen vereist',
        description: 'Je moet ingelogd zijn om content te rapporteren.',
        variant: 'destructive',
      });
      return;
    }

    if (!selectedReason) {
      toast({
        title: 'Selecteer een reden',
        description: 'Kies waarom je deze content rapporteert.',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from('reports')
        .insert({
          reporter_id: user.id,
          reported_item_id: itemId,
          reported_item_type: itemType,
          reason: selectedReason,
          description: description.trim() || null,
        });

      if (error) throw error;

      toast({
        title: 'Rapport verzonden',
        description: 'Bedankt voor je melding. We bekijken dit zo snel mogelijk.',
      });

      setOpen(false);
      setSelectedReason('');
      setDescription('');
    } catch (error) {
      console.error('Error submitting report:', error);
      toast({
        title: 'Fout',
        description: 'Er ging iets mis bij het versturen van je rapport.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setSelectedReason('');
    setDescription('');
  };

  return (
    <Dialog open={open} onOpenChange={(newOpen) => {
      setOpen(newOpen);
      if (!newOpen) resetForm();
    }}>
      <DialogTrigger asChild>
        {children || (
          <Button variant="ghost" size="sm">
            <Flag className="h-4 w-4" />
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-amber-500" />
            Content Rapporteren
          </DialogTitle>
          <DialogDescription>
            Help ons de community veilig te houden door ongepaste content te melden.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <div>
            <Label className="text-sm font-medium mb-3 block">
              Waarom rapporteer je deze content?
            </Label>
            <RadioGroup
              value={selectedReason}
              onValueChange={setSelectedReason}
              className="space-y-3"
            >
              {reportReasons.map((reason) => (
                <div key={reason.value} className="flex items-start space-x-3">
                  <RadioGroupItem value={reason.value} id={reason.value} className="mt-1" />
                  <div className="space-y-1 flex-1">
                    <Label htmlFor={reason.value} className="text-sm font-medium cursor-pointer">
                      {reason.label}
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      {reason.description}
                    </p>
                  </div>
                </div>
              ))}
            </RadioGroup>
          </div>

          <div>
            <Label htmlFor="description" className="text-sm font-medium">
              Aanvullende Details (Optioneel)
            </Label>
            <Textarea
              id="description"
              placeholder="Geef meer context over waarom je deze content rapporteert..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="mt-2 min-h-[100px]"
              maxLength={500}
            />
            <p className="text-xs text-muted-foreground mt-1">
              {description.length}/500 karakters
            </p>
          </div>

          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Annuleren
            </Button>
            <Button 
              onClick={handleSubmit} 
              disabled={isSubmitting || !selectedReason}
              className="bg-red-600 hover:bg-red-700"
            >
              {isSubmitting ? 'Versturen...' : 'Rapport Versturen'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}