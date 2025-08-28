import React from 'react';
import { Layout } from 'antd';
import AppHeader from '../common/AppHeader';
import AppFooter from '../common/AppFooter';
import '../../assets/scss/PublicLayout.scss';

const { Content } = Layout;

const PublicLayout = ({ 
  children,
  headerProps = {},
  showHeader = true,
  showFooter = true,
  className = '',
  contentClassName = ''
}) => {
  const defaultHeaderProps = {
    showAnimation: true,
    transparent: true,
    fixed: false,
    showCart: true,
    showNotifications: false,
    user: null, // No user for public pages
    ...headerProps
  };

  return (
    <Layout className={`public-layout ${className}`}>
      {showHeader && (
        <AppHeader {...defaultHeaderProps} />
      )}
      
      <Content className={`public-content ${contentClassName}`}>
        {children}
      </Content>
      
      {showFooter && (
        <AppFooter />
      )}
    </Layout>
  );
};

export default PublicLayout;
