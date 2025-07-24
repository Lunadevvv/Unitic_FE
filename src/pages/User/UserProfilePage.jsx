import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  Card, Form, Input, Button, Upload, Avatar, Row, Col, Typography,
  Tabs, List, Tag, Statistic, DatePicker, Select, Switch, 
  message, Modal, Divider, Space, Badge, Alert, Spin
} from 'antd';
import {
  UserOutlined, EditOutlined, CameraOutlined, MailOutlined,
  PhoneOutlined, EnvironmentOutlined, CalendarOutlined,
  SecurityScanOutlined, BellOutlined, EyeOutlined,
  DeleteOutlined, SafetyOutlined, HeartOutlined,
  TrophyOutlined, GiftOutlined, CrownOutlined, WalletOutlined,
  PlusOutlined
} from '@ant-design/icons';
import { fetchUserProfile } from '../../store/actions/userActions';
import { fetchUniversities } from '../../store/actions/universityActions';
import { useAuth } from '../../hooks/useAuth';
import { useProfile } from '../../hooks/useProfile';
import { usePaymentStatus } from '../../hooks/usePaymentStatus';
import BASE_URL from '../../services/api';
import MainLayout from '../../components/layout/MainLayout';
import '../../assets/scss/UserProfilePage.scss';

const { Title, Text, Paragraph } = Typography;
const { TabPane } = Tabs;
const { Option } = Select;

