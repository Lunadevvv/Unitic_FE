import React, { useState } from 'react';
import { Layout, Menu, Button, Divider, Avatar, Tooltip } from 'antd';
import { 
  MenuFoldOutlined, 
  MenuUnfoldOutlined, 
  HomeOutlined, 
  CalendarOutlined, 
  AppstoreOutlined,
  UserOutlined,
  ShoppingOutlined,
  HeartOutlined,
  SettingOutlined,
  LogoutOutlined,
  TagOutlined,
  StarOutlined,
  TeamOutlined,
  RocketOutlined
} from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';

const { Sider } = Layout;

const CustomSidebar = ({ 
  collapsed, 
  onCollapse, 
  userRole = 'user', // 'user', 'admin', or 'guest'
  userName = 'User Name',
  userAvatar = null
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [hoveredKey, setHoveredKey] = useState(null);

  const userMenuItems = [
    {
      key: 'home',
      icon: <HomeOutlined />,
      label: 'Trang chủ',
      path: '/'
    },
    {
      key: 'events',
      icon: <CalendarOutlined />,
      label: 'Sự kiện',
      path: '/events'
    },
    {
      key: 'categories',
      icon: <AppstoreOutlined />,
      label: 'Danh mục',
      path: '/categories'
    },
    {
      type: 'divider',
    },
    {
      key: 'my-tickets',
      icon: <TagOutlined />,
      label: 'Vé của tôi',
      path: '/my-tickets'
    },
    {
      key: 'favorites',
      icon: <HeartOutlined />,
      label: 'Yêu thích',
      path: '/favorites'
    },
    {
      key: 'orders',
      icon: <ShoppingOutlined />,
      label: 'Đơn hàng',
      path: '/orders'
    },
    {
      type: 'divider',
    },
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: 'Hồ sơ',
      path: '/profile'
    },
    {
      key: 'settings',
      icon: <SettingOutlined />,
      label: 'Cài đặt',
      path: '/settings'
    },
  ];

  const adminMenuItems = [
    {
      key: 'dashboard',
      icon: <HomeOutlined />,
      label: 'Dashboard',
      path: '/admin'
    },
    {
      key: 'event-management',
      icon: <CalendarOutlined />,
      label: 'Quản lý sự kiện',
      path: '/admin/events'
    },
    {
      key: 'user-management',
      icon: <TeamOutlined />,
      label: 'Quản lý người dùng',
      path: '/admin/users'
    },
    {
      key: 'order-management',
      icon: <ShoppingOutlined />,
      label: 'Quản lý đơn hàng',
      path: '/admin/orders'
    },
    {
      key: 'ticket-management',
      icon: <TagOutlined />,
      label: 'Quản lý vé',
      path: '/admin/tickets'
    },
    {
      key: 'reports',
      icon: <StarOutlined />,
      label: 'Báo cáo',
      path: '/admin/reports'
    },
    {
      type: 'divider',
    },
    {
      key: 'settings',
      icon: <SettingOutlined />,
      label: 'Cài đặt',
      path: '/admin/settings'
    }
  ];

  const menuItems = userRole === 'admin' ? adminMenuItems : userMenuItems;

  // Add animation variants for menu items
  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 }
  };

  // Select which key should be active based on current path
  const getSelectedKey = () => {
    const path = location.pathname;
    const item = menuItems.find(item => item.path && path.startsWith(item.path));
    return item ? [item.key] : ['home'];
  };

  const handleMenuClick = (e) => {
    const item = menuItems.find(item => item.key === e.key);
    if (item && item.path) {
      navigate(item.path);
    }
  };

  const renderMenuItems = () => {
    return menuItems.map((item, index) => {
      if (item.type === 'divider') {
        return <Divider key={`divider-${index}`} style={{ margin: '8px 0' }} />;
      }
      
      return (
        <motion.div
          key={item.key}
          variants={itemVariants}
          initial="hidden"
          animate="visible"
          transition={{ delay: index * 0.05 }}
          onHoverStart={() => setHoveredKey(item.key)}
          onHoverEnd={() => setHoveredKey(null)}
        >
          <Menu.Item 
            key={item.key} 
            icon={item.icon}
            className={hoveredKey === item.key ? 'menu-item-hovered' : ''}
          >
            {item.label}
          </Menu.Item>
        </motion.div>
      );
    });
  };

  const sidebarStyle = {
    boxShadow: '0 0 15px rgba(0, 0, 0, 0.1)',
    borderRight: '1px solid rgba(142, 202, 230, 0.2)',
    overflow: 'auto',
    height: '100vh',
    position: 'fixed',
    left: 0,
    top: 0,
    bottom: 0,
    background: '#33302e',
  };

  const logoStyle = {
    margin: '16px',
    textAlign: 'center',
    color: '#8ecae6',
    fontWeight: 'bold',
    fontSize: '24px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: collapsed ? 'center' : 'flex-start',
    transition: 'all 0.3s'
  };

  const profileStyle = {
    padding: collapsed ? '10px 0' : '16px',
    display: 'flex',
    flexDirection: collapsed ? 'column' : 'row',
    alignItems: 'center',
    justifyContent: collapsed ? 'center' : 'flex-start',
    gap: '12px',
    margin: '16px 0',
  };

  const userNameStyle = {
    color: '#f8f5f1',
    fontWeight: '500',
    fontSize: '14px',
    margin: 0,
    display: collapsed ? 'none' : 'block'
  };

  const roleBadgeStyle = {
    padding: '2px 8px',
    borderRadius: '12px',
    fontSize: '10px',
    background: userRole === 'admin' ? '#d4b483' : '#8ecae6',
    color: '#33302e',
    fontWeight: 'bold',
    display: collapsed ? 'none' : 'inline-block'
  };

  return (
    <Sider
      trigger={null}
      collapsible
      collapsed={collapsed}
      width={250}
      style={sidebarStyle}
      theme="dark"
    >
      <motion.div
        style={logoStyle}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <RocketOutlined style={{ fontSize: '24px', marginRight: collapsed ? '0' : '12px' }} />
        {!collapsed && <span className="logo-text">UniTic</span>}
      </motion.div>
      
      <Divider style={{ margin: '0 0 8px 0', borderColor: 'rgba(248, 245, 241, 0.1)' }} />
      
      <div style={profileStyle}>
        <Avatar 
          size={collapsed ? 40 : 50} 
          icon={<UserOutlined />} 
          src={userAvatar}
          style={{ boxShadow: '0 0 10px rgba(142, 202, 230, 0.5)' }}
        />
        {!collapsed && (
          <div>
            <Tooltip title={userName}>
              <p style={userNameStyle}>{userName}</p>
            </Tooltip>
            <span style={roleBadgeStyle}>
              {userRole === 'admin' ? 'Admin' : 'User'}
            </span>
          </div>
        )}
      </div>
      
      <Menu
        theme="dark"
        mode="inline"
        selectedKeys={getSelectedKey()}
        onClick={handleMenuClick}
        style={{ 
          borderRight: 0, 
          background: 'transparent',
        }}
      >
        {renderMenuItems()}
      </Menu>
      
      <div style={{ 
        position: 'absolute', 
        bottom: '20px', 
        width: '100%',
        padding: collapsed ? '0 8px' : '0 16px'
      }}>
        <Button 
          type="text" 
          danger 
          icon={<LogoutOutlined />} 
          onClick={() => navigate('/signin')}
          style={{ width: collapsed ? '100%' : 'auto' }}
        >
          {!collapsed && 'Đăng xuất'}
        </Button>
        
        <Button
          type="text"
          icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          onClick={onCollapse}
          style={{ 
            marginTop: '8px',
            color: '#f8f5f1',
            width: collapsed ? '100%' : 'auto',
            display: 'flex',
            alignItems: 'center',
            justifyContent: collapsed ? 'center' : 'flex-start'
          }}
        >
          {!collapsed && 'Thu gọn'}
        </Button>
      </div>
    </Sider>
  );
};

export default CustomSidebar;