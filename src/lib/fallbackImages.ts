// Fallback images voor forum categorieën wanneer database images niet laden
export const FALLBACK_IMAGES: Record<string, string> = {
  'top-verkopers-gescreend': 'https://images.unsplash.com/photo-1607083206968-13611e3d76db?w=800&h=600&fit=crop&q=80',
  'wiet-online-kopen': 'https://images.unsplash.com/photo-1605174738892-5f36e06e9322?w=800&h=600&fit=crop&q=80',
  'wiet-gezocht': 'https://images.unsplash.com/photo-1530651788726-1dbf58eeef1f?w=800&h=600&fit=crop&q=80',
  'lokale-leveranciers': 'https://images.unsplash.com/photo-1524661135-423995f22d0b?w=800&h=600&fit=crop&q=80',
  'forum-regelement': 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=800&h=600&fit=crop&q=80',
  'algemeen-forum': 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800&h=600&fit=crop&q=80',
  'algemeen': 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800&h=600&fit=crop&q=80',
  'groei': 'https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?w=800&h=600&fit=crop&q=80',
  'medical': 'https://images.unsplash.com/photo-1631549916768-4119b2e5f926?w=800&h=600&fit=crop&q=80',
  'wetgeving': 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=800&h=600&fit=crop&q=80',
  'strains': 'https://images.unsplash.com/photo-1530836176881-098f8aecd5ed?w=800&h=600&fit=crop&q=80',
  'consumptie': 'https://images.unsplash.com/photo-1556910109-c4d2b2e9f2bc?w=800&h=600&fit=crop&q=80',
  'nieuws': 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800&h=600&fit=crop&q=80',
  'offtopic': 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800&h=600&fit=crop&q=80',
  'default': 'https://images.unsplash.com/photo-1523741543316-beb7fc7023d8?w=800&h=600&fit=crop&q=80'
};

export function getFallbackImage(slug: string): string {
  return FALLBACK_IMAGES[slug] || FALLBACK_IMAGES.default;
}
