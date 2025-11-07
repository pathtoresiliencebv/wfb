import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ChevronLeft, AtSign, Leaf } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';

interface ModernAuthPageProps {
  onEmailContinue?: (email: string) => void;
}

export function ModernAuthPage({ onEmailContinue }: ModernAuthPageProps) {
  const [email, setEmail] = React.useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onEmailContinue?.(email);
  };

  return (
    <main className="relative md:h-screen md:overflow-hidden lg:grid lg:grid-cols-2">
      <div className="bg-muted/60 relative hidden h-full flex-col border-r p-10 lg:flex">
        <div className="from-background absolute inset-0 z-10 bg-gradient-to-t to-transparent" />
        <div className="z-10 flex items-center gap-2">
          <Leaf className="size-8 text-primary" />
          <p className="text-2xl font-semibold">Wiet Forum België</p>
        </div>
        <div className="z-10 mt-auto">
          <blockquote className="space-y-2">
            <p className="text-xl">
              &ldquo;De beste community voor cannabis liefhebbers in België. Hier vind je altijd de nieuwste informatie en hulp.&rdquo;
            </p>
            <footer className="font-mono text-sm font-semibold">
              ~ Community Lid sinds 2023
            </footer>
          </blockquote>
        </div>
        <div className="absolute inset-0">
          <FloatingPaths position={1} />
          <FloatingPaths position={-1} />
        </div>
      </div>
      <div className="relative flex min-h-screen flex-col justify-center p-4">
        <div
          aria-hidden
          className="absolute inset-0 isolate contain-strict -z-10 opacity-60"
        >
          <div className="bg-[radial-gradient(68.54%_68.72%_at_55.02%_31.46%,hsl(var(--primary)/.06)_0,hsla(0,0%,55%,.02)_50%,hsl(var(--foreground)/.01)_80%)] absolute top-0 right-0 h-320 w-140 -translate-y-87.5 rounded-full" />
          <div className="bg-[radial-gradient(50%_50%_at_50%_50%,hsl(var(--primary)/.04)_0,hsl(var(--foreground)/.01)_80%,transparent_100%)] absolute top-0 right-0 h-320 w-60 [translate:5%_-50%] rounded-full" />
        </div>
        <Button variant="ghost" className="absolute top-7 left-5" asChild>
          <Link to="/">
            <ChevronLeft className="size-4 me-2" />
            Home
          </Link>
        </Button>
        <div className="mx-auto space-y-4 sm:w-sm">
          <div className="flex items-center gap-2 lg:hidden">
            <Leaf className="size-8 text-primary" />
            <p className="text-2xl font-semibold">Wiet Forum</p>
          </div>
          <div className="flex flex-col space-y-1">
            <h1 className="font-heading text-2xl font-bold tracking-wide">
              Registreren of Inloggen
            </h1>
            <p className="text-muted-foreground text-base">
              Maak een account aan of log in op Wiet Forum België
            </p>
          </div>

          <AuthSeparator />

          <form className="space-y-2" onSubmit={handleSubmit}>
            <p className="text-muted-foreground text-start text-xs">
              Voer je e-mailadres in om te registreren of in te loggen
            </p>
            <div className="relative h-max">
              <Input
                placeholder="jouw.email@voorbeeld.be"
                className="peer ps-9"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <div className="text-muted-foreground pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 peer-disabled:opacity-50">
                <AtSign className="size-4" aria-hidden="true" />
              </div>
            </div>

            <Button type="submit" className="w-full">
              <span>Doorgaan met E-mail</span>
            </Button>
          </form>
          <p className="text-muted-foreground mt-8 text-sm">
            Door door te gaan, ga je akkoord met onze{' '}
            <Link
              to="/terms"
              className="hover:text-primary underline underline-offset-4"
            >
              Gebruiksvoorwaarden
            </Link>{' '}
            en{' '}
            <Link
              to="/privacy"
              className="hover:text-primary underline underline-offset-4"
            >
              Privacybeleid
            </Link>
            .
          </p>
        </div>
      </div>
    </main>
  );
}

function FloatingPaths({ position }: { position: number }) {
  const paths = Array.from({ length: 36 }, (_, i) => ({
    id: i,
    d: `M-${380 - i * 5 * position} -${189 + i * 6}C-${
      380 - i * 5 * position
    } -${189 + i * 6} -${312 - i * 5 * position} ${216 - i * 6} ${
      152 - i * 5 * position
    } ${343 - i * 6}C${616 - i * 5 * position} ${470 - i * 6} ${
      684 - i * 5 * position
    } ${875 - i * 6} ${684 - i * 5 * position} ${875 - i * 6}`,
    color: `rgba(15,23,42,${0.1 + i * 0.03})`,
    width: 0.5 + i * 0.03,
  }));

  return (
    <div className="pointer-events-none absolute inset-0">
      <svg
        className="h-full w-full text-primary/20"
        viewBox="0 0 696 316"
        fill="none"
      >
        <title>Background Paths</title>
        {paths.map((path) => (
          <motion.path
            key={path.id}
            d={path.d}
            stroke="currentColor"
            strokeWidth={path.width}
            strokeOpacity={0.1 + path.id * 0.03}
            initial={{ pathLength: 0.3, opacity: 0.6 }}
            animate={{
              pathLength: 1,
              opacity: [0.3, 0.6, 0.3],
              pathOffset: [0, 1, 0],
            }}
            transition={{
              duration: 20 + Math.random() * 10,
              repeat: Number.POSITIVE_INFINITY,
              ease: 'linear',
            }}
          />
        ))}
      </svg>
    </div>
  );
}

const AuthSeparator = () => {
  return (
    <div className="flex w-full items-center justify-center">
      <div className="bg-border h-px w-full" />
      <span className="text-muted-foreground px-2 text-xs">START</span>
      <div className="bg-border h-px w-full" />
    </div>
  );
};
