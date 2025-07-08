import { useState, useEffect, useMemo, useCallback } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import {
  Row, Col, Card, Form, Input, Button, Divider, Steps, Radio,
  Typography, Space, message, Modal, Select, Checkbox, Tag,
  List, Avatar, InputNumber, Breadcrumb, Spin
} from 'antd';
import {
  CreditCardOutlined, WalletOutlined, BankOutlined,
  SafetyOutlined, CheckCircleOutlined, UserOutlined,
  PhoneOutlined, MailOutlined, EnvironmentOutlined,
  CalendarOutlined, ArrowLeftOutlined, HomeOutlined,
  ShoppingCartOutlined, DollarOutlined, TagsOutlined
} from '@ant-design/icons';
import { useEvents } from '../../hooks/useEvents';
import { useCart } from '../../hooks/useCart';
import '../../assets/scss/CheckoutPage.scss';

const { Title, Text } = Typography;
const { Step } = Steps;

const CheckoutPage = () => {
  const { detailid } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [form] = Form.useForm();

  const { getEventById } = useEvents();
  const { cartItems, clearCart, updateCartItem, removeFromCart } = useCart();

  const [event, setEvent] = useState(null);
  const [currentStep] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [loading, setLoading] = useState(false);
  const [orderSummary, setOrderSummary] = useState({
    subtotal: 0,
    serviceFee: 0,
    total: 0
  });

  // Lấy thông tin từ state navigation hoặc cart
  const checkoutData = location.state?.checkoutData || null;

  // Memoize the date formatter to prevent recreating on every render
  const formatDate = useCallback((dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('vi-VN');
  }, []);

  // Memoize order summary calculation to prevent infinite loops
  const calculatedSummary = useMemo(() => {
    let subtotal = 0;
    
    if (checkoutData) {
      // Nếu mua trực tiếp từ trang chi tiết
      subtotal = checkoutData.price * checkoutData.quantity;
    } else {
      // Nếu mua từ giỏ hàng
      subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    }
    
    const serviceFee = subtotal * 0.05; // 5% phí dịch vụ
    const total = subtotal + serviceFee;
    
    return { subtotal, serviceFee, total };
  }, [checkoutData, cartItems]);

  // Separate useEffect for event data loading
  useEffect(() => {
    if (detailid) {
      const eventData = getEventById(detailid);
      setEvent(eventData);
    }
  }, [detailid, getEventById]);
  
  // Separate useEffect for order summary
  useEffect(() => {
    setOrderSummary(calculatedSummary);
  }, [calculatedSummary]);

  // Memoize order number generation
  const generateOrderNumber = useCallback(() => {
    return `ORD${Date.now()}`;
  }, []);

  const handlePayment = async (values) => {
    setLoading(true);
    
    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Clear cart if checkout from cart
      if (!checkoutData) {
        clearCart();
      }
      
      message.success('Thanh toán thành công!');
      navigate('/payment/success', {
        state: {
          orderData: {
            ...values,
            event: event,
            orderSummary: orderSummary,
            paymentMethod: paymentMethod,
            orderNumber: generateOrderNumber(),
            checkoutItems: checkoutData ? [checkoutData] : cartItems
          }
        }
      });
    } catch {
      message.error('Thanh toán thất bại. Vui lòng thử lại!');
      navigate('/payment/failure');
    } finally {
      setLoading(false);
    }
  };

  const renderTicketSelection = () => {
    if (checkoutData) {
      return (
        <Card title="Thông tin vé đã chọn" className="ticket-selection-card">
          <div className="selected-ticket">
            <Avatar src={event?.image} size={64} />
            <div className="ticket-info">
              <Title level={5}>{event?.title}</Title>
              <Text type="secondary">
                <CalendarOutlined /> {formatDate(event?.date)}
              </Text>
              <div className="ticket-details">
                <Text strong>Loại vé: {checkoutData.ticketType}</Text>
                <Text>Số lượng: {checkoutData.quantity}</Text>
                <Text className="ticket-price">
                  {checkoutData.price.toLocaleString('vi-VN')} VNĐ/vé
                </Text>
              </div>
            </div>
          </div>
        </Card>
      );
    }

    return (
      <Card title="Giỏ hàng của bạn" className="cart-items-card">
        <List
          dataSource={cartItems}
          renderItem={(item) => (
            <List.Item
              actions={[
                <InputNumber
                  min={1}
                  max={10}
                  value={item.quantity}
                  onChange={(value) => updateCartItem(item.id, value)}
                />,
                <Button
                  type="text"
                  danger
                  onClick={() => removeFromCart(item.id)}
                >
                  Xóa
                </Button>
              ]}
            >
              <List.Item.Meta
                avatar={<Avatar src={item.image} />}
                title={item.title}
                description={
                  <Space direction="vertical" size="small">
                    <Text type="secondary">
                      <CalendarOutlined /> {formatDate(item.date)}
                    </Text>
                    <Text strong>{item.price.toLocaleString('vi-VN')} VNĐ/vé</Text>
                  </Space>
                }
              />
            </List.Item>
          )}
        />
      </Card>
    );
  };

