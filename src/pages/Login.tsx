
import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Eye, EyeOff, Loader2, AlertCircle, Mail, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';
import { useServerSideRateLimit } from '@/hooks/useServerSideRateLimit';
import { useAuditLog } from '@/hooks/useAuditLog';
import { validateEmail } from '@/lib/security';
import { TwoFactorModal } from '@/components/auth/TwoFactorModal';
import { TestCredentials } from '@/components/auth/TestCredentials';
import { use2FA } from '@/hooks/use2FA';

const loginSchema = z.object({
  email: z.string().email('Voer een geldig e-mailadres in'),
  password: z.string().min(6, 'Wachtwoord moet minimaal 6 karakters bevatten'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [show2FAModal, setShow2FAModal] = useState(false);
  const [pendingLogin, setPendingLogin] = useState<{email: string, password: string} | null>(null);
  const { login, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Check for registration success message from state
  const registrationMessage = location.state?.message;
  const registrationEmail = location.state?.email;
  const [isLoading, setIsLoading] = useState(false);
  const [rateLimitInfo, setRateLimitInfo] = useState<{
    locked: boolean;
    remaining_attempts: number;
    locked_until?: string;
  } | null>(null);
  const { get2FAStatus } = use2FA();
  
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
    
    if (!validateEmail(email)) {
      toast({
        variant: "destructive",
        title: "Ongeldig e-mailadres",
        description: "Voer een geldig e-mailadres in.",
      });
      return;
    }
    
    await handleLogin(email, data.password);
  };

  const handleLogin = async (email: string, password: string) => {
    
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
      // First, try basic authentication
      const loginSuccess = await login(email, password);
      
      if (loginSuccess) {
        // Check if user has 2FA enabled
        const twoFAStatus = await get2FAStatus();
        
        if (twoFAStatus?.is_enabled) {
          // Store pending login data and show 2FA modal
          setPendingLogin({ email, password });
          setShow2FAModal(true);
          setIsLoading(false);
          return;
        }
        
        // No 2FA required, complete login
        await recordSuccessfulLogin(email);
        setRateLimitInfo(null);
        logSecurityEvent('login_success', { email });
        
        toast({
          title: "Welkom terug!",
          description: "Je bent succesvol ingelogd.",
        });
        
        navigate(from, { replace: true });
      }
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

  const handle2FAComplete = async (success: boolean) => {
    setShow2FAModal(false);
    
    if (success && pendingLogin) {
      // Complete the login process
      await recordSuccessfulLogin(pendingLogin.email);
      setRateLimitInfo(null);
      logSecurityEvent('login_success', { email: pendingLogin.email, twofa_verified: true });
      
      toast({
        title: "Welkom terug!",
        description: "Je bent succesvol ingelogd.",
      });
      
      navigate(from, { replace: true });
    } else {
      // 2FA failed, logout the user
      await recordFailedAttempt(pendingLogin?.email || '');
      logSecurityEvent('login_failed', { email: pendingLogin?.email, error: '2FA verification failed' });
      
      toast({
        variant: "destructive",
        title: "2FA verificatie mislukt",
        description: "Inloggen geannuleerd.",
      });
    }
    
    setPendingLogin(null);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-3 sm:p-4">
      <div className="w-full max-w-md space-y-4 sm:space-y-6">
        <div className="text-center">
          <h1 className="text-2xl sm:text-3xl font-bold text-primary">Wiet Forum België</h1>
          <p className="text-muted-foreground text-sm sm:text-base mt-2">Cannabis community voor België</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Inloggen</CardTitle>
            <CardDescription>
              Welkom terug! Log in om deel te nemen aan de discussies.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {registrationMessage && (
              <Alert className="mb-4 border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950">
                <Mail className="h-4 w-4 text-green-600 dark:text-green-400" />
                <AlertDescription className="text-green-800 dark:text-green-200">
                  {registrationMessage}
                </AlertDescription>
              </Alert>
            )}

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
                      <FormLabel>E-mailadres</FormLabel>
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

                <Button type="submit" className="w-full h-11 sm:h-10" disabled={isLoading || rateLimitInfo?.locked}>
                  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {isLoading ? 'Inloggen...' : 'Inloggen'}
                </Button>
              </form>
            </Form>

            <div className="mt-4 sm:mt-6 text-center text-sm">
              <span className="text-muted-foreground">Nog geen account? </span>
              <Link to="/register" className="text-primary hover:underline font-medium">
                Registreer hier
              </Link>
            </div>

            <div className="mt-4 space-y-2 text-center">
              <Link to="/password-reset" className="block text-sm text-muted-foreground hover:text-primary">
                Wachtwoord vergeten?
              </Link>
              
              <div className="flex flex-col sm:flex-row justify-center gap-2 sm:gap-4 text-sm text-muted-foreground">
                <Link to="/admin/login" className="hover:text-primary text-center">
                  Admin login
                </Link>
                <span className="hidden sm:inline">•</span>
                <Link to="/supplier-login" className="hover:text-primary text-center">
                  Leverancier login
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>

        <TwoFactorModal
          isOpen={show2FAModal}
          onComplete={handle2FAComplete}
          userEmail={pendingLogin?.email || ''}
        />

        <TestCredentials />

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
