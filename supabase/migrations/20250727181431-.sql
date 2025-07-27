-- Create login_attempts table for server-side rate limiting
CREATE TABLE public.login_attempts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email VARCHAR NOT NULL,
  ip_address INET NOT NULL,
  attempt_count INTEGER NOT NULL DEFAULT 1,
  last_attempt_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  locked_until TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.login_attempts ENABLE ROW LEVEL SECURITY;

-- Create index for performance
CREATE INDEX idx_login_attempts_email ON public.login_attempts(email);
CREATE INDEX idx_login_attempts_ip ON public.login_attempts(ip_address);
CREATE INDEX idx_login_attempts_locked_until ON public.login_attempts(locked_until);

-- RLS policies for login_attempts (system managed)
CREATE POLICY "System can manage login attempts" 
ON public.login_attempts 
FOR ALL 
USING (true);

-- Create function to handle login attempts
CREATE OR REPLACE FUNCTION public.handle_login_attempt(
  attempt_email VARCHAR,
  attempt_ip INET,
  is_successful BOOLEAN DEFAULT false
) RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  existing_attempt login_attempts%ROWTYPE;
  max_attempts INTEGER := 5;
  lockout_duration INTERVAL := '15 minutes';
  result JSONB;
BEGIN
  -- Get existing attempt record
  SELECT * INTO existing_attempt
  FROM login_attempts
  WHERE email = attempt_email AND ip_address = attempt_ip;
  
  -- If successful login, clear attempts
  IF is_successful THEN
    IF existing_attempt.id IS NOT NULL THEN
      DELETE FROM login_attempts WHERE id = existing_attempt.id;
    END IF;
    RETURN jsonb_build_object('locked', false, 'remaining_attempts', max_attempts);
  END IF;
  
  -- Check if currently locked
  IF existing_attempt.locked_until IS NOT NULL AND existing_attempt.locked_until > now() THEN
    RETURN jsonb_build_object(
      'locked', true,
      'remaining_attempts', 0,
      'locked_until', existing_attempt.locked_until
    );
  END IF;
  
  -- Update or insert attempt record
  IF existing_attempt.id IS NOT NULL THEN
    UPDATE login_attempts
    SET attempt_count = CASE 
      WHEN locked_until IS NOT NULL AND locked_until <= now() THEN 1
      ELSE attempt_count + 1
    END,
    last_attempt_at = now(),
    locked_until = CASE 
      WHEN (CASE WHEN locked_until IS NOT NULL AND locked_until <= now() THEN 1 ELSE attempt_count + 1 END) >= max_attempts 
      THEN now() + lockout_duration
      ELSE NULL
    END,
    updated_at = now()
    WHERE id = existing_attempt.id
    RETURNING * INTO existing_attempt;
  ELSE
    INSERT INTO login_attempts (email, ip_address, attempt_count, last_attempt_at)
    VALUES (attempt_email, attempt_ip, 1, now())
    RETURNING * INTO existing_attempt;
  END IF;
  
  -- Return result
  RETURN jsonb_build_object(
    'locked', existing_attempt.locked_until IS NOT NULL AND existing_attempt.locked_until > now(),
    'remaining_attempts', GREATEST(0, max_attempts - existing_attempt.attempt_count),
    'locked_until', existing_attempt.locked_until
  );
END;
$$;

-- Add trigger for updated_at
CREATE TRIGGER update_login_attempts_updated_at
BEFORE UPDATE ON public.login_attempts
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();