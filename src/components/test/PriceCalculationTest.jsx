import React, { useState } from 'react';
import { Card, Button, Space, Typography, Divider, Switch } from 'antd';

const { Text, Title } = Typography;

const PriceCalculationTest = () => {
  const [hasTickets, setHasTickets] = useState(false);
  const [ticketTypes, setTicketTypes] = useState([]);

  const addSampleTickets = () => {
    setTicketTypes([
      { name: "Vé thường", price: 100000, quantity: 50 },
      { name: "Vé VIP", price: 200000, quantity: 20 },
      { name: "Vé VVIP", price: 350000, quantity: 10 }
    ]);
    setHasTickets(true);
  };

  const addFreeTickets = () => {
    setTicketTypes([
      { name: "Vé miễn phí", price: 0, quantity: 100 }
    ]);
    setHasTickets(true);
  };

  const clearTickets = () => {
    setTicketTypes([]);
    setHasTickets(false);
  };

  // Logic tính giá giống như trong OrganizationEventForm
  const calculateEventPrice = () => {
    if (!hasTickets || ticketTypes.length === 0) {
      return 0;
    }
    return Math.min(...ticketTypes.map(ticket => ticket.price || 0));
  };

  // Logic hiển thị giá giống như trong EventPreview
  const getDisplayPrice = () => {
    if (!hasTickets || !ticketTypes.length) {
      return 'Miễn phí';
    }
    
    const minPrice = Math.min(...ticketTypes.map(ticket => ticket.price || 0));
    const maxPrice = Math.max(...ticketTypes.map(ticket => ticket.price || 0));
    
    if (minPrice === maxPrice) {
      return minPrice === 0 ? 'Miễn phí' : `${minPrice.toLocaleString('vi-VN')} VNĐ`;
    } else {
      return `${minPrice.toLocaleString('vi-VN')} - ${maxPrice.toLocaleString('vi-VN')} VNĐ`;
    }
  };

  return (
    <Card title="Test Tính Giá Vé" style={{ margin: '16px 0' }}>
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <div>
          <Title level={5}>Điều khiển:</Title>
          <Space wrap>
            <Button onClick={addSampleTickets}>
              Thêm vé có phí
            </Button>
            <Button onClick={addFreeTickets}>
              Thêm vé miễn phí
            </Button>
            <Button onClick={clearTickets} danger>
              Xóa tất cả vé
            </Button>
          </Space>
        </div>

        <div>
          <Text strong>Có bán vé: </Text>
          <Switch 
            checked={hasTickets}
            onChange={setHasTickets}
            checkedChildren="Có"
            unCheckedChildren="Không"
          />
        </div>

        <Divider />

        <div>
          <Title level={5}>Loại vé hiện tại:</Title>
          {ticketTypes.length === 0 ? (
            <Text type="secondary">Chưa có loại vé nào</Text>
          ) : (
            ticketTypes.map((ticket, index) => (
              <div key={index} style={{ marginBottom: 8 }}>
                <Text>
                  {ticket.name}: <Text strong>
                    {ticket.price === 0 ? 'Miễn phí' : `${ticket.price.toLocaleString('vi-VN')} VNĐ`}
                  </Text> (SL: {ticket.quantity})
                </Text>
              </div>
            ))
          )}
        </div>

        <Divider />

        <div>
          <Title level={5}>Kết quả tính toán:</Title>
          <Space direction="vertical">
            <Text>
              <Text strong>Giá để gửi API:</Text> {calculateEventPrice().toLocaleString('vi-VN')} VNĐ
            </Text>
            <Text>
              <Text strong>Giá hiển thị cho user:</Text> {getDisplayPrice()}
            </Text>
          </Space>
        </div>

        <div style={{ backgroundColor: '#f0f0f0', padding: 12, borderRadius: 6 }}>
          <Text type="secondary" style={{ fontSize: '12px' }}>
            <strong>Logic:</strong><br/>
            • Nếu hasTickets = false → giá API = 0, hiển thị "Miễn phí"<br/>
            • Nếu hasTickets = true nhưng không có loại vé → giá API = 0, hiển thị "Miễn phí"<br/>
            • Nếu có loại vé → giá API = giá thấp nhất, hiển thị khoảng giá hoặc giá cố định
          </Text>
        </div>
      </Space>
    </Card>
  );
};

export default PriceCalculationTest;
