# Wiet Forum België

Het grootste cannabis forum van België - een moderne, veilige en gebruiksvriendelijke community platform.

## Over het project

**Wiet Forum België** is een volledig functioneel forum platform gebouwd voor de Belgische cannabis community. Het platform biedt een veilige ruimte voor discussies, kennisdeling en community building.

## Hoofdfuncties

- 🌿 **Cannabis-gericht**: Specifiek ontworpen voor de Belgische cannabis community
- 👥 **Gebruikersbeheer**: Registratie, profielen, rollen en moderatie
- 💬 **Forum systeem**: Topics, replies, categorieën en tags
- 🏆 **Gamification**: Punten, achievements en leaderboards
- 🔒 **Veiligheid**: Two-factor authenticatie, content moderatie
- 📱 **Mobile-first**: Responsive design en PWA functionaliteit
- ⚡ **Real-time**: Live notificaties en updates
- 🎨 **Theming**: Dark/light mode support

## Technische specificaties

- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS, Radix UI components
- **Backend**: Supabase (PostgreSQL, Auth, Storage)
- **State Management**: React Query, Context API
- **Real-time**: Supabase subscriptions
- **PWA**: Service Worker, offline support
- **Hosting**: Vercel/Netlify ready

## Development setup

Vereisten: Node.js & npm - [installeer met nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

```sh
# Stap 1: Clone de repository
git clone <YOUR_GIT_URL>

# Stap 2: Navigeer naar project directory
cd <YOUR_PROJECT_NAME>

# Stap 3: Installeer dependencies
npm i

# Stap 4: Start development server
npm run dev
```

## Project structuur

```
src/
├── components/          # Herbruikbare UI componenten
│   ├── admin/          # Admin panel componenten
│   ├── auth/           # Authenticatie componenten
│   ├── feed/           # Forum feed componenten
│   └── ui/             # Basis UI componenten
├── hooks/              # Custom React hooks
├── pages/              # Route componenten
├── contexts/           # React contexts
└── integrations/       # Externe integraties (Supabase)
```

## Licentie

Dit project is eigendom van Wiet Forum België.