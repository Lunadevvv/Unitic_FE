import React from 'react';
import { 
  Card, Button, Space, Tag, Divider, Row, Col, 
  Avatar, Typography, Timeline, Descriptions 
} from 'antd';
import { 
  EditOutlined, CheckOutlined, CalendarOutlined, 
  EnvironmentOutlined, TikTokOutlined, DollarOutlined,
  ClockCircleOutlined, TagsOutlined, UserOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';

const { Title, Text, Paragraph } = Typography;

const EventPreview = ({ eventData, onConfirm, onEdit, loading }) => {
  const getEventTypeInfo = (type) => {
    const types = {
      meeting: { color: 'blue', label: 'Meeting' },
      seminar: { color: 'purple', label: 'Seminar' },
      conference: { color: 'green', label: 'Conference' },
      training: { color: 'orange', label: 'Training' },
      networking: { color: 'cyan', label: 'Networking' }
    };
    return types[type] || { color: 'default', label: type };
  };

  const formatDate = (dateString) => {
    return dayjs(dateString).format('DD/MM/YYYY HH:mm');
  };

  const calculateDuration = () => {
    if (eventData.startDate && eventData.endDate) {
      const start = dayjs(eventData.startDate);
      const end = dayjs(eventData.endDate);
      const duration = end.diff(start, 'hour', true);
      
      if (duration < 1) {
        return `${Math.round(duration * 60)} phút`;
      } else if (duration < 24) {
        return `${duration.toFixed(1)} giờ`;
      } else {
        return `${Math.round(duration / 24)} ngày`;
      }
    }
    return 'Chưa xác định';
  };

  const typeInfo = getEventTypeInfo(eventData.type);

  return (
    <div className="event-preview">
      <Card className="preview-card">
        <div className="preview-header">
          <div className="event-image">
            {eventData.imageUrl ? (
              <img src={eventData.imageUrl} alt="Event" />
            ) : (
              <div className="placeholder-image">
                <CalendarOutlined />
                <span>Chưa có ảnh</span>
              </div>
            )}
          </div>
          
          <div className="event-info">
            <div className="event-meta">
              <Tag color={typeInfo.color}>{typeInfo.label}</Tag>
              <Tag color="blue">{eventData.category}</Tag>
              {eventData.hasTickets && <Tag color="gold">Có phí</Tag>}
              {!eventData.isPublic && <Tag color="red">Riêng tư</Tag>}
            </div>
            
            <Title level={2}>{eventData.title}</Title>
            
            <div className="organizer-info">
              <Avatar icon={<UserOutlined />} />
              <span>{eventData.organizer}</span>
            </div>
            
            <Paragraph className="description">
              {eventData.description}
            </Paragraph>
          </div>
        </div>

        <Divider />

        <Row gutter={[24, 16]}>
          <Col xs={24} lg={12}>
            <Card size="small" title="Thông tin thời gian">
              <Timeline
                items={[
                  {
                    dot: <ClockCircleOutlined style={{ color: '#52c41a' }} />,
                    children: (
                      <div>
                        <Text strong>Bắt đầu</Text>
                        <br />
                        <Text>{formatDate(eventData.startDate)}</Text>
                      </div>
                    ),
                  },
                  {
                    dot: <ClockCircleOutlined style={{ color: '#ff4d4f' }} />,
                    children: (
                      <div>
                        <Text strong>Kết thúc</Text>
                        <br />
                        <Text>{formatDate(eventData.endDate)}</Text>
                      </div>
                    ),
                  },
                ]}
              />
              <div className="duration-info">
                <Text type="secondary">
                  Thời lượng: <Text strong>{calculateDuration()}</Text>
                </Text>
              </div>
            </Card>
          </Col>

          <Col xs={24} lg={12}>
            <Card size="small" title="Thông tin địa điểm">
              <div className="location-info">
                <EnvironmentOutlined style={{ color: '#1890ff', marginRight: 8 }} />
                <Text>{eventData.location}</Text>
              </div>
              
              <Divider style={{ margin: '12px 0' }} />
              
              <div className="capacity-info">
                <TikTokOutlined style={{ color: '#52c41a', marginRight: 8 }} />
                <Text>Sức chứa: <Text strong>{eventData.maxAttendees} người</Text></Text>
              </div>
            </Card>
          </Col>
        </Row>

        {eventData.longDescription && (
          <>
            <Divider />
            <Card size="small" title="Mô tả chi tiết">
              <Paragraph style={{ whiteSpace: 'pre-line' }}>
                {eventData.longDescription}
              </Paragraph>
            </Card>
          </>
        )}

        {eventData.hasTickets && eventData.ticketTypes?.length > 0 && (
          <>
            <Divider />
            <Card size="small" title="Thông tin vé">
              <Row gutter={[16, 16]}>
                {eventData.ticketTypes.map((ticket, index) => (
                  <Col xs={24} sm={12} lg={8} key={index}>
                    <Card size="small" className="ticket-type-card">
                      <div className="ticket-header">
                        <Text strong>{ticket.name}</Text>
                        <Text className="ticket-price">
                          {ticket.price === 0 ? 'Miễn phí' : `${ticket.price.toLocaleString('vi-VN')} VNĐ`}
                        </Text>
                      </div>
                      {ticket.description && (
                        <Text type="secondary" className="ticket-desc">
                          {ticket.description}
                        </Text>
                      )}
                      <div className="ticket-quantity">
                        <Text type="secondary">
                          Số lượng: {ticket.quantity || 'Không giới hạn'}
                        </Text>
                      </div>
                    </Card>
                  </Col>
                ))}
              </Row>
            </Card>
          </>
        )}

        <Divider />

        <Descriptions title="Cài đặt sự kiện" column={2} size="small">
          <Descriptions.Item label="Trạng thái">
            <Tag color="orange">Chờ duyệt</Tag>
          </Descriptions.Item>
          <Descriptions.Item label="Đăng ký">
            {eventData.allowRegistration ? (
              <Tag color="green">Cho phép</Tag>
            ) : (
              <Tag color="red">Tạm khóa</Tag>
            )}
          </Descriptions.Item>
          <Descriptions.Item label="Hiển thị">
            {eventData.isPublic ? (
              <Tag color="blue">Công khai</Tag>
            ) : (
              <Tag color="default">Riêng tư</Tag>
            )}
          </Descriptions.Item>
          <Descriptions.Item label="Bán vé">
            {eventData.hasTickets ? (
              <Tag color="gold">Có phí</Tag>
            ) : (
              <Tag color="green">Miễn phí</Tag>
            )}
          </Descriptions.Item>
        </Descriptions>

        {eventData.note && (
          <>
            <Divider />
            <Card size="small" title="Ghi chú cho admin">
              <Text type="secondary">{eventData.note}</Text>
            </Card>
          </>
        )}

        <Divider />

        <div className="preview-actions">
          <Space size="large">
            <Button 
              size="large"
              icon={<EditOutlined />}
              onClick={onEdit}
            >
              Chỉnh sửa
            </Button>
            <Button 
              type="primary" 
              size="large"
              icon={<CheckOutlined />}
              loading={loading}
              onClick={onConfirm}
            >
              Xác nhận và gửi đăng ký
            </Button>
          </Space>
        </div>
      </Card>
    </div>
  );
};

export default EventPreview;
