import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    );

    // Get the current user
    const {
      data: { user },
      error: userError,
    } = await supabaseClient.auth.getUser();

    if (userError || !user) {
      console.log('No authenticated user');
      return new Response(
        JSON.stringify({ isAdmin: false, error: 'Not authenticated' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 401 }
      );
    }

    // Check if user has admin or moderator role using the has_role function
    const { data: isAdmin, error: adminCheckError } = await supabaseClient.rpc('has_role', {
      _user_id: user.id,
      _role: 'admin',
    });

    const { data: isModerator, error: modCheckError } = await supabaseClient.rpc('has_role', {
      _user_id: user.id,
      _role: 'moderator',
    });

    if (adminCheckError || modCheckError) {
      console.error('Error checking roles:', adminCheckError || modCheckError);
      return new Response(
        JSON.stringify({ isAdmin: false, error: 'Error checking permissions' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      );
    }

    const hasAdminAccess = isAdmin || isModerator;

    console.log(`User ${user.id} admin access: ${hasAdminAccess}`);

    return new Response(
      JSON.stringify({ isAdmin: hasAdminAccess, userId: user.id }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in verify-admin-role function:', error);
    return new Response(
      JSON.stringify({ isAdmin: false, error: 'Internal server error' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});