const renderCustomerInfo = () => (
    <Card title="Thông tin khách hàng" className="customer-info-card">
      <Form
        form={form}
        layout="vertical"
        onFinish={handlePayment}
      >
        <Row gutter={16}>
          <Col xs={24} sm={12}>
            <Form.Item
              name="fullName"
              label="Họ và tên"
              rules={[{ required: true, message: 'Vui lòng nhập họ tên!' }]}
            >
              <Input prefix={<UserOutlined />} placeholder="Nguyễn Văn A" />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12}>
            <Form.Item
              name="email"
              label="Email"
              rules={[
                { required: true, message: 'Vui lòng nhập email!' },
                { type: 'email', message: 'Email không hợp lệ!' }
              ]}
            >
              <Input prefix={<MailOutlined />} placeholder="example@email.com" />
            </Form.Item>
          </Col>
        </Row>
        
        <Row gutter={16}>
          <Col xs={24} sm={12}>
            <Form.Item
              name="phone"
              label="Số điện thoại"
              rules={[{ required: true, message: 'Vui lòng nhập số điện thoại!' }]}
            >
              <Input prefix={<PhoneOutlined />} placeholder="0123456789" />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12}>
            <Form.Item
              name="age"
              label="Tuổi"
              rules={[{ required: true, message: 'Vui lòng nhập tuổi!' }]}
            >
              <InputNumber
                min={1}
                max={100}
                placeholder="25"
                style={{ width: '100%' }}
              />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item
          name="address"
          label="Địa chỉ"
          rules={[{ required: true, message: 'Vui lòng nhập địa chỉ!' }]}
        >
          <Input.TextArea
            prefix={<EnvironmentOutlined />}
            placeholder="123 Đường ABC, Quận XYZ, TP. HCM"
            rows={3}
          />
        </Form.Item>

        <Form.Item name="note" label="Ghi chú (không bắt buộc)">
          <Input.TextArea placeholder="Yêu cầu đặc biệt..." rows={2} />
        </Form.Item>
      </Form>
    </Card>
  );
