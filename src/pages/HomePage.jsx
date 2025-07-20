import React, { useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Layout, Carousel, Row, Col, Card, Flex, Button } from 'antd';
import { FacebookOutlined, YoutubeOutlined, ArrowRightOutlined } from '@ant-design/icons';
import { motion, useInView } from 'framer-motion';
import MainLayout from '../components/layout/MainLayout';
import { fetchEvents } from '../store/actions/eventsActions';
import '../assets/scss/HomePage.scss';

const { Content } = Layout;

const HomePage = () => {
  const [scrollPosition, setScrollPosition] = useState(0);
  const dispatch = useDispatch();
  
  const { events, loading } = useSelector(state => state.events);
  
  const handleScroll = () => {
    const position = window.pageYOffset;
    setScrollPosition(position);
  };
  
  useEffect(() => {
    // Fetch events when component mounts
    dispatch(fetchEvents());
    
    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [dispatch]);

  const parallaxStyle = {
    transform: `translateY(${scrollPosition * 0.3}px)`,
  };

  const carouselRef = useRef(null);
  const eventSectionRef = useRef(null);
  const expertSectionRef = useRef(null);
  const sponsorSectionRef = useRef(null);
  const introSectionRef = useRef(null);
  
  const carouselInView = useInView(carouselRef, { once: false, amount: 0.3 });
  const eventSectionInView = useInView(eventSectionRef, { once: false, amount: 0.3 });
  const expertSectionInView = useInView(expertSectionRef, { once: false, amount: 0.3 });
  const sponsorSectionInView = useInView(sponsorSectionRef, { once: false, amount: 0.3 });
  const introSectionInView = useInView(introSectionRef, { once: false, amount: 0.3 });

  const renderFloatingElements = () => {
    return (
      <div className="floating-elements">
        <motion.div 
          className="floating-circle circle-1"
          animate={{
            y: [0, -30, 20, 10, 0],
            x: [0, 15, -20, 15, 0],
            scale: [1, 1.05, 0.95, 1.02, 1]
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            repeatType: "loop"
          }}
        />
        <motion.div 
          className="floating-circle circle-2"
          animate={{
            y: [0, 30, -15, 5, 0],
            x: [0, -20, 10, -5, 0],
            scale: [1, 0.95, 1.05, 0.98, 1]
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            repeatType: "loop",
            delay: 1
          }}
        />
        <motion.div 
          className="floating-circle circle-3"
          animate={{
            y: [0, -20, 15, -10, 0],
            x: [0, 10, -15, 5, 0],
            scale: [1, 1.02, 0.98, 1.03, 1]
          }}
          transition={{
            duration: 22,
            repeat: Infinity,
            repeatType: "loop",
            delay: 2
          }}
        />
        <motion.div 
          className="floating-square square-1"
          animate={{
            rotate: [0, 360],
            y: [0, -15, 10, -5, 0],
            x: [0, 10, -5, 15, 0]
          }}
          transition={{
            duration: 30,
            repeat: Infinity,
            repeatType: "loop"
          }}
        />
        <motion.div 
          className="floating-square square-2"
          animate={{
            rotate: [0, -360],
            y: [0, 20, -10, 5, 0],
            x: [0, -15, 10, -5, 0]
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            repeatType: "loop",
            delay: 1.5
          }}
        />
      </div>
    );
  };

  const fadeInVariant = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  const staggerContainerVariant = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariant = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  return (
    <MainLayout 
      headerProps={{
        showAnimation: true,
        transparent: true,
        fixed: false,
        showCart: false,
        showNotifications: false
      }}
      showFooter={true}
      className="homepage_container"
    >
      <div className="homepage_body">
        {renderFloatingElements()}
        
         <motion.div 
          className="homepage_carousel parallax-container" 
          ref={carouselRef}
          variants={fadeInVariant}
          initial="hidden"
          animate={carouselInView ? "visible" : "hidden"}
        >
          <Carousel 
            autoplay 
            effect="fade"
            dots={{ className: "custom-carousel-dots" }}
          >
            <div>
              <div className="carousel-item gradient-primary">
                <div className="parallax-bg carousel-bg-1" style={parallaxStyle}></div>
                <div className="carousel-content">
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                  >
                    <h2 className="carousel-title highlight-text">
                      Gặp Gỡ Chuyên Gia Tại Đại Học FPT 2025
                    </h2>
                  </motion.div>
                  <motion.p 
                    className="carousel-description"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.5 }}
                  >
                    Nơi chia sẻ kiến thức, kinh nghiệm và nhận các phần quà hấp dẫn khi tham gia
                  </motion.p>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.7 }}
                    whileHover={{ scale: 1.03, y: -3 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button 
                      className="call-to-action-button modern-button"
                      type="primary"
                      size="large"
                    >
                      <span className="button-text">Xem chi tiết</span>
                      <ArrowRightOutlined className="button-icon" />
                    </Button>
                  </motion.div>
                </div>
              </div>
            </div>
            <div>
              <div className="carousel-item gradient-secondary">
                <div className="parallax-bg carousel-bg-2" style={parallaxStyle}></div>
                <div className="carousel-content">
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                  >
                    <h2 className="carousel-title highlight-text">
                      CONGRATULATIONS ON GRADUATION!
                    </h2>
                  </motion.div>
                  <motion.p 
                    className="carousel-description"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.5 }}
                  >
                    Chúc mừng các bạn tân cử nhân!
                  </motion.p>
                </div>
              </div>
            </div>
          </Carousel>
        </motion.div>
        <div ref={eventSectionRef}>
          <motion.h3 
            className="section-title reveal-title"
            variants={{
              hidden: { opacity: 0 },
              visible: { opacity: 1, transition: { staggerChildren: 0.2 } }
            }}
            initial="hidden"
            animate={eventSectionInView ? "visible" : "hidden"}
          >
            <motion.span 
              className="title-text"
              variants={{
                hidden: { y: 50, opacity: 0 },
                visible: { y: 0, opacity: 1, transition: { duration: 0.5 } }
              }}
            >
              Các sự kiện, buổi hội thảo hấp dẫn, hữu ích
            </motion.span>
            <motion.span 
              className="title-decoration"
              variants={{
                hidden: { scaleX: 0 },
                visible: { scaleX: 1, transition: { duration: 0.5, delay: 0.3 } }
              }}
            ></motion.span>
          </motion.h3>

          <div className="event_block">
            <motion.div 
              className="left_event_block"
              variants={staggerContainerVariant}
              initial="hidden"
              animate={eventSectionInView ? "visible" : "hidden"}
            >
              <motion.div variants={itemVariant} whileHover={{ y: -8, scale: 1.02 }}>
                <Card className="event-card hover-scale">
                  <div className="event-thumbnail event-bg-1">
                    <div className="event-date shine-effect">15 <span>Tháng 5</span></div>
                    <div className="hover-overlay"></div>
                  </div>
                  <div className="event-details">
                    <h4 className="event-title">Giải trí đông sông Cửu Long "tết mood tuổi trẻ, cháy cùng đam mê" tại FPTU Fest</h4>
                    <p><i className="location-icon pulse-dot"></i> Sân vận động trường Đại học FPT TP.HCM</p>
                  </div>
                </Card>
              </motion.div>
              <motion.div variants={itemVariant} whileHover={{ y: -8, scale: 1.02 }}>
                <Card className="event-card hover-scale">
                  <div className="event-thumbnail event-bg-2">
                    <div className="event-date shine-effect">20 <span>Tháng 5</span></div>
                    <div className="hover-overlay"></div>
                  </div>
                  <div className="event-details">
                    <h4 className="event-title">3 'Anh trai Duy' góp mặt tại FPTU Game mùa 3</h4>
                    <p><i className="location-icon pulse-dot"></i> Sân vận động trường Đại học FPT TP.HCM</p>
                  </div>
                </Card>
              </motion.div>
              <motion.div variants={itemVariant} whileHover={{ y: -8, scale: 1.02 }}>
                <Card className="event-card hover-scale">
                  <div className="event-thumbnail event-bg-3">
                    <div className="event-date shine-effect">25 <span>Tháng 5</span></div>
                    <div className="hover-overlay"></div>
                  </div>
                  <div className="event-details">
                    <h4 className="event-title">FPT AI-Cons 2025: Sân chơi sáng tạo nội dung bằng AI cho học sinh sinh viên FPT</h4>
                    <p><i className="location-icon pulse-dot"></i> Phòng hội thảo trường Đại học FPT TP.HCM</p>
                  </div>
                </Card>
              </motion.div>
              <motion.div variants={itemVariant} whileHover={{ y: -8, scale: 1.02 }}>
                <Card className="event-card hover-scale">
                  <div className="event-thumbnail event-bg-3">
                    <div className="event-date shine-effect">25 <span>Tháng 5</span></div>
                    <div className="hover-overlay"></div>
                  </div>
                  <div className="event-details">
                    <h4 className="event-title">FPT AI-Cons 2025: Sân chơi sáng tạo nội dung bằng AI cho học sinh sinh viên FPT</h4>
                    <p><i className="location-icon pulse-dot"></i> Phòng hội thảo trường Đại học FPT TP.HCM</p>
                  </div>
                </Card>
              </motion.div>
               <motion.div variants={itemVariant} whileHover={{ y: -8, scale: 1.02 }}>
                <Card className="event-card hover-scale">
                  <div className="event-thumbnail event-bg-3">
                    <div className="event-date shine-effect">25 <span>Tháng 5</span></div>
                    <div className="hover-overlay"></div>
                  </div>
                  <div className="event-details">
                    <h4 className="event-title">FPT AI-Cons 2025: Sân chơi sáng tạo nội dung bằng AI cho học sinh sinh viên FPT</h4>
                    <p><i className="location-icon pulse-dot"></i> Phòng hội thảo trường Đại học FPT TP.HCM</p>
                  </div>
                </Card>
              </motion.div>
               <motion.div variants={itemVariant} whileHover={{ y: -8, scale: 1.02 }}>
                <Card className="event-card hover-scale">
                  <div className="event-thumbnail event-bg-3">
                    <div className="event-date shine-effect">25 <span>Tháng 5</span></div>
                    <div className="hover-overlay"></div>
                  </div>
                  <div className="event-details">
                    <h4 className="event-title">FPT AI-Cons 2025: Sân chơi sáng tạo nội dung bằng AI cho học sinh sinh viên FPT</h4>
                    <p><i className="location-icon pulse-dot"></i> Phòng hội thảo trường Đại học FPT TP.HCM</p>
                  </div>
                </Card>
              </motion.div>
            </motion.div>
            <motion.div 
              className="right_event_block"
              variants={fadeInVariant}
              initial="hidden"
              animate={eventSectionInView ? "visible" : "hidden"}
              transition={{ delay: 0.3 }}
              whileHover={{ y: -10, rotateX: 2, rotateY: -2 }}
            >
              <Card className="main-event-card tilt-effect">
                <div className="main-event-image main-event-bg">
                  <div className="featured-badge flash-animation">Nổi bật</div>
                  <div className="hover-overlay"></div>
                </div>
                <h3 className="main-event-title">Giải trí đông sông Cửu Long "tết mood tuổi trẻ, cháy cùng đam mê" tại FPTU Fest</h3>
                <p className="main-event-description">Sự kiện lớn nhất năm của FPTU Fest sẽ diễn ra vào ngày 15/05/2025 với nhiều hoạt động hấp dẫn và các nghệ sĩ nổi tiếng.</p>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button type="primary" className="view-details-btn">
                    <span>Xem chi tiết</span>
                    <span className="btn-hover-effect"></span>
                  </Button>
                </motion.div>
              </Card>
            </motion.div>
          </div>
        </div>

        <div ref={expertSectionRef}>
          <motion.h3 
            className="section-title reveal-title"
            variants={{
              hidden: { opacity: 0 },
              visible: { opacity: 1, transition: { staggerChildren: 0.2 } }
            }}
            initial="hidden"
            animate={expertSectionInView ? "visible" : "hidden"}
          >
            <motion.span 
              className="title-text"
              variants={{
                hidden: { y: 50, opacity: 0 },
                visible: { y: 0, opacity: 1, transition: { duration: 0.5 } }
              }}
            >
              Có sự góp mặt của các chuyên gia hàng đầu lĩnh vực
            </motion.span>
            <motion.span 
              className="title-decoration"
              variants={{
                hidden: { scaleX: 0 },
                visible: { scaleX: 1, transition: { duration: 0.5, delay: 0.3 } }
              }}
            ></motion.span>
          </motion.h3>

          <div className="feature_">
            <Row gutter={24} justify="center">
              <Col xs={24} sm={12} md={8} lg={6}>
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={expertSectionInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  whileHover={{ 
                    scale: 1.05, 
                    rotateY: 5, 
                    rotateX: 5, 
                    y: -10,
                    transition: { duration: 0.3 }
                  }}
                >
                  <Card className="expert-card perspective-card"
                    cover={<div className="expert-cover expert-bg-1">
                      <div className="expert-social">
                        <FacebookOutlined className="social-hover" />
                        <YoutubeOutlined className="social-hover" />
                      </div>
                      <div className="expert-overlay"></div>
                    </div>}>
                    <Card.Meta
                      title={<span className="expert-name">Ông Hoàng Nam Tiến</span>}
                      description={<span className="expert-role">Chủ tịch FPT Software</span>}
                    />
                  </Card>
                </motion.div>
              </Col>
              <Col xs={24} sm={12} md={8} lg={6}>
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={expertSectionInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  whileHover={{ 
                    scale: 1.05, 
                    rotateY: 5, 
                    rotateX: 5, 
                    y: -10,
                    transition: { duration: 0.3 }
                  }}
                >
                  <Card className="expert-card perspective-card"
                    cover={<div className="expert-cover expert-bg-2">
                      <div className="expert-social">
                        <FacebookOutlined className="social-hover" />
                        <YoutubeOutlined className="social-hover" />
                      </div>
                      <div className="expert-overlay"></div>
                    </div>}>
                    <Card.Meta
                      title={<span className="expert-name">Thầy Nguyễn Thế Hoàng</span>}
                      description={<span className="expert-role">Chủ nhiệm bộ môn Toán Đại học FPT TP.HCM</span>}
                    />
                  </Card>
                </motion.div>
              </Col>
              <Col xs={24} sm={12} md={8} lg={6}>
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={expertSectionInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  whileHover={{ 
                    scale: 1.05, 
                    rotateY: 5, 
                    rotateX: 5, 
                    y: -10,
                    transition: { duration: 0.3 }
                  }}
                >
                  <Card className="expert-card perspective-card"
                    cover={<div className="expert-cover expert-bg-3">
                      <div className="expert-social">
                        <FacebookOutlined className="social-hover" />
                        <YoutubeOutlined className="social-hover" />
                      </div>
                      <div className="expert-overlay"></div>
                    </div>}>
                    <Card.Meta
                      title={<span className="expert-name">Diễn giả Ngô Minh Hiếu</span>}
                      description={<span className="expert-role">Co-founder HOCMAI, diễn giả nổi tiếng</span>}
                    />
                  </Card>
                </motion.div>
              </Col>
            </Row>
          </div>
        </div>

        <div ref={sponsorSectionRef}>
          <motion.h3 
            className="section-title reveal-title"
            variants={{
              hidden: { opacity: 0 },
              visible: { opacity: 1, transition: { staggerChildren: 0.2 } }
            }}
            initial="hidden"
            animate={sponsorSectionInView ? "visible" : "hidden"}
          >
            <motion.span 
              className="title-text"
              variants={{
                hidden: { y: 50, opacity: 0 },
                visible: { y: 0, opacity: 1, transition: { duration: 0.5 } }
              }}
            >
              Các nhà tài trợ nổi tiếng
            </motion.span>
            <motion.span 
              className="title-decoration"
              variants={{
                hidden: { scaleX: 0 },
                visible: { scaleX: 1, transition: { duration: 0.5, delay: 0.3 } }
              }}
            ></motion.span>
          </motion.h3>

          <div className="brand_banner">
            <Flex gap={24} justify="center" align="center" wrap="wrap">
              <motion.div 
                className="sponsor-logo sponsor-1 reveal-sponsor"
                initial={{ opacity: 0, rotateY: 90 }}
                animate={sponsorSectionInView ? { opacity: 1, rotateY: 0 } : { opacity: 0, rotateY: 90 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                whileHover={{ y: -5, scale: 1.05, transition: { duration: 0.3 } }}
              >
                <span className="logo-text">Nestle</span>
                <div className="logo-glow"></div>
              </motion.div>
              <motion.div 
                className="sponsor-logo sponsor-2 reveal-sponsor"
                initial={{ opacity: 0, rotateY: 90 }}
                animate={sponsorSectionInView ? { opacity: 1, rotateY: 0 } : { opacity: 0, rotateY: 90 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                whileHover={{ y: -5, scale: 1.05, transition: { duration: 0.3 } }}
              >
                <span className="logo-text">TPBank</span>
                <div className="logo-glow"></div>
              </motion.div>
              <motion.div 
                className="sponsor-logo sponsor-3 reveal-sponsor"
                initial={{ opacity: 0, rotateY: 90 }}
                animate={sponsorSectionInView ? { opacity: 1, rotateY: 0 } : { opacity: 0, rotateY: 90 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                whileHover={{ y: -5, scale: 1.05, transition: { duration: 0.3 } }}
              >
                <span className="logo-text">Toshiba</span>
                <div className="logo-glow"></div>
              </motion.div>
              <motion.div 
                className="sponsor-logo sponsor-4 reveal-sponsor"
                initial={{ opacity: 0, rotateY: 90 }}
                animate={sponsorSectionInView ? { opacity: 1, rotateY: 0 } : { opacity: 0, rotateY: 90 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                whileHover={{ y: -5, scale: 1.05, transition: { duration: 0.3 } }}
              >
                <span className="logo-text">Intel</span>
                <div className="logo-glow"></div>
              </motion.div>
            </Flex>
          </div>
        </div>

        <motion.div 
          className="introduction parallax-section" 
          ref={introSectionRef}
          initial={{ opacity: 0 }}
          animate={introSectionInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.div 
            className="parallax-bg-intro" 
            style={{transform: `translateY(${scrollPosition * 0.2}px)`}}
          ></motion.div>
          <div className="intro-content">
            <motion.h2 
              className="intro-title animate-gradient"
              initial={{ opacity: 0, y: 30 }}
              animate={introSectionInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 0.6 }}
            >
              UniTic
            </motion.h2>
            <motion.p 
              className="intro-description slide-up-text"
              initial={{ opacity: 0, y: 30 }}
              animate={introSectionInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Unitic là nền tảng đặt vé sự kiện, hội thảo và kết nối sinh viên với các buổi gặp gỡ chuyên gia hàng đầu. Chúng tôi cung cấp những trải nghiệm học hỏi và phát triển tốt nhất cho sinh viên, giúp họ mở rộng kiến thức và kỹ năng trong môi trường học tập hiện đại.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={introSectionInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button type="primary" size="large" className="join-button">
                <span>Tham gia ngay</span>
                <span className="btn-shine"></span>
              </Button>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </MainLayout>
  );
};

export default HomePage;