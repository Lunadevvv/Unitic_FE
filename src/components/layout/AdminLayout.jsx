import { useState, useEffect } from 'react';
import { Layout, Menu, Avatar, Dropdown, Button, Badge, Space, Typography } from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  DashboardOutlined, UserOutlined, CalendarOutlined, ShoppingOutlined,
  BarChartOutlined, SettingOutlined, LogoutOutlined,
  BellOutlined, MenuOutlined, SearchOutlined, HomeOutlined, 
  QuestionCircleOutlined, DownOutlined,
  TikTokFilled
} from '@ant-design/icons';
import RoleGuard from '../auth/RoleGuard';
import { ROLES, hasPermission } from '../../utils/rolePermissions';
import '../../assets/scss/AdminLayout.scss';

const { Header, Sider, Content } = Layout;
const { Text } = Typography;

const AdminLayout = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  
  // Get user from Redux store
  const { user, isAuthenticated } = useSelector(state => state.auth);

  // Update time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  // Check if user has permission to access admin area
  useEffect(() => {
    if (!isAuthenticated || !user || user.role === ROLES.USER) {
      navigate('/');
      return;
    }
  }, [isAuthenticated, user, navigate]);

  // If user doesn't have permission, don't render anything
  if (!isAuthenticated || !user || user.role === ROLES.USER) {
    return null;
  }

  // Admin user data (use actual user data only)
  const admin = {
    name: user ? `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.email : '',
    email: user?.email || '',
    avatar: user?.avatar || '/src/assets/img/demo.jpg',
    role: user?.role === ROLES.ADMIN ? 'Super Admin' : 
          user?.role === ROLES.MODERATOR ? 'Moderator' : 
          user?.role === ROLES.ORGANIZER ? 'Organizer' :
          user?.role === ROLES.STAFF ? 'Staff' : ''
  };

  // Menu items with role-based filtering
  const allMenuItems = [
    {
      key: '/admin',
      icon: <DashboardOutlined />,
      label: 'Dashboard',
      path: '/admin',
      permission: 'canAccessDashboard'
    },
    {
      key: '/admin/users',
      icon: <UserOutlined />,
      label: 'Quản lý người dùng',
      path: '/admin/users',
      permission: 'canAccessUserManagement'
    },
    {
      key: '/admin/events',
      icon: <CalendarOutlined />,
      label: 'Quản lý sự kiện',
      path: '/admin/events',
      permission: 'canAccessEventManagement'
    },
    {
      key: '/admin/orders',
      icon: <ShoppingOutlined />,
      label: 'Quản lý đơn hàng',
      path: '/admin/orders',
      permission: 'canAccessOrderManagement'
    },
    {
      key: '/admin/tickets',
      icon: <TikTokFilled/>,
      label: 'Quản lý vé',
      path: '/admin/tickets',
      permission: 'canAccessTicketManagement'
    },
    {
      key: '/admin/reports',
      icon: <BarChartOutlined />,
      label: 'Báo cáo & Thống kê',
      path: '/admin/reports',
      permission: 'canAccessReports'
    },
    {
      key: '/admin/settings',
      icon: <SettingOutlined />,
      label: 'Cài đặt hệ thống',
      path: '/admin/settings',
      permission: 'canAccessAdmin'
    }
  ];

  // Filter menu items based on user role - only show items user has permission for
  const menuItems = allMenuItems.filter(item => {
    if (!user?.role || !item.permission) return false;
    return hasPermission(user.role, item.permission);
  });

  const userMenuItems = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: 'Thông tin cá nhân'
    },
    {
      key: 'settings',
      icon: <SettingOutlined />,
      label: 'Cài đặt'
    },
    {
      type: 'divider'
    },
    {
      key: 'back-to-site',
      icon: <HomeOutlined />,
      label: 'Về trang chủ',
      onClick: () => navigate('/')
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'Đăng xuất',
      onClick: () => {
        // Call logout action and redirect
        import('../../store/actions/authActions').then(({ logoutUser }) => {
          // Dispatch logoutUser action
          const { dispatch } = require('react-redux');
          dispatch(logoutUser()).then(() => {
            navigate('/signin');
          });
        });
      }
    }
  ];

  const handleMenuClick = ({ key }) => {
    const menuItem = menuItems.find(item => item.key === key);
    if (menuItem?.path) {
      navigate(menuItem.path);
    }
  };

  return (
    <Layout className="admin-layout">
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        className="admin-sider"
        width={250}
      >
        <div className="admin-logo">
          <div className="logo-container">
            {!collapsed ? (
              <span className="logo-text">UniTic Admin</span>
            ) : (
              <span className="logo-mini">UA</span>
            )}
          </div>
        </div>

        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[location.pathname]}
          onClick={handleMenuClick}
          className="admin-menu"
          items={menuItems.map(item => ({
            key: item.key,
            icon: item.icon,
            label: item.label
          }))}
        />

        {!collapsed && (
          <div className="admin-user-info">
            <div className="user-avatar">
              <Avatar src={admin.avatar} size={40} icon={<UserOutlined />} />
            </div>
            <div className="user-details">
              <Text strong className="user-name">{admin.name}</Text>
              <Text className="user-role">{admin.role}</Text>
            </div>
          </div>
        )}
      </Sider>

      <Layout className="admin-main">
        <Header className="admin-header">
          <div className="header-left">
            <Button
              type="text"
              icon={<MenuOutlined />}
              onClick={() => setCollapsed(!collapsed)}
              className="collapse-btn"
            />
            
            <div className="breadcrumb-section">
              <Text className="current-time">
                {currentTime.toLocaleString('vi-VN')}
              </Text>
            </div>
          </div>

          <div className="header-right">
            <Space size="middle">
              <Button
                type="text"
                icon={<SearchOutlined />}
                className="header-btn"
              />
              
              <Badge count={5} size="small">
                <Button
                  type="text"
                  icon={<BellOutlined />}
                  className="header-btn"
                />
              </Badge>

              <Button
                type="text"
                icon={<QuestionCircleOutlined />}
                className="header-btn"
              />

              <Dropdown
                menu={{ 
                  items: userMenuItems,
                  onClick: ({ key }) => {
                    const item = userMenuItems.find(i => i.key === key);
                    if (item?.onClick) item.onClick();
                  }
                }}
                placement="bottomRight"
                trigger={['click']}
              >
                <div className="user-dropdown">
                  <Avatar src={admin.avatar} size={32} icon={<UserOutlined />} />
                  <Text className="user-name-header">{admin.name}</Text>
                  <DownOutlined className="dropdown-icon" />
                </div>
              </Dropdown>
            </Space>
          </div>
        </Header>

        <Content className="admin-content">
          {children}
        </Content>
      </Layout>
    </Layout>
  );
};

export default AdminLayout;
