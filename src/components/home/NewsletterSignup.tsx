import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Mail } from 'lucide-react';
import { toast } from 'sonner';

export function NewsletterSignup() {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !email.includes('@')) {
      toast.error('Voer een geldig e-mailadres in');
      return;
    }

    setIsSubmitting(true);
    
    // Simulate newsletter signup
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    toast.success('Bedankt voor je inschrijving!');
    setEmail('');
    setIsSubmitting(false);
  };

  return (
    <Card className="bg-gradient-to-r from-primary/10 to-primary/5">
      <CardHeader className="text-center">
        <div className="inline-flex p-3 rounded-full bg-primary/10 w-fit mx-auto mb-2">
          <Mail className="h-6 w-6 text-primary" />
        </div>
        <CardTitle className="text-2xl">Blijf Op de Hoogte</CardTitle>
        <CardDescription>
          Ontvang wekelijks de laatste nieuwtjes, tips en updates uit de cannabis community
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
          <Input
            type="email"
            placeholder="jouw@email.be"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="flex-1"
            disabled={isSubmitting}
          />
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Bezig...' : 'Inschrijven'}
          </Button>
        </form>
        <p className="text-xs text-muted-foreground text-center mt-3">
          We respecteren je privacy. Je kunt je op elk moment uitschrijven.
        </p>
      </CardContent>
    </Card>
  );
}
