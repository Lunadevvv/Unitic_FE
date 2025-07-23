import React, { useEffect } from 'react';
import { Layout } from 'antd';
import { motion } from 'framer-motion';
import AppHeader from '../common/AppHeader';
import AppFooter from '../common/AppFooter';
import FloatingElements from '../common/FloatingElements';
import { animationVariants } from '../../hooks/useAnimations';
import { useAuth } from '../../hooks/useAuth';
import '../../assets/scss/MainLayout.scss';

const { Content } = Layout;

const MainLayout = ({ 
  children,
  headerProps = {},
  showHeader = true,
  showFooter = true,
  className = '',
  contentClassName = '',
  // Animation props
  showAnimations = true,
  showFloatingElements = false,
  floatingVariant = 'default',
  heroSection = null
}) => {
  // Get actual user data from auth state
  const { user, isAuthenticated, token, refreshUserProfile } = useAuth();

  // Auto-fetch user profile if authenticated but user data is incomplete
  useEffect(() => {
    if (isAuthenticated && token && user && (!user.firstName && !user.FirstName)) {
      refreshUserProfile();
    }
  }, [isAuthenticated, token, user, refreshUserProfile]);

  const defaultHeaderProps = {
    showAnimation: true,
    transparent: false,
    fixed: false,
    showCart: true,
    showNotifications: true,
    user: isAuthenticated ? user : null,
    ...headerProps
  };

  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 }
  };

  const ContentWrapper = showAnimations ? motion.div : 'div';
  const contentProps = showAnimations ? {
    variants: pageVariants,
    initial: "initial",
    animate: "animate",
    exit: "exit",
    transition: { duration: 0.6 }
  } : {};

  return (
    <Layout className={`main-layout ${className}`}>
      {showHeader && (
        <AppHeader {...defaultHeaderProps} />
      )}
      
      <ContentWrapper 
        className={`main-content ${contentClassName}`}
        {...contentProps}
      >
        {showFloatingElements && (
          <FloatingElements variant={floatingVariant} />
        )}
        
        {heroSection && (
          <motion.div 
            className="hero-section"
            variants={animationVariants.fadeInVariant}
            initial="hidden"
            animate="visible"
          >
            {heroSection}
          </motion.div>
        )}
        
        <motion.div 
          className="page-content"
          variants={showAnimations ? animationVariants.staggerContainerVariant : {}}
          initial={showAnimations ? "hidden" : false}
          animate={showAnimations ? "visible" : false}
        >
          {children}
        </motion.div>
      </ContentWrapper>
      
      {showFooter && (
        <AppFooter />
      )}
    </Layout>
  );
};

export default MainLayout;
