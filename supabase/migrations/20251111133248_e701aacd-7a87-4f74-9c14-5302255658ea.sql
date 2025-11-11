-- Add expires_at column to messages table
ALTER TABLE public.messages 
ADD COLUMN expires_at timestamptz;

-- Create function to automatically set expiry date
CREATE OR REPLACE FUNCTION set_message_expiry()
RETURNS TRIGGER AS $$
BEGIN
  NEW.expires_at := NEW.created_at + INTERVAL '7 days';
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to set expiry on insert
CREATE TRIGGER messages_set_expiry
BEFORE INSERT ON public.messages
FOR EACH ROW
EXECUTE FUNCTION set_message_expiry();

-- Update existing messages with expiry date
UPDATE public.messages 
SET expires_at = created_at + INTERVAL '7 days'
WHERE expires_at IS NULL;

-- Create function to delete expired messages
CREATE OR REPLACE FUNCTION delete_expired_messages()
RETURNS void AS $$
BEGIN
  DELETE FROM public.messages 
  WHERE expires_at < now() 
  AND is_deleted = false;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Enable replica identity for real-time
ALTER TABLE public.messages REPLICA IDENTITY FULL;
ALTER TABLE public.conversations REPLICA IDENTITY FULL;