import React from 'react';
import { Layout, Carousel, Row, Col, Card, Avatar, Divider, Flex } from 'antd';
import { UserOutlined, FacebookOutlined, YoutubeOutlined } from '@ant-design/icons'; 
import '../scss/HomePage.scss';   
import { useNavigate } from 'react-router-dom';
const { Header, Content, Footer } = Layout;

const HomePage = () => {
  const navigate = useNavigate();
  return (
    <Layout className="homepage_container">
      <Header className="homepage_header">
        <div className="logo">
          <div className="text-logo">UniTic</div>
        </div>
        <div className="top-navigation">
          <span>Trang chủ</span>
          <span>Sự kiện</span>
          <span>Về chúng tôi</span>
          <button className="login-button" onClick={()=>navigate('/signin')}>Đăng nhập</button>
        </div>
      </Header>

      <Content className="homepage_body">
        <div className="homepage_carousel">
          <Carousel autoplay>
            <div>
              <div className="carousel-item gradient-primary">
                <h2>Gặp Gỡ Chuyên Gia Tại Đại Học FPT 2025</h2>
                <p>Nơi chia sẻ kiến thức, kinh nghiệm và nhận các phần quà hấp dẫn khi tham gia</p>
                <button className="call-to-action-button">Xem chi tiết</button>
              </div>
            </div>
            <div>
              <div className="carousel-item gradient-secondary">
                <h2>CONGRATULATIONS ON GRADUATION!</h2>
                <p>Chúc mừng các bạn tân cử nhân!</p>
              </div>
            </div>
          </Carousel>
        </div>

        <h3 style={{ textAlign: 'center', margin: '40px 0 20px' }}>Các sự kiện, buổi hội thảo hấp dẫn, hữu ích</h3>

        <div className="event_block">
          <div className="left_event_block">
            <Card className="event-card">
              <div className="event-thumbnail event-bg-1"></div>
              <div className="event-details">
                <h4>Giải trí đông sông Cửu Long "tết mood tuổi trẻ, cháy cùng đam mê" tại FPTU Fest</h4>
                <p>Ngày 15/05/2025, tại Sân vận động trường Đại học FPT TP.HCM</p>
              </div>
            </Card>
            <Card className="event-card">
              <div className="event-thumbnail event-bg-2"></div>
              <div className="event-details">
                <h4>3 'Anh trai Duy' góp mặt tại FPTU Game mùa 3</h4>
                <p>Ngày 20/05/2025, tại Sân vận động trường Đại học FPT TP.HCM</p>
              </div>
            </Card>
            <Card className="event-card">
              <div className="event-thumbnail event-bg-3"></div>
              <div className="event-details">
                <h4>FPT AI-Cons 2025: Sân chơi sáng tạo nội dung bằng AI cho học sinh sinh viên FPT</h4>
                <p>Ngày 25/05/2025, tại Phòng hội thảo trường Đại học FPT TP.HCM</p>
              </div>
            </Card>
          </div>
          <div className="right_event_block">
            <Card className="main-event-card">
              <div className="main-event-image main-event-bg"></div>
              <h3>Giải trí đông sông Cửu Long "tết mood tuổi trẻ, cháy cùng đam mê" tại FPTU Fest</h3>
              <p>Sự kiện lớn nhất năm của FPTU Fest sẽ diễn ra vào ngày 15/05/2025 với nhiều hoạt động hấp dẫn và các nghệ sĩ nổi tiếng.</p>
            </Card>
          </div>
        </div>

        <h3 style={{ textAlign: 'center', margin: '40px 0 20px' }}>Đa dạng lĩnh vực</h3>
        <div className="major_display">
          <Row gutter={[16, 16]} justify="center">
            <Col xs={12} sm={8} md={6} lg={3} className="major_display_item">
              <Card hoverable className="major-card">Kinh doanh</Card>
            </Col>
            <Col xs={12} sm={8} md={6} lg={3} className="major_display_item">
              <Card hoverable className="major-card">Marketing</Card>
            </Col>
            <Col xs={12} sm={8} md={6} lg={3} className="major_display_item">
              <Card hoverable className="major-card">Nghệ thuật</Card>
            </Col>
            <Col xs={12} sm={8} md={6} lg={3} className="major_display_item">
              <Card hoverable className="major-card">Thiết kế đồ họa</Card>
            </Col>
            <Col xs={12} sm={8} md={6} lg={3} className="major_display_item">
              <Card hoverable className="major-card">Tài chính</Card>
            </Col>
            <Col xs={12} sm={8} md={6} lg={3} className="major_display_item">
              <Card hoverable className="major-card">Truyền thông</Card>
            </Col>
            <Col xs={12} sm={8} md={6} lg={3} className="major_display_item">
              <Card hoverable className="major-card">Ngôn ngữ</Card>
            </Col>
            <Col xs={12} sm={8} md={6} lg={3} className="major_display_item">
              <Card hoverable className="major-card">Công nghệ thông tin</Card>
            </Col>
          </Row>
        </div>

        <h3 style={{ textAlign: 'center', margin: '40px 0 20px' }}>Có sự góp mặt của các chuyên gia hàng đầu lĩnh vực</h3>

        <div className="feature_">
          <Row gutter={24} justify="center">
            <Col xs={24} sm={12} md={8} lg={6}>
              <Card className="expert-card" cover={<div className="expert-cover expert-bg-1"></div>}>
                <Card.Meta
                  title="Ông Hoàng Nam Tiến"
                  description="Chủ tịch FPT Software"
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} md={8} lg={6}>
              <Card className="expert-card" cover={<div className="expert-cover expert-bg-2"></div>}>
                <Card.Meta
                  title="Thầy Nguyễn Thế Hoàng"
                  description="Chủ nhiệm bộ môn Toán Đại học FPT TP.HCM"
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} md={8} lg={6}>
              <Card className="expert-card" cover={<div className="expert-cover expert-bg-3"></div>}>
                <Card.Meta
                  title="Diễn giả Ngô Minh Hiếu"
                  description="Co-founder HOCMAI, diễn giả nổi tiếng"
                />
              </Card>
            </Col>
          </Row>
        </div>

        <h3 style={{ textAlign: 'center', margin: '40px 0 20px' }}>Các nhà tài trợ nổi tiếng</h3>

        <div className="brand_banner">
          <Flex gap={24} justify="center" align="center" wrap="wrap">
            <div className="sponsor-logo sponsor-1">Nestle</div>
            <div className="sponsor-logo sponsor-2">TPBank</div>
            <div className="sponsor-logo sponsor-3">Toshiba</div>
            <div className="sponsor-logo sponsor-4">Intel</div>
          </Flex>
        </div>

        <div className="introduction">
          <div className="intro-content">
            <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>UniTic</h2>
            <p style={{ textAlign: 'center', maxWidth: '800px', margin: '0 auto' }}>
              Nơi sinh viên kết nối và chinh phục những ý tưởng mới
            </p>
          </div>
        </div>
      </Content>

      <Footer className="homepage_footer">
        <Row gutter={[16, 16]}>
          <Col xs={24} md={8}>
            <div className="footer-section">
              <h3>UniTic</h3>
              <p>
                UniTic là nền tảng kết nối sinh viên với các sự kiện, hội thảo,
                và cơ hội nghề nghiệp. Chúng tôi cam kết mang đến những trải nghiệm
                học hỏi và phát triển tốt nhất cho sinh viên.
              </p>
            </div>
          </Col>
          <Col xs={24} md={8}>
            <div className="footer-section">
              <h3>Social Media</h3>
              <p>
                <a href="#" style={{ marginRight: '10px' }}><FacebookOutlined className="social-icon" /></a>
                <a href="#"><YoutubeOutlined className="social-icon" /></a>
              </p>
            </div>
          </Col>
          <Col xs={24} md={8}>
            <div className="footer-section">
              <h3>Về chúng tôi</h3>
              <ul>
                <li>Giới thiệu</li>
                <li>Liên hệ</li>
                <li>Điều khoản sử dụng</li>
                <li>Chính sách bảo mật</li>
              </ul>
            </div>
          </Col>
        </Row>
      </Footer>

      <div className="homepage_sidebar">
      </div>
    </Layout>
  );
};

export default HomePage;