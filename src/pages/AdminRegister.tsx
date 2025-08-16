import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Eye, EyeOff, Loader2, Shield, Crown, UserPlus, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

const adminRegisterSchema = z.object({
  email: z.string().email('Voer een geldig admin e-mailadres in'),
  password: z.string()
    .min(8, 'Wachtwoord moet minimaal 8 karakters bevatten')
    .regex(/(?=.*[a-z])/, 'Wachtwoord moet minimaal één kleine letter bevatten')
    .regex(/(?=.*[A-Z])/, 'Wachtwoord moet minimaal één hoofdletter bevatten')
    .regex(/(?=.*\d)/, 'Wachtwoord moet minimaal één cijfer bevatten'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Wachtwoorden komen niet overeen',
  path: ['confirmPassword'],
});

type AdminRegisterFormData = z.infer<typeof adminRegisterSchema>;

export default function AdminRegister() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const form = useForm<AdminRegisterFormData>({
    resolver: zodResolver(adminRegisterSchema),
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (data: AdminRegisterFormData) => {
    setIsSubmitting(true);
    
    try {
      // First create the user account
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          emailRedirectTo: `${window.location.origin}/admin/login`,
          data: {
            role: 'admin',
            username: `admin-${Date.now()}`,
          }
        }
      });

      if (authError) {
        throw authError;
      }

      if (authData.user) {
        // Create admin profile manually
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            user_id: authData.user.id,
            username: `admin-${Date.now()}`,
            display_name: 'Administrator',
            role: 'admin'
          });

        if (profileError) {
          console.error('Profile creation error:', profileError);
        }
      }

      toast({
        title: 'Admin account aangemaakt! 🎉',
        description: 'Check je e-mail voor de bevestigingslink. Na bevestiging kun je inloggen als admin.',
      });

      // Redirect to admin login after 2 seconds
      setTimeout(() => {
        navigate('/admin/login', { 
          state: { 
            message: 'Admin account aangemaakt! Check je e-mail voor de bevestigingslink voordat je inlogt.',
            email: data.email 
          }
        });
      }, 2000);

    } catch (error: any) {
      let errorMessage = 'Er is een fout opgetreden tijdens het aanmaken van het admin account.';
      
      if (error?.message?.includes('email')) {
        errorMessage = 'Dit e-mailadres is al in gebruik.';
      } else if (error?.message?.includes('password')) {
        errorMessage = 'Het wachtwoord voldoet niet aan de eisen.';
      }

      toast({
        title: 'Admin registratie mislukt',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
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
          <h1 className="text-3xl font-bold text-primary">Admin Registratie</h1>
          <p className="text-muted-foreground mt-2">Wiet Forum België - Nieuw Admin Account</p>
          <Badge variant="secondary" className="mt-2">
            <Shield className="h-3 w-3 mr-1" />
            Beveiligde Admin Zone
          </Badge>
        </div>

        <Alert className="border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-950">
          <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
          <AlertDescription className="text-amber-800 dark:text-amber-200">
            <strong>Let op:</strong> Dit account krijgt volledige admin rechten. Gebruik alleen voor betrouwbare beheerders.
          </AlertDescription>
        </Alert>

        <Card className="border-primary/20 shadow-lg">
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center gap-2">
              <UserPlus className="h-5 w-5 text-primary" />
              Nieuw Admin Account
            </CardTitle>
            <CardDescription>
              Maak een nieuw administrator account aan
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
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
                          disabled={isSubmitting}
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
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Bevestig Wachtwoord</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type={showConfirmPassword ? 'text' : 'password'}
                            placeholder="••••••••"
                            {...field}
                            className="border-primary/20 focus:border-primary"
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

                <Button 
                  type="submit" 
                  className="w-full bg-primary hover:bg-primary/90" 
                  disabled={isSubmitting}
                >
                  {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  <UserPlus className="mr-2 h-4 w-4" />
                  {isSubmitting ? 'Admin account aanmaken...' : 'Admin Account Aanmaken'}
                </Button>
              </form>
            </Form>

            <div className="mt-6 text-center text-sm">
              <span className="text-muted-foreground">Al een admin account? </span>
              <Link to="/admin/login" className="text-primary hover:underline font-medium">
                Admin inloggen
              </Link>
            </div>
          </CardContent>
        </Card>

        <div className="text-center text-sm text-muted-foreground">
          <p className="flex items-center justify-center gap-1">
            <Shield className="h-3 w-3" />
            Beveiligde admin registratie voor Wiet Forum België
          </p>
        </div>
      </div>
    </div>
  );
}