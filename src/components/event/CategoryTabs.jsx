import React, { useRef, useEffect, useState } from 'react';
import { Badge, Tooltip } from 'antd';
import { motion } from 'framer-motion';
import '../../assets/scss/CategoryTabs.scss';

const CategoryTabs = ({ 
  categories = [], 
  activeCategory = 'all', 
  onChange, 
  counts = {},
  showScrollIndicators = true,
  tabsLabel = "Categories"
}) => {
  const tabsRef = useRef(null);
  
  // Format category name for display
  const formatCategoryName = (category) => {
    if (category === 'all') return 'Tất cả';
    
    return category
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  };
  
  // Handle category change
  const handleCategoryChange = (category) => {
    if (onChange) {
      onChange(category);
    }
  };
  
  // Check if scrolling is needed
  const [scrollable, setScrollable] = useState(false);
  const [scrollPosition, setScrollPosition] = useState({ left: false, right: true });

  // Scroll to show active tab
  useEffect(() => {
    if (tabsRef.current) {
      const activeTab = tabsRef.current.querySelector('.category-tab.active');
      if (activeTab) {
        const container = tabsRef.current;
        const scrollLeft = activeTab.offsetLeft - (container.clientWidth / 2) + (activeTab.clientWidth / 2);
        container.scrollTo({ left: scrollLeft, behavior: 'smooth' });
      }
    }
  }, [activeCategory]);
  
  // Check if scrollable and scroll indicators
  useEffect(() => {
    if (tabsRef.current) {
      const container = tabsRef.current;
      setScrollable(container.scrollWidth > container.clientWidth);
      
      const handleScroll = () => {
        const isLeftVisible = container.scrollLeft > 20;
        const isRightVisible = container.scrollWidth - container.clientWidth > container.scrollLeft + 20;
        
        setScrollPosition({ left: isLeftVisible, right: isRightVisible });
      };
      
      container.addEventListener('scroll', handleScroll);
      handleScroll(); // Initial check
      
      return () => container.removeEventListener('scroll', handleScroll);
    }
  }, [categories]);
  
  // Scroll handling functions
  const scrollLeft = () => {
    if (tabsRef.current) {
      tabsRef.current.scrollBy({ left: -200, behavior: 'smooth' });
    }
  };
  
  const scrollRight = () => {
    if (tabsRef.current) {
      tabsRef.current.scrollBy({ left: 200, behavior: 'smooth' });
    }
  };
  
  return (
    <div className="category-tabs" role="tablist" aria-label={tabsLabel}>
      <motion.div
        className="tabs-container"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {scrollable && showScrollIndicators && (
          <>
            <button 
              className={`scroll-indicator left ${scrollPosition.left ? 'visible' : ''}`}
              onClick={scrollLeft}
              aria-label="Scroll categories left"
            >
              <svg viewBox="0 0 24 24" width="24" height="24">
                <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
              </svg>
            </button>
            <button 
              className={`scroll-indicator right ${scrollPosition.right ? 'visible' : ''}`}
              onClick={scrollRight}
              aria-label="Scroll categories right"
            >
              <svg viewBox="0 0 24 24" width="24" height="24">
                <path d="M10.59 6L12 7.41 16.17 12 12 16.59 10.59 18 6 12z" />
              </svg>
            </button>
          </>
        )}
        
        <div className="scrollable-tabs" ref={tabsRef}>
          {categories.map((category, index) => {
            const categoryName = formatCategoryName(category);
            const isActive = activeCategory === category;
            const categoryCount = counts && counts[category];
            
            return (
              <motion.div
                key={category}
                className={`category-tab ${isActive ? 'active' : ''}`}
                onClick={() => handleCategoryChange(category)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleCategoryChange(category);
                  }
                }}
                role="tab"
                tabIndex={0}
                aria-selected={isActive}
                aria-controls={`panel-${category}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ y: -3 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="category-name">
                  {categoryName}
                </span>
                
                {categoryCount > 0 && (
                  <Badge 
                    count={categoryCount} 
                    className="category-count"
                    aria-label={`${categoryCount} items`}
                  />
                )}
                
                {isActive && (
                  <motion.div
                    className="active-indicator"
                    layoutId="activeIndicator"
                    transition={{ 
                      duration: 0.3,
                      type: "spring", 
                      stiffness: 500, 
                      damping: 30 
                    }}
                  />
                )}
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
};

export default React.memo(CategoryTabs);