const UserProfilePage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { profile } = useSelector(state => state.user);
  const { universities } = useSelector(state => state.university);
  const { isAuthenticated } = useAuth();
  const { updateProfile, updateLoading } = useProfile();
  const { isPolling, paymentResult, startPolling, stopPolling } = usePaymentStatus();
  const [form] = Form.useForm();
  const [passwordForm] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(false);
  const [changePasswordVisible, setChangePasswordVisible] = useState(false);
  const [deleteAccountVisible, setDeleteAccountVisible] = useState(false);
  const [topUpModalVisible, setTopUpModalVisible] = useState(false);
  const [topUpForm] = Form.useForm();

  const [userProfile, setUserProfile] = useState({
    id: '',
    firstName: '',
    lastName: '',
    mssv: '',
    wallet: 0,
    university: null,
    achievements: [] // Add default achievements array
  });


  // Poll payment status every 10s (like wallet page)
  useEffect(() => {
    let intervalId;
    // Only poll if user is authenticated
    if (isAuthenticated) {
      intervalId = setInterval(async () => {
        try {
          const token = localStorage.getItem('token');
          const user = JSON.parse(localStorage.getItem('user') || '{}');
          const userId = user?.id || profile?.id;
          if (!userId) return;
          const response = await BASE_URL.get(`/Unitic/Payment/allUserPayment/${userId}`, {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          if (response.data && Array.isArray(response.data)) {
            // If any payment has status 'success' or 1 (tuỳ backend), reload profile
            const hasPaid = response.data.some(p => p.status === 1 || p.status === 'success');
            if (hasPaid) {
              dispatch(fetchUserProfile());
            }
          }
        } catch (err) {
          // ignore
        }
      }, 10000);
    }
    return () => intervalId && clearInterval(intervalId);
  }, [isAuthenticated, profile, dispatch]);

  // Reload profile khi payment thành công (vẫn giữ logic cũ)
  useEffect(() => {
    if (paymentResult && paymentResult.success) {
      dispatch(fetchUserProfile());
    }
  }, [paymentResult, dispatch]);

  // Check authentication on mount
  useEffect(() => {
    if (!isAuthenticated) {
      message.error('Vui lòng đăng nhập để xem trang này');
      navigate('/signin');
      return;
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    // Fetch user profile and universities on mount
    dispatch(fetchUserProfile());
    dispatch(fetchUniversities());
  }, [dispatch]);

  useEffect(() => {
    // Update local state when profile is loaded
    if (profile) {
      setUserProfile({
        ...profile,
        achievements: profile.achievements || [] // Ensure achievements is always an array
      });
      form.setFieldsValue({
        firstName: profile.firstName,
        lastName: profile.lastName,
        mssv: profile.mssv,
        universityid: profile.university?.id
      });
    }
  }, [profile, form]);

  const handleUpdateProfile = async (values) => {
    try {
      const profileData = {
        firstName: values.firstName,
        lastName: values.lastName,
        mssv: values.mssv,
        universityId: values.universityid,
      };
      
      const result = await updateProfile(profileData);
      
      if (result.success) {
        setEditing(false);
        message.success('Cập nhật thông tin thành công!');
      } else {
        message.error(result.error || 'Cập nhật thất bại. Vui lòng thử lại!');
      }
    } catch (error) {
      message.error(error.message || 'Cập nhật thất bại. Vui lòng thử lại!');
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

  const handleTopUp = async (values) => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const { amount, description } = values;
      
      // Gọi API VNPay để tạo link thanh toán
      const response = await BASE_URL.get(`/Unitic/Payment/vnpay-request`, {
        params: {
          money: amount,
          description: description || 'naptien'
        },
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.data) {
        // Extract payment ID từ response hoặc generate một cái
        // Giả sử response.data là URL VNPay, ta cần extract payment ID
        const urlParams = new URLSearchParams(response.data.split('?')[1]);
        const paymentId = urlParams.get('vnp_TxnRef'); // VNPay trả về payment ID trong vnp_TxnRef
        
        // Mở link VNPay trong tab mới
        window.open(response.data, '_blank');
        
        // Bắt đầu polling để kiểm tra trạng thái thanh toán
        if (paymentId) {
          startPolling(paymentId);
          message.info('Đang chuyển đến trang thanh toán VNPay. Hệ thống sẽ tự động cập nhật khi thanh toán hoàn tất.');
        }
        
        setTopUpModalVisible(false);
        topUpForm.resetFields();
      }
    } catch (error) {
      console.error('Error calling VNPay API:', error);
      message.error('Không thể tạo link thanh toán. Vui lòng thử lại!');
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
            <Avatar size={120} icon={<UserOutlined />} />
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
              <Title level={2}>{userProfile.firstName} {userProfile.lastName}</Title>
              <Tag color="blue" className="membership-tag">
                MSSV: {userProfile.mssv}
              </Tag>
            </div>
            
            <Space direction="vertical" size="small" className="profile-details">
              <Text><EnvironmentOutlined /> {userProfile.university?.name}</Text>
              <Text><GiftOutlined /> Số dư ví: {userProfile.wallet?.toLocaleString('vi-VN') || 0} ₫</Text>
            </Space>

            <Row gutter={16} className="profile-stats">
              <Col span={12}>
                <Statistic 
                  title="Số dư ví" 
                  value={userProfile.wallet || 0} 
                  formatter={(value) => `${value.toLocaleString('vi-VN')} ₫`}
                />
              </Col>
              <Col span={12}>
                <Statistic title="Trường đại học" value={userProfile.university?.name || 'Chưa cập nhật'} />
              </Col>
            </Row>

            <div style={{ marginTop: 16 }}>
              <Button 
                type="primary" 
                icon={<PlusOutlined />}
                onClick={() => setTopUpModalVisible(true)}
                style={{ marginRight: 8 }}
                disabled={isPolling}
              >
                {isPolling ? 'Đang kiểm tra thanh toán...' : 'Nạp tiền'}
              </Button>
              <Button 
                icon={<WalletOutlined />}
                onClick={() => navigate('/wallet')}
              >
                Xem lịch sử
              </Button>
              {isPolling && (
                <div style={{ marginTop: 8, fontSize: '12px', color: '#1890ff' }}>
                  <Spin size="small" style={{ marginRight: 4 }} />
                  Đang chờ xác nhận thanh toán từ VNPay...
                  <Button 
                    type="link" 
                    size="small" 
                    onClick={stopPolling}
                    style={{ padding: 0, marginLeft: 8 }}
                  >
                    Hủy
                  </Button>
                </div>
              )}
            </div>
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
            <Form.Item name="firstName" label="Tên" rules={[{ required: true }]}>
              <Input prefix={<UserOutlined />} />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12}>
            <Form.Item name="lastName" label="Họ" rules={[{ required: true }]}>
              <Input prefix={<UserOutlined />} />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col xs={24} sm={12}>
            <Form.Item name="mssv" label="Mã số sinh viên" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12}>
            <Form.Item name="universityid" label="Trường đại học" rules={[{ required: true }]}>
              <Select placeholder="Chọn trường đại học" showSearch>
                {universities?.map((university) => (
                  <Option key={university.id} value={university.id}>
                    {university.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>

        {editing && (
          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit" loading={updateLoading}>
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
        {(userProfile.achievements || []).map(achievement => (
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

  // Show loading while checking authentication or fetching data
  if (!isAuthenticated || !userProfile.id) {
    return (
      <MainLayout>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
          <Spin size="large" />
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div
        style={{
          minHeight: '100vh',
          background: 'linear-gradient(67deg, #9c88ff, #74b9ff)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '40px 0',
        }}
      >
        <div
          style={{
            background: '#fff',
            borderRadius: 16,
            boxShadow: '0 8px 32px rgba(116,185,255,0.15)',
            padding: 32,
            minWidth: 350,
            maxWidth: 600,
            width: '100%',
            margin: '0 16px',
          }}
        >
          <div style={{ marginBottom: 32 }}>
            {renderProfileHeader()}
          </div>
          <Tabs
            defaultActiveKey="personal"
            className="profile-tabs"
            centered
            tabBarStyle={{ color: '#9c88ff' }}
          >
            <TabPane tab={<span style={{ color: '#9c88ff' }}>Thông tin cá nhân</span>} key="personal">
              {renderPersonalInfo()}
            </TabPane>
            <TabPane tab={<span style={{ color: '#9c88ff' }}>Bảo mật</span>} key="security">
              {renderSecurity()}
            </TabPane>
            <TabPane tab={<span style={{ color: '#9c88ff' }}>Tùy chọn</span>} key="preferences">
              {renderPreferences()}
            </TabPane>
            <TabPane tab={<span style={{ color: '#9c88ff' }}>Thành tựu</span>} key="achievements">
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

        {/* Top Up Modal */}
        <Modal
          title={
            <span>
              <PlusOutlined style={{ marginRight: 8 }} />
              Nạp tiền vào ví
            </span>
          }
          open={topUpModalVisible}
          onCancel={() => setTopUpModalVisible(false)}
          footer={null}
          width={500}
        >
          <Form
            form={topUpForm}
            layout="vertical"
            onFinish={handleTopUp}
          >
            <Form.Item
              name="amount"
              label="Số tiền nạp"
              rules={[
                { required: true, message: 'Vui lòng nhập số tiền!' },
                { pattern: /^\d+$/, message: 'Số tiền phải là số nguyên!' },
                {
                  validator: (_, value) => {
                    if (!value || parseInt(value) >= 10000) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error('Số tiền tối thiểu 10.000 VNĐ!'));
                  }
                }
              ]}
            >
              <Input
                size="large"
                placeholder="Nhập số tiền (tối thiểu 10.000 VNĐ)"
                suffix="VNĐ"
                style={{ fontSize: '16px' }}
              />
            </Form.Item>
            <Form.Item
              name="description"
              label="Mô tả giao dịch (tùy chọn)"
            >
              <Input
                size="large"
                placeholder="Ví dụ: Nạp tiền mua vé sự kiện"
                defaultValue="naptien"
              />
            </Form.Item>
            <Alert
              message="Thông tin thanh toán"
              description="Bạn sẽ được chuyển đến trang thanh toán VNPay để hoàn tất giao dịch."
              type="info"
              showIcon
              style={{ marginBottom: 16 }}
            />
            <Divider />
            <Form.Item style={{ marginBottom: 0 }}>
              <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
                <Button onClick={() => setTopUpModalVisible(false)}>
                  Hủy
                </Button>
                <Button type="primary" htmlType="submit" loading={loading}>
                  Thanh toán qua VNPay
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
    </MainLayout>
  );
};

export default UserProfilePage;
