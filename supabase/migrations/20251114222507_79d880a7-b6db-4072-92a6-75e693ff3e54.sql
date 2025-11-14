-- Drop the incorrect trigger on seo_content_pages
DROP TRIGGER IF EXISTS update_seo_content_pages_updated_at ON seo_content_pages;

-- Create new function specific to seo_content_pages using last_updated column
CREATE OR REPLACE FUNCTION update_seo_content_last_updated()
RETURNS TRIGGER AS $$
BEGIN
  NEW.last_updated = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create new trigger using the new function
CREATE TRIGGER update_seo_content_pages_last_updated
  BEFORE UPDATE ON seo_content_pages
  FOR EACH ROW
  EXECUTE FUNCTION update_seo_content_last_updated();