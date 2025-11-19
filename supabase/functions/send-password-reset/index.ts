import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { Webhook } from 'https://esm.sh/standardwebhooks@1.0.0';
import { Resend } from 'npm:resend@4.0.0';
import { renderAsync } from 'npm:@react-email/components@0.0.22';
import React from 'npm:react@18.3.1';
import { PasswordResetEmail } from '../_shared/email-templates/password-reset.tsx';

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
    
    console.log('Received password reset request');
    
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

    // Build the password reset link
    const resetLink = `${Deno.env.get('SUPABASE_URL')}/auth/v1/verify?token=${email_data.token_hash}&type=recovery&redirect_to=${email_data.redirect_to || 'https://wietforumbelgie.com'}`;

    console.log('Rendering email template for:', user.email);

    // Render the React Email template
    const html = await renderAsync(
      React.createElement(PasswordResetEmail, {
        resetLink,
        expiryMinutes: 60,
      })
    );

    console.log('Sending password reset email...');

    // Send email via Resend
    const { data: emailData, error: emailError } = await resend.emails.send({
      from: 'WietForum België <noreply@wietforumbelgie.com>',
      to: [user.email],
      subject: 'Reset je WietForum België wachtwoord',
      html,
    });

    if (emailError) {
      console.error('Resend error:', emailError);
      throw emailError;
    }

    console.log('Password reset email sent successfully:', emailData);

    return new Response(
      JSON.stringify({ success: true, messageId: emailData?.id }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in send-password-reset function:', error);
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
