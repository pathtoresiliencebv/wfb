import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Eye, EyeOff, Mail, Lock, Shield, Users, MessageSquare, ChevronLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { AuthTestimonials } from './AuthTestimonials';

const heroImage = '/lovable-uploads/a6faafc3-e2bd-47ec-8de8-603497930570.png';

interface ModernSignInProps {
  onSignIn?: (email: string, password: string, rememberMe: boolean) => void;
  onCreateAccount?: () => void;
}

const testimonials = [
  {
    avatarSrc: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&q=80",
    name: "Jan De Vries",
    handle: "@jandv",
    text: "Eindelijk een veilige plek om kennis te delen over cannabis!"
  },
  {
    avatarSrc: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=100&q=80",
    name: "Sophie Janssens",
    handle: "@sophiej",
    text: "De beste community in België. Altijd hulpzame mensen!"
  },
  {
    avatarSrc: "https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=100&q=80",
    name: "Marc Peeters",
    handle: "@marcpeeters",
    text: "Geweldige informatie over wetgeving en teelt. Aanrader!"
  }
];

export function ModernSignIn({ onSignIn, onCreateAccount }: ModernSignInProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const prefersReducedMotion = useReducedMotion();
  const logo = '/lovable-uploads/8721330a-f235-4c3b-9c21-85436a192135.png';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSignIn?.(email, password, rememberMe);
  };

  return (
    <div className="min-h-screen relative">
      {/* Header */}
      <header className="absolute top-0 left-0 right-0 z-50 border-b bg-background/95 backdrop-blur-sm">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <img src={logo} alt="Wiet Forum België" className="h-10" />
          </Link>
          <Link to="/">
            <Button variant="ghost" size="sm">
              <ChevronLeft className="mr-2 h-4 w-4" />
              Terug naar home
            </Button>
          </Link>
        </div>
      </header>

      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-muted/20 p-4 pt-24 pb-20">
        <motion.div
          initial={!prefersReducedMotion ? { opacity: 0, y: 20 } : {}}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-6xl grid lg:grid-cols-2 gap-0 bg-card/80 backdrop-blur-xl rounded-2xl shadow-2xl border border-border/50 overflow-hidden"
        >
          {/* Left Side - Form */}
          <div className="p-8 lg:p-12 flex flex-col border-r border-border/30">
            <motion.div
              initial={!prefersReducedMotion ? { opacity: 0 } : {}}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="mb-8"
            >
              <img src={logo} alt="Wiet Forum België" className="h-16 mb-6" />
              <h1 className="text-3xl font-bold text-foreground mb-2">
                Welkom Terug!
              </h1>
              <p className="text-muted-foreground">
                Log in om verder te gaan met de community
              </p>
            </motion.div>

          <form onSubmit={handleSubmit} className="space-y-6 flex-1">
            <div>
              <Label htmlFor="email">Email</Label>
              <div className="relative group">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground transition-colors group-focus-within:text-primary" />
                <Input
                  id="email"
                  type="email"
                  placeholder="jouw@email.be"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 h-12 bg-background/50 border-border/50 focus:border-primary focus:ring-2 focus:ring-primary/30 focus:shadow-lg focus:shadow-primary/10 transition-all duration-300"
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="password">Wachtwoord</Label>
              <div className="relative group">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground transition-colors group-focus-within:text-primary" />
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 pr-10 h-12 bg-background/50 border-border/50 focus:border-primary focus:ring-2 focus:ring-primary/30 focus:shadow-lg focus:shadow-primary/10 transition-all duration-300"
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 p-0 hover:text-primary transition-colors"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="remember"
                  checked={rememberMe}
                  onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                />
                <Label htmlFor="remember" className="text-sm cursor-pointer">
                  Onthoud mij
                </Label>
              </div>
              <Link to="/password-reset" className="text-sm text-primary hover:underline">
                Wachtwoord vergeten?
              </Link>
            </div>

            <Button
              type="submit"
              className="w-full h-12 text-base font-semibold bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
              disabled={!email || !password}
            >
              Inloggen
            </Button>

            <p className="text-center text-sm text-muted-foreground">
              Nog geen account?{' '}
              <button
                type="button"
                onClick={onCreateAccount}
                className="text-primary hover:underline font-medium"
              >
                Registreer nu
              </button>
            </p>
          </form>
        </div>

        {/* Right Side - Hero & Testimonials */}
        <div className="hidden lg:flex flex-col p-0 bg-gradient-to-br from-primary/5 via-primary/10 to-transparent relative overflow-hidden">
          <div className="relative h-64 overflow-hidden">
            <motion.img
              src={heroImage}
              alt="Wiet Forum België - Cannabis Community"
              className="w-full h-full object-cover"
              initial={{ scale: 1 }}
              animate={{ scale: 1.1 }}
              transition={{ duration: 20, repeat: Infinity, repeatType: "reverse" }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-card via-card/50 to-transparent" />
            
            <div className="absolute bottom-4 left-4 right-4 grid grid-cols-3 gap-2">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-background/90 backdrop-blur-sm rounded-lg p-3 border border-primary/20">
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-primary" />
                  <div>
                    <p className="text-xs text-muted-foreground">Actieve Leden</p>
                    <p className="text-lg font-bold text-foreground">10.000+</p>
                  </div>
                </div>
              </motion.div>
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-background/90 backdrop-blur-sm rounded-lg p-3 border border-primary/20">
                <div className="flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-primary" />
                  <div>
                    <p className="text-xs text-muted-foreground">Dagelijkse Posts</p>
                    <p className="text-lg font-bold text-foreground">100+</p>
                  </div>
                </div>
              </motion.div>
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="bg-background/90 backdrop-blur-sm rounded-lg p-3 border border-primary/20">
                <div className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-primary" />
                  <div>
                    <p className="text-xs text-muted-foreground">Veilig</p>
                    <p className="text-lg font-bold text-foreground">100%</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>

          <div className="flex-1 p-8">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
              <h3 className="text-xl font-bold text-foreground mb-4">Wat onze leden zeggen</h3>
              <AuthTestimonials testimonials={testimonials} />
            </motion.div>
          </div>

          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
        </div>
      </motion.div>

      <footer className="absolute bottom-0 left-0 right-0 border-t bg-background/95 backdrop-blur-sm py-4">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>© 2024 Wiet Forum België | <Link to="/terms" className="ml-2 hover:text-primary transition-colors">Voorwaarden</Link> | <Link to="/privacy" className="ml-2 hover:text-primary transition-colors">Privacy</Link></p>
        </div>
      </footer>
      </div>
    </div>
  );
}
