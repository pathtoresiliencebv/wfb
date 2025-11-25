import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { Webhook } from 'https://esm.sh/standardwebhooks@1.0.0';
import { Resend } from 'npm:resend@4.0.0';

const resend = new Resend(Deno.env.get('RESEND_API_KEY') as string);
const hookSecret = Deno.env.get('AUTH_HOOK_SECRET') as string;

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const logoUrl = 'https://yopswdnayrogadtxpwzm.supabase.co/storage/v1/object/public/assets/wietforum-logo-main.png';
const primaryColor = '#3a4f00';
const textColor = '#344154';

const createEmailTemplate = (content: string) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #fefefe;">
  <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
    <img src="${logoUrl}" alt="WietForum België" style="width: 180px; margin-bottom: 32px;">
    ${content}
    <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 32px 0;">
    <p style="color: #9ca3af; font-size: 12px; text-align: center;">
      © 2025 WietForum België - De #1 Cannabis Community
    </p>
  </div>
</body>
</html>`;

const passwordResetEmail = (resetLink: string) => createEmailTemplate(`
  <h1 style="color: ${textColor}; font-size: 24px; margin-bottom: 16px;">Wachtwoord Resetten</h1>
  <p style="color: ${textColor}; font-size: 16px; line-height: 24px; margin-bottom: 24px;">
    Je hebt een wachtwoord reset aangevraagd voor je WietForum België account. Klik op de onderstaande knop om een nieuw wachtwoord in te stellen:
  </p>
  <a href="${resetLink}" style="display: inline-block; background-color: ${primaryColor}; color: white; padding: 12px 32px; text-decoration: none; border-radius: 6px; font-weight: 600; margin-bottom: 24px;">
    Reset Wachtwoord
  </a>
  <p style="color: #6b7280; font-size: 14px; line-height: 20px; margin-top: 24px;">
    Deze link is 1 uur geldig. Als je geen wachtwoord reset hebt aangevraagd, kun je deze email negeren.
  </p>
`);

const verificationEmail = (username: string, verificationLink: string) => createEmailTemplate(`
  <h1 style="color: ${textColor}; font-size: 24px; margin-bottom: 16px;">Welkom ${username}! 🌿</h1>
  <p style="color: ${textColor}; font-size: 16px; line-height: 24px; margin-bottom: 24px;">
    Bedankt voor je registratie bij WietForum België! Verifieer je email om toegang te krijgen tot de community:
  </p>
  <a href="${verificationLink}" style="display: inline-block; background-color: ${primaryColor}; color: white; padding: 12px 32px; text-decoration: none; border-radius: 6px; font-weight: 600; margin-bottom: 32px;">
    Verifieer Email
  </a>
  <div style="background-color: #f9fafb; padding: 20px; border-radius: 8px; margin-bottom: 24px;">
    <h2 style="color: ${textColor}; font-size: 16px; margin: 0 0 12px 0;">Wat kun je verwachten?</h2>
    <ul style="color: ${textColor}; font-size: 14px; line-height: 22px; margin: 0; padding-left: 20px;">
      <li>Exclusieve discussies over cannabis</li>
      <li>Vraag en antwoord met experts</li>
      <li>Laatste nieuws over wetgeving</li>
      <li>Betrouwbare suppliers vinden</li>
    </ul>
  </div>
  <p style="color: #6b7280; font-size: 14px; line-height: 20px;">
    Deze link is 24 uur geldig.
  </p>
`);

const magicLinkEmail = (username: string, magicLink: string) => createEmailTemplate(`
  <h1 style="color: ${textColor}; font-size: 24px; margin-bottom: 16px;">Hey ${username}! 👋</h1>
  <p style="color: ${textColor}; font-size: 16px; line-height: 24px; margin-bottom: 24px;">
    Welkom terug bij WietForum België! Klik op de onderstaande knop om in te loggen:
  </p>
  <a href="${magicLink}" style="display: inline-block; background-color: ${primaryColor}; color: white; padding: 12px 32px; text-decoration: none; border-radius: 6px; font-weight: 600; margin-bottom: 24px;">
    Inloggen
  </a>
`);

serve(async (req) => {
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

    if (email_action_type === 'recovery' || email_action_type === 'reauthenticate') {
      const resetLink = `${Deno.env.get('SUPABASE_URL')}/auth/v1/verify?token=${email_data.token_hash}&type=recovery&redirect_to=${email_data.redirect_to || 'https://wietforumbelgie.com'}`;
      html = passwordResetEmail(resetLink);
      subject = 'Reset je WietForum België wachtwoord';
      
    } else if (email_action_type === 'signup' || email_action_type === 'invite') {
      const verificationLink = `${Deno.env.get('SUPABASE_URL')}/auth/v1/verify?token=${email_data.token_hash}&type=signup&redirect_to=${email_data.redirect_to || 'https://wietforumbelgie.com'}`;
      const username = user.user_metadata?.username || user.email.split('@')[0];
      html = verificationEmail(username, verificationLink);
      subject = 'Verifieer je WietForum België email';
      
    } else if (email_action_type === 'magic_link') {
      const magicLink = `${Deno.env.get('SUPABASE_URL')}/auth/v1/verify?token=${email_data.token_hash}&type=magiclink&redirect_to=${email_data.redirect_to || 'https://wietforumbelgie.com'}`;
      const username = user.user_metadata?.username || user.email.split('@')[0];
      html = magicLinkEmail(username, magicLink);
      subject = 'Log in bij WietForum België';
      
    } else {
      console.warn('Unknown email action type:', email_action_type);
      return new Response(
        JSON.stringify({ error: 'Unknown email action type' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Sending email to:', user.email);

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
