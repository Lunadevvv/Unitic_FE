import { useState } from 'react';
import {
  Card, Switch, Select, Button, Divider, Typography, Row, Col,
  Space, Alert, Modal, message, List, Tag
} from 'antd';
import {
  MoonOutlined, SunOutlined, GlobalOutlined, BellOutlined,
  SafetyOutlined, DeleteOutlined, ExclamationCircleOutlined,
  SettingOutlined, NotificationOutlined, DatabaseOutlined
} from '@ant-design/icons';
import MainLayout from '../components/layout/MainLayout';
import '../assets/scss/SettingsPage.scss';

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;

const SettingsPage = () => {
  const [settings, setSettings] = useState({
    theme: 'light',
    language: 'vi',
    notifications: {
      email: true,
      push: true,
      sms: false,
      marketing: true
    },
    privacy: {
      profileVisible: true,
      showActivity: false,
      dataSharing: false
    }
  });

  const [deleteAccountVisible, setDeleteAccountVisible] = useState(false);
  const [exportDataVisible, setExportDataVisible] = useState(false);

  const handleSettingChange = (category, key, value) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [key]: value
      }
    }));
    message.success('Cài đặt đã được cập nhật');
  };

  const handleSimpleSettingChange = (key, value) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
    message.success('Cài đặt đã được cập nhật');
  };

  const handleExportData = () => {
    message.success('Đã gửi yêu cầu xuất dữ liệu. Bạn sẽ nhận được email trong vòng 24 giờ.');
    setExportDataVisible(false);
  };

  const handleDeleteAccount = () => {
    message.error('Chức năng này chưa được triển khai');
    setDeleteAccountVisible(false);
  };

  const themeOptions = [
    { value: 'light', label: 'Sáng', icon: <SunOutlined /> },
    { value: 'dark', label: 'Tối', icon: <MoonOutlined /> },
    { value: 'auto', label: 'Tự động', icon: <SettingOutlined /> }
  ];

  const languageOptions = [
    { value: 'vi', label: 'Tiếng Việt' },
    { value: 'en', label: 'English' }
  ];

  return (
    <MainLayout>
      <div className="settings-page">
        <div className="settings-container">
          <div className="settings-header">
            <Title level={2}>
              <SettingOutlined /> Cài đặt
            </Title>
            <Paragraph>
              Tùy chỉnh trải nghiệm sử dụng UniTic theo ý muốn của bạn
            </Paragraph>
          </div>

          <Row gutter={[24, 24]}>
            {/* General Settings */}
            <Col xs={24} lg={12}>
              <Card title="Cài đặt chung" className="settings-card">
                <div className="setting-item">
                  <div className="setting-info">
                    <Text strong>Giao diện</Text>
                    <Text type="secondary">Chọn chủ đề hiển thị</Text>
                  </div>
                  <Select
                    value={settings.theme}
                    onChange={(value) => handleSimpleSettingChange('theme', value)}
                    style={{ width: 120 }}
                  >
                    {themeOptions.map(option => (
                      <Option key={option.value} value={option.value}>
                        {option.icon} {option.label}
                      </Option>
                    ))}
                  </Select>
                </div>

                <Divider />

                <div className="setting-item">
                  <div className="setting-info">
                    <Text strong>Ngôn ngữ</Text>
                    <Text type="secondary">Chọn ngôn ngữ hiển thị</Text>
                  </div>
                  <Select
                    value={settings.language}
                    onChange={(value) => handleSimpleSettingChange('language', value)}
                    style={{ width: 120 }}
                  >
                    {languageOptions.map(option => (
                      <Option key={option.value} value={option.value}>
                        <GlobalOutlined /> {option.label}
                      </Option>
                    ))}
                  </Select>
                </div>
              </Card>

              {/* Privacy Settings */}
              <Card title="Quyền riêng tư" className="settings-card">
                <List
                  dataSource={[
                    {
                      title: 'Hiển thị hồ sơ công khai',
                      description: 'Cho phép người khác xem thông tin cơ bản của bạn',
                      key: 'profileVisible'
                    },
                    {
                      title: 'Hiển thị hoạt động',
                      description: 'Cho phép người khác xem các sự kiện bạn tham gia',
                      key: 'showActivity'
                    },
                    {
                      title: 'Chia sẻ dữ liệu',
                      description: 'Chia sẻ dữ liệu ẩn danh để cải thiện dịch vụ',
                      key: 'dataSharing'
                    }
                  ]}
                  renderItem={item => (
                    <List.Item
                      actions={[
                        <Switch
                          key={item.key}
                          checked={settings.privacy[item.key]}
                          onChange={(checked) => handleSettingChange('privacy', item.key, checked)}
                        />
                      ]}
                    >
                      <List.Item.Meta
                        avatar={<SafetyOutlined />}
                        title={item.title}
                        description={item.description}
                      />
                    </List.Item>
                  )}
                />
              </Card>
            </Col>

            {/* Notification Settings */}
            <Col xs={24} lg={12}>
              <Card title="Thông báo" className="settings-card">
                <List
                  dataSource={[
                    {
                      title: 'Thông báo email',
                      description: 'Nhận thông báo qua email',
                      key: 'email'
                    },
                    {
                      title: 'Thông báo đẩy',
                      description: 'Nhận thông báo trên trình duyệt',
                      key: 'push'
                    },
                    {
                      title: 'Thông báo SMS',
                      description: 'Nhận thông báo qua tin nhắn',
                      key: 'sms'
                    },
                    {
                      title: 'Email marketing',
                      description: 'Nhận thông tin khuyến mãi và sự kiện mới',
                      key: 'marketing'
                    }
                  ]}
                  renderItem={item => (
                    <List.Item
                      actions={[
                        <Switch
                          key={item.key}
                          checked={settings.notifications[item.key]}
                          onChange={(checked) => handleSettingChange('notifications', item.key, checked)}
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

              {/* Data Management */}
              <Card title="Quản lý dữ liệu" className="settings-card">
                <Space direction="vertical" size="large" style={{ width: '100%' }}>
                  <div className="data-item">
                    <div className="data-info">
                      <Text strong>Xuất dữ liệu</Text>
                      <Text type="secondary" className="data-description">
                        Tải xuống bản sao dữ liệu cá nhân của bạn
                      </Text>
                    </div>
                    <Button 
                      icon={<DatabaseOutlined />}
                      onClick={() => setExportDataVisible(true)}
                    >
                      Xuất dữ liệu
                    </Button>
                  </div>

                  <Divider />

                  <Alert
                    message="Khu vực nguy hiểm"
                    description="Các hành động sau đây không thể hoàn tác"
                    type="warning"
                    showIcon
                  />

                  <div className="data-item">
                    <div className="data-info">
                      <Text strong>Xóa tài khoản</Text>
                      <Text type="secondary" className="data-description">
                        Xóa vĩnh viễn tài khoản và tất cả dữ liệu liên quan
                      </Text>
                    </div>
                    <Button 
                      danger 
                      icon={<DeleteOutlined />}
                      onClick={() => setDeleteAccountVisible(true)}
                    >
                      Xóa tài khoản
                    </Button>
                  </div>
                </Space>
              </Card>
            </Col>
          </Row>

          {/* Current Settings Summary */}
          <Card title="Tóm tắt cài đặt hiện tại" className="settings-summary">
            <Row gutter={[16, 16]}>
              <Col xs={12} sm={6}>
                <div className="summary-item">
                  <Text type="secondary">Giao diện</Text>
                  <Tag color="blue">{themeOptions.find(t => t.value === settings.theme)?.label}</Tag>
                </div>
              </Col>
              <Col xs={12} sm={6}>
                <div className="summary-item">
                  <Text type="secondary">Ngôn ngữ</Text>
                  <Tag color="green">{languageOptions.find(l => l.value === settings.language)?.label}</Tag>
                </div>
              </Col>
              <Col xs={12} sm={6}>
                <div className="summary-item">
                  <Text type="secondary">Thông báo email</Text>
                  <Tag color={settings.notifications.email ? 'success' : 'default'}>
                    {settings.notifications.email ? 'Bật' : 'Tắt'}
                  </Tag>
                </div>
              </Col>
              <Col xs={12} sm={6}>
                <div className="summary-item">
                  <Text type="secondary">Hồ sơ công khai</Text>
                  <Tag color={settings.privacy.profileVisible ? 'success' : 'default'}>
                    {settings.privacy.profileVisible ? 'Hiển thị' : 'Ẩn'}
                  </Tag>
                </div>
              </Col>
            </Row>
          </Card>
        </div>

        {/* Export Data Modal */}
        <Modal
          title="Xuất dữ liệu cá nhân"
          open={exportDataVisible}
          onCancel={() => setExportDataVisible(false)}
          onOk={handleExportData}
          okText="Xuất dữ liệu"
          cancelText="Hủy"
        >
          <Alert
            message="Thông tin xuất dữ liệu"
            description="Chúng tôi sẽ tạo một file chứa tất cả dữ liệu cá nhân của bạn và gửi đến email đã đăng ký trong vòng 24 giờ."
            type="info"
            showIcon
            style={{ marginBottom: '16px' }}
          />
          <Paragraph>
            File sẽ bao gồm:
          </Paragraph>
          <ul>
            <li>Thông tin hồ sơ cá nhân</li>
            <li>Lịch sử đặt vé và tham gia sự kiện</li>
            <li>Cài đặt và tùy chọn</li>
            <li>Dữ liệu tương tác với hệ thống</li>
          </ul>
        </Modal>

        {/* Delete Account Modal */}
        <Modal
          title="Xóa tài khoản"
          open={deleteAccountVisible}
          onCancel={() => setDeleteAccountVisible(false)}
          onOk={handleDeleteAccount}
          okText="Xóa tài khoản"
          cancelText="Hủy"
          okButtonProps={{ danger: true }}
        >
          <Alert
            message="Cảnh báo nghiêm trọng!"
            description="Hành động này sẽ xóa vĩnh viễn tài khoản của bạn và không thể hoàn tác."
            type="error"
            showIcon
            style={{ marginBottom: '16px' }}
          />
          <Paragraph>
            Khi xóa tài khoản, bạn sẽ mất:
          </Paragraph>
          <ul>
            <li>Tất cả thông tin cá nhân</li>
            <li>Lịch sử đặt vé và tham gia sự kiện</li>
            <li>Các vé đã mua chưa sử dụng</li>
            <li>Điểm thưởng và ưu đãi</li>
          </ul>
          <Paragraph strong>
            Bạn có chắc chắn muốn tiếp tục?
          </Paragraph>
        </Modal>
      </div>
    </MainLayout>
  );
};

export default SettingsPage;
