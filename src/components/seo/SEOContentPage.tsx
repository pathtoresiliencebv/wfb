import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { SEOHead } from "./SEOHead";
import { MultiSchema, createArticleSchema, createFAQSchema } from "./SchemaMarkup";
import { Breadcrumbs } from "./Breadcrumbs";

interface SEOContentPageProps {
  slug: string;
}

export function SEOContentPage({ slug }: SEOContentPageProps) {
  const { data: page, isLoading, error } = useQuery({
    queryKey: ["seo-content", slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("seo_content_pages")
        .select("*")
        .eq("slug", slug)
        .eq("is_published", true)
        .single();

      if (error) throw error;

      // Increment view count
      await supabase
        .from("seo_content_pages")
        .update({ view_count: (data.view_count || 0) + 1 })
        .eq("id", data.id);

      return data;
    },
  });

  if (isLoading) {
    return (
      <div className="container max-w-4xl mx-auto px-4 py-8">
        <Skeleton className="h-8 w-3/4 mb-4" />
        <Skeleton className="h-12 w-full mb-8" />
        <div className="space-y-4">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
          <Skeleton className="h-4 w-4/6" />
        </div>
      </div>
    );
  }

  if (error || !page) {
    return (
      <div className="container max-w-4xl mx-auto px-4 py-8">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Deze pagina kon niet worden geladen. Probeer het later opnieuw.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  // Generate breadcrumbs based on page hierarchy
  const breadcrumbs = [];
  if (page.parent_slug) {
    // Add parent if exists
    breadcrumbs.push({
      label: page.page_type === "city" ? "Provincie" : "Cannabis in België",
      href: page.parent_slug.startsWith("/") ? page.parent_slug : `/${page.parent_slug}`,
    });
  }
  breadcrumbs.push({
    label: page.title,
    href: `/${page.slug}`,
  });

  // Cast content to proper type
  const content = page.content as any;
  
  // Generate schemas
  const schemas = [];

  // Article schema
  schemas.push(
    createArticleSchema({
      headline: page.h1_title,
      description: page.meta_description || "",
      datePublished: page.publish_date || page.created_at,
      dateModified: page.last_updated,
    })
  );

  // FAQ schema if content has FAQs
  if (content?.faq && Array.isArray(content.faq)) {
    schemas.push(
      createFAQSchema(
        content.faq.map((item: any) => ({
          question: item.question,
          answer: item.answer,
        }))
      )
    );
  }

  // Custom schema markup if provided
  if (page.schema_markup && Object.keys(page.schema_markup as object).length > 0) {
    schemas.push({
      type: "WebPage" as const,
      data: page.schema_markup,
    });
  }

  return (
    <>
      <SEOHead
        title={page.title}
        description={page.meta_description}
        keywords={page.meta_keywords || []}
        canonical={page.canonical_url || `${window.location.origin}/${page.slug}`}
        ogTitle={content?.og_title}
        ogDescription={content?.og_description}
        ogImage={content?.og_image}
      />

      <MultiSchema schemas={schemas} />

      <div className="container max-w-4xl mx-auto px-4 py-8">
        {/* Breadcrumbs */}
        <Breadcrumbs items={breadcrumbs} className="mb-6" />

        {/* Main Content */}
        <article className="prose prose-lg dark:prose-invert max-w-none">
          <h1>{page.h1_title}</h1>

          {/* Render content sections */}
          {content?.sections?.map((section: any, index: number) => (
            <div key={index}>
              {section.heading && <h2>{section.heading}</h2>}
              {section.content && (
                <div dangerouslySetInnerHTML={{ __html: section.content }} />
              )}
            </div>
          ))}

          {/* FAQ Section */}
          {content?.faq && Array.isArray(content.faq) && content.faq.length > 0 && (
            <div className="mt-12">
              <h2>Veelgestelde Vragen</h2>
              <div className="space-y-6">
                {content.faq.map((item: any, index: number) => (
                  <div key={index}>
                    <h3 className="text-lg font-semibold">{item.question}</h3>
                    <p>{item.answer}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </article>

        {/* Last Updated */}
        <div className="mt-8 pt-8 border-t border-border text-sm text-muted-foreground">
          <p>
            Laatst bijgewerkt: {new Date(page.last_updated).toLocaleDateString("nl-BE", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>
      </div>
    </>
  );
}
