// Animated Components - Import này sẽ tự động apply animations
export { default as AnimatedCard } from '../common/AnimatedCard';
export { default as AnimatedButton } from '../common/AnimatedButton';
export { default as AnimatedSection } from '../common/AnimatedSection';
export { default as FloatingElements } from '../common/FloatingElements';
export { default as PageAnimationWrapper } from '../common/PageAnimationWrapper';

// Re-export animation hooks for advanced usage
export { 
  useScrollPosition, 
  useParallax, 
  useSectionAnimation,
  animationVariants, 
  hoverAnimations,
  useFloatingElements 
} from '../../hooks/useAnimations';
