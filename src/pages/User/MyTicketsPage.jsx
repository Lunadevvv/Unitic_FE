import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Row, Col, Card, Typography, Tag, Button, Empty, Spin, 
  Input, Select, DatePicker, Space, Modal, QRCode, Tabs,
  List, Avatar, Divider, Badge, Tooltip, message
} from 'antd';
import {
  CalendarOutlined, EnvironmentOutlined, QrcodeOutlined,
  SearchOutlined, FilterOutlined, DownloadOutlined,
  ShareAltOutlined, PhoneOutlined, MailOutlined,
  ClockCircleOutlined, TeamOutlined, TagOutlined,
  CheckCircleOutlined, ExclamationCircleOutlined,
  EyeOutlined, PrinterOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';
import { useBooking } from '../../hooks/useBooking';
import MainLayout from '../../components/layout/MainLayout';
import '../../assets/scss/MyTicketsPage.scss';

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;
const { RangePicker } = DatePicker;
const { TabPane } = Tabs;

const MyTicketsPage = () => {
  const { currentUserBookings, loading: bookingLoading, loadCurrentUserBookings } = useBooking();
  const [filteredTickets, setFilteredTickets] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateRange, setDateRange] = useState([]);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [qrModalVisible, setQrModalVisible] = useState(false);
  const [allTickets, setAllTickets] = useState([]);

  useEffect(() => {
    // Load user bookings when component mounts
    loadCurrentUserBookings().catch((error) => {
      message.error('Không thể tải danh sách vé: ' + error.message);
    });
  }, [loadCurrentUserBookings]);

  useEffect(() => {
    // Transform bookings to tickets format for existing UI
    if (currentUserBookings) {
      const tickets = currentUserBookings.map(booking => ({
        id: booking.bookingID || booking.id,
        orderNumber: `ORD${booking.bookingID || booking.id}`,
        eventId: booking.eventID,
        eventTitle: booking.eventName || booking.event?.name || 'Tên sự kiện không có',
        eventImage: booking.event?.image || '/src/assets/img/event1.jpeg',
        eventDate: booking.event?.date_Start || booking.eventDate,
        eventTime: booking.event?.time || '19:00',
        eventLocation: booking.event?.location || 'Địa điểm sẽ được thông báo',
        ticketType: 'Standard',
        quantity: booking.quantity || 1,
        price: booking.price || booking.event?.price || 0,
        totalAmount: (booking.quantity || 1) * (booking.price || booking.event?.price || 0),
        status: booking.status === 1 ? 'active' : 'cancelled',
        purchaseDate: booking.createdAt || booking.bookingDate || new Date().toISOString(),
        qrCode: booking.qrCode || booking.bookingID || booking.id,
        attendeeInfo: {
          name: 'Nguyễn Văn A',
          email: 'user@example.com', 
          phone: '0123456789'
        },
        seat: 'Chỗ ngồi tự do'
      }));
      setAllTickets(tickets);
      setFilteredTickets(tickets);
    }
  }, [currentUserBookings]);

  // Filter logic
  useEffect(() => {
    if (!allTickets.length) return;

    let filtered = [...allTickets];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(ticket =>
        ticket.eventTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ticket.orderNumber.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter  
    if (statusFilter !== 'all') {
      filtered = filtered.filter(ticket => ticket.status === statusFilter);
    }

    // Date range filter
    if (dateRange.length === 2) {
      filtered = filtered.filter(ticket => {
        const ticketDate = dayjs(ticket.eventDate);
        return ticketDate.isAfter(dateRange[0]) && ticketDate.isBefore(dateRange[1]);
      });
    }

    setFilteredTickets(filtered);
  }, [searchTerm, statusFilter, dateRange, allTickets]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'green';
      case 'used': return 'blue';
      case 'expired': return 'red';
      case 'cancelled': return 'red';
      default: return 'default';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'active': return 'Còn hiệu lực';
      case 'used': return 'Đã sử dụng';
      case 'expired': return 'Hết hạn';
      case 'cancelled': return 'Đã hủy';
      default: return status;
    }
  };

  const handleViewQR = (ticket) => {
    setSelectedTicket(ticket);
    setQrModalVisible(true);
  };

  const handleDownloadTicket = (ticket) => {
    // Implement ticket download functionality
    console.log('Download ticket:', ticket.id);
  };

  const handleShareTicket = (ticket) => {
    // Implement share functionality
    navigator.share({
      title: `Vé ${ticket.eventTitle}`,
      text: `Tôi đã mua vé cho sự kiện: ${ticket.eventTitle}`,
      url: window.location.href
    });
  };

  const renderTicketCard = (ticket) => (
    <Card 
      className={`ticket-card ${ticket.status}`}
      key={ticket.id}
    >
      <div className="ticket-header">
        <div className="ticket-id">
          <Text type="secondary">#{ticket.id}</Text>
          <Tag color={getStatusColor(ticket.status)}>
            {getStatusText(ticket.status)}
          </Tag>
        </div>
        <div className="ticket-actions">
          <Tooltip title="Xem mã QR">
            <Button 
              type="text" 
              icon={<QrcodeOutlined />}
              onClick={() => handleViewQR(ticket)}
            />
          </Tooltip>
          <Tooltip title="Tải xuống">
            <Button 
              type="text" 
              icon={<DownloadOutlined />}
              onClick={() => handleDownloadTicket(ticket)}
            />
          </Tooltip>
          <Tooltip title="Chia sẻ">
            <Button 
              type="text" 
              icon={<ShareAltOutlined />}
              onClick={() => handleShareTicket(ticket)}
            />
          </Tooltip>
        </div>
      </div>

      <div className="ticket-content">
        <Row gutter={16}>
          <Col xs={24} sm={8}>
            <div className="event-image">
              <img src={ticket.eventImage} alt={ticket.eventTitle} />
              <div className="ticket-badge">
                <TagOutlined /> {ticket.ticketType}
              </div>
            </div>
          </Col>
          <Col xs={24} sm={16}>
            <div className="event-details">
              <Title level={4} className="event-title">
                <Link to={`/events/${ticket.eventId}`}>
                  {ticket.eventTitle}
                </Link>
              </Title>
              
              <Space direction="vertical" size="small" className="event-info">
                <Text>
                  <CalendarOutlined /> {dayjs(ticket.eventDate).format('DD/MM/YYYY')} - {ticket.eventTime}
                </Text>
                <Text>
                  <EnvironmentOutlined /> {ticket.eventLocation}
                </Text>
                <Text>
                  <TeamOutlined /> Số chỗ: {ticket.seat}
                </Text>
                <Text>
                  <TagOutlined /> Số lượng: {ticket.quantity} vé
                </Text>
              </Space>

              <div className="ticket-price">
                <Text strong>
                  {ticket.totalAmount.toLocaleString('vi-VN')} VNĐ
                </Text>
                <Text type="secondary">
                  ({ticket.price.toLocaleString('vi-VN')} VNĐ/vé)
                </Text>
              </div>

              {ticket.status === 'used' && (
                <div className="checkin-info">
                  <CheckCircleOutlined style={{ color: '#52c41a' }} />
                  <Text type="secondary">
                    Đã check-in: {dayjs(ticket.checkinTime).format('DD/MM/YYYY HH:mm')}
                  </Text>
                </div>
              )}

              {ticket.notes && (
                <Paragraph type="secondary" className="ticket-notes">
                  {ticket.notes}
                </Paragraph>
              )}
            </div>
          </Col>
        </Row>
      </div>

      <Divider />

      <div className="ticket-footer">
        <div className="order-info">
          <Text type="secondary">
            Đơn hàng: #{ticket.orderNumber}
          </Text>
          <Text type="secondary">
            Mua ngày: {dayjs(ticket.purchaseDate).format('DD/MM/YYYY')}
          </Text>
        </div>
        <div className="attendee-info">
          <Text type="secondary">
            <PhoneOutlined /> {ticket.attendeeInfo.phone}
          </Text>
          <Text type="secondary">
            <MailOutlined /> {ticket.attendeeInfo.email}
          </Text>
        </div>
      </div>
    </Card>
  );

  const renderTicketStats = () => {
    const activeTickets = allTickets.filter(t => t.status === 'active').length;
    const usedTickets = allTickets.filter(t => t.status === 'used').length;
    const totalValue = allTickets.reduce((sum, t) => sum + t.totalAmount, 0);

    return (
      <Row gutter={16} className="ticket-stats">
        <Col xs={24} sm={8}>
          <Card>
            <div className="stat-card">
              <div className="stat-icon active">
                <CheckCircleOutlined />
              </div>
              <div className="stat-content">
                <Title level={3}>{activeTickets}</Title>
                <Text>Vé còn hiệu lực</Text>
              </div>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card>
            <div className="stat-card">
              <div className="stat-icon used">
                <ExclamationCircleOutlined />
              </div>
              <div className="stat-content">
                <Title level={3}>{usedTickets}</Title>
                <Text>Vé đã sử dụng</Text>
              </div>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card>
            <div className="stat-card">
              <div className="stat-icon total">
                <TagOutlined />
              </div>
              <div className="stat-content">
                <Title level={3}>{totalValue.toLocaleString('vi-VN')}</Title>
                <Text>Tổng giá trị (VNĐ)</Text>
              </div>
            </div>
          </Card>
        </Col>
      </Row>
    );
  };

  if (bookingLoading.getCurrentUserBookings) {
    return (
      <MainLayout>
        <div className="my-tickets-loading">
          <Spin size="large" />
          <p>Đang tải danh sách vé...</p>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="my-tickets-page">
        <div className="page-header">
          <Title level={2}>
            <TagOutlined /> Vé của tôi
          </Title>
        <Paragraph>
          Quản lý và theo dõi tất cả các vé sự kiện bạn đã mua
        </Paragraph>
      </div>

      {renderTicketStats()}

      <Card className="filter-section">
        <Row gutter={16} align="middle">
          <Col xs={24} sm={8}>
            <Input
              placeholder="Tìm kiếm theo tên sự kiện, mã vé..."
              prefix={<SearchOutlined />}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </Col>
          <Col xs={24} sm={6}>
            <Select
              placeholder="Trạng thái"
              value={statusFilter}
              onChange={setStatusFilter}
              style={{ width: '100%' }}
            >
              <Option value="all">Tất cả</Option>
              <Option value="active">Có hiệu lực</Option>
              <Option value="used">Đã sử dụng</Option>
              <Option value="expired">Hết hạn</Option>
              <Option value="cancelled">Đã hủy</Option>
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

      <div className="tickets-section">
        {filteredTickets.length === 0 ? (
          <Empty
            description="Không tìm thấy vé nào"
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          />
        ) : (
          <div className="tickets-list">
            {filteredTickets.map(renderTicketCard)}
          </div>
        )}
      </div>

      {/* QR Code Modal */}
      <Modal
        title="Mã QR Ticket"
        open={qrModalVisible}
        onCancel={() => setQrModalVisible(false)}
        footer={[
          <Button key="print" icon={<PrinterOutlined />}>
            In vé
          </Button>,
          <Button key="download" type="primary" icon={<DownloadOutlined />}>
            Tải xuống
          </Button>,
        ]}
        className="qr-modal"
      >
        {selectedTicket && (
          <div className="qr-content">
            <div className="qr-code-section">
              <QRCode value={selectedTicket.qrCode} size={200} />
            </div>
            <div className="ticket-qr-info">
              <Title level={4}>{selectedTicket.eventTitle}</Title>
              <Space direction="vertical" size="small">
                <Text><CalendarOutlined /> {dayjs(selectedTicket.eventDate).format('DD/MM/YYYY')} - {selectedTicket.eventTime}</Text>
                <Text><EnvironmentOutlined /> {selectedTicket.eventLocation}</Text>
                <Text><TeamOutlined /> Chỗ ngồi: {selectedTicket.seat}</Text>
                <Text><TagOutlined /> Loại vé: {selectedTicket.ticketType}</Text>
              </Space>
              <Divider />
              <Text type="secondary">
                Vui lòng xuất trình mã QR này tại cổng vào sự kiện
              </Text>
            </div>
          </div>
        )}
      </Modal>
      </div>
    </MainLayout>
  );
};

export default MyTicketsPage;
