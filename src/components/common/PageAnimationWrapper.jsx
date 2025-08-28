import React from 'react';
import MainLayout from '../layout/MainLayout';

const PageAnimationWrapper = ({ 
  children, 
  className = '', 
  showFloatingElements = true,
  floatingVariant = 'default',
  headerProps = {},
  showFooter = true,
  heroSection = null,
  showAnimations = true
}) => {
  const defaultHeaderProps = {
    showAnimation: true,
    transparent: false,
    fixed: false,
    showCart: true,
    showNotifications: true,
    ...headerProps
  };

  return (
    <MainLayout 
      headerProps={defaultHeaderProps}
      showFooter={showFooter}
      className={className}
      showAnimations={showAnimations}
      showFloatingElements={showFloatingElements}
      floatingVariant={floatingVariant}
      heroSection={heroSection}
    >
      {children}
    </MainLayout>
  );
};

export default PageAnimationWrapper;
