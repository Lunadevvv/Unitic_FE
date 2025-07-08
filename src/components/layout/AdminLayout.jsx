import { useState, useEffect } from 'react';
import { Layout, Menu, Avatar, Dropdown, Button, Badge, Space, Typography } from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  DashboardOutlined, UserOutlined, CalendarOutlined, ShoppingOutlined,
  BarChartOutlined, SettingOutlined, LogoutOutlined,
  BellOutlined, MenuOutlined, SearchOutlined, HomeOutlined, 
  QuestionCircleOutlined, DownOutlined,
  TikTokFilled
} from '@ant-design/icons';
import '../../assets/scss/AdminLayout.scss';

const { Header, Sider, Content } = Layout;
const { Text } = Typography;

const AdminLayout = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  // Mock admin data
  const admin = {
    name: 'Admin User',
    email: 'admin@unitic.com',
    avatar: '/src/assets/img/demo.jpg',
    role: 'Super Admin'
  };

  const menuItems = [
    {
      key: '/admin',
      icon: <DashboardOutlined />,
      label: 'Dashboard',
      path: '/admin'
    },
    {
      key: '/admin/users',
      icon: <UserOutlined />,
      label: 'Quản lý người dùng',
      path: '/admin/users'
    },
    {
      key: '/admin/events',
      icon: <CalendarOutlined />,
      label: 'Quản lý sự kiện',
      path: '/admin/events'
    },
    {
      key: '/admin/orders',
      icon: <ShoppingOutlined />,
      label: 'Quản lý đơn hàng',
      path: '/admin/orders'
    },
    {
      key: '/admin/tickets',
      icon: <TikTokFilled/>,
      label: 'Quản lý vé',
      path: '/admin/tickets'
    },
    {
      key: '/admin/reports',
      icon: <BarChartOutlined />,
      label: 'Báo cáo & Thống kê',
      path: '/admin/reports'
    },
    {
      key: '/admin/settings',
      icon: <SettingOutlined />,
      label: 'Cài đặt hệ thống',
      path: '/admin/settings'
    }
  ];

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
      onClick: () => navigate('/signin')
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
