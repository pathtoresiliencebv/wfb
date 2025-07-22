import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, MessageSquare, Eye, Clock, User, ThumbsUp, ThumbsDown, Flag, Share2, Bookmark } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

const mockTopic = {
  id: '1',
  title: 'Nieuwe CBD wetgeving in België - Wat verandert er?',
  content: `Beste forum leden,

Ik wil graag jullie aandacht vestigen op de recente ontwikkelingen in de Belgische CBD wetgeving die binnenkort van kracht gaan. Na maanden van onderzoek en discussie heeft de regering enkele belangrijke wijzigingen aangekondigd die van invloed zullen zijn op zowel consumenten als retailers.

## Belangrijkste wijzigingen:

**1. THC-limiet aanpassing**
De maximaal toegestane THC-concentratie in CBD-producten wordt aangepast van 0.2% naar 0.3%, wat in lijn is met EU-regelgeving.

**2. Nieuwe etiketteringsvereisten**
Alle CBD-producten moeten voortaan duidelijke labels bevatten met:
- Exacte CBD en THC concentraties
- Oorsprong van de cannabis
- Laboratoriumtestresultaten
- Bewaaradvies

**3. Verkoop in apotheken**
CBD-olie met medicinale claims mag alleen nog verkocht worden in erkende apotheken, mits voorgeschreven door een arts.

## Impact voor consumenten

Voor gewone CBD-gebruikers betekent dit dat:
- Meer zekerheid over productkwaliteit
- Toegang tot betrouwbare informatie
- Mogelijk hogere prijzen door extra regelgeving

Wat denken jullie van deze ontwikkelingen? Zie je dit als een positieve stap of maken de extra regels het onnodig ingewikkeld?`,
  author: {
    id: 'mod1',
    username: 'ModeratorBelgie',
    avatar: null,
    role: 'moderator',
    reputation: 2840,
    joinedAt: '2023-02-15',
    badges: ['Moderator', 'Wetgeving Expert'],
  },
  category: 'wetgeving',
  categoryTitle: 'Wetgeving & Nieuws',
  createdAt: '2024-01-20T10:30:00Z',
  replies: 23,
  views: 1240,
  isSticky: true,
  isLocked: false,
  tags: ['wetgeving', 'cbd', 'belangrijk'],
  upvotes: 45,
  downvotes: 3,
};

const mockReplies = [
  {
    id: 'r1',
    content: 'Dank je wel voor deze uitgebreide update! De etiketteringsvereisten zijn zeker een stap in de goede richting. Ik ben benieuwd hoe dit gaat uitpakken voor de kleinere CBD-winkels.',
    author: {
      id: 'user1',
      username: 'CannabisExpert',
      avatar: null,
      role: 'expert',
      reputation: 1560,
      badges: ['Expert', 'CBD Specialist'],
    },
    createdAt: '2024-01-20T11:15:00Z',
    upvotes: 12,
    downvotes: 0,
  },
  {
    id: 'r2',
    content: 'Eindelijk wat meer duidelijkheid! Al vraag ik me af of de apotheek-eis niet te ver gaat. CBD-olie is toch geen medicijn in de traditionele zin?',
    author: {
      id: 'user2',
      username: 'HealthyUser',
      avatar: null,
      role: 'user',
      reputation: 340,
      badges: ['Active Member'],
    },
    createdAt: '2024-01-20T12:45:00Z',
    upvotes: 8,
    downvotes: 2,
  },
];

