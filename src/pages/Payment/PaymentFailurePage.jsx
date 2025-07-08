import { useNavigate, Link } from 'react-router-dom';
import { Result, Button, Card, Typography, Space } from 'antd';
import {
  CloseCircleOutlined, ReloadOutlined, HomeOutlined,
  PhoneOutlined, MailOutlined
} from '@ant-design/icons';

const { Title, Paragraph } = Typography;

const PaymentFailurePage = () => {
  const navigate = useNavigate();

  const handleRetry = () => {
    navigate(-1); // Quay lại trang thanh toán
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
      padding: '20px'
    }}>
      <div style={{ maxWidth: '600px', margin: '0 auto' }}>
        <Result
          status="error"
          title="Thanh toán thất bại!"
          subTitle="Đã xảy ra lỗi trong quá trình xử lý thanh toán. Vui lòng thử lại hoặc liên hệ với chúng tôi để được hỗ trợ."
          extra={[
            <Button 
              type="primary" 
              key="retry"
              icon={<ReloadOutlined />}
              onClick={handleRetry}
              size="large"
            >
              Thử lại thanh toán
            </Button>,
            <Button key="home">
              <Link to="/">
                <HomeOutlined /> Về trang chủ
              </Link>
            </Button>,
          ]}
        />

        <Card 
          style={{ marginTop: '20px' }}
          title="Một số nguyên nhân có thể gây ra lỗi:"
        >
          <ul style={{ paddingLeft: '20px' }}>
            <li>Thông tin thẻ không chính xác</li>
            <li>Số dư tài khoản không đủ</li>
            <li>Thẻ đã hết hạn hoặc bị khóa</li>
            <li>Kết nối mạng không ổn định</li>
            <li>Lỗi hệ thống tạm thời</li>
          </ul>
        </Card>

        <Card 
          style={{ marginTop: '20px', textAlign: 'center' }}
          bodyStyle={{ padding: '40px 20px' }}
        >
          <CloseCircleOutlined 
            style={{ fontSize: '48px', color: '#ff4d4f', marginBottom: '16px' }} 
          />
          <Title level={4}>Cần hỗ trợ?</Title>
          <Paragraph>
            Nếu bạn tiếp tục gặp phải vấn đề này, vui lòng liên hệ với chúng tôi:
          </Paragraph>
          
          <Space direction="vertical" size="middle">
            <div>
              <PhoneOutlined style={{ marginRight: '8px' }} />
              <strong>Hotline: 1900-xxxx</strong>
            </div>
            <div>
              <MailOutlined style={{ marginRight: '8px' }} />
              <strong>Email: support@unitic.com</strong>
            </div>
          </Space>
          
          <Paragraph type="secondary" style={{ marginTop: '20px' }}>
            Thời gian hỗ trợ: 8:00 - 22:00 (Thứ 2 - Chủ nhật)
          </Paragraph>
        </Card>
      </div>
    </div>
  );
};

export default PaymentFailurePage;
