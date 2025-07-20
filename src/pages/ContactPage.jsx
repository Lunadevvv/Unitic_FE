import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Row, Col, Card, Form, Input, Button, Typography, Space, message, Collapse } from 'antd';
import {
  PhoneOutlined, MailOutlined, EnvironmentOutlined,
  ClockCircleOutlined, SendOutlined
} from '@ant-design/icons';
import MainLayout from '../components/layout/MainLayout';
import { AnimatedCard, AnimatedSection, AnimatedButton } from '../components/animations';
import { 
  sendContactMessage, 
  subscribeNewsletter, 
  getContactInfo, 
  getFAQ
} from '../store/actions/contactActions';
import { 
  clearError,
  clearSuccess 
} from '../store/reducers/contactSlice';
import '../assets/scss/ContactPage.scss';

const { Title, Paragraph } = Typography;
const { TextArea } = Input;
const { Panel } = Collapse;

const ContactPage = () => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  
  const { 
    loading, 
    error, 
    messageSuccess, 
    subscriptionSuccess,
    contactInfo: apiContactInfo,
    faq: apiFaq 
  } = useSelector(state => state.contact);

  useEffect(() => {
    // Load contact info and FAQ when component mounts
    dispatch(getContactInfo());
    dispatch(getFAQ());
  }, [dispatch]);

  useEffect(() => {
    // Handle success messages
    if (messageSuccess) {
      message.success('Tin nhắn của bạn đã được gửi thành công! Chúng tôi sẽ phản hồi trong thời gian sớm nhất.');
      form.resetFields();
      dispatch(clearSuccess());
    }
    
    if (subscriptionSuccess) {
      message.success('Đăng ký newsletter thành công!');
      dispatch(clearSuccess());
    }
    
    // Handle errors
    if (error) {
      message.error(error);
      dispatch(clearError());
    }
  }, [messageSuccess, subscriptionSuccess, error, form, dispatch]);

  const handleSubmit = async (values) => {
    dispatch(sendContactMessage({
      name: values.name,
      email: values.email,
      subject: values.subject,
      message: values.message,
      phone: values.phone,
    }));
  };

  const handleNewsletterSubscribe = (email) => {
    if (email) {
      dispatch(subscribeNewsletter(email));
      setNewsletterEmail(''); // Reset email field
    } else {
      message.warning('Vui lòng nhập email!');
    }
  };

  const [newsletterEmail, setNewsletterEmail] = useState('');

  const contactInfo = apiContactInfo || [
    {
      icon: <PhoneOutlined />,
      title: 'Điện thoại',
      content: '1900-xxxx',
      description: 'Hotline hỗ trợ 24/7'
    },
    {
      icon: <MailOutlined />,
      title: 'Email',
      content: 'support@unitic.com',
      description: 'Gửi email cho chúng tôi'
    },
    {
      icon: <EnvironmentOutlined />,
      title: 'Địa chỉ',
      content: '123 Đường ABC, Quận XYZ, TP. HCM',
      description: 'Văn phòng chính'
    },
    {
      icon: <ClockCircleOutlined />,
      title: 'Giờ làm việc',
      content: '8:00 - 22:00',
      description: 'Thứ 2 - Chủ nhật'
    }
  ];

  const faqData = apiFaq?.length > 0 ? apiFaq : [
    {
      question: 'Làm thế nào để đặt vé sự kiện?',
      answer: 'Bạn có thể dễ dàng đặt vé bằng cách tìm kiếm sự kiện yêu thích, chọn loại vé và thanh toán online.'
    },
    {
      question: 'Tôi có thể hủy vé đã đặt không?',
      answer: 'Việc hủy vé phụ thuộc vào chính sách của từng sự kiện. Vui lòng kiểm tra điều khoản khi đặt vé.'
    },
    {
      question: 'Làm sao để trở thành đối tác tổ chức sự kiện?',
      answer: 'Liên hệ với chúng tôi qua email hoặc hotline để được tư vấn chi tiết về gói dịch vụ dành cho nhà tổ chức.'
    },
    {
      question: 'UniTic có hỗ trợ thanh toán như thế nào?',
      answer: 'Chúng tôi hỗ trợ nhiều phương thức thanh toán: thẻ tín dụng, chuyển khoản ngân hàng, ví điện tử.'
    }
  ];

  const heroSection = (
    <section className="contact-hero">
      <div className="hero-content">
        <h1>Liên hệ với chúng tôi</h1>
        <p className="hero-description">
          Chúng tôi luôn sẵn sàng lắng nghe và hỗ trợ bạn. Hãy liên hệ với chúng tôi qua các kênh dưới đây 
          hoặc gửi tin nhắn trực tiếp.
        </p>
      </div>
    </section>
  );

  return (
    <MainLayout 
      className="contact-page"
      showAnimations={true}
      showFloatingElements={true}
      floatingVariant="contact"
      heroSection={heroSection}
      headerProps={{
        showAnimation: true,
        transparent: false,
        showCart: true,
        showNotifications: true
      }}
    >
      <div className="container">
        {/* Contact Info Cards */}
        <AnimatedSection containerType="stagger">
          <Row gutter={[24, 24]}>
            {contactInfo.map((info, index) => (
              <Col xs={24} sm={12} lg={6} key={index}>
                <AnimatedCard hoverType="cardHover">
                  <div className="info-icon">{info.icon}</div>
                  <Title level={4}>{info.title}</Title>
                  <Paragraph className="info-content">{info.content}</Paragraph>
                  <Paragraph className="info-description">{info.description}</Paragraph>
                </AnimatedCard>
              </Col>
            ))}
          </Row>
        </AnimatedSection>

        {/* Contact Form & Map */}
        <AnimatedSection animationType="fadeIn">
          <Row gutter={[32, 32]}>
            <Col xs={24} lg={12}>
              <AnimatedCard title="Gửi tin nhắn cho chúng tôi" animationType="slideInLeft">
                <Form
                  form={form}
                  layout="vertical"
                  onFinish={handleSubmit}
                  className="contact-form"
                >
                  <Row gutter={16}>
                    <Col xs={24} sm={12}>
                      <Form.Item
                        name="name"
                        label="Họ và tên"
                        rules={[{ required: true, message: 'Vui lòng nhập họ tên!' }]}
                      >
                        <Input placeholder="Nguyễn Văn A" />
                      </Form.Item>
                    </Col>
                    <Col xs={24} sm={12}>
                      <Form.Item
                        name="email"
                        label="Email"
                        rules={[
                          { required: true, message: 'Vui lòng nhập email!' },
                          { type: 'email', message: 'Email không hợp lệ!' }
                        ]}
                      >
                        <Input placeholder="example@email.com" />
                      </Form.Item>
                    </Col>
                  </Row>

                  <Form.Item
                    name="phone"
                    label="Số điện thoại"
                    rules={[{ required: true, message: 'Vui lòng nhập số điện thoại!' }]}
                  >
                    <Input placeholder="0123456789" />
                  </Form.Item>

                  <Form.Item
                    name="subject"
                    label="Chủ đề"
                    rules={[{ required: true, message: 'Vui lòng nhập chủ đề!' }]}
                  >
                    <Input placeholder="Chủ đề tin nhắn" />
                  </Form.Item>

                  <Form.Item
                    name="message"
                    label="Nội dung"
                    rules={[{ required: true, message: 'Vui lòng nhập nội dung!' }]}
                  >
                    <TextArea
                      rows={6}
                      placeholder="Nhập nội dung tin nhắn của bạn..."
                    />
                  </Form.Item>

                  <Form.Item>
                    <AnimatedButton
                      type="primary"
                      htmlType="submit"
                      loading={loading}
                      icon={<SendOutlined />}
                      size="large"
                      style={{ width: '100%' }}
                    >
                      Gửi tin nhắn
                    </AnimatedButton>
                  </Form.Item>
                </Form>
              </AnimatedCard>
            </Col>

            <Col xs={24} lg={12}>
              <AnimatedCard title="Vị trí của chúng tôi" animationType="slideInRight">
                <div className="map-container">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3918.610009142439!2d106.80730731480126!3d10.841132792273!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752731176b07b1%3A0xb752b24b379bae5e!2sFPT%20University%20HCMC!5e0!3m2!1sen!2s!4v1635147537177!5m2!1sen!2s"
                    width="100%"
                    height="300"
                    style={{ border: 0 }}
                    allowFullScreen=""
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="FPT University Map"
                  ></iframe>
                </div>
                <div className="map-info">
                  <Title level={5}>Trường Đại học FPT TP.HCM</Title>
                  <Paragraph>
                    <EnvironmentOutlined /> Lô E2a-7, Đường D1, Đ. D1, Long Thạnh Mỹ, 
                    Thành Phố Thủ Đức, Thành phố Hồ Chí Minh
                  </Paragraph>
                  <Paragraph>
                    <PhoneOutlined /> (028) 7300 1866
                  </Paragraph>
                  <Paragraph>
                    <MailOutlined /> info@fpt.edu.vn
                  </Paragraph>
                </div>
              </AnimatedCard>
            </Col>
          </Row>
        </AnimatedSection>

        {/* FAQ Section */}
        <AnimatedSection animationType="fadeIn">
          <Title level={2} className="section-title">Câu hỏi thường gặp</Title>
          <Row justify="center">
            <Col xs={24} lg={16}>
              <AnimatedCard>
                <Collapse ghost>
                  {faqData.map((faq, index) => (
                    <Panel 
                      header={
                        <div className="faq-question">
                          {faq.question}
                        </div>
                      } 
                      key={index}
                    >
                      <div className="faq-answer">
                        {faq.answer}
                      </div>
                    </Panel>
                  ))}
                </Collapse>
              </AnimatedCard>
            </Col>
          </Row>
        </AnimatedSection>

        {/* CTA Section */}
        <AnimatedSection animationType="scaleIn">
          <Row justify="center">
            <Col xs={24} md={16} lg={12}>
              <AnimatedCard hoverType="cardHover">
                <Title level={3}>Sẵn sàng bắt đầu?</Title>
                <Paragraph>
                  Tham gia cùng hàng nghìn sinh viên khác để khám phá những sự kiện tuyệt vời 
                  và cơ hội phát triển bản thân.
                </Paragraph>
                
                {/* Newsletter Subscription */}
                <div style={{ marginBottom: '24px' }}>
                  <Title level={5}>Đăng ký nhận thông tin sự kiện mới nhất</Title>
                  <Input.Group compact>
                    <Input
                      style={{ width: 'calc(100% - 100px)' }}
                      placeholder="Nhập email của bạn"
                      value={newsletterEmail}
                      onChange={(e) => setNewsletterEmail(e.target.value)}
                    />
                    <Button 
                      type="primary" 
                      loading={loading}
                      onClick={() => handleNewsletterSubscribe(newsletterEmail)}
                    >
                      Đăng ký
                    </Button>
                  </Input.Group>
                </div>

                <Space size="large">
                  <AnimatedButton type="primary" size="large">
                    Khám phá sự kiện
                  </AnimatedButton>
                  <AnimatedButton size="large">
                    Tìm hiểu thêm
                  </AnimatedButton>
                </Space>
              </AnimatedCard>
            </Col>
          </Row>
        </AnimatedSection>
      </div>
    </MainLayout>
  );
};

export default ContactPage;
