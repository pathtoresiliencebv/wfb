-- Fix public access permissions and Ensure RLS policies allow public read access

-- Grant usage on schema public
GRANT USAGE ON SCHEMA public TO anon, authenticated;

-- Grant select on key tables to anon and authenticated
GRANT SELECT ON public.categories TO anon, authenticated;
GRANT SELECT ON public.topics TO anon, authenticated;
GRANT SELECT ON public.replies TO anon, authenticated;
GRANT SELECT ON public.profiles TO anon, authenticated;

-- Ensure RLS is enabled
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.topics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.replies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Re-create permissive policies for public read access

-- Categories
DROP POLICY IF EXISTS "Categories are viewable by everyone" ON public.categories;
DROP POLICY IF EXISTS "Public read access for categories" ON public.categories;
CREATE POLICY "Public read access for categories" ON public.categories FOR SELECT USING (true);

-- Topics
DROP POLICY IF EXISTS "Topics are viewable by everyone" ON public.topics;
DROP POLICY IF EXISTS "Public read access for topics" ON public.topics;
CREATE POLICY "Public read access for topics" ON public.topics FOR SELECT USING (true);

-- Replies
DROP POLICY IF EXISTS "Replies are viewable by everyone" ON public.replies;
DROP POLICY IF EXISTS "Public read access for replies" ON public.replies;
CREATE POLICY "Public read access for replies" ON public.replies FOR SELECT USING (true);

-- Profiles
DROP POLICY IF EXISTS "Profiles are viewable by everyone" ON public.profiles;
DROP POLICY IF EXISTS "Public read access for profiles" ON public.profiles;
CREATE POLICY "Public read access for profiles" ON public.profiles FOR SELECT USING (true);

