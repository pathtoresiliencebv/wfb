import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Search, X } from 'lucide-react';
import { SearchResults } from './SearchResults';
import { useSearch } from '@/hooks/useSearch';
import { format } from 'date-fns';
import { nl } from 'date-fns/locale';

interface SearchFilters {
  query: string;
  category: string;
  author: string;
  tags: string[];
  dateFrom?: Date;
  dateTo?: Date;
  contentType: string;
}

export const AdvancedSearch: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedAuthor, setSelectedAuthor] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [dateFrom, setDateFrom] = useState<Date>();
  const [dateTo, setDateTo] = useState<Date>();
  const [contentType, setContentType] = useState<string>('all');
  const [hasSearched, setHasSearched] = useState(false);
  
  const { searchResults, searchLoading, performSearch } = useSearch();

  const addTag = (tag: string) => {
    if (!selectedTags.includes(tag)) {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const removeTag = (tag: string) => {
    setSelectedTags(selectedTags.filter(t => t !== tag));
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    const searchParams = {
      query: searchQuery,
      category: selectedCategory || undefined,
      author: selectedAuthor || undefined,
      tags: selectedTags.length > 0 ? selectedTags : undefined,
      dateFrom: dateFrom?.toISOString(),
      dateTo: dateTo?.toISOString(),
      contentType: contentType !== 'all' ? contentType : undefined
    };
    
    await performSearch(searchParams);
    setHasSearched(true);
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('');
    setSelectedAuthor('');
    setSelectedTags([]);
    setDateFrom(undefined);
    setDateTo(undefined);
    setContentType('all');
  };

  const availableTags = [
    'wetgeving', 'cbd', 'thc', 'medicinaal', 'teelt', 'onderzoek',
    'beginner', 'expert', 'tip', 'vraag', 'nieuws', 'review'
  ];

  const categories = [
    { value: '', label: 'Alle categorieën' },
    { value: 'wetgeving', label: 'Wetgeving & Nieuws' },
    { value: 'medicinaal', label: 'Medicinaal Gebruik' },
    { value: 'teelt', label: 'Teelt & Horticultuur' },
    { value: 'harm-reduction', label: 'Harm Reduction' },
    { value: 'community', label: 'Community' },
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="w-5 h-5" />
            Geavanceerd zoeken
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Search Query */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Zoekterm</label>
            <Input
              placeholder="Zoek in topics en reacties..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            />
          </div>

          {/* Category Filter */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Categorie</label>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Selecteer categorie..." />
              </SelectTrigger>
              <SelectContent>
                {categories.map(cat => (
                  <SelectItem key={cat.value} value={cat.value}>
                    {cat.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Author Filter */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Auteur</label>
            <Input
              placeholder="Gebruikersnaam..."
              value={selectedAuthor}
              onChange={(e) => setSelectedAuthor(e.target.value)}
            />
          </div>

          {/* Content Type Filter */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Content type</label>
            <Select value={contentType} onValueChange={setContentType}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Alles</SelectItem>
                <SelectItem value="topic">Alleen topics</SelectItem>
                <SelectItem value="reply">Alleen reacties</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Date Range */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Van datum</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dateFrom ? format(dateFrom, "PPP", { locale: nl }) : "Selecteer datum..."}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={dateFrom}
                    onSelect={setDateFrom}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Tot datum</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dateTo ? format(dateTo, "PPP", { locale: nl }) : "Selecteer datum..."}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={dateTo}
                    onSelect={setDateTo}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {/* Tags */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Tags</label>
            {selectedTags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {selectedTags.map(tag => (
                  <Badge 
                    key={tag} 
                    variant="secondary" 
                    className="cursor-pointer"
                    onClick={() => removeTag(tag)}
                  >
                    {tag} <X className="w-3 h-3 ml-1" />
                  </Badge>
                ))}
              </div>
            )}
            <div className="flex flex-wrap gap-2">
              {availableTags.filter(tag => !selectedTags.includes(tag)).map(tag => (
                <Badge 
                  key={tag} 
                  variant="outline" 
                  className="cursor-pointer hover:bg-primary hover:text-primary-foreground"
                  onClick={() => addTag(tag)}
                >
                  {tag}
                </Badge>
              ))}
            </div>
          </div>

          {/* Search Buttons */}
          <div className="flex gap-2 pt-4">
            <Button onClick={handleSearch} className="flex-1">
              <Search className="w-4 h-4 mr-2" />
              Zoeken
            </Button>
            <Button variant="outline" onClick={clearFilters}>
              <X className="w-4 h-4 mr-2" />
              Wissen
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Search Results */}
      {hasSearched && (
        <div className="mt-6">
          <SearchResults
            results={searchResults}
            searchQuery={searchQuery}
            isLoading={searchLoading}
          />
        </div>
      )}
    </div>
  );
};