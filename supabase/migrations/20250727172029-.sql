-- Add admin-specific tables and enhanced user roles

-- Add reputation tracking table
CREATE TABLE public.reputation_history (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  change_amount INTEGER NOT NULL,
  reason VARCHAR NOT NULL,
  related_item_id UUID,
  related_item_type VARCHAR,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.reputation_history ENABLE ROW LEVEL SECURITY;

-- Create policies for reputation history
CREATE POLICY "Users can view their own reputation history" 
ON public.reputation_history 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "System can create reputation entries" 
ON public.reputation_history 
FOR INSERT 
WITH CHECK (true);

-- Create reports table for moderation
CREATE TABLE public.reports (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  reporter_id UUID NOT NULL,
  reported_item_id UUID NOT NULL,
  reported_item_type VARCHAR NOT NULL,
  reason VARCHAR NOT NULL,
  description TEXT,
  status VARCHAR NOT NULL DEFAULT 'pending',
  resolved_by UUID,
  resolved_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;

-- Create policies for reports
CREATE POLICY "Users can create reports" 
ON public.reports 
FOR INSERT 
WITH CHECK (auth.uid() = reporter_id);

CREATE POLICY "Admins and moderators can view all reports" 
ON public.reports 
FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM profiles 
  WHERE user_id = auth.uid() 
  AND role IN ('admin', 'moderator')
));

CREATE POLICY "Admins and moderators can update reports" 
ON public.reports 
FOR UPDATE 
USING (EXISTS (
  SELECT 1 FROM profiles 
  WHERE user_id = auth.uid() 
  AND role IN ('admin', 'moderator')
));

-- Create user followers table for social features
CREATE TABLE public.user_followers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  follower_id UUID NOT NULL,
  following_id UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(follower_id, following_id)
);

-- Enable RLS
ALTER TABLE public.user_followers ENABLE ROW LEVEL SECURITY;

-- Create policies for user followers
CREATE POLICY "Users can view all follower relationships" 
ON public.user_followers 
FOR SELECT 
USING (true);

CREATE POLICY "Users can create their own follows" 
ON public.user_followers 
FOR INSERT 
WITH CHECK (auth.uid() = follower_id);

CREATE POLICY "Users can delete their own follows" 
ON public.user_followers 
FOR DELETE 
USING (auth.uid() = follower_id);

-- Create activity feed table
CREATE TABLE public.activity_feed (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  activity_type VARCHAR NOT NULL,
  activity_data JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.activity_feed ENABLE ROW LEVEL SECURITY;

-- Create policies for activity feed
CREATE POLICY "Users can view activity from users they follow" 
ON public.activity_feed 
FOR SELECT 
USING (
  user_id = auth.uid() OR 
  EXISTS (
    SELECT 1 FROM user_followers 
    WHERE follower_id = auth.uid() 
    AND following_id = activity_feed.user_id
  )
);

CREATE POLICY "System can create activity entries" 
ON public.activity_feed 
FOR INSERT 
WITH CHECK (true);

-- Create function to update user reputation
CREATE OR REPLACE FUNCTION public.update_user_reputation(
  target_user_id UUID,
  change_amount INTEGER,
  reason VARCHAR,
  related_item_id UUID DEFAULT NULL,
  related_item_type VARCHAR DEFAULT NULL
) RETURNS void AS $$
BEGIN
  -- Update user reputation in profiles table
  UPDATE public.profiles
  SET reputation = reputation + change_amount,
      updated_at = now()
  WHERE user_id = target_user_id;
  
  -- Log the reputation change
  INSERT INTO public.reputation_history (
    user_id, change_amount, reason, related_item_id, related_item_type
  ) VALUES (
    target_user_id, change_amount, reason, related_item_id, related_item_type
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to handle automatic reputation from votes
CREATE OR REPLACE FUNCTION public.handle_vote_reputation()
RETURNS TRIGGER AS $$
DECLARE
  target_user_id UUID;
  rep_change INTEGER;
BEGIN
  -- Get the author of the voted item
  IF NEW.item_type = 'topic' THEN
    SELECT author_id INTO target_user_id FROM public.topics WHERE id = NEW.item_id;
  ELSIF NEW.item_type = 'reply' THEN
    SELECT author_id INTO target_user_id FROM public.replies WHERE id = NEW.item_id;
  ELSE
    RETURN NEW;
  END IF;
  
  -- Calculate reputation change
  IF NEW.vote_type = 'up' THEN
    rep_change := 5;
  ELSIF NEW.vote_type = 'down' THEN
    rep_change := -2;
  ELSE
    RETURN NEW;
  END IF;
  
  -- Update reputation
  PERFORM public.update_user_reputation(
    target_user_id,
    rep_change,
    'vote_received',
    NEW.item_id,
    NEW.item_type
  );
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for vote reputation
CREATE TRIGGER vote_reputation_trigger
  AFTER INSERT ON public.votes
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_vote_reputation();

-- Create function to create activity feed entries
CREATE OR REPLACE FUNCTION public.create_activity_entry(
  user_id UUID,
  activity_type VARCHAR,
  activity_data JSONB DEFAULT '{}'
) RETURNS UUID AS $$
DECLARE
  activity_id UUID;
BEGIN
  INSERT INTO public.activity_feed (user_id, activity_type, activity_data)
  VALUES (user_id, activity_type, activity_data)
  RETURNING id INTO activity_id;
  
  RETURN activity_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create triggers for activity feed
CREATE OR REPLACE FUNCTION public.log_topic_activity()
RETURNS TRIGGER AS $$
BEGIN
  PERFORM public.create_activity_entry(
    NEW.author_id,
    'topic_created',
    jsonb_build_object(
      'topic_id', NEW.id,
      'topic_title', NEW.title,
      'category_id', NEW.category_id
    )
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER topic_activity_trigger
  AFTER INSERT ON public.topics
  FOR EACH ROW
  EXECUTE FUNCTION public.log_topic_activity();

CREATE OR REPLACE FUNCTION public.log_reply_activity()
RETURNS TRIGGER AS $$
BEGIN
  PERFORM public.create_activity_entry(
    NEW.author_id,
    'reply_created',
    jsonb_build_object(
      'reply_id', NEW.id,
      'topic_id', NEW.topic_id
    )
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER reply_activity_trigger
  AFTER INSERT ON public.replies
  FOR EACH ROW
  EXECUTE FUNCTION public.log_reply_activity();