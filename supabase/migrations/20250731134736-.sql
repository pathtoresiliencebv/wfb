-- Create user levels table
CREATE TABLE public.user_levels (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE,
  current_level INTEGER NOT NULL DEFAULT 1,
  total_xp INTEGER NOT NULL DEFAULT 0,
  xp_this_level INTEGER NOT NULL DEFAULT 0,
  level_title VARCHAR(100) DEFAULT 'Newbie',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create point categories table for tracking different types of points
CREATE TABLE public.point_categories (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  description TEXT,
  icon VARCHAR(50),
  color VARCHAR(20) DEFAULT '#10b981',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create user points table for tracking categorized points
CREATE TABLE public.user_points (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  category_id UUID NOT NULL,
  points INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, category_id)
);

-- Create rewards table
CREATE TABLE public.rewards (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  reward_type VARCHAR(50) NOT NULL, -- 'badge', 'title', 'special_privilege', 'cosmetic'
  cost_points INTEGER NOT NULL DEFAULT 0,
  cost_category_id UUID,
  required_level INTEGER DEFAULT 1,
  icon VARCHAR(50),
  is_active BOOLEAN DEFAULT true,
  is_limited BOOLEAN DEFAULT false,
  max_claims INTEGER,
  current_claims INTEGER DEFAULT 0,
  expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create user rewards table for tracking claimed rewards
CREATE TABLE public.user_rewards (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  reward_id UUID NOT NULL,
  claimed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  is_active BOOLEAN DEFAULT true
);

-- Create level definitions table
CREATE TABLE public.level_definitions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  level_number INTEGER NOT NULL UNIQUE,
  title VARCHAR(100) NOT NULL,
  required_xp INTEGER NOT NULL,
  perks JSONB DEFAULT '[]',
  icon VARCHAR(50),
  color VARCHAR(20) DEFAULT '#10b981',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.user_levels ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.point_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_points ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rewards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_rewards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.level_definitions ENABLE ROW LEVEL SECURITY;

-- User levels policies
CREATE POLICY "Users can view all user levels" ON public.user_levels FOR SELECT USING (true);
CREATE POLICY "Users can insert their own level" ON public.user_levels FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "System can update user levels" ON public.user_levels FOR UPDATE USING (true);

-- Point categories policies
CREATE POLICY "Point categories are viewable by everyone" ON public.point_categories FOR SELECT USING (true);
CREATE POLICY "Admins can manage point categories" ON public.point_categories FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE user_id = auth.uid() AND role IN ('admin', 'moderator'))
);

-- User points policies
CREATE POLICY "Users can view all user points" ON public.user_points FOR SELECT USING (true);
CREATE POLICY "System can manage user points" ON public.user_points FOR ALL USING (true);

-- Rewards policies
CREATE POLICY "Rewards are viewable by everyone" ON public.rewards FOR SELECT USING (true);
CREATE POLICY "Admins can manage rewards" ON public.rewards FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE user_id = auth.uid() AND role IN ('admin', 'moderator'))
);

-- User rewards policies
CREATE POLICY "Users can view their own rewards" ON public.user_rewards FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can claim rewards" ON public.user_rewards FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Level definitions policies
CREATE POLICY "Level definitions are viewable by everyone" ON public.level_definitions FOR SELECT USING (true);
CREATE POLICY "Admins can manage level definitions" ON public.level_definitions FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE user_id = auth.uid() AND role IN ('admin', 'moderator'))
);

-- Update trigger for user_levels
CREATE TRIGGER update_user_levels_updated_at
  BEFORE UPDATE ON public.user_levels
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Update trigger for user_points
CREATE TRIGGER update_user_points_updated_at
  BEFORE UPDATE ON public.user_points
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default point categories
INSERT INTO public.point_categories (name, description, icon, color) VALUES
('general', 'General forum activity points', 'Star', '#10b981'),
('helpful', 'Points for helping other users', 'Heart', '#f59e0b'),
('content', 'Points for creating quality content', 'Edit', '#3b82f6'),
('social', 'Points for social interactions', 'Users', '#8b5cf6'),
('expertise', 'Points for expert knowledge', 'BookOpen', '#ef4444');

