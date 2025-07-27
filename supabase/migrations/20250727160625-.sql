-- Create notifications table
CREATE TABLE public.notifications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  type VARCHAR NOT NULL,
  title VARCHAR NOT NULL,
  message TEXT,
  data JSONB DEFAULT '{}',
  read_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Create policies for notifications
CREATE POLICY "Users can view their own notifications" 
ON public.notifications 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own notifications" 
ON public.notifications 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "System can create notifications" 
ON public.notifications 
FOR INSERT 
WITH CHECK (true);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_notifications_updated_at
BEFORE UPDATE ON public.notifications
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to send notification
CREATE OR REPLACE FUNCTION public.create_notification(
  recipient_id UUID,
  notification_type VARCHAR,
  notification_title VARCHAR,
  notification_message TEXT DEFAULT NULL,
  notification_data JSONB DEFAULT '{}'
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  notification_id UUID;
BEGIN
  INSERT INTO public.notifications (
    user_id,
    type,
    title,
    message,
    data
  ) VALUES (
    recipient_id,
    notification_type,
    notification_title,
    notification_message,
    notification_data
  ) RETURNING id INTO notification_id;
  
  RETURN notification_id;
END;
$$;

-- Create function to notify on new reply
CREATE OR REPLACE FUNCTION public.notify_topic_reply()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  topic_author_id UUID;
  topic_title VARCHAR;
  reply_author_username VARCHAR;
BEGIN
  -- Get topic author and title
  SELECT author_id, title INTO topic_author_id, topic_title
  FROM public.topics
  WHERE id = NEW.topic_id;
  
  -- Get reply author username
  SELECT username INTO reply_author_username
  FROM public.profiles
  WHERE user_id = NEW.author_id;
  
  -- Don't notify if author is replying to their own topic
  IF topic_author_id != NEW.author_id THEN
    PERFORM public.create_notification(
      topic_author_id,
      'topic_reply',
      'Nieuwe reactie op je topic',
      reply_author_username || ' heeft gereageerd op "' || topic_title || '"',
      jsonb_build_object(
        'topic_id', NEW.topic_id,
        'reply_id', NEW.id,
        'author_id', NEW.author_id,
        'author_username', reply_author_username
      )
    );
  END IF;
  
  RETURN NEW;
END;
$$;

-- Create trigger for reply notifications
CREATE TRIGGER notify_on_topic_reply
AFTER INSERT ON public.replies
FOR EACH ROW
EXECUTE FUNCTION public.notify_topic_reply();