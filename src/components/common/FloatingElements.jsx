import React from 'react';
import { motion } from 'framer-motion';
import { useFloatingElements } from '../../hooks/useAnimations';

const FloatingElements = ({ variant = 'default' }) => {
  const floatingAnimations = useFloatingElements();

  return (
    <div className={`floating-elements floating-elements--${variant}`}>
      <motion.div 
        className="floating-circle circle-1"
        {...floatingAnimations.circle1}
      />
      <motion.div 
        className="floating-circle circle-2"
        {...floatingAnimations.circle2}
      />
      <motion.div 
        className="floating-circle circle-3"
        {...floatingAnimations.circle3}
      />
      <motion.div 
        className="floating-square square-1"
        {...floatingAnimations.square1}
      />
      <motion.div 
        className="floating-square square-2"
        {...floatingAnimations.square2}
      />
    </div>
  );
};

export default FloatingElements;
