import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { RichTextEditor } from '@/components/rich-text/RichTextEditor';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { TagSelector, type Tag } from '@/components/ui/tag-selector';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

const createTopicSchema = z.object({
  title: z.string().min(5, 'Titel moet minimaal 5 karakters lang zijn').max(200, 'Titel mag maximaal 200 karakters lang zijn'),
  content: z.string().min(20, 'Content moet minimaal 20 karakters lang zijn'),
  categoryId: z.string().min(1, 'Selecteer een categorie'),
  tags: z.array(z.object({
    id: z.string().min(1),
    name: z.string().min(1),
    slug: z.string().min(1),
    color: z.string().min(1),
  })).max(5, 'Maximaal 5 tags toegestaan').default([]),
});

type CreateTopicForm = z.infer<typeof createTopicSchema>;

interface Category {
  id: string;
  name: string;
  description: string;
}

export default function CreateTopic() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const [categories, setCategories] = useState<Category[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<CreateTopicForm>({
    resolver: zodResolver(createTopicSchema),
    defaultValues: {
      title: '',
      content: '',
      categoryId: '',
      tags: [],
    },
  });

  useEffect(() => {
    const fetchCategories = async () => {
      const { data, error } = await supabase
        .from('categories')
        .select('id, name, description')
        .eq('is_active', true)
        .order('sort_order');

      if (error) {
        console.error('Error fetching categories:', error);
        return;
      }

      setCategories(data || []);
    };

    fetchCategories();
  }, []);

  const onSubmit = async (data: CreateTopicForm) => {
    if (!user) {
      toast({
        title: 'Niet ingelogd',
        description: 'Je moet ingelogd zijn om een topic te maken.',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const { data: topic, error } = await supabase
        .from('topics')
        .insert({
          title: data.title,
          content: data.content,
          category_id: data.categoryId,
          author_id: user.id,
        })
        .select()
        .single();

      if (error) throw error;

      // Add tags to topic
      if (data.tags.length > 0) {
        const tagInserts = data.tags.map(tag => ({
          topic_id: topic.id,
          tag_id: tag.id,
        }));

        const { error: tagError } = await supabase
          .from('topic_tags')
          .insert(tagInserts);

        if (tagError) {
          console.error('Error adding tags:', tagError);
        }
      }

      toast({
        title: 'Topic aangemaakt!',
        description: 'Je topic is succesvol aangemaakt.',
      });

      navigate(`/topic/${topic.id}`);
    } catch (error) {
      console.error('Error creating topic:', error);
      toast({
        title: 'Fout bij aanmaken',
        description: 'Er is iets misgegaan. Probeer het opnieuw.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Nieuw Topic Aanmaken</CardTitle>
          <CardDescription>
            Deel je vraag, ervaring of kennis met de community
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="categoryId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Categorie</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecteer een categorie" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category.id} value={category.id}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Kies de categorie die het best bij je topic past
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Titel</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Bijvoorbeeld: CBD dosering voor beginners" 
                        {...field} 
                      />
                    </FormControl>
                    <FormDescription>
                      Kies een duidelijke titel die je topic goed omschrijft
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Inhoud</FormLabel>
                    <FormControl>
                      <RichTextEditor
                        value={field.value}
                        onChange={field.onChange}
                        placeholder="Beschrijf je vraag, ervaring of tip in detail..."
                        minHeight={200}
                      />
                    </FormControl>
                    <FormDescription>
                      Gebruik de rich text editor voor mooie opmaak. Markdown wordt ondersteund.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="tags"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tags</FormLabel>
                    <FormControl>
                      <TagSelector
                        selectedTags={field.value}
                        onTagsChange={field.onChange}
                        maxTags={5}
                      />
                    </FormControl>
                    <FormDescription>
                      Voeg relevante tags toe om je topic beter vindbaar te maken
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex gap-3">
                <Button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="flex-1"
                >
                  {isSubmitting ? 'Bezig met publiceren...' : 'Topic Publiceren'}
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => navigate(-1)}
                >
                  Annuleren
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}