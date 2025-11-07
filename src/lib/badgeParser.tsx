import React from 'react';

/**
 * Parse text and replace [text] and {key: value} with styled badge HTML
 * [text] → Green badge (e.g., [top kwaliteit], [gescreend])
 * {key: value} → Blue badge (e.g., {wire: dutchf4rm3rz})
 */
export const parseBadges = (text: string): string => {
  let parsed = text;
  
  // Replace [text] with green badge
  parsed = parsed.replace(
    /\[([^\]]+)\]/g, 
    '<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 mx-1">$1</span>'
  );
  
  // Replace {key: value} with blue badge
  parsed = parsed.replace(
    /\{([^:}]+):\s*([^}]+)\}/g,
    '<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 mx-1"><span class="font-semibold">$1:</span>&nbsp;$2</span>'
  );
  
  return parsed;
};

/**
 * React component wrapper for badge parsing
 */
export const BadgedText: React.FC<{ text: string; className?: string }> = ({ text, className = '' }) => {
  return (
    <span 
      className={className}
      dangerouslySetInnerHTML={{ __html: parseBadges(text) }}
    />
  );
};
