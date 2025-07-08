import React from 'react';
import { Layout } from 'antd';
import AppHeader from '../common/AppHeader';
import AppFooter from '../common/AppFooter';
import '../../assets/scss/MainLayout.scss';

const { Content } = Layout;

const MainLayout = ({ 
  children,
  headerProps = {},
  showHeader = true,
  showFooter = true,
  className = '',
  contentClassName = '',
  user = null
}) => {
  // Mock user data - replace with actual auth context
  const currentUser = user || {
    name: 'Nguyễn Văn A',
    email: 'user@example.com',
    avatar: '/src/assets/img/demo.jpg',
    membershipLevel: 'Premium'
  };

  const defaultHeaderProps = {
    showAnimation: false,
    transparent: false,
    fixed: false,
    showCart: true,
    showNotifications: true,
    user: currentUser,
    ...headerProps
  };

  return (
    <Layout className={`main-layout ${className}`}>
      {showHeader && (
        <AppHeader {...defaultHeaderProps} />
      )}
      
      <Content className={`main-content ${contentClassName}`}>
        {children}
      </Content>
      
      {showFooter && (
        <AppFooter />
      )}
    </Layout>
  );
};

export default MainLayout;
