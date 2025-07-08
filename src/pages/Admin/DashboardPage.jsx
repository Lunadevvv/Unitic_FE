import { useState, useEffect } from 'react';
import {
  Row, Col, Card, Statistic, Table, Typography, Space, Tag, Progress,
  Button, Select, DatePicker, List, Avatar, Badge, Alert, Divider
} from 'antd';
import {
  UserOutlined, CalendarOutlined, DollarOutlined, ShoppingOutlined,
  ArrowUpOutlined, ArrowDownOutlined, EyeOutlined, TeamOutlined,
  TrophyOutlined, ClockCircleOutlined, BellOutlined
} from '@ant-design/icons';
import { Line, Column, Pie } from '@ant-design/plots';
import AdminLayout from '../../components/layout/AdminLayout';
import '../../assets/scss/DashboardPage.scss';

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;
const { RangePicker } = DatePicker;

const DashboardPage = () => {
  const [timeRange, setTimeRange] = useState('week');
  const [loading, setLoading] = useState(false);

  // Mock dashboard data
  const [dashboardData] = useState({
    stats: {
      totalUsers: { value: 12847, change: 12.5, trend: 'up' },
      totalEvents: { value: 238, change: -2.3, trend: 'down' },
      totalRevenue: { value: 2847293, change: 15.8, trend: 'up' },
      totalOrders: { value: 5674, change: 8.2, trend: 'up' }
    },
    recentActivities: [
      { id: 1, type: 'user_register', user: 'Nguyễn Văn A', time: '2 phút trước', avatar: '/src/assets/img/demo.jpg' },
      { id: 2, type: 'event_created', user: 'Admin', event: 'Hội thảo Công nghệ 2024', time: '15 phút trước' },
      { id: 3, type: 'order_completed', user: 'Trần Thị B', amount: 250000, time: '1 giờ trước' },
      { id: 4, type: 'event_published', user: 'Moderator', event: 'Concert nhạc Việt', time: '2 giờ trước' }
    ],
    topEvents: [
      { id: 1, name: 'Concert Sơn Tùng MTP', sales: 1250, revenue: 3750000, status: 'active' },
      { id: 2, name: 'Hội thảo Marketing Digital', sales: 856, revenue: 1712000, status: 'active' },
      { id: 3, name: 'Triển lãm Nghệ thuật', sales: 432, revenue: 2160000, status: 'ended' },
      { id: 4, name: 'Workshop Lập trình', sales: 298, revenue: 894000, status: 'upcoming' }
    ],
    alerts: [
      { id: 1, type: 'warning', message: 'Sự kiện "Concert ABC" sắp hết vé', time: '10 phút trước' },
      { id: 2, type: 'info', message: 'Có 15 đơn hàng đang chờ xử lý', time: '30 phút trước' },
      { id: 3, type: 'success', message: 'Doanh thu tháng này đã đạt mục tiêu', time: '2 giờ trước' }
    ]
  });

  // Chart data
  const revenueData = [
    { month: 'T1', revenue: 1200000 },
    { month: 'T2', revenue: 1850000 },
    { month: 'T3', revenue: 2100000 },
    { month: 'T4', revenue: 1950000 },
    { month: 'T5', revenue: 2400000 },
    { month: 'T6', revenue: 2847293 }
  ];

  const userGrowthData = [
    { month: 'T1', users: 8500 },
    { month: 'T2', users: 9200 },
    { month: 'T3', users: 10100 },
    { month: 'T4', users: 10800 },
    { month: 'T5', users: 11600 },
    { month: 'T6', users: 12847 }
  ];

  const eventCategoryData = [
    { type: 'Âm nhạc', value: 35, count: 83 },
    { type: 'Công nghệ', value: 25, count: 60 },
    { type: 'Giáo dục', value: 20, count: 48 },
    { type: 'Thể thao', value: 12, count: 29 },
    { type: 'Khác', value: 8, count: 18 }
  ];

  useEffect(() => {
    // Simulate data loading
    setLoading(true);
    setTimeout(() => setLoading(false), 1000);
  }, [timeRange]);

  const revenueConfig = {
    data: revenueData,
    xField: 'month',
    yField: 'revenue',
    smooth: true,
    color: '#1890ff',
    point: {
      size: 4,
      shape: 'circle'
    }
  };

  const userGrowthConfig = {
    data: userGrowthData,
    xField: 'month',
    yField: 'users',
    color: '#52c41a'
  };

  const categoryConfig = {
    data: eventCategoryData,
    angleField: 'value',
    colorField: 'type',
    radius: 0.8,
    label: {
      type: 'spider',
      labelHeight: 28,
      content: '{name}\n{percentage}'
    }
  };

  const topEventsColumns = [
    {
      title: 'Sự kiện',
      dataIndex: 'name',
      key: 'name',
      render: (text) => <Text strong>{text}</Text>
    },
    {
      title: 'Vé đã bán',
      dataIndex: 'sales',
      key: 'sales',
      render: (value) => <Text>{value.toLocaleString('vi-VN')}</Text>
    },
    {
      title: 'Doanh thu',
      dataIndex: 'revenue',
      key: 'revenue',
      render: (value) => <Text strong>{value.toLocaleString('vi-VN')} ₫</Text>
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        const colors = {
          active: 'success',
          upcoming: 'processing',
          ended: 'default'
        };
        const labels = {
          active: 'Đang diễn ra',
          upcoming: 'Sắp diễn ra',
          ended: 'Đã kết thúc'
        };
        return <Tag color={colors[status]}>{labels[status]}</Tag>;
      }
    }
  ];

  const getActivityIcon = (type) => {
    const icons = {
      user_register: <UserOutlined />,
      event_created: <CalendarOutlined />,
      order_completed: <ShoppingOutlined />,
      event_published: <TrophyOutlined />
    };
    return icons[type] || <BellOutlined />;
  };

  const getActivityMessage = (activity) => {
    switch (activity.type) {
      case 'user_register':
        return `${activity.user} đã đăng ký tài khoản`;
      case 'event_created':
        return `${activity.user} đã tạo sự kiện "${activity.event}"`;
      case 'order_completed':
        return `${activity.user} đã đặt vé thành công (${activity.amount?.toLocaleString('vi-VN')} ₫)`;
      case 'event_published':
        return `${activity.user} đã xuất bản sự kiện "${activity.event}"`;
      default:
        return 'Hoạt động không xác định';
    }
  };

  return (
    <AdminLayout>
      <div className="dashboard-page">
        {/* Header */}
        <div className="dashboard-header">
          <div>
            <Title level={2}>Dashboard</Title>
            <Paragraph>Tổng quan hệ thống UniTic</Paragraph>
          </div>
          
          <Space>
            <Select
              value={timeRange}
              onChange={setTimeRange}
              style={{ width: 120 }}
            >
              <Option value="today">Hôm nay</Option>
              <Option value="week">Tuần này</Option>
              <Option value="month">Tháng này</Option>
              <Option value="year">Năm này</Option>
            </Select>
            
            <RangePicker />
            
            <Button type="primary" icon={<EyeOutlined />}>
              Xuất báo cáo
            </Button>
          </Space>
        </div>

        {/* Stats Cards */}
        <Row gutter={[24, 24]} className="stats-row">
          <Col xs={24} sm={12} lg={6}>
            <Card className="stat-card">
              <Statistic
                title="Tổng người dùng"
                value={dashboardData.stats.totalUsers.value}
                prefix={<UserOutlined />}
                suffix={
                  <span className={`trend ${dashboardData.stats.totalUsers.trend}`}>
                    {dashboardData.stats.totalUsers.trend === 'up' ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
                    {Math.abs(dashboardData.stats.totalUsers.change)}%
                  </span>
                }
              />
            </Card>
          </Col>
          
          <Col xs={24} sm={12} lg={6}>
            <Card className="stat-card">
              <Statistic
                title="Tổng sự kiện"
                value={dashboardData.stats.totalEvents.value}
                prefix={<CalendarOutlined />}
                suffix={
                  <span className={`trend ${dashboardData.stats.totalEvents.trend}`}>
                    {dashboardData.stats.totalEvents.trend === 'up' ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
                    {Math.abs(dashboardData.stats.totalEvents.change)}%
                  </span>
                }
              />
            </Card>
          </Col>
          
          <Col xs={24} sm={12} lg={6}>
            <Card className="stat-card">
              <Statistic
                title="Tổng doanh thu"
                value={dashboardData.stats.totalRevenue.value}
                prefix={<DollarOutlined />}
                formatter={(value) => `${value.toLocaleString('vi-VN')} ₫`}
                suffix={
                  <span className={`trend ${dashboardData.stats.totalRevenue.trend}`}>
                    {dashboardData.stats.totalRevenue.trend === 'up' ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
                    {Math.abs(dashboardData.stats.totalRevenue.change)}%
                  </span>
                }
              />
            </Card>
          </Col>
          
          <Col xs={24} sm={12} lg={6}>
            <Card className="stat-card">
              <Statistic
                title="Tổng đơn hàng"
                value={dashboardData.stats.totalOrders.value}
                prefix={<ShoppingOutlined />}
                suffix={
                  <span className={`trend ${dashboardData.stats.totalOrders.trend}`}>
                    {dashboardData.stats.totalOrders.trend === 'up' ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
                    {Math.abs(dashboardData.stats.totalOrders.change)}%
                  </span>
                }
              />
            </Card>
          </Col>
        </Row>

        {/* Charts Row */}
        <Row gutter={[24, 24]} className="charts-row">
          <Col xs={24} lg={16}>
            <Card title="Doanh thu theo tháng" loading={loading}>
              <Line {...revenueConfig} height={300} />
            </Card>
          </Col>
          
          <Col xs={24} lg={8}>
            <Card title="Phân loại sự kiện" loading={loading}>
              <Pie {...categoryConfig} height={300} />
            </Card>
          </Col>
        </Row>

        {/* Second Charts Row */}
        <Row gutter={[24, 24]} className="charts-row">
          <Col xs={24} lg={12}>
            <Card title="Tăng trưởng người dùng" loading={loading}>
              <Column {...userGrowthConfig} height={250} />
            </Card>
          </Col>
          
          <Col xs={24} lg={12}>
            <Card title="Top sự kiện bán chạy" loading={loading}>
              <Table
                dataSource={dashboardData.topEvents}
                columns={topEventsColumns}
                pagination={false}
                size="small"
              />
            </Card>
          </Col>
        </Row>

        {/* Bottom Row */}
        <Row gutter={[24, 24]} className="bottom-row">
          <Col xs={24} lg={16}>
            <Card title="Hoạt động gần đây">
              <List
                dataSource={dashboardData.recentActivities}
                renderItem={activity => (
                  <List.Item>
                    <List.Item.Meta
                      avatar={
                        activity.avatar ? 
                        <Avatar src={activity.avatar} /> : 
                        <Avatar icon={getActivityIcon(activity.type)} />
                      }
                      title={getActivityMessage(activity)}
                      description={
                        <Space>
                          <ClockCircleOutlined />
                          <Text type="secondary">{activity.time}</Text>
                        </Space>
                      }
                    />
                  </List.Item>
                )}
              />
            </Card>
          </Col>
          
          <Col xs={24} lg={8}>
            <Card title="Thông báo hệ thống">
              <Space direction="vertical" style={{ width: '100%' }}>
                {dashboardData.alerts.map(alert => (
                  <Alert
                    key={alert.id}
                    type={alert.type}
                    message={alert.message}
                    description={alert.time}
                    showIcon
                    closable
                  />
                ))}
              </Space>
              
              <Divider />
              
              <div className="system-health">
                <Title level={5}>Tình trạng hệ thống</Title>
                <Space direction="vertical" style={{ width: '100%' }}>
                  <div className="health-item">
                    <Text>CPU Usage</Text>
                    <Progress percent={45} size="small" status="active" />
                  </div>
                  <div className="health-item">
                    <Text>Memory Usage</Text>
                    <Progress percent={68} size="small" status="active" />
                  </div>
                  <div className="health-item">
                    <Text>Database</Text>
                    <Progress percent={32} size="small" status="active" />
                  </div>
                </Space>
              </div>
            </Card>
          </Col>
        </Row>
      </div>
    </AdminLayout>
  );
};

export default DashboardPage;
