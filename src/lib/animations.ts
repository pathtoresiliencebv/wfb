// Centralized animation configurations for Framer Motion

export const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 }
};

export const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 }
};

export const scaleIn = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1 }
};

export const slideInLeft = {
  hidden: { opacity: 0, x: -30 },
  visible: { opacity: 1, x: 0 }
};

export const slideInRight = {
  hidden: { opacity: 0, x: 30 },
  visible: { opacity: 1, x: 0 }
};

// Container for staggered children animations
export const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1
    }
  }
};

export const staggerContainerFast = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.05
    }
  }
};

// Spring configurations
export const springConfig = {
  type: 'spring' as const,
  stiffness: 260,
  damping: 20
};

export const bouncySpring = {
  type: 'spring' as const,
  stiffness: 300,
  damping: 15
};

export const smoothSpring = {
  type: 'spring' as const,
  stiffness: 150,
  damping: 25
};

// Transition presets
export const fastTransition = {
  duration: 0.2,
  ease: 'easeOut'
};

export const normalTransition = {
  duration: 0.3,
  ease: 'easeOut'
};

export const slowTransition = {
  duration: 0.5,
  ease: 'easeOut'
};

// Page transition variants
export const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 }
};

export const pageTransition = {
  type: 'tween' as const,
  ease: 'anticipate' as const,
  duration: 0.4
};

// Hover animations
export const hoverScale = {
  scale: 1.05,
  transition: springConfig
};

export const hoverScaleSmall = {
  scale: 1.02,
  transition: springConfig
};

export const hoverRotate = {
  rotate: 5,
  scale: 1.1,
  transition: bouncySpring
};

// Tap animations
export const tapScale = {
  scale: 0.95
};

// In-view animation defaults
export const inViewOptions = {
  once: true,
  amount: 0.3
};

export const inViewOptionsHalf = {
  once: true,
  amount: 0.5
};
