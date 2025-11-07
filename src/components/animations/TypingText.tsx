import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useReducedMotion } from '@/hooks/useReducedMotion';

interface TypingTextProps {
  texts: string[];
  speed?: number;
  pauseDuration?: number;
  className?: string;
}

export function TypingText({ 
  texts, 
  speed = 100, 
  pauseDuration = 3000,
  className = '' 
}: TypingTextProps) {
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    // If user prefers reduced motion, just show the full text
    if (prefersReducedMotion) {
      setDisplayedText(texts[currentTextIndex]);
      return;
    }

    const currentFullText = texts[currentTextIndex];

    const timeout = setTimeout(() => {
      if (!isDeleting) {
        // Typing
        if (displayedText.length < currentFullText.length) {
          setDisplayedText(currentFullText.slice(0, displayedText.length + 1));
        } else {
          // Finished typing, wait then start deleting
          setTimeout(() => setIsDeleting(true), pauseDuration);
        }
      } else {
        // Deleting
        if (displayedText.length > 0) {
          setDisplayedText(currentFullText.slice(0, displayedText.length - 1));
        } else {
          // Finished deleting, move to next text
          setIsDeleting(false);
          setCurrentTextIndex((prev) => (prev + 1) % texts.length);
        }
      }
    }, isDeleting ? speed / 2 : speed);

    return () => clearTimeout(timeout);
  }, [displayedText, isDeleting, currentTextIndex, texts, speed, pauseDuration, prefersReducedMotion]);

  return (
    <span className={className}>
      <AnimatePresence mode="wait">
        <motion.span
          key={displayedText}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {displayedText}
        </motion.span>
      </AnimatePresence>
      {!prefersReducedMotion && (
        <motion.span
          className="inline-block w-0.5 h-[1em] bg-current ml-1"
          animate={{ opacity: [1, 0] }}
          transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
        />
      )}
    </span>
  );
}
