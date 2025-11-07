import { useEffect, useRef } from 'react';
import { motion, useInView, useMotionValue, useSpring } from 'framer-motion';

interface AnimatedCounterProps {
  end: number;
  duration?: number;
  suffix?: string;
  prefix?: string;
  className?: string;
}

export function AnimatedCounter({ 
  end, 
  duration = 2, 
  suffix = '', 
  prefix = '',
  className = '' 
}: AnimatedCounterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const motionValue = useMotionValue(0);
  const springValue = useSpring(motionValue, { 
    damping: 60, 
    stiffness: 100 
  });
  const isInView = useInView(ref, { once: true, amount: 0.5 });

  useEffect(() => {
    if (isInView) {
      motionValue.set(end);
    }
  }, [isInView, end, motionValue]);

  useEffect(() => {
    const unsubscribe = springValue.on('change', (latest) => {
      if (ref.current) {
        const formatted = Math.floor(latest).toLocaleString('nl-NL');
        ref.current.textContent = `${prefix}${formatted}${suffix}`;
      }
    });

    return unsubscribe;
  }, [springValue, prefix, suffix]);

  return (
    <motion.span 
      ref={ref} 
      className={className}
    />
  );
}
