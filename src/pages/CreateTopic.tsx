import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, ImagePlus, Tag, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

const forumCategories = {
  'wetgeving': 'Wetgeving & Nieuws',
  'medicinaal': 'Medicinaal Gebruik',
  'teelt': 'Teelt & Horticultuur',
  'harm-reduction': 'Harm Reduction',
  'community': 'Community',
} as const;

const commonTags = [
  'wetgeving', 'cbd', 'thc', 'medicinaal', 'teelt', 'onderzoek',
  'beginner', 'expert', 'tip', 'vraag', 'nieuws', 'review'
];

export default function CreateTopic() {
  const { categoryId } = useParams<{ categoryId: string }>();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: categoryId || '',
    tags: [] as string[],
    customTag: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isAuthenticated) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold mb-4">Inloggen vereist</h1>
        <p className="text-muted-foreground mb-6">
          Je moet ingelogd zijn om een nieuw topic te kunnen starten.
        </p>
        <Button onClick={() => navigate('/login')}>
          Inloggen
        </Button>
      </div>
    );
  }

  const category = categoryId ? forumCategories[categoryId as keyof typeof forumCategories] : null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      toast({
        title: 'Titel vereist',
        description: 'Voeg een titel toe aan je topic.',
        variant: 'destructive',
      });
      return;
    }

    if (!formData.content.trim()) {
      toast({
        title: 'Inhoud vereist',
        description: 'Voeg inhoud toe aan je topic.',
        variant: 'destructive',
      });
      return;
    }

    if (!formData.category) {
      toast({
        title: 'Categorie vereist',
        description: 'Selecteer een categorie voor je topic.',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    toast({
      title: 'Topic aangemaakt',
      description: 'Je topic is succesvol gepubliceerd.',
    });
    
    // Navigate to the new topic
    navigate(`/forums/${formData.category}/topic/new-topic-id`);
  };

  const addTag = (tag: string) => {
    if (tag && !formData.tags.includes(tag) && formData.tags.length < 5) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tag],
        customTag: '',
      }));
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove),
    }));
  };

  const handleCustomTagAdd = () => {
    if (formData.customTag.trim()) {
      addTag(formData.customTag.trim().toLowerCase());
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => navigate(categoryId ? `/forums/${categoryId}` : '/forums')}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Terug
        </Button>
        <div>
          <h1 className="font-heading text-2xl font-bold">Nieuw Topic</h1>
          {category && (
            <p className="text-muted-foreground">in {category}</p>
          )}
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Topic Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="title">Titel *</Label>
              <Input
                id="title"
                placeholder="Wat is het onderwerp van je topic?"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                maxLength={100}
              />
              <p className="text-xs text-muted-foreground">
                {formData.title.length}/100 karakters
              </p>
            </div>

            {/* Category */}
            <div className="space-y-2">
              <Label htmlFor="category">Categorie *</Label>
              <Select
                value={formData.category}
                onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecteer een categorie" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(forumCategories).map(([key, name]) => (
                    <SelectItem key={key} value={key}>
                      {name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Content */}
            <div className="space-y-2">
              <Label htmlFor="content">Inhoud *</Label>
              <Textarea
                id="content"
                placeholder="Beschrijf je topic in detail. Je kunt markdown gebruiken voor opmaak."
                value={formData.content}
                onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                rows={12}
                className="resize-none"
              />
              <p className="text-xs text-muted-foreground">
                Tip: Gebruik **vet** voor vetgedrukte tekst, ## voor kopjes, en - voor lijstjes.
              </p>
            </div>

            {/* Tags */}
            <div className="space-y-3">
              <Label>Tags (max 5)</Label>
              
              {/* Selected Tags */}
              {formData.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {formData.tags.map(tag => (
                    <Badge 
                      key={tag} 
                      variant="secondary" 
                      className="cursor-pointer"
                      onClick={() => removeTag(tag)}
                    >
                      {tag} ×
                    </Badge>
                  ))}
                </div>
              )}

              {/* Common Tags */}
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Populaire tags:</p>
                <div className="flex flex-wrap gap-2">
                  {commonTags.map(tag => (
                    <Badge
                      key={tag}
                      variant="outline"
                      className="cursor-pointer hover:bg-primary hover:text-primary-foreground"
                      onClick={() => addTag(tag)}
                    >
                      <Tag className="h-3 w-3 mr-1" />
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Custom Tag Input */}
              {formData.tags.length < 5 && (
                <div className="flex gap-2">
                  <Input
                    placeholder="Voeg een custom tag toe..."
                    value={formData.customTag}
                    onChange={(e) => setFormData(prev => ({ ...prev, customTag: e.target.value }))}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleCustomTagAdd();
                      }
                    }}
                    maxLength={20}
                  />
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={handleCustomTagAdd}
                    disabled={!formData.customTag.trim()}
                  >
                    Toevoegen
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Media Upload (Future Feature) */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ImagePlus className="h-5 w-5" />
              Media (Binnenkort beschikbaar)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="border-2 border-dashed border-muted rounded-lg p-8 text-center">
              <ImagePlus className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">
                Afbeeldingen en bestanden uploaden komt binnenkort beschikbaar.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Submit Buttons */}
        <div className="flex justify-end gap-4">
          <Button 
            type="button" 
            variant="outline"
            onClick={() => navigate(categoryId ? `/forums/${categoryId}` : '/forums')}
          >
            Annuleren
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2" />
                Publiceren...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Publiceer Topic
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}