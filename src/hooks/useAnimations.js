import { useState, useEffect, useRef } from 'react';
import { useInView } from 'framer-motion';

// Custom hook for scroll position
export const useScrollPosition = () => {
  const [scrollPosition, setScrollPosition] = useState(0);
  
  const handleScroll = () => {
    const position = window.pageYOffset;
    setScrollPosition(position);
  };
  
  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return scrollPosition;
};

// Custom hook for parallax effect
export const useParallax = (factor = 0.3) => {
  const scrollPosition = useScrollPosition();
  
  return {
    transform: `translateY(${scrollPosition * factor}px)`,
  };
};

// Custom hook for individual section animation
export const useSectionAnimation = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: false, amount: 0.3 });
  
  return { ref, inView };
};

// Animation variants
export const animationVariants = {
  fadeInVariant: {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  },

  staggerContainerVariant: {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  },

  itemVariant: {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  },

  slideInLeftVariant: {
    hidden: { opacity: 0, x: -50 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.6 } }
  },

  slideInRightVariant: {
    hidden: { opacity: 0, x: 50 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.6 } }
  },

  scaleInVariant: {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.5 } }
  },

  titleRevealVariant: {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.2 } }
  },

  titleTextVariant: {
    hidden: { y: 50, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.5 } }
  },

  titleDecorationVariant: {
    hidden: { scaleX: 0 },
    visible: { scaleX: 1, transition: { duration: 0.5, delay: 0.3 } }
  },

  rotateInVariant: {
    hidden: { opacity: 0, rotateY: 90 },
    visible: { opacity: 1, rotateY: 0, transition: { duration: 0.6 } }
  },

  footerSectionVariant: {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  }
};

// Hover animations
export const hoverAnimations = {
  cardHover: {
    whileHover: { y: -8, scale: 1.02, transition: { duration: 0.3 } }
  },

  buttonHover: {
    whileHover: { scale: 1.05, y: -3 },
    whileTap: { scale: 0.98 }
  },

  perspectiveHover: {
    whileHover: { 
      scale: 1.05, 
      rotateY: 5, 
      rotateX: 5, 
      y: -10,
      transition: { duration: 0.3 }
    }
  },

  floatHover: {
    whileHover: { y: -5, scale: 1.05, transition: { duration: 0.3 } }
  },

  socialHover: {
    whileHover: { scale: 1.2, rotate: 5 },
    whileTap: { scale: 0.9 }
  },

  tiltHover: {
    whileHover: { y: -10, rotateX: 2, rotateY: -2 }
  }
};

// Floating elements animation
export const useFloatingElements = () => {
  const floatingAnimations = {
    circle1: {
      animate: {
        y: [0, -30, 20, 10, 0],
        x: [0, 15, -20, 15, 0],
        scale: [1, 1.05, 0.95, 1.02, 1]
      },
      transition: {
        duration: 20,
        repeat: Infinity,
        repeatType: "loop"
      }
    },
    circle2: {
      animate: {
        y: [0, 30, -15, 5, 0],
        x: [0, -20, 10, -5, 0],
        scale: [1, 0.95, 1.05, 0.98, 1]
      },
      transition: {
        duration: 18,
        repeat: Infinity,
        repeatType: "loop",
        delay: 1
      }
    },
    circle3: {
      animate: {
        y: [0, -20, 15, -10, 0],
        x: [0, 10, -15, 5, 0],
        scale: [1, 1.02, 0.98, 1.03, 1]
      },
      transition: {
        duration: 22,
        repeat: Infinity,
        repeatType: "loop",
        delay: 2
      }
    },
    square1: {
      animate: {
        rotate: [0, 360],
        y: [0, -15, 10, -5, 0],
        x: [0, 10, -5, 15, 0]
      },
      transition: {
        duration: 30,
        repeat: Infinity,
        repeatType: "loop"
      }
    },
    square2: {
      animate: {
        rotate: [0, -360],
        y: [0, 20, -10, 5, 0],
        x: [0, -15, 10, -5, 0]
      },
      transition: {
        duration: 25,
        repeat: Infinity,
        repeatType: "loop",
        delay: 1.5
      }
    }
  };

  return floatingAnimations;
};
