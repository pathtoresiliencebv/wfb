
# Design System - Wietforum België

## Kleurpalet

### Light Mode
```css
:root {
  /* Primary Colors - Gebaseerd op Logo */
  --primary: #b2bd88;           /* Cannabis groen uit logo */
  --primary-foreground: #ffffff;
  --primary-muted: #c8d1a3;     /* Lichtere variant */
  
  /* Secondary Colors - Navy uit Logo */
  --secondary: #1a237e;         /* Navy blue uit logo */
  --secondary-foreground: #ffffff;
  --secondary-muted: #3949ab;
  
  /* Background Colors */
  --background: #fefefe;         /* Zuiver wit uit logo */
  --surface: #f8f9fa;           /* Zeer lichte grijstint */
  --card: #ffffff;              /* Card achtergrond */
  
  /* Text Colors */
  --foreground: #2d3748;        /* Hoofdtekst */
  --muted-foreground: #718096;  /* Secundaire tekst */
  
  /* Accent Colors */
  --accent: #b2bd88;            /* Matches primary */
  --accent-foreground: #ffffff;
  
  /* Status Colors */
  --success: #48bb78;           /* Groen voor succes */
  --warning: #ed8936;           /* Oranje voor waarschuwing */
  --error: #f56565;             /* Rood voor errors */
  --info: #4299e1;             /* Blauw voor info */
  
  /* Border & Dividers */
  --border: #e2e8f0;           /* Lichte borders */
  --input: #e2e8f0;            /* Input borders */
  --ring: #b2bd88;             /* Focus ring - primary kleur */
}
```

### Dark Mode
```css
.dark {
  /* Primary Colors - Behouden voor consistentie */
  --primary: #b2bd88;           /* Consistent groen */
  --primary-foreground: #1a1a2e;
  --primary-muted: #9aa875;
  
  /* Secondary Colors */
  --secondary: #4c63d2;         /* Lichtere navy voor dark mode */
  --secondary-foreground: #ffffff;
  --secondary-muted: #667eea;
  
  /* Background Colors */
  --background: #0f0f23;        /* Donkere navy geïnspireerd door logo */
  --surface: #1e1e3a;          /* Lichtere surface */
  --card: #252547;             /* Card achtergrond */
  
  /* Text Colors */
  --foreground: #f7fafc;        /* Lichte tekst */
  --muted-foreground: #a0aec0;  /* Gemuted tekst */
  
  /* Accent Colors */
  --accent: #b2bd88;            /* Consistent met light mode */
  --accent-foreground: #1a1a2e;
  
  /* Status Colors - Aangepast voor dark mode */
  --success: #68d391;
  --warning: #fbb560;
  --error: #fc8181;
  --info: #63b3ed;
  
  /* Border & Dividers */
  --border: #2d3748;
  --input: #4a5568;
  --ring: #b2bd88;
}
```

## Typografie

### Font Stack
```css
/* Primary Font - Voor body tekst */
--font-sans: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;

/* Heading Font - Voor headers */
--font-heading: 'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;

/* Monospace - Voor code en technische content */
--font-mono: 'Fira Code', 'Menlo', 'Monaco', 'Consolas', monospace;
```

### Type Scale
```css
/* Font Sizes */
--text-xs: 0.75rem;      /* 12px */
--text-sm: 0.875rem;     /* 14px */
--text-base: 1rem;       /* 16px */
--text-lg: 1.125rem;     /* 18px */
--text-xl: 1.25rem;      /* 20px */
--text-2xl: 1.5rem;      /* 24px */
--text-3xl: 1.875rem;    /* 30px */
--text-4xl: 2.25rem;     /* 36px */

/* Line Heights */
--leading-tight: 1.25;
--leading-normal: 1.5;
--leading-relaxed: 1.75;

/* Font Weights */
--font-normal: 400;
--font-medium: 500;
--font-semibold: 600;
--font-bold: 700;
```

## Spacing System

```css
/* Spacing Scale - Gebaseerd op 4px baseline */
--space-1: 0.25rem;      /* 4px */
--space-2: 0.5rem;       /* 8px */
--space-3: 0.75rem;      /* 12px */
--space-4: 1rem;         /* 16px */
--space-5: 1.25rem;      /* 20px */
--space-6: 1.5rem;       /* 24px */
--space-8: 2rem;         /* 32px */
--space-10: 2.5rem;      /* 40px */
--space-12: 3rem;        /* 48px */
--space-16: 4rem;        /* 64px */
--space-20: 5rem;        /* 80px */
```

