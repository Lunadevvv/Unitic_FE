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
import useAccounts from '../../hooks/useAccounts';
import { getUserDisplayName, getRoleDisplayName } from '../../utils/userUtils';
import { ROLES, ROLE_NAMES } from '../../utils/rolePermissions';
import '../../assets/scss/UserManagementPage.scss';

const { Title, Text } = Typography;
const { Option } = Select;
const { RangePicker } = DatePicker;

const UserManagementPage = () => {
  // Redux state
  const {
    accounts,
    accountsLoading,
    accountsError,
    universities,
    loadAccounts,
    loadUniversities
  } = useAccounts();

  // Local state
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
    loadAccounts();
    loadUniversities();
  }, []);

  // Show error if there's any
  useEffect(() => {
    if (accountsError) {
      message.error(`Lỗi khi tải dữ liệu: ${accountsError}`);
    }
  }, [accountsError]);

  // Filter accounts based on search and filters
  const filteredAccounts = accounts.filter(account => {
    const matchesSearch = !searchText || 
      getUserDisplayName(account).toLowerCase().includes(searchText.toLowerCase()) ||
      account.email.toLowerCase().includes(searchText.toLowerCase());
    
    const matchesStatus = filterStatus === 'all' || 
      (filterStatus === 'active' && account.status !== 'inactive') ||
      (filterStatus === 'inactive' && account.status === 'inactive');
    
    const matchesRole = filterRole === 'all' || account.role.toString() === filterRole;
    
    return matchesSearch && matchesStatus && matchesRole;
  });

  const handleAddUser = () => {
    setEditingUser(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleEditUser = (user) => {
    setEditingUser(user);
    form.setFieldsValue({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      mssv: user.mssv,
      role: user.role,
      universityName: user.university?.name
    });
    setIsModalVisible(true);
  };

  const handleViewUser = (user) => {
    setViewingUser(user);
    setIsViewModalVisible(true);
  };

  const handleDeleteUser = async (userId) => {
    try {
      // TODO: Implement actual delete API call with userId
      console.log('Deleting user:', userId);
      message.success('Xóa người dùng thành công');
      loadAccounts(); // Reload data
    } catch {
      message.error('Lỗi khi xóa người dùng');
    }
  };

  const handleSubmit = async (values) => {
    try {
      if (editingUser) {
        // TODO: Implement update API call with values
        console.log('Updating user:', editingUser.id, values);
        message.success('Cập nhật người dùng thành công');
      } else {
        // TODO: Implement create API call with values
        console.log('Creating user:', values);
        message.success('Thêm người dùng thành công');
      }
      setIsModalVisible(false);
      form.resetFields();
      loadAccounts(); // Reload data
    } catch {
      message.error('Lỗi khi lưu thông tin người dùng');
    }
  };

  const handleBulkDelete = () => {
    Modal.confirm({
      title: 'Xác nhận xóa',
      content: `Bạn có chắc chắn muốn xóa ${selectedRowKeys.length} người dùng đã chọn?`,
      onOk: () => {
        // TODO: Implement bulk delete API call
        setSelectedRowKeys([]);
        message.success('Xóa người dùng thành công');
        loadAccounts(); // Reload data
      }
    });
  };

  const columns = [
    {
      title: 'Người dùng',
      dataIndex: 'firstName',
      key: 'user',
      render: (text, record) => (
        <Space>
          <Avatar icon={<UserOutlined />} />
          <div>
            <div className="user-name">
              {getUserDisplayName(record)}
              {record.role === 1 && (
                <CrownOutlined style={{ color: '#faad14', marginLeft: 4 }} />
              )}
            </div>
            <Text type="secondary" className="user-email">{record.email}</Text>
          </div>
        </Space>
      ),
      sorter: (a, b) => getUserDisplayName(a).localeCompare(getUserDisplayName(b)),
    },
    {
      title: 'Vai trò',
      dataIndex: 'role',
      key: 'role',
      render: (role) => {
        const colors = {
          1: 'red',
          2: 'orange', 
          3: 'green',
          4: 'blue',
          5: 'default'
        };
        return <Tag color={colors[role]}>{getRoleDisplayName(role)}</Tag>;
      },
      filters: [
        { text: ROLE_NAMES[ROLES.ADMIN], value: ROLES.ADMIN.toString() },
        { text: ROLE_NAMES[ROLES.MODERATOR], value: ROLES.MODERATOR.toString() },
        { text: ROLE_NAMES[ROLES.ORGANIZER], value: ROLES.ORGANIZER.toString() },
        { text: ROLE_NAMES[ROLES.STAFF], value: ROLES.STAFF.toString() },
        { text: ROLE_NAMES[ROLES.USER], value: ROLES.USER.toString() }
      ],
      onFilter: (value, record) => record.role.toString() === value,
    },
    {
      title: 'Trường học',
      dataIndex: 'university',
      key: 'university',
      render: (university) => university?.name || 'N/A',
    },
    {
      title: 'MSSV',
      dataIndex: 'mssv',
      key: 'mssv',
      render: (mssv) => mssv || 'N/A',
    },
    {
      title: 'Ví tiền',
      dataIndex: 'wallet',
      key: 'wallet',
      render: (wallet) => `${wallet?.toLocaleString() || 0} VNĐ`,
      sorter: (a, b) => (a.wallet || 0) - (b.wallet || 0),
    },
    {
      title: 'Thao tác',
      key: 'actions',
      fixed: 'right',
      width: 150,
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
            okText="Có"
            cancelText="Không"
          >
            <Button
              type="text"
              danger
              icon={<DeleteOutlined />}
              title="Xóa"
            />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const rowSelection = {
    selectedRowKeys,
    onChange: setSelectedRowKeys,
  };

  // Statistics based on accounts data
  const totalUsers = accounts.length;
  const activeUsers = accounts.filter(u => u.role !== 0).length; // Assuming role 0 is inactive
  const adminUsers = accounts.filter(u => u.role === 1).length; // Assuming role 1 is admin
  const userAccounts = accounts.filter(u => u.role === 5).length; // Assuming role 5 is regular user

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
                title="Admin Users"
                value={adminUsers}
                prefix={<CrownOutlined />}
                valueStyle={{ color: '#faad14' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title="Regular Users"
                value={userAccounts}
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
              <Option value={ROLES.ADMIN.toString()}>{ROLE_NAMES[ROLES.ADMIN]}</Option>
              <Option value={ROLES.MODERATOR.toString()}>{ROLE_NAMES[ROLES.MODERATOR]}</Option>
              <Option value={ROLES.ORGANIZER.toString()}>{ROLE_NAMES[ROLES.ORGANIZER]}</Option>
              <Option value={ROLES.STAFF.toString()}>{ROLE_NAMES[ROLES.STAFF]}</Option>
              <Option value={ROLES.USER.toString()}>{ROLE_NAMES[ROLES.USER]}</Option>
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
            dataSource={filteredAccounts}
            rowKey="id"
            loading={accountsLoading}
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
                  name="firstName"
                  label="Tên"
                  rules={[{ required: true, message: 'Vui lòng nhập tên!' }]}
                >
                  <Input />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="lastName"
                  label="Họ"
                  rules={[{ required: true, message: 'Vui lòng nhập họ!' }]}
                >
                  <Input />
                </Form.Item>
              </Col>
            </Row>
            
            <Row gutter={16}>
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
              <Col span={12}>
                <Form.Item
                  name="mssv"
                  label="MSSV"
                >
                  <Input placeholder="Mã số sinh viên (nếu có)" />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="universityName"
                  label="Trường học"
                  rules={[{ required: true, message: 'Vui lòng chọn trường!' }]}
                >
                  <Select
                    showSearch
                    placeholder="Chọn trường học"
                    optionFilterProp="children"
                  >
                    {universities.map(uni => (
                      <Option key={uni.id} value={uni.name}>{uni.name}</Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="role"
                  label="Vai trò"
                  rules={[{ required: true, message: 'Vui lòng chọn vai trò!' }]}
                >
                  <Select>
                    <Option value={ROLES.ADMIN}>{ROLE_NAMES[ROLES.ADMIN]}</Option>
                    <Option value={ROLES.MODERATOR}>{ROLE_NAMES[ROLES.MODERATOR]}</Option>
                    <Option value={ROLES.ORGANIZER}>{ROLE_NAMES[ROLES.ORGANIZER]}</Option>
                    <Option value={ROLES.STAFF}>{ROLE_NAMES[ROLES.STAFF]}</Option>
                    <Option value={ROLES.USER}>{ROLE_NAMES[ROLES.USER]}</Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>

            {!editingUser && (
              <Form.Item
                name="password"
                label="Mật khẩu"
                rules={[
                  { required: true, message: 'Vui lòng nhập mật khẩu!' },
                  { min: 6, message: 'Mật khẩu phải có ít nhất 6 ký tự!' }
                ]}
              >
                <Input.Password />
              </Form.Item>
            )}

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
                <Avatar size={64} icon={<UserOutlined />} />
              </Descriptions.Item>
              <Descriptions.Item label="Họ và tên">{getUserDisplayName(viewingUser)}</Descriptions.Item>
              <Descriptions.Item label="Email">{viewingUser.email}</Descriptions.Item>
              <Descriptions.Item label="MSSV">{viewingUser.mssv || 'N/A'}</Descriptions.Item>
              <Descriptions.Item label="Vai trò">
                <Tag color={viewingUser.role === 1 ? 'red' : viewingUser.role === 2 ? 'orange' : 'blue'}>
                  {getRoleDisplayName(viewingUser.role)}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Trường học">
                {viewingUser.university?.name || 'N/A'}
              </Descriptions.Item>
              <Descriptions.Item label="Ví tiền">
                {(viewingUser.wallet || 0).toLocaleString('vi-VN')} ₫
              </Descriptions.Item>
            </Descriptions>
          )}
        </Modal>
      </div>
    </AdminLayout>
  );
};

export default UserManagementPage;
