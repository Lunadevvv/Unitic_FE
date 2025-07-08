import { useState, useEffect } from 'react';
import {
  Card, Form, Input, Button, Upload, Avatar, Row, Col, Typography,
  Tabs, List, Tag, Statistic, DatePicker, Select, Switch, 
  message, Modal, Divider, Space, Badge, Alert
} from 'antd';
import {
  UserOutlined, EditOutlined, CameraOutlined, MailOutlined,
  PhoneOutlined, EnvironmentOutlined, CalendarOutlined,
  SecurityScanOutlined, BellOutlined, EyeOutlined,
  DeleteOutlined, SafetyOutlined, HeartOutlined,
  TrophyOutlined, GiftOutlined, CrownOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';
import '../../assets/scss/UserProfilePage.scss';

const { Title, Text, Paragraph } = Typography;
const { TabPane } = Tabs;
const { Option } = Select;

const UserProfilePage = () => {
  const [form] = Form.useForm();
  const [passwordForm] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(false);
  const [changePasswordVisible, setChangePasswordVisible] = useState(false);
  const [deleteAccountVisible, setDeleteAccountVisible] = useState(false);

  const [userProfile, setUserProfile] = useState({
    id: 'USR001',
    fullName: 'Nguyễn Văn A',
    email: 'user@example.com',
    phone: '0123456789',
    dateOfBirth: '1995-05-15',
    gender: 'male',
    address: '123 Đường ABC, Quận XYZ, TP. HCM',
    avatar: '/src/assets/img/demo.jpg',
    joinDate: '2023-01-15',
    membershipLevel: 'Premium',
    totalEvents: 15,
    totalSpent: 3500000,
    favoriteGenres: ['Âm nhạc', 'Công nghệ', 'Kinh doanh'],
    achievements: [
      { id: 1, name: 'Event Explorer', description: 'Tham dự 10 sự kiện', earned: true },
      { id: 2, name: 'Music Lover', description: 'Tham dự 5 sự kiện âm nhạc', earned: true },
      { id: 3, name: 'Early Bird', description: 'Đặt vé sớm 5 lần', earned: false }
    ],
    preferences: {
      emailNotifications: true,
      smsNotifications: false,
      eventRecommendations: true,
      promotionalEmails: true,
      darkMode: false
    }
  });

  const [stats] = useState({
    upcomingEvents: 3,
    completedEvents: 12,
    favoriteEvents: 8,
    totalSpent: 3500000
  });

  useEffect(() => {
    // Populate form with user data
    form.setFieldsValue({
      ...userProfile,
      dateOfBirth: userProfile.dateOfBirth ? dayjs(userProfile.dateOfBirth) : null
    });
  }, [userProfile, form]);

  const handleUpdateProfile = async (values) => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setUserProfile(prev => ({
        ...prev,
        ...values,
        dateOfBirth: values.dateOfBirth ? values.dateOfBirth.format('YYYY-MM-DD') : prev.dateOfBirth
      }));
      
      setEditing(false);
      message.success('Cập nhật thông tin thành công!');
    } catch {
      message.error('Cập nhật thất bại. Vui lòng thử lại!');
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async () => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      message.success('Đổi mật khẩu thành công!');
      setChangePasswordVisible(false);
      passwordForm.resetFields();
    } catch {
      message.error('Đổi mật khẩu thất bại. Vui lòng thử lại!');
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarUpload = (info) => {
    if (info.file.status === 'done') {
      setUserProfile(prev => ({
        ...prev,
        avatar: info.file.response.url
      }));
      message.success('Cập nhật ảnh đại diện thành công!');
    }
  };

  const handlePreferenceChange = (key, value) => {
    setUserProfile(prev => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        [key]: value
      }
    }));
  };

  const renderProfileHeader = () => (
    <Card className="profile-header-card">
      <Row gutter={[24, 24]} align="middle">
        <Col xs={24} sm={8} md={6}>
          <div className="avatar-section">
            <Badge count={userProfile.membershipLevel === 'Premium' ? <CrownOutlined style={{ color: '#faad14' }} /> : 0}>
              <Avatar size={120} src={userProfile.avatar} icon={<UserOutlined />} />
            </Badge>
            <Upload
              showUploadList={false}
              onChange={handleAvatarUpload}
              className="avatar-upload"
            >
              <Button type="text" icon={<CameraOutlined />} className="avatar-upload-btn">
                Đổi ảnh
              </Button>
            </Upload>
          </div>
        </Col>
        
        <Col xs={24} sm={16} md={18}>
          <div className="profile-info">
            <div className="profile-name">
              <Title level={2}>{userProfile.fullName}</Title>
              <Tag color="gold" className="membership-tag">
                {userProfile.membershipLevel} Member
              </Tag>
            </div>
            
            <Space direction="vertical" size="small" className="profile-details">
              <Text><MailOutlined /> {userProfile.email}</Text>
              <Text><PhoneOutlined /> {userProfile.phone}</Text>
              <Text><CalendarOutlined /> Tham gia từ {dayjs(userProfile.joinDate).format('DD/MM/YYYY')}</Text>
            </Space>

            <Row gutter={16} className="profile-stats">
              <Col span={6}>
                <Statistic title="Sự kiện tham gia" value={userProfile.totalEvents} />
              </Col>
              <Col span={6}>
                <Statistic 
                  title="Tổng chi tiêu" 
                  value={userProfile.totalSpent} 
                  formatter={(value) => `${value.toLocaleString('vi-VN')} ₫`}
                />
              </Col>
              <Col span={6}>
                <Statistic title="Sự kiện yêu thích" value={stats.favoriteEvents} />
              </Col>
              <Col span={6}>
                <Statistic title="Thành tựu" value={userProfile.achievements.filter(a => a.earned).length} />
              </Col>
            </Row>
          </div>
        </Col>
      </Row>
    </Card>
  );

  const renderPersonalInfo = () => (
    <Card 
      title="Thông tin cá nhân" 
      extra={
        <Button 
          type={editing ? 'default' : 'primary'} 
          icon={<EditOutlined />}
          onClick={() => setEditing(!editing)}
        >
          {editing ? 'Hủy' : 'Chỉnh sửa'}
        </Button>
      }
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleUpdateProfile}
        disabled={!editing}
      >
        <Row gutter={16}>
          <Col xs={24} sm={12}>
            <Form.Item name="fullName" label="Họ và tên" rules={[{ required: true }]}>
              <Input prefix={<UserOutlined />} />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12}>
            <Form.Item name="email" label="Email" rules={[{ required: true, type: 'email' }]}>
              <Input prefix={<MailOutlined />} />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col xs={24} sm={12}>
            <Form.Item name="phone" label="Số điện thoại">
              <Input prefix={<PhoneOutlined />} />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12}>
            <Form.Item name="dateOfBirth" label="Ngày sinh">
              <DatePicker style={{ width: '100%' }} format="DD/MM/YYYY" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col xs={24} sm={12}>
            <Form.Item name="gender" label="Giới tính">
              <Select>
                <Option value="male">Nam</Option>
                <Option value="female">Nữ</Option>
                <Option value="other">Khác</Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Form.Item name="address" label="Địa chỉ">
          <Input.TextArea rows={3} prefix={<EnvironmentOutlined />} />
        </Form.Item>

        {editing && (
          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit" loading={loading}>
                Lưu thay đổi
              </Button>
              <Button onClick={() => setEditing(false)}>
                Hủy
              </Button>
            </Space>
          </Form.Item>
        )}
      </Form>
    </Card>
  );

  const renderSecurity = () => (
    <Card title="Bảo mật" className="security-card">
      <List
        itemLayout="horizontal"
        dataSource={[
          {
            title: 'Mật khẩu',
            description: 'Cập nhật lần cuối: 30 ngày trước',
            action: (
              <Button onClick={() => setChangePasswordVisible(true)}>
                Đổi mật khẩu
              </Button>
            ),
            icon: <SecurityScanOutlined />
          },
          {
            title: 'Xác thực 2 lớp',
            description: 'Tăng cường bảo mật tài khoản',
            action: <Switch defaultChecked={false} />,
            icon: <SafetyOutlined />
          },
          {
            title: 'Phiên đăng nhập',
            description: 'Quản lý các thiết bị đã đăng nhập',
            action: <Button type="link">Xem chi tiết</Button>,
            icon: <EyeOutlined />
          }
        ]}
        renderItem={item => (
          <List.Item actions={[item.action]}>
            <List.Item.Meta
              avatar={item.icon}
              title={item.title}
              description={item.description}
            />
          </List.Item>
        )}
      />
      
      <Divider />
      
      <Alert
        message="Xóa tài khoản"
        description="Hành động này không thể hoàn tác. Tất cả dữ liệu sẽ bị xóa vĩnh viễn."
        type="warning"
        action={
          <Button danger onClick={() => setDeleteAccountVisible(true)}>
            Xóa tài khoản
          </Button>
        }
      />
    </Card>
  );

  const renderPreferences = () => (
    <Card title="Tùy chọn">
      <List
        itemLayout="horizontal"
        dataSource={[
          {
            title: 'Thông báo email',
            description: 'Nhận thông báo qua email',
            key: 'emailNotifications'
          },
          {
            title: 'Thông báo SMS',
            description: 'Nhận thông báo qua tin nhắn',
            key: 'smsNotifications'
          },
          {
            title: 'Đề xuất sự kiện',
            description: 'Nhận đề xuất sự kiện phù hợp',
            key: 'eventRecommendations'
          },
          {
            title: 'Email khuyến mãi',
            description: 'Nhận thông tin khuyến mãi',
            key: 'promotionalEmails'
          }
        ]}
        renderItem={item => (
          <List.Item
            actions={[
              <Switch
                key={item.key}
                checked={userProfile.preferences[item.key]}
                onChange={(checked) => handlePreferenceChange(item.key, checked)}
              />
            ]}
          >
            <List.Item.Meta
              avatar={<BellOutlined />}
              title={item.title}
              description={item.description}
            />
          </List.Item>
        )}
      />
    </Card>
  );

  const renderAchievements = () => (
    <Card title="Thành tựu">
      <Row gutter={[16, 16]}>
        {userProfile.achievements.map(achievement => (
          <Col xs={24} sm={12} md={8} key={achievement.id}>
            <Card 
              size="small" 
              className={`achievement-card ${achievement.earned ? 'earned' : 'locked'}`}
            >
              <div className="achievement-content">
                <TrophyOutlined className={`achievement-icon ${achievement.earned ? 'earned' : ''}`} />
                <Title level={5}>{achievement.name}</Title>
                <Text type="secondary">{achievement.description}</Text>
                {achievement.earned && (
                  <Tag color="success" className="earned-tag">Đã đạt</Tag>
                )}
              </div>
            </Card>
          </Col>
        ))}
      </Row>
    </Card>
  );

  return (
    <div className="user-profile-page">
      <div className="profile-container">
        {renderProfileHeader()}
        
        <Tabs defaultActiveKey="personal" className="profile-tabs">
          <TabPane tab="Thông tin cá nhân" key="personal">
            {renderPersonalInfo()}
          </TabPane>
          
          <TabPane tab="Bảo mật" key="security">
            {renderSecurity()}
          </TabPane>
          
          <TabPane tab="Tùy chọn" key="preferences">
            {renderPreferences()}
          </TabPane>
          
          <TabPane tab="Thành tựu" key="achievements">
            {renderAchievements()}
          </TabPane>
        </Tabs>
      </div>

      {/* Change Password Modal */}
      <Modal
        title="Đổi mật khẩu"
        open={changePasswordVisible}
        onCancel={() => setChangePasswordVisible(false)}
        footer={null}
      >
        <Form
          form={passwordForm}
          layout="vertical"
          onFinish={handleChangePassword}
        >
          <Form.Item
            name="currentPassword"
            label="Mật khẩu hiện tại"
            rules={[{ required: true, message: 'Vui lòng nhập mật khẩu hiện tại!' }]}
          >
            <Input.Password />
          </Form.Item>
          
          <Form.Item
            name="newPassword"
            label="Mật khẩu mới"
            rules={[
              { required: true, message: 'Vui lòng nhập mật khẩu mới!' },
              { min: 6, message: 'Mật khẩu phải có ít nhất 6 ký tự!' }
            ]}
          >
            <Input.Password />
          </Form.Item>
          
          <Form.Item
            name="confirmPassword"
            label="Xác nhận mật khẩu mới"
            dependencies={['newPassword']}
            rules={[
              { required: true, message: 'Vui lòng xác nhận mật khẩu!' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('newPassword') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('Mật khẩu xác nhận không khớp!'));
                },
              }),
            ]}
          >
            <Input.Password />
          </Form.Item>
          
          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit" loading={loading}>
                Đổi mật khẩu
              </Button>
              <Button onClick={() => setChangePasswordVisible(false)}>
                Hủy
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      {/* Delete Account Modal */}
      <Modal
        title="Xóa tài khoản"
        open={deleteAccountVisible}
        onCancel={() => setDeleteAccountVisible(false)}
        onOk={() => {
          message.error('Chức năng này chưa được triển khai');
          setDeleteAccountVisible(false);
        }}
        okText="Xóa tài khoản"
        cancelText="Hủy"
        okButtonProps={{ danger: true }}
      >
        <Alert
          message="Cảnh báo!"
          description="Bạn có chắc chắn muốn xóa tài khoản? Hành động này không thể hoàn tác và tất cả dữ liệu sẽ bị mất vĩnh viễn."
          type="error"
          showIcon
        />
      </Modal>
    </div>
  );
};

export default UserProfilePage;
