-- Function to update category topic count
CREATE OR REPLACE FUNCTION public.update_category_topic_count()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public', 'pg_temp'
AS $function$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE categories
    SET topic_count = topic_count + 1
    WHERE id = NEW.category_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE categories
    SET topic_count = GREATEST(0, topic_count - 1)
    WHERE id = OLD.category_id;
    RETURN OLD;
  ELSIF TG_OP = 'UPDATE' AND OLD.category_id != NEW.category_id THEN
    UPDATE categories
    SET topic_count = GREATEST(0, topic_count - 1)
    WHERE id = OLD.category_id;
    UPDATE categories
    SET topic_count = topic_count + 1
    WHERE id = NEW.category_id;
    RETURN NEW;
  END IF;
  RETURN NULL;
END;
$function$;

-- Create trigger to auto-update category topic count
CREATE TRIGGER update_category_topic_count_trigger
AFTER INSERT OR DELETE OR UPDATE OF category_id ON topics
FOR EACH ROW
EXECUTE FUNCTION update_category_topic_count();