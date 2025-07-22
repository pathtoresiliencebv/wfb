
# Product Requirements Document - Wietforum België

## 1. Product Visie

### Missie
Wietforum België creëert een veilige, educatieve en ondersteunende online gemeenschap voor cannabis enthousiastelingen in België, waar legale informatie, ervaringen en kennis gedeeld kunnen worden.

### Doelstellingen
- Een centraal platform voor de Belgische cannabis gemeenschap
- Educatie over verantwoord gebruik en wetgeving
- Ondersteuning voor medicinale gebruikers
- Bevordering van harm reduction

## 2. Doelgroep

### Primaire Gebruikers
- **Medicinale gebruikers** (25-65 jaar): Zoeken informatie over therapeutische toepassingen
- **Recreatieve enthousiastelingen** (21-45 jaar): Delen ervaringen en tips
- **Professionals** (25-55 jaar): Artsen, apothekers, onderzoekers
- **Nieuwsgierigen** (18-35 jaar): Willen leren over cannabis

### Gebruikersbehoeften
- Betrouwbare, actuele informatie over Belgische wetgeving
- Veilige ruimte voor het delen van ervaringen
- Toegang tot expertise en ondersteuning
- Community building en sociale connectie

## 3. Functionele Requirements

### 3.1 Kern Functionaliteiten

#### Voor Alle Gebruikers
- **Account Management**: Registratie, login, profiel beheer
- **Forum Navigatie**: Browsen door verschillende categorieën
- **Content Creatie**: Topics starten, reageren op posts
- **Zoekfunctionaliteit**: Zoeken door content en gebruikers
- **Notificaties**: Real-time updates over activiteit

#### Voor Geregistreerde Gebruikers
- **Persoonlijk Dashboard**: Overzicht van eigen activiteit
- **Private Messaging**: Directe communicatie tussen gebruikers
- **Favorieten**: Bookmarken van belangrijke topics
- **Reputatie Systeem**: Punten en badges voor kwaliteitscontributie

### 3.2 Forum Categorieën

1. **Wetgeving & Nieuws**
   - Belgische cannabis wetgeving
   - Actuele ontwikkelingen
   - Internationale vergelijkingen

2. **Medicinaal Gebruik**
   - Therapeutische toepassingen
   - Ervaringen van patiënten
   - Artsen en specialisten corner

3. **Teelt & Horticultuur**
   - Indoor/outdoor growing tips
   - Strain informatie
   - Equipment discussies

4. **Harm Reduction**
   - Veilig gebruik
   - Dosering en effecten
   - Hulp zoeken

5. **Community**
   - Algemene discussies
   - Events en meetups
   - Introductie nieuwe leden

## 4. Technische Requirements

### 4.1 Platform Specificaties
- **Frontend**: React 18 met TypeScript
- **Styling**: Tailwind CSS met custom design system
- **State Management**: Tanstack Query voor server state
- **Routing**: React Router v6
- **Componenten**: Radix UI componenten

### 4.2 Prestatie Eisen
- **Loading tijd**: < 2 seconden voor eerste pagina load
- **Responsiviteit**: Volledige mobile-first design
- **Toegankelijkheid**: WCAG 2.1 AA compliant
- **SEO**: Server-side rendering waar nodig

## 5. Design Requirements

### 5.1 Kleurenschema
```css
/* Light Mode */
--primary: #b2bd88;        /* Cannabis groen uit logo */
--background: #fefefe;     /* Zuiver wit */
--accent: #1a237e;         /* Navy blue uit logo */
--text: #2d3748;           /* Donkergrijs voor leesbaarheid */

/* Dark Mode */
--primary: #b2bd88;        /* Consistent groen */
--background: #0f0f23;     /* Donkere navy */
--surface: #1e1e3a;        /* Lichtere surface kleur */
--text: #f7fafc;           /* Lichte tekst */
```

### 5.2 Typografie
- **Primary Font**: Inter (modern, legible)
- **Heading Font**: Poppins (friendly, accessible)
- **Code Font**: Fira Code (voor technische discussies)

### 5.3 Componenten
- **Cards**: Rounded corners, subtle shadows
- **Buttons**: Consistent met primary kleur
- **Forms**: Toegankelijke input fields
- **Navigation**: Intuitive sidebar en header

## 6. Compliance & Veiligheid

### 6.1 Juridische Compliance
- **Content Moderatie**: Actieve moderatie tegen illegale content
- **Age Verification**: 18+ verificatie systeem
- **Privacy**: GDPR compliant data handling
- **Terms of Service**: Duidelijke gebruiksvoorwaarden

### 6.2 Data Beveiliging
- **Encryptie**: End-to-end voor private berichten
- **Anonymiteit**: Optionele anonieme posting
- **Data Retention**: Gebruiker gecontroleerde data retention
- **Moderation Tools**: Geavanceerde spam en content filtering

## 7. Success Metrics

### 7.1 Gebruikers Metrics
- **Daily Active Users (DAU)**
- **Monthly Active Users (MAU)**
- **User Retention Rate**
- **Time Spent on Platform**

### 7.2 Content Metrics
- **Posts per Day**
- **Response Rate**
- **Quality Score** (door moderatie beoordeeld)
- **Knowledge Base Growth**

### 7.3 Community Metrics
- **Member Satisfaction Score**
- **Expert Participation Rate**
- **Problem Resolution Time**
- **Community Events Attendance**

## 8. Roadmap Prioriteiten

### Phase 1 (MVP - Maand 1-3)
- Basis forum functionaliteit
- User accounts en authenticatie
- Core categorieën
- Basic moderation tools

### Phase 2 (Maand 4-6)
- Private messaging
- Advanced search
- Reputation systeem
- Mobile app

### Phase 3 (Maand 7-12)
- Expert verification systeem
- Advanced analytics
- Community events platform
- API voor third-party integraties

## 9. Risico's & Mitigatie

### 9.1 Juridische Risico's
- **Risico**: Illegale content posting
- **Mitigatie**: Proactieve moderatie en duidelijke richtlijnen

### 9.2 Technische Risico's
- **Risico**: Platform overbelasting
- **Mitigatie**: Scalable architecture en monitoring

### 9.3 Community Risico's
- **Risico**: Toxische community gedrag
- **Mitigatie**: Sterke community guidelines en moderatie
