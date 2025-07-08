import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Row, Col, Card, Typography, Tag, Button, Empty, Spin, 
  Input, Select, DatePicker, Space, Modal, QRCode, Tabs,
  List, Avatar, Divider, Badge, Tooltip
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
import '../../assets/scss/MyTicketsPage.scss';

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;
const { RangePicker } = DatePicker;
const { TabPane } = Tabs;

const MyTicketsPage = () => {
  const [tickets, setTickets] = useState([]);
  const [filteredTickets, setFilteredTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateRange, setDateRange] = useState([]);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [qrModalVisible, setQrModalVisible] = useState(false);

  useEffect(() => {
    // Mock data - trong thực tế sẽ fetch từ API
    const mockTickets = [
      {
        id: 'TK001',
        orderNumber: 'ORD1703080001',
        eventId: '1',
        eventTitle: 'Đêm nhạc acoustic với Chủ tịch TGB',
        eventImage: '/src/assets/img/chutichTGB.jpg',
        eventDate: '2024-01-15',
        eventTime: '19:00',
        eventLocation: 'Nhà hát Thành phố',
        ticketType: 'VIP',
        quantity: 2,
        price: 500000,
        totalAmount: 1000000,
        status: 'active', // active, used, expired, cancelled
        purchaseDate: '2024-01-01',
        attendeeInfo: {
          name: 'Nguyễn Văn A',
          email: 'user@example.com',
          phone: '0123456789'
        },
        qrCode: 'TK001-QR-CODE-DATA',
        seat: 'A-12, A-13',
        notes: 'Vé VIP bao gồm nước uống miễn phí'
      },
      {
        id: 'TK002',
        orderNumber: 'ORD1703080002',
        eventId: '2',
        eventTitle: 'Workshop "Điện gia hiệu PC"',
        eventImage: '/src/assets/img/diengiaHieuPC.jpg',
        eventDate: '2024-01-20',
        eventTime: '14:00',
        eventLocation: 'Trung tâm hội nghị FPT',
        ticketType: 'Standard',
        quantity: 1,
        price: 200000,
        totalAmount: 200000,
        status: 'used',
        purchaseDate: '2024-01-05',
        attendeeInfo: {
          name: 'Nguyễn Văn A',
          email: 'user@example.com',
          phone: '0123456789'
        },
        qrCode: 'TK002-QR-CODE-DATA',
        seat: 'B-25',
        checkinTime: '2024-01-20 13:45'
      },
      {
        id: 'TK003',
        orderNumber: 'ORD1703080003',
        eventId: '3',
        eventTitle: 'Hội thảo khởi nghiệp 2024',
        eventImage: '/src/assets/img/event1.jpeg',
        eventDate: '2024-02-01',
        eventTime: '09:00',
        eventLocation: 'Đại học FPT TP.HCM',
        ticketType: 'Early Bird',
        quantity: 1,
        price: 150000,
        totalAmount: 150000,
        status: 'active',
        purchaseDate: '2024-01-10',
        attendeeInfo: {
          name: 'Nguyễn Văn A',
          email: 'user@example.com',
          phone: '0123456789'
        },
        qrCode: 'TK003-QR-CODE-DATA',
        seat: 'C-40'
      }
    ];

    // Simulate API call
    setTimeout(() => {
      setTickets(mockTickets);
      setFilteredTickets(mockTickets);
      setLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    const filterTickets = () => {
      let filtered = tickets;

      // Filter by search term
      if (searchTerm) {
        filtered = filtered.filter(ticket =>
          ticket.eventTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
          ticket.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
          ticket.id.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }

      // Filter by status
      if (statusFilter !== 'all') {
        filtered = filtered.filter(ticket => ticket.status === statusFilter);
      }

      // Filter by date range
      if (dateRange.length === 2) {
        filtered = filtered.filter(ticket => {
          const eventDate = dayjs(ticket.eventDate);
          return eventDate.isAfter(dateRange[0]) && eventDate.isBefore(dateRange[1]);
        });
      }

      setFilteredTickets(filtered);
    };

    filterTickets();
  }, [searchTerm, statusFilter, dateRange, tickets]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'success';
      case 'used': return 'default';
      case 'expired': return 'error';
      case 'cancelled': return 'error';
      default: return 'default';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'active': return 'Có hiệu lực';
      case 'used': return 'Đã sử dụng';
      case 'expired': return 'Hết hạn';
      case 'cancelled': return 'Đã hủy';
      default: return 'Không xác định';
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
    const activeTickets = tickets.filter(t => t.status === 'active').length;
    const usedTickets = tickets.filter(t => t.status === 'used').length;
    const totalValue = tickets.reduce((sum, t) => sum + t.totalAmount, 0);

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

  if (loading) {
    return (
      <div className="my-tickets-loading">
        <Spin size="large" />
        <p>Đang tải danh sách vé...</p>
      </div>
    );
  }

  return (
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
  );
};

export default MyTicketsPage;
