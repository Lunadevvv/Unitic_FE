import React from 'react';
import { Card } from 'antd';
import { motion } from 'framer-motion';
import { animationVariants, hoverAnimations } from '../../hooks/useAnimations';

const AnimatedCard = ({ 
  children, 
  animationType = 'fadeIn',
  hoverType = 'cardHover',
  delay = 0,
  className = '',
  ...cardProps 
}) => {
  const animationVariant = animationVariants[`${animationType}Variant`] || animationVariants.fadeInVariant;
  const hoverAnimation = hoverAnimations[hoverType] || hoverAnimations.cardHover;

  return (
    <motion.div
      variants={animationVariant}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: false, amount: 0.3 }}
      transition={{ delay }}
      {...hoverAnimation}
      className={`animated-card ${className}`}
    >
      <Card {...cardProps}>
        {children}
      </Card>
    </motion.div>
  );
};

export default AnimatedCard;
