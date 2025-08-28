import React, { useState } from 'react';
import { 
  Row, Col, Slider, DatePicker, Checkbox, Tag, Button, 
  Divider, Card, Input, Select, Space, Radio 
} from 'antd';
import { 
  CalendarOutlined, 
  DollarOutlined, 
  EnvironmentOutlined, 
  TagOutlined,
  ClearOutlined,
  SearchOutlined,
  CloseOutlined 
} from '@ant-design/icons';
import { motion } from 'framer-motion';
import '../../assets/scss/EventFilter.scss';

const { RangePicker } = DatePicker;
const { Option } = Select;

const EventFilter = ({ 
  onFilterChange, 
  activeFilters = {}, 
  onReset,
  categories = [],
  locations = []
}) => {
  const [priceRange, setPriceRange] = useState([0, 2000000]);
  const [selectedLocations, setSelectedLocations] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [dateRange, setDateRange] = useState(null);
  const [selectedOptions, setSelectedOptions] = useState({
    hasPromotion: false,
    isAccessible: false,
    isVirtual: false,
    isFamilyFriendly: false
  });
  
  // Mock location data if not provided
  const locationOptions = locations.length > 0 ? locations : [
    'TP. Hồ Chí Minh',
    'Hà Nội',
    'Đà Nẵng',
    'Nha Trang',
    'Đà Lạt',
    'Vũng Tàu',
    'Cần Thơ',
  ];
  
  // Mock category data if not provided
  const categoryOptions = categories.length > 0 ? categories : [
    'Âm nhạc',
    'Thể thao',
    'Giáo dục',
    'Công nghệ',
    'Nghệ thuật',
    'Ẩm thực',
    'Hội chợ',
    'Hội thảo',
  ];
  
  // Handle price range change
  const handlePriceChange = (value) => {
    setPriceRange(value);
    if (onFilterChange) {
      onFilterChange({ ...activeFilters, priceRange: value });
    }
  };
  
  // Handle date range change
  const handleDateChange = (dates) => {
    setDateRange(dates);
    if (onFilterChange) {
      onFilterChange({ 
        ...activeFilters, 
        dateRange: dates ? [dates[0].format(), dates[1].format()] : null 
      });
    }
  };
  
  // Handle location selection
  const handleLocationChange = (checkedValues) => {
    setSelectedLocations(checkedValues);
    if (onFilterChange) {
      onFilterChange({ ...activeFilters, locations: checkedValues });
    }
  };
  
  // Handle category selection
  const handleCategoryChange = (checkedValues) => {
    setSelectedCategories(checkedValues);
    if (onFilterChange) {
      onFilterChange({ ...activeFilters, categories: checkedValues });
    }
  };
  
  // Handle option change
  const handleOptionChange = (option, value) => {
    const newOptions = { ...selectedOptions, [option]: value };
    setSelectedOptions(newOptions);
    if (onFilterChange) {
      onFilterChange({ ...activeFilters, options: newOptions });
    }
  };
  
  // Clear all filters
  const handleReset = () => {
    setPriceRange([0, 2000000]);
    setSelectedLocations([]);
    setSelectedCategories([]);
    setDateRange(null);
    setSelectedOptions({
      hasPromotion: false,
      isAccessible: false,
      isVirtual: false,
      isFamilyFriendly: false
    });
    
    if (onReset) {
      onReset();
    }
  };
  
  // Format price for display
  const formatPrice = (value) => {
    return `${value.toLocaleString('vi-VN')}đ`;
  };
  

  // Get filter chips to display active filters
  const getFilterChips = () => {
    const chips = [];
    
    if (priceRange[0] > 0 || priceRange[1] < 2000000) {
      chips.push({
        label: `${formatPrice(priceRange[0])} - ${formatPrice(priceRange[1])}`,
        onClose: () => handlePriceChange([0, 2000000])
      });
    }
    
    if (dateRange) {
      chips.push({
        label: `${dateRange[0].format('DD/MM/YYYY')} - ${dateRange[1].format('DD/MM/YYYY')}`,
        onClose: () => handleDateChange(null)
      });
    }
    
    selectedLocations.forEach(location => {
      chips.push({
        label: location,
        onClose: () => handleLocationChange(selectedLocations.filter(loc => loc !== location))
      });
    });
    
    selectedCategories.forEach(category => {
      chips.push({
        label: category,
        onClose: () => handleCategoryChange(selectedCategories.filter(cat => cat !== category))
      });
    });
    
    Object.entries(selectedOptions).forEach(([key, value]) => {
      if (value) {
        let label = '';
        switch (key) {
          case 'hasPromotion': label = 'Có khuyến mãi'; break;
          case 'isAccessible': label = 'Tiếp cận cho người khuyết tật'; break;
          case 'isVirtual': label = 'Sự kiện trực tuyến'; break;
          case 'isFamilyFriendly': label = 'Thân thiện gia đình'; break;
          default: label = key;
        }
        
        chips.push({
          label,
          onClose: () => handleOptionChange(key, false)
        });
      }
    });
    
    return chips;
  };
  
  const activeChips = getFilterChips();
  
  return (
    <div className="event-filter">
      {/* Active Filter Chips */}
      {activeChips.length > 0 && (
        <motion.div 
          className="active-filters"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="chips-label">Bộ lọc đang áp dụng:</div>
          <div className="filter-chips">
            {activeChips.map((chip, index) => (
              <Tag 
                key={index}
                closable
                onClose={chip.onClose}
                className="filter-chip"
              >
                {chip.label}
              </Tag>
            ))}
            
            <Button 
              type="text" 
              icon={<ClearOutlined />} 
              onClick={handleReset}
              className="clear-filters-btn"
            >
              Xóa tất cả
            </Button>
          </div>
        </motion.div>
      )}
      
      <Card className="filter-card">
        <Row gutter={[24, 16]}>
          <Col xs={24} md={12} lg={6}>
            <div className="filter-section">
              <h4 className="filter-title">
                <CalendarOutlined className="filter-icon" /> Thời gian
              </h4>
              <RangePicker 
                format="DD/MM/YYYY"
                onChange={handleDateChange}
                value={dateRange}
                placeholder={['Từ ngày', 'Đến ngày']}
                className="date-picker"
              />
            </div>
          </Col>
          
          <Col xs={24} md={12} lg={6}>
            <div className="filter-section">
              <h4 className="filter-title">
                <DollarOutlined className="filter-icon" /> Mức giá
              </h4>
              <Slider
                range
                min={0}
                max={2000000}
                step={50000}
                defaultValue={priceRange}
                value={priceRange}
                onChange={handlePriceChange}
                tipFormatter={formatPrice}
                className="price-slider"
              />
              <div className="price-range-display">
                <span>{formatPrice(priceRange[0])}</span>
                <span>{formatPrice(priceRange[1])}</span>
              </div>
            </div>
          </Col>
          
          <Col xs={24} md={12} lg={6}>
            <div className="filter-section">
              <h4 className="filter-title">
                <EnvironmentOutlined className="filter-icon" /> Địa điểm
              </h4>
              <Select
                mode="multiple"
                style={{ width: '100%' }}
                placeholder="Chọn địa điểm"
                value={selectedLocations}
                onChange={handleLocationChange}
                maxTagCount="responsive"
                className="location-select"
              >
                {locationOptions.map(location => (
                  <Option key={location} value={location}>{location}</Option>
                ))}
              </Select>
            </div>
          </Col>
          
          <Col xs={24} md={12} lg={6}>
            <div className="filter-section">
              <h4 className="filter-title">
                <TagOutlined className="filter-icon" /> Thể loại
              </h4>
              <Select
                mode="multiple"
                style={{ width: '100%' }}
                placeholder="Chọn thể loại"
                value={selectedCategories}
                onChange={handleCategoryChange}
                maxTagCount="responsive"
                className="category-select"
              >
                {categoryOptions.map(category => (
                  <Option key={category} value={category}>{category}</Option>
                ))}
              </Select>
            </div>
          </Col>
        </Row>
        
        <Divider style={{ margin: '16px 0' }} />
        
        <Row gutter={[24, 16]}>
          <Col xs={24}>
            <div className="filter-section filter-options">
              <Checkbox 
                checked={selectedOptions.hasPromotion}
                onChange={(e) => handleOptionChange('hasPromotion', e.target.checked)}
                className="filter-checkbox"
              >
                Có khuyến mãi
              </Checkbox>
              
              <Checkbox 
                checked={selectedOptions.isAccessible}
                onChange={(e) => handleOptionChange('isAccessible', e.target.checked)}
                className="filter-checkbox"
              >
                Tiếp cận cho người khuyết tật
              </Checkbox>
              
              <Checkbox 
                checked={selectedOptions.isVirtual}
                onChange={(e) => handleOptionChange('isVirtual', e.target.checked)}
                className="filter-checkbox"
              >
                Sự kiện trực tuyến
              </Checkbox>
              
              <Checkbox 
                checked={selectedOptions.isFamilyFriendly}
                onChange={(e) => handleOptionChange('isFamilyFriendly', e.target.checked)}
                className="filter-checkbox"
              >
                Thân thiện gia đình
              </Checkbox>
            </div>
          </Col>
        </Row>
        
        <div className="filter-actions">
          <Button type="primary" icon={<SearchOutlined />}>
            Áp dụng bộ lọc
          </Button>
          <Button type='primary' onClick={handleReset} icon={<CloseOutlined />}>
            Đặt lại
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default EventFilter;