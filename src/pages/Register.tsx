
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Eye, EyeOff, Loader2, CheckCircle, CalendarIcon, XCircle, User } from 'lucide-react';
import { format } from 'date-fns';
import { nl } from 'date-fns/locale';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form';
import { Checkbox } from '@/components/ui/checkbox';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

const registerSchema = z.object({
  username: z.string()
    .min(3, 'Gebruikersnaam moet minimaal 3 karakters bevatten')
    .max(20, 'Gebruikersnaam mag maximaal 20 karakters bevatten')
    .regex(/^[a-zA-Z0-9_-]+$/, 'Alleen letters, cijfers, - en _ zijn toegestaan'),
  email: z.string().email('Voer een geldig emailadres in'),
  password: z.string()
    .min(8, 'Wachtwoord moet minimaal 8 karakters bevatten')
    .regex(/(?=.*[a-z])/, 'Wachtwoord moet minimaal één kleine letter bevatten')
    .regex(/(?=.*[A-Z])/, 'Wachtwoord moet minimaal één hoofdletter bevatten')
    .regex(/(?=.*\d)/, 'Wachtwoord moet minimaal één cijfer bevatten'),
  confirmPassword: z.string(),
  birthDate: z.date({
    required_error: 'Geboortedatum is verplicht',
  }).refine((date) => {
    const today = new Date();
    // Prevent future dates
    if (date > today) {
      return false;
    }
    // Calculate exact age using same logic as backend
    let age = today.getFullYear() - date.getFullYear();
    const monthDiff = today.getMonth() - date.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < date.getDate())) {
      age--;
    }
    return age >= 18;
  }, 'Je moet minimaal 18 jaar oud zijn en mag geen toekomstige datum kiezen'),
  termsAccepted: z.boolean().refine(val => val === true, 'Je moet akkoord gaan met de gebruiksvoorwaarden'),
  ageConfirmed: z.boolean().refine(val => val === true, 'Je moet bevestigen dat je 18+ bent'),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Wachtwoorden komen niet overeen',
  path: ['confirmPassword'],
});

type RegisterFormData = z.infer<typeof registerSchema>;

