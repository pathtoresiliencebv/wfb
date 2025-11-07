import React, { useState } from 'react';
import { Eye, EyeOff, Leaf } from 'lucide-react';
import { Link } from 'react-router-dom';

interface ModernSignInProps {
  onSignIn?: (email: string, password: string, rememberMe: boolean) => void;
  onCreateAccount?: () => void;
}

const GlassInputWrapper = ({ children }: { children: React.ReactNode }) => (
  <div className="rounded-2xl border border-border bg-foreground/5 backdrop-blur-sm transition-colors focus-within:border-primary/70 focus-within:bg-primary/10">
    {children}
  </div>
);

export const ModernSignIn: React.FC<ModernSignInProps> = ({
  onSignIn,
  onCreateAccount,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSignIn?.(email, password, rememberMe);
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row w-full">
      {/* Left column: sign-in form */}
      <section className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="flex flex-col gap-6">
            <div className="flex items-center gap-3 mb-4">
              <Leaf className="size-10 text-primary" />
              <span className="text-2xl font-bold">Wiet Forum</span>
            </div>
            
            <h1 className="animate-fade-in text-4xl md:text-5xl font-semibold leading-tight">
              <span className="font-light text-foreground tracking-tighter">Welkom</span>
            </h1>
            <p className="animate-fade-in text-muted-foreground">
              Log in op je account en ga verder met je reis in onze community
            </p>

            <form className="space-y-5" onSubmit={handleSubmit}>
              <div className="animate-fade-in">
                <label className="text-sm font-medium text-muted-foreground">E-mailadres</label>
                <GlassInputWrapper>
                  <input 
                    name="email" 
                    type="email" 
                    placeholder="Voer je e-mailadres in" 
                    className="w-full bg-transparent text-sm p-4 rounded-2xl focus:outline-none"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </GlassInputWrapper>
              </div>

              <div className="animate-fade-in">
                <label className="text-sm font-medium text-muted-foreground">Wachtwoord</label>
                <GlassInputWrapper>
                  <div className="relative">
                    <input 
                      name="password" 
                      type={showPassword ? 'text' : 'password'} 
                      placeholder="Voer je wachtwoord in" 
                      className="w-full bg-transparent text-sm p-4 pr-12 rounded-2xl focus:outline-none"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                    <button 
                      type="button" 
                      onClick={() => setShowPassword(!showPassword)} 
                      className="absolute inset-y-0 right-3 flex items-center"
                    >
                      {showPassword ? (
                        <EyeOff className="w-5 h-5 text-muted-foreground hover:text-foreground transition-colors" />
                      ) : (
                        <Eye className="w-5 h-5 text-muted-foreground hover:text-foreground transition-colors" />
                      )}
                    </button>
                  </div>
                </GlassInputWrapper>
              </div>

              <div className="animate-fade-in flex items-center justify-between text-sm">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input 
                    type="checkbox" 
                    name="rememberMe" 
                    className="w-4 h-4 rounded border-border text-primary focus:ring-primary"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                  />
                  <span className="text-foreground/90">Blijf ingelogd</span>
                </label>
                <Link to="/password-reset" className="hover:underline text-primary transition-colors">
                  Wachtwoord vergeten?
                </Link>
              </div>

              <button 
                type="submit" 
                className="animate-fade-in w-full rounded-2xl bg-primary py-4 font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
              >
                Inloggen
              </button>
            </form>

            <p className="animate-fade-in text-center text-sm text-muted-foreground">
              Nieuw op ons platform?{' '}
              <button 
                onClick={onCreateAccount}
                className="text-primary hover:underline transition-colors"
              >
                Account Aanmaken
              </button>
            </p>
          </div>
        </div>
      </section>

      {/* Right column: hero image */}
      <section className="hidden md:block flex-1 relative p-4 bg-gradient-to-br from-primary/20 via-secondary/10 to-background">
        <div className="absolute inset-4 rounded-3xl bg-gradient-to-br from-primary/30 to-secondary/20 flex items-center justify-center">
          <div className="text-center space-y-6 p-12">
            <Leaf className="size-24 text-primary mx-auto" />
            <h2 className="text-4xl font-bold text-foreground">
              Wiet Forum België
            </h2>
            <p className="text-xl text-muted-foreground max-w-md">
              De grootste en meest betrouwbare cannabis community van België
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
