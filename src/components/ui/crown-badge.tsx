import React from 'react';
import { Crown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CrownBadgeProps {
  rank?: 1 | 2 | 3;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const CrownBadge: React.FC<CrownBadgeProps> = ({ 
  rank, 
  size = 'md',
  className 
}) => {
  const getRankColor = () => {
    switch (rank) {
      case 1: return 'text-yellow-500'; // Goud
      case 2: return 'text-gray-400'; // Zilver
      case 3: return 'text-amber-600'; // Brons
      default: return 'text-primary'; // Standaard leverancier
    }
  };

  const getSizeClass = () => {
    switch (size) {
      case 'sm': return 'h-4 w-4';
      case 'md': return 'h-5 w-5';
      case 'lg': return 'h-6 w-6';
    }
  };

  return (
    <Crown 
      className={cn(
        getSizeClass(),
        getRankColor(),
        'fill-current',
        className
      )}
    />
  );
};