export default function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const [usernameAvailable, setUsernameAvailable] = useState<boolean | null>(null);
  const { register: registerUser, isLoading: authLoading } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const form = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
      birthDate: undefined,
      termsAccepted: false,
      ageConfirmed: false,
    },
  });

  const watchPassword = form.watch('password');
  const getPasswordStrength = (password: string) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/(?=.*[a-z])/.test(password)) strength++;
    if (/(?=.*[A-Z])/.test(password)) strength++;
    if (/(?=.*\d)/.test(password)) strength++;
    if (/(?=.*[!@#$%^&*])/.test(password)) strength++;
    return strength;
  };

  const passwordStrength = getPasswordStrength(watchPassword || '');

  // Check username availability
  const checkUsernameAvailability = async (username: string) => {
    if (username.length < 3) {
      setUsernameAvailable(null);
      return;
    }

    setIsCheckingUsername(true);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('username')
        .eq('username', username)
        .single();

      setUsernameAvailable(!data);
    } catch (error) {
      setUsernameAvailable(true); // Assume available if error checking
    } finally {
      setIsCheckingUsername(false);
    }
  };

  const onSubmit = async (data: RegisterFormData) => {
    // Check username availability one more time
    if (usernameAvailable === false) {
      toast({
        title: 'Gebruikersnaam niet beschikbaar',
        description: 'Deze gebruikersnaam is al in gebruik. Kies een andere.',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const success = await registerUser({
        username: data.username,
        email: data.email,
        password: data.password,
        birthDate: data.birthDate.toISOString().split('T')[0],
      });
      
      if (success) {
        // Show success state and redirect to login with instructions
        toast({
          title: 'Account aangemaakt! 📧',
          description: 'Check je e-mail voor de bevestigingslink. Na bevestiging kun je inloggen.',
        });
        
        // Wait a moment to show the toast, then redirect to login
        setTimeout(() => {
          navigate('/login', { 
            state: { 
              message: 'Account aangemaakt! Check je e-mail voor de bevestigingslink voordat je inlogt.',
              email: data.email 
            }
          });
        }, 2000);
      } else {
        toast({
          title: 'Registratie mislukt',
          description: 'Er is een fout opgetreden tijdens de registratie.',
          variant: 'destructive',
        });
      }
    } catch (error: any) {
      let errorMessage = 'Er is een onverwachte fout opgetreden.';
      
      if (error?.message?.includes('email')) {
        errorMessage = 'Dit e-mailadres is al in gebruik.';
      } else if (error?.message?.includes('username')) {
        errorMessage = 'Deze gebruikersnaam is al in gebruik.';
      } else if (error?.message?.includes('password')) {
        errorMessage = 'Het wachtwoord voldoet niet aan de eisen.';
      } else if (error?.message?.includes('age') || error?.message?.includes('18')) {
        errorMessage = 'Je moet minimaal 18 jaar oud zijn om te registreren.';
      }

      toast({
        title: 'Registratie mislukt',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-3 sm:p-4">
      <div className="w-full max-w-md space-y-4 sm:space-y-6">
        <div className="text-center">
          <h1 className="text-2xl sm:text-3xl font-bold text-primary">Wiet Forum België</h1>
          <p className="text-muted-foreground text-sm sm:text-base mt-2">Word lid van onze cannabis community</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Account aanmaken</CardTitle>
            <CardDescription>
              Maak een account aan om deel te nemen aan discussies over cannabis in België.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Gebruikersnaam</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            placeholder="jouwgebruikersnaam"
                            {...field}
                            onChange={(e) => {
                              field.onChange(e);
                              checkUsernameAvailability(e.target.value);
                            }}
                            disabled={isSubmitting}
                          />
                          {isCheckingUsername && (
                            <div className="absolute right-3 top-1/2 -translate-y-1/2">
                              <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                            </div>
                          )}
                          {!isCheckingUsername && field.value.length >= 3 && usernameAvailable !== null && (
                            <div className="absolute right-3 top-1/2 -translate-y-1/2">
                              {usernameAvailable ? (
                                <CheckCircle className="h-4 w-4 text-green-500" />
                              ) : (
                                <XCircle className="h-4 w-4 text-red-500" />
                              )}
                            </div>
                          )}
                        </div>
                      </FormControl>
                      <FormDescription>
                        3-20 karakters, alleen letters, cijfers, - en _
                      </FormDescription>
                      {!isCheckingUsername && field.value.length >= 3 && usernameAvailable !== null && (
                        <p className={`text-sm ${usernameAvailable ? 'text-green-600' : 'text-red-600'}`}>
                          {usernameAvailable ? 'Gebruikersnaam is beschikbaar' : 'Gebruikersnaam is niet beschikbaar'}
                        </p>
                      )}
                      <FormMessage />
                    </FormItem>
                  )}
                />

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
                          disabled={isSubmitting}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                 <FormField
                   control={form.control}
                   name="birthDate"
                   render={({ field }) => (
                     <FormItem className="flex flex-col">
                       <FormLabel>Geboortedatum</FormLabel>
                       <Popover>
                         <PopoverTrigger asChild>
                           <FormControl>
                             <Button
                               variant="outline"
                               className={cn(
                                 "w-full pl-3 text-left font-normal",
                                 !field.value && "text-muted-foreground"
                               )}
                               disabled={isSubmitting}
                               aria-label="Selecteer geboortedatum"
                             >
                               {field.value ? (
                                 format(field.value, "PPP", { locale: nl })
                               ) : (
                                 <span>Selecteer je geboortedatum</span>
                               )}
                               <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                             </Button>
                           </FormControl>
                         </PopoverTrigger>
                         <PopoverContent className="w-auto p-0" align="start">
                           <Calendar
                             mode="single"
                             selected={field.value}
                             onSelect={field.onChange}
                             disabled={(date) =>
                               date > new Date() || date < new Date("1900-01-01")
                             }
                             initialFocus
                             className={cn("p-3 pointer-events-auto")}
                             captionLayout="dropdown"
                             fromYear={1900}
                             toYear={new Date().getFullYear()}
                             locale={nl}
                             aria-label="Kalender voor geboortedatum selectie"
                           />
                         </PopoverContent>
                       </Popover>
                       <FormDescription>
                         Je moet 18+ zijn om een account aan te maken
                       </FormDescription>
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
                            disabled={isSubmitting}
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
                      {watchPassword && (
                        <div className="space-y-2">
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
                          <div className="text-xs text-muted-foreground">
                            {passwordStrength <= 2 && 'Zwak wachtwoord'}
                            {passwordStrength === 3 && 'Redelijk wachtwoord'}
                            {passwordStrength >= 4 && 'Sterk wachtwoord'}
                          </div>
                        </div>
                      )}
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Bevestig wachtwoord</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type={showConfirmPassword ? 'text' : 'password'}
                            placeholder="••••••••"
                            {...field}
                            disabled={isSubmitting}
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          >
                            {showConfirmPassword ? (
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

                <FormField
                  control={form.control}
                  name="ageConfirmed"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>
                          Ik bevestig dat ik 18 jaar of ouder ben
                        </FormLabel>
                        <FormDescription>
                          Dit platform is alleen toegankelijk voor volwassenen
                        </FormDescription>
                        <FormMessage />
                      </div>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="termsAccepted"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>
                          Ik ga akkoord met de{' '}
                          <Link to="/terms" className="text-primary hover:underline">
                            gebruiksvoorwaarden
                          </Link>{' '}
                          en het{' '}
                          <Link to="/privacy" className="text-primary hover:underline">
                            privacybeleid
                          </Link>
                        </FormLabel>
                        <FormMessage />
                      </div>
                    </FormItem>
                  )}
                />

                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={usernameAvailable === false}
                >
                  Account aanmaken
                </Button>
              </form>
            </Form>

            <div className="mt-6 text-center text-sm">
              <span className="text-muted-foreground">Al een account? </span>
              <Link to="/login" className="text-primary hover:underline font-medium">
                Log hier in
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
