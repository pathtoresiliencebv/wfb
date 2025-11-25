# 03. Technische Excellentie & Forum SEO

Een forum is technisch uitdagend voor SEO. We moeten zorgen dat Google de waardevolle content vindt en de "ruis" negeert.

## 1. Forum-Specifieke Uitdagingen Oplossen

### Paginering (Pagination)
Forums hebben topics met honderden pagina's.
*   **Probleem:** Google crawlt pagina 1 t/m 50, maar de waardevolle info staat verspreid.
*   **Oplossing:**
    *   Gebruik `rel="next"` en `rel="prev"` tags in de `<head>`.
    *   Zorg dat de **eerste post** (de startpost) altijd zichtbaar is of een snippet toont op elke pagina (indien technisch haalbaar), of focus rankingkracht op pagina 1.
    *   Canonical URL van `topic?page=2` verwijst naar zichzelf, *niet* naar pagina 1 (anders indexeert Google de reacties niet).

### Duplicate Content & Ruis
*   **Probleem:** "Quote" reacties, "Thanks!" reacties, profielpagina's zonder inhoud.
*   **Oplossing:**
    *   User Profile pagina's: `noindex` tenzij de gebruiker >10 posts heeft of "reputatie" heeft.
    *   Zoekresultaten pagina's (`/search?q=...`): Altijd `noindex, follow`.
    *   Login/Register pagina's: `noindex`.

### URL Structuur
*   **Huidig:** `/forums/[slug]/topic/[id]` (Goed!)
*   **Optimalisatie:** Zorg dat de slug de keywords bevat.
    *   *Slecht:* `/topic/12345`
    *   *Goed:* `/topic/12345-is-wiet-legaal-in-belgie`

## 2. Core Web Vitals (Snelheid = Ranking)

Gezien de focus op mobiel gebruik (gebruikers in de zetel, onderweg), is snelheid cruciaal.

*   **LCP (Largest Contentful Paint):**
    *   Optimaliseer afbeeldingen (gebruik WebP, wat we al doen).
    *   Lazy load afbeeldingen "below the fold" (in reacties).
    *   CDN gebruiken voor statische assets.
*   **CLS (Cumulative Layout Shift):**
    *   Reserveer ruimte voor advertenties/banners zodat de tekst niet verspringt als ze laden.
    *   Vaste afmetingen voor avatars en afbeeldingen in posts.

## 3. Structured Data (Schema.org)

Dit helpt Google te begrijpen dat we een FORUM zijn, geen blog.

### DiscussionForumPosting Schema
Voor elk topic:
```json
{
  "@context": "https://schema.org",
  "@type": "DiscussionForumPosting",
  "headline": "Is wiet legaal in 2025?",
  "text": "Ik vroeg me af of de regels veranderd zijn...",
  "author": {
    "@type": "Person",
    "name": "Gebruikersnaam"
  },
  "interactionStatistic": {
    "@type": "InteractionCounter",
    "interactionType": "https://schema.org/CommentAction",
    "userInteractionCount": 42
  }
}
```

### Q&A Page Schema
Voor topics die een duidelijke **vraag** zijn (bijv. in de sectie "Juridisch Advies"):
*   Markeer de startpost als `Question`.
*   Markeer het beste antwoord (indien gemarkeerd door moderator/community) als `AcceptedAnswer`.
*   Markeer andere antwoorden als `SuggestedAnswer`.

### BreadcrumbList Schema
Cruciaal voor navigatie in zoekresultaten:
`Home > Forums > Wetgeving > Is wiet legaal?`

## 4. Mobiele Optimalisatie

*   **Touch Targets:** Knoppen (zoals "Reageer", "Volgende Pagina") moeten groot genoeg zijn (min 48px).
*   **Leesbaarheid:** Lettergrootte minimaal 16px om inzoomen te voorkomen.
*   **Menu:** Hamburger menu moet soepel werken en toegang geven tot alle categorieën.

## 5. Crawl Budget Optimalisatie

We willen niet dat Google tijd verspilt aan onzin.
*   **Robots.txt:** Blokkeer admin, scripts, en sorteer-parameters (`?sort=date_desc`).
*   **Sitemap.xml:**
    *   Automatisch updaten bij nieuwe topics.
    *   Splitsen per categorie indien te groot.
    *   Prioriteit geven aan "Sticky" topics en FAQ's.

