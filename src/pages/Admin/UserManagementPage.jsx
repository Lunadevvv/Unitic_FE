import { useState, useEffect } from 'react';
import {
  Table, Card, Button, Input, Select, Tag, Space, Modal, Form,
  Typography, Row, Col, Statistic, Avatar, Popconfirm, message,
  Drawer, Descriptions, Badge, DatePicker, Upload
} from 'antd';
import {
  UserOutlined, EditOutlined, DeleteOutlined, PlusOutlined,
  SearchOutlined, FilterOutlined, ExportOutlined, UploadOutlined,
  EyeOutlined, MailOutlined, PhoneOutlined, CalendarOutlined,
  CrownOutlined, UserAddOutlined
} from '@ant-design/icons';
import AdminLayout from '../../components/layout/AdminLayout';
import '../../assets/scss/UserManagementPage.scss';

const { Title, Text } = Typography;
const { Option } = Select;
const { RangePicker } = DatePicker;

// Mock data
const mockUsers = [
  {
    id: '1',
    name: 'Nguyễn Văn A',
    email: 'nguyenvana@example.com',
    phone: '0123456789',
    role: 'user',
    status: 'active',
    membershipLevel: 'Premium',
    joinDate: '2024-01-15',
    lastLogin: '2024-06-25 14:30',
    totalEvents: 15,
    totalSpent: 2500000,
    avatar: '/src/assets/img/demo.jpg'
  },
  {
    id: '2',
    name: 'Trần Thị B',
    email: 'tranthib@example.com',
    phone: '0987654321',
    role: 'user',
    status: 'inactive',
    membershipLevel: 'Basic',
    joinDate: '2024-02-20',
    lastLogin: '2024-06-20 09:15',
    totalEvents: 8,
    totalSpent: 1200000,
    avatar: '/src/assets/img/demo.jpg'
  },
  {
    id: '3',
    name: 'Lê Văn C',
    email: 'levanc@example.com',
    phone: '0456789123',
    role: 'moderator',
    status: 'active',
    membershipLevel: 'VIP',
    joinDate: '2023-12-10',
    lastLogin: '2024-06-26 16:45',
    totalEvents: 32,
    totalSpent: 5800000,
    avatar: '/src/assets/img/demo.jpg'
  },
  {
    id: '4',
    name: 'Phạm Thị D',
    email: 'phamthid@example.com',
    phone: '0789123456',
    role: 'admin',
    status: 'active',
    membershipLevel: 'Premium',
    joinDate: '2023-08-05',
    lastLogin: '2024-06-26 10:20',
    totalEvents: 5,
    totalSpent: 850000,
    avatar: '/src/assets/img/demo.jpg'
  }
];

const UserManagementPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterRole, setFilterRole] = useState('all');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isViewModalVisible, setIsViewModalVisible] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [viewingUser, setViewingUser] = useState(null);
  const [form] = Form.useForm();

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        setUsers(mockUsers);
      } catch {
        message.error('Lỗi khi tải danh sách người dùng');
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const handleAddUser = () => {
    setEditingUser(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleEditUser = (user) => {
    setEditingUser(user);
    form.setFieldsValue(user);
    setIsModalVisible(true);
  };

  const handleViewUser = (user) => {
    setViewingUser(user);
    setIsViewModalVisible(true);
  };

  const handleDeleteUser = async (userId) => {
    try {
      setUsers(users.filter(user => user.id !== userId));
      message.success('Xóa người dùng thành công');
    } catch {
      setUsers(users.filter(user => user.id !== userId));
      message.success('Xóa người dùng thành công');
    }
  };

  const handleSubmit = async (values) => {
    try {
      if (editingUser) {
        // Update user
        setUsers(users.map(user => 
          user.id === editingUser.id ? { ...user, ...values } : user
        ));
        message.success('Cập nhật người dùng thành công');
      } else {
        // Add new user
        const newUser = {
          id: Date.now().toString(),
          ...values,
          joinDate: new Date().toISOString().split('T')[0],
          lastLogin: 'Chưa đăng nhập',
          totalEvents: 0,
          totalSpent: 0
        };
        setUsers([...users, newUser]);
        message.success('Thêm người dùng thành công');
      }
      setIsModalVisible(false);
      form.resetFields();
    } catch {
      message.error('Lỗi khi lưu thông tin người dùng');
    }
  };

  const handleBulkDelete = () => {
    Modal.confirm({
      title: 'Xác nhận xóa',
      content: `Bạn có chắc chắn muốn xóa ${selectedRowKeys.length} người dùng đã chọn?`,
      onOk: () => {
        setUsers(users.filter(user => !selectedRowKeys.includes(user.id)));
        setSelectedRowKeys([]);
        message.success('Xóa người dùng thành công');
      }
    });
  };

  const columns = [
    {
      title: 'Người dùng',
      dataIndex: 'name',
      key: 'name',
      render: (text, record) => (
        <Space>
          <Avatar src={record.avatar} icon={<UserOutlined />} />
          <div>
            <div className="user-name">
              {text}
              {record.membershipLevel === 'VIP' && (
                <CrownOutlined style={{ color: '#faad14', marginLeft: 4 }} />
              )}
            </div>
            <Text type="secondary" className="user-email">{record.email}</Text>
          </div>
        </Space>
      ),
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: 'Vai trò',
      dataIndex: 'role',
      key: 'role',
      render: (role) => {
        const colors = {
          admin: 'red',
          moderator: 'orange',
          user: 'blue'
        };
        const labels = {
          admin: 'Quản trị viên',
          moderator: 'Kiểm duyệt viên',
          user: 'Người dùng'
        };
        return <Tag color={colors[role]}>{labels[role]}</Tag>;
      },
      filters: [
        { text: 'Quản trị viên', value: 'admin' },
        { text: 'Kiểm duyệt viên', value: 'moderator' },
        { text: 'Người dùng', value: 'user' }
      ],
      onFilter: (value, record) => record.role === value,
    },
    {
      title: 'Thành viên',
      dataIndex: 'membershipLevel',
      key: 'membershipLevel',
      render: (level) => {
        const colors = {
          VIP: 'gold',
          Premium: 'purple',
          Basic: 'default'
        };
        return <Tag color={colors[level]}>{level}</Tag>;
      },
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Badge 
          status={status === 'active' ? 'success' : 'default'} 
          text={status === 'active' ? 'Hoạt động' : 'Không hoạt động'} 
        />
      ),
      filters: [
        { text: 'Hoạt động', value: 'active' },
        { text: 'Không hoạt động', value: 'inactive' }
      ],
      onFilter: (value, record) => record.status === value,
    },
    {
      title: 'Ngày tham gia',
      dataIndex: 'joinDate',
      key: 'joinDate',
      render: (date) => new Date(date).toLocaleDateString('vi-VN'),
      sorter: (a, b) => new Date(a.joinDate) - new Date(b.joinDate),
    },
    {
      title: 'Đăng nhập cuối',
      dataIndex: 'lastLogin',
      key: 'lastLogin',
      render: (text) => <Text type="secondary">{text}</Text>
    },
    {
      title: 'Thao tác',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button 
            type="text" 
            icon={<EyeOutlined />} 
            onClick={() => handleViewUser(record)}
            title="Xem chi tiết"
          />
          <Button 
            type="text" 
            icon={<EditOutlined />} 
            onClick={() => handleEditUser(record)}
            title="Chỉnh sửa"
          />
          <Popconfirm
            title="Bạn có chắc chắn muốn xóa người dùng này?"
            onConfirm={() => handleDeleteUser(record.id)}
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

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchText.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchText.toLowerCase());
    const matchesStatus = filterStatus === 'all' || user.status === filterStatus;
    const matchesRole = filterRole === 'all' || user.role === filterRole;
    return matchesSearch && matchesStatus && matchesRole;
  });

  const rowSelection = {
    selectedRowKeys,
    onChange: setSelectedRowKeys,
  };

  const totalUsers = users.length;
  const activeUsers = users.filter(u => u.status === 'active').length;
  const premiumUsers = users.filter(u => u.membershipLevel === 'Premium' || u.membershipLevel === 'VIP').length;
  const newUsersThisMonth = users.filter(u => {
    const joinDate = new Date(u.joinDate);
    const now = new Date();
    return joinDate.getMonth() === now.getMonth() && joinDate.getFullYear() === now.getFullYear();
  }).length;

  return (
    <AdminLayout>
      <div className="user-management-page">
        {/* Header */}
        <div className="page-header">
          <div>
            <Title level={2}>Quản lý người dùng</Title>
            <Text type="secondary">Quản lý thông tin và quyền hạn người dùng</Text>
          </div>
          <Space>
            <Button icon={<ExportOutlined />}>Xuất Excel</Button>
            <Button icon={<UploadOutlined />}>Nhập Excel</Button>
            <Button type="primary" icon={<UserAddOutlined />} onClick={handleAddUser}>
              Thêm người dùng
            </Button>
          </Space>
        </div>

        {/* Stats */}
        <Row gutter={[24, 24]} className="stats-row">
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title="Tổng người dùng"
                value={totalUsers}
                prefix={<UserOutlined />}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title="Đang hoạt động"
                value={activeUsers}
                prefix={<UserOutlined />}
                valueStyle={{ color: '#52c41a' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title="Thành viên Premium"
                value={premiumUsers}
                prefix={<CrownOutlined />}
                valueStyle={{ color: '#faad14' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title="Mới tháng này"
                value={newUsersThisMonth}
                prefix={<CalendarOutlined />}
                valueStyle={{ color: '#1890ff' }}
              />
            </Card>
          </Col>
        </Row>

        {/* Filters */}
        <Card className="filter-card">
          <Space wrap>
            <Input
              placeholder="Tìm kiếm theo tên, email..."
              prefix={<SearchOutlined />}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              style={{ width: 250 }}
            />
            <Select
              value={filterStatus}
              onChange={setFilterStatus}
              style={{ width: 150 }}
              placeholder="Trạng thái"
            >
              <Option value="all">Tất cả trạng thái</Option>
              <Option value="active">Hoạt động</Option>
              <Option value="inactive">Không hoạt động</Option>
            </Select>
            <Select
              value={filterRole}
              onChange={setFilterRole}
              style={{ width: 150 }}
              placeholder="Vai trò"
            >
              <Option value="all">Tất cả vai trò</Option>
              <Option value="user">Người dùng</Option>
              <Option value="moderator">Kiểm duyệt viên</Option>
              <Option value="admin">Quản trị viên</Option>
            </Select>
            <RangePicker placeholder={['Từ ngày', 'Đến ngày']} />
            {selectedRowKeys.length > 0 && (
              <Button 
                danger 
                icon={<DeleteOutlined />}
                onClick={handleBulkDelete}
              >
                Xóa đã chọn ({selectedRowKeys.length})
              </Button>
            )}
          </Space>
        </Card>

        {/* Table */}
        <Card>
          <Table
            columns={columns}
            dataSource={filteredUsers}
            rowKey="id"
            loading={loading}
            rowSelection={rowSelection}
            pagination={{
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total, range) => 
                `${range[0]}-${range[1]} của ${total} người dùng`,
            }}
            scroll={{ x: 800 }}
          />
        </Card>

        {/* Add/Edit Modal */}
        <Modal
          title={editingUser ? 'Chỉnh sửa người dùng' : 'Thêm người dùng mới'}
          open={isModalVisible}
          onCancel={() => setIsModalVisible(false)}
          footer={null}
          width={600}
        >
          <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
          >
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="name"
                  label="Họ và tên"
                  rules={[{ required: true, message: 'Vui lòng nhập họ tên!' }]}
                >
                  <Input />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="email"
                  label="Email"
                  rules={[
                    { required: true, message: 'Vui lòng nhập email!' },
                    { type: 'email', message: 'Email không hợp lệ!' }
                  ]}
                >
                  <Input />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="phone"
                  label="Số điện thoại"
                  rules={[{ required: true, message: 'Vui lòng nhập số điện thoại!' }]}
                >
                  <Input />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="role"
                  label="Vai trò"
                  rules={[{ required: true, message: 'Vui lòng chọn vai trò!' }]}
                >
                  <Select>
                    <Option value="user">Người dùng</Option>
                    <Option value="moderator">Kiểm duyệt viên</Option>
                    <Option value="admin">Quản trị viên</Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="status"
                  label="Trạng thái"
                  rules={[{ required: true, message: 'Vui lòng chọn trạng thái!' }]}
                >
                  <Select>
                    <Option value="active">Hoạt động</Option>
                    <Option value="inactive">Không hoạt động</Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="membershipLevel"
                  label="Cấp độ thành viên"
                  rules={[{ required: true, message: 'Vui lòng chọn cấp độ!' }]}
                >
                  <Select>
                    <Option value="Basic">Basic</Option>
                    <Option value="Premium">Premium</Option>
                    <Option value="VIP">VIP</Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>

            <Form.Item>
              <Space>
                <Button type="primary" htmlType="submit">
                  {editingUser ? 'Cập nhật' : 'Thêm mới'}
                </Button>
                <Button onClick={() => setIsModalVisible(false)}>
                  Hủy
                </Button>
              </Space>
            </Form.Item>
          </Form>
        </Modal>

        {/* View User Modal */}
        <Modal
          title="Thông tin chi tiết người dùng"
          open={isViewModalVisible}
          onCancel={() => setIsViewModalVisible(false)}
          footer={[
            <Button key="close" onClick={() => setIsViewModalVisible(false)}>
              Đóng
            </Button>,
            <Button key="edit" type="primary" onClick={() => {
              setIsViewModalVisible(false);
              handleEditUser(viewingUser);
            }}>
              Chỉnh sửa
            </Button>
          ]}
          width={700}
        >
          {viewingUser && (
            <Descriptions bordered column={2}>
              <Descriptions.Item label="Avatar" span={2}>
                <Avatar size={64} src={viewingUser.avatar} icon={<UserOutlined />} />
              </Descriptions.Item>
              <Descriptions.Item label="Họ và tên">{viewingUser.name}</Descriptions.Item>
              <Descriptions.Item label="Email">{viewingUser.email}</Descriptions.Item>
              <Descriptions.Item label="Số điện thoại">{viewingUser.phone}</Descriptions.Item>
              <Descriptions.Item label="Vai trò">
                <Tag color={viewingUser.role === 'admin' ? 'red' : viewingUser.role === 'moderator' ? 'orange' : 'blue'}>
                  {viewingUser.role === 'admin' ? 'Quản trị viên' : 
                   viewingUser.role === 'moderator' ? 'Kiểm duyệt viên' : 'Người dùng'}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Trạng thái">
                <Badge 
                  status={viewingUser.status === 'active' ? 'success' : 'default'} 
                  text={viewingUser.status === 'active' ? 'Hoạt động' : 'Không hoạt động'} 
                />
              </Descriptions.Item>
              <Descriptions.Item label="Cấp độ thành viên">
                <Tag color={viewingUser.membershipLevel === 'VIP' ? 'gold' : 
                           viewingUser.membershipLevel === 'Premium' ? 'purple' : 'default'}>
                  {viewingUser.membershipLevel}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Ngày tham gia">
                {new Date(viewingUser.joinDate).toLocaleDateString('vi-VN')}
              </Descriptions.Item>
              <Descriptions.Item label="Đăng nhập cuối">{viewingUser.lastLogin}</Descriptions.Item>
              <Descriptions.Item label="Tổng sự kiện tham gia">{viewingUser.totalEvents}</Descriptions.Item>
              <Descriptions.Item label="Tổng chi tiêu">
                {viewingUser.totalSpent.toLocaleString('vi-VN')} ₫
              </Descriptions.Item>
            </Descriptions>
          )}
        </Modal>
      </div>
    </AdminLayout>
  );
};

export default UserManagementPage;
