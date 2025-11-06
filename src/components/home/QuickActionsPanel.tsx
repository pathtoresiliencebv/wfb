import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { MessageSquare, Search, Mail, User, Plus, TrendingUp } from 'lucide-react';

const quickActions = [
  {
    icon: Plus,
    label: 'Nieuw Topic',
    description: 'Start een discussie',
    href: '/create-topic',
    color: 'text-green-500',
    bgColor: 'bg-green-500/10',
  },
  {
    icon: Search,
    label: 'Zoeken',
    description: 'Vind topics',
    href: '/search',
    color: 'text-blue-500',
    bgColor: 'bg-blue-500/10',
  },
  {
    icon: Mail,
    label: 'Berichten',
    description: 'Check je inbox',
    href: '/messages',
    color: 'text-purple-500',
    bgColor: 'bg-purple-500/10',
  },
  {
    icon: User,
    label: 'Profiel',
    description: 'Bekijk je profiel',
    href: '/profile',
    color: 'text-orange-500',
    bgColor: 'bg-orange-500/10',
  },
  {
    icon: TrendingUp,
    label: 'Trending',
    description: 'Populaire topics',
    href: '/forums',
    color: 'text-red-500',
    bgColor: 'bg-red-500/10',
  },
  {
    icon: MessageSquare,
    label: 'Forums',
    description: 'Alle categorieën',
    href: '/forums',
    color: 'text-teal-500',
    bgColor: 'bg-teal-500/10',
  },
];

export function QuickActionsPanel() {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {quickActions.map((action) => (
            <Link
              key={action.label}
              to={action.href}
              className="flex flex-col items-center gap-2 p-4 rounded-lg hover:bg-accent transition-colors group"
            >
              <div className={`p-3 rounded-full ${action.bgColor} group-hover:scale-110 transition-transform`}>
                <action.icon className={`h-5 w-5 ${action.color}`} />
              </div>
              <div className="text-center">
                <h4 className="text-sm font-medium">{action.label}</h4>
                <p className="text-xs text-muted-foreground">{action.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
