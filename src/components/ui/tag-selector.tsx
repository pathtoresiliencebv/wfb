import React, { useState, useEffect } from 'react';
import { X, Plus } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface Tag {
  id: string;
  name: string;
  slug: string;
  color: string;
}

interface TagSelectorProps {
  selectedTags: Tag[];
  onTagsChange: (tags: Tag[]) => void;
  maxTags?: number;
}

export function TagSelector({ selectedTags, onTagsChange, maxTags = 5 }: TagSelectorProps) {
  const [availableTags, setAvailableTags] = useState<Tag[]>([]);
  const [open, setOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    const fetchTags = async () => {
      const { data, error } = await supabase
        .from('tags')
        .select('id, name, slug, color')
        .order('usage_count', { ascending: false });

      if (error) {
        console.error('Error fetching tags:', error);
        return;
      }

      setAvailableTags((data || []) as Tag[]);
    };

    fetchTags();
  }, []);

  const handleSelectTag = (tag: Tag) => {
    if (selectedTags.length >= maxTags) {
      toast({
        title: 'Maximum bereikt',
        description: `Je kunt maximaal ${maxTags} tags selecteren.`,
        variant: 'destructive',
      });
      return;
    }

    if (!selectedTags.find(t => t.id === tag.id)) {
      onTagsChange([...selectedTags, tag]);
    }
    setOpen(false);
    setSearchValue('');
  };

  const handleRemoveTag = (tagId: string) => {
    onTagsChange(selectedTags.filter(tag => tag.id !== tagId));
  };

  const filteredTags = availableTags.filter(tag => 
    !selectedTags.find(selected => selected.id === tag.id) &&
    tag.name.toLowerCase().includes(searchValue.toLowerCase())
  );

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2">
        {selectedTags.map(tag => (
          <Badge 
            key={tag.id} 
            variant="secondary" 
            className="flex items-center gap-1"
            style={{ backgroundColor: tag.color + '20', color: tag.color }}
          >
            {tag.name}
            <Button
              variant="ghost"
              size="sm"
              className="h-auto p-0 text-current hover:bg-transparent"
              onClick={() => handleRemoveTag(tag.id)}
            >
              <X className="h-3 w-3" />
            </Button>
          </Badge>
        ))}
        
        {selectedTags.length < maxTags && (
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm" className="h-6">
                <Plus className="h-3 w-3 mr-1" />
                Tag toevoegen
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-64 p-0">
              <Command>
                <CommandInput 
                  placeholder="Zoek tags..." 
                  value={searchValue}
                  onValueChange={setSearchValue}
                />
                <CommandList>
                  <CommandEmpty>Geen tags gevonden.</CommandEmpty>
                  <CommandGroup>
                    {filteredTags.map(tag => (
                      <CommandItem
                        key={tag.id}
                        onSelect={() => handleSelectTag(tag)}
                        className="flex items-center gap-2"
                      >
                        <div 
                          className="w-3 h-3 rounded-full" 
                          style={{ backgroundColor: tag.color }}
                        />
                        {tag.name}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        )}
      </div>
      
      <p className="text-xs text-muted-foreground">
        {selectedTags.length}/{maxTags} tags geselecteerd
      </p>
    </div>
  );
}