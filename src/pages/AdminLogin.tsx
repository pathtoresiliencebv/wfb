import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Eye, EyeOff, Loader2, AlertCircle, Shield, Crown, User, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';
import { useServerSideRateLimit } from '@/hooks/useServerSideRateLimit';
import { useAuditLog } from '@/hooks/useAuditLog';
import { validateEmail } from '@/lib/security';
import { TwoFactorModal } from '@/components/auth/TwoFactorModal';
import { TestCredentials } from '@/components/auth/TestCredentials';
import { use2FA } from '@/hooks/use2FA';

const adminUsernameSchema = z.object({
  username: z.string().min(1, 'Voer je admin gebruikersnaam in'),
  password: z.string().min(6, 'Wachtwoord moet minimaal 6 karakters bevatten'),
});

const adminEmailSchema = z.object({
  email: z.string().email('Voer een geldig admin e-mailadres in'),
  password: z.string().min(6, 'Wachtwoord moet minimaal 6 karakters bevatten'),
});

type AdminUsernameFormData = z.infer<typeof adminUsernameSchema>;
type AdminEmailFormData = z.infer<typeof adminEmailSchema>;

export default function AdminLogin() {
  const [showPassword, setShowPassword] = useState(false);
  const [loginMethod, setLoginMethod] = useState<'username' | 'email'>('username');
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

  const usernameForm = useForm<AdminUsernameFormData>({
    resolver: zodResolver(adminUsernameSchema),
    defaultValues: {
      username: '',
      password: '',
    },
  });

  const emailForm = useForm<AdminEmailFormData>({
    resolver: zodResolver(adminEmailSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onUsernameSubmit = async (data: AdminUsernameFormData) => {
    const emailOrUsername = data.username.toLowerCase().trim();
    await handleLogin(emailOrUsername, data.password);
  };

  const onEmailSubmit = async (data: AdminEmailFormData) => {
    const emailOrUsername = data.email.toLowerCase().trim();
    
    if (!validateEmail(emailOrUsername)) {
      toast({
        variant: "destructive",
        title: "Ongeldig admin e-mailadres",
        description: "Voer een geldig admin e-mailadres in.",
      });
      return;
    }
    
    await handleLogin(emailOrUsername, data.password);
  };

  const handleLogin = async (emailOrUsername: string, password: string) => {
    
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
      const loginSuccess = await login(emailOrUsername, password);
      
      if (loginSuccess) {
        // Check if user has 2FA enabled
        const twoFAStatus = await get2FAStatus();
        
        if (twoFAStatus?.is_enabled) {
          // Store pending login data and show 2FA modal
          setPendingLogin({ email: emailOrUsername, password });
          setShow2FAModal(true);
          setIsLoading(false);
          return;
        }
        
        // No 2FA required, complete login
        await recordSuccessfulLogin(emailOrUsername);
        setRateLimitInfo(null);
        logSecurityEvent('admin_login_success', { email: emailOrUsername });
        
        toast({
          title: "Admin toegang verleend",
          description: "Welkom in het admin dashboard.",
        });
        
        // Always redirect to admin dashboard
        navigate('/admin', { replace: true });
      }
    } catch (error) {
      // Record failed attempt and check rate limit
      const rateLimitResult = await recordFailedAttempt(emailOrUsername);
      setRateLimitInfo(rateLimitResult);
      
      // Log failed admin login attempt
      logSecurityEvent('admin_login_failed', { email: emailOrUsername, error: error instanceof Error ? error.message : 'Unknown error' });
      
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
            
            <Tabs value={loginMethod} onValueChange={(value) => setLoginMethod(value as 'username' | 'email')} className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="username" className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Gebruikersnaam
                </TabsTrigger>
                <TabsTrigger value="email" className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  E-mailadres
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="username" className="mt-4">
                <Form {...usernameForm}>
                  <form onSubmit={usernameForm.handleSubmit(onUsernameSubmit)} className="space-y-4">
                    <FormField
                      control={usernameForm.control}
                      name="username"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Admin Gebruikersnaam</FormLabel>
                          <FormControl>
                            <Input
                              type="text"
                              placeholder="admin gebruikersnaam"
                              {...field}
                              className="border-primary/20 focus:border-primary"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={usernameForm.control}
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
              </TabsContent>

              <TabsContent value="email" className="mt-4">
                <Form {...emailForm}>
                  <form onSubmit={emailForm.handleSubmit(onEmailSubmit)} className="space-y-4">
                    <FormField
                      control={emailForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Admin E-mailadres</FormLabel>
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
                      control={emailForm.control}
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
              </TabsContent>
            </Tabs>

            <div className="mt-6 text-center text-sm">
              <span className="text-muted-foreground">Geen admin account? </span>
              <Link to="/" className="text-primary hover:underline font-medium">
                Ga naar hoofdpagina
              </Link>
            </div>

            <div className="mt-4 text-center space-y-2">
              <div className="flex justify-center gap-4 text-sm text-muted-foreground">
                <Link to="/login" className="hover:text-primary">
                  Gewone gebruiker
                </Link>
                <span>•</span>
                <Link to="/supplier-login" className="hover:text-primary">
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
          <p className="flex items-center justify-center gap-1">
            <Shield className="h-3 w-3" />
            Beveiligde admin toegang voor Wiet Forum België
          </p>
        </div>
      </div>
    </div>
  );
}