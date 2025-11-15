import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    )

    console.log('Looking up admin user from profiles table...')
    
    // Query profiles table to find admin user_id
    // We know the email is admin@wietforumbelgie.com
    // First get the user_roles to find admin users
    const { data: adminRoles, error: rolesError } = await supabaseAdmin
      .from('user_roles')
      .select('user_id')
      .eq('role', 'admin')
    
    if (rolesError) {
      console.error('Error fetching admin roles:', rolesError)
      throw new Error(`Failed to fetch admin roles: ${rolesError.message}`)
    }

    if (!adminRoles || adminRoles.length === 0) {
      console.error('No admin users found in user_roles')
      throw new Error('No admin users found')
    }

    // Get the profiles for these admin users to find the one with the right email
    const { data: profiles, error: profilesError } = await supabaseAdmin
      .from('profiles')
      .select('user_id, username')
      .in('user_id', adminRoles.map(r => r.user_id))
    
    if (profilesError) {
      console.error('Error fetching profiles:', profilesError)
      throw new Error(`Failed to fetch profiles: ${profilesError.message}`)
    }

    // For each profile, get the auth user to find the one with admin@wietforumbelgie.com
    let adminUserId = null
    for (const profile of profiles || []) {
      const { data: authUser, error: authError } = await supabaseAdmin.auth.admin.getUserById(profile.user_id)
      if (!authError && authUser?.user?.email === 'admin@wietforumbelgie.com') {
        adminUserId = profile.user_id
        console.log('Found admin user:', adminUserId)
        break
      }
    }

    if (!adminUserId) {
      console.error('Admin user with email admin@wietforumbelgie.com not found')
      throw new Error('Admin user not found')
    }
    
    // Update the password for the admin user
    console.log('Updating password for user:', adminUserId)
    const { data, error } = await supabaseAdmin.auth.admin.updateUserById(
      adminUserId,
      {
        password: 'WietForumBelgie12345!@'
      }
    )

    if (error) {
      console.error('Error updating password:', error)
      throw error
    }

    console.log('Password updated successfully')

    return new Response(
      JSON.stringify({ 
        message: 'Admin password updated successfully',
        userId: adminUserId
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      },
    )
  }
})