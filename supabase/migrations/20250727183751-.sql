-- Enhanced security tables for 2FA, data export, and device management

-- Device fingerprints for enhanced security tracking
CREATE TABLE public.user_device_fingerprints (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  fingerprint_hash TEXT NOT NULL,
  device_info JSONB DEFAULT '{}',
  browser_info JSONB DEFAULT '{}',
  first_seen_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  last_seen_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  is_trusted BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, fingerprint_hash)
);

-- Data export requests for GDPR compliance
CREATE TABLE public.data_export_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  request_type CHARACTER VARYING NOT NULL, -- 'full', 'activity', 'messages', etc.
  status CHARACTER VARYING NOT NULL DEFAULT 'pending', -- 'pending', 'processing', 'completed', 'failed'
  file_url TEXT,
  file_size_bytes INTEGER,
  expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  completed_at TIMESTAMP WITH TIME ZONE
);

-- Account deletion requests
CREATE TABLE public.account_deletion_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  reason TEXT,
  scheduled_for TIMESTAMP WITH TIME ZONE NOT NULL,
  status CHARACTER VARYING NOT NULL DEFAULT 'pending', -- 'pending', 'processing', 'completed', 'cancelled'
  verification_token TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  completed_at TIMESTAMP WITH TIME ZONE
);

-- Security score history
CREATE TABLE public.user_security_scores (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  score INTEGER NOT NULL CHECK (score >= 0 AND score <= 100),
  factors JSONB DEFAULT '{}', -- breakdown of score factors
  recommendations JSONB DEFAULT '[]', -- array of recommended actions
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enhanced 2FA backup codes (updating existing structure)
ALTER TABLE public.user_2fa 
ADD COLUMN IF NOT EXISTS backup_codes_used JSONB DEFAULT '[]',
ADD COLUMN IF NOT EXISTS last_used_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS setup_completed_at TIMESTAMP WITH TIME ZONE;

-- Enable RLS
ALTER TABLE public.user_device_fingerprints ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.data_export_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.account_deletion_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_security_scores ENABLE ROW LEVEL SECURITY;

-- RLS Policies for device fingerprints
CREATE POLICY "Users can view their own device fingerprints" 
ON public.user_device_fingerprints 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "System can manage device fingerprints" 
ON public.user_device_fingerprints 
FOR ALL 
USING (true) 
WITH CHECK (true);

-- RLS Policies for data export requests
CREATE POLICY "Users can view their own export requests" 
ON public.data_export_requests 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create export requests" 
ON public.data_export_requests 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "System can update export requests" 
ON public.data_export_requests 
FOR UPDATE 
USING (true);

-- RLS Policies for account deletion requests
CREATE POLICY "Users can view their own deletion requests" 
ON public.account_deletion_requests 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create deletion requests" 
ON public.account_deletion_requests 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "System can manage deletion requests" 
ON public.account_deletion_requests 
FOR ALL 
USING (true);

-- RLS Policies for security scores
CREATE POLICY "Users can view their own security scores" 
ON public.user_security_scores 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "System can create security scores" 
ON public.user_security_scores 
FOR INSERT 
WITH CHECK (true);

-- Function to calculate security score
CREATE OR REPLACE FUNCTION public.calculate_user_security_score(target_user_id UUID)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  score INTEGER := 0;
  has_2fa BOOLEAN := false;
  has_recent_password_change BOOLEAN := false;
  recent_suspicious_activity INTEGER := 0;
  session_count INTEGER := 0;
BEGIN
  -- Check 2FA status (30 points)
  SELECT is_enabled INTO has_2fa 
  FROM public.user_2fa 
  WHERE user_id = target_user_id;
  
  IF has_2fa THEN
    score := score + 30;
  END IF;
  
  -- Check for recent password changes (20 points)
  -- This would need auth metadata, simplified for now
  score := score + 20;
  
  -- Check for suspicious activity in last 30 days (subtract points)
  SELECT COUNT(*) INTO recent_suspicious_activity
  FROM public.user_security_events
  WHERE user_id = target_user_id 
    AND risk_level IN ('high', 'critical')
    AND created_at > now() - INTERVAL '30 days';
  
  score := score - (recent_suspicious_activity * 5);
  
  -- Check session management (20 points for reasonable session count)
  SELECT COUNT(*) INTO session_count
  FROM public.user_sessions
  WHERE user_id = target_user_id 
    AND expires_at > now();
  
  IF session_count <= 3 THEN
    score := score + 20;
  ELSIF session_count <= 5 THEN
    score := score + 10;
  END IF;
  
  -- Base security score (30 points)
  score := score + 30;
  
  -- Ensure score is between 0 and 100
  score := GREATEST(0, LEAST(100, score));
  
  RETURN score;
END;
$$;

-- Function to update security score
CREATE OR REPLACE FUNCTION public.update_user_security_score(target_user_id UUID)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  new_score INTEGER;
  score_factors JSONB;
  recommendations JSONB;
BEGIN
  -- Calculate new score
  new_score := public.calculate_user_security_score(target_user_id);
  
  -- Build factors and recommendations
  score_factors := jsonb_build_object(
    'two_factor_auth', CASE WHEN EXISTS(SELECT 1 FROM public.user_2fa WHERE user_id = target_user_id AND is_enabled = true) THEN 30 ELSE 0 END,
    'password_security', 20,
    'session_management', 20,
    'base_security', 30
  );
  
  recommendations := '[]'::jsonb;
  
  -- Add recommendations based on missing security features
  IF NOT EXISTS(SELECT 1 FROM public.user_2fa WHERE user_id = target_user_id AND is_enabled = true) THEN
    recommendations := recommendations || '[{"type": "enable_2fa", "message": "Enable two-factor authentication", "priority": "high"}]'::jsonb;
  END IF;
  
  -- Insert new score record
  INSERT INTO public.user_security_scores (
    user_id, score, factors, recommendations
  ) VALUES (
    target_user_id, new_score, score_factors, recommendations
  );
END;
$$;

-- Trigger to update security scores on relevant changes
CREATE OR REPLACE FUNCTION public.trigger_security_score_update()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  PERFORM public.update_user_security_score(
    CASE 
      WHEN TG_TABLE_NAME = 'user_2fa' THEN COALESCE(NEW.user_id, OLD.user_id)
      WHEN TG_TABLE_NAME = 'user_security_events' THEN COALESCE(NEW.user_id, OLD.user_id)
      WHEN TG_TABLE_NAME = 'user_sessions' THEN COALESCE(NEW.user_id, OLD.user_id)
      ELSE NULL
    END
  );
  RETURN COALESCE(NEW, OLD);
END;
$$;

-- Create triggers for security score updates
CREATE TRIGGER trigger_2fa_security_score_update
  AFTER INSERT OR UPDATE OR DELETE ON public.user_2fa
  FOR EACH ROW EXECUTE FUNCTION public.trigger_security_score_update();

CREATE TRIGGER trigger_security_events_score_update
  AFTER INSERT ON public.user_security_events
  FOR EACH ROW EXECUTE FUNCTION public.trigger_security_score_update();

-- Add updated_at triggers
CREATE TRIGGER update_user_device_fingerprints_updated_at
  BEFORE UPDATE ON public.user_device_fingerprints
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();