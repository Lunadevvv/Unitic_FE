import { useState, useEffect } from 'react';
import {
  Table, Card, Button, Input, Select, Tag, Space, Modal, 
  Typography, Row, Col, Statistic, message, DatePicker,
  QRCode, Descriptions, Image, Tooltip, Progress
} from 'antd';
import {
  EyeOutlined, PrinterOutlined, DownloadOutlined,
  SearchOutlined, ExportOutlined, QrcodeOutlined, CheckCircleOutlined,
  ClockCircleOutlined, StopOutlined, ScanOutlined, MailOutlined,
  CalendarOutlined, UserOutlined, BarcodeOutlined,
  TikTokOutlined
} from '@ant-design/icons';
import AdminLayout from '../../components/layout/AdminLayout';
import '../../assets/scss/TicketManagementPage.scss';

const { Title, Text } = Typography;
const { Option } = Select;
const { RangePicker } = DatePicker;

// Mock data
const mockTickets = [
  {
    id: 'TKT001',
    ticketCode: 'ST2024-VIP-001',
    orderId: 'ORD001',
    customerName: 'Nguyễn Văn A',
    customerEmail: 'nguyenvana@example.com',
    eventName: 'Concert Sơn Tùng MTP 2024',
    eventDate: '2024-08-15',
    eventTime: '20:00',
    ticketType: 'VIP',
    seatNumber: 'A-15',
    price: 1500000,
    status: 'valid',
    issuedDate: '2024-06-20',
    usedDate: null,
    qrCode: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==',
    checkInTime: null,
    checkInLocation: null
  },
  {
    id: 'TKT002',
    ticketCode: 'MD2024-STD-002',
    orderId: 'ORD002',
    customerName: 'Trần Thị B',
    customerEmail: 'tranthib@example.com',
    eventName: 'Hội thảo Marketing Digital',
    eventDate: '2024-07-20',
    eventTime: '08:00',
    ticketType: 'Standard',
    seatNumber: 'B-23',
    price: 500000,
    status: 'valid',
    issuedDate: '2024-06-25',
    usedDate: null,
    qrCode: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==',
    checkInTime: null,
    checkInLocation: null
  },
  {
    id: 'TKT003',
    ticketCode: 'ART2024-STD-003',
    orderId: 'ORD003',
    customerName: 'Lê Văn C',
    customerEmail: 'levanc@example.com',
    eventName: 'Triển lãm Nghệ thuật',
    eventDate: '2024-06-30',
    eventTime: '09:00',
    ticketType: 'Standard',
    seatNumber: 'C-08',
    price: 200000,
    status: 'used',
    issuedDate: '2024-06-18',
    usedDate: '2024-06-30',
    qrCode: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==',
    checkInTime: '2024-06-30 09:15:00',
    checkInLocation: 'Cổng chính'
  },
  {
    id: 'TKT004',
    ticketCode: 'ST2024-VIP-004',
    orderId: 'ORD004',
    customerName: 'Phạm Thị D',
    customerEmail: 'phamthid@example.com',
    eventName: 'Concert Sơn Tùng MTP 2024',
    eventDate: '2024-08-15',
    eventTime: '20:00',
    ticketType: 'VIP',
    seatNumber: 'A-20',
    price: 1500000,
    status: 'expired',
    issuedDate: '2024-06-22',
    usedDate: null,
    qrCode: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==',
    checkInTime: null,
    checkInLocation: null
  }
];

