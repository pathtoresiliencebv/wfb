import { Helmet } from "react-helmet-async";

interface SEOHeadProps {
  title: string;
  description?: string;
  keywords?: string[];
  canonical?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  ogType?: string;
  twitterCard?: string;
  structuredData?: Record<string, any>;
  noindex?: boolean;
  nofollow?: boolean;
  publishedTime?: string;
  modifiedTime?: string;
}

export function SEOHead({
  title,
  description,
  keywords = [],
  canonical,
  ogTitle,
  ogDescription,
  ogImage,
  ogType = "website",
  twitterCard = "summary_large_image",
  structuredData,
  noindex = false,
  nofollow = false,
  publishedTime,
  modifiedTime,
}: SEOHeadProps) {
  const baseUrl = window.location.origin;
  const currentUrl = canonical || window.location.href;
  const fullTitle = title.includes("Wietforum") ? title : `${title} | Wietforum België`;
  
  const defaultDescription = "Dé community voor cannabis enthousiastelingen in België. Discussieer wetgeving, deling ervaringen en vind betrouwbare informatie.";
  const finalDescription = description || defaultDescription;

  const defaultImage = `${baseUrl}/lovable-uploads/a6faafc3-e2bd-47ec-8de8-603497930570.png`;
  const finalOgImage = ogImage || defaultImage;

  const robotsContent = [
    noindex ? "noindex" : "index",
    nofollow ? "nofollow" : "follow",
  ].join(", ");

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={finalDescription} />
      {keywords.length > 0 && <meta name="keywords" content={keywords.join(", ")} />}
      <link rel="canonical" href={currentUrl} />
      <meta name="robots" content={robotsContent} />

      {/* Open Graph */}
      <meta property="og:site_name" content="Wietforum België" />
      <meta property="og:title" content={ogTitle || fullTitle} />
      <meta property="og:description" content={ogDescription || finalDescription} />
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={currentUrl} />
      <meta property="og:image" content={finalOgImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:locale" content="nl_BE" />
      {publishedTime && <meta property="article:published_time" content={publishedTime} />}
      {modifiedTime && <meta property="article:modified_time" content={modifiedTime} />}

      {/* Twitter Card */}
      <meta name="twitter:card" content={twitterCard} />
      <meta name="twitter:title" content={ogTitle || fullTitle} />
      <meta name="twitter:description" content={ogDescription || finalDescription} />
      <meta name="twitter:image" content={finalOgImage} />

      {/* Structured Data */}
      {structuredData && (
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      )}

      {/* Additional SEO */}
      <meta name="author" content="Wietforum België" />
      <meta name="language" content="nl-BE" />
      <meta name="revisit-after" content="7 days" />
    </Helmet>
  );
}
