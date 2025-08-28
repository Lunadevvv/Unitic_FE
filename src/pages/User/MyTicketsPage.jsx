import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
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
import { useEvents } from '../../hooks/useEvents';
import { useDispatch } from 'react-redux';
import { fetchEventById } from '../../store/actions/eventsActions';
import MainLayout from '../../components/layout/MainLayout';
import '../../assets/scss/MyTicketsPage.scss';

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;
const { RangePicker } = DatePicker;

// Define the new BookingStatus enum values for clarity in the component
const BookingStatus = {
  PAID: 1,
  CONFIRMED: 2,
  FAILED: 3,
  REFUNDED: 4,
  EXPIRED: 5,
};

const MyTicketsPage = () => {
  const { currentUserBookings, loading: bookingLoading, loadCurrentUserBookings } = useBooking();
  const { getEventById } = useEvents();
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector(state => state.auth);

  const [filteredTickets, setFilteredTickets] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateRange, setDateRange] = useState([]);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [qrModalVisible, setQrModalVisible] = useState(false);
  const [allTickets, setAllTickets] = useState([]);
  const [loadingEvents, setLoadingEvents] = useState(false);
  const [feedbackModalVisible, setFeedbackModalVisible] = useState(false);
  const [feedbackContent, setFeedbackContent] = useState('');
  const [feedbackSubmitting, setFeedbackSubmitting] = useState(false);
  const [feedbackTicket, setFeedbackTicket] = useState(null);

  useEffect(() => {
    // Debug current auth/user state
    console.log('Auth state:', { isAuthenticated, user });
    console.log('localStorage user:', localStorage.getItem('user'));
    console.log('localStorage token:', localStorage.getItem('token'));

    // Check if user is authenticated
    const isUserAuthenticated = isAuthenticated || localStorage.getItem('token');

    if (!isUserAuthenticated) {
      message.warning('Vui lòng đăng nhập để xem vé của bạn');
      return;
    }

    // Load user bookings when component mounts - chỉ chạy 1 lần
    console.log('MyTicketsPage: Loading current user bookings...'); // Debug log

    const loadBookings = async () => {
      try {
        await loadCurrentUserBookings();
      } catch (error) {
        console.error('MyTicketsPage: Error loading bookings:', error); // Debug log
        message.error('Không thể tải danh sách vé: ' + error.message);
      }
    };

    loadBookings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty dependency array để chỉ chạy 1 lần

  useEffect(() => {
    // Transform bookings to tickets format và fetch event details
    console.log('MyTicketsPage: Current user bookings changed:', currentUserBookings); // Debug log

    if (currentUserBookings && currentUserBookings.length > 0) {
      setLoadingEvents(true);

      const fetchEventDetails = async () => {
        try {
          const ticketsWithEvents = await Promise.all(
            currentUserBookings.map(async (booking) => {
              let eventDetails = null;

              // Debug: Log booking data để kiểm tra structure
              console.log('Processing booking:', booking);

              // Gọi API để lấy chi tiết event tương tự EventDetailsPage
              // Sử dụng eventId thay vì eventID vì trong booking data là eventId
              const eventIdToFetch = booking.eventId || booking.eventID;
              console.log('Event ID to fetch:', eventIdToFetch); // Debug log

              if (eventIdToFetch) {
                try {
                  // Sử dụng dispatch để fetch event detailsF giống EventDetailsPage
                  const eventResult = await dispatch(fetchEventById(eventIdToFetch));

                  if (fetchEventById.fulfilled.match(eventResult)) {
                    eventDetails = eventResult.payload;
                  } else {
                    // Fallback: thử lấy từ store nếu có
                    eventDetails = getEventById(eventIdToFetch);
                  }

                  console.log(`Event details for ${eventIdToFetch}:`, eventDetails); // Debug log
                } catch (error) {
                  console.error(`Failed to fetch event ${eventIdToFetch}:`, error);
                  // Fallback: sử dụng data có sẵn từ booking hoặc từ store
                  eventDetails = getEventById(eventIdToFetch) || booking.event;
                }
              }

              // Extract date and time from event details
              const eventStartDate = eventDetails?.date_Start;
              let eventDate = eventStartDate || booking.eventDate;
              let eventTime = '19:00';

              if (eventStartDate) {
                const startDateTime = new Date(eventStartDate);
                eventDate = startDateTime.toISOString().split('T')[0]; // Get date part
                eventTime = startDateTime.toTimeString().slice(0, 5); // Get time part HH:MM
              }

              // Get user info from Redux store or localStorage
              const currentUser = user || JSON.parse(localStorage.getItem('user') || '{}');

              // Map numeric booking status to descriptive strings
              let ticketStatus;
              // Add a debug log for the raw booking.status value
              console.log('Raw booking status:', booking.status); 
              
              // FIX: Convert booking.status to lowercase for consistent comparison
              const normalizedBookingStatus = typeof booking.status === 'string' 
                                                ? booking.status.toLowerCase() 
                                                : booking.status; // Keep as is if not a string (e.g., number)

              switch (normalizedBookingStatus) { // Use the normalized status here
                case 'paid': // Changed to lowercase string
                  ticketStatus = 'paid'; 
                  break;
                case 'confirmed': // Changed to lowercase string
                  ticketStatus = 'confirmed'; 
                  break;
                case 'failed': // Changed to lowercase string
                  ticketStatus = 'failed'; 
                  break;
                case 'refunded': // Changed to lowercase string
                  ticketStatus = 'refunded'; 
                  break;
                case 'expired': // Changed to lowercase string
                  ticketStatus = 'expired'; 
                  break;
                case BookingStatus.PAID: // Keep numeric enum cases as fallback if needed
                    ticketStatus = 'paid';
                    break;
                case BookingStatus.CONFIRMED:
                    ticketStatus = 'confirmed';
                    break;
                case BookingStatus.FAILED:
                    ticketStatus = 'failed';
                    break;
                case BookingStatus.REFUNDED:
                    ticketStatus = 'refunded';
                    break;
                case BookingStatus.EXPIRED:
                    ticketStatus = 'expired';
                    break;
                default:
                  ticketStatus = 'unknown';
              }

              return {
                id: booking.bookingId || booking.bookingID || booking.id,
                orderNumber: `ORD${booking.bookingId || booking.bookingID || booking.id}`,
                eventId: booking.eventId || booking.eventID,
                eventTitle: eventDetails?.name || eventDetails?.title || booking.eventName || 'Tên sự kiện không có',
                eventImage: eventDetails?.image || eventDetails?.imageUrl || '/src/assets/img/event1.jpeg',
                eventDate: eventDate,
                eventTime: eventTime,
                eventLocation: eventDetails?.location || eventDetails?.address || 'Địa điểm sẽ được thông báo',
                eventDescription: eventDetails?.description || '',
                eventStartDate: eventDetails?.date_Start,
                eventEndDate: eventDetails?.date_End,
                ticketType: 'Standard',
                quantity: booking.quantity || 1,
                price: booking.price || eventDetails?.price || 0,
                totalAmount: (booking.quantity || 1) * (booking.price || eventDetails?.price || 0),
                status: ticketStatus, // Use the new mapped status
                purchaseDate: booking.createdAt || booking.bookingDate || new Date().toISOString(),
                qrCode: booking.qrCode || booking.bookingId || booking.bookingID || booking.id,
                eventSlot: eventDetails?.slot,
                eventCateID: eventDetails?.cateID,
                eventStatus: eventDetails?.status,
                attendeeInfo: {
                  name: currentUser?.fullName || currentUser?.name || 'Chưa cập nhật',
                  email: currentUser?.email || 'Chưa cập nhật',
                  phone: currentUser?.phone || currentUser?.phoneNumber || 'Chưa cập nhật'
                },
                seat: booking.seatNumber || booking.seat || 'Chỗ ngồi tự do',
                checkinTime: booking.checkinTime || null, // Assuming checkinTime might exist for confirmed tickets
                // Store original event details for debugging
                originalEventDetails: eventDetails,
                originalBooking: booking
              };
            })
          );

          setAllTickets(ticketsWithEvents);
          setFilteredTickets(ticketsWithEvents);
          console.log('Tickets with event details:', ticketsWithEvents); // Debug log
          console.log('Sample ticket event details:', ticketsWithEvents[0]?.originalEventDetails); // Debug API response
          console.log('Sample booking details:', ticketsWithEvents[0]?.originalBooking); // Debug booking data
        } catch (error) {
          console.error('Error fetching event details:', error);
          message.error('Có lỗi khi tải thông tin sự kiện');
        } finally {
          setLoadingEvents(false);
        }
      };

      fetchEventDetails();
    } else if (currentUserBookings && currentUserBookings.length === 0) {
      // Nếu không có bookings, clear tickets
      setAllTickets([]);
      setFilteredTickets([]);
      setLoadingEvents(false);
    }
  }, [currentUserBookings, getEventById, dispatch, user]);

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
    if (dateRange && dateRange.length === 2 && dateRange[0] && dateRange[1]) {
      filtered = filtered.filter(ticket => {
        const ticketDate = dayjs(ticket.eventDate);
        return ticketDate.isAfter(dateRange[0], 'day') && ticketDate.isBefore(dateRange[1], 'day');
      });
    }

    setFilteredTickets(filtered);
  }, [searchTerm, statusFilter, dateRange, allTickets]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'paid': return 'green'; // Đã mua
      case 'confirmed': return 'blue'; // Đã check in
      case 'failed': return 'volcano'; // Có lỗi khi mua
      case 'refunded': return 'orange'; // Hoàn tiền
      case 'expired': return 'red'; // Không check in / Hết hạn
      default: return 'default';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'paid': return 'Đã mua';
      case 'confirmed': return 'Đã check-in';
      case 'failed': return 'Thất bại';
      case 'refunded': return 'Đã hoàn tiền';
      case 'expired': return 'Đã hết hạn';
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
    message.info('Chức năng tải vé đang được phát triển!');
  };

  const handleShareTicket = (ticket) => {
    // Implement share functionality with fallback
    if (navigator.share) {
      navigator.share({
        title: `Vé ${ticket.eventTitle}`,
        text: `Tôi đã mua vé cho sự kiện: ${ticket.eventTitle}`,
        url: window.location.href
      }).catch((error) => {
        console.error('Error sharing:', error);
        message.error('Không thể chia sẻ vé');
      });
    } else {
      // Fallback for browsers that don't support Web Share API
      navigator.clipboard.writeText(window.location.href).then(() => {
        message.success('Đã sao chép link vào clipboard');
      }).catch(() => {
        message.error('Không thể chia sẻ vé');
      });
    }
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
              disabled={ticket.status === 'failed' || ticket.status === 'refunded' || ticket.status === 'expired'}
            />
          </Tooltip>
          <Tooltip title="Tải xuống">
            <Button
              type="text"
              icon={<DownloadOutlined />}
              onClick={() => handleDownloadTicket(ticket)}
              disabled={ticket.status === 'failed' || ticket.status === 'refunded'}
            />
          </Tooltip>
          <Tooltip title="Chia sẻ">
            <Button
              type="text"
              icon={<ShareAltOutlined />}
              onClick={() => handleShareTicket(ticket)}
              disabled={ticket.status === 'failed' || ticket.status === 'refunded' || ticket.status === 'expired'}
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
                  <CalendarOutlined /> {ticket.eventStartDate ? dayjs(ticket.eventStartDate).format('DD/MM/YYYY HH:mm') : dayjs(ticket.eventDate).format('DD/MM/YYYY')} - {ticket.eventTime}
                </Text>
                <Text>
                  <EnvironmentOutlined /> {ticket.eventLocation}
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

              {ticket.status === 'confirmed' && ticket.checkinTime && (
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

              {/* Feedback button for completed events */}
              {ticket.eventStatus === 5 && (
                <Button
                  type="primary"
                  style={{ marginTop: 12 }}
                  onClick={() => {
                    setFeedbackTicket(ticket);
                    setFeedbackModalVisible(true);
                  }}
                >
                  Gửi feedback cho sự kiện này
                </Button>
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
    const paidTickets = allTickets.filter(t => t.status === 'paid').length;
    const confirmedTickets = allTickets.filter(t => t.status === 'confirmed').length;
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
                <Title level={3}>{paidTickets}</Title>
                <Text>Vé đã mua</Text>
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
                <Title level={3}>{confirmedTickets}</Title>
                <Text>Vé đã check-in</Text>
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
              <div className
="stat-content">
                <Title level={3}>{totalValue.toLocaleString('vi-VN')}</Title>
                <Text>Tổng giá trị (VNĐ)</Text>
              </div>
            </div>
          </Card>
        </Col>
      </Row>
    );
  };

  if (bookingLoading.getCurrentUserBookings || loadingEvents) {
    return (
      <MainLayout>
        <div className="my-tickets-loading">
          <Spin size="large" />
          <p>
            {bookingLoading.getCurrentUserBookings
              ? 'Đang tải danh sách vé...'
              : 'Đang tải thông tin sự kiện...'
            }
          </p>
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
                <Option value="paid">Đã mua</Option>
                <Option value="confirmed">Đã check-in</Option>
                <Option value="failed">Thất bại</Option>
                <Option value="refunded">Đã hoàn tiền</Option>
                <Option value="expired">Đã hết hạn</Option>
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
              description="Không tìm túi vé nào"
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
                  <Text><CalendarOutlined /> {selectedTicket.eventStartDate ? dayjs(selectedTicket.eventStartDate).format('DD/MM/YYYY HH:mm') : dayjs(selectedTicket.eventDate).format('DD/MM/YYYY')} - {selectedTicket.eventTime}</Text>
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

        {/* Feedback Modal */}
        <Modal
          title="Gửi feedback cho sự kiện đã hoàn thành"
          open={feedbackModalVisible}
          onCancel={() => {
            setFeedbackModalVisible(false);
            setFeedbackContent('');
            setFeedbackTicket(null);
          }}
          onOk={async () => {
            if (!feedbackContent.trim()) {
              message.warning('Vui lòng nhập nội dung feedback');
              return;
            }
            setFeedbackSubmitting(true);
            try {
              // Call feedback API
              const res = await fetch('https://localhost:7163/api/Feedback', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({
                  bookingId: feedbackTicket?.id,
                  content: feedbackContent,
                  eventId: feedbackTicket?.eventId
                })
              });
              if (!res.ok) throw new Error('Gửi feedback thất bại');
              message.success('Gửi feedback thành công!');
              setFeedbackModalVisible(false);
              setFeedbackContent('');
              setFeedbackTicket(null);
            } catch (err) {
              message.error('Gửi feedback thất bại: ' + err.message);
            } finally {
              setFeedbackSubmitting(false);
            }
          }}
          confirmLoading={feedbackSubmitting}
        >
          <Input.TextArea
            rows={4}
            placeholder="Nhập nội dung feedback của bạn về sự kiện này..."
            value={feedbackContent}
            onChange={e => setFeedbackContent(e.target.value)}
          />
        </Modal>
      </div>
    </MainLayout>
  );
};

export default MyTicketsPage;