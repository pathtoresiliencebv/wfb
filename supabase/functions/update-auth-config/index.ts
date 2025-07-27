import { serve } from "https://deno.land/std@0.190.0/http/server.ts"

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!

serve(async (req: Request) => {
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 })
  }

  try {
    const { redirectUrl } = await req.json()
    
    if (!redirectUrl) {
      return new Response('Missing redirectUrl', { status: 400 })
    }

    // Update auth settings to include production URL
    const authResponse = await fetch(
      `${SUPABASE_URL}/rest/v1/auth/settings`,
      {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
          'Content-Type': 'application/json',
          'apikey': SUPABASE_SERVICE_ROLE_KEY
        },
        body: JSON.stringify({
          SITE_URL: redirectUrl,
          ADDITIONAL_REDIRECT_URLS: [
            'http://localhost:3000',
            redirectUrl
          ].join(',')
        })
      }
    )

    if (!authResponse.ok) {
      console.error('Failed to update auth settings:', await authResponse.text())
      return new Response('Failed to update auth settings', { status: 500 })
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Auth configuration updated successfully',
        siteUrl: redirectUrl
      }),
      { 
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      }
    )

  } catch (error) {
    console.error('Error updating auth config:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    )
  }
})