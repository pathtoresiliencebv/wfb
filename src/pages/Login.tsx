
import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Eye, EyeOff, Loader2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';
import { useServerSideRateLimit } from '@/hooks/useServerSideRateLimit';
import { useAuditLog } from '@/hooks/useAuditLog';
import { validateEmail } from '@/lib/security';

const loginSchema = z.object({
  email: z.string().email('Voer een geldig emailadres in'),
  password: z.string().min(6, 'Wachtwoord moet minimaal 6 karakters bevatten'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const [rateLimitInfo, setRateLimitInfo] = useState<{
    locked: boolean;
    remaining_attempts: number;
    locked_until?: string;
  } | null>(null);
  
  const { 
    isLoading: rateLimitLoading,
    recordFailedAttempt, 
    recordSuccessfulLogin,
    getRemainingLockoutTime 
  } = useServerSideRateLimit();
  const { logSecurityEvent } = useAuditLog();
  
  const from = location.state?.from?.pathname || '/';

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    const email = data.email.toLowerCase().trim();
    
    // Validate email format
    if (!validateEmail(email)) {
      toast({
        variant: "destructive",
        title: "Ongeldig e-mailadres",
        description: "Voer een geldig e-mailadres in.",
      });
      return;
    }
    
    // Check rate limit
    if (rateLimitInfo?.locked) {
      const remainingTime = getRemainingLockoutTime(rateLimitInfo.locked_until);
      const minutes = Math.ceil(remainingTime / (1000 * 60));
      
      toast({
        variant: "destructive",
        title: "Account vergrendeld",
        description: `Je account is vergrendeld vanwege te veel mislukte inlogpogingen. Probeer het over ${minutes} minuten opnieuw.`,
      });
      return;
    }

    setIsLoading(true);
    
    try {
      await login(email, data.password);
      
      // Record successful login for rate limiting
      await recordSuccessfulLogin(email);
      setRateLimitInfo(null);
      
      // Log successful login
      logSecurityEvent('login_success', { email });
      
      toast({
        title: "Welkom terug!",
        description: "Je bent succesvol ingelogd.",
      });
      
      navigate(from, { replace: true });
    } catch (error) {
      // Record failed attempt and check rate limit
      const rateLimitResult = await recordFailedAttempt(email);
      setRateLimitInfo(rateLimitResult);
      
      // Log failed login attempt
      logSecurityEvent('login_failed', { email, error: error instanceof Error ? error.message : 'Unknown error' });
      
      if (rateLimitResult?.locked) {
        toast({
          variant: "destructive",
          title: "Account vergrendeld",
          description: "Je account is vergrendeld vanwege te veel mislukte inlogpogingen. Probeer het over 15 minuten opnieuw.",
        });
      } else if (rateLimitResult) {
        toast({
          variant: "destructive",
          title: "Inloggen mislukt",
          description: `Ongeldige inloggegevens. Je hebt nog ${rateLimitResult.remaining_attempts} pogingen over.`,
        });
      } else {
        toast({
          variant: "destructive",
          title: "Inloggen mislukt",
          description: "Ongeldige inloggegevens.",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-primary">Wietforum België</h1>
          <p className="text-muted-foreground mt-2">Cannabis community voor België</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Inloggen</CardTitle>
            <CardDescription>
              Welkom terug! Log in om deel te nemen aan de discussies.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {rateLimitInfo?.locked && (
              <Alert className="mb-4 border-destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Je account is vergrendeld vanwege te veel mislukte inlogpogingen. 
                  Probeer het over {Math.ceil(getRemainingLockoutTime(rateLimitInfo.locked_until) / (1000 * 60))} minuten opnieuw.
                </AlertDescription>
              </Alert>
            )}

            {rateLimitInfo && !rateLimitInfo.locked && rateLimitInfo.remaining_attempts < 5 && (
              <Alert className="mb-4 border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-950">
                <AlertCircle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                <AlertDescription className="text-amber-800 dark:text-amber-200">
                  Je hebt nog {rateLimitInfo.remaining_attempts} inlogpogingen over voordat je account wordt vergrendeld.
                </AlertDescription>
              </Alert>
            )}
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="je@email.com"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Wachtwoord</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type={showPassword ? 'text' : 'password'}
                            placeholder="••••••••"
                            {...field}
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" className="w-full" disabled={isLoading || rateLimitLoading || rateLimitInfo?.locked}>
                  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {isLoading ? 'Inloggen...' : 'Inloggen'}
                </Button>
              </form>
            </Form>

            <div className="mt-6 text-center text-sm">
              <span className="text-muted-foreground">Nog geen account? </span>
              <Link to="/register" className="text-primary hover:underline font-medium">
                Registreer hier
              </Link>
            </div>

            <div className="mt-4 text-center">
              <Link to="/password-reset" className="text-sm text-muted-foreground hover:text-primary">
                Wachtwoord vergeten?
              </Link>
            </div>
          </CardContent>
        </Card>

        <div className="text-center text-sm text-muted-foreground">
          <p>Door in te loggen ga je akkoord met onze</p>
          <div className="space-x-2">
            <Link to="/terms" className="hover:text-primary">Gebruiksvoorwaarden</Link>
            <span>en</span>
            <Link to="/privacy" className="hover:text-primary">Privacybeleid</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
