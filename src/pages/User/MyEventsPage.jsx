import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Row, Col, Card, Typography, Tag, Button, Empty, Spin, 
  Input, Select, DatePicker, Space, Tabs, List, Avatar,
  Rate, Modal, Form, Progress, Statistic
} from 'antd';
import {
  CalendarOutlined, EnvironmentOutlined, SearchOutlined,
  HeartOutlined, ShareAltOutlined, StarOutlined,
  ClockCircleOutlined, TeamOutlined, TagOutlined,
  CheckCircleOutlined, ExclamationCircleOutlined,
  EyeOutlined, CommentOutlined, UserOutlined,
  TrophyOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';
import '../../assets/scss/MyEventsPage.scss';

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;
const { RangePicker } = DatePicker;
const { TabPane } = Tabs;

const MyEventsPage = () => {
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateRange, setDateRange] = useState([]);
  const [activeTab, setActiveTab] = useState('upcoming');
  const [reviewModalVisible, setReviewModalVisible] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [reviewForm] = Form.useForm();

  useEffect(() => {
    // Mock data - trong thực tế sẽ fetch từ API
    const mockEvents = [
      {
        id: '1',
        title: 'Đêm nhạc acoustic với Chủ tịch TGB',
        image: '/src/assets/img/chutichTGB.jpg',
        date: '2024-01-15',
        time: '19:00',
        location: 'Nhà hát Thành phố',
        category: 'Âm nhạc',
        status: 'upcoming', // upcoming, ongoing, completed, cancelled
        attendanceStatus: 'registered', // registered, attended, missed
        ticketType: 'VIP',
        price: 500000,
        organizer: 'Music Production',
        description: 'Đêm nhạc acoustic đặc biệt với những ca khúc hay nhất',
        capacity: 500,
        attendees: 350,
        rating: 4.8,
        reviews: 125,
        registrationDate: '2024-01-01',
        isLiked: true,
        reminder: true,
        certificateEligible: true
      },
      {
        id: '2',
        title: 'Workshop "Điện gia hiệu PC"',
        image: '/src/assets/img/diengiaHieuPC.jpg',
        date: '2024-01-10',
        time: '14:00',
        location: 'Trung tâm hội nghị FPT',
        category: 'Công nghệ',
        status: 'completed',
        attendanceStatus: 'attended',
        ticketType: 'Standard',
        price: 200000,
        organizer: 'TechHub Vietnam',
        description: 'Workshop về lắp ráp và tối ưu máy tính',
        capacity: 100,
        attendees: 85,
        rating: 4.5,
        reviews: 42,
        registrationDate: '2024-01-05',
        completionDate: '2024-01-10',
        userRating: 5,
        userReview: 'Workshop rất hữu ích và thực tế!',
        certificateEarned: true,
        certificateUrl: '/certificates/workshop-pc-building-2024.pdf'
      },
      {
        id: '3',
        title: 'Hội thảo khởi nghiệp 2024',
        image: '/src/assets/img/event1.jpeg',
        date: '2024-02-01',
        time: '09:00',
        location: 'Đại học FPT TP.HCM',
        category: 'Kinh doanh',
        status: 'upcoming',
        attendanceStatus: 'registered',
        ticketType: 'Early Bird',
        price: 150000,
        organizer: 'Startup Hub',
        description: 'Hội thảo về xu hướng khởi nghiệp và đầu tư',
        capacity: 200,
        attendees: 180,
        rating: 4.6,
        reviews: 89,
        registrationDate: '2024-01-10',
        isLiked: false,
        reminder: true,
        certificateEligible: true
      }
    ];

    // Simulate API call
    setTimeout(() => {
      setEvents(mockEvents);
      setFilteredEvents(mockEvents.filter(event => 
        activeTab === 'upcoming' ? (event.status === 'upcoming' || event.status === 'ongoing') :
        activeTab === 'completed' ? event.status === 'completed' :
        activeTab === 'liked' ? event.isLiked : true
      ));
      setLoading(false);
    }, 1000);
  }, [activeTab]);

  useEffect(() => {
    const filterEvents = () => {
      let filtered = events;

      // Filter by tab first
      switch (activeTab) {
        case 'upcoming':
          filtered = filtered.filter(event => 
            event.status === 'upcoming' || event.status === 'ongoing'
          );
          break;
        case 'completed':
          filtered = filtered.filter(event => event.status === 'completed');
          break;
        case 'liked':
          filtered = filtered.filter(event => event.isLiked);
          break;
        default:
          break;
      }

      // Filter by search term
      if (searchTerm) {
        filtered = filtered.filter(event =>
          event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          event.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
          event.organizer.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }

      // Filter by status (if applicable)
      if (statusFilter !== 'all') {
        filtered = filtered.filter(event => event.attendanceStatus === statusFilter);
      }

      // Filter by date range
      if (dateRange.length === 2) {
        filtered = filtered.filter(event => {
          const eventDate = dayjs(event.date);
          return eventDate.isAfter(dateRange[0]) && eventDate.isBefore(dateRange[1]);
        });
      }

      setFilteredEvents(filtered);
    };

    filterEvents();
  }, [searchTerm, statusFilter, dateRange, events, activeTab]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'upcoming': return 'blue';
      case 'ongoing': return 'orange';
      case 'completed': return 'green';
      case 'cancelled': return 'red';
      default: return 'default';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'upcoming': return 'Sắp diễn ra';
      case 'ongoing': return 'Đang diễn ra';
      case 'completed': return 'Đã hoàn thành';
      case 'cancelled': return 'Đã hủy';
      default: return 'Không xác định';
    }
  };

  const getAttendanceColor = (status) => {
    switch (status) {
      case 'registered': return 'processing';
      case 'attended': return 'success';
      case 'missed': return 'error';
      default: return 'default';
    }
  };

  const getAttendanceText = (status) => {
    switch (status) {
      case 'registered': return 'Đã đăng ký';
      case 'attended': return 'Đã tham dự';
      case 'missed': return 'Vắng mặt';
      default: return 'Không xác định';
    }
  };

  const handleReviewEvent = (event) => {
    setSelectedEvent(event);
    if (event.userRating) {
      reviewForm.setFieldsValue({
        rating: event.userRating,
        review: event.userReview
      });
    }
    setReviewModalVisible(true);
  };

  const handleSubmitReview = async (values) => {
    try {
      // API call to submit review
      console.log('Submit review:', { eventId: selectedEvent.id, ...values });
      
      // Update local state
      const updatedEvents = events.map(event => 
        event.id === selectedEvent.id 
          ? { ...event, userRating: values.rating, userReview: values.review }
          : event
      );
      setEvents(updatedEvents);
      
      setReviewModalVisible(false);
      reviewForm.resetFields();
    } catch (error) {
      console.error('Error submitting review:', error);
    }
  };

  const handleDownloadCertificate = (event) => {
    // Implement certificate download
    window.open(event.certificateUrl, '_blank');
  };

  const renderEventCard = (event) => (
    <Card 
      className={`event-card ${event.status}`}
      key={event.id}
      cover={
        <div className="event-image-container">
          <img src={event.image} alt={event.title} />
          <div className="event-overlay">
            <Tag color={getStatusColor(event.status)}>
              {getStatusText(event.status)}
            </Tag>
            <Tag color={getAttendanceColor(event.attendanceStatus)}>
              {getAttendanceText(event.attendanceStatus)}
            </Tag>
          </div>
        </div>
      }
      actions={[
        <Button key="view" type="link" icon={<EyeOutlined />}>
          <Link to={`/events/${event.id}`}>Xem chi tiết</Link>
        </Button>,
        ...(event.status === 'completed' && event.attendanceStatus === 'attended' ? [
          <Button 
            key="review" 
            type="link" 
            icon={<StarOutlined />}
            onClick={() => handleReviewEvent(event)}
          >
            {event.userRating ? 'Sửa đánh giá' : 'Đánh giá'}
          </Button>
        ] : []),
        ...(event.certificateEarned ? [
          <Button 
            key="certificate" 
            type="link" 
            icon={<TrophyOutlined />}
            onClick={() => handleDownloadCertificate(event)}
          >
            Chứng chỉ
          </Button>
        ] : [])
      ]}
    >
      <Card.Meta
        title={
          <div className="event-title">
            <Link to={`/events/${event.id}`}>{event.title}</Link>
            {event.isLiked && <HeartOutlined className="liked-icon" />}
          </div>
        }
        description={
          <Space direction="vertical" size="small">
            <Text>
              <CalendarOutlined /> {dayjs(event.date).format('DD/MM/YYYY')} - {event.time}
            </Text>
            <Text>
              <EnvironmentOutlined /> {event.location}
            </Text>
            <Text>
              <TagOutlined /> {event.category}
            </Text>
            <Text>
              <UserOutlined /> {event.organizer}
            </Text>
          </Space>
        }
      />
      
      <div className="event-card-content">
        <div className="event-stats">
          <div className="stat-item">
            <Text type="secondary">Giá vé:</Text>
            <Text strong>{event.price.toLocaleString('vi-VN')} VNĐ</Text>
          </div>
          <div className="stat-item">
            <Text type="secondary">Đăng ký:</Text>
            <Text>{dayjs(event.registrationDate).format('DD/MM/YYYY')}</Text>
          </div>
        </div>

        {event.status === 'completed' && event.userRating && (
          <div className="user-review">
            <Rate disabled value={event.userRating} />
            <Text type="secondary">"{event.userReview}"</Text>
          </div>
        )}

        {event.certificateEligible && event.status === 'upcoming' && (
          <div className="certificate-info">
            <TrophyOutlined style={{ color: '#faad14' }} />
            <Text type="secondary">Có chứng chỉ tham dự</Text>
          </div>
        )}
      </div>
    </Card>
  );

  const renderStats = () => {
    const upcomingEvents = events.filter(e => e.status === 'upcoming').length;
    const completedEvents = events.filter(e => e.status === 'completed').length;
    const certificatesEarned = events.filter(e => e.certificateEarned).length;
    const totalSpent = events.reduce((sum, e) => sum + e.price, 0);

    return (
      <Row gutter={16} className="stats-section">
        <Col xs={12} sm={6}>
          <Card>
            <Statistic
              title="Sự kiện sắp tới"
              value={upcomingEvents}
              prefix={<CalendarOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card>
            <Statistic
              title="Đã tham dự"
              value={completedEvents}
              prefix={<CheckCircleOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card>
            <Statistic
              title="Chứng chỉ"
              value={certificatesEarned}
              prefix={<TrophyOutlined />}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card>
            <Statistic
              title="Tổng chi tiêu"
              value={totalSpent}
              formatter={(value) => `${value.toLocaleString('vi-VN')} ₫`}
              valueStyle={{ color: '#722ed1' }}
            />
          </Card>
        </Col>
      </Row>
    );
  };

  if (loading) {
    return (
      <div className="my-events-loading">
        <Spin size="large" />
        <p>Đang tải danh sách sự kiện...</p>
      </div>
    );
  }

  return (
    <div className="my-events-page">
      <div className="page-header">
        <Title level={2}>
          <CalendarOutlined /> Sự kiện của tôi
        </Title>
        <Paragraph>
          Quản lý và theo dõi tất cả các sự kiện bạn đã đăng ký tham dự
        </Paragraph>
      </div>

      {renderStats()}

      <Card className="filter-section">
        <Row gutter={16} align="middle">
          <Col xs={24} sm={8}>
            <Input
              placeholder="Tìm kiếm theo tên sự kiện, danh mục..."
              prefix={<SearchOutlined />}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </Col>
          <Col xs={24} sm={6}>
            <Select
              placeholder="Trạng thái tham dự"
              value={statusFilter}
              onChange={setStatusFilter}
              style={{ width: '100%' }}
            >
              <Option value="all">Tất cả</Option>
              <Option value="registered">Đã đăng ký</Option>
              <Option value="attended">Đã tham dự</Option>
              <Option value="missed">Vắng mặt</Option>
            </Select>
          </Col>
          <Col xs={24} sm={10}>
            <RangePicker
              placeholder={['Từ ngày', 'Đến ngày']}
              onChange={setDateRange}
              style={{ width: '100%' }}
            />
          </Col>
        </Row>
      </Card>

      <div className="events-section">
        <Tabs activeKey={activeTab} onChange={setActiveTab}>
          <TabPane tab="Sự kiện sắp tới" key="upcoming">
            {filteredEvents.length === 0 ? (
              <Empty
                description="Không có sự kiện sắp tới nào"
                image={Empty.PRESENTED_IMAGE_SIMPLE}
              />
            ) : (
              <Row gutter={[16, 16]}>
                {filteredEvents.map(event => (
                  <Col xs={24} sm={12} lg={8} xl={6} key={event.id}>
                    {renderEventCard(event)}
                  </Col>
                ))}
              </Row>
            )}
          </TabPane>

          <TabPane tab="Đã tham dự" key="completed">
            {filteredEvents.length === 0 ? (
              <Empty
                description="Chưa tham dự sự kiện nào"
                image={Empty.PRESENTED_IMAGE_SIMPLE}
              />
            ) : (
              <Row gutter={[16, 16]}>
                {filteredEvents.map(event => (
                  <Col xs={24} sm={12} lg={8} xl={6} key={event.id}>
                    {renderEventCard(event)}
                  </Col>
                ))}
              </Row>
            )}
          </TabPane>

          <TabPane tab="Yêu thích" key="liked">
            {filteredEvents.length === 0 ? (
              <Empty
                description="Chưa có sự kiện yêu thích nào"
                image={Empty.PRESENTED_IMAGE_SIMPLE}
              />
            ) : (
              <Row gutter={[16, 16]}>
                {filteredEvents.map(event => (
                  <Col xs={24} sm={12} lg={8} xl={6} key={event.id}>
                    {renderEventCard(event)}
                  </Col>
                ))}
              </Row>
            )}
          </TabPane>
        </Tabs>
      </div>

      {/* Review Modal */}
      <Modal
        title="Đánh giá sự kiện"
        open={reviewModalVisible}
        onCancel={() => setReviewModalVisible(false)}
        footer={null}
      >
        {selectedEvent && (
          <Form
            form={reviewForm}
            onFinish={handleSubmitReview}
            layout="vertical"
          >
            <div className="event-review-header">
              <Avatar src={selectedEvent.image} size={64} />
              <div>
                <Title level={4}>{selectedEvent.title}</Title>
                <Text type="secondary">
                  {dayjs(selectedEvent.date).format('DD/MM/YYYY')} - {selectedEvent.location}
                </Text>
              </div>
            </div>

            <Form.Item
              name="rating"
              label="Đánh giá của bạn"
              rules={[{ required: true, message: 'Vui lòng cho điểm đánh giá!' }]}
            >
              <Rate allowHalf />
            </Form.Item>

            <Form.Item
              name="review"
              label="Nhận xét (không bắt buộc)"
            >
              <Input.TextArea 
                rows={4}
                placeholder="Chia sẻ trải nghiệm của bạn về sự kiện này..."
              />
            </Form.Item>

            <Form.Item>
              <Space>
                <Button type="primary" htmlType="submit">
                  Gửi đánh giá
                </Button>
                <Button onClick={() => setReviewModalVisible(false)}>
                  Hủy
                </Button>
              </Space>
            </Form.Item>
          </Form>
        )}
      </Modal>
    </div>
  );
};

export default MyEventsPage;
