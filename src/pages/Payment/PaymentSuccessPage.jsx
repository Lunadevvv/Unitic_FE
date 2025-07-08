import { useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { Result, Button, Card, Typography, Space, Divider, Row, Col } from 'antd';
import {
  CheckCircleOutlined, DownloadOutlined, PhoneOutlined,
  MailOutlined, CalendarOutlined, EnvironmentOutlined,
  HomeOutlined, UserOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';

const { Title, Text, Paragraph } = Typography;

const PaymentSuccessPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const orderData = location.state?.orderData;

  useEffect(() => {
    if (!orderData) {
      navigate('/', { replace: true });
    }
  }, [orderData, navigate]);

  if (!orderData) {
    return null;
  }

  const handleDownloadTicket = () => {
    console.log('Download ticket for order:', orderData.orderNumber);
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
      padding: '20px'
    }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <Result
          status="success"
          title="Thanh toán thành công!"
          subTitle={`Đơn hàng ${orderData.orderNumber} đã được xử lý thành công. Vé sự kiện đã được gửi đến email của bạn.`}
          extra={[
            <Button 
              type="primary" 
              key="download"
              icon={<DownloadOutlined />}
              onClick={handleDownloadTicket}
              size="large"
            >
              Tải xuống vé
            </Button>,
            <Button key="my-tickets">
              <Link to="/my-tickets">Xem vé của tôi</Link>
            </Button>,
            <Button key="home">
              <Link to="/">
                <HomeOutlined /> Về trang chủ
              </Link>
            </Button>,
          ]}
        />

        <Card 
          title="Chi tiết đơn hàng"
          style={{ marginTop: '20px' }}
          extra={<Text type="secondary">#{orderData.orderNumber}</Text>}
        >
          <Row gutter={[24, 24]}>
            <Col xs={24} md={12}>
              <div>
                <Title level={5}>Thông tin sự kiện</Title>
                <Space direction="vertical" size="small" style={{ width: '100%' }}>
                  <Text strong>{orderData.event?.title}</Text>
                  <Text>
                    <CalendarOutlined /> {dayjs(orderData.event?.date).format('DD/MM/YYYY')} - {orderData.event?.time || '19:00'}
                  </Text>
                  <Text>
                    <EnvironmentOutlined /> {orderData.event?.location}
                  </Text>
                </Space>
              </div>
            </Col>
            
            <Col xs={24} md={12}>
              <div>
                <Title level={5}>Thông tin khách hàng</Title>
                <Space direction="vertical" size="small" style={{ width: '100%' }}>
                  <Text>
                    <UserOutlined /> {orderData.fullName}
                  </Text>
                  <Text>
                    <MailOutlined /> {orderData.email}
                  </Text>
                  <Text>
                    <PhoneOutlined /> {orderData.phone}
                  </Text>
                </Space>
              </div>
            </Col>
          </Row>

          <Divider />

          <div>
            <Title level={5}>Chi tiết thanh toán</Title>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <Text>Tạm tính:</Text>
              <Text>{orderData.orderSummary?.subtotal?.toLocaleString('vi-VN')} VNĐ</Text>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <Text>Phí dịch vụ:</Text>
              <Text>{orderData.orderSummary?.serviceFee?.toLocaleString('vi-VN')} VNĐ</Text>
            </div>
            <Divider />
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <Text strong>Tổng cộng:</Text>
              <Text strong style={{ color: '#1890ff', fontSize: '18px' }}>
                {orderData.orderSummary?.total?.toLocaleString('vi-VN')} VNĐ
              </Text>
            </div>
          </div>

          <Divider />

          <div>
            <Title level={5}>Phương thức thanh toán</Title>
            <Text>
              {orderData.paymentMethod === 'card' && 'Thẻ tín dụng/ghi nợ'}
              {orderData.paymentMethod === 'banking' && 'Chuyển khoản ngân hàng'}
              {orderData.paymentMethod === 'ewallet' && 'Ví điện tử'}
            </Text>
          </div>
        </Card>

        <Card 
          style={{ marginTop: '20px', textAlign: 'center' }}
          bodyStyle={{ padding: '40px 20px' }}
        >
          <CheckCircleOutlined 
            style={{ fontSize: '48px', color: '#52c41a', marginBottom: '16px' }} 
          />
          <Title level={4}>Cảm ơn bạn đã sử dụng dịch vụ!</Title>
          <Paragraph type="secondary">
            Vé sự kiện đã được gửi đến email <strong>{orderData.email}</strong>.
            Vui lòng kiểm tra hộp thư và thư mục spam.
          </Paragraph>
          <Paragraph type="secondary">
            Nếu có bất kỳ thắc mắc nào, vui lòng liên hệ với chúng tôi qua hotline: 
            <strong> 1900-xxxx</strong>
          </Paragraph>
        </Card>
      </div>
    </div>
  );
};

export default PaymentSuccessPage;
