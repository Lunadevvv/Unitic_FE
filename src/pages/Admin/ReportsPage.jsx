import { useState } from 'react';
import {
  Card, Row, Col, Select, DatePicker, Button, Space, Typography, 
  Statistic, Table, Progress, Tabs, Divider
} from 'antd';
import {
  LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import {
  DownloadOutlined, PrinterOutlined, FileExcelOutlined, FilePdfOutlined,
  TikTokOutlined, DollarOutlined, CalendarOutlined, UserOutlined,
   ShoppingOutlined, EyeOutlined, StarOutlined,
  TikTokFilled
} from '@ant-design/icons';
import AdminLayout from '../../components/layout/AdminLayout';
import '../../assets/scss/ReportsPage.scss';

const { Title, Text } = Typography;
const { Option } = Select;
const { RangePicker } = DatePicker;
const { TabPane } = Tabs;

const ReportsPage = () => {
  const [dateRange, setDateRange] = useState('30days');
  const [selectedPeriod, setSelectedPeriod] = useState([]);
  const [activeTab, setActiveTab] = useState('overview');

  // Mock data for charts
  const revenueData = [
    { name: 'T1', revenue: 4000000, tickets: 120, events: 5 },
    { name: 'T2', revenue: 3000000, tickets: 98, events: 4 },
    { name: 'T3', revenue: 5000000, tickets: 156, events: 6 },
    { name: 'T4', revenue: 7000000, tickets: 203, events: 8 },
    { name: 'T5', revenue: 6000000, tickets: 187, events: 7 },
    { name: 'T6', revenue: 8000000, tickets: 234, events: 9 },
    { name: 'T7', revenue: 9000000, tickets: 267, events: 10 },
    { name: 'T8', revenue: 11000000, tickets: 298, events: 12 },
    { name: 'T9', revenue: 8500000, tickets: 245, events: 9 },
    { name: 'T10', revenue: 7500000, tickets: 223, events: 8 },
    { name: 'T11', revenue: 9500000, tickets: 278, events: 11 },
    { name: 'T12', revenue: 12000000, tickets: 321, events: 14 }
  ];

  const categoryData = [
    { name: 'Âm nhạc', value: 40, color: '#8884d8' },
    { name: 'Giáo dục', value: 25, color: '#82ca9d' },
    { name: 'Nghệ thuật', value: 15, color: '#ffc658' },
    { name: 'Thể thao', value: 12, color: '#ff7300' },
    { name: 'Công nghệ', value: 8, color: '#00ff00' }
  ];

  const topEventsData = [
    { name: 'Concert Sơn Tùng MTP', revenue: 25500000, tickets: 8500, rating: 4.8 },
    { name: 'Hội thảo Marketing Digital', revenue: 22500000, tickets: 450, rating: 4.6 },
    { name: 'Triển lãm Nghệ thuật', revenue: 24000000, tickets: 1200, rating: 4.7 },
    { name: 'Chạy Marathon HCM', revenue: 18000000, tickets: 2000, rating: 4.5 },
    { name: 'Tech Conference 2024', revenue: 15000000, tickets: 300, rating: 4.9 }
  ];

  const userGrowthData = [
    { month: 'T1', newUsers: 150, totalUsers: 1150 },
    { month: 'T2', newUsers: 120, totalUsers: 1270 },
    { month: 'T3', newUsers: 200, totalUsers: 1470 },
    { month: 'T4', newUsers: 180, totalUsers: 1650 },
    { month: 'T5', newUsers: 250, totalUsers: 1900 },
    { month: 'T6', newUsers: 300, totalUsers: 2200 }
  ];

  const ticketStatusData = [
    { status: 'Đã sử dụng', count: 1250, percentage: 62.5 },
    { status: 'Có hiệu lực', count: 520, percentage: 26.0 },
    { status: 'Hết hạn', count: 180, percentage: 9.0 },
    { status: 'Đã hủy', count: 50, percentage: 2.5 }
  ];

  const paymentMethodData = [
    { method: 'Thẻ tín dụng', value: 45, color: '#1890ff' },
    { method: 'Chuyển khoản', value: 30, color: '#52c41a' },
    { method: 'Ví điện tử', value: 20, color: '#faad14' },
    { method: 'Tiền mặt', value: 5, color: '#f5222d' }
  ];

  // Statistics
  const totalRevenue = 85000000;
  const totalTickets = 2580;
  const totalEvents = 95;
  const totalUsers = 2200;
  const growthRate = 15.2;
  const conversionRate = 3.8;

  const columns = [
    {
      title: 'Sự kiện',
      dataIndex: 'name',
      key: 'name',
      render: (text) => <Text strong>{text}</Text>
    },
    {
      title: 'Doanh thu',
      dataIndex: 'revenue',
      key: 'revenue',
      render: (value) => (
        <Text style={{ color: '#52c41a', fontWeight: 'bold' }}>
          {value.toLocaleString('vi-VN')} ₫
        </Text>
      ),
      sorter: (a, b) => a.revenue - b.revenue
    },
    {
      title: 'Vé bán',
      dataIndex: 'tickets',
      key: 'tickets',
      render: (value) => <Text strong>{value}</Text>,
      sorter: (a, b) => a.tickets - b.tickets
    },
    {
      title: 'Đánh giá',
      dataIndex: 'rating',
      key: 'rating',
      render: (value) => (
        <Space>
          <StarOutlined style={{ color: '#faad14' }} />
          <Text strong>{value}</Text>
        </Space>
      ),
      sorter: (a, b) => a.rating - b.rating
    }
  ];

  const handleExport = (format) => {
    console.log(`Exporting report in ${format} format`);
  };

  const formatCurrency = (value) => {
    return `${(value / 1000000).toFixed(1)}M ₫`;
  };

  return (
    <AdminLayout>
      <div className="reports-page">
        {/* Header */}
        <div className="page-header">
          <div>
            <Title level={2}>Báo cáo & Thống kê</Title>
            <Text type="secondary">Phân tích dữ liệu kinh doanh và hiệu suất</Text>
          </div>
          <Space>
            <Select value={dateRange} onChange={setDateRange} style={{ width: 150 }}>
              <Option value="7days">7 ngày qua</Option>
              <Option value="30days">30 ngày qua</Option>
              <Option value="3months">3 tháng qua</Option>
              <Option value="1year">1 năm qua</Option>
              <Option value="custom">Tùy chỉnh</Option>
            </Select>
            {dateRange === 'custom' && (
              <RangePicker
                value={selectedPeriod}
                onChange={setSelectedPeriod}
                placeholder={['Từ ngày', 'Đến ngày']}
              />
            )}
            <Button icon={<FileExcelOutlined />} onClick={() => handleExport('excel')}>
              Excel
            </Button>
            <Button icon={<FilePdfOutlined />} onClick={() => handleExport('pdf')}>
              PDF
            </Button>
            <Button type="primary" icon={<DownloadOutlined />}>
              Tải báo cáo
            </Button>
          </Space>
        </div>

        {/* Key Metrics */}
        <Row gutter={[24, 24]} className="metrics-row">
          <Col xs={24} sm={12} lg={6}>
            <Card className="metric-card">
              <Statistic
                title="Tổng doanh thu"
                value={totalRevenue}
                formatter={(value) => formatCurrency(value)}
                prefix={<DollarOutlined style={{ color: '#52c41a' }} />}
                suffix={
                  <span style={{ fontSize: '14px', color: '#52c41a' }}>
                    ↑ {growthRate}%
                  </span>
                }
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card className="metric-card">
              <Statistic
                title="Vé đã bán"
                value={totalTickets}
                prefix={<TikTokFilled style={{ color: '#1890ff' }} />}
                suffix={
                  <span style={{ fontSize: '14px', color: '#52c41a' }}>
                    ↑ 12.3%
                  </span>
                }
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card className="metric-card">
              <Statistic
                title="Sự kiện"
                value={totalEvents}
                prefix={<CalendarOutlined style={{ color: '#faad14' }} />}
                suffix={
                  <span style={{ fontSize: '14px', color: '#52c41a' }}>
                    ↑ 8.7%
                  </span>
                }
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card className="metric-card">
              <Statistic
                title="Người dùng"
                value={totalUsers}
                prefix={<UserOutlined style={{ color: '#722ed1' }} />}
                suffix={
                  <span style={{ fontSize: '14px', color: '#52c41a' }}>
                    ↑ 25.1%
                  </span>
                }
              />
            </Card>
          </Col>
        </Row>

        {/* Tabs for different report sections */}
        <Tabs activeKey={activeTab} onChange={setActiveTab} className="reports-tabs">
          <TabPane tab="Tổng quan" key="overview">
            <Row gutter={[24, 24]}>
              {/* Revenue Chart */}
              <Col xs={24} lg={16}>
                <Card title="Doanh thu theo thời gian" className="chart-card">
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={revenueData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis tickFormatter={formatCurrency} />
                      <Tooltip formatter={(value) => [formatCurrency(value), 'Doanh thu']} />
                      <Area 
                        type="monotone" 
                        dataKey="revenue" 
                        stroke="#1890ff" 
                        fill="#e6f7ff" 
                        strokeWidth={2}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </Card>
              </Col>

              {/* Category Distribution */}
              <Col xs={24} lg={8}>
                <Card title="Phân bố theo danh mục" className="chart-card">
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={categoryData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={120}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {categoryData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => [`${value}%`, 'Tỷ lệ']} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </Card>
              </Col>

              {/* Tickets & Events Chart */}
              <Col xs={24} lg={12}>
                <Card title="Vé bán & Sự kiện" className="chart-card">
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={revenueData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis yAxisId="left" />
                      <YAxis yAxisId="right" orientation="right" />
                      <Tooltip />
                      <Legend />
                      <Bar yAxisId="left" dataKey="tickets" fill="#1890ff" name="Vé bán" />
                      <Bar yAxisId="right" dataKey="events" fill="#52c41a" name="Sự kiện" />
                    </BarChart>
                  </ResponsiveContainer>
                </Card>
              </Col>

              {/* User Growth */}
              <Col xs={24} lg={12}>
                <Card title="Tăng trưởng người dùng" className="chart-card">
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={userGrowthData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line 
                        type="monotone" 
                        dataKey="newUsers" 
                        stroke="#faad14" 
                        strokeWidth={3}
                        name="Người dùng mới"
                      />
                      <Line 
                        type="monotone" 
                        dataKey="totalUsers" 
                        stroke="#722ed1" 
                        strokeWidth={3}
                        name="Tổng người dùng"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </Card>
              </Col>
            </Row>
          </TabPane>

          <TabPane tab="Sự kiện" key="events">
            <Row gutter={[24, 24]}>
              <Col xs={24} lg={16}>
                <Card title="Top sự kiện bán chạy" className="table-card">
                  <Table
                    columns={columns}
                    dataSource={topEventsData}
                    rowKey="name"
                    pagination={false}
                    size="middle"
                  />
                </Card>
              </Col>
              <Col xs={24} lg={8}>
                <Card title="Tỷ lệ chuyển đổi" className="metric-card">
                  <Statistic
                    title="Conversion Rate"
                    value={conversionRate}
                    suffix="%"
                    prefix={<TikTokOutlined />}
                  />
                  <Progress
                    percent={conversionRate}
                    status="active"
                    strokeColor={{
                      '0%': '#108ee9',
                      '100%': '#87d068',
                    }}
                    style={{ marginTop: 16 }}
                  />
                  <Divider />
                  <div style={{ marginBottom: 12 }}>
                    <Text strong>Hiệu suất theo danh mục:</Text>
                  </div>
                  {categoryData.map((item, index) => (
                    <div key={index} style={{ marginBottom: 8 }}>
                      <Text>{item.name}</Text>
                      <Progress 
                        percent={item.value} 
                        size="small" 
                        strokeColor={item.color}
                        format={() => `${item.value}%`}
                      />
                    </div>
                  ))}
                </Card>
              </Col>
            </Row>
          </TabPane>

          <TabPane tab="Vé & Thanh toán" key="tickets">
            <Row gutter={[24, 24]}>
              <Col xs={24} lg={12}>
                <Card title="Trạng thái vé" className="chart-card">
                  <div style={{ marginBottom: 16 }}>
                    {ticketStatusData.map((item, index) => (
                      <div key={index} style={{ marginBottom: 12 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                          <Text>{item.status}</Text>
                          <Text strong>{item.count}</Text>
                        </div>
                        <Progress 
                          percent={item.percentage} 
                          size="small"
                          format={() => `${item.percentage}%`}
                        />
                      </div>
                    ))}
                  </div>
                </Card>
              </Col>

              <Col xs={24} lg={12}>
                <Card title="Phương thức thanh toán" className="chart-card">
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={paymentMethodData}
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        dataKey="value"
                        label={({ name, value }) => `${name}: ${value}%`}
                      >
                        {paymentMethodData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => [`${value}%`, 'Tỷ lệ']} />
                    </PieChart>
                  </ResponsiveContainer>
                </Card>
              </Col>

              <Col span={24}>
                <Card title="Phân tích thanh toán theo thời gian" className="chart-card">
                  <ResponsiveContainer width="100%" height={400}>
                    <AreaChart data={revenueData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip formatter={(value) => [formatCurrency(value), 'Doanh thu']} />
                      <Legend />
                      <Area 
                        type="monotone" 
                        dataKey="revenue" 
                        stackId="1"
                        stroke="#1890ff" 
                        fill="#1890ff" 
                        name="Tổng doanh thu"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </Card>
              </Col>
            </Row>
          </TabPane>
        </Tabs>
      </div>
    </AdminLayout>
  );
};

export default ReportsPage;
