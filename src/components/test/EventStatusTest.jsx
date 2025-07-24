import React, { useState } from 'react';
import { Card, Button, Space, Typography, Divider, Select, Input, message } from 'antd';

const { Text, Title } = Typography;
const { Option } = Select;

const EventStatusTest = () => {
  const [eventId, setEventId] = useState('Event001');
  const [newStatus, setNewStatus] = useState(2);
  const [loading, setLoading] = useState(false);

  const statusOptions = {
    1: 'Riêng tư (Private)',
    2: 'Đã xuất bản (Published)', 
    3: 'Đã hủy (Cancelled)',
    4: 'Đang diễn ra (InProgress)',
    5: 'Đã hoàn thành (Completed)',
    6: 'Hết vé (SoldOut)'
  };

  const testUpdateStatus = async () => {
    setLoading(true);
    try {
      const response = await fetch(`https://localhost:7163/Unitic/Event/status/${eventId}?status=${newStatus}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      if (response.ok) {
        message.success(`Cập nhật status thành công! Event ${eventId} → ${statusOptions[newStatus]}`);
      } else {
        const errorText = await response.text();
        message.error(`Lỗi API: ${response.status} - ${errorText}`);
      }
    } catch (error) {
      message.error('Lỗi kết nối: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const testUpdateEvent = async () => {
    setLoading(true);
    const eventData = {
      name: "Test Event Updated",
      image: "https://example.com/images/test_event.jpg",
      description: "Đây là sự kiện test đã được cập nhật",
      date_Start: "2025-08-15T09:00:00",
      date_End: "2025-08-15T17:00:00",
      price: 150000,
      cateID: "Cate0001",
      slot: 100
    };

    try {
      const response = await fetch(`https://localhost:7163/Unitic/Event/${eventId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(eventData)
      });
      
      if (response.ok) {
        message.success(`Cập nhật event thành công! Event ${eventId}`);
      } else {
        const errorText = await response.text();
        message.error(`Lỗi API: ${response.status} - ${errorText}`);
      }
    } catch (error) {
      message.error('Lỗi kết nối: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card title="Test Event Status & Update APIs" style={{ margin: '16px 0' }}>
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <div>
          <Title level={5}>API Test Configuration:</Title>
          <Space wrap>
            <div>
              <Text strong>Event ID: </Text>
              <Input 
                value={eventId}
                onChange={(e) => setEventId(e.target.value)}
                placeholder="Event001"
                style={{ width: 120 }}
              />
            </div>
            <div>
              <Text strong>New Status: </Text>
              <Select 
                value={newStatus}
                onChange={setNewStatus}
                style={{ width: 200 }}
              >
                {Object.entries(statusOptions).map(([value, label]) => (
                  <Option key={value} value={parseInt(value)}>
                    {value} - {label}
                  </Option>
                ))}
              </Select>
            </div>
          </Space>
        </div>

        <Divider />

        <div>
          <Title level={5}>API Test Actions:</Title>
          <Space wrap>
            <Button 
              type="primary"
              loading={loading}
              onClick={testUpdateStatus}
            >
              Test Update Status API
            </Button>
            <Button 
              type="default"
              loading={loading}
              onClick={testUpdateEvent}
            >
              Test Update Event API
            </Button>
          </Space>
        </div>

        <div style={{ backgroundColor: '#f0f0f0', padding: 12, borderRadius: 6 }}>
          <Text type="secondary" style={{ fontSize: '12px' }}>
            <strong>API Endpoints:</strong><br/>
            • Status Update: <code>PUT https://localhost:7163/Unitic/Event/status/{`{eventId}`}?status={`{status}`}</code><br/>
            • Event Update: <code>PUT https://localhost:7163/Unitic/Event/{`{eventId}`}</code><br/><br/>
            <strong>Status Values:</strong><br/>
            Private=1, Published=2, Cancelled=3, InProgress=4, Completed=5, SoldOut=6
          </Text>
        </div>
      </Space>
    </Card>
  );
};

export default EventStatusTest;
