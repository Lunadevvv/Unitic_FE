import React, { useState, useEffect } from 'react';
import { 
  Card, Tabs, Statistic, Row, Col, Table, Button, 
  Tag, Space, Progress, message 
} from 'antd';
import { 
  TeamOutlined, CalendarOutlined, DollarOutlined,
  EyeOutlined, BarChartOutlined, UserOutlined,
  CheckCircleOutlined, ClockCircleOutlined 
} from '@ant-design/icons';
import { useParams, useNavigate } from 'react-router-dom';
import MainLayout from '../../components/layout/MainLayout';

const { TabPane } = Tabs;

const BTCEventManagementPage = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const [eventData, setEventData] = useState(null);
  const [attendees, setAttendees] = useState([]);
  const [statistics, setStatistics] = useState({});
  const [loading, setLoading] = useState(true);

  // Mock data
  const mockEventData = {
    id: eventId,
    name: 'Workshop UX/UI Design 2024',
    date: '2024-01-15',
    time: '09:00 - 17:00',
    location: 'Tòa nhà FPT, TP.HCM',
    capacity: 50,
    registered: 45,
    checkedIn: 23,
    revenue: 22500000,
    status: 'ongoing'
  };

  const mockAttendees = [
    {
      id: 1,
      name: 'Nguyễn Văn A',
      email: 'nguyenvana@email.com',
      phone: '0901234567',
      ticketType: 'VIP',
      status: 'checked-in',
      checkedInAt: '08:30',
      paymentStatus: 'paid'
    },
    {
      id: 2,
      name: 'Trần Thị B',
      email: 'tranthib@email.com',
      phone: '0907654321',
      ticketType: 'Standard',
      status: 'registered',
      checkedInAt: null,
      paymentStatus: 'paid'
    }
  ];

  const mockStatistics = {
    totalRevenue: 22500000,
    totalRegistered: 45,
    totalCheckedIn: 23,
    checkInRate: 51.1,
    vipTickets: 10,
    standardTickets: 35,
    maleAttendees: 28,
    femaleAttendees: 17
  };

  useEffect(() => {
    loadEventData();
  }, [eventId]);

  const loadEventData = async () => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setEventData(mockEventData);
      setAttendees(mockAttendees);
      setStatistics(mockStatistics);
    } catch {
      message.error('Không thể tải dữ liệu sự kiện!');
    } finally {
      setLoading(false);
    }
  };

  const handleCheckInPage = () => {
    navigate(`/btc/events/${eventId}/checkin`);
  };

  const attendeesColumns = [
    {
      title: 'Tên',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Loại vé',
      dataIndex: 'ticketType',
      key: 'ticketType',
      render: (type) => (
        <Tag color={type === 'VIP' ? 'gold' : 'blue'}>{type}</Tag>
      ),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status, record) => (
        <div>
          <Tag 
            color={status === 'checked-in' ? 'green' : 'orange'}
            icon={status === 'checked-in' ? <CheckCircleOutlined /> : <ClockCircleOutlined />}
          >
            {status === 'checked-in' ? 'Đã check-in' : 'Chưa check-in'}
          </Tag>
          {status === 'checked-in' && (
            <div style={{ fontSize: '11px', color: '#666' }}>
              {record.checkedInAt}
            </div>
          )}
        </div>
      ),
    },
    {
      title: 'Thanh toán',
      dataIndex: 'paymentStatus',
      key: 'paymentStatus',
      render: (status) => (
        <Tag color={status === 'paid' ? 'green' : 'red'}>
          {status === 'paid' ? 'Đã thanh toán' : 'Chưa thanh toán'}
        </Tag>
      ),
    },
  ];

  if (loading || !eventData) {
    return (
      <MainLayout>
        <div style={{ textAlign: 'center', padding: '50px' }}>
          Đang tải dữ liệu sự kiện...
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="btc-event-management" style={{ padding: '24px' }}>
        <Card 
          title={`Quản lý sự kiện: ${eventData.name}`}
          extra={
            <Space>
              <Button 
                type="primary" 
                icon={<UserOutlined />}
                onClick={handleCheckInPage}
              >
                Trang Check-in
              </Button>
            </Space>
          }
        >
          {/* Overview Statistics */}
          <Row gutter={16} style={{ marginBottom: '24px' }}>
            <Col span={6}>
              <Statistic
                title="Đăng ký"
                value={statistics.totalRegistered}
                suffix={`/ ${eventData.capacity}`}
                prefix={<TeamOutlined />}
                valueStyle={{ color: '#1890ff' }}
              />
              <Progress 
                percent={(statistics.totalRegistered / eventData.capacity) * 100}
                showInfo={false}
                strokeColor="#1890ff"
              />
            </Col>
            <Col span={6}>
              <Statistic
                title="Đã check-in"
                value={statistics.totalCheckedIn}
                suffix={`/ ${statistics.totalRegistered}`}
                prefix={<CheckCircleOutlined />}
                valueStyle={{ color: '#52c41a' }}
              />
              <Progress 
                percent={statistics.checkInRate}
                showInfo={false}
                strokeColor="#52c41a"
              />
            </Col>
            <Col span={6}>
              <Statistic
                title="Doanh thu"
                value={statistics.totalRevenue}
                precision={0}
                prefix={<DollarOutlined />}
                suffix="VNĐ"
                valueStyle={{ color: '#722ed1' }}
              />
            </Col>
            <Col span={6}>
              <Statistic
                title="Tỷ lệ check-in"
                value={statistics.checkInRate}
                precision={1}
                suffix="%"
                prefix={<BarChartOutlined />}
                valueStyle={{ color: '#fa8c16' }}
              />
            </Col>
          </Row>

          <Tabs defaultActiveKey="attendees">
            <TabPane tab="Danh sách người tham dự" key="attendees">
              <Table
                columns={attendeesColumns}
                dataSource={attendees}
                rowKey="id"
                pagination={{
                  pageSize: 10,
                  showSizeChanger: true,
                  showTotal: (total, range) =>
                    `${range[0]}-${range[1]} của ${total} người tham dự`,
                }}
              />
            </TabPane>

            <TabPane tab="Thống kê chi tiết" key="statistics">
              <Row gutter={24}>
                <Col span={12}>
                  <Card title="Phân bố loại vé" size="small">
                    <Statistic
                      title="Vé VIP"
                      value={statistics.vipTickets}
                      suffix="vé"
                      valueStyle={{ color: '#faad14' }}
                    />
                    <Statistic
                      title="Vé Standard"
                      value={statistics.standardTickets}
                      suffix="vé"
                      valueStyle={{ color: '#1890ff' }}
                      style={{ marginTop: '16px' }}
                    />
                  </Card>
                </Col>
                <Col span={12}>
                  <Card title="Phân bố giới tính" size="small">
                    <Statistic
                      title="Nam"
                      value={statistics.maleAttendees}
                      suffix="người"
                      valueStyle={{ color: '#52c41a' }}
                    />
                    <Statistic
                      title="Nữ"
                      value={statistics.femaleAttendees}
                      suffix="người"
                      valueStyle={{ color: '#eb2f96' }}
                      style={{ marginTop: '16px' }}
                    />
                  </Card>
                </Col>
              </Row>
            </TabPane>

            <TabPane tab="Thông tin sự kiện" key="info">
              <Row gutter={24}>
                <Col span={12}>
                  <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                    <div>
                      <strong>Tên sự kiện:</strong>
                      <div>{eventData.name}</div>
                    </div>
                    <div>
                      <strong>Ngày tổ chức:</strong>
                      <div>{new Date(eventData.date).toLocaleDateString('vi-VN')}</div>
                    </div>
                    <div>
                      <strong>Thời gian:</strong>
                      <div>{eventData.time}</div>
                    </div>
                    <div>
                      <strong>Địa điểm:</strong>
                      <div>{eventData.location}</div>
                    </div>
                  </Space>
                </Col>
                <Col span={12}>
                  <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                    <div>
                      <strong>Sức chứa:</strong>
                      <div>{eventData.capacity} người</div>
                    </div>
                    <div>
                      <strong>Đã đăng ký:</strong>
                      <div>{eventData.registered} người</div>
                    </div>
                    <div>
                      <strong>Trạng thái:</strong>
                      <div>
                        <Tag color="green">Đang diễn ra</Tag>
                      </div>
                    </div>
                  </Space>
                </Col>
              </Row>
            </TabPane>
          </Tabs>
        </Card>
      </div>
    </MainLayout>
  );
};

export default BTCEventManagementPage;
