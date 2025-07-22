
# Technische Specificaties - Wietforum België

## Architecture Overview

### Frontend Architecture
```
React 18 Application
├── TypeScript voor type safety
├── Vite voor build tooling
├── Tailwind CSS voor styling
├── Radix UI voor componenten
└── Tanstack Query voor state management
```

### Backend Architecture (Toekomstig)
```
Node.js Backend
├── Express.js framework
├── PostgreSQL database
├── Redis voor caching
├── Socket.io voor real-time features
└── JWT voor authentication
```

## Technology Stack

### Core Frontend Technologies
- **React 18.3.1**: Component-based UI framework
- **TypeScript**: Type-safe JavaScript development
- **Vite**: Fast build tool en development server
- **React Router v6**: Client-side routing
- **Tailwind CSS**: Utility-first CSS framework

### UI Component Library
- **Radix UI**: Headless UI primitives
- **Lucide React**: Iconen bibliotheek
- **class-variance-authority**: Component variant management
- **clsx & tailwind-merge**: Conditional className utilities

### State Management
- **Tanstack Query v5**: Server state management
- **React Context**: Local state voor UI
- **LocalStorage**: Persistente user preferences
- **Session Storage**: Temporary data storage

### Styling & Theming
```typescript
// Tailwind Config Extensions
export default {
  theme: {
    extend: {
      colors: {
        // Cannabis groen uit logo
        primary: {
          DEFAULT: '#b2bd88',
          foreground: '#ffffff',
          muted: '#c8d1a3',
        },
        // Navy uit logo
        secondary: {
          DEFAULT: '#1a237e',
          foreground: '#ffffff',
          muted: '#3949ab',
        },
        // Zuiver wit uit logo
        background: '#fefefe',
        // Dark mode kleuren
        dark: {
          background: '#0f0f23',
          surface: '#1e1e3a',
          card: '#252547',
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        heading: ['Poppins', 'sans-serif'],
        mono: ['Fira Code', 'monospace'],
      },
    },
  },
} satisfies Config;
```

## Component Architecture

### Design System Components
```typescript
// Button Component Variants
const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        outline: "border border-primary text-primary hover:bg-primary/10",
        ghost: "hover:bg-primary/10 hover:text-primary",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);
```

### Forum-Specific Components
```typescript
// Post Component Structure
interface Post {
  id: string;
  title: string;
  content: string;
  author: User;
  category: Category;
  tags: Tag[];
  createdAt: Date;
  updatedAt: Date;
  votes: number;
  replyCount: number;
  isSticky: boolean;
  isLocked: boolean;
}

// User Component Structure  
interface User {
  id: string;
  username: string;
  email: string;
  avatar?: string;
  bio?: string;
  reputation: number;
  badges: Badge[];
  isVerified: boolean;
  joinedAt: Date;
  lastSeen: Date;
  isOnline: boolean;
}
```

## Data Management

### API Integration Strategy
```typescript
// Tanstack Query Setup
import { QueryClient } from '@tanstack/react-query';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      cacheTime: 1000 * 60 * 30, // 30 minutes
      retry: 3,
      refetchOnWindowFocus: false,
    },
  },
});

// Example Query Hook
export const useForumPosts = (categoryId?: string) => {
  return useQuery({
    queryKey: ['posts', categoryId],
    queryFn: () => fetchPosts(categoryId),
    enabled: !!categoryId,
  });
};
```

### Local State Management
```typescript
// Theme Context
interface ThemeContextType {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// User Preferences
interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  fontSize: 'small' | 'medium' | 'large';
  compactMode: boolean;
  showAvatars: boolean;
  notificationSettings: NotificationSettings;
}
```

## Performance Optimizations

### Code Splitting Strategy
```typescript
// Route-based code splitting
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Forum = lazy(() => import('./pages/Forum'));
const Profile = lazy(() => import('./pages/Profile'));
const AdminPanel = lazy(() => import('./pages/AdminPanel'));

// Component-based splitting
const RichTextEditor = lazy(() => import('./components/RichTextEditor'));
const ImageUpload = lazy(() => import('./components/ImageUpload'));
```

### Image Optimization
```typescript
// Image loading strategy
interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  priority?: boolean;
  placeholder?: 'blur' | 'empty';
}

const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  width,
  height,
  priority = false,
  placeholder = 'empty'
}) => {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);
  
  return (
    <div className="relative overflow-hidden">
      {!loaded && !error && (
        <div className="absolute inset-0 bg-muted animate-pulse" />
      )}
      <img
        src={src}
        alt={alt}
        width={width}
        height={height}
        loading={priority ? 'eager' : 'lazy'}
        onLoad={() => setLoaded(true)}
        onError={() => setError(true)}
        className={cn(
          "transition-opacity duration-300",
          loaded ? "opacity-100" : "opacity-0"
        )}
      />
    </div>
  );
};
```

