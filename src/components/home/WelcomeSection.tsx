import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useIsMobile } from '@/hooks/use-mobile';

export function WelcomeSection() {
  const isMobile = useIsMobile();
  
  // Don't show welcome section on mobile
  if (isMobile) {
    return null;
  }

  return (
    <Card className="cannabis-gradient text-primary-foreground">
      <CardHeader>
        <CardTitle className="font-heading text-xl">
          Welkom bij Wiet Forum België! 🌿
        </CardTitle>
        <CardDescription className="text-primary-foreground/80">
          De community voor cannabis liefhebbers in België. Deel kennis, ervaringen en 
          houd je op de hoogte van de laatste ontwikkelingen.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Button variant="secondary" className="gap-2" asChild>
          <a href="/create-topic">
            <Plus className="h-4 w-4" />
            Nieuw Topic Starten
          </a>
        </Button>
      </CardContent>
    </Card>
  );
}