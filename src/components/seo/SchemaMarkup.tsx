import { Helmet } from "react-helmet-async";

interface SchemaMarkupProps {
  type: "Article" | "WebPage" | "FAQPage" | "BreadcrumbList" | "Organization" | "WebSite" | "DiscussionForumPosting" | "Place";
  data: Record<string, any>;
}

export function SchemaMarkup({ type, data }: SchemaMarkupProps) {
  const baseUrl = window.location.origin;

  const generateSchema = () => {
    let baseSchema: any = {
      "@context": "https://schema.org",
      "@type": type,
    };

    if (type === "Article") {
      baseSchema = {
        ...baseSchema,
        headline: data.headline,
        image: data.image,
        datePublished: data.datePublished,
        dateModified: data.dateModified,
        author: data.authorName
          ? { "@type": "Person", name: data.authorName }
          : { "@type": "Organization", name: "Wietforum België" },
        publisher: {
          "@type": "Organization",
          name: "Wietforum België",
          logo: {
            "@type": "ImageObject",
            url: `${baseUrl}/lovable-uploads/a6faafc3-e2bd-47ec-8de8-603497930570.png`,
          },
        },
        description: data.description,
      };
    } else if (type === "DiscussionForumPosting") {
      baseSchema = {
        ...baseSchema,
        headline: data.headline,
        text: data.text,
        author: {
          "@type": "Person",
          name: data.authorName,
        },
        interactionStatistic: {
          "@type": "InteractionCounter",
          interactionType: "https://schema.org/CommentAction",
          userInteractionCount: data.interactionCount,
        },
        datePublished: data.datePublished,
      };
    } else if (type === "Place") {
      baseSchema = {
        ...baseSchema,
        name: data.name,
        address: {
          "@type": "PostalAddress",
          addressLocality: data.addressLocality,
          addressRegion: data.addressRegion,
          addressCountry: "BE",
        },
        description: data.description,
      };
    } else if (type === "FAQPage") {
      baseSchema = {
        ...baseSchema,
        mainEntity: data.questions?.map((q: any) => ({
          "@type": "Question",
          name: q.question,
          acceptedAnswer: {
            "@type": "Answer",
            text: q.answer,
          },
        })),
      };
    } else if (type === "BreadcrumbList") {
      baseSchema = {
        ...baseSchema,
        itemListElement: data.items?.map((item: any, index: number) => ({
          "@type": "ListItem",
          position: index + 1,
          name: item.name,
          item: item.url.startsWith("http") ? item.url : `${baseUrl}${item.url}`,
        })),
      };
    } else if (type === "Organization") {
      baseSchema = {
        ...baseSchema,
        name: "Wietforum België",
        url: baseUrl,
        logo: `${baseUrl}/lovable-uploads/a6faafc3-e2bd-47ec-8de8-603497930570.png`,
        sameAs: [
          "https://facebook.com/wietforum",
          "https://instagram.com/wietforum",
        ],
        contactPoint: {
          "@type": "ContactPoint",
          contactType: "Customer Support",
          email: "info@wietforum.be",
        },
      };
    } else {
      // Fallback for WebPage or generic
      baseSchema = { ...baseSchema, ...data };
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
    authorName: data.author,
  },
});

export const createBreadcrumbSchema = (items: Array<{ name: string; url: string }>) => ({
  type: "BreadcrumbList" as const,
  data: { items },
});

export const createFAQSchema = (faqs: Array<{ question: string; answer: string }>) => ({
  type: "FAQPage" as const,
  data: { questions: faqs },
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

export const createForumPostingSchema = (data: {
  headline: string;
  text: string;
  authorName: string;
  datePublished: string;
  interactionCount: number;
}) => ({
  type: "DiscussionForumPosting" as const,
  data: {
    headline: data.headline,
    text: data.text,
    authorName: data.authorName,
    datePublished: data.datePublished,
    interactionCount: data.interactionCount,
  },
});

export const createPlaceSchema = (data: {
  name: string;
  addressLocality: string;
  addressRegion: string;
  description: string;
}) => ({
  type: "Place" as const,
  data: {
    name: data.name,
    addressLocality: data.addressLocality,
    addressRegion: data.addressRegion,
    description: data.description,
  },
});

export const createOrganizationSchema = (data: {
  name: string;
  description?: string;
  logo?: string;
  image?: string;
  url?: string;
  sameAs?: string[];
}) => ({
  type: "Organization" as const,
  data: {
    name: data.name,
    description: data.description,
    logo: data.logo,
    image: data.image,
    url: data.url,
    sameAs: data.sameAs,
  },
});