-- Insert default level definitions
INSERT INTO public.level_definitions (level_number, title, required_xp, icon, color) VALUES
(1, 'Newbie', 0, 'Seedling', '#94a3b8'),
(2, 'Beginner', 100, 'Sprout', '#22c55e'),
(3, 'Member', 250, 'Leaf', '#16a34a'),
(4, 'Active Member', 500, 'TreePine', '#15803d'),
(5, 'Experienced', 1000, 'Trees', '#166534'),
(6, 'Knowledgeable', 2000, 'Award', '#f59e0b'),
(7, 'Expert', 4000, 'Crown', '#dc2626'),
(8, 'Master', 7500, 'Gem', '#7c3aed'),
(9, 'Guru', 12000, 'Zap', '#db2777'),
(10, 'Legend', 20000, 'Sparkles', '#facc15');

-- Create function to calculate user level based on XP
CREATE OR REPLACE FUNCTION public.calculate_user_level(total_xp INTEGER)
RETURNS TABLE(level_number INTEGER, title VARCHAR, xp_for_current INTEGER, xp_for_next INTEGER) 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  current_level INTEGER := 1;
  current_title VARCHAR := 'Newbie';
  xp_current INTEGER := 0;
  xp_next INTEGER := 100;
BEGIN
  SELECT ld.level_number, ld.title, ld.required_xp INTO current_level, current_title, xp_current
  FROM level_definitions ld
  WHERE ld.required_xp <= total_xp
  ORDER BY ld.level_number DESC
  LIMIT 1;
  
  SELECT ld.required_xp INTO xp_next
  FROM level_definitions ld
  WHERE ld.level_number = current_level + 1;
  
  IF xp_next IS NULL THEN
    xp_next := xp_current;
  END IF;
  
  RETURN QUERY SELECT current_level, current_title, xp_current, xp_next;
END;
$$;

-- Create function to award XP and update user level
CREATE OR REPLACE FUNCTION public.award_xp(target_user_id UUID, xp_amount INTEGER, reason VARCHAR DEFAULT 'general_activity')
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  user_level_record user_levels%ROWTYPE;
  new_total_xp INTEGER;
  level_info RECORD;
  old_level INTEGER;
BEGIN
  -- Get current user level data
  SELECT * INTO user_level_record FROM user_levels WHERE user_id = target_user_id;
  
  -- Create user level record if it doesn't exist
  IF NOT FOUND THEN
    INSERT INTO user_levels (user_id, current_level, total_xp, xp_this_level, level_title)
    VALUES (target_user_id, 1, xp_amount, xp_amount, 'Newbie')
    RETURNING * INTO user_level_record;
  ELSE
    -- Update XP
    new_total_xp := user_level_record.total_xp + xp_amount;
    old_level := user_level_record.current_level;
    
    -- Calculate new level
    SELECT * INTO level_info FROM calculate_user_level(new_total_xp);
    
    -- Update user level
    UPDATE user_levels 
    SET total_xp = new_total_xp,
        current_level = level_info.level_number,
        level_title = level_info.title,
        xp_this_level = new_total_xp - level_info.xp_for_current,
        updated_at = now()
    WHERE user_id = target_user_id;
    
    -- Check if user leveled up
    IF level_info.level_number > old_level THEN
      PERFORM public.create_notification(
        target_user_id,
        'level_up',
        'Level Up!',
        'Gefeliciteerd! Je bent nu level ' || level_info.level_number || ' - ' || level_info.title,
        jsonb_build_object(
          'new_level', level_info.level_number,
          'new_title', level_info.title,
          'total_xp', new_total_xp
        )
      );
    END IF;
  END IF;
  
  RETURN true;
END;
$$;

-- Create function to award points in specific categories
CREATE OR REPLACE FUNCTION public.award_category_points(target_user_id UUID, category_name VARCHAR, points_amount INTEGER)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  category_record point_categories%ROWTYPE;
BEGIN
  -- Get category
  SELECT * INTO category_record FROM point_categories WHERE name = category_name;
  
  IF NOT FOUND THEN
    RETURN false;
  END IF;
  
  -- Insert or update user points
  INSERT INTO user_points (user_id, category_id, points)
  VALUES (target_user_id, category_record.id, points_amount)
  ON CONFLICT (user_id, category_id)
  DO UPDATE SET 
    points = user_points.points + points_amount,
    updated_at = now();
  
  -- Also award XP
  PERFORM public.award_xp(target_user_id, points_amount, category_name || '_points');
  
  RETURN true;
END;
$$;