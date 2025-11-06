import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Eye, EyeOff, Loader2, AlertCircle, Store, Leaf, User, Mail } from 'lucide-react';
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
import { use2FA } from '@/hooks/use2FA';

const supplierUsernameSchema = z.object({
  username: z.string().min(1, 'Voer je leverancier gebruikersnaam in'),
  password: z.string().min(6, 'Wachtwoord moet minimaal 6 karakters bevatten'),
});

const supplierEmailSchema = z.object({
  email: z.string().email('Voer een geldig leverancier e-mailadres in'),
  password: z.string().min(6, 'Wachtwoord moet minimaal 6 karakters bevatten'),
});

type SupplierUsernameFormData = z.infer<typeof supplierUsernameSchema>;
type SupplierEmailFormData = z.infer<typeof supplierEmailSchema>;

export default function SupplierLogin() {
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

  const usernameForm = useForm<SupplierUsernameFormData>({
    resolver: zodResolver(supplierUsernameSchema),
    defaultValues: {
      username: '',
      password: '',
    },
  });

  const emailForm = useForm<SupplierEmailFormData>({
    resolver: zodResolver(supplierEmailSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onUsernameSubmit = async (data: SupplierUsernameFormData) => {
    const emailOrUsername = data.username.toLowerCase().trim();
    await handleLogin(emailOrUsername, data.password);
  };

  const onEmailSubmit = async (data: SupplierEmailFormData) => {
    const emailOrUsername = data.email.toLowerCase().trim();
    
    if (!validateEmail(emailOrUsername)) {
      toast({
        variant: "destructive",
        title: "Ongeldig leverancier e-mailadres",
        description: "Voer een geldig leverancier e-mailadres in.",
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
        title: "Leverancier account vergrendeld",
        description: `Je leverancier account is vergrendeld vanwege te veel mislukte inlogpogingen. Probeer het over ${minutes} minuten opnieuw.`,
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
        logSecurityEvent('supplier_login_success', { email: emailOrUsername });
        
        toast({
          title: "Leverancier toegang verleend",
          description: "Welkom in je leverancier dashboard.",
        });
        
        // Always redirect to supplier dashboard
        navigate('/leverancier/dashboard', { replace: true });
      }
    } catch (error) {
      // Record failed attempt and check rate limit
      const rateLimitResult = await recordFailedAttempt(emailOrUsername);
      setRateLimitInfo(rateLimitResult);
      
      // Log failed supplier login attempt
      logSecurityEvent('supplier_login_failed', { email: emailOrUsername, error: error instanceof Error ? error.message : 'Unknown error' });
      
      if (rateLimitResult?.locked) {
        toast({
          variant: "destructive",
          title: "Leverancier account vergrendeld",
          description: "Je leverancier account is vergrendeld vanwege te veel mislukte inlogpogingen. Probeer het over 15 minuten opnieuw.",
        });
      } else if (rateLimitResult) {
        toast({
          variant: "destructive",
          title: "Leverancier inloggen mislukt",
          description: `Ongeldige leverancier inloggegevens. Je hebt nog ${rateLimitResult.remaining_attempts} pogingen over.`,
        });
      } else {
        toast({
          variant: "destructive",
          title: "Leverancier inloggen mislukt",
          description: "Ongeldige leverancier inloggegevens.",
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
      logSecurityEvent('supplier_login_success', { email: pendingLogin.email, twofa_verified: true });
      
      toast({
        title: "Leverancier toegang verleend",
        description: "Welkom in je leverancier dashboard.",
      });
      
      navigate('/leverancier/dashboard', { replace: true });
    } else {
      // 2FA failed, logout the user
      await recordFailedAttempt(pendingLogin?.email || '');
      logSecurityEvent('supplier_login_failed', { email: pendingLogin?.email, error: '2FA verification failed' });
      
      toast({
        variant: "destructive",
        title: "Leverancier 2FA verificatie mislukt",
        description: "Leverancier toegang geweigerd.",
      });
    }
    
    setPendingLogin(null);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-500/10 via-background to-emerald-500/10 p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <div className="flex items-center justify-center mb-4">
            <div className="relative">
              <Store className="h-16 w-16 text-green-600" />
              <Leaf className="h-6 w-6 text-green-500 absolute -top-2 -right-2" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-green-700 dark:text-green-400">Leverancier Portal</h1>
          <p className="text-muted-foreground mt-2">Wiet Forum België - Leverancier Toegang</p>
          <Badge variant="secondary" className="mt-2 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
            <Store className="h-3 w-3 mr-1" />
            Leverancier Zone
          </Badge>
        </div>

        <Card className="border-green-200 dark:border-green-800 shadow-lg">
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center gap-2 text-green-700 dark:text-green-400">
              <Store className="h-5 w-5" />
              Leverancier Inloggen
            </CardTitle>
            <CardDescription>
              Toegang voor cannabis leveranciers en shops
            </CardDescription>
          </CardHeader>
          <CardContent>
            {rateLimitInfo?.locked && (
              <Alert className="mb-4 border-destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Je leverancier account is vergrendeld vanwege te veel mislukte inlogpogingen. 
                  Probeer het over {Math.ceil(getRemainingLockoutTime(rateLimitInfo.locked_until) / (1000 * 60))} minuten opnieuw.
                </AlertDescription>
              </Alert>
            )}

            {rateLimitInfo && !rateLimitInfo.locked && rateLimitInfo.remaining_attempts < 5 && (
              <Alert className="mb-4 border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-950">
                <AlertCircle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                <AlertDescription className="text-amber-800 dark:text-amber-200">
                  Je hebt nog {rateLimitInfo.remaining_attempts} leverancier inlogpogingen over voordat je account wordt vergrendeld.
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
                          <FormLabel>Leverancier Gebruikersnaam</FormLabel>
                          <FormControl>
                            <Input
                              type="text"
                              placeholder="leverancier gebruikersnaam"
                              {...field}
                              className="border-green-200 dark:border-green-800 focus:border-green-500"
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
                          <FormLabel>Leverancier Wachtwoord</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Input
                                type={showPassword ? 'text' : 'password'}
                                placeholder="••••••••"
                                {...field}
                                className="border-green-200 dark:border-green-800 focus:border-green-500"
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
                      className="w-full bg-green-600 hover:bg-green-700 text-white" 
                      disabled={isLoading || rateLimitInfo?.locked}
                    >
                      {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      <Store className="mr-2 h-4 w-4" />
                      {isLoading ? 'Leverancier toegang controleren...' : 'Leverancier Toegang'}
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
                          <FormLabel>Leverancier E-mailadres</FormLabel>
                          <FormControl>
                            <Input
                              type="email"
                              placeholder="shop@cannabiswinkel.be"
                              {...field}
                              className="border-green-200 dark:border-green-800 focus:border-green-500"
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
                          <FormLabel>Leverancier Wachtwoord</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Input
                                type={showPassword ? 'text' : 'password'}
                                placeholder="••••••••"
                                {...field}
                                className="border-green-200 dark:border-green-800 focus:border-green-500"
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
                      className="w-full bg-green-600 hover:bg-green-700 text-white" 
                      disabled={isLoading || rateLimitInfo?.locked}
                    >
                      {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      <Store className="mr-2 h-4 w-4" />
                      {isLoading ? 'Leverancier toegang controleren...' : 'Leverancier Toegang'}
                    </Button>
                  </form>
                </Form>
              </TabsContent>
            </Tabs>

            <div className="mt-6 text-center text-sm space-y-2">
              <div>
                <span className="text-muted-foreground">Nog geen leverancier account? </span>
                <Link to="/" className="text-green-600 hover:underline font-medium">
                  Ga naar hoofdpagina
                </Link>
              </div>
              
              <div className="flex justify-center gap-4 text-sm text-muted-foreground">
                <Link to="/login" className="hover:text-green-600">
                  Gewone gebruiker
                </Link>
                <span>•</span>
                <Link to="/admin/login" className="hover:text-green-600">
                  Admin toegang
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

        <div className="text-center text-sm text-muted-foreground">
          <p className="flex items-center justify-center gap-1">
            <Leaf className="h-3 w-3 text-green-500" />
            Leverancier toegang voor Wiet Forum België
          </p>
        </div>
      </div>
    </div>
  );
}