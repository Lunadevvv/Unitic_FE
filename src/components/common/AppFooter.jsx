import React from 'react';
import { Layout, Row, Col, Space } from 'antd';
import { 
  FacebookOutlined, TwitterOutlined, InstagramOutlined, 
  YoutubeOutlined, MailOutlined, PhoneOutlined, EnvironmentOutlined 
} from '@ant-design/icons';
import { Link } from 'react-router-dom';
import '../../assets/scss/AppFooter.scss';

const { Footer } = Layout;

const AppFooter = ({ className = '' }) => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    services: [
      { label: 'Sự kiện', path: '/events' },
      { label: 'Tổ chức sự kiện', path: '/organization/events' },
      { label: 'Quản lý vé', path: '/' },
      { label: 'Báo cáo & Thống kê', path: '/' }
    ],
    company: [
      { label: 'Về chúng tôi', path: '/about' },
      { label: 'Liên hệ', path: '/contact' },
      { label: 'Tuyển dụng', path: '/' },
      { label: 'Tin tức', path: '/' }
    ],
    support: [
      { label: 'Trung tâm trợ giúp', path: '/help' },
      { label: 'Chính sách bảo mật', path: '/' },
      { label: 'Điều khoản sử dụng', path: '/' },
      { label: 'FAQ', path: '/' }
    ],
    contact: [
      { 
        label: 'contact@unitic.vn', 
        icon: <MailOutlined />,
        href: 'mailto:contact@unitic.vn'
      },
      { 
        label: '1900 1234', 
        icon: <PhoneOutlined />,
        href: 'tel:19001234'
      },
      { 
        label: '123 Đường ABC, Quận 1, TP.HCM', 
        icon: <EnvironmentOutlined />
      }
    ]
  };

  const socialLinks = [
    { icon: <FacebookOutlined />, href: 'https://facebook.com/unitic', label: 'Facebook' },
    { icon: <TwitterOutlined />, href: 'https://twitter.com/unitic', label: 'Twitter' },
    { icon: <InstagramOutlined />, href: 'https://instagram.com/unitic', label: 'Instagram' },
    { icon: <YoutubeOutlined />, href: 'https://youtube.com/unitic', label: 'Youtube' }
  ];

  return (
    <Footer className={`app-footer ${className}`}>
      <div className="footer-content">
        <Row gutter={[32, 32]}>
          {/* Logo & Description */}
          <Col xs={24} sm={12} lg={6}>
            <div className="footer-section">
              <div className="footer-logo">
                <h2>UniTic</h2>
              </div>
              <p className="footer-description">
                Nền tảng quản lý và bán vé sự kiện hàng đầu Việt Nam. 
                Kết nối những trải nghiệm tuyệt vời.
              </p>
              <div className="social-links">
                <Space size="middle">
                  {socialLinks.map((social, index) => (
                    <a 
                      key={index}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="social-link"
                      title={social.label}
                    >
                      {social.icon}
                    </a>
                  ))}
                </Space>
              </div>
            </div>
          </Col>

          {/* Services */}
          <Col xs={12} sm={6} lg={4}>
            <div className="footer-section">
              <h4 className="footer-title">Dịch vụ</h4>
              <ul className="footer-links">
                {footerLinks.services.map((link, index) => (
                  <li key={index}>
                    <Link to={link.path}>{link.label}</Link>
                  </li>
                ))}
              </ul>
            </div>
          </Col>

          {/* Company */}
          <Col xs={12} sm={6} lg={4}>
            <div className="footer-section">
              <h4 className="footer-title">Công ty</h4>
              <ul className="footer-links">
                {footerLinks.company.map((link, index) => (
                  <li key={index}>
                    <Link to={link.path}>{link.label}</Link>
                  </li>
                ))}
              </ul>
            </div>
          </Col>

          {/* Support */}
          <Col xs={12} sm={6} lg={4}>
            <div className="footer-section">
              <h4 className="footer-title">Hỗ trợ</h4>
              <ul className="footer-links">
                {footerLinks.support.map((link, index) => (
                  <li key={index}>
                    <Link to={link.path}>{link.label}</Link>
                  </li>
                ))}
              </ul>
            </div>
          </Col>

          {/* Contact */}
          <Col xs={12} sm={6} lg={6}>
            <div className="footer-section">
              <h4 className="footer-title">Liên hệ</h4>
              <ul className="footer-contact">
                {footerLinks.contact.map((contact, index) => (
                  <li key={index}>
                    {contact.href ? (
                      <a href={contact.href}>
                        {contact.icon && <span className="contact-icon">{contact.icon}</span>}
                        {contact.label}
                      </a>
                    ) : (
                      <span>
                        {contact.icon && <span className="contact-icon">{contact.icon}</span>}
                        {contact.label}
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </Col>
        </Row>
      </div>

      {/* Footer Bottom */}
      <div className="footer-bottom">
        <Row justify="space-between" align="middle">
          <Col xs={24} sm={12}>
            <p className="copyright">
              © {currentYear} UniTic. All rights reserved.
            </p>
          </Col>
          <Col xs={24} sm={12}>
            <div className="footer-bottom-links">
              <Link to="/privacy">Chính sách bảo mật</Link>
              <Link to="/terms">Điều khoản sử dụng</Link>
              <Link to="/sitemap">Sơ đồ trang web</Link>
            </div>
          </Col>
        </Row>
      </div>
    </Footer>
  );
};

export default AppFooter;