const renderPaymentMethod = () => (
    <Card title="Phương thức thanh toán" className="payment-method-card">
      <Radio.Group
        value={paymentMethod}
        onChange={(e) => setPaymentMethod(e.target.value)}
        className="payment-methods"
      >
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          <Radio value="card" className="payment-option">
            <div className="payment-option-content">
              <CreditCardOutlined className="payment-icon" />
              <div className="payment-details">
                <Text strong>Thẻ tín dụng/ghi nợ</Text>
                <Text type="secondary">Visa, Mastercard, JCB</Text>
              </div>
            </div>
          </Radio>
          
          <Radio value="banking" className="payment-option">
            <div className="payment-option-content">
              <BankOutlined className="payment-icon" />
              <div className="payment-details">
                <Text strong>Chuyển khoản ngân hàng</Text>
                <Text type="secondary">Vietcombank, Techcombank, BIDV</Text>
              </div>
            </div>
          </Radio>
          
          <Radio value="ewallet" className="payment-option">
            <div className="payment-option-content">
              <WalletOutlined className="payment-icon" />
              <div className="payment-details">
                <Text strong>Ví điện tử</Text>
                <Text type="secondary">MoMo, ZaloPay, VNPay</Text>
              </div>
            </div>
          </Radio>
        </Space>
      </Radio.Group>

      {paymentMethod === 'card' && (
        <div className="card-form">
          <Divider />
          <Row gutter={16}>
            <Col xs={24}>
              <Form.Item
                name="cardNumber"
                label="Số thẻ"
                rules={[{ required: true, message: 'Vui lòng nhập số thẻ!' }]}
              >
                <Input placeholder="1234 5678 9012 3456" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col xs={12}>
              <Form.Item
                name="expiryDate"
                label="Ngày hết hạn"
                rules={[{ required: true, message: 'Vui lòng nhập ngày hết hạn!' }]}
              >
                <Input placeholder="MM/YY" />
              </Form.Item>
            </Col>
            <Col xs={12}>
              <Form.Item
                name="cvv"
                label="CVV"
                rules={[{ required: true, message: 'Vui lòng nhập CVV!' }]}
              >
                <Input placeholder="123" />
              </Form.Item>
            </Col>
          </Row>
        </div>
      )}
    </Card>
  );

  const renderOrderSummary = () => (
    <Card title="Tóm tắt đơn hàng" className="order-summary-card sticky">
      <div className="summary-line">
        <Text>Tạm tính:</Text>
        <Text strong>{orderSummary.subtotal.toLocaleString('vi-VN')} VNĐ</Text>
      </div>
      <div className="summary-line">
        <Text>Phí dịch vụ (5%):</Text>
        <Text>{orderSummary.serviceFee.toLocaleString('vi-VN')} VNĐ</Text>
      </div>
      <Divider />
      <div className="summary-total">
        <Text strong>Tổng cộng:</Text>
        <Text strong className="total-amount">
          {orderSummary.total.toLocaleString('vi-VN')} VNĐ
        </Text>
      </div>
      
      <div className="security-info">
        <SafetyOutlined className="security-icon" />
        <Text type="secondary">Giao dịch được bảo mật SSL</Text>
      </div>

      <Form.Item name="terms" valuePropName="checked">
        <Checkbox>
          Tôi đồng ý với <a href="#" onClick={(e) => e.preventDefault()}>điều khoản dịch vụ</a> và <a href="#" onClick={(e) => e.preventDefault()}>chính sách bảo mật</a>
        </Checkbox>
      </Form.Item>

      <Button
        type="primary"
        size="large"
        block
        loading={loading}
        onClick={() => form.submit()}
        className="checkout-button"
      >
        <DollarOutlined /> Thanh toán {orderSummary.total.toLocaleString('vi-VN')} VNĐ
      </Button>
    </Card>
  );

  if (!event && checkoutData) {
    return (
      <div className="checkout-loading">
        <Spin size="large" />
        <p>Đang tải thông tin sự kiện...</p>
      </div>
    );
  }

  return (
    <div className="checkout-page">
      <div className="checkout-header">
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
                title: (
                  <a onClick={() => navigate('/events')}>Sự kiện</a>
                ),
              },
              {
                title: 'Thanh toán',
              },
            ]}
          />
          
          <div className="checkout-title">
            <Button
              type="text"
              icon={<ArrowLeftOutlined />}
              onClick={() => navigate(-1)}
              className="back-button"
            >
              Quay lại
            </Button>
            <Title level={2}>
              <ShoppingCartOutlined /> Thanh toán
            </Title>
          </div>
        </div>
      </div>

      <div className="checkout-container">
        <Row gutter={[24, 24]}>
          <Col xs={24} lg={16}>
            <div
              style={{
                opacity: 1,
                transform: 'translateX(0)',
                transition: 'all 0.5s ease'
              }}
            >
              <Steps current={currentStep} className="checkout-steps">
                <Step title="Thông tin vé" icon={<TagsOutlined />} />
                <Step title="Thông tin khách hàng" icon={<UserOutlined />} />
                <Step title="Thanh toán" icon={<CreditCardOutlined />} />
              </Steps>

              <div className="checkout-content">
                {renderTicketSelection()}
                {renderCustomerInfo()}
                {renderPaymentMethod()}
              </div>
            </div>
          </Col>

          <Col xs={24} lg={8}>
            <div
              style={{
                opacity: 1,
                transform: 'translateX(0)',
                transition: 'all 0.5s ease 0.2s'
              }}
            >
              {renderOrderSummary()}
            </div>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default CheckoutPage;