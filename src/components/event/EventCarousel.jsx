import React, { useRef } from 'react';
import { Carousel, Row, Col, Button } from 'antd';
import { RightOutlined, LeftOutlined } from '@ant-design/icons';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import EventCard from './EventCard';
import '../../assets/scss/EventCarousel.scss';

const EventCarousel = ({ events = [], slidesToShow = 3, autoplay = true }) => {
  const carouselRef = useRef(null);

  const settings = {
    dots: true,
    infinite: events.length > slidesToShow,
    speed: 800,
    slidesToShow: slidesToShow,
    slidesToScroll: 1,
    autoplay: autoplay,
    autoplaySpeed: 5000,
    pauseOnHover: true,
    responsive: [
      {
        breakpoint: 1200,
        settings: {
          slidesToShow: Math.min(3, slidesToShow),
          slidesToScroll: 1,
        }
      },
      {
        breakpoint: 992,
        settings: {
          slidesToShow: Math.min(2, slidesToShow),
          slidesToScroll: 1,
        }
      },
      {
        breakpoint: 576,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        }
      }
    ]
  };

  // No events case
  if (!events || events.length === 0) {
    return null;
  }

  const goToPrev = () => {
    if (carouselRef.current) {
      carouselRef.current.prev();
    }
  };

  const goToNext = () => {
    if (carouselRef.current) {
      carouselRef.current.next();
    }
  };

  // If only 1 event, show a featured style card
  if (events.length === 1) {
    return (
      <div className="single-featured-event">
        <Row gutter={24}>
          <Col xs={24} md={16}>
            <motion.div
              className="featured-event-image"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <img 
                src={events[0].image || '../../assets/img/event1.jpeg'} 
                alt={events[0].title} 
              />
              <div className="event-overlay"></div>
            </motion.div>
          </Col>
          <Col xs={24} md={8}>
            <motion.div
              className="featured-event-details"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="featured-badge">Sự kiện nổi bật</div>
              <h2 className="featured-event-title">{events[0].title}</h2>
              <p className="featured-event-description">{events[0].description}</p>
              <div className="featured-event-info">
                <div className="info-item">
                  <LeftOutlined className="info-icon" />
                  <span>{new Date(events[0].date).toLocaleDateString('vi-VN')}</span>
                </div>
                <div className="info-item">
                  <LeftOutlined className="info-icon" />
                  <span>{events[0].location}</span>
                </div>
              </div>
              <Link to={`/events/${events[0].id}`} className="featured-event-button">
                Xem chi tiết
                <RightOutlined />
              </Link>
            </motion.div>
          </Col>
        </Row>
      </div>
    );
  }

  return (
    <div className="event-carousel-container">
      <div className="carousel-controls">
        <Button 
          className="carousel-arrow carousel-prev" 
          icon={<LeftOutlined />} 
          onClick={goToPrev}
        />
        <Button 
          className="carousel-arrow carousel-next" 
          icon={<RightOutlined />} 
          onClick={goToNext}
        />
      </div>
      
      <Carousel 
        {...settings} 
        className="event-carousel"
        ref={carouselRef}
      >
        {events.map((event, index) => (
          <div key={index} className="carousel-slide">
            <div className="carousel-slide-inner">
              <EventCard event={event} />
            </div>
          </div>
        ))}
      </Carousel>
    </div>
  );
};

export default EventCarousel;