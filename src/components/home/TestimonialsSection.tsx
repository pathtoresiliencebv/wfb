import { Card, CardContent } from '@/components/ui/card';
import { MessageSquare } from 'lucide-react';

export function TestimonialsSection() {
  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-4">
          Wat onze community zegt
        </h2>
        <p className="text-muted-foreground">
          Word lid van onze groeiende community
        </p>
      </div>

      <Card className="border-2 border-primary/20 bg-primary/5">
        <CardContent className="p-8 text-center">
          <MessageSquare className="w-12 h-12 mx-auto mb-4 text-primary" />
          <h3 className="text-xl font-semibold mb-2">
            Deel jouw ervaring
          </h3>
          <p className="text-muted-foreground">
            Log in om je ervaring te delen met de community
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
