import { useState, useEffect } from 'react';
import {
  Table, Card, Button, Input, Select, Tag, Space, Modal, 
  Typography, Row, Col, Statistic, Avatar, message, 
  DatePicker, Descriptions, Steps, Timeline, Divider
} from 'antd';
import {
  ShoppingOutlined, EyeOutlined, PrinterOutlined, MailOutlined,
  SearchOutlined, FilterOutlined, ExportOutlined, DollarOutlined,
  CheckCircleOutlined, ClockCircleOutlined, CloseCircleOutlined,
  SyncOutlined, UserOutlined, CalendarOutlined, CreditCardOutlined
} from '@ant-design/icons';
import AdminLayout from '../../components/layout/AdminLayout';
import '../../assets/scss/OrderManagementPage.scss';

const { Title, Text } = Typography;
const { Option } = Select;
const { RangePicker } = DatePicker;
const { Step } = Steps;

// Mock data
const mockOrders = [
  {
    id: 'ORD001',
    customerName: 'Nguyễn Văn A',
    customerEmail: 'nguyenvana@example.com',
    customerPhone: '0123456789',
    eventName: 'Concert Sơn Tùng MTP 2024',
    eventDate: '2024-08-15',
    ticketType: 'VIP',
    quantity: 2,
    unitPrice: 1500000,
    totalAmount: 3000000,
    status: 'completed',
    paymentMethod: 'credit_card',
    paymentStatus: 'paid',
    orderDate: '2024-06-20 14:30:00',
    paymentDate: '2024-06-20 14:32:15',
    notes: 'Khách hàng yêu cầu ghế gần sân khấu'
  },
  {
    id: 'ORD002',
    customerName: 'Trần Thị B',
    customerEmail: 'tranthib@example.com',
    customerPhone: '0987654321',
    eventName: 'Hội thảo Marketing Digital',
    eventDate: '2024-07-20',
    ticketType: 'Standard',
    quantity: 1,
    unitPrice: 500000,
    totalAmount: 500000,
    status: 'pending',
    paymentMethod: 'bank_transfer',
    paymentStatus: 'pending',
    orderDate: '2024-06-25 09:15:00',
    paymentDate: null,
    notes: ''
  },
  {
    id: 'ORD003',
    customerName: 'Lê Văn C',
    customerEmail: 'levanc@example.com',
    customerPhone: '0456789123',
    eventName: 'Triển lãm Nghệ thuật',
    eventDate: '2024-06-30',
    ticketType: 'Standard',
    quantity: 3,
    unitPrice: 200000,
    totalAmount: 600000,
    status: 'cancelled',
    paymentMethod: 'e_wallet',
    paymentStatus: 'refunded',
    orderDate: '2024-06-18 16:45:00',
    paymentDate: '2024-06-18 16:47:30',
    notes: 'Khách hàng hủy do có việc đột xuất'
  }
];

const OrderManagementPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPaymentStatus, setFilterPaymentStatus] = useState('all');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [viewingOrder, setViewingOrder] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        await new Promise(resolve => setTimeout(resolve, 1000));
        setOrders(mockOrders);
      } catch {
        message.error('Lỗi khi tải danh sách đơn hàng');
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const handleViewOrder = (order) => {
    setViewingOrder(order);
    setIsModalVisible(true);
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      setOrders(orders.map(order => 
        order.id === orderId ? { ...order, status: newStatus } : order
      ));
      message.success('Cập nhật trạng thái đơn hàng thành công');
    } catch {
      message.error('Lỗi khi cập nhật trạng thái');
    }
  };

  const handleSendEmail = async (order) => {
    try {
      message.success(`Đã gửi email xác nhận đến ${order.customerEmail}`);
    } catch {
      message.error('Lỗi khi gửi email');
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'processing',
      completed: 'success',
      cancelled: 'error',
      refunded: 'warning'
    };
    return colors[status] || 'default';
  };

  const getStatusText = (status) => {
    const texts = {
      pending: 'Chờ xử lý',
      completed: 'Hoàn thành',
      cancelled: 'Đã hủy',
      refunded: 'Đã hoàn tiền'
    };
    return texts[status] || status;
  };

  const getPaymentStatusColor = (status) => {
    const colors = {
      pending: 'processing',
      paid: 'success',
      failed: 'error',
      refunded: 'warning'
    };
    return colors[status] || 'default';
  };

  const getPaymentStatusText = (status) => {
    const texts = {
      pending: 'Chờ thanh toán',
      paid: 'Đã thanh toán',
      failed: 'Thanh toán thất bại',
      refunded: 'Đã hoàn tiền'
    };
    return texts[status] || status;
  };

  const getPaymentMethodText = (method) => {
    const methods = {
      credit_card: 'Thẻ tín dụng',
      bank_transfer: 'Chuyển khoản',
      e_wallet: 'Ví điện tử',
      cash: 'Tiền mặt'
    };
    return methods[method] || method;
  };

  const columns = [
    {
      title: 'Mã đơn hàng',
      dataIndex: 'id',
      key: 'id',
      render: (text) => <Text strong style={{ color: '#1890ff' }}>{text}</Text>,
      sorter: (a, b) => a.id.localeCompare(b.id),
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
          <Text type="secondary" style={{ fontSize: '12px' }}>
            {record.customerPhone}
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
            {new Date(record.eventDate).toLocaleDateString('vi-VN')}
          </Text>
          <Tag size="small">{record.ticketType}</Tag>
        </Space>
      ),
    },
    {
      title: 'Số lượng',
      dataIndex: 'quantity',
      key: 'quantity',
      align: 'center',
      render: (value) => <Text strong>{value}</Text>,
    },
    {
      title: 'Tổng tiền',
      dataIndex: 'totalAmount',
      key: 'totalAmount',
      render: (value) => (
        <Text strong style={{ color: '#52c41a' }}>
          {value.toLocaleString('vi-VN')} ₫
        </Text>
      ),
      sorter: (a, b) => a.totalAmount - b.totalAmount,
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={getStatusColor(status)}>
          {getStatusText(status)}
        </Tag>
      ),
      filters: [
        { text: 'Chờ xử lý', value: 'pending' },
        { text: 'Hoàn thành', value: 'completed' },
        { text: 'Đã hủy', value: 'cancelled' },
        { text: 'Đã hoàn tiền', value: 'refunded' }
      ],
      onFilter: (value, record) => record.status === value,
    },
    {
      title: 'Thanh toán',
      dataIndex: 'paymentStatus',
      key: 'paymentStatus',
      render: (status) => (
        <Tag color={getPaymentStatusColor(status)}>
          {getPaymentStatusText(status)}
        </Tag>
      ),
      filters: [
        { text: 'Chờ thanh toán', value: 'pending' },
        { text: 'Đã thanh toán', value: 'paid' },
        { text: 'Thất bại', value: 'failed' },
        { text: 'Đã hoàn tiền', value: 'refunded' }
      ],
      onFilter: (value, record) => record.paymentStatus === value,
    },
    {
      title: 'Ngày đặt',
      dataIndex: 'orderDate',
      key: 'orderDate',
      render: (date) => (
        <Text type="secondary">
          {new Date(date).toLocaleDateString('vi-VN')}
        </Text>
      ),
      sorter: (a, b) => new Date(a.orderDate) - new Date(b.orderDate),
    },
    {
      title: 'Thao tác',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button 
            type="text" 
            icon={<EyeOutlined />} 
            onClick={() => handleViewOrder(record)}
            title="Xem chi tiết"
          />
          <Button 
            type="text" 
            icon={<MailOutlined />} 
            onClick={() => handleSendEmail(record)}
            title="Gửi email"
          />
          <Button 
            type="text" 
            icon={<PrinterOutlined />} 
            title="In vé"
          />
          {record.status === 'pending' && (
            <Button 
              type="text" 
              style={{ color: '#52c41a' }}
              onClick={() => handleStatusChange(record.id, 'completed')}
              title="Xác nhận"
            >
              <CheckCircleOutlined />
            </Button>
          )}
        </Space>
      ),
    },
  ];

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.id.toLowerCase().includes(searchText.toLowerCase()) ||
                         order.customerName.toLowerCase().includes(searchText.toLowerCase()) ||
                         order.eventName.toLowerCase().includes(searchText.toLowerCase());
    const matchesStatus = filterStatus === 'all' || order.status === filterStatus;
    const matchesPaymentStatus = filterPaymentStatus === 'all' || order.paymentStatus === filterPaymentStatus;
    return matchesSearch && matchesStatus && matchesPaymentStatus;
  });

  // Statistics
  const totalOrders = orders.length;
  const completedOrders = orders.filter(o => o.status === 'completed').length;
  const totalRevenue = orders.filter(o => o.paymentStatus === 'paid').reduce((sum, o) => sum + o.totalAmount, 0);
  const pendingOrders = orders.filter(o => o.status === 'pending').length;

  const getOrderTimeline = (order) => {
    const timeline = [
      {
        color: 'blue',
        children: (
          <div>
            <Text strong>Đơn hàng được tạo</Text>
            <br />
            <Text type="secondary">{new Date(order.orderDate).toLocaleString('vi-VN')}</Text>
          </div>
        )
      }
    ];

    if (order.paymentDate) {
      timeline.push({
        color: order.paymentStatus === 'paid' ? 'green' : 'red',
        children: (
          <div>
            <Text strong>
              {order.paymentStatus === 'paid' ? 'Thanh toán thành công' : 'Thanh toán thất bại'}
            </Text>
            <br />
            <Text type="secondary">{new Date(order.paymentDate).toLocaleString('vi-VN')}</Text>
          </div>
        )
      });
    }

    if (order.status === 'completed') {
      timeline.push({
        color: 'green',
        children: (
          <div>
            <Text strong>Đơn hàng hoàn thành</Text>
            <br />
            <Text type="secondary">Vé đã được gửi qua email</Text>
          </div>
        )
      });
    } else if (order.status === 'cancelled') {
      timeline.push({
        color: 'red',
        children: (
          <div>
            <Text strong>Đơn hàng bị hủy</Text>
            <br />
            <Text type="secondary">{order.notes}</Text>
          </div>
        )
      });
    }

    return timeline;
  };

  return (
    <AdminLayout>
      <div className="order-management-page">
        {/* Header */}
        <div className="page-header">
          <div>
            <Title level={2}>Quản lý đơn hàng</Title>
            <Text type="secondary">Theo dõi và xử lý các đơn đặt vé</Text>
          </div>
          <Space>
            <Button icon={<ExportOutlined />}>Xuất báo cáo</Button>
            <Button icon={<PrinterOutlined />}>In danh sách</Button>
          </Space>
        </div>

        {/* Stats */}
        <Row gutter={[24, 24]} className="stats-row">
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title="Tổng đơn hàng"
                value={totalOrders}
                prefix={<ShoppingOutlined />}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title="Đã hoàn thành"
                value={completedOrders}
                prefix={<CheckCircleOutlined />}
                valueStyle={{ color: '#52c41a' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title="Chờ xử lý"
                value={pendingOrders}
                prefix={<ClockCircleOutlined />}
                valueStyle={{ color: '#faad14' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title="Tổng doanh thu"
                value={totalRevenue}
                prefix={<DollarOutlined />}
                formatter={(value) => `${value.toLocaleString('vi-VN')} ₫`}
                valueStyle={{ color: '#1890ff' }}
              />
            </Card>
          </Col>
        </Row>

        {/* Filters */}
        <Card className="filter-card">
          <Space wrap>
            <Input
              placeholder="Tìm kiếm theo mã đơn hàng, tên khách hàng..."
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
              <Option value="pending">Chờ xử lý</Option>
              <Option value="completed">Hoàn thành</Option>
              <Option value="cancelled">Đã hủy</Option>
              <Option value="refunded">Đã hoàn tiền</Option>
            </Select>
            <Select
              value={filterPaymentStatus}
              onChange={setFilterPaymentStatus}
              style={{ width: 150 }}
              placeholder="Thanh toán"
            >
              <Option value="all">Tất cả</Option>
              <Option value="pending">Chờ thanh toán</Option>
              <Option value="paid">Đã thanh toán</Option>
              <Option value="failed">Thất bại</Option>
              <Option value="refunded">Đã hoàn tiền</Option>
            </Select>
            <RangePicker placeholder={['Từ ngày', 'Đến ngày']} />
          </Space>
        </Card>

        {/* Table */}
        <Card>
          <Table
            columns={columns}
            dataSource={filteredOrders}
            rowKey="id"
            loading={loading}
            pagination={{
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total, range) => 
                `${range[0]}-${range[1]} của ${total} đơn hàng`,
            }}
            scroll={{ x: 1400 }}
          />
        </Card>

        {/* Order Detail Modal */}
        <Modal
          title="Chi tiết đơn hàng"
          open={isModalVisible}
          onCancel={() => setIsModalVisible(false)}
          footer={[
            <Button key="close" onClick={() => setIsModalVisible(false)}>
              Đóng
            </Button>,
            <Button key="email" icon={<MailOutlined />} onClick={() => handleSendEmail(viewingOrder)}>
              Gửi email
            </Button>,
            <Button key="print" type="primary" icon={<PrinterOutlined />}>
              In vé
            </Button>
          ]}
          width={800}
        >
          {viewingOrder && (
            <div className="order-detail">
              <Row gutter={[24, 24]}>
                <Col span={12}>
                  <Card title="Thông tin đơn hàng" size="small">
                    <Descriptions column={1} size="small">
                      <Descriptions.Item label="Mã đơn hàng">
                        <Text strong style={{ color: '#1890ff' }}>{viewingOrder.id}</Text>
                      </Descriptions.Item>
                      <Descriptions.Item label="Ngày đặt">
                        {new Date(viewingOrder.orderDate).toLocaleString('vi-VN')}
                      </Descriptions.Item>
                      <Descriptions.Item label="Trạng thái">
                        <Tag color={getStatusColor(viewingOrder.status)}>
                          {getStatusText(viewingOrder.status)}
                        </Tag>
                      </Descriptions.Item>
                      <Descriptions.Item label="Ghi chú">
                        {viewingOrder.notes || 'Không có ghi chú'}
                      </Descriptions.Item>
                    </Descriptions>
                  </Card>
                </Col>
                
                <Col span={12}>
                  <Card title="Thông tin khách hàng" size="small">
                    <Descriptions column={1} size="small">
                      <Descriptions.Item label="Họ tên">
                        {viewingOrder.customerName}
                      </Descriptions.Item>
                      <Descriptions.Item label="Email">
                        {viewingOrder.customerEmail}
                      </Descriptions.Item>
                      <Descriptions.Item label="Số điện thoại">
                        {viewingOrder.customerPhone}
                      </Descriptions.Item>
                    </Descriptions>
                  </Card>
                </Col>
              </Row>

              <Row gutter={[24, 24]} style={{ marginTop: 16 }}>
                <Col span={12}>
                  <Card title="Thông tin sự kiện" size="small">
                    <Descriptions column={1} size="small">
                      <Descriptions.Item label="Tên sự kiện">
                        {viewingOrder.eventName}
                      </Descriptions.Item>
                      <Descriptions.Item label="Ngày diễn ra">
                        {new Date(viewingOrder.eventDate).toLocaleDateString('vi-VN')}
                      </Descriptions.Item>
                      <Descriptions.Item label="Loại vé">
                        <Tag>{viewingOrder.ticketType}</Tag>
                      </Descriptions.Item>
                      <Descriptions.Item label="Số lượng">
                        {viewingOrder.quantity}
                      </Descriptions.Item>
                    </Descriptions>
                  </Card>
                </Col>
                
                <Col span={12}>
                  <Card title="Thông tin thanh toán" size="small">
                    <Descriptions column={1} size="small">
                      <Descriptions.Item label="Phương thức">
                        {getPaymentMethodText(viewingOrder.paymentMethod)}
                      </Descriptions.Item>
                      <Descriptions.Item label="Trạng thái">
                        <Tag color={getPaymentStatusColor(viewingOrder.paymentStatus)}>
                          {getPaymentStatusText(viewingOrder.paymentStatus)}
                        </Tag>
                      </Descriptions.Item>
                      <Descriptions.Item label="Giá vé">
                        {viewingOrder.unitPrice.toLocaleString('vi-VN')} ₫
                      </Descriptions.Item>
                      <Descriptions.Item label="Tổng tiền">
                        <Text strong style={{ color: '#52c41a', fontSize: '16px' }}>
                          {viewingOrder.totalAmount.toLocaleString('vi-VN')} ₫
                        </Text>
                      </Descriptions.Item>
                    </Descriptions>
                  </Card>
                </Col>
              </Row>

              <Divider />

              <Card title="Lịch sử xử lý" size="small">
                <Timeline items={getOrderTimeline(viewingOrder)} />
              </Card>
            </div>
          )}
        </Modal>
      </div>
    </AdminLayout>
  );
};

export default OrderManagementPage;
