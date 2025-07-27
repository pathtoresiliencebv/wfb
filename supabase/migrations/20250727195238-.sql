-- Update categories with better sort order
UPDATE categories SET sort_order = 1 WHERE slug = 'algemeen';
UPDATE categories SET sort_order = 2 WHERE slug = 'growtips';
UPDATE categories SET sort_order = 3 WHERE slug = 'strains';
UPDATE categories SET sort_order = 4 WHERE slug = 'medical';
UPDATE categories SET sort_order = 5 WHERE slug = 'reviews';
UPDATE categories SET sort_order = 6 WHERE slug = 'wetgeving';

-- Create trigger for vote reputation (if not exists)
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'vote_reputation_trigger') THEN
    CREATE TRIGGER vote_reputation_trigger
      AFTER INSERT OR UPDATE OR DELETE ON public.votes
      FOR EACH ROW
      EXECUTE FUNCTION public.handle_vote_reputation();
  END IF;
END;
$$;