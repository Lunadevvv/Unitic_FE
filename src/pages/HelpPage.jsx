import { useState } from 'react';
import { 
  Row, Col, Card, Typography, Input, Button, Space, Collapse, 
  Tabs, List, Avatar, Tag, Divider, Alert
} from 'antd';
import {
  SearchOutlined, QuestionCircleOutlined, BookOutlined,
   MessageOutlined, PhoneOutlined,
  MailOutlined, DownloadOutlined, UserOutlined,
  ClockCircleOutlined, CheckCircleOutlined,
  VideoCameraFilled
} from '@ant-design/icons';
import MainLayout from '../components/layout/MainLayout';
import '../assets/scss/HelpPage.scss';

const { Title, Paragraph, Text } = Typography;
const { Panel } = Collapse;
const { TabPane } = Tabs;

const HelpPage = () => {
  const [searchTerm, setSearchTerm] = useState('');

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
          question: 'Khi nào tôi nhận được hóa đơn VAT?',
          answer: 'Hóa đơn VAT sẽ được gửi qua email trong vòng 24 giờ sau khi thanh toán thành công. Bạn cũng có thể tải xuống từ tài khoản cá nhân.'
        }
      ]
    },
    {
      category: 'Tài khoản',
      questions: [
        {
          question: 'Làm sao để tạo tài khoản UniTic?',
          answer: 'Nhấp vào "Đăng ký" ở góc phải màn hình, điền thông tin cần thiết và xác nhận email. Bạn cũng có thể đăng ký bằng tài khoản Google.'
        },
        {
          question: 'Tôi quên mật khẩu, phải làm sao?',
          answer: 'Nhấp "Quên mật khẩu" ở trang đăng nhập, nhập email đã đăng ký. Chúng tôi sẽ gửi link đặt lại mật khẩu qua email.'
        },
        {
          question: 'Làm thế nào để nâng cấp tài khoản Premium?',
          answer: 'Vào "Cài đặt tài khoản" > "Nâng cấp Premium". Tài khoản Premium có nhiều ưu đãi như giảm phí dịch vụ, ưu tiên đặt vé.'
        }
      ]
    }
  ];

  const tutorials = [
    {
      title: 'Hướng dẫn đặt vé lần đầu',
      description: 'Video hướng dẫn chi tiết cách đặt vé từ A-Z',
      duration: '5 phút',
      type: 'video',
      thumbnail: '/src/assets/img/demo.jpg'
    },
    {
      title: 'Cách sử dụng mã giảm giá',
      description: 'Hướng dẫn áp dụng mã giảm giá khi thanh toán',
      duration: '3 phút',
      type: 'guide',
      thumbnail: '/src/assets/img/demo.jpg'
    },
    {
      title: 'Quản lý vé đã mua',
      description: 'Cách xem, tải xuống và chia sẻ vé',
      duration: '4 phút',
      type: 'video',
      thumbnail: '/src/assets/img/demo.jpg'
    }
  ];

  const supportChannels = [
    {
      channel: 'Hotline',
      info: '1900-xxxx',
      description: 'Hỗ trợ 24/7',
      icon: <PhoneOutlined />,
      color: '#52c41a'
    },
    {
      channel: 'Email',
      info: 'support@unitic.com',
      description: 'Phản hồi trong 2 giờ',
      icon: <MailOutlined />,
      color: '#1890ff'
    },
    {
      channel: 'Live Chat',
      info: 'Chat ngay',
      description: 'Online 8:00-22:00',
      icon: <MessageOutlined />,
      color: '#722ed1'
    }
  ];

  const filteredFAQ = faqData.map(category => ({
    ...category,
    questions: category.questions.filter(
      q => q.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
           q.answer.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })).filter(category => category.questions.length > 0);

  return (
    <MainLayout>
      <div className="help-page">
        {/* Hero Section */}
        <section className="help-hero">
          <div className="hero-content">
            <Title level={1}>Trung tâm trợ giúp</Title>
            <Paragraph className="hero-description">
              Tìm câu trả lời cho các câu hỏi thường gặp hoặc liên hệ với chúng tôi để được hỗ trợ
            </Paragraph>
            
            <div className="search-section">
              <Input.Search
                placeholder="Tìm kiếm câu hỏi..."
                enterButton={<SearchOutlined />}
                size="large"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="help-search"
              />
            </div>
          </div>
        </section>

        <div className="container">
          {/* Quick Help */}
          <section className="quick-help-section">
            <Title level={2} className="section-title">Trợ giúp nhanh</Title>
            <Row gutter={[24, 24]}>
              {supportChannels.map((channel, index) => (
                <Col xs={24} sm={8} key={index}>
                  <Card className="support-channel-card" hoverable>
                    <div className="channel-icon" style={{ color: channel.color }}>
                      {channel.icon}
                    </div>
                    <Title level={4}>{channel.channel}</Title>
                    <Text className="channel-info">{channel.info}</Text>
                    <Text className="channel-description">{channel.description}</Text>
                    <Button type="primary" style={{ backgroundColor: channel.color }}>
                      Liên hệ ngay
                    </Button>
                  </Card>
                </Col>
              ))}
            </Row>
          </section>

          {/* Main Content */}
          <Row gutter={[32, 32]}>
            {/* FAQ Section */}
            <Col xs={24} lg={16}>
              <Card title="Câu hỏi thường gặp" className="faq-card">
                {searchTerm && (
                  <Alert
                    message={`Tìm thấy ${filteredFAQ.reduce((total, cat) => total + cat.questions.length, 0)} kết quả cho "${searchTerm}"`}
                    type="info"
                    style={{ marginBottom: '20px' }}
                  />
                )}
                
                <Tabs defaultActiveKey="0" className="faq-tabs">
                  {filteredFAQ.map((category, index) => (
                    <TabPane 
                      tab={`${category.category} (${category.questions.length})`} 
                      key={index}
                    >
                      <Collapse ghost>
                        {category.questions.map((item, qIndex) => (
                          <Panel 
                            header={item.question} 
                            key={qIndex}
                            extra={<QuestionCircleOutlined />}
                          >
                            <Paragraph>{item.answer}</Paragraph>
                          </Panel>
                        ))}
                      </Collapse>
                    </TabPane>
                  ))}
                </Tabs>
              </Card>
            </Col>

            {/* Sidebar */}
            <Col xs={24} lg={8}>
              {/* Video Tutorials */}
              <Card title="Hướng dẫn video" className="tutorials-card">
                <List
                  dataSource={tutorials}
                  renderItem={tutorial => (
                    <List.Item>
                      <List.Item.Meta
                        avatar={
                          <div className="tutorial-thumbnail">
                            <img src={tutorial.thumbnail} alt={tutorial.title} />
                            <div className="play-overlay">
                              {tutorial.type === 'video' ? <VideoCameraFilled /> : <BookOutlined />}
                            </div>
                          </div>
                        }
                        title={tutorial.title}
                        description={
                          <Space direction="vertical" size="small">
                            <Text type="secondary">{tutorial.description}</Text>
                            <Space>
                              <Tag color="blue">{tutorial.duration}</Tag>
                              <Tag color={tutorial.type === 'video' ? 'red' : 'green'}>
                                {tutorial.type === 'video' ? 'Video' : 'Hướng dẫn'}
                              </Tag>
                            </Space>
                          </Space>
                        }
                      />
                    </List.Item>
                  )}
                />
              </Card>

              {/* Status & Updates */}
              <Card title="Tình trạng hệ thống" className="status-card">
                <Space direction="vertical" size="large" style={{ width: '100%' }}>
                  <div className="status-item">
                    <Space>
                      <CheckCircleOutlined style={{ color: '#52c41a' }} />
                      <Text strong>Hệ thống thanh toán</Text>
                    </Space>
                    <Tag color="success">Hoạt động bình thường</Tag>
                  </div>
                  
                  <div className="status-item">
                    <Space>
                      <CheckCircleOutlined style={{ color: '#52c41a' }} />
                      <Text strong>Dịch vụ đặt vé</Text>
                    </Space>
                    <Tag color="success">Hoạt động bình thường</Tag>
                  </div>
                  
                  <div className="status-item">
                    <Space>
                      <ClockCircleOutlined style={{ color: '#faad14' }} />
                      <Text strong>Gửi email</Text>
                    </Space>
                    <Tag color="warning">Chậm hơn bình thường</Tag>
                  </div>
                </Space>

                <Divider />

                <div className="updates-section">
                  <Title level={5}>Cập nhật gần đây</Title>
                  <List size="small">
                    <List.Item>
                      <Text type="secondary">25/06/2024</Text>
                      <Text>Cải thiện tốc độ tải trang</Text>
                    </List.Item>
                    <List.Item>
                      <Text type="secondary">24/06/2024</Text>
                      <Text>Bổ sung phương thức thanh toán mới</Text>
                    </List.Item>
                  </List>
                </div>
              </Card>

              {/* Download Links */}
              <Card title="Tài liệu hỗ trợ" className="downloads-card">
                <List size="small">
                  <List.Item
                    actions={[
                      <Button type="link" icon={<DownloadOutlined />} key="download">
                        Tải xuống
                      </Button>
                    ]}
                  >
                    <List.Item.Meta
                      title="Hướng dẫn sử dụng"
                      description="PDF - 2.5MB"
                    />
                  </List.Item>
                  
                  <List.Item
                    actions={[
                      <Button type="link" icon={<DownloadOutlined />} key="download">
                        Tải xuống
                      </Button>
                    ]}
                  >
                    <List.Item.Meta
                      title="Điều khoản dịch vụ"
                      description="PDF - 1.2MB"
                    />
                  </List.Item>
                  
                  <List.Item
                    actions={[
                      <Button type="link" icon={<DownloadOutlined />} key="download">
                        Tải xuống
                      </Button>
                    ]}
                  >
                    <List.Item.Meta
                      title="Chính sách bảo mật"
                      description="PDF - 800KB"
                    />
                  </List.Item>
                </List>
              </Card>
            </Col>
          </Row>

          {/* Contact Form */}
          <section className="contact-section">
            <Card title="Vẫn cần hỗ trợ?" className="contact-form-card">
              <Row gutter={[32, 32]}>
                <Col xs={24} lg={12}>
                  <Paragraph>
                    Không tìm thấy câu trả lời? Hãy gửi câu hỏi cho chúng tôi và 
                    chúng tôi sẽ phản hồi trong thời gian sớm nhất.
                  </Paragraph>
                  
                  <Space direction="vertical" size="large" style={{ width: '100%' }}>
                    <Input placeholder="Tiêu đề câu hỏi" />
                    <Input.TextArea 
                      rows={4} 
                      placeholder="Mô tả chi tiết vấn đề của bạn..."
                    />
                    <Button type="primary" size="large" icon={<MessageOutlined />}>
                      Gửi câu hỏi
                    </Button>
                  </Space>
                </Col>
                
                <Col xs={24} lg={12}>
                  <div className="contact-info">
                    <Title level={4}>Thông tin liên hệ</Title>
                    <Space direction="vertical" size="middle">
                      <div>
                        <Text strong>Email hỗ trợ:</Text>
                        <Text> support@unitic.com</Text>
                      </div>
                      <div>
                        <Text strong>Hotline:</Text>
                        <Text> 1900-xxxx</Text>
                      </div>
                      <div>
                        <Text strong>Giờ làm việc:</Text>
                        <Text> 8:00 - 22:00 (Thứ 2 - Chủ nhật)</Text>
                      </div>
                      <div>
                        <Text strong>Thời gian phản hồi:</Text>
                        <Text> Trong vòng 2 giờ</Text>
                      </div>
                    </Space>
                  </div>
                </Col>
              </Row>
            </Card>
          </section>
        </div>
      </div>
    </MainLayout>
  );
};

export default HelpPage;
