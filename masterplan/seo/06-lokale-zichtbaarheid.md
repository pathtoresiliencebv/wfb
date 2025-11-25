# 06. Lokale Zichtbaarheid: Provincie & Stad Strategie

Mensen zoeken lokaal. "Wiet kopen Antwerpen" heeft een heel andere intentie dan "Wiet wetgeving".

## De Structuur van Lokale Pagina's

We maken landingspagina's voor elke Vlaamse provincie en de top 10 steden.

**URL Structuur:**
*   `/cannabis-antwerpen` (Provincie)
*   `/cannabis-antwerpen/stad` (Stad)
*   `/cannabis-antwerpen/mechelen`

## Blueprint voor een Stadspagina

**Titel:** Cannabis in [Stad]: Wetgeving, Shops & Community (2025)

**Sectie 1: De Juridische Status in [Stad]**
*   *Direct antwoord:* "Is het legaal?"
*   *Lokale nuance:* "Het parket van [Stad] staat bekend als [Streng/Soepel]. Burgemeester [Naam] focust op [Overlast/Dealer]." (Dit vereist research, maar scoort enorm goed).

**Sectie 2: CBD Winkels in [Stad]**
*   Google Maps embed.
*   Lijst met top 3 CBD shops (eventueel betalende partners in de toekomst).
*   *Waarschuwing:* "Let op: deze shops verkopen geen THC-wiet."

**Sectie 3: Cannabis Social Clubs**
*   Zijn er initiatieven in de buurt? (Bijv. Trekt Uw Plant in Antwerpen - historisch).

**Sectie 4: Community & Forum**
*   **Dynamische Feed:** "Recente forum topics uit regio [Stad]".
*   CTA: "Woon je in [Stad]? Praat mee met stadsgenoten."

## Lokale Zoekwoorden Matrix

| Stad | Zoekvolume | Concurrentie | Unieke Insteek |
| :--- | :--- | :--- | :--- |
| **Antwerpen** | Hoog | Hoog | Focus op "War on Drugs", haven, nultolerantie. |
| **Gent** | Hoog | Medium | Focus op studenten, progressief beleid? |
| **Maasmechelen** | Laag | Laag | Grensgebied (coffeeshops NL dichtbij). |
| **Brussel** | Hoog | Hoog | Complexiteit 19 gemeenten, Marollen, Matonge. |

## Google My Business? (Nee)

Omdat we geen fysieke locatie hebben, kunnen we **geen** Google My Business (Google Maps) listing aanmaken. Doe dit niet (risico op ban). We moeten organisch ranken met de stadspagina's.

## Schema Markup voor Lokaal

Gebruik `AreaServed` in je Organization schema op deze pagina's.

```json
{
  "@context": "https://schema.org",
  "@type": "Service",
  "serviceType": "Cannabis Informatie",
  "areaServed": {
    "@type": "City",
    "name": "Antwerpen"
  }
}
```

