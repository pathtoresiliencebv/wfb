import { Helmet } from "react-helmet-async";

interface SchemaMarkupProps {
  type: "Article" | "WebPage" | "FAQPage" | "BreadcrumbList" | "Organization" | "WebSite";
  data: Record<string, any>;
}

export function SchemaMarkup({ type, data }: SchemaMarkupProps) {
  const baseUrl = window.location.origin;

  const generateSchema = () => {
    const baseSchema: any = {
      "@context": "https://schema.org",
      "@type": type,
      ...data,
    };

    // Add default organization data if not present
    if (type === "Article" && !data.publisher) {
      baseSchema.publisher = {
        "@type": "Organization",
        name: "Wietforum België",
        logo: {
          "@type": "ImageObject",
          url: `${baseUrl}/lovable-uploads/a6faafc3-e2bd-47ec-8de8-603497930570.png`,
        },
      };
    }

    return baseSchema;
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(generateSchema())}
      </script>
    </Helmet>
  );
}

// Helper component for multiple schemas
interface MultiSchemaProps {
  schemas: Array<{ type: SchemaMarkupProps["type"]; data: Record<string, any> }>;
}

export function MultiSchema({ schemas }: MultiSchemaProps) {
  return (
    <>
      {schemas.map((schema, index) => (
        <SchemaMarkup key={index} type={schema.type} data={schema.data} />
      ))}
    </>
  );
}

// Predefined schema generators
export const createArticleSchema = (data: {
  headline: string;
  description: string;
  image?: string;
  datePublished: string;
  dateModified: string;
  author?: string;
}) => ({
  type: "Article" as const,
  data: {
    headline: data.headline,
    description: data.description,
    image: data.image || `${window.location.origin}/lovable-uploads/a6faafc3-e2bd-47ec-8de8-603497930570.png`,
    datePublished: data.datePublished,
    dateModified: data.dateModified,
    author: data.author
      ? {
          "@type": "Person",
          name: data.author,
        }
      : {
          "@type": "Organization",
          name: "Wietforum België",
        },
  },
});

export const createBreadcrumbSchema = (items: Array<{ name: string; url: string }>) => ({
  type: "BreadcrumbList" as const,
  data: {
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@id": item.url,
        name: item.name,
      },
    })),
  },
});

export const createFAQSchema = (faqs: Array<{ question: string; answer: string }>) => ({
  type: "FAQPage" as const,
  data: {
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  },
});

export const createWebSiteSchema = () => ({
  type: "WebSite" as const,
  data: {
    "@id": `${window.location.origin}/#website`,
    url: window.location.origin,
    name: "Wietforum België",
    description: "Dé community voor cannabis enthousiastelingen in België",
    potentialAction: {
      "@type": "SearchAction",
      target: `${window.location.origin}/search?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  },
});
