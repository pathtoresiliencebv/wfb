import { motion } from 'framer-motion';
import { useReducedMotion } from '@/hooks/useReducedMotion';

interface FloatingCannabisLeafProps {
  size?: 'small' | 'medium' | 'large';
  delay?: number;
}

export function FloatingCannabisLeaf({ 
  size = 'medium', 
  delay = 0 
}: FloatingCannabisLeafProps) {
  const prefersReducedMotion = useReducedMotion();

  const sizes = {
    small: 'w-12 h-16',
    medium: 'w-20 h-24',
    large: 'w-28 h-32'
  };

  const randomX = Math.random() * 100;
  
  if (prefersReducedMotion) {
    return (
      <div
        className={`absolute ${sizes[size]} text-primary/5`}
        style={{ left: `${randomX}%`, top: '50%' }}
        aria-hidden="true"
      >
        <svg viewBox="0 0 100 120" fill="currentColor" className="w-full h-full">
          <path d="M50 10 Q60 40 50 70 Q40 40 50 10 M50 30 Q70 35 80 50 Q60 45 50 30 M50 30 Q30 35 20 50 Q40 45 50 30 M50 50 Q75 60 85 80 Q65 65 50 50 M50 50 Q25 60 15 80 Q35 65 50 50 M50 70 Q45 90 50 120" />
        </svg>
      </div>
    );
  }
  
  return (
    <motion.div
      className={`absolute ${sizes[size]} text-primary/5 pointer-events-none`}
      style={{ left: `${randomX}%` }}
      initial={{ y: '100vh', rotate: 0, opacity: 0 }}
      animate={{
        y: '-100vh',
        rotate: 360,
        opacity: [0, 0.08, 0.08, 0],
      }}
      transition={{
        duration: 20 + Math.random() * 10,
        delay,
        repeat: Infinity,
        ease: 'linear',
      }}
      aria-hidden="true"
    >
      <svg viewBox="0 0 100 120" fill="currentColor" className="w-full h-full">
        <path d="M50 10 Q60 40 50 70 Q40 40 50 10 M50 30 Q70 35 80 50 Q60 45 50 30 M50 30 Q30 35 20 50 Q40 45 50 30 M50 50 Q75 60 85 80 Q65 65 50 50 M50 50 Q25 60 15 80 Q35 65 50 50 M50 70 Q45 90 50 120" />
      </svg>
    </motion.div>
  );
}
