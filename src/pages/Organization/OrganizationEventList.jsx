import React, { useEffect } from 'react';
import { Card, Table, Button, Tag, Space, message, Modal, Breadcrumb } from 'antd';
import { 
  PlusOutlined, EditOutlined, DeleteOutlined, EyeOutlined, 
  HomeOutlined, CalendarOutlined, TikTokOutlined 
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import MainLayout from '../../components/layout/MainLayout';
import { useOrganizationEvents } from '../../hooks/useOrganizationEvents';
import '../../assets/scss/OrganizationEventList.scss';

const OrganizationEventList = () => {
  const navigate = useNavigate();
  const { 
    events, 
    loading, 
    error, 
    deleteEvent: deleteEventAction, 
    loadEvents,
    clearError 
  } = useOrganizationEvents();

  useEffect(() => {
    // Load events when component mounts
    loadEvents();
  }, [loadEvents]);

  useEffect(() => {
    // Show error message if any
    if (error) {
      message.error(error);
      clearError();
    }
  }, [error, clearError]);

  const getStatusTag = (status) => {
    // Map status number to label and color
    const statusConfig = {
      1: { color: 'default', text: 'Riêng tư' },
      2: { color: 'green', text: 'Đã xuất bản' },
      3: { color: 'red', text: 'Đã hủy' },
      4: { color: 'blue', text: 'Đang diễn ra' },
      5: { color: 'purple', text: 'Đã hoàn thành' },
      6: { color: 'orange', text: 'Hết vé' }
    };
    let config = statusConfig[status];
    // fallback for string status (old data)
    if (!config) {
      const legacy = {
        pending: { color: 'orange', text: 'Chờ duyệt' },
        approved: { color: 'green', text: 'Đã duyệt' },
        rejected: { color: 'red', text: 'Từ chối' },
        cancelled: { color: 'gray', text: 'Đã hủy' }
      };
      config = legacy[status] || { color: 'default', text: status };
    }
    return <Tag color={config.color}>{config.text}</Tag>;
  };

  const getTypeTag = (type) => {
    const typeConfig = {
      meeting: { color: 'blue', text: 'Meeting' },
      seminar: { color: 'purple', text: 'Seminar' }
    };
    
    const config = typeConfig[type] || { color: 'default', text: type };
    return <Tag color={config.color}>{config.text}</Tag>;
  };

  const handleDelete = async (eventId) => {
    Modal.confirm({
      title: 'Xác nhận xóa',
      content: 'Bạn có chắc chắn muốn xóa sự kiện này?',
      okText: 'Xóa',
      cancelText: 'Hủy',
      okType: 'danger',
      onOk: async () => {
        const result = await deleteEventAction(eventId);
        if (result.success) {
          message.success('Đã xóa sự kiện thành công!');
        } else {
          message.error(result.error || 'Không thể xóa sự kiện');
        }
      }
    });
  };

  const columns = [
    {
      title: 'Tên sự kiện',
      dataIndex: 'name',
      key: 'name',
      render: (text, record) => (
        <div className="event-title">
          <div className="title">{text || record.title}</div>
          <div className="meta">
            {getTypeTag(record.type || 'event')}
            <span className="date">
              <CalendarOutlined /> {new Date(record.date_Start || record.date).toLocaleDateString('vi-VN')}
            </span>
          </div>
        </div>
      )
    },
    {
      title: 'Mô tả',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true,
      render: (text) => text || 'Chưa có mô tả'
    },
    {
      title: 'Slots',
      key: 'slots',
      render: (_, record) => (
        <div className="attendees-info">
          <TikTokOutlined /> {record.slot || 0}
        </div>
      )
    },
    {
      title: 'Giá',
      dataIndex: 'price',
      key: 'price',
      render: (price) => price ? `${price.toLocaleString('vi-VN')} VND` : 'Miễn phí'
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status) => getStatusTag(status || 'pending')
    },
    {
      title: 'Hành động',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button 
            type="text" 
            icon={<EyeOutlined />}
            onClick={() => navigate(`/events/${record.eventID || record.id}`)}
            title="Xem chi tiết"
          />
          <Button 
            type="text" 
            icon={<EditOutlined />}
            onClick={() => navigate(`/organization/events/edit/${record.eventID || record.id}`)}
            disabled={record.status === 'approved'}
            title="Chỉnh sửa"
          />
          <Button 
            type="text" 
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record.eventID || record.id)}
            disabled={record.status === 'approved'}
            title="Xóa"
          />
        </Space>
      )
    }
  ];

  return (
    <MainLayout 
      className="organization-event-list"
      contentClassName="page-content"
    >
      <div className="page-header">
        <div className="container">
          <Breadcrumb
            items={[
              {
                title: (
                  <a onClick={() => navigate('/')}>
                    <HomeOutlined /> Trang chủ
                  </a>
                ),
              },
              {
                title: 'Quản lý sự kiện',
              },
            ]}
          />
          
          <div className="page-title">
            <div className="title-section">
              <h1>Quản lý sự kiện</h1>
              <p>Danh sách các sự kiện đã đăng ký</p>
            </div>
            <Button 
              type="primary" 
              size="large"
              icon={<PlusOutlined />}
              onClick={() => navigate('/organization/events/register')}
              className="create-button"
            >
              Tạo sự kiện mới
            </Button>
          </div>
        </div>
      </div>

      <div className="container">
        <Card className="events-table-card">
          <Table
            columns={columns}
              dataSource={events}
              loading={loading}
              rowKey={(record) => record.eventID || record.id}
              pagination={{
                total: events.length,
                pageSize: 10,
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total, range) => 
                  `${range[0]}-${range[1]} của ${total} sự kiện`
              }}
              className="events-table"
            />
          </Card>
        </div>
    </MainLayout>
  );
};

export default OrganizationEventList;
