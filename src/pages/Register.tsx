import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { ModernAuthPage } from '@/components/auth/ModernAuthPage';

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
    if (date > today) {
      return false;
    }
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
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const [usernameAvailable, setUsernameAvailable] = useState<boolean | null>(null);
  const { register: registerUser } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const { control, handleSubmit, watch, setValue, formState: { errors } } = useForm<RegisterFormData>({
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

  const username = watch('username');
  const email = watch('email');
  const password = watch('password');
  const confirmPassword = watch('confirmPassword');
  const birthDate = watch('birthDate');
  const ageConfirmed = watch('ageConfirmed');
  const termsAccepted = watch('termsAccepted');

  const checkUsernameAvailability = async (username: string) => {
    if (username.length < 3) {
      setUsernameAvailable(null);
      return;
    }

    setIsCheckingUsername(true);
    try {
      const { data } = await supabase
        .from('profiles')
        .select('username')
        .eq('username', username)
        .single();

      setUsernameAvailable(!data);
    } catch (error) {
      setUsernameAvailable(true);
    } finally {
      setIsCheckingUsername(false);
    }
  };

  const onSubmit = async (data: RegisterFormData) => {
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
        toast({
          title: 'Account aangemaakt! 📧',
          description: 'Check je e-mail voor de bevestigingslink. Na bevestiging kun je inloggen.',
        });
        
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
    <ModernAuthPage
      username={username}
      email={email}
      password={password}
      confirmPassword={confirmPassword}
      birthDate={birthDate}
      ageConfirmed={ageConfirmed}
      termsAccepted={termsAccepted}
      onUsernameChange={(value) => {
        setValue('username', value);
        checkUsernameAvailability(value);
      }}
      onEmailChange={(value) => setValue('email', value)}
      onPasswordChange={(value) => setValue('password', value)}
      onConfirmPasswordChange={(value) => setValue('confirmPassword', value)}
      onBirthDateChange={(date) => setValue('birthDate', date)}
      onAgeConfirmedChange={(checked) => setValue('ageConfirmed', checked)}
      onTermsAcceptedChange={(checked) => setValue('termsAccepted', checked)}
      onSubmit={handleSubmit(onSubmit)}
      isSubmitting={isSubmitting}
      isCheckingUsername={isCheckingUsername}
      usernameAvailable={usernameAvailable}
      errors={{
        username: errors.username?.message,
        email: errors.email?.message,
        password: errors.password?.message,
        confirmPassword: errors.confirmPassword?.message,
        birthDate: errors.birthDate?.message,
        ageConfirmed: errors.ageConfirmed?.message,
        termsAccepted: errors.termsAccepted?.message,
      }}
    />
  );
}
