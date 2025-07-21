import React, { useState, useEffect } from 'react';
import { 
  Row, Col, Input, Button, Select, 
  Pagination, Empty, Spin, Breadcrumb, Divider, Tag
} from 'antd';
import { 
  SearchOutlined, FilterOutlined, CalendarOutlined, 
  AppstoreOutlined, BarsOutlined, HomeOutlined,
  ArrowRightOutlined, FireOutlined, ThunderboltOutlined
} from '@ant-design/icons';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import EventCard from '../../components/event/EventCard';
import EventCarousel from '../../components/event/EventCarousel';
import CategoryTabs from '../../components/event/CategoryTabs';
import EventFilter from '../../components/event/EventFilter';
import MainLayout from '../../components/layout/MainLayout';
import '../../assets/scss/EventPage.scss';
import { useEvents } from '../../hooks/useEvents';

const { Option } = Select;

const EventsPage = () => {
  const { events, loading, error } = useEvents();
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState('grid');
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterVisible, setFilterVisible] = useState(false);
  const [sortBy, setSortBy] = useState('newest');
  const pageSize = 9;
  
  useEffect(() => {
    if (events) {
      let filtered = [...events];
      
      if (activeCategory !== 'all') {
        filtered = filtered.filter(event => event.category === activeCategory);
      }
      
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        filtered = filtered.filter(event => 
          event.title.toLowerCase().includes(query) || 
          event.description.toLowerCase().includes(query) ||
          event.location.toLowerCase().includes(query)
        );
      }
      
      switch (sortBy) {
        case 'newest':
          filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
          break;
        case 'price-low':
          filtered.sort((a, b) => a.price - b.price);
          break;
        case 'price-high':
          filtered.sort((a, b) => b.price - a.price);
          break;
        case 'popularity':
          filtered.sort((a, b) => b.soldCount - a.soldCount);
          break;
        default:
          break;
      }
      
      setFilteredEvents(filtered);
      setCurrentPage(1);
    }
  }, [events, activeCategory, searchQuery, sortBy]);
  
  const featuredEvents = events?.filter(event => event.isFeatured) || [];
  
  const upcomingEvents = events?.filter(event => {
    const eventDate = new Date(event.date);
    const now = new Date();
    const nextWeek = new Date();
    nextWeek.setDate(now.getDate() + 7);
    return eventDate >= now && eventDate <= nextWeek;
  }) || [];
  
  const paginatedEvents = filteredEvents.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );
  
  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 400, behavior: 'smooth' });
  };
  
  const categories = [
    'all',
    ...new Set(events?.map(event => event.category) || [])
  ];
  
  const handleSortChange = (value) => {
    setSortBy(value);
  };
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };
  
  return (
    <MainLayout>
      <div className="events-page">
      <div className="event-hero">
        <div className="event-hero-content">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Khám Phá Sự Kiện
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Trải nghiệm những sự kiện đặc sắc từ âm nhạc, nghệ thuật đến thể thao, công nghệ và giáo dục
          </motion.p>
          
          <motion.div 
            className="search-container"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Input
              placeholder="Tìm kiếm sự kiện theo tên, địa điểm..."
              prefix={<SearchOutlined />}
              size="large"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="hero-search-input"
            />
            <Button type="primary" icon={<SearchOutlined />} size="large">
              Tìm Kiếm
            </Button>
          </motion.div>
          
          <motion.div 
            className="hero-categories"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <span className="popular-text">Phổ biến:</span>
            {categories.slice(1, 5).map((category, index) => (
              <Tag 
                key={index} 
                className="hero-category-tag"
                onClick={() => setActiveCategory(category)}
              >
                {category}
              </Tag>
            ))}
          </motion.div>
        </div>
        <div className="hero-overlay"></div>
        <div className="hero-background"></div>
        <div className="hero-floating-elements">
          <div className="floating-circle circle-1"></div>
          <div className="floating-circle circle-2"></div>
          <div className="floating-square"></div>
          <div className="floating-circle circle-3"></div>
        </div>
      </div>
      
      <div className="event-content-container">
        <Breadcrumb 
          className="event-breadcrumb"
          items={[
            {
              title: (
                <Link to="/">
                  <HomeOutlined /> Trang chủ
                </Link>
              ),
            },
            {
              title: 'Sự kiện',
            },
            ...(activeCategory !== 'all' ? [{ title: activeCategory }] : []),
          ]}
        />
        
        {featuredEvents.length > 0 && (
          <section className="event-section featured-events-section">
            <div className="section-header">
              <h2 className="section-title">
                <FireOutlined className="section-icon" />
                Sự kiện nổi bật
              </h2>
              <Link to="/featured-events" className="view-all-link">
                Xem tất cả <ArrowRightOutlined />
              </Link>
            </div>
            
            <EventCarousel events={featuredEvents} />
          </section>
        )}
        
        {upcomingEvents.length > 0 && (
          <section className="event-section upcoming-events-section">
            <div className="section-header">
              <h2 className="section-title">
                <ThunderboltOutlined className="section-icon" />
                Sắp diễn ra
              </h2>
              <Link to="/upcoming-events" className="view-all-link">
                Xem tất cả <ArrowRightOutlined />
              </Link>
            </div>
            
            <div className="upcoming-events-grid">
              <Row gutter={[24, 24]}>
                {upcomingEvents.slice(0, 4).map(event => (
                  <Col xs={24} sm={12} md={6} key={event.id}>
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4 }}
                      whileHover={{ y: -10 }}
                    >
                      <EventCard 
                        event={event} 
                        compact={true}
                      />
                    </motion.div>
                  </Col>
                ))}
              </Row>
            </div>
          </section>
        )}
        
        <section className="event-section main-events-section">
          <div className="events-control-panel">
            <CategoryTabs 
              categories={categories} 
              activeCategory={activeCategory}
              onChange={setActiveCategory}
            />
            
            <div className="events-toolbar">
              <div className="toolbar-left">
                <Button 
                  icon={<FilterOutlined />}
                  onClick={() => setFilterVisible(!filterVisible)}
                  className={`filter-button ${filterVisible ? 'active' : ''}`}
                >
                  Lọc
                </Button>
                
                <Select 
                  defaultValue="newest" 
                  style={{ width: 150 }}
                  onChange={handleSortChange}
                  value={sortBy}
                  className="sort-select"
                >
                  <Option value="newest">Mới nhất</Option>
                  <Option value="price-low">Giá thấp - cao</Option>
                  <Option value="price-high">Giá cao - thấp</Option>
                  <Option value="popularity">Phổ biến nhất</Option>
                </Select>
              </div>
              
              <div className="toolbar-right">
                <Button 
                  icon={<AppstoreOutlined />} 
                  className={viewMode === 'grid' ? 'active' : ''} 
                  onClick={() => setViewMode('grid')}
                />
                <Button 
                  icon={<BarsOutlined />} 
                  className={viewMode === 'list' ? 'active' : ''} 
                  onClick={() => setViewMode('list')}
                />
              </div>
            </div>
          </div>
          
          <AnimatePresence>
            {filterVisible && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="filter-panel-container"
              >
                <EventFilter />
              </motion.div>
            )}
          </AnimatePresence>
          
          <div className="events-results">
            <div className="results-header">
              <h3 className="results-title">
                {activeCategory === 'all' ? 'Tất cả sự kiện' : `Sự kiện ${activeCategory}`}
                <span className="results-count">({filteredEvents.length})</span>
              </h3>
            </div>
            
            {loading ? (
              <div className="empty-state">
                <Spin size="large" />
                <p>Đang tải sự kiện...</p>
              </div>
            ) : error ? (
              <div className="empty-state">
                <Empty 
                  description="Có lỗi xảy ra khi tải dữ liệu" 
                  image={Empty.PRESENTED_IMAGE_SIMPLE} 
                />
              </div>
            ) : paginatedEvents.length === 0 ? (
              <div className="empty-state">
                <Empty description="Không tìm thấy sự kiện phù hợp" />
              </div>
            ) : (
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="events-grid-container"
              >
                <Row gutter={[24, 32]}>
                  {paginatedEvents.map(event => (
                    <Col 
                      xs={24} 
                      sm={viewMode === 'list' ? 24 : 12} 
                      md={viewMode === 'list' ? 24 : 8} 
                      lg={viewMode === 'list' ? 24 : 8} 
                      key={event.id}
                    >
                      <motion.div variants={itemVariants}>
                        <EventCard 
                          event={event} 
                          horizontal={viewMode === 'list'} 
                        />
                      </motion.div>
                    </Col>
                  ))}
                </Row>
              </motion.div>
            )}
            
            {filteredEvents.length > pageSize && (
              <div className="pagination-container">
                <Pagination 
                  current={currentPage}
                  total={filteredEvents.length}
                  pageSize={pageSize}
                  onChange={handlePageChange}
                  showSizeChanger={false}
                />
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
    </MainLayout>
  );
};

export default EventsPage;