## Security Implementation

### Content Security Policy
```typescript
// CSP Headers
const cspDirectives = {
  'default-src': ["'self'"],
  'script-src': ["'self'", "'unsafe-inline'", 'https://trusted-cdn.com'],
  'style-src': ["'self'", "'unsafe-inline'"],
  'img-src': ["'self'", 'data:', 'https:'],
  'connect-src': ["'self'", 'https://api.wietforum.be'],
  'font-src': ["'self'", 'https://fonts.gstatic.com'],
  'frame-ancestors': ["'none'"],
  'base-uri': ["'self'"],
  'form-action': ["'self'"],
};
```

### Input Sanitization
```typescript
// XSS Protection
import DOMPurify from 'dompurify';

const sanitizeHTML = (content: string): string => {
  return DOMPurify.sanitize(content, {
    ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'u', 'a', 'ul', 'ol', 'li', 'blockquote'],
    ALLOWED_ATTR: ['href', 'target', 'rel'],
    ALLOW_DATA_ATTR: false,
  });
};

// Content validation
const validatePost = (content: string): ValidationResult => {
  const errors: string[] = [];
  
  if (content.length < 10) {
    errors.push('Post moet minimaal 10 karakters bevatten');
  }
  
  if (content.length > 10000) {
    errors.push('Post mag maximaal 10.000 karakters bevatten');
  }
  
  // Check for prohibited content
  const prohibitedWords = ['spam', 'illegal']; // Configured list
  const containsProhibited = prohibitedWords.some(word => 
    content.toLowerCase().includes(word.toLowerCase())
  );
  
  if (containsProhibited) {
    errors.push('Post bevat niet-toegestane content');
  }
  
  return {
    isValid: errors.length === 0,
    errors,
  };
};
```

## Progressive Web App Features

### Service Worker Configuration
```typescript
// Service Worker for offline functionality
const CACHE_NAME = 'wietforum-v1';
const urlsToCache = [
  '/',
  '/static/css/main.css',
  '/static/js/main.js',
  '/manifest.json',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        return response || fetch(event.request);
      })
  );
});
```

### Web App Manifest
```json
{
  "name": "Wietforum België",
  "short_name": "Wietforum",
  "description": "Cannabis community platform voor België",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#0f0f23",
  "theme_color": "#b2bd88",
  "icons": [
    {
      "src": "/icons/icon-192x192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/icons/icon-512x512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ],
  "categories": ["social", "lifestyle"],
  "lang": "nl-BE"
}
```

## Accessibility Implementation

### Screen Reader Support
```typescript
// Accessible navigation
const AccessibleNavigation: React.FC = () => {
  return (
    <nav role="navigation" aria-label="Hoofd navigatie">
      <ul>
        <li>
          <Link 
            to="/feed" 
            aria-current={location.pathname === '/feed' ? 'page' : undefined}
          >
            <Home aria-hidden="true" />
            <span>Feed</span>
          </Link>
        </li>
        <li>
          <Link 
            to="/forums"
            aria-current={location.pathname === '/forums' ? 'page' : undefined}
          >
            <MessageSquare aria-hidden="true" />
            <span>Forums</span>
          </Link>
        </li>
      </ul>
    </nav>
  );
};
```

### Keyboard Navigation
```typescript
// Focus management
const useFocusManagement = () => {
  const focusElement = useCallback((selector: string) => {
    const element = document.querySelector(selector) as HTMLElement;
    if (element) {
      element.focus();
    }
  }, []);

  const trapFocus = useCallback((containerElement: HTMLElement) => {
    const focusableElements = containerElement.querySelectorAll(
      'a[href], button, textarea, input, select, [tabindex]:not([tabindex="-1"])'
    );
    
    const firstElement = focusableElements[0] as HTMLElement;
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key === 'Tab') {
        if (e.shiftKey && document.activeElement === firstElement) {
          lastElement.focus();
          e.preventDefault();
        } else if (!e.shiftKey && document.activeElement === lastElement) {
          firstElement.focus();
          e.preventDefault();
        }
      }
    };

    containerElement.addEventListener('keydown', handleTabKey);
    return () => containerElement.removeEventListener('keydown', handleTabKey);
  }, []);

  return { focusElement, trapFocus };
};
```

## Error Handling & Logging

