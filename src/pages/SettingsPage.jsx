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
import { motion } from 'framer-motion';
import PageAnimationWrapper from '../components/common/PageAnimationWrapper';
import { 
  useSectionAnimation, 
  animationVariants, 
  hoverAnimations 
} from '../hooks/useAnimations';
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

  // Section animations
  const themeSection = useSectionAnimation();
  const notificationSection = useSectionAnimation();
  const privacySection = useSectionAnimation();
  const dataSection = useSectionAnimation();

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

  const handleDeleteAccount = () => {
    setDeleteAccountVisible(false);
    message.error('Tính năng này đang trong quá trình phát triển');
  };

  const handleExportData = () => {
    setExportDataVisible(false);
    message.success('Dữ liệu sẽ được gửi đến email của bạn trong vòng 24h');
  };

  const heroSection = (
    <motion.section 
      className="settings-header"
      variants={animationVariants.fadeInVariant}
      initial="hidden"
      animate="visible"
    >
      <motion.div
        variants={animationVariants.titleTextVariant}
      >
        <Title level={2}>
          <SettingOutlined style={{ marginRight: 12, color: '#1890ff' }} />
          Cài đặt tài khoản
        </Title>
      </motion.div>
      <motion.div
        variants={animationVariants.itemVariant}
      >
        <Paragraph>
          Quản lý preferences, privacy và các cài đặt khác của bạn
        </Paragraph>
      </motion.div>
    </motion.section>
  );

  return (
    <PageAnimationWrapper 
      className="settings-page"
      showFloatingElements={true}
      floatingVariant="settings"
      heroSection={heroSection}
      headerProps={{
        showAnimation: true,
        transparent: false,
        showCart: true,
        showNotifications: true
      }}
    >
      <div className="settings-container">
        {/* Theme & Language Settings */}
        <motion.div
          ref={themeSection.ref}
          variants={animationVariants.slideInLeftVariant}
          initial="hidden"
          animate={themeSection.inView ? "visible" : "hidden"}
        >
          <Card 
            title={
              <span>
                <SunOutlined style={{ marginRight: 8 }} />
                Giao diện & Ngôn ngữ
              </span>
            }
            className="settings-card"
          >
            <Row gutter={[24, 16]}>
              <Col xs={24} md={12}>
                <Space direction="vertical" style={{ width: '100%' }}>
                  <Text strong>Chế độ giao diện</Text>
                  <motion.div {...hoverAnimations.buttonHover}>
                    <Select
                      value={settings.theme}
                      onChange={(value) => handleSimpleSettingChange('theme', value)}
                      style={{ width: '100%' }}
                      size="large"
                    >
                      <Option value="light">
                        <SunOutlined /> Sáng
                      </Option>
                      <Option value="dark">
                        <MoonOutlined /> Tối
                      </Option>
                    </Select>
                  </motion.div>
                </Space>
              </Col>

              <Col xs={24} md={12}>
                <Space direction="vertical" style={{ width: '100%' }}>
                  <Text strong>Ngôn ngữ</Text>
                  <motion.div {...hoverAnimations.buttonHover}>
                    <Select
                      value={settings.language}
                      onChange={(value) => handleSimpleSettingChange('language', value)}
                      style={{ width: '100%' }}
                      size="large"
                    >
                      <Option value="vi">
                        <GlobalOutlined /> Tiếng Việt
                      </Option>
                      <Option value="en">
                        <GlobalOutlined /> English
                      </Option>
                    </Select>
                  </motion.div>
                </Space>
              </Col>
            </Row>
          </Card>
        </motion.div>

        {/* Notification Settings */}
        <motion.div
          ref={notificationSection.ref}
          variants={animationVariants.slideInRightVariant}
          initial="hidden"
          animate={notificationSection.inView ? "visible" : "hidden"}
        >
          <Card 
            title={
              <span>
                <BellOutlined style={{ marginRight: 8 }} />
                Thông báo
              </span>
            }
            className="settings-card"
          >
            <List>
              <List.Item>
                <List.Item.Meta
                  avatar={<NotificationOutlined />}
                  title="Thông báo email"
                  description="Nhận thông báo về sự kiện và cập nhật qua email"
                />
                <motion.div {...hoverAnimations.floatHover}>
                  <Switch
                    checked={settings.notifications.email}
                    onChange={(checked) => handleSettingChange('notifications', 'email', checked)}
                  />
                </motion.div>
              </List.Item>

              <List.Item>
                <List.Item.Meta
                  avatar={<BellOutlined />}
                  title="Thông báo đẩy"
                  description="Nhận thông báo đẩy trên trình duyệt"
                />
                <motion.div {...hoverAnimations.floatHover}>
                  <Switch
                    checked={settings.notifications.push}
                    onChange={(checked) => handleSettingChange('notifications', 'push', checked)}
                  />
                </motion.div>
              </List.Item>

              <List.Item>
                <List.Item.Meta
                  avatar={<NotificationOutlined />}
                  title="Thông báo SMS"
                  description="Nhận thông báo quan trọng qua SMS"
                />
                <motion.div {...hoverAnimations.floatHover}>
                  <Switch
                    checked={settings.notifications.sms}
                    onChange={(checked) => handleSettingChange('notifications', 'sms', checked)}
                  />
                </motion.div>
              </List.Item>

              <List.Item>
                <List.Item.Meta
                  avatar={<DatabaseOutlined />}
                  title="Email marketing"
                  description="Nhận thông tin về sự kiện mới và ưu đãi"
                />
                <motion.div {...hoverAnimations.floatHover}>
                  <Switch
                    checked={settings.notifications.marketing}
                    onChange={(checked) => handleSettingChange('notifications', 'marketing', checked)}
                  />
                </motion.div>
              </List.Item>
            </List>
          </Card>
        </motion.div>

        {/* Privacy Settings */}
        <motion.div
          ref={privacySection.ref}
          variants={animationVariants.slideInLeftVariant}
          initial="hidden"
          animate={privacySection.inView ? "visible" : "hidden"}
        >
          <Card 
            title={
              <span>
                <SafetyOutlined style={{ marginRight: 8 }} />
                Quyền riêng tư
              </span>
            }
            className="settings-card"
          >
            <Alert
              message="Bảo vệ thông tin cá nhân"
              description="Quản lý cách thông tin của bạn được hiển thị và chia sẻ"
              type="info"
              showIcon
              style={{ marginBottom: 16 }}
            />

            <List>
              <List.Item>
                <List.Item.Meta
                  title="Hiển thị profile công khai"
                  description="Cho phép người khác xem thông tin cơ bản của bạn"
                />
                <motion.div {...hoverAnimations.floatHover}>
                  <Switch
                    checked={settings.privacy.profileVisible}
                    onChange={(checked) => handleSettingChange('privacy', 'profileVisible', checked)}
                  />
                </motion.div>
              </List.Item>

              <List.Item>
                <List.Item.Meta
                  title="Hiển thị hoạt động"
                  description="Cho phép người khác xem các sự kiện bạn đã tham gia"
                />
                <motion.div {...hoverAnimations.floatHover}>
                  <Switch
                    checked={settings.privacy.showActivity}
                    onChange={(checked) => handleSettingChange('privacy', 'showActivity', checked)}
                  />
                </motion.div>
              </List.Item>

              <List.Item>
                <List.Item.Meta
                  title="Chia sẻ dữ liệu"
                  description="Cho phép chia sẻ dữ liệu ẩn danh để cải thiện dịch vụ"
                />
                <motion.div {...hoverAnimations.floatHover}>
                  <Switch
                    checked={settings.privacy.dataSharing}
                    onChange={(checked) => handleSettingChange('privacy', 'dataSharing', checked)}
                  />
                </motion.div>
              </List.Item>
            </List>
          </Card>
        </motion.div>

        {/* Data Management */}
        <motion.div
          ref={dataSection.ref}
          variants={animationVariants.scaleInVariant}
          initial="hidden"
          animate={dataSection.inView ? "visible" : "hidden"}
        >
          <Card 
            title={
              <span>
                <DatabaseOutlined style={{ marginRight: 8 }} />
                Quản lý dữ liệu
              </span>
            }
            className="settings-card"
          >
            <Space direction="vertical" style={{ width: '100%' }} size="large">
              <Alert
                message="Quản lý dữ liệu cá nhân"
                description="Export dữ liệu hoặc xóa tài khoản vĩnh viễn"
                type="warning"
                showIcon
              />

              <Row gutter={[16, 16]}>
                <Col xs={24} sm={12}>
                  <motion.div {...hoverAnimations.buttonHover}>
                    <Button
                      size="large"
                      block
                      icon={<DatabaseOutlined />}
                      onClick={() => setExportDataVisible(true)}
                    >
                      Export dữ liệu
                    </Button>
                  </motion.div>
                </Col>

                <Col xs={24} sm={12}>
                  <motion.div {...hoverAnimations.buttonHover}>
                    <Button
                      danger
                      size="large"
                      block
                      icon={<DeleteOutlined />}
                      onClick={() => setDeleteAccountVisible(true)}
                    >
                      Xóa tài khoản
                    </Button>
                  </motion.div>
                </Col>
              </Row>

              <div>
                <Text type="secondary">
                  <SafetyOutlined style={{ marginRight: 4 }} />
                  Tất cả thay đổi được bảo mật và chỉ bạn mới có thể truy cập
                </Text>
              </div>
            </Space>
          </Card>
        </motion.div>
      </div>

      {/* Delete Account Modal */}
      <Modal
        title={
          <span style={{ color: '#ff4d4f' }}>
            <ExclamationCircleOutlined style={{ marginRight: 8 }} />
            Xác nhận xóa tài khoản
          </span>
        }
        visible={deleteAccountVisible}
        onCancel={() => setDeleteAccountVisible(false)}
        footer={[
          <Button key="cancel" onClick={() => setDeleteAccountVisible(false)}>
            Hủy
          </Button>,
          <Button key="delete" type="primary" danger onClick={handleDeleteAccount}>
            Xóa tài khoản
          </Button>
        ]}
      >
        <Alert
          message="Cảnh báo!"
          description="Hành động này không thể hoàn tác. Tất cả dữ liệu của bạn sẽ bị xóa vĩnh viễn."
          type="error"
          showIcon
          style={{ marginBottom: 16 }}
        />
        <Paragraph>
          Khi xóa tài khoản, bạn sẽ mất:
        </Paragraph>
        <List size="small">
          <List.Item>• Tất cả thông tin cá nhân</List.Item>
          <List.Item>• Lịch sử đặt vé</List.Item>
          <List.Item>• Điểm thưởng và ưu đãi</List.Item>
          <List.Item>• Các cài đặt tùy chỉnh</List.Item>
        </List>
      </Modal>

      {/* Export Data Modal */}
      <Modal
        title={
          <span>
            <DatabaseOutlined style={{ marginRight: 8 }} />
            Export dữ liệu cá nhân
          </span>
        }
        visible={exportDataVisible}
        onCancel={() => setExportDataVisible(false)}
        footer={[
          <Button key="cancel" onClick={() => setExportDataVisible(false)}>
            Hủy
          </Button>,
          <Button key="export" type="primary" onClick={handleExportData}>
            Export dữ liệu
          </Button>
        ]}
      >
        <Paragraph>
          Chúng tôi sẽ chuẩn bị file chứa tất cả dữ liệu cá nhân của bạn bao gồm:
        </Paragraph>
        <List size="small">
          <List.Item>• Thông tin hồ sơ</List.Item>
          <List.Item>• Lịch sử giao dịch</List.Item>
          <List.Item>• Danh sách sự kiện đã tham gia</List.Item>
          <List.Item>• Cài đặt và preferences</List.Item>
        </List>
        <Alert
          message="File sẽ được gửi đến email đã đăng ký trong vòng 24 giờ"
          type="info"
          showIcon
          style={{ marginTop: 16 }}
        />
      </Modal>
    </PageAnimationWrapper>
  );
};

export default SettingsPage;
