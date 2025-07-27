-- Create table for two-factor authentication
CREATE TABLE public.user_2fa (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE,
  secret TEXT NOT NULL,
  is_enabled BOOLEAN NOT NULL DEFAULT false,
  backup_codes TEXT[],
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create table for user sessions
CREATE TABLE public.user_sessions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  session_token TEXT NOT NULL UNIQUE,
  device_info JSONB,
  ip_address INET,
  location TEXT,
  last_activity_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT (now() + INTERVAL '30 days')
);

-- Create table for privacy settings
CREATE TABLE public.user_privacy_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE,
  profile_visibility CHARACTER VARYING NOT NULL DEFAULT 'public',
  email_notifications BOOLEAN NOT NULL DEFAULT true,
  activity_tracking BOOLEAN NOT NULL DEFAULT true,
  data_sharing BOOLEAN NOT NULL DEFAULT false,
  marketing_emails BOOLEAN NOT NULL DEFAULT false,
  security_alerts BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create table for security events log for users
CREATE TABLE public.user_security_events (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  event_type CHARACTER VARYING NOT NULL,
  event_description TEXT NOT NULL,
  ip_address INET,
  user_agent TEXT,
  risk_level CHARACTER VARYING NOT NULL DEFAULT 'low',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  metadata JSONB DEFAULT '{}'::jsonb
);

-- Enable RLS on all tables
ALTER TABLE public.user_2fa ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_privacy_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_security_events ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for user_2fa
CREATE POLICY "Users can view their own 2FA settings" 
ON public.user_2fa 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own 2FA settings" 
ON public.user_2fa 
FOR ALL 
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Create RLS policies for user_sessions
CREATE POLICY "Users can view their own sessions" 
ON public.user_sessions 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "System can manage sessions" 
ON public.user_sessions 
FOR ALL 
USING (true)
WITH CHECK (true);

-- Create RLS policies for user_privacy_settings
CREATE POLICY "Users can view their own privacy settings" 
ON public.user_privacy_settings 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own privacy settings" 
ON public.user_privacy_settings 
FOR ALL 
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Create RLS policies for user_security_events
CREATE POLICY "Users can view their own security events" 
ON public.user_security_events 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "System can create security events" 
ON public.user_security_events 
FOR INSERT 
WITH CHECK (true);

-- Create indexes for performance
CREATE INDEX idx_user_2fa_user_id ON public.user_2fa(user_id);
CREATE INDEX idx_user_sessions_user_id ON public.user_sessions(user_id);
CREATE INDEX idx_user_sessions_token ON public.user_sessions(session_token);
CREATE INDEX idx_user_privacy_settings_user_id ON public.user_privacy_settings(user_id);
CREATE INDEX idx_user_security_events_user_id ON public.user_security_events(user_id);
CREATE INDEX idx_user_security_events_created_at ON public.user_security_events(created_at DESC);

-- Create triggers for updated_at
CREATE TRIGGER update_user_2fa_updated_at
BEFORE UPDATE ON public.user_2fa
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_user_privacy_settings_updated_at
BEFORE UPDATE ON public.user_privacy_settings
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Function to create security event
CREATE OR REPLACE FUNCTION public.create_security_event(
  target_user_id UUID,
  event_type VARCHAR,
  event_description TEXT,
  risk_level VARCHAR DEFAULT 'low',
  metadata JSONB DEFAULT '{}'::jsonb
) RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  event_id UUID;
BEGIN
  INSERT INTO public.user_security_events (
    user_id,
    event_type,
    event_description,
    ip_address,
    user_agent,
    risk_level,
    metadata
  ) VALUES (
    target_user_id,
    event_type,
    event_description,
    '127.0.0.1'::inet, -- In production, get from headers
    current_setting('request.headers', true)::json->>'user-agent',
    risk_level,
    metadata
  ) RETURNING id INTO event_id;
  
  RETURN event_id;
END;
$$;