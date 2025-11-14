# 📊 Google Search Console Setup Guide

## Stap 1: Sitemap Indienen

### Sitemaps om in te dienen:

1. **Hoofdindex (Primair):**
   ```
   https://wietforum.be/sitemap.xml
   ```
   Deze verwijst automatisch naar alle sub-sitemaps.

2. **Individuele Sitemaps (Optioneel, maar aanbevolen):**
   ```
   https://wietforum.be/sitemap-pages.xml
   https://wietforum.be/sitemap-cannabis.xml
   https://wietforum.be/sitemap-forums.xml
   https://wietforum.be/sitemap-topics.xml
   ```

### Hoe in te dienen:
1. Ga naar [Google Search Console](https://search.google.com/search-console)
2. Selecteer je property: `wietforum.be`
3. Ga naar **Sitemaps** in het linker menu
4. Voer in: `sitemap.xml`
5. Klik op **Indienen**

### ⏱️ Verwachte Timeline:
- **Direct na indienen:** Status = "Ingediend"
- **Na 24-48 uur:** Status = "Succesvol" (indien geen errors)
- **Indexering:** Kan 1-7 dagen duren voor nieuwe pagina's in zoekresultaten verschijnen

---

## Stap 2: Verificatie van Eigendom

### Methoden (Kies één):

**1. HTML File Upload (Aanbevolen):**
- Google geeft een bestand zoals `google123abc.html`
- Upload naar `/public/` folder
- Bestand moet beschikbaar zijn op: `https://wietforum.be/google123abc.html`

**2. HTML Tag in `<head>`:**
- Voeg meta tag toe aan `src/components/seo/SEOHead.tsx`:
  ```html
  <meta name="google-site-verification" content="jouw_code_hier" />
  ```

**3. Google Analytics (Als je GA4 gebruikt):**
- Automatisch geverifieerd als je GA tracking code hebt

**4. Google Tag Manager:**
- Automatisch geverifieerd als je GTM gebruikt

---

## Stap 3: Indexatie Controleren

### Check welke pagina's geïndexeerd zijn:

**Via GSC:**
1. Ga naar **Overzicht** → **Dekking**
2. Bekijk:
   - ✅ **Geldig**: Aantal geïndexeerde pagina's
   - ⚠️ **Geldig met waarschuwingen**: Check deze!
   - ❌ **Fout**: Moet je fixen
   - 🚫 **Uitgesloten**: Kan normaal zijn (noindex pagina's)

**Verwachte Aantallen:**
- **Cannabis SEO pagina's:** 20 (pillar + provinces + cities)
- **Forum categorieën:** ~5-10
- **Forum topics:** Top 1000 (dynamisch)
- **Statische pagina's:** ~10

### Manual Indexing (Voor snellere indexatie):

1. Ga naar **URL-inspectie** (zoekbalk bovenaan GSC)
2. Voer URL in: `https://wietforum.be/cannabis-belgie`
3. Klik **Indexering aanvragen**
4. Herhaal voor alle belangrijke pagina's (max 10-15 per dag)

**⚠️ Let op:** Gebruik dit spaarzaam, Google heeft een rate limit.

---

## Stap 4: Performance Monitoring

### Key Metrics om te volgen:

**1. Impressies (Aantal keer in zoekresultaten):**
- Week 1-2: 0-50 (normaal)
- Maand 1: 100-500
- Maand 3: 1000-5000
- Maand 6: 5000-20000

**2. Clicks (Aantal clicks vanuit Google):**
- Week 1-2: 0-5
- Maand 1: 10-50
- Maand 3: 100-500
- Maand 6: 500-2000

**3. CTR (Click Through Rate):**
- Target: 2-5% gemiddeld
- Pillar pages: 3-8%
- Long-tail pages: 1-3%

**4. Gemiddelde Positie:**
- Maand 1: 30-50 (voor long-tail)
- Maand 3: 15-30
- Maand 6: 8-20
- Jaar 1: 3-10 (voor top keywords)

### Waar te vinden in GSC:
- **Prestaties** → **Zoekresultaten**
- Filter op:
  - Datums (laatste 3 maanden, vergelijk met vorige periode)
  - Query's (welke keywords brengen traffic?)
  - Pagina's (welke landing pages presteren?)
  - Land (België, natuurlijk)

---

## Stap 5: Core Web Vitals Check

### Essentieel voor ranking!

**Ga naar: Ervaring → Core Web Vitals**

**Targets:**
- ✅ **LCP (Largest Contentful Paint):** < 2.5s (GROEN)
- ✅ **FID (First Input Delay):** < 100ms (GROEN)
- ✅ **CLS (Cumulative Layout Shift):** < 0.1 (GROEN)

**Als je ROOD of ORANJE scores hebt:**
1. Klik op het rapport voor details
2. Fix de specifieke pagina's
3. Request re-indexing na fixes

### Mobiel vs Desktop:
- **Mobiel:** Google's primary index (belangrijkste!)
- **Desktop:** Secundair

**⚠️ Als mobiel slecht scoort, rank je niet goed.**

---

## Stap 6: Mobile Usability

**Ga naar: Ervaring → Mobiele Bruikbaarheid**

**Check voor:**
- ❌ Tekst te klein om te lezen
- ❌ Clickable elements te dicht bij elkaar
- ❌ Content breder dan scherm
- ❌ Viewport niet ingesteld

**Alles moet GROEN zijn.**

---

## Stap 7: Security Issues

**Ga naar: Beveiliging en handmatige acties → Beveiligingsproblemen**

**Check:**
- Geen malware
- Geen gehackte content
- Geen misleidende pagina's

**Als je hier problemen ziet:**
- Fix ONMIDDELLIJK
- Google kan je site uit de index halen

---

## Stap 8: Manual Actions Check

**Ga naar: Beveiliging en handmatige acties → Handmatige acties**

**Manual Actions = Google heeft je gepenaliseerd (handmatig)**

**Mogelijke redenen:**
- Spammy backlinks
- Keyword stuffing
- Cloaking
- Unnatural links

**Als je een manual action hebt:**
1. Fix het probleem grondig
2. Dien een **Reconsideration Request** in
3. Wacht op Google's review (2-4 weken)

**⚠️ Zonder fix: je rankt niet.**

---

## Stap 9: Coverage Report Analysis

**Ga naar: Indexering → Pagina's**

### Categories:

**1. Fout (ROOD):**
- **Server error (5xx):** Server probleem, fix hosting
- **404 Not Found:** Pagina bestaat niet, fix de link of 301 redirect
- **Soft 404:** Pagina zegt 200 maar lijkt op 404, add content
- **Redirect error:** Redirect chain te lang, fix redirects

**2. Geldig met waarschuwingen (GEEL):**
- **Geïndexeerd, hoewel geblokkeerd door robots.txt:** Check robots.txt
- **Pagina geïndexeerd zonder sitemap:** Add to sitemap

**3. Uitgesloten (GRIJS):**
- **Noindex tag:** Intentioneel? (admin pages = OK)
- **Duplicate content:** Fix canonical tags
- **Soft 404:** Geen content, Google skipt het
- **Blocked by robots.txt:** Intentioneel? Check robots.txt

**4. Geldig (GROEN):**
- ✅ Perfect! Deze pagina's zijn geïndexeerd.

---

## Stap 10: Search Appearance (Structured Data)

**Ga naar: Zoekweergave → Uitgebreide resultaten**

**Check:**
- ✅ FAQ Schema (Rich results eligible)
- ✅ Article Schema (Rich results eligible)
- ✅ Breadcrumb Schema (Rich results eligible)

**Errors hier = Schema markup fout.**

### Validate Schema:
1. Copy page URL
2. Ga naar [Rich Results Test](https://search.google.com/test/rich-results)
3. Paste URL
4. Check voor errors/warnings
5. Fix indien nodig

---

## Stap 11: Links Report

**Ga naar: Links**

### Top Linked Pages (Internal):
- Moet je homepage/pillar pages bovenaan zien
- Als obscure pagina's bovenaan: internal linking probleem

### Top Linking Sites (External):
- Monitor je backlink groei
- Check voor spammy links (disavow indien nodig)

### Top Linking Text (Anchor Text):
- Moet natuurlijk zijn (branded + generic)
- Als alleen "cannabis belgië" = over-optimization (riskant)

---

## Stap 12: Weekly Monitoring Checklist

**Elke Maandag:**
- [ ] Check **Prestaties** tab (last 7 days vs previous)
- [ ] Check nieuwe **Dekkingsproblemen** (Coverage errors)
- [ ] Check **Core Web Vitals** (nog steeds groen?)
- [ ] Check nieuwe **Backlinks** (Links report)
- [ ] Review top **Queries** (keywords die groeien/dalen)

**Red Flags:**
- 🚨 Sudden drop in impressions/clicks (>30%)
- 🚨 Nieuwe coverage errors (>10)
- 🚨 Core Web Vitals gaan van groen naar rood
- 🚨 Manual action penalty

---

## Stap 13: GSC Data Export (Voor Analytics Dashboard)

### API Setup (Optional, voor developers):

**Google Search Console API:**
1. Ga naar [Google Cloud Console](https://console.cloud.google.com/)
2. Create project: "Wietforum SEO"
3. Enable: **Search Console API**
4. Create OAuth 2.0 credentials
5. Integrate in je admin dashboard

**Data je kunt ophalen:**
- Query performance (keywords)
- Page performance (landing pages)
- Click/impression data
- Position tracking

### Manual Export (Eenvoudig):
1. Ga naar **Prestaties**
2. Filter op gewenste data
3. Klik **Exporteren** (rechts boven)
4. Download als CSV/Excel
5. Importeer in je analytics tool

---

## Stap 14: Troubleshooting Common Issues

### Issue: "Ingediend maar niet geïndexeerd"

**Oorzaken:**
1. **Te nieuw:** Wacht 7-14 dagen
2. **Low quality:** Google vindt content niet waardevol genoeg
3. **Duplicate content:** Canonical tags gecheckt?
4. **Crawl budget:** Te veel pagina's, Google crawlt selectief

**Oplossing:**
- Improve content quality (E-E-A-T)
- Add internal links naar de pagina
- Build backlinks naar de pagina
- Request indexing (maar spaarzaam)

### Issue: "Pagina met redirect"

**Oorzaken:**
- 301 redirect chain
- Redirect loop
- Temporary redirect (302) gebruikt in plaats van 301

**Oplossing:**
- Check redirect chain (max 2 redirects)
- Fix redirect loops
- Use 301 (permanent) redirects

### Issue: "Blocked by robots.txt"

**Check:**
1. View robots.txt: `https://wietforum.be/robots.txt`
2. Check of pagina per ongeluk blocked is
3. Fix robots.txt
4. Request re-indexing

### Issue: "Soft 404"

**Oorzaken:**
- Pagina heeft te weinig content
- Pagina lijkt op een "not found" pagina
- Lege pagina

**Oplossing:**
- Add meer content (min 300 woorden)
- Add H1, images, structuur
- Make it look like a real page

---

## Stap 15: Setting Up Alerts

**Email Notificaties:**
1. GSC → **Instellingen** (tandwiel icoon)
2. **Email voorkeuren**
3. Enable:
   - ✅ Site issues (Critical)
   - ✅ Coverage issues (Important)
   - ✅ Manual actions (Critical)
   - ✅ Security issues (Critical)

**Je krijgt email bij:**
- Coverage errors spike
- Manual penalty
- Security breach
- Major drops in performance

---

## Stap 16: Advanced GSC Features

### 1. URL Parameters Tool

**Gebruik als:**
Je hebt URLs met parameters zoals:
- `?utm_source=facebook`
- `?sort=new`
- `?page=2`

**Setup:**
- Ga naar **Legacy tools → URL parameters**
- Tell Google hoe om met parameters om te gaan
- Voorkomt duplicate content issues

### 2. International Targeting

**Als je meerdere talen/regio's target:**
- Ga naar **Legacy tools → International targeting**
- Set target country: België

### 3. Change of Address

**Bij domain verhuizing:**
- Ga naar **Settings → Change of address**
- 301 redirect oude domain → nieuwe domain
- Inform Google via deze tool

---

## 🎯 Success Metrics Timeline

**Week 1-2:**
- ✅ Sitemap ingediend & geaccepteerd
- ✅ 20 cannabis pagina's in sitemap
- ✅ Geen coverage errors
- ⏳ 0-5 impressies (normaal)

**Maand 1:**
- ✅ 15-20 pagina's geïndexeerd
- ✅ Core Web Vitals GROEN
- ✅ 100-500 impressies
- ✅ 10-50 clicks
- 🎯 Eerste long-tail rankings (positie 20-50)

**Maand 3:**
- ✅ Alle 20 cannabis pagina's geïndexeerd
- ✅ 1000-5000 impressies
- ✅ 100-500 clicks
- 🎯 Top 20 voor long-tail keywords
- 🎯 Top 50 voor primaire keywords

**Maand 6:**
- ✅ 5000-20000 impressies
- ✅ 500-2000 clicks
- 🎯 Top 10 voor long-tail keywords
- 🎯 Top 20 voor primaire keywords
- 🎯 Featured snippets voor FAQ's

**Jaar 1:**
- ✅ 50000+ impressies/maand
- ✅ 2000-5000 clicks/maand
- 🎯 Top 5 voor primaire keywords
- 🎯 #1 voor long-tail keywords
- 🎯 Multiple featured snippets
- 🎯 Recognized authority (backlinks groei)

---

## ✅ Final Checklist

**Direct na sitemap indienen:**
- [ ] Sitemap status = "Succesvol" (check na 48u)
- [ ] Alle 5 sub-sitemaps werken
- [ ] Geen errors in Coverage report
- [ ] Core Web Vitals = GROEN
- [ ] Mobile usability = GROEN
- [ ] No security issues
- [ ] No manual actions
- [ ] Schema markup valid (Rich Results Test)
- [ ] robots.txt accessible
- [ ] Email alerts ingeschakeld

**Weekly monitoring:**
- [ ] Performance trends (up/down?)
- [ ] New coverage errors?
- [ ] Core Web Vitals still green?
- [ ] New backlinks?
- [ ] Top queries changes?

**Monthly deep dive:**
- [ ] Export performance data
- [ ] Analyze top/bottom pages
- [ ] Competitor analysis (manual)
- [ ] Content refresh planning
- [ ] Backlink audit

---

## 📚 Resources

**Google Search Console:**
- [Official Help](https://support.google.com/webmasters)
- [Search Console Training](https://developers.google.com/search/docs)

**Schema Testing:**
- [Rich Results Test](https://search.google.com/test/rich-results)
- [Schema.org Documentation](https://schema.org)

**SEO Tools (Free):**
- [Google PageSpeed Insights](https://pagespeed.web.dev/)
- [Mobile-Friendly Test](https://search.google.com/test/mobile-friendly)

**SEO Tools (Paid, optioneel):**
- Ahrefs (backlinks, keywords)
- SEMrush (competition, keywords)
- Screaming Frog (technical audits)

---

## 🚀 Pro Tips

1. **Be Patient:**
   - SEO takes 3-6 months minimum
   - Don't panic if you don't see results week 1
   - Trust the process

2. **Focus on Quality:**
   - 20 perfect pages > 200 mediocre pages
   - Google rewards quality

3. **Monitor, Don't Obsess:**
   - Check GSC weekly, not daily
   - Focus on trends, not daily fluctuations

4. **Fix Technical Issues Fast:**
   - Core Web Vitals issues = ranking killer
   - Mobile issues = ranking killer
   - Fix ASAP

5. **Content > Everything:**
   - Best content wins
   - E-E-A-T signals matter
   - User satisfaction is the ultimate ranking factor

---

**Succes met je SEO! 🎯**
