import React, { useState, useEffect } from 'react';
import { 
  Card, Table, Button, Input, Space, Tag, message, 
  Modal, Statistic, Row, Col, QRCode, Avatar 
} from 'antd';
import { 
  SearchOutlined, QrcodeOutlined, UserOutlined, 
  CheckCircleOutlined, ClockCircleOutlined, ScanOutlined 
} from '@ant-design/icons';
import MainLayout from '../../components/layout/MainLayout';

const { Search } = Input;

const EventCheckInPage = () => {
  const [attendees, setAttendees] = useState([]);
  const [filteredAttendees, setFilteredAttendees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [qrModalVisible, setQrModalVisible] = useState(false);
  const [selectedAttendee, setSelectedAttendee] = useState(null);
  const [searchText, setSearchText] = useState('');

  // Mock data
  const mockAttendees = [
    {
      id: 1,
      ticketCode: 'TK001',
      name: 'Nguyễn Văn A',
      email: 'nguyenvana@email.com',
      phone: '0901234567',
      ticketType: 'VIP',
      status: 'checked-in',
      checkedInAt: '2024-01-15 08:30:00',
      avatar: '/src/assets/img/demo.jpg'
    },
    {
      id: 2,
      ticketCode: 'TK002',
      name: 'Trần Thị B',
      email: 'tranthib@email.com',
      phone: '0907654321',
      ticketType: 'Standard',
      status: 'registered',
      checkedInAt: null,
      avatar: null
    },
    {
      id: 3,
      ticketCode: 'TK003',
      name: 'Lê Văn C',
      email: 'levanc@email.com',
      phone: '0903456789',
      ticketType: 'Early Bird',
      status: 'checked-in',
      checkedInAt: '2024-01-15 09:15:00',
      avatar: null
    }
  ];

  useEffect(() => {
    loadAttendees();
  }, []);

  const loadAttendees = async () => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setAttendees(mockAttendees);
      setFilteredAttendees(mockAttendees);
    } catch {
      message.error('Không thể tải danh sách người tham dự!');
    } finally {
      setLoading(false);
    }
  };

  const handleCheckIn = async (attendee) => {
    try {
      const updatedAttendees = attendees.map(a => 
        a.id === attendee.id 
          ? { 
              ...a, 
              status: 'checked-in', 
              checkedInAt: new Date().toLocaleString('vi-VN') 
            }
          : a
      );
      setAttendees(updatedAttendees);
      setFilteredAttendees(updatedAttendees);
      message.success(`Check-in thành công cho ${attendee.name}!`);
    } catch {
      message.error('Không thể check-in!');
    }
  };

  const handleSearch = (value) => {
    setSearchText(value);
    const filtered = attendees.filter(attendee =>
      attendee.name.toLowerCase().includes(value.toLowerCase()) ||
      attendee.email.toLowerCase().includes(value.toLowerCase()) ||
      attendee.ticketCode.toLowerCase().includes(value.toLowerCase()) ||
      attendee.phone.includes(value)
    );
    setFilteredAttendees(filtered);
  };

  const showQRCode = (attendee) => {
    setSelectedAttendee(attendee);
    setQrModalVisible(true);
  };

  const getStatusColor = (status) => {
    return status === 'checked-in' ? 'green' : 'orange';
  };

  const getStatusText = (status) => {
    return status === 'checked-in' ? 'Đã check-in' : 'Chưa check-in';
  };

  const checkedInCount = attendees.filter(a => a.status === 'checked-in').length;
  const totalCount = attendees.length;

  const columns = [
    {
      title: 'Mã vé',
      dataIndex: 'ticketCode',
      key: 'ticketCode',
      width: 100,
    },
    {
      title: 'Thông tin người tham dự',
      key: 'attendeeInfo',
      render: (_, record) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Avatar 
            src={record.avatar} 
            icon={<UserOutlined />}
            size={40}
          />
          <div>
            <div style={{ fontWeight: 'bold' }}>{record.name}</div>
            <div style={{ fontSize: '12px', color: '#666' }}>
              {record.email}
            </div>
            <div style={{ fontSize: '12px', color: '#666' }}>
              {record.phone}
            </div>
          </div>
        </div>
      ),
    },
    {
      title: 'Loại vé',
      dataIndex: 'ticketType',
      key: 'ticketType',
      render: (type) => {
        const colors = {
          'VIP': 'gold',
          'Standard': 'blue',
          'Early Bird': 'green'
        };
        return <Tag color={colors[type]}>{type}</Tag>;
      }
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status, record) => (
        <div>
          <Tag 
            color={getStatusColor(status)}
            icon={status === 'checked-in' ? <CheckCircleOutlined /> : <ClockCircleOutlined />}
          >
            {getStatusText(status)}
          </Tag>
          {status === 'checked-in' && record.checkedInAt && (
            <div style={{ fontSize: '11px', color: '#666', marginTop: 4 }}>
              {record.checkedInAt}
            </div>
          )}
        </div>
      ),
    },
    {
      title: 'Hành động',
      key: 'actions',
      align: 'center',
      render: (_, record) => (
        <Space>
          <Button
            icon={<QrcodeOutlined />}
            size="small"
            onClick={() => showQRCode(record)}
            title="Xem QR Code"
          />
          {record.status !== 'checked-in' && (
            <Button
              type="primary"
              size="small"
              icon={<ScanOutlined />}
              onClick={() => handleCheckIn(record)}
            >
              Check-in
            </Button>
          )}
        </Space>
      ),
    },
  ];

  return (
    <MainLayout>
      <div className="event-checkin-page" style={{ padding: '24px' }}>
        <Card title="Check-in Sự kiện: Workshop UX/UI Design 2024">
          <Row gutter={16} style={{ marginBottom: 24 }}>
            <Col span={6}>
              <Statistic 
                title="Tổng số người đăng ký" 
                value={totalCount}
                prefix={<UserOutlined />}
              />
            </Col>
            <Col span={6}>
              <Statistic 
                title="Đã check-in" 
                value={checkedInCount}
                prefix={<CheckCircleOutlined />}
                valueStyle={{ color: '#3f8600' }}
              />
            </Col>
            <Col span={6}>
              <Statistic 
                title="Chưa check-in" 
                value={totalCount - checkedInCount}
                prefix={<ClockCircleOutlined />}
                valueStyle={{ color: '#cf1322' }}
              />
            </Col>
            <Col span={6}>
              <Statistic 
                title="Tỷ lệ check-in" 
                value={totalCount > 0 ? ((checkedInCount / totalCount) * 100).toFixed(1) : 0}
                suffix="%"
                valueStyle={{ color: '#1890ff' }}
              />
            </Col>
          </Row>

          <div style={{ marginBottom: 16 }}>
            <Search
              placeholder="Tìm kiếm theo tên, email, SĐT hoặc mã vé"
              allowClear
              enterButton={<SearchOutlined />}
              size="large"
              onSearch={handleSearch}
              onChange={(e) => handleSearch(e.target.value)}
              style={{ maxWidth: 400 }}
            />
          </div>

          <Table
            columns={columns}
            dataSource={filteredAttendees}
            rowKey="id"
            loading={loading}
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              showTotal: (total, range) =>
                `${range[0]}-${range[1]} của ${total} người tham dự`,
            }}
            scroll={{ x: 800 }}
          />
        </Card>

        <Modal
          title="QR Code Check-in"
          open={qrModalVisible}
          onCancel={() => setQrModalVisible(false)}
          footer={null}
          centered
        >
          {selectedAttendee && (
            <div style={{ textAlign: 'center' }}>
              <div style={{ marginBottom: 16 }}>
                <Avatar 
                  src={selectedAttendee.avatar} 
                  icon={<UserOutlined />}
                  size={64}
                />
                <h3 style={{ margin: '12px 0 4px' }}>{selectedAttendee.name}</h3>
                <p style={{ color: '#666', margin: 0 }}>{selectedAttendee.ticketCode}</p>
              </div>
              
              <QRCode 
                value={`CHECKIN:${selectedAttendee.ticketCode}:${selectedAttendee.id}`}
                size={200}
                style={{ marginBottom: 16 }}
              />
              
              <p style={{ fontSize: '12px', color: '#666' }}>
                Quét mã QR này để check-in nhanh
              </p>
            </div>
          )}
        </Modal>
      </div>
    </MainLayout>
  );
};

export default EventCheckInPage;
