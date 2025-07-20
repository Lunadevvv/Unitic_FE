import React from 'react';
import { Button } from 'antd';
import { motion } from 'framer-motion';
import { hoverAnimations } from '../../hooks/useAnimations';

const AnimatedButton = ({ 
  children, 
  hoverType = 'buttonHover',
  className = '',
  ...buttonProps 
}) => {
  const hoverAnimation = hoverAnimations[hoverType] || hoverAnimations.buttonHover;

  return (
    <motion.div
      {...hoverAnimation}
      className={`animated-button ${className}`}
    >
      <Button {...buttonProps}>
        {children}
      </Button>
    </motion.div>
  );
};

export default AnimatedButton;
