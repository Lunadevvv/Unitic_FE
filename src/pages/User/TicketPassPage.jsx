import React, { useState, useEffect } from 'react';
import { 
  Card, QRCode, Button, Tag, Row, Col, Divider, 
  Space, Typography, message, Modal 
} from 'antd';
import { 
  QrcodeOutlined, DownloadOutlined, ShareAltOutlined,
  CalendarOutlined, EnvironmentOutlined, ClockCircleOutlined,
  UserOutlined, TikTokOutlined, CheckCircleOutlined 
} from '@ant-design/icons';
import { useParams } from 'react-router-dom';
import MainLayout from '../../components/layout/MainLayout';

const { Title, Text } = Typography;

const TicketPassPage = () => {
  const { ticketId } = useParams();
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [qrModalVisible, setQrModalVisible] = useState(false);

  // Mock ticket data
  const mockTicket = {
    id: ticketId,
    ticketCode: 'TK001UX240115',
    eventName: 'Workshop UX/UI Design 2024',
    eventImage: '/src/assets/img/demo.jpg',
    eventDate: '2024-01-15',
    eventTime: '09:00 - 17:00',
    location: 'Tòa nhà FPT, TP.HCM',
    address: '123 Nguyễn Văn Cừ, Quận 5, TP.HCM',
    attendeeName: 'Nguyễn Văn A',
    attendeeEmail: 'nguyenvana@email.com',
    ticketType: 'VIP',
    price: 500000,
    purchaseDate: '2024-01-10',
    status: 'active',
    qrData: `TICKET:${ticketId}:TK001UX240115:NguyenVanA`,
    organizer: 'FPT Software',
    category: 'Technology'
  };

  useEffect(() => {
    loadTicket();
  }, [ticketId]);

  const loadTicket = async () => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setTicket(mockTicket);
    } catch {
      message.error('Không thể tải thông tin vé!');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    // Create canvas and download QR as image
    const canvas = document.querySelector('.ticket-qr canvas');
    if (canvas) {
      const link = document.createElement('a');
      link.download = `ticket-${ticket.ticketCode}.png`;
      link.href = canvas.toDataURL();
      link.click();
      message.success('Tải QR code thành công!');
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Vé ${ticket.eventName}`,
          text: `Tôi sẽ tham gia ${ticket.eventName}`,
          url: window.location.href,
        });
      } catch {
        // If sharing fails, copy to clipboard
        copyToClipboard();
      }
    } else {
      copyToClipboard();
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(window.location.href);
    message.success('Đã sao chép link vé vào clipboard!');
  };

  const getStatusColor = (status) => {
    const colors = {
      'active': 'green',
      'used': 'blue',
      'expired': 'red',
      'cancelled': 'red'
    };
    return colors[status] || 'default';
  };

  const getStatusText = (status) => {
    const texts = {
      'active': 'Có hiệu lực',
      'used': 'Đã sử dụng',
      'expired': 'Hết hạn',
      'cancelled': 'Đã hủy'
    };
    return texts[status] || status;
  };

  const getTicketTypeColor = (type) => {
    const colors = {
      'VIP': 'gold',
      'Standard': 'blue',
      'Early Bird': 'green',
      'Student': 'orange'
    };
    return colors[type] || 'default';
  };

  if (loading || !ticket) {
    return (
      <MainLayout>
        <div style={{ textAlign: 'center', padding: '50px' }}>
          <Text>Đang tải thông tin vé...</Text>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="ticket-pass-page" style={{ padding: '24px', maxWidth: '800px', margin: '0 auto' }}>
        <Card className="ticket-card" style={{ marginBottom: '24px' }}>
          {/* Ticket Header */}
          <div style={{ textAlign: 'center', marginBottom: '24px' }}>
            <Title level={2} style={{ margin: 0, color: '#1890ff' }}>
              <TikTokOutlined /> VÉ THAM DỰ SỰ KIỆN
            </Title>
            <Text type="secondary">Mã vé: {ticket.ticketCode}</Text>
          </div>

          <Row gutter={24}>
            {/* Left Column - Event Info */}
            <Col xs={24} md={14}>
              <div style={{ marginBottom: '20px' }}>
                <img 
                  src={ticket.eventImage} 
                  alt={ticket.eventName}
                  style={{ 
                    width: '100%', 
                    height: '200px', 
                    objectFit: 'cover',
                    borderRadius: '8px'
                  }}
                />
              </div>

              <Title level={3} style={{ marginBottom: '16px' }}>
                {ticket.eventName}
              </Title>

              <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                <div>
                  <CalendarOutlined style={{ color: '#1890ff', marginRight: '8px' }} />
                  <Text strong>Ngày: </Text>
                  <Text>{new Date(ticket.eventDate).toLocaleDateString('vi-VN')}</Text>
                </div>

                <div>
                  <ClockCircleOutlined style={{ color: '#1890ff', marginRight: '8px' }} />
                  <Text strong>Thời gian: </Text>
                  <Text>{ticket.eventTime}</Text>
                </div>

                <div>
                  <EnvironmentOutlined style={{ color: '#1890ff', marginRight: '8px' }} />
                  <Text strong>Địa điểm: </Text>
                  <Text>{ticket.location}</Text>
                  <br />
                  <Text type="secondary" style={{ marginLeft: '24px' }}>
                    {ticket.address}
                  </Text>
                </div>

                <div>
                  <UserOutlined style={{ color: '#1890ff', marginRight: '8px' }} />
                  <Text strong>Người tham dự: </Text>
                  <Text>{ticket.attendeeName}</Text>
                </div>
              </Space>
            </Col>

            {/* Right Column - QR Code */}
            <Col xs={24} md={10}>
              <div style={{ textAlign: 'center' }}>
                <div className="ticket-qr" style={{ marginBottom: '16px' }}>
                  <QRCode 
                    value={ticket.qrData}
                    size={200}
                    style={{ border: '4px solid #f0f0f0', padding: '8px' }}
                  />
                </div>

                <Space direction="vertical" size="small" style={{ width: '100%' }}>
                  <Tag 
                    color={getTicketTypeColor(ticket.ticketType)} 
                    style={{ fontSize: '14px', padding: '4px 12px' }}
                  >
                    {ticket.ticketType}
                  </Tag>

                  <Tag 
                    color={getStatusColor(ticket.status)}
                    icon={ticket.status === 'active' ? <CheckCircleOutlined /> : null}
                  >
                    {getStatusText(ticket.status)}
                  </Tag>

                  <Text strong style={{ fontSize: '16px', color: '#52c41a' }}>
                    {ticket.price.toLocaleString('vi-VN')} VNĐ
                  </Text>
                </Space>

                <Space style={{ marginTop: '16px' }}>
                  <Button 
                    icon={<QrcodeOutlined />}
                    onClick={() => setQrModalVisible(true)}
                  >
                    Phóng to QR
                  </Button>
                  <Button 
                    icon={<DownloadOutlined />}
                    onClick={handleDownload}
                  >
                    Tải xuống
                  </Button>
                  <Button 
                    icon={<ShareAltOutlined />}
                    onClick={handleShare}
                  >
                    Chia sẻ
                  </Button>
                </Space>
              </div>
            </Col>
          </Row>

          <Divider />

          {/* Ticket Details */}
          <Row gutter={16}>
            <Col span={8}>
              <Text type="secondary">Ngày mua vé</Text>
              <br />
              <Text strong>{new Date(ticket.purchaseDate).toLocaleDateString('vi-VN')}</Text>
            </Col>
            <Col span={8}>
              <Text type="secondary">Đơn vị tổ chức</Text>
              <br />
              <Text strong>{ticket.organizer}</Text>
            </Col>
            <Col span={8}>
              <Text type="secondary">Danh mục</Text>
              <br />
              <Tag color="blue">{ticket.category}</Tag>
            </Col>
          </Row>

          <Divider />

          {/* Instructions */}
          <div style={{ 
            background: '#f6f8fa', 
            padding: '16px', 
            borderRadius: '8px',
            border: '1px solid #d1d9e0'
          }}>
            <Title level={5} style={{ marginBottom: '12px' }}>
              Hướng dẫn sử dụng vé:
            </Title>
            <ul style={{ margin: 0, paddingLeft: '20px' }}>
              <li>Vui lòng mang theo vé điện tử này khi tham dự sự kiện</li>
              <li>Xuất trình QR code cho nhân viên check-in tại cổng vào</li>
              <li>Vé chỉ có giá trị trong ngày sự kiện được chỉ định</li>
              <li>Không được chuyển nhượng vé cho người khác</li>
              <li>Liên hệ ban tổ chức nếu có thắc mắc</li>
            </ul>
          </div>
        </Card>

        {/* QR Modal */}
        <Modal
          title="QR Code Check-in"
          open={qrModalVisible}
          onCancel={() => setQrModalVisible(false)}
          footer={null}
          centered
          width={400}
        >
          <div style={{ textAlign: 'center' }}>
            <QRCode 
              value={ticket.qrData}
              size={300}
              style={{ border: '4px solid #f0f0f0', padding: '16px' }}
            />
            <div style={{ marginTop: '16px' }}>
              <Text strong>{ticket.ticketCode}</Text>
              <br />
              <Text type="secondary">Quét mã này tại cổng check-in</Text>
            </div>
          </div>
        </Modal>
      </div>
    </MainLayout>
  );
};

export default TicketPassPage;