### Error Boundary Implementation
```typescript
interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

class ErrorBoundary extends Component<PropsWithChildren, ErrorBoundaryState> {
  constructor(props: PropsWithChildren) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log error to monitoring service
    console.error('Application error:', error, errorInfo);
    
    // Send to error tracking service (future implementation)
    // errorTrackingService.captureException(error, { extra: errorInfo });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-background">
          <Card className="max-w-md w-full">
            <CardHeader>
              <CardTitle className="text-destructive">Er is iets misgegaan</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                We hebben een onverwachte fout ondervonden. Probeer de pagina te vernieuwen.
              </p>
              <Button onClick={() => window.location.reload()}>
                Pagina vernieuwen
              </Button>
            </CardContent>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}
```

### Logging Strategy
```typescript
// Client-side logging
interface LogEntry {
  level: 'info' | 'warn' | 'error';
  message: string;
  timestamp: Date;
  userId?: string;
  metadata?: Record<string, any>;
}

class Logger {
  private logs: LogEntry[] = [];
  private maxLogs = 100;

  log(level: LogEntry['level'], message: string, metadata?: Record<string, any>) {
    const entry: LogEntry = {
      level,
      message,
      timestamp: new Date(),
      metadata,
    };

    this.logs.push(entry);
    
    if (this.logs.length > this.maxLogs) {
      this.logs.shift();
    }

    // Console output in development
    if (process.env.NODE_ENV === 'development') {
      console[level](message, metadata);
    }
  }

  info(message: string, metadata?: Record<string, any>) {
    this.log('info', message, metadata);
  }

  warn(message: string, metadata?: Record<string, any>) {
    this.log('warn', message, metadata);
  }

  error(message: string, metadata?: Record<string, any>) {
    this.log('error', message, metadata);
  }

  getLogs(): LogEntry[] {
    return [...this.logs];
  }

  clearLogs() {
    this.logs = [];
  }
}

export const logger = new Logger();
```

## Testing Strategy

### Component Testing
```typescript
// Test utilities
import { render, screen, userEvent } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const createTestQueryClient = () => new QueryClient({
  defaultOptions: {
    queries: { retry: false },
    mutations: { retry: false },
  },
});

const TestWrapper: React.FC<PropsWithChildren> = ({ children }) => {
  const queryClient = createTestQueryClient();
  
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        {children}
      </BrowserRouter>
    </QueryClientProvider>
  );
};

// Example component test
describe('PostCard Component', () => {
  const mockPost = {
    id: '1',
    title: 'Test Post',
    content: 'Test content',
    author: { username: 'testuser', avatar: null },
    createdAt: new Date(),
    votes: 5,
    replyCount: 3,
  };

  test('displays post information correctly', () => {
    render(<PostCard post={mockPost} />, { wrapper: TestWrapper });
    
    expect(screen.getByText('Test Post')).toBeInTheDocument();
    expect(screen.getByText('Test content')).toBeInTheDocument();
    expect(screen.getByText('testuser')).toBeInTheDocument();
  });

  test('handles vote interaction', async () => {
    const user = userEvent.setup();
    render(<PostCard post={mockPost} />, { wrapper: TestWrapper });
    
    const upvoteButton = screen.getByRole('button', { name: /upvote/i });
    await user.click(upvoteButton);
    
    // Verify vote action was triggered
    expect(upvoteButton).toHaveClass('text-primary');
  });
});
```

## Build & Deployment

### Vite Configuration
```typescript
// vite.config.ts
export default defineConfig({
  plugins: [react()],
  build: {
    target: 'esnext',
    minify: 'terser',
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          ui: ['@radix-ui/react-dialog', '@radix-ui/react-dropdown-menu'],
          utils: ['clsx', 'tailwind-merge', 'date-fns'],
        },
      },
    },
  },
  server: {
    host: '0.0.0.0',
    port: 3000,
  },
  preview: {
    port: 3000,
  },
});
```

### Environment Configuration
```typescript
// Environment variables
interface EnvironmentConfig {
  NODE_ENV: 'development' | 'production' | 'test';
  VITE_API_URL: string;
  VITE_APP_VERSION: string;
  VITE_SENTRY_DSN?: string;
  VITE_ANALYTICS_ID?: string;
}

export const config: EnvironmentConfig = {
  NODE_ENV: import.meta.env.NODE_ENV || 'development',
  VITE_API_URL: import.meta.env.VITE_API_URL || 'http://localhost:3001',
  VITE_APP_VERSION: import.meta.env.VITE_APP_VERSION || '1.0.0',
  VITE_SENTRY_DSN: import.meta.env.VITE_SENTRY_DSN,
  VITE_ANALYTICS_ID: import.meta.env.VITE_ANALYTICS_ID,
};
```

Deze technische specificaties vormen de basis voor een schaalbare, veilige en gebruiksvriendelijke cannabis community platform specifiek ontworpen voor de Belgische markt.
