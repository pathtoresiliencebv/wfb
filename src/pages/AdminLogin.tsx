import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Eye, EyeOff, Loader2, AlertCircle, Shield, Crown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';
import { useServerSideRateLimit } from '@/hooks/useServerSideRateLimit';
import { useAuditLog } from '@/hooks/useAuditLog';
import { validateEmail } from '@/lib/security';
import { TwoFactorModal } from '@/components/auth/TwoFactorModal';
import { use2FA } from '@/hooks/use2FA';

const adminLoginSchema = z.object({
  email: z.string().email('Voer een geldig admin emailadres in'),
  password: z.string().min(6, 'Wachtwoord moet minimaal 6 karakters bevatten'),
});

type AdminLoginFormData = z.infer<typeof adminLoginSchema>;

export default function AdminLogin() {
  const [showPassword, setShowPassword] = useState(false);
  const [show2FAModal, setShow2FAModal] = useState(false);
  const [pendingLogin, setPendingLogin] = useState<{email: string, password: string} | null>(null);
  const { login, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();
  
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

  const form = useForm<AdminLoginFormData>({
    resolver: zodResolver(adminLoginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: AdminLoginFormData) => {
    const email = data.email.toLowerCase().trim();
    
    // Validate email format
    if (!validateEmail(email)) {
      toast({
        variant: "destructive",
        title: "Ongeldig admin e-mailadres",
        description: "Voer een geldig admin e-mailadres in.",
      });
      return;
    }
    
    // Check rate limit
    if (rateLimitInfo?.locked) {
      const remainingTime = getRemainingLockoutTime(rateLimitInfo.locked_until);
      const minutes = Math.ceil(remainingTime / (1000 * 60));
      
      toast({
        variant: "destructive",
        title: "Admin account vergrendeld",
        description: `Je admin account is vergrendeld vanwege te veel mislukte inlogpogingen. Probeer het over ${minutes} minuten opnieuw.`,
      });
      return;
    }

    setIsLoading(true);
    
    try {
      // First, try basic authentication
      const loginSuccess = await login(email, data.password);
      
      if (loginSuccess) {
        // Check if user has 2FA enabled
        const twoFAStatus = await get2FAStatus();
        
        if (twoFAStatus?.is_enabled) {
          // Store pending login data and show 2FA modal
          setPendingLogin({ email, password: data.password });
          setShow2FAModal(true);
          setIsLoading(false);
          return;
        }
        
        // No 2FA required, complete login
        await recordSuccessfulLogin(email);
        setRateLimitInfo(null);
        logSecurityEvent('admin_login_success', { email });
        
        toast({
          title: "Admin toegang verleend",
          description: "Welkom in het admin dashboard.",
        });
        
        // Always redirect to admin dashboard
        navigate('/admin', { replace: true });
      }
    } catch (error) {
      // Record failed attempt and check rate limit
      const rateLimitResult = await recordFailedAttempt(email);
      setRateLimitInfo(rateLimitResult);
      
      // Log failed admin login attempt
      logSecurityEvent('admin_login_failed', { email, error: error instanceof Error ? error.message : 'Unknown error' });
      
      if (rateLimitResult?.locked) {
        toast({
          variant: "destructive",
          title: "Admin account vergrendeld",
          description: "Je admin account is vergrendeld vanwege te veel mislukte inlogpogingen. Probeer het over 15 minuten opnieuw.",
        });
      } else if (rateLimitResult) {
        toast({
          variant: "destructive",
          title: "Admin inloggen mislukt",
          description: `Ongeldige admin inloggegevens. Je hebt nog ${rateLimitResult.remaining_attempts} pogingen over.`,
        });
      } else {
        toast({
          variant: "destructive",
          title: "Admin inloggen mislukt",
          description: "Ongeldige admin inloggegevens.",
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
      logSecurityEvent('admin_login_success', { email: pendingLogin.email, twofa_verified: true });
      
      toast({
        title: "Admin toegang verleend",
        description: "Welkom in het admin dashboard.",
      });
      
      navigate('/admin', { replace: true });
    } else {
      // 2FA failed, logout the user
      await recordFailedAttempt(pendingLogin?.email || '');
      logSecurityEvent('admin_login_failed', { email: pendingLogin?.email, error: '2FA verification failed' });
      
      toast({
        variant: "destructive",
        title: "Admin 2FA verificatie mislukt",
        description: "Admin toegang geweigerd.",
      });
    }
    
    setPendingLogin(null);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 via-background to-secondary/10 p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <div className="flex items-center justify-center mb-4">
            <div className="relative">
              <Shield className="h-16 w-16 text-primary" />
              <Crown className="h-6 w-6 text-yellow-500 absolute -top-2 -right-2" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-primary">Admin Portal</h1>
          <p className="text-muted-foreground mt-2">Wiet Forum België - Beheerder Toegang</p>
          <Badge variant="secondary" className="mt-2">
            <Shield className="h-3 w-3 mr-1" />
            Beveiligde Admin Zone
          </Badge>
        </div>

        <Card className="border-primary/20 shadow-lg">
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              Admin Inloggen
            </CardTitle>
            <CardDescription>
              Toegang alleen voor beheerders en moderators
            </CardDescription>
          </CardHeader>
          <CardContent>
            {rateLimitInfo?.locked && (
              <Alert className="mb-4 border-destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Je admin account is vergrendeld vanwege te veel mislukte inlogpogingen. 
                  Probeer het over {Math.ceil(getRemainingLockoutTime(rateLimitInfo.locked_until) / (1000 * 60))} minuten opnieuw.
                </AlertDescription>
              </Alert>
            )}

            {rateLimitInfo && !rateLimitInfo.locked && rateLimitInfo.remaining_attempts < 5 && (
              <Alert className="mb-4 border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-950">
                <AlertCircle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                <AlertDescription className="text-amber-800 dark:text-amber-200">
                  Je hebt nog {rateLimitInfo.remaining_attempts} admin inlogpogingen over voordat je account wordt vergrendeld.
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
                      <FormLabel>Admin Email</FormLabel>
                       <FormControl>
                         <Input
                           type="email"
                           placeholder="admin@wietforumbelgie.com"
                           {...field}
                           className="border-primary/20 focus:border-primary"
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
                      <FormLabel>Admin Wachtwoord</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type={showPassword ? 'text' : 'password'}
                            placeholder="••••••••"
                            {...field}
                            className="border-primary/20 focus:border-primary"
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

                <Button 
                  type="submit" 
                  className="w-full bg-primary hover:bg-primary/90" 
                  disabled={isLoading || rateLimitInfo?.locked}
                >
                  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  <Shield className="mr-2 h-4 w-4" />
                  {isLoading ? 'Admin toegang controleren...' : 'Admin Toegang'}
                </Button>
              </form>
            </Form>

            <div className="mt-6 text-center text-sm">
              <span className="text-muted-foreground">Geen admin account? </span>
              <Link to="/" className="text-primary hover:underline font-medium">
                Ga naar hoofdpagina
              </Link>
            </div>

            <div className="mt-4 text-center">
              <Link to="/login" className="text-sm text-muted-foreground hover:text-primary">
                Gewone gebruiker inloggen
              </Link>
            </div>
          </CardContent>
        </Card>

        <TwoFactorModal
          isOpen={show2FAModal}
          onComplete={handle2FAComplete}
          userEmail={pendingLogin?.email || ''}
        />

        <div className="text-center text-sm text-muted-foreground">
          <p className="flex items-center justify-center gap-1">
            <Shield className="h-3 w-3" />
            Beveiligde admin toegang voor Wiet Forum België
          </p>
        </div>
      </div>
    </div>
  );
}