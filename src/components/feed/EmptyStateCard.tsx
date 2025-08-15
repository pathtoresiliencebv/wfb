import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, MessageSquare, Users, Activity } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface EmptyStateCardProps {
  type: 'topics' | 'activity' | 'members';
  title: string;
  description: string;
  actionText?: string;
  actionPath?: string;
}

export function EmptyStateCard({ type, title, description, actionText, actionPath }: EmptyStateCardProps) {
  const navigate = useNavigate();
  
  const icons = {
    topics: MessageSquare,
    activity: Activity,
    members: Users,
  };
  
  const Icon = icons[type];
  
  return (
    <Card className="border-dashed">
      <CardContent className="flex flex-col items-center justify-center p-8 text-center">
        <div className="rounded-full bg-muted p-4 mb-4">
          <Icon className="h-8 w-8 text-muted-foreground" />
        </div>
        <h3 className="font-semibold text-lg mb-2">{title}</h3>
        <p className="text-muted-foreground mb-4 max-w-sm">{description}</p>
        {actionText && actionPath && (
          <Button onClick={() => navigate(actionPath)} className="gap-2">
            <Plus className="h-4 w-4" />
            {actionText}
          </Button>
        )}
      </CardContent>
    </Card>
  );
}