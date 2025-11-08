-- Add share_count column to topics table
ALTER TABLE public.topics 
ADD COLUMN IF NOT EXISTS share_count integer DEFAULT 0;

-- Add index for better query performance
CREATE INDEX IF NOT EXISTS idx_topics_share_count ON public.topics(share_count DESC);