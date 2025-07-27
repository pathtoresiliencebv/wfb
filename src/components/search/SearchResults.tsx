import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { formatDistanceToNow } from 'date-fns';
import { nl } from 'date-fns/locale';
import { MessageCircle, Eye, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';

interface SearchResult {
  id: string;
  type: 'topic' | 'reply';
  title?: string;
  content: string;
  author: {
    username: string;
    display_name?: string;
    avatar_url?: string;
  };
  category?: {
    name: string;
    slug: string;
  };
  created_at: string;
  reply_count?: number;
  view_count?: number;
  topic_id?: string;
  matches?: string[];
}

interface SearchResultsProps {
  results: SearchResult[];
  searchQuery: string;
  isLoading: boolean;
}

export const SearchResults: React.FC<SearchResultsProps> = ({
  results,
  searchQuery,
  isLoading
}) => {
  const highlightText = (text: string, query: string) => {
    if (!query.trim()) return text;
    
    const regex = new RegExp(`(${query.trim()})`, 'gi');
    const parts = text.split(regex);
    
    return parts.map((part, index) => 
      regex.test(part) ? (
        <mark key={index} className="bg-primary/20 text-primary font-medium">
          {part}
        </mark>
      ) : part
    );
  };

  const getUserInitials = (username: string) => {
    return username.slice(0, 2).toUpperCase();
  };

  const truncateContent = (content: string, maxLength: number = 200) => {
    if (content.length <= maxLength) return content;
    return content.slice(0, maxLength) + '...';
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader>
              <div className="h-4 bg-muted rounded w-3/4"></div>
              <div className="h-3 bg-muted rounded w-1/2"></div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="h-3 bg-muted rounded"></div>
                <div className="h-3 bg-muted rounded w-5/6"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (results.length === 0) {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <p className="text-muted-foreground">
            Geen resultaten gevonden voor "<strong>{searchQuery}</strong>"
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            Probeer andere zoektermen of controleer de spelling.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="text-sm text-muted-foreground">
        {results.length} resultaten gevonden voor "<strong>{searchQuery}</strong>"
      </div>
      
      {results.map((result) => (
        <Card key={`${result.type}-${result.id}`} className="hover:shadow-md transition-shadow">
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <CardTitle className="text-lg leading-tight">
                  <Link 
                    to={result.type === 'topic' 
                      ? `/forums/${result.category?.slug}/${result.id}`
                      : `/forums/${result.category?.slug}/${result.topic_id}#reply-${result.id}`
                    }
                    className="hover:text-primary transition-colors"
                  >
                    {result.type === 'topic' ? (
                      highlightText(result.title || '', searchQuery)
                    ) : (
                      `Reactie op ${result.title || 'topic'}`
                    )}
                  </Link>
                </CardTitle>
                
                <div className="flex items-center gap-3 mt-2 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Avatar className="w-5 h-5">
                      <AvatarImage src={result.author.avatar_url} />
                      <AvatarFallback className="text-xs">
                        {getUserInitials(result.author.username)}
                      </AvatarFallback>
                    </Avatar>
                    <span>{result.author.display_name || result.author.username}</span>
                  </div>
                  
                  {result.category && (
                    <Badge variant="secondary" className="text-xs">
                      {result.category.name}
                    </Badge>
                  )}
                  
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>
                      {formatDistanceToNow(new Date(result.created_at), {
                        addSuffix: true,
                        locale: nl
                      })}
                    </span>
                  </div>
                </div>
              </div>
              
              <Badge variant="outline" className="capitalize">
                {result.type === 'topic' ? 'Topic' : 'Reactie'}
              </Badge>
            </div>
          </CardHeader>
          
          <CardContent>
            <p className="text-sm text-muted-foreground leading-relaxed mb-3">
              {highlightText(truncateContent(result.content), searchQuery)}
            </p>
            
            {result.type === 'topic' && (
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                {result.reply_count !== undefined && (
                  <div className="flex items-center gap-1">
                    <MessageCircle className="w-3 h-3" />
                    <span>{result.reply_count} reacties</span>
                  </div>
                )}
                
                {result.view_count !== undefined && (
                  <div className="flex items-center gap-1">
                    <Eye className="w-3 h-3" />
                    <span>{result.view_count} weergaven</span>
                  </div>
                )}
              </div>
            )}
            
            {result.matches && result.matches.length > 0 && (
              <div className="mt-3 pt-3 border-t">
                <p className="text-xs text-muted-foreground mb-1">Gevonden in:</p>
                <div className="flex flex-wrap gap-1">
                  {result.matches.map((match, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {match}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};