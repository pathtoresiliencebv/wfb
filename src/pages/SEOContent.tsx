import { useParams, useLocation } from "react-router-dom";
import { SEOContentPage } from "@/components/seo/SEOContentPage";

export default function SEOContent() {
  const params = useParams();
  const location = useLocation();

  // Build slug from URL path
  // For /cannabis-belgie -> slug: cannabis-belgie
  // For /cannabis-belgie/antwerpen -> slug: cannabis-belgie/antwerpen
  // For /cannabis-belgie/antwerpen/antwerpen-stad -> slug: cannabis-belgie/antwerpen/antwerpen-stad
  const pathParts = location.pathname.split('/').filter(Boolean);
  const slug = pathParts.join('/');

  if (!slug) {
    return (
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-2xl font-bold">Pagina niet gevonden</h1>
        <p className="text-muted-foreground mt-2">
          Deze SEO content pagina bestaat niet.
        </p>
      </div>
    );
  }

  return <SEOContentPage slug={slug} />;
}
