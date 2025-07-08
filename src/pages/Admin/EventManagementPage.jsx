import { useState, useEffect } from 'react';
import {
  Table, Card, Button, Input, Select, Tag, Space, Modal, Form,
  Typography, Row, Col, Statistic, Avatar, Popconfirm, message,
  Upload, DatePicker, Switch, InputNumber, Image
} from 'antd';
import {
  CalendarOutlined, EditOutlined, DeleteOutlined, PlusOutlined,
  SearchOutlined, ExportOutlined, UploadOutlined, EyeOutlined,
  PlayCircleOutlined, PauseCircleOutlined, StopOutlined,
  FileImageOutlined, TeamOutlined, DollarOutlined, ClockCircleOutlined
} from '@ant-design/icons';
import AdminLayout from '../../components/layout/AdminLayout';
import '../../assets/scss/EventManagementPage.scss';

const { Title, Text } = Typography;
const { Option } = Select;
const { RangePicker } = DatePicker;
const { TextArea } = Input;

// Mock data
const mockEvents = [
  {
    id: '1',
    name: 'Concert Sơn Tùng MTP 2024',
    category: 'music',
    location: 'Sân vận động Mỹ Đình',
    startDate: '2024-08-15',
    endDate: '2024-08-15',
    startTime: '20:00',
    endTime: '23:00',
    status: 'active',
    ticketsSold: 8500,
    totalTickets: 10000,
    revenue: 25500000,
    price: 300000,
    organizer: 'M-TP Entertainment',
    description: 'Đêm nhạc hoành tráng với những hit đình đám',
    image: '/src/assets/img/event1.jpeg',
    featured: true
  },
  {
    id: '2',
    name: 'Hội thảo Marketing Digital',
    category: 'education',
    location: 'Trung tâm Hội nghị Quốc gia',
    startDate: '2024-07-20',
    endDate: '2024-07-21',
    startTime: '08:00',
    endTime: '17:00',
    status: 'upcoming',
    ticketsSold: 450,
    totalTickets: 500,
    revenue: 22500000,
    price: 500000,
    organizer: 'Digital Marketing Vietnam',
    description: 'Hội thảo chuyên sâu về marketing số',
    image: '/src/assets/img/event2.jpeg',
    featured: false
  },
  {
    id: '3',
    name: 'Triển lãm Nghệ thuật đương đại',
    category: 'art',
    location: 'Bảo tàng Mỹ thuật Việt Nam',
    startDate: '2024-06-01',
    endDate: '2024-06-30',
    startTime: '09:00',
    endTime: '18:00',
    status: 'ended',
    ticketsSold: 1200,
    totalTickets: 1500,
    revenue: 24000000,
    price: 200000,
    organizer: 'Vietnam Art Foundation',
    description: 'Triển lãm các tác phẩm nghệ thuật đương đại',
    image: '/src/assets/img/event3.png',
    featured: true
  }
];

