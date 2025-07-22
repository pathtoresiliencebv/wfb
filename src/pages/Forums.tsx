import React from 'react';
import { Plus, Users, MessageSquare, Pin } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const forumCategories = [
  {
    id: 'wetgeving',
    title: 'Wetgeving & Nieuws',
    description: 'Actuele ontwikkelingen in de cannabiswetgeving en nieuwsberichten',
    memberCount: 1247,
    topicCount: 89,
    color: 'bg-blue-500',
    isPublic: true,
  },
  {
    id: 'medicinaal',
    title: 'Medicinaal Gebruik',
    description: 'Informatie over medicinaal cannabisgebruik, CBD, en therapeutische toepassingen',
    memberCount: 892,
    topicCount: 156,
    color: 'bg-green-500',
    isPublic: true,
  },
  {
    id: 'teelt',
    title: 'Teelt & Horticultuur',
    description: 'Tips, tricks en discussies over het kweken van cannabis',
    memberCount: 1534,
    topicCount: 298,
    color: 'bg-emerald-500',
    isPublic: true,
  },
  {
    id: 'harm-reduction',
    title: 'Harm Reduction',
    description: 'Veilig gebruik, risicovermindering en gezondheidsadvies',
    memberCount: 623,
    topicCount: 67,
    color: 'bg-orange-500',
    isPublic: true,
  },
  {
    id: 'community',
    title: 'Community',
    description: 'Algemene discussies, introductions en community events',
    memberCount: 2156,
    topicCount: 423,
    color: 'bg-purple-500',
    isPublic: true,
  },
];

export default function Forums() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-3xl font-bold">Forum Categorieën</h1>
          <p className="text-muted-foreground">
            Ontdek onze verschillende communities en join de discussie
          </p>
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Nieuw Topic
        </Button>
      </div>

      {/* Forum Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {forumCategories.map((category) => (
          <Link key={category.id} to={`/forums/${category.id}`}>
            <Card className="h-full hover:shadow-md transition-shadow cursor-pointer group">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className={`w-12 h-12 rounded-lg ${category.color} flex items-center justify-center mb-3`}>
                    <MessageSquare className="h-6 w-6 text-white" />
                  </div>
                  {category.isPublic && (
                    <Badge variant="secondary" className="text-xs">
                      Publiek
                    </Badge>
                  )}
                </div>
                <CardTitle className="group-hover:text-primary transition-colors">
                  {category.title}
                </CardTitle>
                <CardDescription className="line-clamp-2">
                  {category.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    <span>{category.memberCount.toLocaleString()} leden</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MessageSquare className="h-4 w-4" />
                    <span>{category.topicCount} topics</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* Popular Topics */}
      <div className="mt-12">
        <h2 className="font-heading text-2xl font-semibold mb-6">Populaire Topics</h2>
        <div className="space-y-4">
          {[
            {
              title: 'Nieuwe CBD wetgeving in België - Wat verandert er?',
              category: 'Wetgeving & Nieuws',
              replies: 23,
              views: 1240,
              isSticky: true,
            },
            {
              title: 'Indoor LED setup voor beginners - Complete gids',
              category: 'Teelt & Horticultuur',
              replies: 45,
              views: 2890,
              isSticky: false,
            },
            {
              title: 'CBD olie dosering: Wat werkt voor jou?',
              category: 'Medicinaal Gebruik',
              replies: 67,
              views: 1876,
              isSticky: false,
            },
          ].map((topic, index) => (
            <Card key={index} className="p-4">
              <div className="flex items-center gap-4">
                {topic.isSticky && <Pin className="h-4 w-4 text-primary flex-shrink-0" />}
                <div className="flex-1">
                  <h3 className="font-medium hover:text-primary cursor-pointer">
                    {topic.title}
                  </h3>
                  <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                    <Badge variant="outline" className="text-xs">
                      {topic.category}
                    </Badge>
                    <span>{topic.replies} reacties</span>
                    <span>{topic.views} views</span>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}