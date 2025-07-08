import React, { useState, useEffect } from 'react';
import { Card, Table, Button, Tag, Space, message, Modal, Breadcrumb } from 'antd';
import { 
  PlusOutlined, EditOutlined, DeleteOutlined, EyeOutlined, 
  HomeOutlined, CalendarOutlined, TikTokOutlined 
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import MainLayout from '../../components/layout/MainLayout';
import '../../assets/scss/OrganizationEventList.scss';

const OrganizationEventList = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock data - would be replaced with API call
    const mockEventsData = [
      {
        id: 1,
        title: 'Workshop UX/UI Design 2024',
        type: 'seminar',
        date: '2024-01-15T09:00:00',
        location: 'Tòa nhà FPT, TP.HCM',
        status: 'approved',
        attendees: 45,
        maxAttendees: 50,
        createdAt: '2023-12-20T10:00:00',
        hasTickets: true
      },
      {
        id: 2,
        title: 'Meeting Quý 4 - Báo cáo KPI',
        type: 'meeting',
        date: '2024-01-20T14:00:00',
        location: 'Phòng họp A, Tầng 5',
        status: 'pending',
        attendees: 0,
        maxAttendees: 20,
        createdAt: '2023-12-25T15:30:00',
        hasTickets: false
      },
      {
        id: 3,
        title: 'Seminar Marketing Digital',
        type: 'seminar',
        date: '2024-02-01T10:00:00',
        location: 'Khách sạn Rex, TP.HCM',
        status: 'rejected',
        attendees: 0,
        maxAttendees: 100,
        createdAt: '2023-12-28T11:00:00',
        hasTickets: true
      }
    ];
    
    // Simulate API call
    const loadEvents = () => {
      setTimeout(() => {
        setEvents(mockEventsData);
        setLoading(false);
      }, 1000);
    };
    
    loadEvents();
  }, []);

  const getStatusTag = (status) => {
    const statusConfig = {
      pending: { color: 'orange', text: 'Chờ duyệt' },
      approved: { color: 'green', text: 'Đã duyệt' },
      rejected: { color: 'red', text: 'Từ chối' },
      cancelled: { color: 'gray', text: 'Đã hủy' }
    };
    
    const config = statusConfig[status] || { color: 'default', text: status };
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

  const handleDelete = (id) => {
    Modal.confirm({
      title: 'Xác nhận xóa',
      content: 'Bạn có chắc chắn muốn xóa sự kiện này?',
      okText: 'Xóa',
      cancelText: 'Hủy',
      okType: 'danger',
      onOk: () => {
        setEvents(events.filter(event => event.id !== id));
        message.success('Đã xóa sự kiện thành công!');
      }
    });
  };

  const columns = [
    {
      title: 'Tên sự kiện',
      dataIndex: 'title',
      key: 'title',
      render: (text, record) => (
        <div className="event-title">
          <div className="title">{text}</div>
          <div className="meta">
            {getTypeTag(record.type)}
            <span className="date">
              <CalendarOutlined /> {new Date(record.date).toLocaleDateString('vi-VN')}
            </span>
          </div>
        </div>
      )
    },
    {
      title: 'Địa điểm',
      dataIndex: 'location',
      key: 'location',
      ellipsis: true
    },
    {
      title: 'Người tham gia',
      key: 'attendees',
      render: (_, record) => (
        <div className="attendees-info">
          <TikTokOutlined /> {record.attendees}/{record.maxAttendees}
        </div>
      )
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status) => getStatusTag(status)
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date) => new Date(date).toLocaleDateString('vi-VN')
    },
    {
      title: 'Hành động',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button 
            type="text" 
            icon={<EyeOutlined />}
            onClick={() => navigate(`/events/${record.id}`)}
            title="Xem chi tiết"
          />
          <Button 
            type="text" 
            icon={<EditOutlined />}
            onClick={() => navigate(`/organization/events/edit/${record.id}`)}
            disabled={record.status === 'approved'}
            title="Chỉnh sửa"
          />
          <Button 
            type="text" 
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record.id)}
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
              rowKey="id"
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
