import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { Webhook } from 'https://esm.sh/standardwebhooks@1.0.0';
import { Resend } from 'npm:resend@4.0.0';
import { renderAsync } from 'npm:@react-email/components@0.0.22';
import React from 'npm:react@18.3.1';
import { PasswordResetEmail } from '../_shared/email-templates/password-reset.tsx';
import { EmailVerificationEmail } from '../_shared/email-templates/email-verification.tsx';
import { WelcomeEmail } from '../_shared/email-templates/welcome.tsx';

const resend = new Resend(Deno.env.get('RESEND_API_KEY') as string);
const hookSecret = Deno.env.get('AUTH_HOOK_SECRET') as string;

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405, headers: corsHeaders });
  }

  try {
    const payload = await req.text();
    const headers = Object.fromEntries(req.headers);
    
    console.log('Received auth email request');
    
    // Verify webhook signature if secret is configured
    if (hookSecret) {
      const wh = new Webhook(hookSecret);
      try {
        wh.verify(payload, headers);
      } catch (error) {
        console.error('Webhook verification failed:', error);
        return new Response(
          JSON.stringify({ error: 'Invalid webhook signature' }),
          { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
    }

    const data = JSON.parse(payload);
    const { user, email_data } = data;
    
    if (!user?.email) {
      throw new Error('User email is required');
    }

    let html: string;
    let subject: string;
    const email_action_type = email_data.email_action_type;

    console.log('Email action type:', email_action_type);

    // Handle different email types
    if (email_action_type === 'recovery' || email_action_type === 'reauthenticate') {
      // Password Reset Email
      const resetLink = `${Deno.env.get('SUPABASE_URL')}/auth/v1/verify?token=${email_data.token_hash}&type=recovery&redirect_to=${email_data.redirect_to || 'https://wietforumbelgie.com'}`;
      
      html = await renderAsync(
        React.createElement(PasswordResetEmail, {
          resetLink,
          expiryMinutes: 60,
        })
      );
      subject = 'Reset je WietForum België wachtwoord';
      
    } else if (email_action_type === 'signup' || email_action_type === 'invite') {
      // Email Verification
      const verificationLink = `${Deno.env.get('SUPABASE_URL')}/auth/v1/verify?token=${email_data.token_hash}&type=signup&redirect_to=${email_data.redirect_to || 'https://wietforumbelgie.com'}`;
      const username = user.user_metadata?.username || user.email.split('@')[0];
      
      html = await renderAsync(
        React.createElement(EmailVerificationEmail, {
          username,
          verificationLink,
          verificationToken: email_data.token,
        })
      );
      subject = 'Verifieer je WietForum België email';
      
    } else if (email_action_type === 'magic_link') {
      // Magic Link Email (use welcome template for now)
      const magicLink = `${Deno.env.get('SUPABASE_URL')}/auth/v1/verify?token=${email_data.token_hash}&type=magiclink&redirect_to=${email_data.redirect_to || 'https://wietforumbelgie.com'}`;
      const username = user.user_metadata?.username || user.email.split('@')[0];
      
      html = await renderAsync(
        React.createElement(WelcomeEmail, {
          username,
          dashboardLink: magicLink,
        })
      );
      subject = 'Log in bij WietForum België';
      
    } else {
      // Fallback for unknown email types
      console.warn('Unknown email action type:', email_action_type);
      return new Response(
        JSON.stringify({ error: 'Unknown email action type' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Sending email to:', user.email);

    // Send email via Resend
    const { data: emailData, error: emailError } = await resend.emails.send({
      from: 'WietForum België <noreply@wietforumbelgie.com>',
      to: [user.email],
      subject,
      html,
    });

    if (emailError) {
      console.error('Resend error:', emailError);
      throw emailError;
    }

    console.log('Email sent successfully:', emailData);

    return new Response(
      JSON.stringify({ success: true, messageId: emailData?.id }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in send-auth-emails function:', error);
    return new Response(
      JSON.stringify({
        error: {
          message: error.message,
          code: error.code || 'internal_error',
        },
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
