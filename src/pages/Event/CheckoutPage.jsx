import { useState, useEffect, useMemo, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import {
  Row, Col, Card, Form, Input, Button, Divider, Steps,
  Typography, message, Checkbox, InputNumber, Spin, Breadcrumb,
  Avatar, List, Space, Modal
} from 'antd';
import {
  WalletOutlined, SafetyOutlined, CheckCircleOutlined, UserOutlined,
  PhoneOutlined, MailOutlined, EnvironmentOutlined,
  ArrowLeftOutlined, ShoppingCartOutlined, TagsOutlined, HomeOutlined,
  CalendarOutlined
} from '@ant-design/icons';
import { useEvents } from '../../hooks/useEvents';
import { useCart } from '../../hooks/useCart';
import { useBooking } from '../../hooks/useBooking';
import { fetchUserProfile } from '../../store/actions/userActions';
import MainLayout from '../../components/layout/MainLayout';
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
  const { purchaseTicket, loading: bookingLoading } = useBooking();
  const { user } = useSelector(state => state.user);
  const dispatch = useDispatch();

  const [event, setEvent] = useState(null);
  const [currentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [orderSummary, setOrderSummary] = useState({
    subtotal: 0,
    serviceFee: 0,
    total: 0
  });

  // Fetch user profile on component mount
  useEffect(() => {
    if (!user) {
      dispatch(fetchUserProfile());
    } else {
      console.log('Current user wallet:', user.wallet); // Debug log
      // Set initial form values from user profile if available
      form.setFieldsValue({
        fullName: user.fullName || user.name,
        email: user.email,
        phone: user.phone || user.phoneNumber,
        address: user.address,
        age: user.age // Assuming user profile might have an age field
      });
    }
  }, [dispatch, user, form]); // Add form to dependency array

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
  }, [detailid, getEventById]); // Now getEventById is memoized so it's safe
  
  // Separate useEffect for order summary
  useEffect(() => {
    setOrderSummary(calculatedSummary);
  }, [calculatedSummary]);

  const handlePayment = async (values) => {
    setLoading(true);
    
    try {
      // Bước 1: Gọi API buy-ticket để tạo booking
      let bookingResult = null;
      
      if (checkoutData) {
        // Mua từ event detail page
        console.log('Creating booking for event:', checkoutData.eventId);
        bookingResult = await purchaseTicket(checkoutData.eventId, checkoutData.quantity);
        
        // Kiểm tra kết quả
        if (bookingResult?.type?.includes('rejected')) {
          throw new Error(bookingResult.payload);
        }
        
        console.log('Booking created successfully:', bookingResult);
      } else {
        // Mua từ cart (có thể có nhiều items)
        // TODO: Implement multiple booking creation for cart items
        throw new Error('Checkout from cart not implemented yet');
      }
      
      // Bước 2: Nếu booking thành công, chuyển đến success page
      message.success('Mua vé thành công!');
      navigate('/payment/success', {
        state: {
          orderData: {
            ...values,
            event: event,
            orderSummary: orderSummary,
            paymentMethod: 'wallet',
            orderNumber: `ORD${bookingResult?.payload?.id || Date.now()}`,
            bookingId: bookingResult?.payload?.id || bookingResult?.payload?.bookingID,
            checkoutItems: checkoutData ? [checkoutData] : cartItems
          }
        }
      });
      
      // Clear cart if checkout from cart
      if (!checkoutData) {
        clearCart();
      }
      
    } catch (error) {
      console.error('Payment/Booking error:', error);
      
      // Xử lý lỗi specific
      let errorMessage = 'Có lỗi xảy ra khi mua vé. Vui lòng thử lại!';
      
      // Kiểm tra lỗi từ nhiều nguồn khác nhau   
      const errorText = error.message || error.toString() || '';
      console.log('Error text for checking:', errorText); // Debug log
      
      const isInsufficientFunds = errorText.includes('Insufficient funds') || 
                                   errorText.includes('insufficient funds') ||
                                   errorText.toLowerCase().includes('insufficient');
      
      if (isInsufficientFunds) {
        const currentBalance = user?.wallet;
        const requiredAmount = orderSummary.total;
        const shortfall = requiredAmount - currentBalance;
        
        // Hiển thị modal chi tiết cho trường hợp số dư không đủ
        Modal.error({
          title: 'Số dư không đủ',
          content: (
            <div style={{ padding: '16px 0' }}>
              <p><strong>Số dư hiện tại:</strong> {currentBalance.toLocaleString('vi-VN')} VNĐ</p>
              <p><strong>Số tiền cần thanh toán:</strong> {requiredAmount.toLocaleString('vi-VN')} VNĐ</p>
              <p style={{ color: '#ff4d4f', fontWeight: 'bold' }}>
                <strong>Cần nạp thêm:</strong> {shortfall.toLocaleString('vi-VN')} VNĐ
              </p>
              <p style={{ marginTop: '16px', fontSize: '14px', color: '#666' }}>
                Vui lòng nạp thêm tiền vào ví để hoàn tất giao dịch này.
              </p>
            </div>
          ),
          okText: 'Đã hiểu',
          width: 400,
        });
        
        errorMessage = `Tiền trong ví không đủ! Cần nạp thêm ${shortfall.toLocaleString('vi-VN')} VNĐ vào ví.`;
      } else if (errorText.includes('Event not found') || errorText.includes('event not found')) {
        errorMessage = 'Sự kiện không tồn tại hoặc đã bị hủy.';
      } else if (errorText.includes('Event is full') || errorText.includes('event is full')) {
        errorMessage = 'Sự kiện đã hết vé. Vui lòng chọn sự kiện khác.';
      } else {
        // Log chi tiết lỗi để debug
        console.error('Unhandled error details:', {
          message: error.message,
          toString: error.toString(),
          fullError: error
        });
      }
      
      message.error(errorMessage);
      
      // Có thể chuyển đến failure page hoặc ở lại checkout
      // navigate('/payment/failure');
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

  const renderPaymentMethod = () => (
    <Card title="Phương thức thanh toán" className="payment-method-card">
      <div className="wallet-payment-section">
        <div className="wallet-option-selected">
          <WalletOutlined className="wallet-icon" />
          <div className="wallet-details">
            <Text strong className="wallet-title">Thanh toán từ ví Unitic</Text>
            <br></br>
            <Text type="secondary" className="wallet-description">
              Sử dụng số dư trong ví của bạn để thanh toán nhanh chóng và an toàn
            </Text>
          </div>
          <CheckCircleOutlined className="check-icon" />
        </div>

        <div className="wallet-balance-info">
          <div className="balance-item">
            <Text type="secondary">Số dư hiện tại:</Text>
            <Text strong className="balance-amount">
              {user?.wallet ? user.wallet.toLocaleString('vi-VN') : '0'} VNĐ
            </Text>
          </div>
          <div className="balance-item">
            <Text type="secondary">Số tiền cần thanh toán:</Text>
            <Text strong className="payment-amount">
              {orderSummary.total.toLocaleString('vi-VN')} VNĐ
            </Text>
          </div>
          <div className="balance-item">
            <Text type="secondary">Hệ thống sẽ tự động kiểm tra số dư khi thanh toán</Text>
          </div>
        </div>
      </div>
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

      <Form form={form} onFinish={handlePayment} layout="vertical">
        <Form.Item
          name="fullName"
          label="Họ và tên"
          rules={[{ required: true, message: 'Vui lòng nhập họ tên!' }]}
          initialValue={user?.fullName || user?.name} // Pre-fill from user state
        >
          <Input prefix={<UserOutlined />} placeholder="Nguyễn Văn A" />
        </Form.Item>
        <Form.Item
          name="phone"
          label="Số điện thoại"
          rules={[{ required: true, message: 'Vui lòng nhập số điện thoại!' }]}
          initialValue={user?.phone || user?.phoneNumber} // Pre-fill from user state
        >
          <Input prefix={<PhoneOutlined />} placeholder="0123456789" />
        </Form.Item>
        <Form.Item name="note" label="Ghi chú (không bắt buộc)">
          <Input.TextArea placeholder="Yêu cầu đặc biệt..." rows={2} />
        </Form.Item>

        <Form.Item
          name="terms"
          valuePropName="checked"
          rules={[
            {
              validator: (_, value) =>
                value ? Promise.resolve() : Promise.reject(new Error('Vui lòng đồng ý với các điều khoản để tiếp tục.')),
            },
          ]}
        >
          <Checkbox>
            Tôi đồng ý với <a href="#" onClick={(e) => e.preventDefault()}>điều khoản dịch vụ</a> và <a href="#" onClick={(e) => e.preventDefault()}>chính sách bảo mật</a>
          </Checkbox>
        </Form.Item>

        <Button
          type="primary"
          size="large"
          block
          htmlType="submit" // Use htmlType="submit" to trigger form submission
          loading={loading || bookingLoading?.buyTicket}
          className="checkout-button wallet-payment-btn"
          disabled={loading || bookingLoading?.buyTicket}
        >
          <WalletOutlined /> 
          {loading || bookingLoading?.buyTicket ? 'Đang xử lý...' : `Thanh toán từ ví ${orderSummary.total.toLocaleString('vi-VN')} VNĐ`}
        </Button>
      </Form>
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
    <MainLayout>
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
                  <Step title="Thanh toán" icon={<WalletOutlined />} />
                </Steps>

                <div className="checkout-content">
                  {renderTicketSelection()}
                  {/* renderCustomerInfo() đã được loại bỏ */}
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
    </MainLayout>
  );
};

export default CheckoutPage;