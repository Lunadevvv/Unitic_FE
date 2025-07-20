import { useState } from 'react';
import { 
  Row, Col, Card, Typography, Input, Button, Space, Collapse, 
  Tabs, List, Avatar, Tag, Divider, Alert
} from 'antd';
import {
  SearchOutlined, QuestionCircleOutlined, BookOutlined,
  MessageOutlined, PhoneOutlined, MailOutlined, DownloadOutlined, 
  UserOutlined, ClockCircleOutlined, CheckCircleOutlined,
  VideoCameraFilled
} from '@ant-design/icons';
import { motion } from 'framer-motion';
import PageAnimationWrapper from '../components/common/PageAnimationWrapper';
import { 
  useSectionAnimation, 
  animationVariants, 
  hoverAnimations 
} from '../hooks/useAnimations';
import '../assets/scss/HelpPage.scss';

const { Title, Paragraph, Text } = Typography;
const { Panel } = Collapse;
const { TabPane } = Tabs;

const HelpPage = () => {
  const [searchTerm, setSearchTerm] = useState('');

  // Section animations
  const quickHelpSection = useSectionAnimation();
  const faqSection = useSectionAnimation();
  const resourcesSection = useSectionAnimation();
  const supportSection = useSectionAnimation();

  const faqData = [
    {
      category: 'Đặt vé',
      questions: [
        {
          question: 'Làm thế nào để đặt vé sự kiện?',
          answer: 'Bạn có thể đặt vé bằng cách: 1) Tìm kiếm sự kiện yêu thích, 2) Chọn loại vé và số lượng, 3) Điền thông tin và thanh toán online. Vé sẽ được gửi qua email ngay sau khi thanh toán thành công.'
        },
        {
          question: 'Tôi có thể thay đổi thông tin vé sau khi đặt không?',
          answer: 'Thông tin vé có thể được thay đổi trong vòng 24 giờ sau khi đặt. Vui lòng liên hệ hotline hoặc sử dụng tính năng "Quản lý vé" trong tài khoản để thay đổi.'
        },
        {
          question: 'Phí dịch vụ đặt vé là bao nhiêu?',
          answer: 'Phí dịch vụ thường là 5% giá trị vé, tối đa 50.000 VNĐ. Phí này đã bao gồm VAT và các chi phí xử lý thanh toán.'
        }
      ]
    },
    {
      category: 'Thanh toán',
      questions: [
        {
          question: 'UniTic hỗ trợ những phương thức thanh toán nào?',
          answer: 'Chúng tôi hỗ trợ: Thẻ tín dụng/ghi nợ (Visa, Mastercard), chuyển khoản ngân hàng, ví điện tử (MoMo, ZaloPay, VNPay).'
        },
        {
          question: 'Tôi có thể hủy vé và hoàn tiền không?',
          answer: 'Chính sách hoàn tiền phụ thuộc vào từng sự kiện. Thường vé có thể được hủy và hoàn 80% giá trị trong vòng 7 ngày trước sự kiện.'
        },
        {
          question: 'Thanh toán không thành công, tôi phải làm gì?',
          answer: 'Vui lòng kiểm tra thông tin thẻ, hạn mức, hoặc thử phương thức thanh toán khác. Nếu vẫn lỗi, liên hệ ngân hàng hoặc hotline hỗ trợ.'
        }
      ]
    },
    {
      category: 'Tài khoản',
      questions: [
        {
          question: 'Tôi quên mật khẩu, làm sao để lấy lại?',
          answer: 'Nhấn "Quên mật khẩu" tại trang đăng nhập, nhập email đã đăng ký. Chúng tôi sẽ gửi link reset mật khẩu đến email của bạn.'
        },
        {
          question: 'Làm thế nào để cập nhật thông tin cá nhân?',
          answer: 'Đăng nhập tài khoản > Thông tin cá nhân > Chỉnh sửa thông tin > Lưu thay đổi.'
        }
      ]
    }
  ];

  const supportChannels = [
    {
      icon: <PhoneOutlined />,
      title: 'Hotline hỗ trợ',
      info: '1900-xxxx',
      description: 'Hỗ trợ 24/7',
      action: 'Gọi ngay',
      color: '#52c41a'
    },
    {
      icon: <MessageOutlined />,
      title: 'Live Chat',
      info: 'Chat trực tuyến',
      description: 'Phản hồi trong 5 phút',
      action: 'Bắt đầu chat',
      color: '#1890ff'
    },
    {
      icon: <MailOutlined />,
      title: 'Email hỗ trợ',
      info: 'support@unitic.com',
      description: 'Phản hồi trong 24h',
      action: 'Gửi email',
      color: '#722ed1'
    },
    {
      icon: <VideoCameraFilled />,
      title: 'Video hướng dẫn',
      info: 'Thư viện video',
      description: 'Hướng dẫn chi tiết',
      action: 'Xem video',
      color: '#fa541c'
    }
  ];

  const resources = [
    {
      icon: <BookOutlined />,
      title: 'Hướng dẫn sử dụng',
      description: 'Tài liệu chi tiết về cách sử dụng UniTic',
      action: 'Tải xuống'
    },
    {
      icon: <QuestionCircleOutlined />,
      title: 'FAQ tổng hợp',
      description: 'Câu hỏi thường gặp và giải đáp',
      action: 'Xem chi tiết'
    },
    {
      icon: <UserOutlined />,
      title: 'Cộng đồng người dùng',
      description: 'Kết nối và chia sẻ kinh nghiệm',
      action: 'Tham gia'
    }
  ];

  const heroSection = (
    <motion.section 
      className="help-hero"
      variants={animationVariants.fadeInVariant}
      initial="hidden"
      animate="visible"
    >
      <div className="hero-content">
        <motion.div
          variants={animationVariants.titleTextVariant}
        >
          <Title level={1}>Trung tâm hỗ trợ</Title>
        </motion.div>
        <motion.div
          variants={animationVariants.itemVariant}
        >
          <Paragraph className="hero-description">
            Tìm kiếm thông tin, hướng dẫn và nhận hỗ trợ cho mọi thắc mắc về UniTic
          </Paragraph>
        </motion.div>
        <motion.div
          className="search-section"
          variants={animationVariants.itemVariant}
        >
          <Input.Group compact className="help-search">
            <Input
              size="large"
              placeholder="Tìm kiếm câu hỏi hoặc từ khóa..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ width: 'calc(100% - 80px)' }}
            />
            <Button 
              type="primary" 
              size="large" 
              icon={<SearchOutlined />}
              style={{ width: '80px' }}
            >
              Tìm
            </Button>
          </Input.Group>
        </motion.div>
      </div>
    </motion.section>
  );

  return (
    <PageAnimationWrapper 
      className="help-page"
      showFloatingElements={true}
      floatingVariant="help"
      heroSection={heroSection}
      headerProps={{
        showAnimation: true,
        transparent: false,
        showCart: true,
        showNotifications: true
      }}
    >
      <div className="container">
        {/* Quick Help Section */}
        <motion.section 
          className="quick-help-section"
          ref={quickHelpSection.ref}
          variants={animationVariants.staggerContainerVariant}
          initial="hidden"
          animate={quickHelpSection.inView ? "visible" : "hidden"}
        >
          <motion.div
            variants={animationVariants.titleRevealVariant}
          >
            <Title level={2} className="section-title">Hỗ trợ nhanh</Title>
          </motion.div>

          <Row gutter={[24, 24]}>
            {supportChannels.map((channel, index) => (
              <Col xs={24} sm={12} lg={6} key={index}>
                <motion.div
                  variants={animationVariants.itemVariant}
                  {...hoverAnimations.cardHover}
                >
                  <Card className="support-channel-card" hoverable>
                    <div className="channel-icon" style={{ color: channel.color }}>
                      {channel.icon}
                    </div>
                    <Title level={4}>{channel.title}</Title>
                    <Text className="channel-info">{channel.info}</Text>
                    <Text className="channel-description">{channel.description}</Text>
                    <motion.div {...hoverAnimations.buttonHover}>
                      <Button type="primary" style={{ backgroundColor: channel.color }}>
                        {channel.action}
                      </Button>
                    </motion.div>
                  </Card>
                </motion.div>
              </Col>
            ))}
          </Row>
        </motion.section>

        {/* FAQ Section */}
        <motion.section 
          className="faq-section"
          ref={faqSection.ref}
          variants={animationVariants.fadeInVariant}
          initial="hidden"
          animate={faqSection.inView ? "visible" : "hidden"}
        >
          <motion.div
            variants={animationVariants.titleRevealVariant}
          >
            <Title level={2} className="section-title">Câu hỏi thường gặp</Title>
          </motion.div>

          <Row justify="center">
            <Col xs={24} lg={18}>
              <motion.div
                variants={animationVariants.staggerContainerVariant}
              >
                <Card className="faq-card">
                  <Tabs defaultActiveKey="0" type="card">
                    {faqData.map((category, categoryIndex) => (
                      <TabPane tab={category.category} key={categoryIndex}>
                        <Collapse ghost>
                          {category.questions.map((faq, index) => (
                            <Panel 
                              header={
                                <motion.div
                                  variants={animationVariants.itemVariant}
                                  className="faq-question"
                                >
                                  <QuestionCircleOutlined style={{ marginRight: 8, color: '#1890ff' }} />
                                  {faq.question}
                                </motion.div>
                              } 
                              key={index}
                            >
                              <motion.div
                                variants={animationVariants.itemVariant}
                                className="faq-answer"
                              >
                                {faq.answer}
                              </motion.div>
                            </Panel>
                          ))}
                        </Collapse>
                      </TabPane>
                    ))}
                  </Tabs>
                </Card>
              </motion.div>
            </Col>
          </Row>
        </motion.section>

        {/* Resources Section */}
        <motion.section 
          className="resource-section"
          ref={resourcesSection.ref}
          variants={animationVariants.staggerContainerVariant}
          initial="hidden"
          animate={resourcesSection.inView ? "visible" : "hidden"}
        >
          <motion.div
            variants={animationVariants.titleRevealVariant}
          >
            <Title level={2} className="section-title">Tài nguyên hữu ích</Title>
          </motion.div>

          <Row gutter={[24, 24]}>
            {resources.map((resource, index) => (
              <Col xs={24} md={8} key={index}>
                <motion.div
                  variants={animationVariants.itemVariant}
                  {...hoverAnimations.cardHover}
                >
                  <Card className="resource-card" hoverable>
                    <div className="resource-icon">{resource.icon}</div>
                    <Title level={4}>{resource.title}</Title>
                    <Paragraph className="resource-description">
                      {resource.description}
                    </Paragraph>
                    <motion.div {...hoverAnimations.buttonHover}>
                      <Button type="primary" icon={<DownloadOutlined />}>
                        {resource.action}
                      </Button>
                    </motion.div>
                  </Card>
                </motion.div>
              </Col>
            ))}
          </Row>
        </motion.section>

        {/* Contact Support Section */}
        <motion.section 
          className="contact-support-section"
          ref={supportSection.ref}
          variants={animationVariants.scaleInVariant}
          initial="hidden"
          animate={supportSection.inView ? "visible" : "hidden"}
        >
          <Row justify="center">
            <Col xs={24} md={16} lg={12}>
              <motion.div {...hoverAnimations.cardHover}>
                <Card className="contact-support-card">
                  <Title level={3}>Vẫn cần hỗ trợ?</Title>
                  <Paragraph>
                    Đội ngũ hỗ trợ của chúng tôi luôn sẵn sàng giúp đỡ bạn 24/7. 
                    Hãy liên hệ với chúng tôi để được hỗ trợ tốt nhất.
                  </Paragraph>
                  <Space size="large">
                    <motion.div {...hoverAnimations.buttonHover}>
                      <Button type="primary" size="large" icon={<MessageOutlined />}>
                        Liên hệ hỗ trợ
                      </Button>
                    </motion.div>
                    <motion.div {...hoverAnimations.buttonHover}>
                      <Button size="large" icon={<PhoneOutlined />}>
                        Gọi hotline
                      </Button>
                    </motion.div>
                  </Space>
                </Card>
              </motion.div>
            </Col>
          </Row>
        </motion.section>
      </div>
    </PageAnimationWrapper>
  );
};

export default HelpPage;
