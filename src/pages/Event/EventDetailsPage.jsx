import { useCallback, useState, useEffect } from 'react';
import { useParams, useNavigate, Link, useSearchParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Row, Col, Divider, Tag, Button, Carousel, Tooltip, message, Breadcrumb, Tabs, List, Typography, Space, Spin } from 'antd';
import { CalendarOutlined, EnvironmentOutlined, TeamOutlined, ShareAltOutlined, HeartOutlined, HeartFilled, StarFilled, ArrowLeftOutlined, UserOutlined, HomeOutlined, TagOutlined, ClockCircleOutlined, DollarOutlined, ArrowRightOutlined } from '@ant-design/icons';
import EventCard from '../../components/event/EventCard';
import MainLayout from '../../components/layout/MainLayout';
import { fetchEventById, fetchEvents } from '../../store/actions/eventsActions';
import '../../assets/scss/EventDetail.scss';

const { TabPane } = Tabs;
const { Title, Paragraph, Text } = Typography;


const EventDetailsPage = () => {
  const { detailid } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const { currentEvent: event, categoryEvents = [], relatedEvents = [], loading } = useSelector(state => state.events);
  const [isLiked, setIsLiked] = useState(false);
  const fromCategory = searchParams.get('fromCategory');

  useEffect(() => {
    if (detailid) {
      dispatch(fetchEventById(detailid));
    }
    // Also fetch related events
    dispatch(fetchEvents());
  }, [dispatch, detailid]);

  const handleCategoryClick = useCallback((category, e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    navigate({ pathname: '/events', search: `?category=${encodeURIComponent(category)}` });
  }, [navigate]);

  const handleBackButtonClick = useCallback(() => {
    if (fromCategory) {
      navigate(`/events?category=${encodeURIComponent(fromCategory)}`);
    } else {
      navigate('/events');
    }
  }, [navigate, fromCategory]);

  const handleAddToCart = () => {
    if (!event) return;
    navigate(`/checkout/${event.eventID}`, {
      state: {
        checkoutData: {
          eventId: event.eventID,
          ticketType: 'Standard',
          quantity: 1,
          price: event.price || 0
        }
      }
    });
  };

  const toggleLike = () => {
    setIsLiked(liked => !liked);
    message.info(isLiked ? 'Đã xóa khỏi danh sách yêu thích' : 'Đã thêm vào danh sách yêu thích');
  };

  if (loading || !event) {
    return (
      <div className="event-detail-loading">
        <Spin size="large" />
        <p>Đang tải thông tin sự kiện...</p>
        {!loading && !event && <p>Sự kiện không tồn tại hoặc đã bị xóa.</p>}
      </div>
    );
  }

  return (
    <MainLayout>
      <div className="event-detail-page">
      <div className="event-detail-header">
        <div className="parallax-bg" style={{ backgroundImage: `url('/src/assets/img/event1.jpeg')` }}></div>
        <div className="event-header-overlay"></div>
        <div className="event-header-content">
          <Button
            onClick={handleBackButtonClick}
            className="back-button"
            type="text"
            icon={<ArrowLeftOutlined />}
          >
            Quay lại danh sách
          </Button>
          {event?.status === 1 && <div className="featured-badge">Sự kiện nổi bật</div>}
          <h1 className="event-title">{event?.name}</h1>
          <div className="event-meta">
            <div className="event-info">
              <span className="event-rating">
                <StarFilled /> 4.5 (0 đã bán)
              </span>
              <Tag className="event-status available">Còn vé</Tag>
              <Tag
                color="blue"
                className="category-tag"
                onClick={(e) => handleCategoryClick(event?.cateID, e)}
                style={{ cursor: 'pointer' }}
              >
                {event?.cateID}
              </Tag>
            </div>
          </div>
        </div>
      </div>

      <div className="event-detail-container">
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
              title: (
                <Link to="/events">Sự kiện</Link>
              ),
            },
            {
              title: (
                <Link to={`/events?category=${encodeURIComponent(event?.cateID || '')}`}>
                  {event?.cateID}
                </Link>
              ),
            },
            {
              title: event?.name,
            },
          ]}
        />

        <Row gutter={[30, 30]}>
          <Col xs={24} lg={16}>
            <div className="event-detail-content">
              <div className="event-gallery">
                <Carousel autoplay effect="fade">
                  <div className="gallery-item">
                    <img src="/src/assets/img/event1.jpeg" alt={`${event?.name} - gallery 1`} />
                  </div>
                  <div className="gallery-item">
                    <img src="/src/assets/img/event2.jpeg" alt={`${event?.name} - gallery 2`} />
                  </div>
                </Carousel>
              </div>

              <Tabs defaultActiveKey="description" className="event-tabs">
                <TabPane tab="Thông tin sự kiện" key="description">
                  <div className="event-description">
                    <Title level={4}>Giới thiệu sự kiện</Title>
                    <Paragraph>
                      {event?.description || 'Chưa có mô tả cho sự kiện này.'}
                    </Paragraph>

                    <Space className="event-highlights" wrap>
                      <div className="highlight-item">
                        <CalendarOutlined className="highlight-icon" />
                        <div className="highlight-content">
                          <Text strong>{event?.date_Start ? new Date(event.date_Start).toLocaleDateString('vi-VN') : 'Chưa xác định'}</Text>
                          <Text type="secondary">Ngày bắt đầu</Text>
                        </div>
                      </div>

                      <div className="highlight-item">
                        <ClockCircleOutlined className="highlight-icon" />
                        <div className="highlight-content">
                          <Text strong>{event?.date_End ? new Date(event.date_End).toLocaleDateString('vi-VN') : 'Chưa xác định'}</Text>
                          <Text type="secondary">Ngày kết thúc</Text>
                        </div>
                      </div>

                      <div className="highlight-item">
                        <EnvironmentOutlined className="highlight-icon" />
                        <div className="highlight-content">
                          <Text strong>Địa điểm sẽ được thông báo</Text>
                          <Text type="secondary">Địa điểm</Text>
                        </div>
                      </div>

                      <div className="highlight-item">
                        <DollarOutlined className="highlight-icon" />
                        <div className="highlight-content">
                          <Text strong>{event?.price ? `${event.price.toLocaleString('vi-VN')} VNĐ` : 'Miễn phí'}</Text>
                          <Text type="secondary">Giá vé</Text>
                        </div>
                      </div>

                      <div className="highlight-item">
                        <TeamOutlined className="highlight-icon" />
                        <div className="highlight-content">
                          <Text strong>{event?.slot || 0} người</Text>
                          <Text type="secondary">Số lượng chỗ</Text>
                        </div>
                      </div>
                    </Space>

                    <Divider />
                    <Title level={4}>Thông tin thêm</Title>
                    {event.schedule && event.schedule.length > 0 && (
                      <List
                        className="event-schedule"
                        size="large"
                        bordered
                        dataSource={event.schedule}
                        renderItem={item => (
                          <List.Item>
                            <Text className="schedule-time">{item.time}</Text>
                            <Text>{item.title}</Text>
                          </List.Item>
                        )}
                      />
                    )}
                  </div>
                </TabPane>

                <TabPane tab="Địa điểm" key="location">
                  <div className="event-location">
                    <Title level={4}>Thông tin địa điểm</Title>
                    <Paragraph>
                      <EnvironmentOutlined /> {event.address || event.location}
                    </Paragraph>
                    {/* Có thể nhúng bản đồ động hoặc để lại hình ảnh tĩnh nếu có API key */}
                    <div className="location-map">
                      <img
                        src={`https://maps.googleapis.com/maps/api/staticmap?center=${encodeURIComponent(event.address || event.location)}&zoom=14&size=600x300&maptype=roadmap&markers=color:red%7C${encodeURIComponent(event.address || event.location)}&key=YOUR_Maps_API_KEY`}
                        alt="Bản đồ địa điểm sự kiện"
                      />
                    </div>
                    <Paragraph>
                      Ghi chú: Vui lòng đến sớm 30 phút để check-in và nhận chỗ ngồi.
                    </Paragraph>
                  </div>
                </TabPane>

                <TabPane tab="Chính sách" key="policy">
                  <div className="event-policy">
                    <Title level={4}>Chính sách vé</Title>
                    <List
                      size="small"
                      bordered
                      dataSource={[
                        'Vé đã mua không được đổi hoặc trả lại',
                        'Mỗi vé chỉ có giá trị cho một người tham dự',
                        'Trẻ em dưới 1m2 (hoặc 5 tuổi) được miễn phí vé khi đi kèm người lớn.',
                        'Vui lòng xuất trình vé (điện tử hoặc in) khi check-in',
                        'Ban tổ chức có quyền từ chối người tham dự không tuân thủ quy định hoặc có hành vi gây rối.'
                      ]}
                      renderItem={item => (
                        <List.Item>
                          <Text>{item}</Text>
                        </List.Item>
                      )}
                    />
                     {event.tickets && event.tickets.length > 0 && (
                      <>
                        <Divider />
                        <Title level={4}>Các loại vé</Title>
                        <List
                          itemLayout="horizontal"
                          dataSource={event.tickets}
                          renderItem={item => (
                            <List.Item>
                              <List.Item.Meta
                                title={<Text strong>{item.name} {item.available ? '' : '(Hết vé)'}</Text>}
                                description={item.description}
                              />
                              <Text type="success" style={{ fontWeight: 'bold' }}>
                                {item.price.toLocaleString('vi-VN')} VNĐ
                              </Text>
                            </List.Item>
                          )}
                        />
                      </>
                    )}
                  </div>
                </TabPane>
              </Tabs>
            </div>
          </Col>

          <Col xs={24} lg={8}>
            <div className="event-sidebar">
              <div className="event-actions">
                <Button
                  type="primary"
                  size="large"
                  onClick={handleAddToCart}
                  className="buy-ticket-button"
                >
                  <span className="button-text">Mua vé ngay</span>
                  <div className="hover-slide"></div>
                </Button>

                <Tooltip title={isLiked ? "Xóa khỏi yêu thích" : "Lưu sự kiện"}>
                  <Button
                    className={`like-button ${isLiked ? 'active' : ''}`}
                    size="large"
                    icon={isLiked ? <HeartFilled /> : <HeartOutlined />}
                    onClick={toggleLike}
                  />
                </Tooltip>

                <Tooltip title="Chia sẻ sự kiện">
                  <Button
                    className="share-button"
                    size="large"
                    icon={<ShareAltOutlined />}
                  />
                </Tooltip>
              </div>

              <div className="event-details-card">
                <h3>Chi tiết sự kiện</h3>
                <ul>
                  <li>
                    <CalendarOutlined className="icon" />
                    <div>
                      <strong>Ngày</strong>
                      <p>{new Date(event.date).toLocaleDateString('vi-VN')}</p>
                    </div>
                  </li>
                  <li>
                    <ClockCircleOutlined className="icon" />
                    <div>
                      <strong>Thời gian</strong>
                      <p>{event.time || '19:00 - 22:00'}</p>
                    </div>
                  </li>
                  <li>
                    <EnvironmentOutlined className="icon" />
                    <div>
                      <strong>Địa điểm</strong>
                      <p>{event.location}</p>
                    </div>
                  </li>
                  <li>
                    <UserOutlined className="icon" />
                    <div>
                      <strong>Đơn vị tổ chức</strong>
                      <p>{event.organizer || 'Unitic Events'}</p>
                    </div>
                  </li>
                  <li>
                    <TagOutlined className="icon" />
                    <div>
                      <strong>Danh mục</strong>
                      <p>
                        {/* Tag ở sidebar, không nằm trong Link khác */}
                        <Tag
                          color="blue"
                          onClick={(e) => handleCategoryClick(event.category, e)}
                          style={{ cursor: 'pointer' }}
                        >
                          {event.category}
                        </Tag>
                      </p>
                    </div>
                  </li>
                  <li>
                    <TeamOutlined className="icon" />
                    <div>
                      <strong>Số lượng</strong>
                      <div className="capacity-wrapper">
                        <div className="capacity-bar">
                          <div
                            className="capacity-fill"
                            style={{ width: `${(event.soldCount / (event.capacity || 1)) * 100}%` }}
                          ></div>
                        </div>
                        <span>{event.soldCount}/{event.capacity || 'Không giới hạn'} chỗ</span>
                      </div>
                    </div>
                  </li>
                </ul>
              </div>

              <div className="ticket-info">
                <h3>Thông tin vé</h3>
                <div className="ticket-price">
                  <span className="price">{event.price ? `${event.price.toLocaleString('vi-VN')} VNĐ` : 'Miễn phí'}</span>
                  <span className="per-ticket">/ vé</span>
                </div>
                <p className="ticket-note">* Có thể phát sinh phí dịch vụ</p>
                <Button
                  type="primary"
                  size="large"
                  block
                  onClick={handleAddToCart}
                  className="mobile-buy-button"
                >
                  Mua vé ngay
                </Button>
              </div>
            </div>
          </Col>
        </Row>

        <Divider />

     {categoryEvents && categoryEvents.length > 0 && (
          <section className="category-events-section">
            <div className="section-header">
              <h2 className="section-title">
                <TagOutlined className="section-icon" />
                Các sự kiện cùng danh mục "{event.category}"
              </h2>
              <Link
                to={`/events?category=${encodeURIComponent(event.category)}`}
                className="view-all-link"
              >
                Xem tất cả <ArrowRightOutlined />
              </Link>
            </div>

            <Row gutter={[24, 24]}>
              {categoryEvents.map(catEvent => (
                <Col xs={24} sm={12} md={6} key={catEvent.id}>
                  <div
                    style={{
                      opacity: 1,
                      transform: 'translateY(0)',
                      transition: 'all 0.4s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-10px)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                    }}
                  >
                    <EventCard
                      event={catEvent}
                      compact={true}
                      // Thêm fromCategory vào link chi tiết của EventCard
                      // EventCard cần nhận prop này và dùng trong Link của nó
                      detailLinkParams={`?fromCategory=${encodeURIComponent(event.category)}`}
                    />
                  </div>
                </Col>
              ))}
            </Row>
          </section>
        )}

        <Divider />

        {relatedEvents && relatedEvents.length > 0 && (
          <div className="related-events">
            <h2>Sự kiện tương tự</h2>
            <Row gutter={[20, 20]}>
              {relatedEvents.map((relEvent) => (
                <Col xs={24} sm={12} md={8} key={relEvent.id}>
                  {/* Link bao bọc toàn bộ card để click vào card sẽ điều hướng đến trang chi tiết */}
                  <Link to={`/events/${relEvent.id}`}>
                    <div className="related-event-card">
                      <div className="related-event-image" style={{ backgroundImage: `url(${relEvent.image})` }}>
                        <div className="related-event-overlay"></div>
                        <div className="related-event-date">
                          <CalendarOutlined /> {new Date(relEvent.date).toLocaleDateString('vi-VN')}
                        </div>
                        {/* Tag trong Related Events Card:
                            - Nếu muốn click vào Tag ĐIỀU HƯỚNG RIÊNG ĐẾN CATEGORY:
                              + Giữ onClick={(e) => handleCategoryClick(relEvent.category, e)}
                              + **QUAN TRỌNG: handleCategoryClick PHẢI có e.stopPropagation()**
                            - Nếu muốn click vào Tag cũng ĐIỀU HƯỚNG THEO LINK CHA (toàn bộ card):
                              + Bỏ onClick handler của Tag này
                        */}
                        <Tag
                          color="blue"
                          className="related-event-category"
                          onClick={(e) => handleCategoryClick(relEvent.category, e)} // Giữ lại nếu muốn Tag điều hướng riêng
                          style={{ cursor: 'pointer' }}
                        >
                          {relEvent.category}
                        </Tag>
                      </div>
                      <div className="related-event-content">
                        <h3>{relEvent.title}</h3>
                        <p><EnvironmentOutlined /> {relEvent.location}</p>
                        <div className="related-event-footer">
                          <span className="related-event-price">{relEvent.price ? `${relEvent.price.toLocaleString('vi-VN')} VNĐ` : 'Miễn phí'}</span>
                      <Button size="small" type="primary">Xem chi tiết</Button>
                        </div>
                      </div>
                    </div>
                  </Link>
                </Col>
              ))}
            </Row>
          </div>
        )}
      </div>
    </div>
    </MainLayout>
  );
};

export default EventDetailsPage;