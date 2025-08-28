import React from 'react';
import { motion } from 'framer-motion';
import { animationVariants } from '../../hooks/useAnimations';

const AnimatedSection = ({ 
  children, 
  animationType = 'fadeIn',
  className = '',
  containerType = 'stagger',
  delay = 0,
  ...props 
}) => {
  const animationVariant = containerType === 'stagger' 
    ? animationVariants.staggerContainerVariant 
    : animationVariants[`${animationType}Variant`] || animationVariants.fadeInVariant;

  return (
    <motion.section
      className={`animated-section ${className}`}
      variants={animationVariant}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: false, amount: 0.3 }}
      transition={{ delay }}
      {...props}
    >
      {children}
    </motion.section>
  );
};

export default AnimatedSection;
