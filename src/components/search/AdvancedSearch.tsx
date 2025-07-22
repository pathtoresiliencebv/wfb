
import React, { useState } from 'react';
import { Search, Filter, X, Calendar, User, Tag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

interface SearchFilters {
  query: string;
  category: string;
  author: string;
  dateRange: string;
  tags: string[];
}

interface AdvancedSearchProps {
  onSearch: (filters: SearchFilters) => void;
  placeholder?: string;
}

const categories = [
  { value: 'all', label: 'Alle categorieën' },
  { value: 'wetgeving', label: 'Wetgeving & Nieuws' },
  { value: 'medicinaal', label: 'Medicinaal Gebruik' },
  { value: 'teelt', label: 'Teelt & Horticultuur' },
  { value: 'harm-reduction', label: 'Harm Reduction' },
  { value: 'community', label: 'Community' },
];

const dateRanges = [
  { value: 'all', label: 'Alle tijden' },
  { value: 'today', label: 'Vandaag' },
  { value: 'week', label: 'Deze week' },
  { value: 'month', label: 'Deze maand' },
  { value: 'year', label: 'Dit jaar' },
];

const commonTags = [
  'wetgeving', 'cbd', 'thc', 'medicinaal', 'teelt', 'onderzoek',
  'beginner', 'expert', 'tip', 'vraag', 'nieuws', 'review'
];

export function AdvancedSearch({ onSearch, placeholder = "Zoek in topics..." }: AdvancedSearchProps) {
  const [filters, setFilters] = useState<SearchFilters>({
    query: '',
    category: 'all',
    author: '',
    dateRange: 'all',
    tags: [],
  });
  const [showFilters, setShowFilters] = useState(false);

  const handleSearch = () => {
    onSearch(filters);
  };

  const addTag = (tag: string) => {
    if (!filters.tags.includes(tag)) {
      setFilters(prev => ({
        ...prev,
        tags: [...prev.tags, tag]
      }));
    }
  };

  const removeTag = (tag: string) => {
    setFilters(prev => ({
      ...prev,
      tags: prev.tags.filter(t => t !== tag)
    }));
  };

  const clearFilters = () => {
    setFilters({
      query: '',
      category: 'all',
      author: '',
      dateRange: 'all',
      tags: [],
    });
  };

  const hasActiveFilters = filters.category !== 'all' || 
                          filters.author !== '' || 
                          filters.dateRange !== 'all' || 
                          filters.tags.length > 0;

  return (
    <div className="space-y-4">
      {/* Main Search Bar */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={placeholder}
            value={filters.query}
            onChange={(e) => setFilters(prev => ({ ...prev, query: e.target.value }))}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            className="pl-10"
          />
        </div>
        
        <Popover open={showFilters} onOpenChange={setShowFilters}>
          <PopoverTrigger asChild>
            <Button variant="outline" className="gap-2">
              <Filter className="h-4 w-4" />
              Filters
              {hasActiveFilters && (
                <Badge variant="secondary" className="ml-1 h-5 w-5 rounded-full p-0 text-xs">
                  !
                </Badge>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80" align="end">
            <Card>
              <CardContent className="p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">Geavanceerd zoeken</h4>
                  {hasActiveFilters && (
                    <Button variant="ghost" size="sm" onClick={clearFilters}>
                      <X className="h-3 w-3 mr-1" />
                      Wissen
                    </Button>
                  )}
                </div>

                {/* Category Filter */}
                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center gap-2">
                    <Tag className="h-3 w-3" />
                    Categorie
                  </label>
                  <Select value={filters.category} onValueChange={(value) => setFilters(prev => ({ ...prev, category: value }))}>
                    <SelectTrigger>
                      <SelectValue />
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
                  <label className="text-sm font-medium flex items-center gap-2">
                    <User className="h-3 w-3" />
                    Auteur
                  </label>
                  <Input
                    placeholder="Gebruikersnaam..."
                    value={filters.author}
                    onChange={(e) => setFilters(prev => ({ ...prev, author: e.target.value }))}
                  />
                </div>

                {/* Date Range Filter */}
                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center gap-2">
                    <Calendar className="h-3 w-3" />
                    Tijdsperiode
                  </label>
                  <Select value={filters.dateRange} onValueChange={(value) => setFilters(prev => ({ ...prev, dateRange: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {dateRanges.map(range => (
                        <SelectItem key={range.value} value={range.value}>
                          {range.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Tags Filter */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Tags</label>
                  {filters.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {filters.tags.map(tag => (
                        <Badge key={tag} variant="secondary" className="cursor-pointer" onClick={() => removeTag(tag)}>
                          {tag} ×
                        </Badge>
                      ))}
                    </div>
                  )}
                  <div className="flex flex-wrap gap-1">
                    {commonTags.filter(tag => !filters.tags.includes(tag)).map(tag => (
                      <Badge key={tag} variant="outline" className="cursor-pointer hover:bg-primary hover:text-primary-foreground" onClick={() => addTag(tag)}>
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>

                <Button onClick={handleSearch} className="w-full">
                  Zoeken
                </Button>
              </CardContent>
            </Card>
          </PopoverContent>
        </Popover>
        
        <Button onClick={handleSearch}>
          Zoeken
        </Button>
      </div>

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm text-muted-foreground">Actieve filters:</span>
          {filters.category !== 'all' && (
            <Badge variant="outline">
              Categorie: {categories.find(c => c.value === filters.category)?.label}
            </Badge>
          )}
          {filters.author && (
            <Badge variant="outline">
              Auteur: {filters.author}
            </Badge>
          )}
          {filters.dateRange !== 'all' && (
            <Badge variant="outline">
              Periode: {dateRanges.find(d => d.value === filters.dateRange)?.label}
            </Badge>
          )}
          {filters.tags.map(tag => (
            <Badge key={tag} variant="outline">
              #{tag}
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
}
