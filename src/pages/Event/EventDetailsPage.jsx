import { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate, Link, useSearchParams } from 'react-router-dom';
import {
  Row, Col, Divider, Tag, Button, Carousel, Tooltip, message,
  Breadcrumb, Tabs, List, Typography, Space, Spin
} from 'antd';
import {
  CalendarOutlined,
  EnvironmentOutlined,
  TeamOutlined,
  ShareAltOutlined,
  HeartOutlined,
  HeartFilled,
  StarFilled,
  ArrowLeftOutlined,
  UserOutlined,
  HomeOutlined,
  TagOutlined,
  ClockCircleOutlined,
  DollarOutlined,
  ArrowRightOutlined
} from '@ant-design/icons';
import { useEvents } from '../../hooks/useEvents';
import EventCard from '../../components/event/EventCard';
import MainLayout from '../../components/layout/MainLayout';
import '../../assets/scss/EventDetail.scss';

const { TabPane } = Tabs;
const { Title, Paragraph, Text } = Typography;

const EventDetailsPage = () => {
  const { detailid } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const {
    getEventById,
    getRelatedEvents,
    events: allEventsFromHook,
    loading: eventsHookLoading // Đây là loading state từ hook của bạn
  } = useEvents();

  const [event, setEvent] = useState(null);
  const [relatedEvents, setRelatedEvents] = useState([]);
  const [categoryEvents, setCategoryEvents] = useState([]);
  const [isLiked, setIsLiked] = useState(false);
  const [isLoadingPage, setIsLoadingPage] = useState(true); // Loading state riêng của trang

  // Get fromCategory parameter outside of re-renders
  const fromCategory = searchParams.get('fromCategory');

  // Use useCallback for navigation functions to prevent recreation on each render
  const handleCategoryClick = useCallback((category, e) => {
    if (e) {
      e.preventDefault(); // Ngăn hành vi mặc định của thẻ HTML
      e.stopPropagation(); // Ngăn sự kiện nổi bọt lên các phần tử cha (đặc biệt là Link)
    }
    navigate({
      pathname: '/events',
      search: `?category=${encodeURIComponent(category)}`
    });
  }, [navigate]); // navigate là stable, nên chỉ cần nó trong dependency array

  const handleBackButtonClick = useCallback(() => {
    if (fromCategory) {
      navigate(`/events?category=${encodeURIComponent(fromCategory)}`); // Đảm bảo encodeURIComponent
    } else {
      navigate('/events');
    }
  }, [navigate, fromCategory]); // fromCategory có thể thay đổi

  const handleAddToCart = () => {
    // Điều hướng đến trang checkout với thông tin sự kiện
    navigate(`/checkout/${event.id}`, {
      state: {
        checkoutData: {
          eventId: event.id,
          ticketType: 'Standard',
          quantity: 1,
          price: event.price || 0
        }
      }
    });
  };

  const toggleLike = () => {
    setIsLiked(!isLiked);
    message.info(isLiked ? 'Đã xóa khỏi danh sách yêu thích' : 'Đã thêm vào danh sách yêu thích');
  };

  // === FIX LỖI "Maximum update depth exceeded" Ở ĐÂY ===
  useEffect(() => {
    let isMounted = true; // Biến cờ để kiểm tra component còn mounted hay không

    // Đặt loading state của trang về true khi bắt đầu tải dữ liệu mới
    setIsLoadingPage(true);
    window.scrollTo(0, 0); // Cuộn lên đầu trang

    // Chỉ thực hiện fetch dữ liệu khi eventsHookLoading đã hoàn tất
    if (eventsHookLoading) {
      return; // Nếu hook vẫn đang tải, đợi lần render tiếp theo
    }

    const fetchedEvent = getEventById(detailid); // Lấy sự kiện theo ID

    if (!isMounted) return; // Nếu component đã unmount, không làm gì nữa

    if (fetchedEvent) {
      // Chỉ cập nhật state nếu dữ liệu thực sự khác
      setEvent(prevEvent => {
        if (!prevEvent || prevEvent.id !== fetchedEvent.id) {
          return fetchedEvent;
        }
        return prevEvent;
      });

      const related = getRelatedEvents(detailid, 3);
      setRelatedEvents(prevRelated => {
        // So sánh mảng để tránh cập nhật không cần thiết
        if (JSON.stringify(prevRelated) !== JSON.stringify(related)) {
          return related;
        }
        return prevRelated;
      });

      if (allEventsFromHook && allEventsFromHook.length > 0) {
        const sameCategoryEvents = allEventsFromHook
          .filter(e => e.category === fetchedEvent.category && e.id !== fetchedEvent.id)
          .slice(0, 4);
        setCategoryEvents(prevCategoryEvents => {
          // So sánh mảng để tránh cập nhật không cần thiết
          if (JSON.stringify(prevCategoryEvents) !== JSON.stringify(sameCategoryEvents)) {
            return sameCategoryEvents;
          }
          return prevCategoryEvents;
        });
      }
      
      // Khi đã có dữ liệu, đặt loading state của trang về false
      if (isMounted) {
        setIsLoadingPage(false);
      }
    } else {
      // Nếu không tìm thấy sự kiện, báo lỗi và điều hướng
      message.error('Không tìm thấy sự kiện này.');
      if (isMounted) { // Chỉ điều hướng nếu component vẫn mounted
        navigate('/events', { replace: true }); // Dùng replace để tránh thêm vào lịch sử trình duyệt
      }
    }

    // Cleanup function: Đặt isMounted về false khi component unmount
    return () => {
      isMounted = false;
    };
  }, [
    detailid, // Re-run khi detailid thay đổi (chuyển sang sự kiện khác)
    getEventById, // Callback function từ hook, nên là stable
    getRelatedEvents, // Callback function từ hook, nên là stable
    allEventsFromHook, // Dữ liệu từ hook, nếu thay đổi sẽ re-run
    eventsHookLoading, // Khi loading state của hook thay đổi (từ true sang false)
    navigate // navigate function là stable, nhưng nên có để ESLint không cảnh báo
    // Không thêm setEvent, setRelatedEvents, setCategoryEvents vào đây để tránh vòng lặp
  ]);

  if (isLoadingPage || !event) {
    return (
      <div className="event-detail-loading">
        <Spin size="large" />
        <p>Đang tải thông tin sự kiện...</p>
        {!isLoadingPage && !event && <p>Sự kiện không tồn tại hoặc đã bị xóa.</p>}
      </div>
    );
  }

  return (
    <div className="event-detail-page">
      <div className="event-detail-header">
        <div className="parallax-bg" style={{ backgroundImage: `url(${event.image})` }}></div>
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
          {event.isFeatured && <div className="featured-badge">Sự kiện nổi bật</div>}
          <h1 className="event-title">{event.title}</h1>
          <div className="event-meta">
            <div className="event-info">
              <span className="event-rating">
                <StarFilled /> {event.rating || 4.5} ({event.soldCount} đã bán)
              </span>
              <Tag className="event-status available">Còn vé</Tag>
              <Tag
                color="blue"
                className="category-tag"
                onClick={(e) => handleCategoryClick(event.category, e)}
                style={{ cursor: 'pointer' }}
              >
                {event.category}
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
                <Link to={`/events?category=${encodeURIComponent(event.category)}`}>
                  {event.category}
                </Link>
              ),
            },
            {
              title: event.title,
            },
          ]}
        />

        <Row gutter={[30, 30]}>
          <Col xs={24} lg={16}>
            <div className="event-detail-content">
              <div className="event-gallery">
                <Carousel autoplay effect="fade">
                  <div className="gallery-item">
                    <img src={event.image} alt={`${event.title} - gallery 1`} />
                  </div>
                  <div className="gallery-item">
                    <img src={event.image} alt={`${event.title} - gallery 2`} />
                  </div>
                </Carousel>
              </div>

              <Tabs defaultActiveKey="description" className="event-tabs">
                <TabPane tab="Thông tin sự kiện" key="description">
                  <div className="event-description">
                    <Title level={4}>Giới thiệu sự kiện</Title>
                    <Paragraph>
                      {event.description || 'Chưa có mô tả cho sự kiện này.'}
                    </Paragraph>

                    {event.longDescription && (
                      <>
                        <Title level={5}>Mô tả chi tiết</Title>
                        <Paragraph>
                          {event.longDescription}
                        </Paragraph>
                      </>
                    )}

                    <Space className="event-highlights" wrap>
                      <div className="highlight-item">
                        <CalendarOutlined className="highlight-icon" />
                        <div className="highlight-content">
                          <Text strong>{new Date(event.date).toLocaleDateString('vi-VN')}</Text>
                          <Text type="secondary">Ngày diễn ra</Text>
                        </div>
                      </div>

                      <div className="highlight-item">
                        <ClockCircleOutlined className="highlight-icon" />
                        <div className="highlight-content">
                          <Text strong>{event.time || 'Thời gian chưa xác định'}</Text>
                          <Text type="secondary">Thời gian</Text>
                        </div>
                      </div>

                      <div className="highlight-item">
                        <EnvironmentOutlined className="highlight-icon" />
                        <div className="highlight-content">
                          <Text strong>{event.location}</Text>
                          <Text type="secondary">Địa điểm</Text>
                        </div>
                      </div>

                      <div className="highlight-item">
                        <DollarOutlined className="highlight-icon" />
                        <div className="highlight-content">
                          <Text strong>{event.price ? `${event.price.toLocaleString('vi-VN')} VNĐ` : 'Miễn phí'}</Text>
                          <Text type="secondary">Giá vé</Text>
                        </div>
                      </div>
                    </Space>

                    <Divider />
                    <Title level={4}>Lịch trình sự kiện</Title>
                    <List
                      className="event-schedule"
                      size="large"
                      bordered
                      dataSource={[
                        { time: '18:30 - 19:00', title: 'Đón khách & check-in' },
                        { time: '19:00 - 19:15', title: 'Khai mạc sự kiện' },
                        { time: '19:15 - 20:30', title: 'Chương trình chính' },
                        { time: '20:30 - 21:00', title: 'Giao lưu & kết nối' },
                        { time: '21:00 - 22:00', title: 'Bế mạc & tặng quà lưu niệm' }
                      ]}
                      renderItem={item => (
                        <List.Item>
                          <Text className="schedule-time">{item.time}</Text>
                          <Text>{item.title}</Text>
                        </List.Item>
                      )}
                    />
                  </div>
                </TabPane>

                <TabPane tab="Địa điểm" key="location">
                  <div className="event-location">
                    <Title level={4}>Thông tin địa điểm</Title>
                    <Paragraph>
                      <EnvironmentOutlined /> {event.address || event.location}
                    </Paragraph>
                    <div className="location-map">
                      {/* Thêm API Key của bạn vào đây */}
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

     {categoryEvents.length > 0 && (
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

        {relatedEvents.length > 0 && (
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
                          {/* Nút Xem chi tiết:
                              - Nếu muốn nút ĐIỀU HƯỚNG THEO LINK CHA:
                                + Bỏ onClick handler của nút này
                              - Nếu muốn nút có hành vi RIÊNG (ví dụ, mở modal thay vì điều hướng):
                                + Giữ onClick và thêm e.stopPropagation()
                          */}
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
  );
};

export default EventDetailsPage;