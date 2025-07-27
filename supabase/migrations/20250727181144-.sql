-- Security fix: Add proper search_path to all database functions to prevent function hijacking

-- Fix update_updated_at_column function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = 'public'
AS $function$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$function$;

-- Fix update_conversation_last_message function
CREATE OR REPLACE FUNCTION public.update_conversation_last_message()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = 'public'
AS $function$
BEGIN
  UPDATE public.conversations
  SET last_message_at = NEW.created_at,
      updated_at = NEW.created_at
  WHERE id = NEW.conversation_id;
  RETURN NEW;
END;
$function$;

-- Fix update_topic_stats function
CREATE OR REPLACE FUNCTION public.update_topic_stats()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = 'public'
AS $function$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.topics
    SET reply_count = reply_count + 1,
        last_activity_at = NEW.created_at
    WHERE id = NEW.topic_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.topics
    SET reply_count = reply_count - 1
    WHERE id = OLD.topic_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$function$;

-- Fix log_profile_role_change function
CREATE OR REPLACE FUNCTION public.log_profile_role_change()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = 'public'
AS $function$
BEGIN
  IF TG_OP = 'UPDATE' AND OLD.role != NEW.role THEN
    INSERT INTO public.audit_logs (
      user_id, 
      action, 
      table_name, 
      record_id, 
      old_values, 
      new_values
    ) VALUES (
      auth.uid(),
      'role_change',
      'profiles',
      NEW.id,
      jsonb_build_object('role', OLD.role),
      jsonb_build_object('role', NEW.role)
    );
  END IF;
  RETURN NEW;
END;
$function$;

-- Fix create_notification function
CREATE OR REPLACE FUNCTION public.create_notification(recipient_id uuid, notification_type character varying, notification_title character varying, notification_message text DEFAULT NULL::text, notification_data jsonb DEFAULT '{}'::jsonb)
 RETURNS uuid
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = 'public'
AS $function$
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
$function$;

-- Fix notify_topic_reply function
CREATE OR REPLACE FUNCTION public.notify_topic_reply()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = 'public'
AS $function$
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
$function$;

-- Fix update_user_reputation function
CREATE OR REPLACE FUNCTION public.update_user_reputation(target_user_id uuid, change_amount integer, reason character varying, related_item_id uuid DEFAULT NULL::uuid, related_item_type character varying DEFAULT NULL::character varying)
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = 'public'
AS $function$
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
$function$;

-- Fix handle_vote_reputation function
CREATE OR REPLACE FUNCTION public.handle_vote_reputation()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = 'public'
AS $function$
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
$function$;