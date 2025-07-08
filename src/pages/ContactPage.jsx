import { useState } from 'react';
import { Row, Col, Card, Form, Input, Button, Typography, Space, message } from 'antd';
import {
  PhoneOutlined, MailOutlined, EnvironmentOutlined,
  ClockCircleOutlined, SendOutlined
} from '@ant-design/icons';
import MainLayout from '../components/layout/MainLayout';
import '../assets/scss/ContactPage.scss';

const { Title, Paragraph } = Typography;
const { TextArea } = Input;

const ContactPage = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      message.success('Tin nhắn của bạn đã được gửi thành công! Chúng tôi sẽ phản hồi trong thời gian sớm nhất.');
      form.resetFields();
    } catch {
      message.error('Có lỗi xảy ra. Vui lòng thử lại!');
    } finally {
      setLoading(false);
    }
  };

  const contactInfo = [
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

  const faqData = [
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

  return (
    <MainLayout>
      <div className="contact-page">
        {/* Hero Section */}
        <section className="contact-hero">
          <div className="hero-content">
            <Title level={1}>Liên hệ với chúng tôi</Title>
            <Paragraph className="hero-description">
              Chúng tôi luôn sẵn sàng lắng nghe và hỗ trợ bạn. 
              Hãy để lại thông tin để được tư vấn tốt nhất.
            </Paragraph>
          </div>
        </section>

        <div className="container">
          {/* Contact Info Cards */}
          <section className="contact-info-section">
            <Row gutter={[24, 24]}>
              {contactInfo.map((info, index) => (
                <Col xs={24} sm={12} lg={6} key={index}>
                  <Card className="contact-info-card" hoverable>
                    <div className="info-icon">{info.icon}</div>
                    <Title level={4}>{info.title}</Title>
                    <Paragraph className="info-content">{info.content}</Paragraph>
                    <Paragraph className="info-description">{info.description}</Paragraph>
                  </Card>
                </Col>
              ))}
            </Row>
          </section>

          {/* Contact Form & Map */}
          <section className="contact-form-section">
            <Row gutter={[32, 32]}>
              <Col xs={24} lg={12}>
                <Card title="Gửi tin nhắn cho chúng tôi" className="contact-form-card">
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
                      <Button
                        type="primary"
                        htmlType="submit"
                        loading={loading}
                        icon={<SendOutlined />}
                        size="large"
                        block
                      >
                        Gửi tin nhắn
                      </Button>
                    </Form.Item>
                  </Form>
                </Card>
              </Col>

              <Col xs={24} lg={12}>
                <Card title="Vị trí văn phòng" className="map-card">
                  <div className="map-container">
                    <iframe
                      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.325396391776!2d106.66364441480216!3d10.786834692313816!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752ed23c6b8c5d%3A0x53b8f833bd4f1d1a!2zQ2jhu6MgQuG6v24gVGjDoG5o!5e0!3m2!1svi!2s!4v1640781234567!5m2!1svi!2s"
                      width="100%"
                      height="300"
                      style={{ border: 0, borderRadius: '8px' }}
                      allowFullScreen=""
                      loading="lazy"
                      title="Vị trí văn phòng UniTic"
                    />
                  </div>
                  
                  <div className="map-info">
                    <Title level={5}>UniTic Headquarters</Title>
                    <Paragraph>
                      <EnvironmentOutlined /> 123 Đường ABC, Quận XYZ, TP. HCM
                    </Paragraph>
                    <Paragraph>
                      <ClockCircleOutlined /> Giờ làm việc: 8:00 - 22:00 (Thứ 2 - Chủ nhật)
                    </Paragraph>
                  </div>
                </Card>
              </Col>
            </Row>
          </section>

          {/* FAQ Section */}
          <section className="faq-section">
            <Title level={2} className="section-title">Câu hỏi thường gặp</Title>
            <Row gutter={[24, 24]}>
              {faqData.map((faq, index) => (
                <Col xs={24} lg={12} key={index}>
                  <Card className="faq-card">
                    <Title level={4} className="faq-question">{faq.question}</Title>
                    <Paragraph className="faq-answer">{faq.answer}</Paragraph>
                  </Card>
                </Col>
              ))}
            </Row>
          </section>

          {/* CTA Section */}
          <section className="cta-section">
            <Card className="cta-card">
              <Title level={3}>Bạn cần hỗ trợ khẩn cấp?</Title>
              <Paragraph>
                Liên hệ hotline 24/7 để được hỗ trợ nhanh chóng và hiệu quả
              </Paragraph>
              <Space size="large">
                <Button type="primary" size="large" icon={<PhoneOutlined />}>
                  Gọi ngay: 1900-xxxx
                </Button>
                <Button size="large" icon={<MailOutlined />}>
                  Email: support@unitic.com
                </Button>
              </Space>
            </Card>
          </section>
        </div>
      </div>
    </MainLayout>
  );
};

export default ContactPage;