export default function TopicDetail() {
  const { categoryId, topicId } = useParams<{ categoryId: string; topicId: string }>();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [replyContent, setReplyContent] = useState('');
  const [isReplying, setIsReplying] = useState(false);

  const handleVote = (type: 'up' | 'down', targetId: string, targetType: 'topic' | 'reply') => {
    if (!isAuthenticated) {
      toast({
        title: 'Inloggen vereist',
        description: 'Je moet ingelogd zijn om te kunnen stemmen.',
        variant: 'destructive',
      });
      return;
    }

    toast({
      title: `${type === 'up' ? 'Upvote' : 'Downvote'} geregistreerd`,
      description: 'Je stem is opgeslagen.',
    });
  };

  const handleReply = async () => {
    if (!isAuthenticated) {
      toast({
        title: 'Inloggen vereist',
        description: 'Je moet ingelogd zijn om te kunnen reageren.',
        variant: 'destructive',
      });
      return;
    }

    if (!replyContent.trim()) {
      toast({
        title: 'Lege reactie',
        description: 'Voeg wat tekst toe aan je reactie.',
        variant: 'destructive',
      });
      return;
    }

    setIsReplying(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    toast({
      title: 'Reactie geplaatst',
      description: 'Je reactie is succesvol toegevoegd.',
    });
    
    setReplyContent('');
    setIsReplying(false);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('nl-BE', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getUserInitials = (username: string) => {
    return username.slice(0, 2).toUpperCase();
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'moderator': return 'bg-blue-500';
      case 'expert': return 'bg-green-500';
      case 'admin': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={() => navigate(`/forums/${categoryId}`)}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Terug naar {mockTopic.categoryTitle}
        </Button>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <Link to={`/forums/${categoryId}`} className="text-sm text-muted-foreground hover:text-primary">
              {mockTopic.categoryTitle}
            </Link>
            <span className="text-muted-foreground">•</span>
            <span className="text-sm text-muted-foreground">Topic</span>
          </div>
          <h1 className="font-heading text-2xl font-bold">{mockTopic.title}</h1>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Bookmark className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm">
            <Share2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Topic Stats */}
      <div className="flex items-center gap-6 text-sm text-muted-foreground">
        <div className="flex items-center gap-1">
          <Eye className="h-4 w-4" />
          <span>{mockTopic.views} views</span>
        </div>
        <div className="flex items-center gap-1">
          <MessageSquare className="h-4 w-4" />
          <span>{mockTopic.replies} reacties</span>
        </div>
        <div className="flex items-center gap-1">
          <Clock className="h-4 w-4" />
          <span>{formatDate(mockTopic.createdAt)}</span>
        </div>
      </div>

      {/* Original Post */}
      <Card>
        <CardHeader className="border-b">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10">
                <AvatarImage src={mockTopic.author.avatar || undefined} />
                <AvatarFallback className={getRoleColor(mockTopic.author.role)}>
                  {getUserInitials(mockTopic.author.username)}
                </AvatarFallback>
              </Avatar>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-medium">{mockTopic.author.username}</span>
                  {mockTopic.author.role === 'moderator' && (
                    <Badge variant="secondary" className="text-xs">MOD</Badge>
                  )}
                  {mockTopic.author.role === 'expert' && (
                    <Badge variant="default" className="text-xs">EXPERT</Badge>
                  )}
                </div>
                <div className="text-sm text-muted-foreground">
                  {mockTopic.author.reputation} reputatie • Lid sinds {new Date(mockTopic.author.joinedAt).getFullYear()}
                </div>
              </div>
            </div>
            <Button variant="ghost" size="sm">
              <Flag className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="prose prose-sm max-w-none mb-6">
            {mockTopic.content.split('\n').map((paragraph, index) => (
              <p key={index} className="mb-4 last:mb-0">
                {paragraph}
              </p>
            ))}
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex flex-wrap gap-1">
              {mockTopic.tags.map(tag => (
                <Badge key={tag} variant="outline" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
            
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleVote('up', mockTopic.id, 'topic')}
                className="gap-1"
              >
                <ThumbsUp className="h-4 w-4" />
                <span>{mockTopic.upvotes}</span>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleVote('down', mockTopic.id, 'topic')}
                className="gap-1"
              >
                <ThumbsDown className="h-4 w-4" />
                <span>{mockTopic.downvotes}</span>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Replies */}
      <div className="space-y-4">
        <h3 className="font-heading text-lg font-semibold">
          Reacties ({mockReplies.length})
        </h3>
        
        {mockReplies.map((reply) => (
          <Card key={reply.id}>
            <CardHeader className="border-b pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={reply.author.avatar || undefined} />
                    <AvatarFallback className={getRoleColor(reply.author.role)}>
                      {getUserInitials(reply.author.username)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm">{reply.author.username}</span>
                      {reply.author.role === 'expert' && (
                        <Badge variant="default" className="text-xs">EXPERT</Badge>
                      )}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {formatDate(reply.createdAt)}
                    </div>
                  </div>
                </div>
                <Button variant="ghost" size="sm">
                  <Flag className="h-3 w-3" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="pt-4">
              <p className="mb-4 text-sm">{reply.content}</p>
              <div className="flex items-center justify-end gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleVote('up', reply.id, 'reply')}
                  className="gap-1"
                >
                  <ThumbsUp className="h-3 w-3" />
                  <span>{reply.upvotes}</span>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleVote('down', reply.id, 'reply')}
                  className="gap-1"
                >
                  <ThumbsDown className="h-3 w-3" />
                  <span>{reply.downvotes}</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Reply Form */}
      {isAuthenticated ? (
        <Card>
          <CardHeader>
            <h4 className="font-medium">Reageer op dit topic</h4>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              placeholder="Deel je gedachten over dit topic..."
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
              rows={4}
            />
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setReplyContent('')}>
                Annuleren
              </Button>
              <Button onClick={handleReply} disabled={isReplying}>
                {isReplying ? 'Bezig...' : 'Reageren'}
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="text-center py-8">
            <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h4 className="font-medium mb-2">Log in om te reageren</h4>
            <p className="text-muted-foreground mb-4">
              Je moet ingelogd zijn om deel te nemen aan de discussie.
            </p>
            <Button onClick={() => navigate('/login')}>
              Inloggen
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}