## Border Radius

```css
--radius-none: 0;
--radius-sm: 0.125rem;    /* 2px */
--radius: 0.375rem;       /* 6px */
--radius-md: 0.5rem;      /* 8px */
--radius-lg: 0.75rem;     /* 12px */
--radius-xl: 1rem;        /* 16px */
--radius-full: 9999px;    /* Volledig rond */
```

## Shadows

```css
/* Light Mode Shadows */
--shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
--shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1);
--shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
--shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);

/* Dark Mode Shadows */
.dark {
  --shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.3);
  --shadow: 0 1px 3px 0 rgb(0 0 0 / 0.4), 0 1px 2px -1px rgb(0 0 0 / 0.4);
  --shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.4), 0 2px 4px -2px rgb(0 0 0 / 0.4);
  --shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.4), 0 4px 6px -4px rgb(0 0 0 / 0.4);
}
```

## Component Patterns

### Buttons
```css
/* Primary Button */
.btn-primary {
  background-color: var(--primary);
  color: var(--primary-foreground);
  border-radius: var(--radius);
  padding: var(--space-3) var(--space-4);
  font-weight: var(--font-medium);
  transition: all 0.2s ease;
}

.btn-primary:hover {
  background-color: var(--primary-muted);
  transform: translateY(-1px);
  box-shadow: var(--shadow-md);
}

/* Secondary Button */
.btn-secondary {
  background-color: transparent;
  color: var(--primary);
  border: 1px solid var(--primary);
  border-radius: var(--radius);
  padding: var(--space-3) var(--space-4);
  font-weight: var(--font-medium);
}
```

### Cards
```css
.card {
  background-color: var(--card);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow);
  padding: var(--space-6);
  border: 1px solid var(--border);
  transition: all 0.2s ease;
}

.card:hover {
  box-shadow: var(--shadow-md);
  transform: translateY(-2px);
}
```

### Navigation
```css
.nav-item {
  padding: var(--space-3) var(--space-4);
  border-radius: var(--radius);
  color: var(--muted-foreground);
  transition: all 0.2s ease;
}

.nav-item:hover {
  background-color: var(--accent);
  color: var(--accent-foreground);
}

.nav-item.active {
  background-color: var(--primary);
  color: var(--primary-foreground);
}
```

## Iconografie

### Icon System
- **Primaire icons**: Lucide React (consistent en modern)
- **Grootte**: 16px, 20px, 24px, 32px
- **Stijl**: Outline style voor consistentie
- **Kleur**: Volgt text kleur tenzij anders gespecificeerd

### Cannabis Gerelateerde Icons
- **Leaf icon**: Voor cannabis gerelateerde content
- **Medical cross**: Voor medicinale discussies
- **Scale icon**: Voor wetgeving topics
- **Users icon**: Voor community features

## Responsive Breakpoints

```css
/* Mobile First Approach */
--breakpoint-sm: 640px;    /* Small devices */
--breakpoint-md: 768px;    /* Medium devices */
--breakpoint-lg: 1024px;   /* Large devices */
--breakpoint-xl: 1280px;   /* Extra large devices */
--breakpoint-2xl: 1536px;  /* 2X large devices */
```

## Accessibility Guidelines

### Color Contrast
- **Text op achtergrond**: Minimum 4.5:1 ratio
- **Large text**: Minimum 3:1 ratio
- **UI elementen**: Minimum 3:1 ratio

### Interactive Elements
- **Focus indicators**: Zichtbare focus ring met primary kleur
- **Touch targets**: Minimum 44px voor mobile
- **Keyboard navigation**: Volledige keyboard toegankelijkheid

### Screen Readers
- **Semantic HTML**: Gebruik van juiste HTML elementen
- **ARIA labels**: Voor complexe UI elementen
- **Alt text**: Voor alle decoratieve en informatieve afbeeldingen

## Brand Integration

### Logo Gebruik
- **Primary logo**: Cannabis leaf met "WF" letters
- **Favicon**: Gestileerde cannabis leaf
- **Kleur variants**: Full color, monochrome, inverse

### Brand Voice
- **Tone**: Vriendelijk, professioneel, ondersteunend
- **Style**: Informatief maar toegankelijk
- **Values**: Veiligheid, educatie, community
