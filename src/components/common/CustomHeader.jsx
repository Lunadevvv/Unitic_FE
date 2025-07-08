import React, { useState, useEffect } from 'react';
import { Layout, Button, Drawer, Space, Badge } from 'antd';
import { MenuOutlined, UserOutlined, ShoppingCartOutlined, BellOutlined, SearchOutlined } from '@ant-design/icons';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import '../../assets/scss/_header.scss';

const { Header } = Layout;

const CustomHeader = ({ transparent = false, onMenuClick }) => {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchVisible, setSearchVisible] = useState(false);
  
  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY;
      if (offset > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const headerStyle = {
    background: transparent && !scrolled ? 'transparent' : undefined,
    boxShadow: transparent && !scrolled ? 'none' : undefined,
    borderBottom: transparent && !scrolled ? 'none' : undefined,
  };

  const navItems = [
    { label: 'Trang chủ', path: '/' },
    { label: 'Sự kiện', path: '/events' },
    { label: 'Danh mục', path: '/categories' },
    { label: 'Về chúng tôi', path: '/about' },
  ];

  return (
    <>
      <Header 
        className={`homepage_header ${scrolled ? 'scrolled' : ''}`} 
        style={headerStyle}
      >
        <motion.div 
          className="logo"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Link to="/">
            <div className="text-logo animate-gradient">UniTic</div>
          </Link>
        </motion.div>
        
        <motion.div 
          className={`top-navigation ${mobileMenuOpen ? 'active' : ''}`}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, staggerChildren: 0.1 }}
        >
          {navItems.map((item, index) => (
            <motion.span 
              key={index}
              className="nav-item"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => {
                navigate(item.path);
                setMobileMenuOpen(false);
              }}
            >
              <span className="nav-text">{item.label}</span>
              <span className="nav-hover-effect"></span>
            </motion.span>
          ))}
          
          <Space size="middle">
            <motion.div 
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <Badge count={2} size="small">
                <Button 
                  type="text" 
                  shape="circle" 
                  icon={<BellOutlined style={{ color: '#f8f5f1' }} />} 
                  onClick={() => navigate('/notifications')} 
                />
              </Badge>
            </motion.div>
            
            <motion.div 
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <Badge count={3} size="small">
                <Button 
                  type="text" 
                  shape="circle" 
                  icon={<ShoppingCartOutlined style={{ color: '#f8f5f1' }} />} 
                  onClick={() => navigate('/cart')} 
                />
              </Badge>
            </motion.div>
            
            <motion.div 
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button 
                type="text" 
                shape="circle" 
                icon={<SearchOutlined style={{ color: '#f8f5f1' }} />} 
                onClick={() => setSearchVisible(!searchVisible)} 
              />
            </motion.div>
          </Space>
          
          <motion.button 
            className="login-button pulse-animation" 
            onClick={() => navigate('/signin')}
            whileHover={{ scale: 1.05, y: -3 }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="button-text">
              <UserOutlined />
              Đăng nhập
            </span>
            <span className="button-overlay"></span>
          </motion.button>
        </motion.div>
        
        <button 
          className={`mobile-menu-btn ${mobileMenuOpen ? 'active' : ''}`} 
          onClick={toggleMobileMenu}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </Header>
      
      <div className={`mobile-overlay ${mobileMenuOpen ? 'active' : ''}`} onClick={toggleMobileMenu}></div>
      
      <Drawer 
        title="Tìm kiếm" 
        placement="top" 
        onClose={() => setSearchVisible(false)} 
        visible={searchVisible}
        height={120}
      >
        <div className="search-input">
          <input type="text" placeholder="Tìm kiếm sự kiện..." />
          <Button type="primary" icon={<SearchOutlined />}>Tìm kiếm</Button>
        </div>
      </Drawer>
    </>
  );
};

export default CustomHeader;