import React, { useState, useRef, useEffect } from 'react';
import { Layout, Button, Dropdown, Avatar, Badge } from 'antd';
import { 
  UserOutlined, LogoutOutlined, SettingOutlined, 
  BellOutlined, ShoppingCartOutlined, MenuOutlined,
  CalendarOutlined, TeamOutlined
} from '@ant-design/icons';
import { motion, useInView } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { useCart } from '../../hooks/useCart';
import '../../assets/scss/AppHeader.scss';

const { Header } = Layout;

const   AppHeader = ({ 
  showAnimation = true, 
  transparent = false, 
  fixed = false,
  showCart = true,
  showNotifications = true,
  user = null 
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { totalItems } = useCart();
  const [scrollPosition, setScrollPosition] = useState(0);
  
  const headerRef = useRef(null);
  const headerInView = useInView(headerRef, { once: false, amount: 0.3 });

  useEffect(() => {
    if (fixed) {
      const handleScroll = () => {
        const position = window.pageYOffset;
        setScrollPosition(position);
      };
      
      window.addEventListener('scroll', handleScroll);
      return () => window.removeEventListener('scroll', handleScroll);
    }
  }, [fixed]);

  const itemVariant = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  const isCurrentPath = (path) => {
    return location.pathname === path;
  };

  // Navigation items
  const navigationItems = [
    { path: '/', label: 'Trang chủ' },
    { path: '/events', label: 'Sự kiện' },
    { path: '/organization/events', label: 'Tổ chức sự kiện' },
    { path: '/about', label: 'Về chúng tôi' }
  ];

  // User dropdown menu
  const userMenuItems = [
    {
      key: 'profile',
      label: 'Hồ sơ cá nhân',
      icon: <UserOutlined />,
      onClick: () => navigate('/profile')
    },
    {
      key: 'my-events',
      label: 'Sự kiện của tôi',
      icon: <CalendarOutlined />,
      onClick: () => navigate('/user/events')
    },
    {
      key: 'organization',
      label: 'Quản lý tổ chức',
      icon: <TeamOutlined />,
      onClick: () => navigate('/organization/events')
    },
    {
      type: 'divider'
    },
    {
      key: 'settings',
      label: 'Cài đặt',
      icon: <SettingOutlined />,
      onClick: () => navigate('/settings')
    },
    {
      key: 'logout',
      label: 'Đăng xuất',
      icon: <LogoutOutlined />,
      onClick: () => {
        // Handle logout
        navigate('/');
      }
    }
  ];

  const headerClassName = `app-header ${transparent ? 'transparent' : ''} ${fixed ? 'fixed' : ''}`;
  const headerStyle = fixed ? {
    transform: `translateY(${scrollPosition > 100 ? '-100%' : '0'})`,
    background: scrollPosition > 50 ? 'rgba(139, 112, 84, 0.95)' : undefined,
    backdropFilter: scrollPosition > 50 ? 'blur(10px)' : undefined
  } : {};

  const HeaderContent = () => (
    <Header className={headerClassName} style={headerStyle}>
      <motion.div 
        className="logo"
        variants={{
          hidden: { opacity: 0, x: -50 },
          visible: { opacity: 1, x: 0, transition: { duration: 0.6 } }
        }}
        animate={showAnimation ? (headerInView ? "visible" : "hidden") : "visible"}
        initial={showAnimation ? "hidden" : "visible"}
      >
        <div 
          className="text-logo animate-gradient"
          onClick={() => navigate('/')}
          style={{ cursor: 'pointer' }}
        >
          UniTic
        </div>
      </motion.div>

      <motion.div 
        className="top-navigation"
        variants={{
          hidden: { opacity: 0, x: 50 },
          visible: { 
            opacity: 1, 
            x: 0, 
            transition: { 
              duration: 0.6, 
              staggerChildren: 0.1, 
              delayChildren: 0.2 
            } 
          }
        }}
        animate={showAnimation ? (headerInView ? "visible" : "hidden") : "visible"}
        initial={showAnimation ? "hidden" : "visible"}
      >
        {/* Desktop Navigation */}
        <div className="desktop-nav">
          {navigationItems.map((item) => (
            <motion.span 
              key={item.path}
              className={`nav-item ${isCurrentPath(item.path) ? 'active' : ''}`} 
              variants={itemVariant}
              onClick={() => navigate(item.path)}
            >
              <span className="nav-text">{item.label}</span>
              <span className="nav-hover-effect"></span>
            </motion.span>
          ))}
        </div>

        {/* Right side actions */}
        <div className="header-actions">
          {/* Notifications */}
          {showNotifications && (
            <motion.div variants={itemVariant} className="action-item">
              <Badge count={3} size="small">
                <Button 
                  type="text" 
                  icon={<BellOutlined />} 
                  className="action-button"
                />
              </Badge>
            </motion.div>
          )}

          {/* Cart */}
          {showCart && (
            <motion.div variants={itemVariant} className="action-item">
              <Badge count={totalItems} size="small">
                <Button 
                  type="text" 
                  icon={<ShoppingCartOutlined />} 
                  className="action-button"
                  onClick={() => navigate('/cart')}
                />
              </Badge>
            </motion.div>
          )}

          {/* User Menu or Login Button */}
          {user ? (
            <motion.div variants={itemVariant} className="action-item">
              <Dropdown
                menu={{ items: userMenuItems }}
                placement="bottomRight"
                trigger={['click']}
              >
                <div className="user-profile">
                  <Avatar 
                    src={user.avatar} 
                    icon={<UserOutlined />}
                    className="user-avatar"
                  />
                  <span className="user-name">{user.name}</span>
                </div>
              </Dropdown>
            </motion.div>
          ) : (
            <motion.button 
              className="login-button pulse-animation" 
              onClick={() => navigate('/signin')}
              variants={itemVariant}
              whileHover={{ scale: 1.05, y: -3 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="button-text">Đăng nhập</span>
              <span className="button-overlay"></span>
            </motion.button>
          )}

          {/* Mobile menu button */}
          <motion.div variants={itemVariant} className="mobile-menu-button">
            <Button 
              type="text" 
              icon={<MenuOutlined />} 
              className="action-button"
            />
          </motion.div>
        </div>
      </motion.div>
    </Header>
  );

  if (showAnimation) {
    return (
      <motion.div
        ref={headerRef}
        animate={headerInView ? "visible" : "hidden"}
        initial="hidden"
        className="header-animation-container"
      >
        <HeaderContent />
      </motion.div>
    );
  }

  return <HeaderContent />;
};

export default AppHeader;
