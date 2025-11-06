import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Star, Quote } from 'lucide-react';

const testimonials = [
  {
    id: 1,
    name: 'Jan Vermeulen',
    role: 'Medical Cannabis Patient',
    avatar: '',
    rating: 5,
    text: 'Eindelijk een Belgisch platform waar ik betrouwbare informatie vind over medicinale cannabis. De community is behulpzaam en de moderatie zorgt voor kwaliteit.',
  },
  {
    id: 2,
    name: 'Sophie De Smet',
    role: 'Recreational User',
    avatar: '',
    rating: 5,
    text: 'De leveranciers op dit platform zijn geverifieerd en betrouwbaar. Ik voel me veilig om hier contacten te leggen en informatie uit te wisselen.',
  },
  {
    id: 3,
    name: 'Mike Johnson',
    role: 'Cannabis Grower',
    avatar: '',
    rating: 5,
    text: 'Als kweeker waardeer ik de uitgebreide discussies over strains en kweektechnieken. Het niveau van kennis hier is indrukwekkend!',
  },
  {
    id: 4,
    name: 'Lisa Peeters',
    role: 'Community Member',
    avatar: '',
    rating: 5,
    text: 'De gamification maakt het forum extra leuk. Je wordt beloond voor actieve deelname en het helpen van anderen. Geweldige community!',
  },
];

export function TestimonialsSection() {
  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold">Wat Onze Community Zegt</h2>
        <p className="text-muted-foreground">
          Echte ervaringen van onze actieve leden
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {testimonials.map((testimonial) => (
          <Card key={testimonial.id} className="relative">
            <CardContent className="pt-6">
              <Quote className="absolute top-4 right-4 h-8 w-8 text-muted-foreground/20" />
              
              <div className="flex items-center gap-4 mb-4">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={testimonial.avatar} />
                  <AvatarFallback>
                    {testimonial.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h4 className="font-semibold">{testimonial.name}</h4>
                  <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                </div>
              </div>

              <div className="flex gap-1 mb-3">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                ))}
              </div>

              <p className="text-muted-foreground italic">
                "{testimonial.text}"
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
