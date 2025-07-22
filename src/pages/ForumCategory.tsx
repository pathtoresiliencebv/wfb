import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Pin, MessageSquare, Eye, Clock, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { AdvancedSearch } from '@/components/search/AdvancedSearch';

const forumCategories = {
  'wetgeving': {
    title: 'Wetgeving & Nieuws',
    description: 'Actuele ontwikkelingen in de cannabiswetgeving en nieuwsberichten',
    color: 'bg-blue-500',
  },
  'medicinaal': {
    title: 'Medicinaal Gebruik',
    description: 'Informatie over medicinaal cannabisgebruik, CBD, en therapeutische toepassingen',
    color: 'bg-green-500',
  },
  'teelt': {
    title: 'Teelt & Horticultuur',
    description: 'Tips, tricks en discussies over het kweken van cannabis',
    color: 'bg-emerald-500',
  },
  'harm-reduction': {
    title: 'Harm Reduction',
    description: 'Veilig gebruik, risicovermindering en gezondheidsadvies',
    color: 'bg-orange-500',
  },
  'community': {
    title: 'Community',
    description: 'Algemene discussies, introductions en community events',
    color: 'bg-purple-500',
  },
} as const;

const mockTopics = [
  {
    id: '1',
    title: 'Nieuwe CBD wetgeving in België - Wat verandert er?',
    author: 'ModeratorBelgie',
    authorRole: 'moderator',
    replies: 23,
    views: 1240,
    lastActivity: '2 uur geleden',
    lastUser: 'CannabisExpert',
    isSticky: true,
    isLocked: false,
    tags: ['wetgeving', 'cbd', 'belangrijk'],
  },
  {
    id: '2',
    title: 'Nieuwe onderzoeksresultaten over THC en geheugen',
    author: 'ResearcherNL',
    authorRole: 'expert',
    replies: 15,
    views: 890,
    lastActivity: '4 uur geleden',
    lastUser: 'HealthyUser',
    isSticky: false,
    isLocked: false,
    tags: ['onderzoek', 'thc'],
  },
  {
    id: '3',
    title: 'Verkiezingen 2024: Welke partijen steunen legalisatie?',
    author: 'PolitiekWatcher',
    authorRole: 'user',
    replies: 67,
    views: 2340,
    lastActivity: '1 dag geleden',
    lastUser: 'VotingCitizen',
    isSticky: false,
    isLocked: false,
    tags: ['politiek', 'verkiezingen'],
  },
];

export default function ForumCategory() {
  const { categoryId } = useParams<{ categoryId: string }>();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [searchFilters, setSearchFilters] = useState({
    query: '',
    category: 'all',
    author: '',
    dateRange: 'all',
    tags: [] as string[],
  });

  const category = categoryId ? forumCategories[categoryId as keyof typeof forumCategories] : null;

  if (!category) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold mb-4">Forum categorie niet gevonden</h1>
        <Button onClick={() => navigate('/forums')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Terug naar Forums
        </Button>
      </div>
    );
  }

  const filteredTopics = mockTopics.filter(topic => {
    // Search query filter
    if (searchFilters.query && !topic.title.toLowerCase().includes(searchFilters.query.toLowerCase()) &&
        !topic.tags.some(tag => tag.toLowerCase().includes(searchFilters.query.toLowerCase()))) {
      return false;
    }

    // Author filter
    if (searchFilters.author && !topic.author.toLowerCase().includes(searchFilters.author.toLowerCase())) {
      return false;
    }

    // Tags filter
    if (searchFilters.tags.length > 0 && !searchFilters.tags.some(tag => topic.tags.includes(tag))) {
      return false;
    }

    return true;
  });

  const sortedTopics = [...filteredTopics].sort((a, b) => {
    if (a.isSticky && !b.isSticky) return -1;
    if (!a.isSticky && b.isSticky) return 1;
    
    switch (sortBy) {
      case 'replies':
        return b.replies - a.replies;
      case 'views':
        return b.views - a.views;
      case 'recent':
      default:
        return 0; // Mock sorting by recent activity
    }
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Button variant="ghost" size="sm" onClick={() => navigate('/forums')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Terug
        </Button>
        <div className={`w-12 h-12 rounded-lg ${category.color} flex items-center justify-center`}>
          <MessageSquare className="h-6 w-6 text-white" />
        </div>
        <div className="flex-1">
          <h1 className="font-heading text-3xl font-bold">{category.title}</h1>
          <p className="text-muted-foreground">{category.description}</p>
        </div>
        {isAuthenticated && (
          <Button onClick={() => navigate(`/forums/${categoryId}/new-topic`)}>
            <Plus className="h-4 w-4 mr-2" />
            Nieuw Topic
          </Button>
        )}
      </div>

      {/* Enhanced Search */}
      <AdvancedSearch
        onSearch={setSearchFilters}
        placeholder={`Zoek in ${category.title.toLowerCase()}...`}
      />

      {/* Topics List */}
      <div className="space-y-2">
        {sortedTopics.length === 0 ? (
          <Card className="p-8 text-center">
            <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">Geen topics gevonden</h3>
            <p className="text-muted-foreground mb-4">
              {searchFilters.query ? 'Probeer een andere zoekterm.' : 'Wees de eerste om een topic te starten!'}
            </p>
            {isAuthenticated && (
              <Button onClick={() => navigate(`/forums/${categoryId}/new-topic`)}>
                <Plus className="h-4 w-4 mr-2" />
                Maak het eerste topic
              </Button>
            )}
          </Card>
        ) : (
          sortedTopics.map((topic) => (
            <Card key={topic.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  {/* Topic Icons */}
                  <div className="flex flex-col items-center gap-1 mt-1">
                    {topic.isSticky && <Pin className="h-4 w-4 text-primary" />}
                    <MessageSquare className="h-5 w-5 text-muted-foreground" />
                  </div>

                  {/* Topic Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <Link 
                          to={`/forums/${categoryId}/topic/${topic.id}`}
                          className="font-medium hover:text-primary transition-colors line-clamp-2"
                        >
                          {topic.title}
                        </Link>
                        
                        <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
                          <User className="h-3 w-3" />
                          <span className="font-medium">{topic.author}</span>
                          {topic.authorRole === 'moderator' && (
                            <Badge variant="secondary" className="text-xs">MOD</Badge>
                          )}
                          {topic.authorRole === 'expert' && (
                            <Badge variant="default" className="text-xs">EXPERT</Badge>
                          )}
                        </div>

                        <div className="flex flex-wrap gap-1 mt-2">
                          {topic.tags.map(tag => (
                            <Badge key={tag} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      {/* Stats */}
                      <div className="flex flex-col items-end text-sm text-muted-foreground space-y-1">
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-1">
                            <MessageSquare className="h-3 w-3" />
                            <span>{topic.replies}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Eye className="h-3 w-3" />
                            <span>{topic.views}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          <span>{topic.lastActivity}</span>
                        </div>
                        <div className="text-xs">
                          door <span className="font-medium">{topic.lastUser}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
