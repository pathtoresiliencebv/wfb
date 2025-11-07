import { motion } from 'framer-motion';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Quote } from 'lucide-react';

interface Testimonial {
  avatarSrc: string;
  name: string;
  handle: string;
  text: string;
}

interface AuthTestimonialsProps {
  testimonials: Testimonial[];
}

export function AuthTestimonials({ testimonials }: AuthTestimonialsProps) {
  return (
    <div className="grid gap-4">
      {testimonials.map((testimonial, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 + index * 0.1 }}
          className="bg-card/50 backdrop-blur-sm border border-l-4 border-l-primary rounded-lg p-4 hover:bg-card/70 transition-all duration-300"
        >
          <div className="flex items-start gap-3">
            <Quote className="w-6 h-6 text-primary/40 flex-shrink-0 mt-1" />
            <div className="flex-1">
              <p className="text-sm text-foreground/90 mb-3">{testimonial.text}</p>
              <div className="flex items-center gap-2">
                <Avatar className="w-8 h-8 border-2 border-primary/20">
                  <AvatarImage src={testimonial.avatarSrc} alt={testimonial.name} />
                  <AvatarFallback>{testimonial.name[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium text-foreground">{testimonial.name}</p>
                  <p className="text-xs text-muted-foreground">{testimonial.handle}</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
