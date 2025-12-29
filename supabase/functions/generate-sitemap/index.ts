import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface SitemapEntry {
  loc: string;
  lastmod?: string;
  changefreq?: string;
  priority?: string;
}

interface SupplierProfile {
  profiles: {
    username: string;
  };
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { searchParams } = new URL(req.url);
    const type = searchParams.get("type") || "index";
    const baseUrl = Deno.env.get("BASE_URL") || "https://wietforum.be";

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    let xml = "";

    if (type === "index") {
      // Generate sitemap index
      xml = generateSitemapIndex(baseUrl);
    } else if (type === "pages") {
      // Static pages sitemap
      xml = await generatePagesSitemap(baseUrl);
    } else if (type === "cannabis") {
      // Cannabis SEO content pages
      xml = await generateCannabisSitemap(supabase, baseUrl);
    } else if (type === "forums") {
      // Forum categories
      xml = await generateForumsSitemap(supabase, baseUrl);
    } else if (type === "topics") {
      // Forum topics (limited to most recent/popular)
      xml = await generateTopicsSitemap(supabase, baseUrl);
    } else if (type === "suppliers") {
      // Supplier profiles
      xml = await generateSupplierProfilesSitemap(supabase, baseUrl);
    }

    return new Response(xml, {
      headers: {
        ...corsHeaders,
        "Content-Type": "application/xml",
        "Cache-Control": "public, max-age=3600",
      },
    });
  } catch (error) {
    console.error("Sitemap generation error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

function generateSitemapIndex(baseUrl: string): string {
  const sitemaps = [
    { name: "pages", lastmod: new Date().toISOString() },
    { name: "cannabis", lastmod: new Date().toISOString() },
    { name: "forums", lastmod: new Date().toISOString() },
    { name: "topics", lastmod: new Date().toISOString() },
    { name: "suppliers", lastmod: new Date().toISOString() }, // Added suppliers
  ];

  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml += '<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

  for (const sitemap of sitemaps) {
    xml += "  <sitemap>\n";
    xml += `    <loc>${baseUrl}/sitemap-${sitemap.name}.xml</loc>\n`;
    xml += `    <lastmod>${sitemap.lastmod}</lastmod>\n`;
    xml += "  </sitemap>\n";
  }

  xml += "</sitemapindex>";
  return xml;
}

async function generatePagesSitemap(baseUrl: string): Promise<string> {
  const staticPages: SitemapEntry[] = [
    { loc: `${baseUrl}/`, changefreq: "daily", priority: "1.0" },
    { loc: `${baseUrl}/forums`, changefreq: "daily", priority: "0.9" },
    { loc: `${baseUrl}/leaderboard`, changefreq: "weekly", priority: "0.7" },
    { loc: `${baseUrl}/gamification`, changefreq: "weekly", priority: "0.7" },
    { loc: `${baseUrl}/members`, changefreq: "daily", priority: "0.6" },
    { loc: `${baseUrl}/suppliers`, changefreq: "weekly", priority: "0.8" },
    { loc: `${baseUrl}/privacy`, changefreq: "monthly", priority: "0.3" },
    { loc: `${baseUrl}/terms`, changefreq: "monthly", priority: "0.3" },
  ];

  return generateXmlFromEntries(staticPages);
}

async function generateCannabisSitemap(supabase: any, baseUrl: string): Promise<string> {
  const { data: pages } = await supabase
    .from("seo_content_pages")
    .select("slug, last_updated, page_type")
    .eq("is_published", true)
    .order("page_type", { ascending: true });

  const entries: SitemapEntry[] = (pages || []).map((page: any) => ({
    loc: `${baseUrl}/${page.slug}`,
    lastmod: page.last_updated,
    changefreq: page.page_type === "pillar" ? "weekly" : "monthly",
    priority: page.page_type === "pillar" ? "1.0" : page.page_type === "province" ? "0.8" : "0.7",
  }));

  return generateXmlFromEntries(entries);
}

async function generateForumsSitemap(supabase: any, baseUrl: string): Promise<string> {
  const { data: categories } = await supabase
    .from("categories")
    .select("slug, created_at")
    .eq("is_active", true)
    .order("sort_order", { ascending: true });

  const entries: SitemapEntry[] = (categories || []).map((cat: any) => ({
    loc: `${baseUrl}/forums/${cat.slug}`,
    lastmod: cat.created_at,
    changefreq: "daily",
    priority: "0.8",
  }));

  return generateXmlFromEntries(entries);
}

async function generateTopicsSitemap(supabase: any, baseUrl: string): Promise<string> {
  // Limit to recent 1000 topics
  const { data: topics } = await supabase
    .from("topics")
    .select("id, updated_at, categories(slug)") // Fetch category slug for correct URL
    .order("last_activity_at", { ascending: false })
    .limit(1000);

  const entries: SitemapEntry[] = (topics || []).map((topic: any) => ({
    loc: topic.categories?.slug
      ? `${baseUrl}/forums/${topic.categories.slug}/topic/${topic.id}` // Fixed URL structure
      : `${baseUrl}/topic/${topic.id}`, // Fallback if category slug is missing
    lastmod: topic.updated_at,
    changefreq: "daily",
    priority: "0.6",
  }));

  return generateXmlFromEntries(entries);
}

async function generateSupplierProfilesSitemap(supabase: any, baseUrl: string): Promise<string> {
  const { data: suppliers } = await supabase
    .from("supplier_profiles")
    .select("profiles(username), updated_at")
    .eq("is_active", true);

  const entries: SitemapEntry[] = (suppliers || []).map((s: any) => ({
    loc: `${baseUrl}/aanbod/${s.profiles?.username}`,
    lastmod: s.updated_at,
    changefreq: "weekly",
    priority: "0.7",
  }));

  return generateXmlFromEntries(entries);
}

function generateXmlFromEntries(entries: SitemapEntry[]): string {
  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

  for (const entry of entries) {
    xml += "  <url>\n";
    xml += `    <loc>${entry.loc}</loc>\n`;
    if (entry.lastmod) {
      xml += `    <lastmod>${entry.lastmod}</lastmod>\n`;
    }
    if (entry.changefreq) {
      xml += `    <changefreq>${entry.changefreq}</changefreq>\n`;
    }
    if (entry.priority) {
      xml += `    <priority>${entry.priority}</priority>\n`;
    }
    xml += "  </url>\n";
  }

  xml += "</urlset>";
  return xml;
}
