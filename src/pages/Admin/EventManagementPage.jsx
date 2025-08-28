import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Table, Card, Button, Input, Select, Tag, Space, Modal, Form,
  Typography, Row, Col, Statistic, Avatar, Popconfirm, message,
  Upload, DatePicker, Switch, InputNumber, Image
} from 'antd';
import {
  CalendarOutlined, EditOutlined, DeleteOutlined, PlusOutlined,
  SearchOutlined, ExportOutlined, UploadOutlined, EyeOutlined,
  PlayCircleOutlined, PauseCircleOutlined, StopOutlined, CheckOutlined,
  FileImageOutlined, TeamOutlined, DollarOutlined, ClockCircleOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';
import AdminLayout from '../../components/layout/AdminLayout';
import { formatDateForAPI } from '../../utils/dateUtils';
import { 
  fetchEvents, 
  createEvent, // Giữ lại nếu bạn vẫn muốn tính năng tạo qua modal nếu cần sau này
  deleteEvent 
} from '../../store/actions/eventsActions';
import { fetchCategories } from '../../store/actions/categoryActions';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import Cookies from 'js-cookie';
import '../../assets/scss/EventManagementPage.scss';

const { Title, Text } = Typography;
const { Option } = Select;
const { RangePicker } = DatePicker;
const { TextArea } = Input;

const EventManagementPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate(); // Khởi tạo useNavigate
  const { events, loading, error } = useSelector(state => state.events);
  const { categories } = useSelector(state => state.category);
  
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');
  const [isModalVisible, setIsModalVisible] = useState(false); // Có thể xóa nếu không dùng modal nữa
  const [editingEvent, setEditingEvent] = useState(null); // Có thể xóa nếu không dùng modal nữa
  const [form] = Form.useForm(); // Có thể xóa nếu không dùng modal nữa

  useEffect(() => {
    // Load events and categories when component mounts
    dispatch(fetchEvents());
    dispatch(fetchCategories());
  }, [dispatch]);

  useEffect(() => {
    // Handle errors
    if (error) {
      message.error(error);
    }
  }, [error]);

  const handleAddEvent = () => {
    navigate('/organization/events/register'); // Chuyển hướng đến trang đăng ký sự kiện
  };


  const handleEditEvent = (event) => {
    setEditingEvent(event);
    form.setFieldsValue({
      ...event,
      dateRange: [
        event.date_Start ? dayjs(event.date_Start) : null, 
        event.date_End ? dayjs(event.date_End) : null
      ]
    });
    setIsModalVisible(true);
  };

  const handleDeleteEvent = async (eventId) => {
    try {
      await dispatch(deleteEvent(eventId)).unwrap();
      message.success('Xóa sự kiện thành công');
    } catch (error) {
      message.error('Lỗi khi xóa sự kiện: ' + error);
    }
  };

  const handleSubmit = async (values) => {
    try {
      const eventData = {
        name: values.name,
        image: values.image || "https://example.com/images/default_event.jpg",
        description: values.description,
        date_Start: formatDateForAPI(values.dateRange[0]),
        date_End: formatDateForAPI(values.dateRange[1]),
        price: values.price,
        cateID: values.category,
        slot: values.totalTickets,
        location: values.location
      };

      if (editingEvent) {
        // Update existing event: PUT /Unitic/Event/{eventId}
        const response = await fetch(`https://localhost:7163/Unitic/Event/${editingEvent.eventID}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(eventData)
        });
        
        if (response.ok) {
          message.success('Cập nhật sự kiện thành công');
        } else {
          throw new Error('API call failed');
        }
      } else {
        // Create new event using Redux action
        // Lưu ý: Nếu bạn chỉ muốn tạo sự kiện qua trang OrganizationRegisterEventPage,
        // thì phần này (createEvent) có thể được xóa hoặc di chuyển.
        await dispatch(createEvent(eventData)).unwrap();
        message.success('Thêm sự kiện thành công');
      }
      
      setIsModalVisible(false);
      form.resetFields();
      // Refresh events list
      dispatch(fetchEvents());
    } catch (error) {
      message.error('Lỗi khi lưu thông tin sự kiện: ' + (error.message || error));
    }
  };

  const handleStatusChange = async (eventId, newStatus) => {
    try {
      // Call API directly for status update: PUT /Unitic/Event/status/{eventId}?status={status}
      // Lấy token từ localStorage hoặc cookies
      let token = localStorage.getItem('token');
      if (!token) {
        token = Cookies.get('ACCESS_TOKEN');
      }
      const response = await fetch(`https://localhost:7163/Unitic/Event/status/${eventId}?status=${newStatus}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        }
      });
      
      if (response.ok) {
        message.success('Cập nhật trạng thái thành công');
        // Refresh events list
        dispatch(fetchEvents());
      } else {
        throw new Error('API call failed');
      }
    } catch (error) {
      message.error('Lỗi khi cập nhật trạng thái: ' + error.message);
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
      dataIndex: 'cateID',
      key: 'cateID',
      render: (cateID) => {
        const category = categories?.find(cat => cat.cateID === cateID);
        return <Tag color="blue">{category?.name || cateID}</Tag>;
      },
      filters: categories?.map(cat => ({ text: cat.name, value: cat.cateID })),
      onFilter: (value, record) => record.cateID === value,
    },
    {
      title: 'Thời gian',
      dataIndex: 'date_Start',
      key: 'date_Start',
      render: (_, record) => (
        <div>
          <div>{new Date(record.date_Start).toLocaleDateString('vi-VN')}</div>
          <Text type="secondary">
            {new Date(record.date_Start).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })} - 
            {new Date(record.date_End).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
          </Text>
        </div>
      ),
      sorter: (a, b) => new Date(a.date_Start) - new Date(b.date_Start),
    },
    {
      title: 'Vé',
      key: 'tickets',
      render: (_, record) => (
        <div>
          <div>
            <Text strong>0</Text> {/* Sẽ cần cập nhật từ dữ liệu thực tế */}
            <Text type="secondary">/{record.slot}</Text>
          </div>
          <div style={{ fontSize: '12px', color: '#999' }}>
            0% {/* Sẽ cần cập nhật từ dữ liệu thực tế */}
          </div>
        </div>
      ),
    },
    {
      title: 'Giá vé',
      dataIndex: 'price',
      key: 'price',
      render: (value) => (
        <Text strong style={{ color: value > 0 ? '#52c41a' : '#999' }}>
          {value > 0 ? `${value.toLocaleString('vi-VN')} ₫` : 'Miễn phí'}
        </Text>
      ),
      sorter: (a, b) => a.price - b.price,
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status, record) => {
        const statusConfig = {
          1: { label: 'Riêng tư', color: 'default', icon: <ClockCircleOutlined /> },
          2: { label: 'Đã xuất bản', color: 'success', icon: <PlayCircleOutlined /> },
          3: { label: 'Đã hủy', color: 'error', icon: <StopOutlined /> },
          4: { label: 'Đang diễn ra', color: 'processing', icon: <PlayCircleOutlined /> },
          5: { label: 'Đã hoàn thành', color: 'default', icon: <CheckOutlined /> },
          6: { label: 'Hết vé', color: 'warning', icon: <StopOutlined /> }
        };
        const config = statusConfig[status] || statusConfig[1];
        // All possible status transitions
        const statusOptions = [
          { value: 1, label: 'Riêng tư', icon: <ClockCircleOutlined /> },
          { value: 2, label: 'Đã xuất bản', icon: <PlayCircleOutlined /> },
          { value: 3, label: 'Đã hủy', icon: <StopOutlined /> },
          { value: 4, label: 'Đang diễn ra', icon: <PlayCircleOutlined /> },
          { value: 5, label: 'Đã hoàn thành', icon: <CheckOutlined /> },
          { value: 6, label: 'Hết vé', icon: <StopOutlined /> },
        ];
        return (
          <Space>
            <Tag color={config.color} icon={config.icon}>
              {config.label}
            </Tag>
            <Select
              size="small"
              value={status}
              style={{ minWidth: 120 }}
              onChange={newStatus => handleStatusChange(record.eventID, newStatus)}
              dropdownMatchSelectWidth={false}
            >
              {statusOptions.map(opt => (
                <Select.Option key={opt.value} value={opt.value}>
                  <Space>
                    {opt.icon}
                    {opt.label}
                  </Space>
                </Select.Option>
              ))}
            </Select>
          </Space>
        );
      },
      filters: [
        { text: 'Riêng tư', value: 1 },
        { text: 'Đã xuất bản', value: 2 },
        { text: 'Đã hủy', value: 3 },
        { text: 'Đang diễn ra', value: 4 },
        { text: 'Đã hoàn thành', value: 5 },
        { text: 'Hết vé', value: 6 }
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
            onConfirm={() => handleDeleteEvent(record.eventID)}
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
                          (event.organizer && event.organizer.toLowerCase().includes(searchText.toLowerCase()));
    const matchesStatus = filterStatus === 'all' || event.status === parseInt(filterStatus);
    const matchesCategory = filterCategory === 'all' || event.cateID === filterCategory;
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const rowSelection = {
    selectedRowKeys,
    onChange: setSelectedRowKeys,
  };

  // Statistics
  const totalEvents = events.length;
  const publishedEvents = events.filter(e => e.status === 2).length; // Published
  const totalRevenue = events.reduce((sum, e) => sum + (e.revenue || 0), 0);
  const totalTicketsSold = events.reduce((sum, e) => sum + (e.ticketsSold || 0), 0);

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
            <Button 
              type="primary" 
              icon={<PlusOutlined />} 
              onClick={handleAddEvent} // Gọi hàm chuyển hướng tại đây
            >
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
                title="Đã xuất bản"
                value={publishedEvents}
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
              <Option value="1">Riêng tư</Option>
              <Option value="2">Đã xuất bản</Option>
              <Option value="3">Đã hủy</Option>
              <Option value="4">Đang diễn ra</Option>
              <Option value="5">Đã hoàn thành</Option>
              <Option value="6">Hết vé</Option>
            </Select>
            <Select
              value={filterCategory}
              onChange={setFilterCategory}
              style={{ width: 150 }}
              placeholder="Danh mục"
            >
              <Option value="all">Tất cả danh mục</Option>
              {categories?.map(cat => (
                <Option key={cat.cateID} value={cat.cateID}>{cat.name}</Option>
              ))}
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
            rowKey="eventID"
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

        {/* Add/Edit Modal (Giữ lại nếu bạn vẫn muốn chức năng chỉnh sửa tại chỗ) */}
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
                    {categories?.map(cat => (
                      <Option key={cat.cateID} value={cat.cateID}>
                        {cat.name}
                      </Option>
                    ))}
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
              <Col span={24}>
                <Form.Item
                  name="dateRange"
                  label="Thời gian"
                  rules={[{ required: true, message: 'Vui lòng chọn thời gian!' }]}
                >
                  <RangePicker 
                    style={{ width: '100%' }}
                    showTime={{ format: 'HH:mm' }}
                    format="YYYY-MM-DD HH:mm"
                    placeholder={['Từ ngày', 'Đến ngày']}
                  />
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
                    <Option value={1}>Riêng tư</Option>
                    <Option value={2}>Đã xuất bản</Option>
                    <Option value={3}>Đã hủy</Option>
                    <Option value={4}>Đang diễn ra</Option>
                    <Option value={5}>Đã hoàn thành</Option>
                    <Option value={6}>Hết vé</Option>
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