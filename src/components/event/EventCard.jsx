import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  CalendarOutlined, 
  EnvironmentOutlined, 
  StarOutlined, 
  HeartOutlined, 
  HeartFilled, 
  TeamOutlined,
  ClockCircleOutlined
} from '@ant-design/icons';
import { motion } from 'framer-motion';
import { Badge, Progress, Tooltip } from 'antd';
import '../../assets/scss/EventCard.scss';
import eventPlaceholder from '../../assets/img/event1.jpeg';
const EventCard = ({ 
  event, 
  horizontal = false, 
  compact = false,
  onLike
}) => {
  const navigate = useNavigate();
  const { 
    id, 
    title, 
    image, 
    date, 
    time,
    location, 
    description, 
    price, 
    category,
    isFeatured,
    soldCount = 0,
    capacity = 100,
    rating = 4.5,
    isLiked = false
  } = event;
  
  // Format date
  const formatDate = (dateString) => {
    const options = { day: 'numeric', month: 'short', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('vi-VN', options);
  };
  
  // Format time
  const formatTime = (timeString) => {
    return timeString || '19:00';
  };
  
  // Format price
  const formatPrice = (priceValue) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(priceValue);
  };
  
  // Calculate event status
  const getEventStatus = () => {
    const eventDate = new Date(date);
    const now = new Date();
    
    if (soldCount >= capacity) {
      return { text: 'Hết vé', class: 'sold-out' };
    } else if (eventDate < now) {
      return { text: 'Đã kết thúc', class: 'ended' };
    } else if (eventDate.getTime() - now.getTime() < 7 * 24 * 60 * 60 * 1000) {
      return { text: 'Sắp diễn ra', class: 'soon' };
    } else {
      return { text: 'Còn vé', class: 'available' };
    }
  };
  
  // Calculate sold percentage
  const soldPercentage = Math.round((soldCount / capacity) * 100);
  
  const eventStatus = getEventStatus();
  
  const handleCardClick = () => {
    navigate(`/events/${id}`);
  };
  
  const handleLikeClick = (e) => {
    e.stopPropagation();
    if (onLike) onLike(id);
  };
  
  // If compact mode is enabled, render a simplified card
  if (compact) {
    return (
      <motion.div 
        className="event-card event-card--compact"
        whileHover={{ y: -8, boxShadow: '0 12px 30px rgba(142, 202, 230, 0.3)' }}
        onClick={handleCardClick}
      >
        <div className="event-card__image">
          <img src={image || eventPlaceholder} alt={title} />
          <div className="event-card__date">
            <CalendarOutlined className="icon" /> {formatDate(date)}
          </div>
          {isFeatured && <div className="event-card__featured">Hot</div>}
        </div>
        
        <div className="event-card__content">
          <h3 className="event-card__title">{title}</h3>
          
          <div className="event-card__footer">
            <div className="event-card__price">{formatPrice(price)}</div>
            <div className="event-card__status">
              <span className={`status-badge ${eventStatus.class}`}>{eventStatus.text}</span>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }
  
  // Normal card mode
  if (horizontal) {
    return (
      <motion.div 
        className="event-card event-card--horizontal"
        whileHover={{ y: -5, boxShadow: '0 12px 30px rgba(142, 202, 230, 0.3)' }}
        onClick={handleCardClick}
      >
        <div className="event-card__image">
          <img src={image || eventPlaceholder} alt={title} />
          {isFeatured && <div className="event-card__featured">Hot</div>}
          <div className="event-card__status">
            <span className={`status-badge ${eventStatus.class}`}>{eventStatus.text}</span>
          </div>
        </div>
        
        <div className="event-card__content">
          <h3 className="event-card__title">{title}</h3>
          
          <div className="event-card__meta">
            <div className="event-card__category">{category}</div>
            <div className="event-card__rating">
              <StarOutlined /> {rating}
            </div>
          </div>
          
          <div className="event-card__details">
            <div className="event-card__detail">
              <CalendarOutlined className="icon" /> {formatDate(date)}
            </div>
            <div className="event-card__detail">
              <ClockCircleOutlined className="icon" /> {formatTime(time)}
            </div>
            <div className="event-card__detail">
              <EnvironmentOutlined className="icon" /> {location}
            </div>
            <div className="event-card__detail">
              <TeamOutlined className="icon" /> {soldCount}/{capacity} đã bán
            </div>
          </div>
          
          <p className="event-card__description">{description}</p>
          
          <div className="event-card__footer">
            <div className="event-card__price">
              {formatPrice(price)}
            </div>
            <div className="event-card__actions">
              <Tooltip title={isLiked ? "Bỏ thích" : "Yêu thích"}>
                <button 
                  className={`like-button ${isLiked ? 'active' : ''}`}
                  onClick={handleLikeClick}
                >
                  {isLiked ? <HeartFilled /> : <HeartOutlined />}
                </button>
              </Tooltip>
              <button className="event-card__cta">Xem chi tiết</button>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }
  
  // Default vertical card
  return (
    <motion.div 
      className="event-card"
      whileHover={{ y: -8, boxShadow: '0 12px 30px rgba(142, 202, 230, 0.3)' }}
      onClick={handleCardClick}
    >
      <div className="event-card__image">
        <img src={image || eventPlaceholder} alt={title} />
        
        <div className="event-card__date">
          <CalendarOutlined className="icon" /> {formatDate(date)}
        </div>
        
        <div className="event-card__like">
          <button 
            className={`like-button ${isLiked ? 'active' : ''}`}
            onClick={handleLikeClick}
          >
            {isLiked ? <HeartFilled /> : <HeartOutlined />}
          </button>
        </div>
      </div>
      
      {isFeatured && (
        <div className="event-card__featured">Hot</div>
      )}
      
      <div className="event-card__category">{category}</div>
      
      <div className="event-card__status">
        <span className={`status-badge ${eventStatus.class}`}>{eventStatus.text}</span>
      </div>
      
      <div className="event-card__content">
        <div className="event-card__meta">
          <div className="event-card__rating">
            <StarOutlined /> {rating}
          </div>
          <div className="event-card__capacity">
            <Tooltip title={`${soldCount}/${capacity} đã bán`}>
              <Progress 
                percent={soldPercentage} 
                size="small" 
                showInfo={false}
                strokeColor={{
                  '0%': '#8ecae6',
                  '100%': '#219ebc',
                }}
              />
            </Tooltip>
          </div>
        </div>
        
        <h3 className="event-card__title">{title}</h3>
        
        <div className="event-card__location">
          <EnvironmentOutlined className="icon" /> {location}
        </div>
        
        <p className="event-card__description">{description}</p>
        
        <div className="event-card__footer">
          <div className="event-card__price">{formatPrice(price)}</div>
          <button className="event-card__cta">Chi tiết</button>
        </div>
      </div>
    </motion.div>
  );
};

export default EventCard;