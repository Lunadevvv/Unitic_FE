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
import { useSelector } from 'react-redux';
const EventCard = ({ 
  event, 
  horizontal = false, 
  compact = false,
  onLike
}) => {
  const navigate = useNavigate();
  
  // Map API fields to component fields
  const {
    eventID: id,
    name: title,
    description,
    location,
    date_Start: startDate,
    date_End: endDate,
    price,
    cateID: categoryId,
    slot: capacity,
    image,
    status
  } = event;
  
    const { categories: categoryList } = useSelector(state => state.category);

  // Function to get category name by ID
  const getCategoryName = (cateID) => {
    const category = categoryList?.find(cat => cat.cateID === cateID);
    return category?.name || cateID;
  };

  const category = getCategoryName(categoryId);
  // Default values for fields not in API
  const eventLocation = location || 'Địa điểm sẽ được thông báo';
  const isFeatured = status === 1;
  const soldCount = 0; // Not provided by API
  const rating = 4.5; // Not provided by API
  const isLiked = false; // Not provided by API
  
  // Format time
  const formatTime = (dateString) => {
    if (!dateString) return '19:00';
    return new Date(dateString).toLocaleTimeString('vi-VN', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };


  // Format price
  const formatPrice = (priceValue) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(priceValue);
  };
  
  // Calculate event status
  const getEventStatus = () => {
    if (!startDate) return { text: 'Bấm vào để xem chi tiết', class: 'pending' };
    
    const eventStartDate = new Date(startDate);
    const now = new Date();
    
    if (soldCount >= capacity) {
      return { text: 'Hết vé', class: 'sold-out' };
    } else if (eventStartDate < now) {
      return { text: 'Đã kết thúc', class: 'ended' };
    } else if (eventStartDate.getTime() - now.getTime() < 7 * 24 * 60 * 60 * 1000) {
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
          <img src={image} alt={title} />
          
          {isFeatured && <div className="event-card__featured">Hot</div>}
        </div>
        
        <div className="event-card__content">
          <h3 className="event-card__title" style={{
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  fontWeight: 700,
  fontSize: '1.08em',
  letterSpacing: '0.2px',
  marginBottom: 6,
}}>{title}</h3>
          
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
          <h3 className="event-card__title" style={{
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  fontWeight: 700,
  fontSize: '1.08em',
  letterSpacing: '0.2px',
  marginBottom: 6,
}}>{title}</h3>
          
          <div className="event-card__meta">
            <div className="event-card__rating">
              <StarOutlined /> {rating}
            </div>
          </div>
          
          <div className="event-card__details">
            <div className="event-card__detail">
             
            </div>
            <div className="event-card__detail">
              <ClockCircleOutlined className="icon" /> {formatTime(startDate)}
            </div>
            <div className="event-card__detail">
              <EnvironmentOutlined className="icon" /> {eventLocation}
            </div>
            <div className="event-card__detail">
              <TeamOutlined className="icon" /> {capacity} cồn lại
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
      
      
      <div className="event-card__status">
      
      </div>
      
      <div className="event-card__content">
        <div className="event-card__meta">
          <div className="event-card__rating">
            <StarOutlined /> {rating}
          </div>
          <div className="event-card__capacity">
            <Tooltip title={`${capacity}`}>
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
        
        <h3 className="event-card__title" style={{
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  fontWeight: 700,
  fontSize: '1.08em',
  letterSpacing: '0.2px',
  marginBottom: 6,
}}>{title}</h3>
        
        <div className="event-card__location">
          <EnvironmentOutlined className="icon" /> {eventLocation}
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