const TicketManagementPage = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterEvent, setFilterEvent] = useState('all');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [viewingTicket, setViewingTicket] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        await new Promise(resolve => setTimeout(resolve, 1000));
        setTickets(mockTickets);
      } catch {
        message.error('Lỗi khi tải danh sách vé');
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const handleViewTicket = (ticket) => {
    setViewingTicket(ticket);
    setIsModalVisible(true);
  };

  const handleValidateTicket = async (ticketId) => {
    try {
      setTickets(tickets.map(ticket => 
        ticket.id === ticketId ? { 
          ...ticket, 
          status: 'used',
          usedDate: new Date().toISOString().split('T')[0],
          checkInTime: new Date().toISOString(),
          checkInLocation: 'Cổng chính'
        } : ticket
      ));
      message.success('Vé đã được xác thực thành công');
    } catch {
      message.error('Lỗi khi xác thực vé');
    }
  };

  const handleCancelTicket = async (ticketId) => {
    try {
      setTickets(tickets.map(ticket => 
        ticket.id === ticketId ? { ...ticket, status: 'cancelled' } : ticket
      ));
      message.success('Vé đã được hủy');
    } catch {
      message.error('Lỗi khi hủy vé');
    }
  };

  const handleResendTicket = async (ticket) => {
    try {
      message.success(`Đã gửi lại vé qua email ${ticket.customerEmail}`);
    } catch {
      message.error('Lỗi khi gửi lại vé');
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      valid: 'success',
      used: 'default',
      expired: 'warning',
      cancelled: 'error'
    };
    return colors[status] || 'default';
  };

  const getStatusText = (status) => {
    const texts = {
      valid: 'Có hiệu lực',
      used: 'Đã sử dụng',
      expired: 'Hết hạn',
      cancelled: 'Đã hủy'
    };
    return texts[status] || status;
  };

  const getStatusIcon = (status) => {
    const icons = {
      valid: <CheckCircleOutlined />,
      used: <ScanOutlined />,
      expired: <ClockCircleOutlined />,
      cancelled: <StopOutlined />
    };
    return icons[status] || <TikTokOutlined />;
  };

  const columns = [
    {
      title: 'Mã vé',
      dataIndex: 'ticketCode',
      key: 'ticketCode',
      render: (text) => (
        <div>
          <Text strong style={{ color: '#1890ff' }}>{text}</Text>
          <br />
          <Text type="secondary" style={{ fontSize: '12px' }}>
            <BarcodeOutlined /> {text.substring(0, 12)}...
          </Text>
        </div>
      ),
      sorter: (a, b) => a.ticketCode.localeCompare(b.ticketCode),
    },
    {
      title: 'Khách hàng',
      key: 'customer',
      render: (_, record) => (
        <Space direction="vertical" size="small">
          <Text strong>{record.customerName}</Text>
          <Text type="secondary" style={{ fontSize: '12px' }}>
            {record.customerEmail}
          </Text>
        </Space>
      ),
      sorter: (a, b) => a.customerName.localeCompare(b.customerName),
    },
    {
      title: 'Sự kiện',
      key: 'event',
      render: (_, record) => (
        <Space direction="vertical" size="small">
          <Text strong>{record.eventName}</Text>
          <Text type="secondary" style={{ fontSize: '12px' }}>
            <CalendarOutlined /> {new Date(record.eventDate).toLocaleDateString('vi-VN')} {record.eventTime}
          </Text>
          <Tag size="small">{record.ticketType}</Tag>
        </Space>
      ),
    },
    {
      title: 'Chỗ ngồi',
      dataIndex: 'seatNumber',
      key: 'seatNumber',
      align: 'center',
      render: (value) => (
        <Tag color="blue" style={{ fontSize: '12px', fontWeight: 'bold' }}>
          {value}
        </Tag>
      ),
    },
    {
      title: 'Giá vé',
      dataIndex: 'price',
      key: 'price',
      render: (value) => (
        <Text strong style={{ color: '#52c41a' }}>
          {value.toLocaleString('vi-VN')} ₫
        </Text>
      ),
      sorter: (a, b) => a.price - b.price,
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={getStatusColor(status)} icon={getStatusIcon(status)}>
          {getStatusText(status)}
        </Tag>
      ),
      filters: [
        { text: 'Có hiệu lực', value: 'valid' },
        { text: 'Đã sử dụng', value: 'used' },
        { text: 'Hết hạn', value: 'expired' },
        { text: 'Đã hủy', value: 'cancelled' }
      ],
      onFilter: (value, record) => record.status === value,
    },
    {
      title: 'Ngày phát hành',
      dataIndex: 'issuedDate',
      key: 'issuedDate',
      render: (date) => (
        <Text type="secondary">
          {new Date(date).toLocaleDateString('vi-VN')}
        </Text>
      ),
      sorter: (a, b) => new Date(a.issuedDate) - new Date(b.issuedDate),
    },
    {
      title: 'Thao tác',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Tooltip title="Xem chi tiết">
            <Button 
              type="text" 
              icon={<EyeOutlined />} 
              onClick={() => handleViewTicket(record)}
            />
          </Tooltip>
          
          <Tooltip title="QR Code">
            <Button 
              type="text" 
              icon={<QrcodeOutlined />} 
            />
          </Tooltip>

          <Tooltip title="In vé">
            <Button 
              type="text" 
              icon={<PrinterOutlined />} 
            />
          </Tooltip>

          <Tooltip title="Gửi lại vé">
            <Button 
              type="text" 
              icon={<MailOutlined />} 
              onClick={() => handleResendTicket(record)}
            />
          </Tooltip>

          {record.status === 'valid' && (
            <Tooltip title="Xác thực vé">
              <Button 
                type="text" 
                style={{ color: '#52c41a' }}
                icon={<ScanOutlined />}
                onClick={() => handleValidateTicket(record.id)}
              />
            </Tooltip>
          )}

          {(record.status === 'valid' || record.status === 'expired') && (
            <Tooltip title="Hủy vé">
              <Button 
                type="text" 
                danger
                icon={<StopOutlined />}
                onClick={() => handleCancelTicket(record.id)}
              />
            </Tooltip>
          )}
        </Space>
      ),
    },
  ];

  const filteredTickets = tickets.filter(ticket => {
    const matchesSearch = ticket.ticketCode.toLowerCase().includes(searchText.toLowerCase()) ||
                         ticket.customerName.toLowerCase().includes(searchText.toLowerCase()) ||
                         ticket.eventName.toLowerCase().includes(searchText.toLowerCase());
    const matchesStatus = filterStatus === 'all' || ticket.status === filterStatus;
    const matchesEvent = filterEvent === 'all' || ticket.eventName === filterEvent;
    return matchesSearch && matchesStatus && matchesEvent;
  });

  // Statistics
  const totalTickets = tickets.length;
  const validTickets = tickets.filter(t => t.status === 'valid').length;
  const usedTickets = tickets.filter(t => t.status === 'used').length;
  const totalRevenue = tickets.filter(t => t.status !== 'cancelled').reduce((sum, t) => sum + t.price, 0);

  // Get unique events for filter
  const uniqueEvents = [...new Set(tickets.map(t => t.eventName))];

  return (
    <AdminLayout>
      <div className="ticket-management-page">
        {/* Header */}
        <div className="page-header">
          <div>
            <Title level={2}>Quản lý vé</Title>
            <Text type="secondary">Theo dõi và xử lý các vé đã phát hành</Text>
          </div>
          <Space>
            <Button icon={<ExportOutlined />}>Xuất báo cáo</Button>
            <Button icon={<DownloadOutlined />}>Tải template</Button>
            <Button icon={<QrcodeOutlined />}>Quét QR</Button>
          </Space>
        </div>

        {/* Stats */}
        <Row gutter={[24, 24]} className="stats-row">
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title="Tổng số vé"
                value={totalTickets}
                prefix={<TikTokOutlined />}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title="Vé có hiệu lực"
                value={validTickets}
                prefix={<CheckCircleOutlined />}
                valueStyle={{ color: '#52c41a' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title="Vé đã sử dụng"
                value={usedTickets}
                prefix={<ScanOutlined />}
                valueStyle={{ color: '#1890ff' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title="Tổng doanh thu"
                value={totalRevenue}
                formatter={(value) => `${value.toLocaleString('vi-VN')} ₫`}
                prefix={<UserOutlined />}
                valueStyle={{ color: '#faad14' }}
              />
            </Card>
          </Col>
        </Row>

        {/* Usage Rate Card */}
        <Card className="usage-card">
          <Row gutter={24}>
            <Col span={12}>
              <Title level={4}>Tỷ lệ sử dụng vé</Title>
              <Progress
                percent={((usedTickets / totalTickets) * 100).toFixed(1)}
                status="active"
                strokeColor={{
                  '0%': '#108ee9',
                  '100%': '#87d068',
                }}
              />
            </Col>
            <Col span={12}>
              <Title level={4}>Tỷ lệ vé có hiệu lực</Title>
              <Progress
                percent={((validTickets / totalTickets) * 100).toFixed(1)}
                status="active"
                strokeColor="#52c41a"
              />
            </Col>
          </Row>
        </Card>

        {/* Filters */}
        <Card className="filter-card">
          <Space wrap>
            <Input
              placeholder="Tìm kiếm theo mã vé, tên khách hàng, sự kiện..."
              prefix={<SearchOutlined />}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              style={{ width: 300 }}
            />
            <Select
              value={filterStatus}
              onChange={setFilterStatus}
              style={{ width: 150 }}
              placeholder="Trạng thái"
            >
              <Option value="all">Tất cả trạng thái</Option>
              <Option value="valid">Có hiệu lực</Option>
              <Option value="used">Đã sử dụng</Option>
              <Option value="expired">Hết hạn</Option>
              <Option value="cancelled">Đã hủy</Option>
            </Select>
            <Select
              value={filterEvent}
              onChange={setFilterEvent}
              style={{ width: 200 }}
              placeholder="Sự kiện"
            >
              <Option value="all">Tất cả sự kiện</Option>
              {uniqueEvents.map(event => (
                <Option key={event} value={event}>{event}</Option>
              ))}
            </Select>
            <RangePicker placeholder={['Từ ngày', 'Đến ngày']} />
          </Space>
        </Card>

        {/* Table */}
        <Card>
          <Table
            columns={columns}
            dataSource={filteredTickets}
            rowKey="id"
            loading={loading}
            pagination={{
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total, range) => 
                `${range[0]}-${range[1]} của ${total} vé`,
            }}
            scroll={{ x: 1200 }}
          />
        </Card>

        {/* Ticket Detail Modal */}
        <Modal
          title="Chi tiết vé"
          open={isModalVisible}
          onCancel={() => setIsModalVisible(false)}
          footer={[
            <Button key="close" onClick={() => setIsModalVisible(false)}>
              Đóng
            </Button>,
            <Button key="resend" icon={<MailOutlined />} onClick={() => handleResendTicket(viewingTicket)}>
              Gửi lại vé
            </Button>,
            <Button key="print" type="primary" icon={<PrinterOutlined />}>
              In vé
            </Button>
          ]}
          width={700}
        >
          {viewingTicket && (
            <div className="ticket-detail">
              <Row gutter={[24, 24]}>
                <Col span={16}>
                  <Card title="Thông tin vé" size="small" className="ticket-info-card">
                    <Descriptions column={1} size="small">
                      <Descriptions.Item label="Mã vé">
                        <Text strong style={{ color: '#1890ff' }}>{viewingTicket.ticketCode}</Text>
                      </Descriptions.Item>
                      <Descriptions.Item label="Trạng thái">
                        <Tag color={getStatusColor(viewingTicket.status)} icon={getStatusIcon(viewingTicket.status)}>
                          {getStatusText(viewingTicket.status)}
                        </Tag>
                      </Descriptions.Item>
                      <Descriptions.Item label="Ngày phát hành">
                        {new Date(viewingTicket.issuedDate).toLocaleDateString('vi-VN')}
                      </Descriptions.Item>
                      {viewingTicket.usedDate && (
                        <Descriptions.Item label="Ngày sử dụng">
                          {new Date(viewingTicket.usedDate).toLocaleDateString('vi-VN')}
                        </Descriptions.Item>
                      )}
                      {viewingTicket.checkInTime && (
                        <Descriptions.Item label="Thời gian check-in">
                          {new Date(viewingTicket.checkInTime).toLocaleString('vi-VN')}
                        </Descriptions.Item>
                      )}
                      {viewingTicket.checkInLocation && (
                        <Descriptions.Item label="Vị trí check-in">
                          {viewingTicket.checkInLocation}
                        </Descriptions.Item>
                      )}
                    </Descriptions>
                  </Card>

                  <Card title="Thông tin sự kiện" size="small" style={{ marginTop: 16 }}>
                    <Descriptions column={1} size="small">
                      <Descriptions.Item label="Tên sự kiện">
                        {viewingTicket.eventName}
                      </Descriptions.Item>
                      <Descriptions.Item label="Ngày diễn ra">
                        {new Date(viewingTicket.eventDate).toLocaleDateString('vi-VN')}
                      </Descriptions.Item>
                      <Descriptions.Item label="Giờ bắt đầu">
                        {viewingTicket.eventTime}
                      </Descriptions.Item>
                      <Descriptions.Item label="Loại vé">
                        <Tag>{viewingTicket.ticketType}</Tag>
                      </Descriptions.Item>
                      <Descriptions.Item label="Chỗ ngồi">
                        <Tag color="blue" style={{ fontWeight: 'bold' }}>
                          {viewingTicket.seatNumber}
                        </Tag>
                      </Descriptions.Item>
                      <Descriptions.Item label="Giá vé">
                        <Text strong style={{ color: '#52c41a', fontSize: '16px' }}>
                          {viewingTicket.price.toLocaleString('vi-VN')} ₫
                        </Text>
                      </Descriptions.Item>
                    </Descriptions>
                  </Card>

                  <Card title="Thông tin khách hàng" size="small" style={{ marginTop: 16 }}>
                    <Descriptions column={1} size="small">
                      <Descriptions.Item label="Họ tên">
                        {viewingTicket.customerName}
                      </Descriptions.Item>
                      <Descriptions.Item label="Email">
                        {viewingTicket.customerEmail}
                      </Descriptions.Item>
                      <Descriptions.Item label="Mã đơn hàng">
                        <Text style={{ color: '#1890ff' }}>{viewingTicket.orderId}</Text>
                      </Descriptions.Item>
                    </Descriptions>
                  </Card>
                </Col>

                <Col span={8}>
                  <Card title="QR Code" size="small" className="qr-card">
                    <div style={{ textAlign: 'center' }}>
                      <QRCode
                        value={viewingTicket.ticketCode}
                        size={160}
                        status={viewingTicket.status === 'valid' ? 'active' : 'expired'}
                      />
                      <div style={{ marginTop: 16 }}>
                        <Text type="secondary" style={{ fontSize: '12px' }}>
                          Quét mã này để xác thực vé
                        </Text>
                      </div>
                      {viewingTicket.status === 'valid' && (
                        <Button 
                          type="primary" 
                          icon={<ScanOutlined />} 
                          style={{ marginTop: 12 }}
                          onClick={() => handleValidateTicket(viewingTicket.id)}
                        >
                          Xác thực vé
                        </Button>
                      )}
                    </div>
                  </Card>
                </Col>
              </Row>
            </div>
          )}
        </Modal>
      </div>
    </AdminLayout>
  );
};

export default TicketManagementPage;
