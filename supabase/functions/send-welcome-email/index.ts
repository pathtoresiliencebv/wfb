import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';
import { Resend } from 'npm:resend@4.0.0';
import { renderAsync } from 'npm:@react-email/components@0.0.22';
import React from 'npm:react@18.3.1';
import { WelcomeEmail } from '../_shared/email-templates/welcome.tsx';

const resend = new Resend(Deno.env.get('RESEND_API_KEY') as string);

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
    const { email, username } = await req.json();
    
    if (!email || !username) {
      throw new Error('Email and username are required');
    }

    console.log('Sending welcome email to:', email);

    // Render the React Email template
    const html = await renderAsync(
      React.createElement(WelcomeEmail, {
        username,
        dashboardUrl: 'https://wietforumbelgie.com',
      })
    );

    console.log('Rendered welcome email template');

    // Send email via Resend
    const { data: emailData, error: emailError } = await resend.emails.send({
      from: 'WietForum België <noreply@wietforumbelgie.com>',
      to: [email],
      subject: 'Welkom bij WietForum België! 🎉',
      html,
    });

    if (emailError) {
      console.error('Resend error:', emailError);
      throw emailError;
    }

    console.log('Welcome email sent successfully:', emailData);

    return new Response(
      JSON.stringify({ success: true, messageId: emailData?.id }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in send-welcome-email function:', error);
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
