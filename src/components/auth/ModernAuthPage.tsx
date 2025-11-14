import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ChevronLeft, AtSign, Eye, EyeOff, CheckCircle, XCircle, Loader2, CalendarIcon, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';
import { Checkbox } from '@/components/ui/checkbox';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { nl } from 'date-fns/locale';

const heroImage = '/lovable-uploads/a6faafc3-e2bd-47ec-8de8-603497930570.png';

interface ModernAuthPageProps {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  birthDate?: Date;
  ageConfirmed: boolean;
  termsAccepted: boolean;
  onUsernameChange: (value: string) => void;
  onEmailChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
  onConfirmPasswordChange: (value: string) => void;
  onBirthDateChange: (date?: Date) => void;
  onAgeConfirmedChange: (checked: boolean) => void;
  onTermsAcceptedChange: (checked: boolean) => void;
  onSubmit: (e: React.FormEvent) => void;
  isSubmitting?: boolean;
  isCheckingUsername?: boolean;
  usernameAvailable?: boolean | null;
  errors?: {
    username?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
    birthDate?: string;
    ageConfirmed?: string;
    termsAccepted?: string;
  };
}

export function ModernAuthPage({ 
  username,
  email,
  password,
  confirmPassword,
  birthDate,
  ageConfirmed,
  termsAccepted,
  onUsernameChange,
  onEmailChange,
  onPasswordChange,
  onConfirmPasswordChange,
  onBirthDateChange,
  onAgeConfirmedChange,
  onTermsAcceptedChange,
  onSubmit,
  isSubmitting = false,
  isCheckingUsername = false,
  usernameAvailable = null,
  errors = {}
}: ModernAuthPageProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const logo = '/lovable-uploads/8721330a-f235-4c3b-9c21-85436a192135.png';
  
  const getPasswordStrength = (pwd: string) => {
    let strength = 0;
    if (pwd.length >= 8) strength++;
    if (/(?=.*[a-z])/.test(pwd)) strength++;
    if (/(?=.*[A-Z])/.test(pwd)) strength++;
    if (/(?=.*\d)/.test(pwd)) strength++;
    if (/(?=.*[!@#$%^&*])/.test(pwd)) strength++;
    return strength;
  };
  
  const passwordStrength = getPasswordStrength(password);

  return (
    <main className="relative md:h-screen md:overflow-hidden lg:grid lg:grid-cols-2">
      <div className="bg-muted/60 relative hidden h-full flex-col border-r p-10 lg:flex overflow-hidden">
        {/* Hero Image als achtergrond */}
        <img 
          src={heroImage}
          alt="Wiet Forum België"
          className="absolute inset-0 w-full h-full object-cover opacity-20"
        />
        <div className="from-background absolute inset-0 z-10 bg-gradient-to-t to-transparent" />
        <div className="z-10 flex items-center gap-3">
          <img 
            src={logo}
            alt="Wiet Forum België Logo"
            className="h-10 w-auto"
          />
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
        <div className="mx-auto space-y-4 sm:w-sm max-w-md">
          <div className="flex items-center gap-3 lg:hidden">
            <img 
              src={logo}
              alt="Wiet Forum België Logo"
              className="h-8 w-auto"
            />
            <p className="text-xl font-semibold">Wiet Forum</p>
          </div>
          <div className="flex flex-col space-y-1 animate-element animate-delay-100">
            <h1 className="font-heading text-2xl font-bold tracking-wide">
              Account aanmaken
            </h1>
            <p className="text-muted-foreground text-base">
              Word lid van de cannabis community van België
            </p>
          </div>

          <AuthSeparator />

          <form className="space-y-4" onSubmit={onSubmit}>
            {/* Username */}
            <div className="animate-element animate-delay-200">
              <label className="text-sm font-medium text-muted-foreground mb-2 block">Gebruikersnaam</label>
              <GlassInputWrapper>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="jouwgebruikersnaam"
                    className="pl-11 bg-transparent border-0 focus-visible:ring-0"
                    value={username}
                    onChange={(e) => onUsernameChange(e.target.value)}
                    disabled={isSubmitting}
                  />
                  {isCheckingUsername && (
                    <Loader2 className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-muted-foreground" />
                  )}
                  {!isCheckingUsername && username.length >= 3 && usernameAvailable !== null && (
                    <div className="absolute right-4 top-1/2 -translate-y-1/2">
                      {usernameAvailable ? (
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      ) : (
                        <XCircle className="h-4 w-4 text-red-500" />
                      )}
                    </div>
                  )}
                </div>
              </GlassInputWrapper>
              <p className="text-xs text-muted-foreground mt-1">3-20 karakters, alleen letters, cijfers, - en _</p>
              {errors.username && <p className="text-sm text-red-500 mt-1">{errors.username}</p>}
              {!isCheckingUsername && username.length >= 3 && usernameAvailable !== null && (
                <p className={`text-sm mt-1 ${usernameAvailable ? 'text-green-600' : 'text-red-600'}`}>
                  {usernameAvailable ? 'Gebruikersnaam is beschikbaar' : 'Gebruikersnaam is niet beschikbaar'}
                </p>
              )}
            </div>

            {/* Email */}
            <div className="animate-element animate-delay-300">
              <label className="text-sm font-medium text-muted-foreground mb-2 block">Email</label>
              <GlassInputWrapper>
                <div className="relative">
                  <AtSign className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="email"
                    placeholder="je@email.com"
                    className="pl-11 bg-transparent border-0 focus-visible:ring-0"
                    value={email}
                    onChange={(e) => onEmailChange(e.target.value)}
                    disabled={isSubmitting}
                  />
                </div>
              </GlassInputWrapper>
              {errors.email && <p className="text-sm text-red-500 mt-1">{errors.email}</p>}
            </div>

            {/* Birth Date */}
            <div className="animate-element animate-delay-400">
              <label className="text-sm font-medium text-muted-foreground mb-2 block">Geboortedatum</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal bg-foreground/5 backdrop-blur-sm border-border hover:border-primary/70 hover:bg-primary/10",
                      !birthDate && "text-muted-foreground"
                    )}
                    disabled={isSubmitting}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {birthDate ? format(birthDate, "PPP", { locale: nl }) : <span>Selecteer je geboortedatum</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={birthDate}
                    onSelect={onBirthDateChange}
                    disabled={(date) =>
                      date > new Date() || date < new Date("1900-01-01")
                    }
                    initialFocus
                    captionLayout="dropdown"
                    fromYear={1900}
                    toYear={new Date().getFullYear()}
                    defaultMonth={new Date(new Date().getFullYear() - 25, 0, 1)}
                    locale={nl}
                    className="pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
              <p className="text-xs text-muted-foreground mt-1">Je moet 18+ zijn om een account aan te maken</p>
              {errors.birthDate && <p className="text-sm text-red-500 mt-1">{errors.birthDate}</p>}
            </div>

            {/* Password */}
            <div className="animate-element animate-delay-500">
              <label className="text-sm font-medium text-muted-foreground mb-2 block">Wachtwoord</label>
              <GlassInputWrapper>
                <div className="relative">
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    className="pr-12 bg-transparent border-0 focus-visible:ring-0"
                    value={password}
                    onChange={(e) => onPasswordChange(e.target.value)}
                    disabled={isSubmitting}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </GlassInputWrapper>
              {password && (
                <div className="space-y-2 mt-2">
                  <div className="flex space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <div
                        key={i}
                        className={`h-1 w-full rounded ${
                          i < passwordStrength
                            ? passwordStrength <= 2 ? 'bg-red-500' 
                              : passwordStrength <= 3 ? 'bg-yellow-500'
                              : 'bg-green-500'
                            : 'bg-muted'
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {passwordStrength <= 2 && 'Zwak wachtwoord'}
                    {passwordStrength === 3 && 'Redelijk wachtwoord'}
                    {passwordStrength >= 4 && 'Sterk wachtwoord'}
                  </p>
                </div>
              )}
              {errors.password && <p className="text-sm text-red-500 mt-1">{errors.password}</p>}
            </div>

            {/* Confirm Password */}
            <div className="animate-element animate-delay-600">
              <label className="text-sm font-medium text-muted-foreground mb-2 block">Bevestig wachtwoord</label>
              <GlassInputWrapper>
                <div className="relative">
                  <Input
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    className="pr-12 bg-transparent border-0 focus-visible:ring-0"
                    value={confirmPassword}
                    onChange={(e) => onConfirmPasswordChange(e.target.value)}
                    disabled={isSubmitting}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </GlassInputWrapper>
              {errors.confirmPassword && <p className="text-sm text-red-500 mt-1">{errors.confirmPassword}</p>}
            </div>

            {/* Age Confirmation */}
            <div className="animate-element animate-delay-700 flex items-start space-x-3">
              <Checkbox
                id="ageConfirmed"
                checked={ageConfirmed}
                onCheckedChange={onAgeConfirmedChange}
                disabled={isSubmitting}
                className="mt-0.5"
              />
              <label htmlFor="ageConfirmed" className="text-sm text-foreground/90 cursor-pointer leading-tight">
                Ik bevestig dat ik 18 jaar of ouder ben
              </label>
            </div>
            {errors.ageConfirmed && <p className="text-sm text-red-500">{errors.ageConfirmed}</p>}

            {/* Terms Acceptance */}
            <div className="animate-element animate-delay-800 flex items-start space-x-3">
              <Checkbox
                id="termsAccepted"
                checked={termsAccepted}
                onCheckedChange={onTermsAcceptedChange}
                disabled={isSubmitting}
                className="mt-0.5"
              />
              <label htmlFor="termsAccepted" className="text-sm text-foreground/90 cursor-pointer leading-tight">
                Ik ga akkoord met de{' '}
                <Link to="/terms" className="text-primary hover:underline">
                  gebruiksvoorwaarden
                </Link>{' '}
                en het{' '}
                <Link to="/privacy" className="text-primary hover:underline">
                  privacybeleid
                </Link>
              </label>
            </div>
            {errors.termsAccepted && <p className="text-sm text-red-500">{errors.termsAccepted}</p>}

            <Button 
              type="submit" 
              className="w-full animate-element animate-delay-900"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Account aanmaken...
                </>
              ) : (
                'Account aanmaken'
              )}
            </Button>
          </form>
          <p className="text-muted-foreground mt-4 text-sm text-center animate-element animate-delay-1000">
            Heb je al een account?{' '}
            <Link to="/login" className="text-primary hover:underline">
              Log hier in
            </Link>
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
      <span className="text-muted-foreground px-2 text-xs">REGISTREREN</span>
      <div className="bg-border h-px w-full" />
    </div>
  );
};

const GlassInputWrapper = ({ children }: { children: React.ReactNode }) => (
  <div className="rounded-2xl border border-border bg-foreground/5 backdrop-blur-sm transition-colors focus-within:border-primary/70 focus-within:bg-primary/10">
    {children}
  </div>
);
