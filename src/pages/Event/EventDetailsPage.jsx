import { useCallback, useState, useEffect } from 'react';
import { useParams, useNavigate, Link, useSearchParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Row, Col, Divider, Tag, Button, Carousel, Tooltip, message, Breadcrumb, Tabs, List, Typography, Space, Spin } from 'antd';
import { CalendarOutlined, EnvironmentOutlined, TeamOutlined, ShareAltOutlined, HeartOutlined, HeartFilled, StarFilled, ArrowLeftOutlined, UserOutlined, HomeOutlined, TagOutlined, ClockCircleOutlined, DollarOutlined, ArrowRightOutlined } from '@ant-design/icons';
import EventCard from '../../components/event/EventCard';
import MainLayout from '../../components/layout/MainLayout';
import { fetchEventById, fetchEvents } from '../../store/actions/eventsActions';
import { fetchCategories } from '../../store/actions/categoryActions';
import '../../assets/scss/EventDetail.scss';

const { TabPane } = Tabs;
const { Title, Paragraph, Text } = Typography;

const EventDetailsPage = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loadingFeedbacks, setLoadingFeedbacks] = useState(false);
  const [feedbackUsers, setFeedbackUsers] = useState({});
  const { detailid } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const { currentEvent: event, categoryEvents = [], relatedEvents = [], loading } = useSelector(state => state.events);
  const { isAuthenticated } = useSelector(state => state.auth);
  const { categories: categoryList } = useSelector(state => state.category);
  const [isLiked, setIsLiked] = useState(false);
  const fromCategory = searchParams.get('fromCategory');

  // (Removed duplicate/misplaced useEffect)
  useEffect(() => {
    if (detailid) {
      dispatch(fetchEventById(detailid));
    }
    dispatch(fetchCategories());
    dispatch(fetchEvents());
  }, [dispatch, detailid]);

  // Fetch feedbacks for completed events
  useEffect(() => {
    const fetchFeedbacksWithUsers = async () => {
      if (event && event.status === 5) {
        setLoadingFeedbacks(true);
        try {
          const token = localStorage.getItem('token');
          const res = await fetch(`https://localhost:7163/api/Feedback?eventId=${event.eventID || event.eventId || detailid}`,
            {
              headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
              }
            }
          );
          const feedbackList = await res.json();
          setFeedbacks(Array.isArray(feedbackList) ? feedbackList : []);
          // Fetch user info for each feedback
          const userMap = {};
          await Promise.all(feedbackList.map(async fb => {
            // Get booking info
            if (fb.bookingId) {
              try {
                const bookingRes = await fetch(`https://localhost:7163/api/Booking/${fb.bookingId}`,
                  {
                    headers: {
                      'Authorization': `Bearer ${token}`,
                      'Content-Type': 'application/json'
                    }
                  }
                );
                const bookingData = await bookingRes.json();
                if (bookingData?.accountId) {
                  const userRes = await fetch(`https://localhost:7163/Unitic/account/${bookingData.accountId}`,
                    {
                      headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                      }
                    }
                  );
                  const userData = await userRes.json();
                  userMap[fb.feedbackId] = userData;
                }
              } catch (err) {
                userMap[fb.feedbackId] = null;
              }
            }
          }));
          setFeedbackUsers(userMap);
        } catch {
          setFeedbacks([]);
          setFeedbackUsers({});
        } finally {
          setLoadingFeedbacks(false);
        }
      } else {
        setFeedbacks([]);
        setFeedbackUsers({});
      }
    };
    fetchFeedbacksWithUsers();
  }, [event, detailid]);

  // Helper to format date
  const formatDate = (dateString) => {
    if (!dateString) return 'Chưa xác định';
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  // Helper to format time
  const formatTime = (dateString) => {
    if (!dateString) return 'Chưa xác định';
    return new Date(dateString).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
  };
const getCategoryName = useCallback((cateID) => {
    const category = categoryList?.find(cat => cat.cateID === cateID);
    return category?.name || cateID;
  }, [categoryList]);

   const handleCategoryClick = useCallback((categoryID, e) => { // Changed parameter name to categoryID for clarity
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    // Use the actual category name for navigation if available
    const categoryName = getCategoryName(categoryID);
    navigate({ pathname: '/events', search: `?category=${encodeURIComponent(categoryName)}` });
  }, [navigate, getCategoryName]); 
  const handleBackButtonClick = useCallback(() => {
    if (fromCategory) {
      navigate(`/events?category=${encodeURIComponent(fromCategory)}`);
    } else {
      navigate('/events');
    }
  }, [navigate, fromCategory]);

  const handleAddToCart = async () => {
    if (!event) return;

    // Kiểm tra xem user đã đăng nhập chưa
    if (!isAuthenticated) {
      message.warning('Vui lòng đăng nhập để mua vé');
      navigate('/signin');
      return;
    }

    // Chuyển đến trang checkout với thông tin sự kiện
    navigate(`/checkout/${event.eventID || detailid}`, {
      state: {
        checkoutData: {
          eventId: event.eventID || detailid,
          eventTitle: event.name,
          eventDate: event.date_Start,
          eventTime: event.time || '19:00', // Still using event.time as fallback if API doesn't provide it
          eventLocation: event.location || event.address || 'Địa điểm sẽ được thông báo',
          eventImage: event.image || '/src/assets/img/event1.jpeg',
          ticketType: 'Standard', // This should ideally be selected by user
          quantity: 1, // This should ideally be selected by user
          price: event.price || 0,
          totalAmount: event.price || 0
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
          <div className="parallax-bg" style={{ backgroundImage: `url(${event.image || '/src/assets/img/event1.jpeg'})` }}></div>
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
                  <Link to={`/events?category=${encodeURIComponent(getCategoryName(event?.cateID || ''))}`}> {/* Use getCategoryName here */}
                    <TagOutlined /> {getCategoryName(event?.cateID)} 
                  </Link>
                ),
              },
              {
                title: (<span style={{ color: 'aliceblue' }}>{event?.name}</span>),
              },
            ]}
          />

          <Row gutter={[30, 30]}>
            <Col xs={24} lg={16}>
              <div className="event-detail-content">
                <div className="event-gallery">
                  <Carousel autoplay effect="fade">
                    {/* Assuming event.images is an array of image URLs. If not, fallback to event.image */}
                    {(event.images && event.images.length > 0) ? (
                      event.images.map((img, index) => (
                        <div className="gallery-item" key={index}>
                          <img src={img} alt={`${event?.name} - gallery ${index + 1}`} />
                        </div>
                      ))
                    ) : (
                      <div className="gallery-item">
                        <img src={event.image || '/src/assets/img/event1.jpeg'} alt={`${event?.name} main image`} />
                      </div>
                    )}
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
                            <Text strong>{formatDate(event?.date_Start)}</Text>
                            <Text type="secondary">Ngày bắt đầu</Text>
                          </div>
                        </div>

                        <div className="highlight-item">
                          <ClockCircleOutlined className="highlight-icon" />
                          <div className="highlight-content">
                            <Text strong>{formatDate(event?.date_End)}</Text>
                            <Text type="secondary">Ngày kết thúc</Text>
                          </div>
                        </div>

                        <div className="highlight-item">
                          <EnvironmentOutlined className="highlight-icon" />
                          <div className="highlight-content">
                            <Text strong>{event?.address || event?.location || 'Địa điểm sẽ được thông báo'}</Text>
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
                            <Text type="secondary">Số lượng chỗ còn lại</Text>
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
                      <Paragraph style={{ color: 'aliceblue' }}>
                        <EnvironmentOutlined /> {event.address || event.location || 'Địa điểm chưa được cung cấp'}
                      </Paragraph>
                      <Paragraph style={{ color: 'aliceblue' }}>
                        Ghi chú: Vui lòng đến sớm 30 phút để check-in và nhận chỗ ngồi.
                      </Paragraph>
                    </div>
                  </TabPane>

                  <TabPane tab="Chính sách" key="policy">
                    <div  className="event-policy">
                      <Title style={{ color: 'aliceblue' }} level={4}>Chính sách vé</Title>
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
                            <Text style={{ color: 'aliceblue' }}>{item}</Text>
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
                      onClick={() => {
                        // Example share functionality (can be expanded)
                        if (navigator.share) {
                          navigator.share({
                            title: event.name,
                            text: event.description,
                            url: window.location.href,
                          }).then(() => {
                            message.success('Chia sẻ thành công!');
                          }).catch((error) => {
                            message.error('Không thể chia sẻ: ' + error.message);
                          });
                        } else {
                          // Fallback for browsers that don't support Web Share API
                          navigator.clipboard.writeText(window.location.href);
                          message.success('Đã sao chép đường dẫn sự kiện!');
                        }
                      }}
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
                        <p>{formatDate(event.date_Start)}</p>
                      </div>
                    </li>
                    <li>
                      <ClockCircleOutlined className="icon" />
                      <div>
                        <strong>Thời gian</strong>
                        <p>
                          {formatTime(event.date_Start)} - {formatTime(event.date_End)}
                        </p>
                      </div>
                    </li>
                    <li>
                      <EnvironmentOutlined className="icon" />
                      <div>
                        <strong>Địa điểm</strong>
                        <p>{event.location || event.address || 'Đang cập nhật'}</p>
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
                          <Tag
                            color="blue"
                            onClick={(e) => handleCategoryClick(event.cateID, e)}
                            style={{ cursor: 'pointer' }}
                          >
                            {getCategoryName(event.cateID)}
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
                              style={{ width: `${(event.soldCount / (event.slot || 1)) * 100}%` }}
                            ></div>
                          </div>
                          <span>{event.slot || 'Không giới hạn'} chỗ còn lại</span>
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

          {/* Feedback section for completed events */}
          {event.status === 5 && (
            <section className="event-feedback-section">
              <Title className='event-feedback-title' level={4} style={{ marginBottom: 16, fontWeight: 600 }}>Feedback từ người tham dự</Title>
              {loadingFeedbacks ? (
                <Spin />
              ) : feedbacks.length === 0 ? (
                <Paragraph type="secondary">Chưa có feedback nào cho sự kiện này.</Paragraph>
              ) : (
                <List
                  itemLayout="horizontal"
                  dataSource={feedbacks}
                  renderItem={fb => {
                    const user = feedbackUsers[fb.feedbackId];
                    const dateObj = new Date(fb.createdDate);
                    const timeStr = `${dateObj.getHours().toString().padStart(2, '0')}:${dateObj.getMinutes().toString().padStart(2, '0')}:${dateObj.getSeconds().toString().padStart(2, '0')} ${dateObj.getDate()}/${dateObj.getMonth()+1}/${dateObj.getFullYear()}`;
                    return (
                      <List.Item key={fb.feedbackId} className="feedback-chat-item-horizontal">
                        <div className="feedback-chat-row">
                          <div className="feedback-chat-avatar">
                           
                          </div>
                          <div className="feedback-chat-info">
                            <div className="feedback-chat-name-row">
                              <span className="feedback-chat-name">{user ? `${user.firstName || ''} ${user.lastName || ''}` : 'Ẩn danh'}</span>
                              {user?.role ? <Tag color="purple">{user.role === 1 ? 'Admin' : user.role === 2 ? 'Moderator' : user.role === 3 ? 'Staff' : user.role === 4 ? 'Organizer' : user.role === 5 ? 'User' : 'Khác'}</Tag> : null}
                              <span className="feedback-chat-time">{timeStr}</span>
                            </div>
                            <div className="feedback-chat-content">{fb.content}</div>
                          </div>
                        </div>
                      </List.Item>
                    );
                  }}
                />
              )}
            </section>
          )}

          {categoryEvents && categoryEvents.length > 0 && (
            <section className="category-events-section">
              <div className="section-header">
                <h2 className="section-title">
                  <TagOutlined className="section-icon" />
                   Các sự kiện cùng danh mục "{getCategoryName(event.cateID)}"                </h2>
                <Link
                  to={`/events?category=${encodeURIComponent(getCategoryName(event.cateID))}`} 
                  className="view-all-link"
                >
                  Xem tất cả <ArrowRightOutlined />
                </Link>
              </div>

              <Row gutter={[24, 24]}>
                {categoryEvents.map(catEvent => (
                  <Col xs={24} sm={12} md={6} key={catEvent.eventID}> {/* Use eventID for key */}
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
                        detailLinkParams={`?fromCategory=${encodeURIComponent(event.cateID)}`}
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
                  <Col xs={24} sm={12} md={8} key={relEvent.eventID}> {/* Use eventID for key */}
                    <Link to={`/events/${relEvent.eventID}`}>
                      <div className="related-event-card">
                        <div className="related-event-image" style={{ backgroundImage: `url(${relEvent.image || '/src/assets/img/placeholder.jpeg'})` }}>
                          <div className="related-event-overlay"></div>
                          <div className="related-event-date">
                            <CalendarOutlined /> {formatDate(relEvent.date_Start)}
                          </div>
                          <Tag
                            className="category-tab"
                            onClick={(e) => handleCategoryClick(relEvent.cateID, e)}
                            style={{ cursor: 'pointer', marginLeft: 8 }}
                          >
                            <span className="category-name">{getCategoryName(relEvent.cateID)}</span>
                          </Tag>
                        </div>
                        <div className="related-event-content">
                          <h3>{relEvent.name}</h3> {/* Use name instead of title */}
                          <p><EnvironmentOutlined /> {relEvent.location || relEvent.address || 'Đang cập nhật'}</p>
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