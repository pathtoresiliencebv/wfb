-- Add online status tracking table
CREATE TABLE IF NOT EXISTS public.user_online_status (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  is_online BOOLEAN NOT NULL DEFAULT true,
  last_seen TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  
  UNIQUE(user_id)
);

-- Enable RLS
ALTER TABLE public.user_online_status ENABLE ROW LEVEL SECURITY;

-- Create policies for online status
CREATE POLICY "Online status is viewable by everyone" 
  ON public.user_online_status 
  FOR SELECT 
  USING (true);

CREATE POLICY "Users can update their own online status" 
  ON public.user_online_status 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own online status" 
  ON public.user_online_status 
  FOR UPDATE 
  USING (auth.uid() = user_id);

-- Create trigger for updated_at
CREATE TRIGGER update_user_online_status_updated_at
  BEFORE UPDATE ON public.user_online_status
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Add indexes for performance
CREATE INDEX idx_user_online_status_user_id ON public.user_online_status(user_id);
CREATE INDEX idx_user_online_status_is_online ON public.user_online_status(is_online);
CREATE INDEX idx_user_online_status_last_seen ON public.user_online_status(last_seen DESC);

-- Enable realtime for online status
ALTER PUBLICATION supabase_realtime ADD TABLE public.user_online_status;