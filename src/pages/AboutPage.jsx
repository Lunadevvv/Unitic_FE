import { Row, Col, Card, Typography, Button, Space, Divider } from 'antd';
import {
  TeamOutlined, RocketOutlined, HeartOutlined,
  SafetyOutlined, GlobalOutlined, TrophyOutlined
} from '@ant-design/icons';
import MainLayout from '../components/layout/MainLayout';
import '../assets/scss/AboutPage.scss';

const { Title, Paragraph } = Typography;

const AboutPage = () => {
  const features = [
    {
      icon: <RocketOutlined />,
      title: 'Công nghệ tiên tiến',
      description: 'Sử dụng công nghệ mới nhất để mang đến trải nghiệm tốt nhất cho người dùng'
    },
    {
      icon: <SafetyOutlined />,
      title: 'Bảo mật cao',
      description: 'Hệ thống bảo mật đa lớp đảm bảo thông tin và giao dịch của bạn được an toàn'
    },
    {
      icon: <GlobalOutlined />,
      title: 'Kết nối toàn cầu',
      description: 'Kết nối với hàng nghìn sự kiện từ khắp nơi trên thế giới'
    },
    {
      icon: <TrophyOutlined />,
      title: 'Chất lượng hàng đầu',
      description: 'Cam kết mang đến những sự kiện chất lượng cao và trải nghiệm tuyệt vời'
    }
  ];

  const team = [
    {
      name: 'Nguyễn Văn A',
      role: 'CEO & Founder',
      description: 'Với hơn 10 năm kinh nghiệm trong ngành công nghệ và quản lý sự kiện',
      avatar: '/src/assets/img/demo.jpg'
    },
    {
      name: 'Trần Thị B',
      role: 'CTO',
      description: 'Chuyên gia công nghệ với kinh nghiệm phát triển các nền tảng lớn',
      avatar: '/src/assets/img/demo.jpg'
    },
    {
      name: 'Lê Văn C',
      role: 'Head of Marketing',
      description: 'Chuyên gia marketing với nhiều năm kinh nghiệm trong ngành sự kiện',
      avatar: '/src/assets/img/demo.jpg'
    }
  ];

  return (
    <MainLayout>
      <div className="about-page">
        {/* Hero Section */}
        <section className="hero-section">
          <div className="hero-content">
            <Title level={1}>Về UniTic</Title>
            <Paragraph className="hero-description">
              Chúng tôi là nền tảng quản lý và đặt vé sự kiện hàng đầu Việt Nam, 
              cam kết mang đến trải nghiệm tuyệt vời cho cả người tổ chức và tham gia sự kiện.
            </Paragraph>
            <Button type="primary" size="large">
              Khám phá ngay
            </Button>
          </div>
        </section>

        {/* Mission Section */}
        <section className="mission-section">
          <div className="container">
            <Row gutter={[32, 32]} align="middle">
              <Col xs={24} lg={12}>
                <Title level={2}>Sứ mệnh của chúng tôi</Title>
                <Paragraph>
                  UniTic được sinh ra với sứ mệnh kết nối mọi người thông qua những trải nghiệm 
                  sự kiện tuyệt vời. Chúng tôi tin rằng mỗi sự kiện đều có thể tạo ra những 
                  kỷ niệm đáng nhớ và kết nối có ý nghĩa.
                </Paragraph>
                <Paragraph>
                  Với công nghệ tiên tiến và dịch vụ chuyên nghiệp, chúng tôi giúp người tổ chức 
                  dễ dàng quản lý sự kiện và người tham gia có được trải nghiệm mượt mà từ 
                  khâu đặt vé đến tham dự sự kiện.
                </Paragraph>
              </Col>
              <Col xs={24} lg={12}>
                <img 
                  src="/src/assets/img/main_event.jpeg" 
                  alt="Our Mission" 
                  className="mission-image"
                />
              </Col>
            </Row>
          </div>
        </section>

        {/* Features Section */}
        <section className="features-section">
          <div className="container">
            <Title level={2} className="section-title">Tại sao chọn UniTic?</Title>
            <Row gutter={[24, 24]}>
              {features.map((feature, index) => (
                <Col xs={24} sm={12} lg={6} key={index}>
                  <Card className="feature-card" hoverable>
                    <div className="feature-icon">{feature.icon}</div>
                    <Title level={4}>{feature.title}</Title>
                    <Paragraph>{feature.description}</Paragraph>
                  </Card>
                </Col>
              ))}
            </Row>
          </div>
        </section>

        {/* Stats Section */}
        <section className="stats-section">
          <div className="container">
            <Row gutter={[32, 32]} className="stats-row">
              <Col xs={12} sm={6}>
                <div className="stat-item">
                  <Title level={2}>10K+</Title>
                  <Paragraph>Sự kiện đã tổ chức</Paragraph>
                </div>
              </Col>
              <Col xs={12} sm={6}>
                <div className="stat-item">
                  <Title level={2}>500K+</Title>
                  <Paragraph>Người dùng tin tưởng</Paragraph>
                </div>
              </Col>
              <Col xs={12} sm={6}>
                <div className="stat-item">
                  <Title level={2}>50+</Title>
                  <Paragraph>Thành phố phủ sóng</Paragraph>
                </div>
              </Col>
              <Col xs={12} sm={6}>
                <div className="stat-item">
                  <Title level={2}>99.9%</Title>
                  <Paragraph>Thời gian hoạt động</Paragraph>
                </div>
              </Col>
            </Row>
          </div>
        </section>

        {/* Team Section */}
        <section className="team-section">
          <div className="container">
            <Title level={2} className="section-title">Đội ngũ của chúng tôi</Title>
            <Paragraph className="section-description">
              Những con người tài năng và đầy nhiệt huyết đứng sau thành công của UniTic
            </Paragraph>
            <Row gutter={[24, 24]}>
              {team.map((member, index) => (
                <Col xs={24} sm={12} lg={8} key={index}>
                  <Card className="team-card" hoverable>
                    <div className="team-avatar">
                      <img src={member.avatar} alt={member.name} />
                    </div>
                    <Title level={4}>{member.name}</Title>
                    <Paragraph className="team-role">{member.role}</Paragraph>
                    <Paragraph>{member.description}</Paragraph>
                  </Card>
                </Col>
              ))}
            </Row>
          </div>
        </section>

        {/* Values Section */}
        <section className="values-section">
          <div className="container">
            <Row gutter={[32, 32]} align="middle">
              <Col xs={24} lg={12}>
                <img 
                  src="/src/assets/img/event2.jpeg" 
                  alt="Our Values" 
                  className="values-image"
                />
              </Col>
              <Col xs={24} lg={12}>
                <Title level={2}>Giá trị cốt lõi</Title>
                <Space direction="vertical" size="large" className="values-list">
                  <div className="value-item">
                    <HeartOutlined className="value-icon" />
                    <div>
                      <Title level={4}>Tận tâm</Title>
                      <Paragraph>Chúng tôi luôn đặt khách hàng làm trung tâm trong mọi quyết định</Paragraph>
                    </div>
                  </div>
                  <div className="value-item">
                    <TeamOutlined className="value-icon" />
                    <div>
                      <Title level={4}>Hợp tác</Title>
                      <Paragraph>Làm việc cùng nhau để tạo ra những kết quả tuyệt vời</Paragraph>
                    </div>
                  </div>
                  <div className="value-item">
                    <RocketOutlined className="value-icon" />
                    <div>
                      <Title level={4}>Đổi mới</Title>
                      <Paragraph>Không ngừng cải tiến và áp dụng công nghệ mới</Paragraph>
                    </div>
                  </div>
                </Space>
              </Col>
            </Row>
          </div>
        </section>
      </div>
    </MainLayout>
  );
};

export default AboutPage;