const EventManagementPage = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [form] = Form.useForm();

  // ...existing code...

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        await new Promise(resolve => setTimeout(resolve, 1000));
        setEvents(mockEvents);
      } catch {
        message.error('Lỗi khi tải danh sách sự kiện');
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const handleAddEvent = () => {
    setEditingEvent(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleEditEvent = (event) => {
    setEditingEvent(event);
    form.setFieldsValue({
      ...event,
      dateRange: [event.startDate, event.endDate],
      timeRange: [event.startTime, event.endTime]
    });
    setIsModalVisible(true);
  };

  const handleDeleteEvent = async (eventId) => {
    try {
      setEvents(events.filter(event => event.id !== eventId));
      message.success('Xóa sự kiện thành công');
    } catch {
      message.error('Lỗi khi xóa sự kiện');
    }
  };

  const handleSubmit = async (values) => {
    try {
      const eventData = {
        ...values,
        startDate: values.dateRange[0],
        endDate: values.dateRange[1],
        startTime: values.timeRange[0],
        endTime: values.timeRange[1]
      };
      delete eventData.dateRange;
      delete eventData.timeRange;

      if (editingEvent) {
        setEvents(events.map(event => 
          event.id === editingEvent.id ? { ...event, ...eventData } : event
        ));
        message.success('Cập nhật sự kiện thành công');
      } else {
        const newEvent = {
          id: Date.now().toString(),
          ...eventData,
          ticketsSold: 0,
          revenue: 0
        };
        setEvents([...events, newEvent]);
        message.success('Thêm sự kiện thành công');
      }
      setIsModalVisible(false);
      form.resetFields();
    } catch {
      message.error('Lỗi khi lưu thông tin sự kiện');
    }
  };

  const handleStatusChange = async (eventId, newStatus) => {
    try {
      setEvents(events.map(event => 
        event.id === eventId ? { ...event, status: newStatus } : event
      ));
      message.success(`${newStatus === 'active' ? 'Kích hoạt' : newStatus === 'paused' ? 'Tạm dừng' : 'Dừng'} sự kiện thành công`);
    } catch {
      message.error('Lỗi khi thay đổi trạng thái sự kiện');
    }
  };

  const columns = [
    {
      title: 'Sự kiện',
      dataIndex: 'name',
      key: 'name',
      render: (text, record) => (
        <Space>
          <Avatar 
            shape="square" 
            size={64} 
            src={record.image} 
            icon={<CalendarOutlined />}
          />
          <div>
            <div className="event-name">
              {text}
              {record.featured && (
                <Tag color="gold" style={{ marginLeft: 8 }}>Nổi bật</Tag>
              )}
            </div>
            <Text type="secondary" className="event-organizer">{record.organizer}</Text>
            <div className="event-location">
              <Text type="secondary">{record.location}</Text>
            </div>
          </div>
        </Space>
      ),
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: 'Danh mục',
      dataIndex: 'category',
      key: 'category',
      render: (category) => {
        const categories = {
          music: { label: 'Âm nhạc', color: 'red' },
          education: { label: 'Giáo dục', color: 'blue' },
          art: { label: 'Nghệ thuật', color: 'purple' },
          sports: { label: 'Thể thao', color: 'green' },
          technology: { label: 'Công nghệ', color: 'orange' }
        };
        const cat = categories[category] || { label: category, color: 'default' };
        return <Tag color={cat.color}>{cat.label}</Tag>;
      },
      filters: [
        { text: 'Âm nhạc', value: 'music' },
        { text: 'Giáo dục', value: 'education' },
        { text: 'Nghệ thuật', value: 'art' },
        { text: 'Thể thao', value: 'sports' },
        { text: 'Công nghệ', value: 'technology' }
      ],
      onFilter: (value, record) => record.category === value,
    },
    {
      title: 'Thời gian',
      dataIndex: 'startDate',
      key: 'startDate',
      render: (_, record) => (
        <div>
          <div>{new Date(record.startDate).toLocaleDateString('vi-VN')}</div>
          <Text type="secondary">{record.startTime} - {record.endTime}</Text>
        </div>
      ),
      sorter: (a, b) => new Date(a.startDate) - new Date(b.startDate),
    },
    {
      title: 'Vé',
      key: 'tickets',
      render: (_, record) => (
        <div>
          <div>
            <Text strong>{record.ticketsSold}</Text>
            <Text type="secondary">/{record.totalTickets}</Text>
          </div>
          <div style={{ fontSize: '12px', color: '#999' }}>
            {((record.ticketsSold / record.totalTickets) * 100).toFixed(1)}%
          </div>
        </div>
      ),
    },
    {
      title: 'Doanh thu',
      dataIndex: 'revenue',
      key: 'revenue',
      render: (value) => (
        <Text strong style={{ color: '#52c41a' }}>
          {value.toLocaleString('vi-VN')} ₫
        </Text>
      ),
      sorter: (a, b) => a.revenue - b.revenue,
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status, record) => {
        const statusConfig = {
          active: { label: 'Đang bán', color: 'success', icon: <PlayCircleOutlined /> },
          upcoming: { label: 'Sắp diễn ra', color: 'processing', icon: <ClockCircleOutlined /> },
          paused: { label: 'Tạm dừng', color: 'warning', icon: <PauseCircleOutlined /> },
          ended: { label: 'Đã kết thúc', color: 'default', icon: <StopOutlined /> }
        };
        const config = statusConfig[status] || statusConfig.upcoming;
        return (
          <Space>
            <Tag color={config.color} icon={config.icon}>
              {config.label}
            </Tag>
            {status === 'active' && (
              <Button 
                size="small" 
                icon={<PauseCircleOutlined />}
                onClick={() => handleStatusChange(record.id, 'paused')}
                title="Tạm dừng"
              />
            )}
            {status === 'paused' && (
              <Button 
                size="small" 
                icon={<PlayCircleOutlined />}
                onClick={() => handleStatusChange(record.id, 'active')}
                title="Kích hoạt"
              />
            )}
          </Space>
        );
      },
      filters: [
        { text: 'Đang bán', value: 'active' },
        { text: 'Sắp diễn ra', value: 'upcoming' },
        { text: 'Tạm dừng', value: 'paused' },
        { text: 'Đã kết thúc', value: 'ended' }
      ],
      onFilter: (value, record) => record.status === value,
    },
    {
      title: 'Thao tác',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button 
            type="text" 
            icon={<EyeOutlined />} 
            title="Xem chi tiết"
          />
          <Button 
            type="text" 
            icon={<EditOutlined />} 
            onClick={() => handleEditEvent(record)}
            title="Chỉnh sửa"
          />
          <Popconfirm
            title="Bạn có chắc chắn muốn xóa sự kiện này?"
            onConfirm={() => handleDeleteEvent(record.id)}
            okText="Xóa"
            cancelText="Hủy"
          >
            <Button 
              type="text" 
              icon={<DeleteOutlined />} 
              danger
              title="Xóa"
            />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const filteredEvents = events.filter(event => {
    const matchesSearch = event.name.toLowerCase().includes(searchText.toLowerCase()) ||
                         event.organizer.toLowerCase().includes(searchText.toLowerCase());
    const matchesStatus = filterStatus === 'all' || event.status === filterStatus;
    const matchesCategory = filterCategory === 'all' || event.category === filterCategory;
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const rowSelection = {
    selectedRowKeys,
    onChange: setSelectedRowKeys,
  };

  // Statistics
  const totalEvents = events.length;
  const activeEvents = events.filter(e => e.status === 'active').length;
  const totalRevenue = events.reduce((sum, e) => sum + e.revenue, 0);
  const totalTicketsSold = events.reduce((sum, e) => sum + e.ticketsSold, 0);

  return (
    <AdminLayout>
      <div className="event-management-page">
        {/* Header */}
        <div className="page-header">
          <div>
            <Title level={2}>Quản lý sự kiện</Title>
            <Text type="secondary">Quản lý tất cả sự kiện trên hệ thống</Text>
          </div>
          <Space>
            <Button icon={<ExportOutlined />}>Xuất Excel</Button>
            <Button icon={<UploadOutlined />}>Nhập Excel</Button>
            <Button type="primary" icon={<PlusOutlined />} onClick={handleAddEvent}>
              Tạo sự kiện mới
            </Button>
          </Space>
        </div>

        {/* Stats */}
        <Row gutter={[24, 24]} className="stats-row">
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title="Tổng sự kiện"
                value={totalEvents}
                prefix={<CalendarOutlined />}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title="Đang bán vé"
                value={activeEvents}
                prefix={<PlayCircleOutlined />}
                valueStyle={{ color: '#52c41a' }}
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
                valueStyle={{ color: '#faad14' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title="Vé đã bán"
                value={totalTicketsSold}
                prefix={<TeamOutlined />}
                valueStyle={{ color: '#1890ff' }}
              />
            </Card>
          </Col>
        </Row>

        {/* Filters */}
        <Card className="filter-card">
          <Space wrap>
            <Input
              placeholder="Tìm kiếm theo tên sự kiện, người tổ chức..."
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
              <Option value="active">Đang bán</Option>
              <Option value="upcoming">Sắp diễn ra</Option>
              <Option value="paused">Tạm dừng</Option>
              <Option value="ended">Đã kết thúc</Option>
            </Select>
            <Select
              value={filterCategory}
              onChange={setFilterCategory}
              style={{ width: 150 }}
              placeholder="Danh mục"
            >
              <Option value="all">Tất cả danh mục</Option>
              <Option value="music">Âm nhạc</Option>
              <Option value="education">Giáo dục</Option>
              <Option value="art">Nghệ thuật</Option>
              <Option value="sports">Thể thao</Option>
              <Option value="technology">Công nghệ</Option>
            </Select>
            <RangePicker placeholder={['Từ ngày', 'Đến ngày']} />
            {selectedRowKeys.length > 0 && (
              <Button danger icon={<DeleteOutlined />}>
                Xóa đã chọn ({selectedRowKeys.length})
              </Button>
            )}
          </Space>
        </Card>

        {/* Table */}
        <Card>
          <Table
            columns={columns}
            dataSource={filteredEvents}
            rowKey="id"
            loading={loading}
            rowSelection={rowSelection}
            pagination={{
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total, range) => 
                `${range[0]}-${range[1]} của ${total} sự kiện`,
            }}
            scroll={{ x: 1200 }}
          />
        </Card>

        {/* Add/Edit Modal */}
        <Modal
          title={editingEvent ? 'Chỉnh sửa sự kiện' : 'Tạo sự kiện mới'}
          open={isModalVisible}
          onCancel={() => setIsModalVisible(false)}
          footer={null}
          width={800}
        >
          <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
          >
            <Row gutter={16}>
              <Col span={16}>
                <Form.Item
                  name="name"
                  label="Tên sự kiện"
                  rules={[{ required: true, message: 'Vui lòng nhập tên sự kiện!' }]}
                >
                  <Input placeholder="Nhập tên sự kiện" />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  name="category"
                  label="Danh mục"
                  rules={[{ required: true, message: 'Vui lòng chọn danh mục!' }]}
                >
                  <Select placeholder="Chọn danh mục">
                    <Option value="music">Âm nhạc</Option>
                    <Option value="education">Giáo dục</Option>
                    <Option value="art">Nghệ thuật</Option>
                    <Option value="sports">Thể thao</Option>
                    <Option value="technology">Công nghệ</Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>

            <Form.Item
              name="description"
              label="Mô tả"
              rules={[{ required: true, message: 'Vui lòng nhập mô tả!' }]}
            >
              <TextArea rows={3} placeholder="Mô tả chi tiết về sự kiện" />
            </Form.Item>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="organizer"
                  label="Người tổ chức"
                  rules={[{ required: true, message: 'Vui lòng nhập người tổ chức!' }]}
                >
                  <Input placeholder="Tên người/tổ chức" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="location"
                  label="Địa điểm"
                  rules={[{ required: true, message: 'Vui lòng nhập địa điểm!' }]}
                >
                  <Input placeholder="Địa điểm tổ chức" />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="dateRange"
                  label="Thời gian"
                  rules={[{ required: true, message: 'Vui lòng chọn thời gian!' }]}
                >
                  <RangePicker style={{ width: '100%' }} />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="timeRange"
                  label="Giờ"
                  rules={[{ required: true, message: 'Vui lòng chọn giờ!' }]}
                >
                  <Input.Group compact>
                    <Input
                      style={{ width: '50%' }}
                      placeholder="08:00"
                      addonBefore="Từ"
                    />
                    <Input
                      style={{ width: '50%' }}
                      placeholder="17:00"
                      addonBefore="Đến"
                    />
                  </Input.Group>
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={8}>
                <Form.Item
                  name="price"
                  label="Giá vé (VNĐ)"
                  rules={[{ required: true, message: 'Vui lòng nhập giá vé!' }]}
                >
                  <InputNumber
                    style={{ width: '100%' }}
                    placeholder="300000"
                    formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                    parser={value => value.replace(/\$\s?|(,*)/g, '')}
                  />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  name="totalTickets"
                  label="Tổng số vé"
                  rules={[{ required: true, message: 'Vui lòng nhập số lượng vé!' }]}
                >
                  <InputNumber
                    style={{ width: '100%' }}
                    placeholder="1000"
                    min={1}
                  />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  name="status"
                  label="Trạng thái"
                  rules={[{ required: true, message: 'Vui lòng chọn trạng thái!' }]}
                >
                  <Select placeholder="Chọn trạng thái">
                    <Option value="upcoming">Sắp diễn ra</Option>
                    <Option value="active">Đang bán vé</Option>
                    <Option value="paused">Tạm dừng</Option>
                    <Option value="ended">Đã kết thúc</Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="image"
                  label="Hình ảnh sự kiện"
                >
                  <Upload
                    listType="picture-card"
                    showUploadList={false}
                    beforeUpload={() => false}
                  >
                    <div>
                      <FileImageOutlined />
                      <div style={{ marginTop: 8 }}>Tải lên</div>
                    </div>
                  </Upload>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="featured"
                  label="Sự kiện nổi bật"
                  valuePropName="checked"
                >
                  <Switch checkedChildren="Có" unCheckedChildren="Không" />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item>
              <Space>
                <Button type="primary" htmlType="submit">
                  {editingEvent ? 'Cập nhật' : 'Tạo sự kiện'}
                </Button>
                <Button onClick={() => setIsModalVisible(false)}>
                  Hủy
                </Button>
              </Space>
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </AdminLayout>
  );
};

export default EventManagementPage;
