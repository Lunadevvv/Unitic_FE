import React, { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
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
import '../../assets/scss/EventCategoryPage.scss';
import { useEvents } from '../../hooks/useEvents';
import { fetchCategories } from '../../store/actions/categoryActions';

const { Option } = Select;

const EventsPage = () => {
  const dispatch = useDispatch();
  const { events, loading, error } = useEvents();
  const { categories: categoryList } = useSelector(state => state.category);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState('grid');
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterVisible, setFilterVisible] = useState(false);
  const [sortBy, setSortBy] = useState('newest');
  const pageSize = 9;
  
  // Fetch categories when component mounts
  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);
  
  // Function to get category name by ID
  const getCategoryName = useCallback((cateID) => {
    const category = categoryList?.find(cat => cat.cateID === cateID);
    return category?.name || cateID;
  }, [categoryList]);
  
  useEffect(() => {
    if (events) {
      let filtered = [...events];
      
      if (activeCategory !== 'all') {
        filtered = filtered.filter(event => getCategoryName(event.category) === activeCategory);
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
  }, [events, activeCategory, searchQuery, sortBy, categoryList, getCategoryName]);
  
  const featuredEvents = events?.filter(event => event.isFeatured) || [];
  

  
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
    ...new Set(events?.map(event => getCategoryName(event.category)) || [])
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
      <div className="events-page event-category-page">
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
        
       
        
        <section className="event-section main-events-section">
          <div className="events-control-panel">
            <CategoryTabs 
              categories={categories} 
              activeCategory={activeCategory}
              onChange={setActiveCategory}
            />
            
            <div className="events-toolbar" style={{
  background: 'linear-gradient(67deg, #9c88ff 60%, #74b9ff 100%)',
  borderRadius: '16px',
  boxShadow: '0 4px 18px #9c88ff22',
  padding: '12px 18px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: '18px',
}}>
  <div className="toolbar-left" style={{display: 'flex', alignItems: 'center', gap: '14px'}}>
    <Button 
      icon={<FilterOutlined style={{ fontSize: 20, color: '#fff' }}/>} 
      onClick={() => setFilterVisible(!filterVisible)}
      className={`filter-button ${filterVisible ? 'active' : ''}`}
      style={{
        background: filterVisible ? 'linear-gradient(90deg, #74b9ff 60%, #9c88ff 100%)' : 'rgba(255,255,255,0.22)',
        color: filterVisible ? '#fff' : '#9c88ff',
        border: 'none',
        borderRadius: '12px',
        fontWeight: 700,
        boxShadow: filterVisible ? '0 0 12px #74b9ff99' : '0 2px 8px #9c88ff33',
        padding: '0 18px',
        height: 40,
        transition: 'all 0.2s',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
      }}
    >
      Lọc
    </Button>
    <Select 
      defaultValue="newest" 
      style={{ 
        width: 150, 
        borderRadius: '12px',
        background: 'rgba(255,255,255,0.22)',
        fontWeight: 600,
        color: '#222',
        boxShadow: '0 2px 8px #74b9ff33',
      }}
      dropdownStyle={{ borderRadius: 12, background: '#f3f3ff' }}
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
  <div className="toolbar-right" style={{display: 'flex', alignItems: 'center', gap: '10px'}}>
    <Button 
      icon={<AppstoreOutlined style={{ fontSize: 20, color: viewMode === 'grid' ? '#fff' : '#9c88ff' }}/>} 
      className={viewMode === 'grid' ? 'active' : ''} 
      onClick={() => setViewMode('grid')}
      style={{
        background: viewMode === 'grid' ? 'linear-gradient(90deg, #74b9ff 60%, #9c88ff 100%)' : 'rgba(255,255,255,0.22)',
        color: viewMode === 'grid' ? '#fff' : '#9c88ff',
        border: 'none',
        borderRadius: '12px',
        boxShadow: viewMode === 'grid' ? '0 0 12px #74b9ff99' : '0 2px 8px #9c88ff33',
        height: 40,
        width: 40,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'all 0.2s',
      }}
    />
    <Button 
      icon={<BarsOutlined style={{ fontSize: 20, color: viewMode === 'list' ? '#fff' : '#9c88ff' }}/>} 
      className={viewMode === 'list' ? 'active' : ''} 
      onClick={() => setViewMode('list')}
      style={{
        background: viewMode === 'list' ? 'linear-gradient(90deg, #74b9ff 60%, #9c88ff 100%)' : 'rgba(255,255,255,0.22)',
        color: viewMode === 'list' ? '#fff' : '#9c88ff',
        border: 'none',
        borderRadius: '12px',
        boxShadow: viewMode === 'list' ? '0 0 12px #74b9ff99' : '0 2px 8px #9c88ff33',
        height: 40,
        width: 40,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'all 0.2s',
      }}
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
