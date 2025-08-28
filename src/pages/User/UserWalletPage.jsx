import React, { useState, useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { 
  Card, Button, Input, Select, Table, Tag, message, 
  Modal, Form, Statistic, Row, Col, Divider, Space, Alert 
} from 'antd';
import { 
  WalletOutlined, PlusOutlined, HistoryOutlined, 
  CreditCardOutlined, BankOutlined, MobileOutlined,
  ArrowUpOutlined, ArrowDownOutlined 
} from '@ant-design/icons';
import { motion } from 'framer-motion';
import PageAnimationWrapper from '../../components/common/PageAnimationWrapper';
import { 
  useSectionAnimation, 
  animationVariants, 
  hoverAnimations 
} from '../../hooks/useAnimations';
import BASE_URL from '../../services/api';
import { usePaymentStatus } from '../../hooks/usePaymentStatus';
import '../../assets/scss/UserWalletPage.scss';

const { Option } = Select;

const UserWalletPage = () => {
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [topUpModalVisible, setTopUpModalVisible] = useState(false);
  const [form] = Form.useForm();
  const { isPolling, paymentResult, startPolling, stopPolling } = usePaymentStatus();
  
  // Get user info from Redux store
  const { user } = useSelector(state => state.auth);

  // Section animations
  const balanceSection = useSectionAnimation();
  const actionsSection = useSectionAnimation();
  const transactionsSection = useSectionAnimation();

  // Function to fetch user payment history
  const fetchPaymentHistory = useCallback(async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const currentUser = user || JSON.parse(localStorage.getItem('user') || '{}');
      const userId = currentUser?.id;

      if (!userId) {
        message.error('Không tìm thấy thông tin người dùng');
        return;
      }

      // Fetch payment history
      const response = await BASE_URL.get(`/Unitic/Payment/allUserPayment/${userId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.data) {
        const payments = response.data;
        // Transform API data to frontend format
        const transformedTransactions = payments.map(payment => ({
          id: payment.paymentId,
          type: 'topup',
          amount: payment.price,
          description: payment.paymentDescription || `Nạp tiền - ${payment.paymentId}`,
          status: getTransactionStatus(payment.status),
          createdAt: new Date(payment.createdDate).toLocaleString('vi-VN'),
          paidDate: payment.paidDate ? new Date(payment.paidDate).toLocaleString('vi-VN') : null,
          method: 'vnpay',
          paymentId: payment.paymentId,
          originalPayment: payment
        }));
        setTransactions(transformedTransactions);
      }
    } catch (error) {
      console.error('Error fetching payment history:', error);
      message.error('Không thể tải lịch sử giao dịch');
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Function to fetch current balance from /api/Profile
  const fetchCurrentBalance = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await BASE_URL.get('/api/Profile', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.data && typeof response.data.wallet !== 'undefined') {
        setBalance(response.data.wallet);
      }
    } catch (error) {
      console.error('Error fetching current balance:', error);
    }
  }, []);

  // Helper function to map API status to frontend status
  const getTransactionStatus = (apiStatus) => {
    switch (apiStatus?.toLowerCase()) {
      case 'completed':
      case 'success':
      case 'paid': 
        return 'completed';
      case 'pending':
      case 'processing':
        return 'pending';
      case 'failed':
      case 'cancelled':
        return 'failed';
      default:
        return 'pending';
    }
  };

  // Calculate monthly statistics
  const calculateMonthlyStats = () => {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    
    const monthlyTransactions = transactions.filter(transaction => {
      const transactionDate = new Date(transaction.createdAt);
      return transactionDate.getMonth() === currentMonth && 
             transactionDate.getFullYear() === currentYear;
    });

    const monthlyTopUp = monthlyTransactions
      .filter(t => t.type === 'topup' && t.status === 'completed')
      .reduce((sum, t) => sum + t.amount, 0);

    const monthlySpent = monthlyTransactions
      .filter(t => t.type === 'payment' && t.status === 'completed')
      .reduce((sum, t) => sum + Math.abs(t.amount), 0);

    return { monthlyTopUp, monthlySpent };
  };

  const { monthlyTopUp, monthlySpent } = calculateMonthlyStats();

  // Calculate total top-up (all completed top-up transactions)
  const totalTopUp = transactions
    .filter(t => t.type === 'topup' && t.status === 'completed')
    .reduce((sum, t) => sum + t.amount, 0);

  // Calculate total spent (totalTopUp - current balance)
  const totalSpent = totalTopUp - balance;

  useEffect(() => {
    // Load payment history and current balance when component mounts
    fetchPaymentHistory();
    fetchCurrentBalance();
  }, [fetchPaymentHistory]);

  // Reload payment history when payment result is received
  useEffect(() => {
    if (paymentResult && paymentResult.success) {
      // Reload payment history and current balance to show new transaction
      setTimeout(() => {
        fetchPaymentHistory();
        fetchCurrentBalance();
      }, 1000); // Wait 1 second to ensure backend has processed the payment
    }
  }, [paymentResult, fetchPaymentHistory]);

  const handleTopUp = async (values) => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const { amount } = values;
      
      // Gọi API VNPay để tạo link thanh toán
      const response = await BASE_URL.get(`/Unitic/Payment/vnpay-request`, {
        params: {
          money: amount,
          description: 'naptien'
        },
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.data) {
        // Extract payment ID từ URL VNPay
        const urlParams = new URLSearchParams(response.data.split('?')[1]);
        const paymentId = urlParams.get('vnp_TxnRef');
        
        // Mở link VNPay trong tab mới
        window.open(response.data, '_blank');
        
        // Bắt đầu polling để kiểm tra trạng thái thanh toán
        if (paymentId) {
          startPolling(paymentId);
          message.info('Đang chuyển đến trang thanh toán VNPay. Hệ thống sẽ tự động cập nhật khi thanh toán hoàn tất.');
        }
        
        setTopUpModalVisible(false);
        form.resetFields();
      }
    } catch (error) {
      console.error('Error calling VNPay API:', error);
      message.error('Không thể tạo link thanh toán. Vui lòng thử lại!');
    } finally {
      setLoading(false);
    }
  };

  const getMethodIcon = (method) => {
    const icons = {
      'vnpay': <CreditCardOutlined style={{ color: '#1890ff' }} />,
      'momo': <MobileOutlined style={{ color: '#d82d8b' }} />,
      'zalopay': <MobileOutlined style={{ color: '#0068ff' }} />,
      'bank': <BankOutlined style={{ color: '#52c41a' }} />,
      'credit_card': <CreditCardOutlined style={{ color: '#fa8c16' }} />
    };
    return icons[method] || <WalletOutlined />;
  };

  const getStatusTag = (status) => {
    const statusConfig = {
      'completed': { color: 'success', text: 'Hoàn thành' },
      'pending': { color: 'processing', text: 'Đang xử lý' },
      'failed': { color: 'error', text: 'Thất bại' }
    };
    const config = statusConfig[status] || { color: 'default', text: status };
    return <Tag color={config.color}>{config.text}</Tag>;
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  const columns = [
    {
      title: 'Loại giao dịch',
      key: 'type',
      render: (_, record) => (
        <Space>
          {record.type === 'topup' ? (
            <ArrowUpOutlined style={{ color: '#52c41a' }} />
          ) : (
            <ArrowDownOutlined style={{ color: '#ff4d4f' }} />
          )}
          {record.method && getMethodIcon(record.method)}
          <span>{record.type === 'topup' ? 'Nạp tiền' : 'Thanh toán'}</span>
        </Space>
      )
    },
    {
      title: 'Mô tả',
      dataIndex: 'description',
      key: 'description'
    },
    {
      title: 'Số tiền',
      key: 'amount',
      render: (_, record) => (
        <span style={{ 
          color: record.amount > 0 ? '#52c41a' : '#ff4d4f',
          fontWeight: 'bold'
        }}>
          {record.amount > 0 ? '+' : ''}{formatCurrency(record.amount)}
        </span>
      )
    },
    {
      title: 'Trạng thái',
      key: 'status',
      render: (_, record) => getStatusTag(record.status)
    },
    {
      title: 'Thời gian',
      dataIndex: 'createdAt',
      key: 'createdAt'
    }
  ];

  return (
    <PageAnimationWrapper>
      <div className="wallet-page">
        {/* Header */}
        <div className="page-header" style={{ marginBottom: 24 }}>
          <h1>
            <WalletOutlined style={{ marginRight: 8 }} />
            Quản lý ví
          </h1>
          <p>Quản lý số dư, nạp tiền và theo dõi lịch sử giao dịch của bạn</p>
        </div>

        {/* Balance Cards */}
        <motion.div
          ref={balanceSection.ref}
          variants={animationVariants.staggerContainer}
          initial="hidden"
          animate={balanceSection.inView ? "visible" : "hidden"}
        >
          <Row gutter={16} style={{ marginBottom: 24 }}>
            <Col xs={24} sm={12} lg={8}>
              <motion.div
                variants={animationVariants.itemVariant}
                {...hoverAnimations.cardHover}
              >
                <Card>
                  <Statistic
                    title="Số dư hiện tại"
                    value={balance}
                    formatter={(value) => formatCurrency(value)}
                    prefix={<WalletOutlined />}
                    valueStyle={{ color: '#1890ff', fontSize: '2rem' }}
                  />
                </Card>
              </motion.div>
            </Col>

            <Col xs={24} sm={12} lg={8}>
              <motion.div
                variants={animationVariants.itemVariant}
                {...hoverAnimations.cardHover}
              >
                <Card>
                  <Statistic
                    title="Tổng nạp thành công"
                    value={totalTopUp}
                    formatter={(value) => formatCurrency(value)}
                    prefix={<ArrowUpOutlined />}
                    valueStyle={{ color: '#52c41a' }}
                  />
                </Card>
              </motion.div>
            </Col>

            <Col xs={24} sm={12} lg={8}>
              <motion.div
                variants={animationVariants.itemVariant}
                {...hoverAnimations.cardHover}
              >
                <Card>
                  <Statistic
                    title="Tổng chi"
                    value={totalSpent}
                    formatter={(value) => formatCurrency(value)}
                    prefix={<ArrowDownOutlined />}
                    valueStyle={{ color: '#ff4d4f' }}
                  />
                </Card>
              </motion.div>
            </Col>
          </Row>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          ref={actionsSection.ref}
          variants={animationVariants.slideInLeftVariant}
          initial="hidden"
          animate={actionsSection.inView ? "visible" : "hidden"}
        >
          <Card title="Thao tác nhanh" style={{ marginBottom: 24 }}>
            <Space size="large" wrap>
              <motion.div {...hoverAnimations.buttonHover}>
                <Button 
                  type="primary" 
                  size="large" 
                  icon={<PlusOutlined />}
                  onClick={() => setTopUpModalVisible(true)}
                  disabled={isPolling}
                >
                  {isPolling ? 'Đang kiểm tra thanh toán...' : 'Nạp tiền'}
                </Button>
              </motion.div>
              <motion.div {...hoverAnimations.buttonHover}>
                <Button 
                  size="large" 
                  icon={<HistoryOutlined />}
                  onClick={() => fetchPaymentHistory()}
                  loading={loading}
                >
                  Làm mới lịch sử
                </Button>
              </motion.div>
            </Space>
            
            {isPolling && (
              <div style={{ marginTop: 16, fontSize: '14px', color: '#1890ff' }}>
                <span>🔄 Đang chờ xác nhận thanh toán từ VNPay...</span>
                <Button 
                  type="link" 
                  size="small" 
                  onClick={stopPolling}
                  style={{ padding: 0, marginLeft: 8 }}
                >
                  Hủy
                </Button>
              </div>
            )}
          </Card>
        </motion.div>

        {/* Transaction History */}
        <motion.div
          ref={transactionsSection.ref}
          variants={animationVariants.slideInRightVariant}
          initial="hidden"
          animate={transactionsSection.inView ? "visible" : "hidden"}
        >
          <Card
            title={
              <span>
                <HistoryOutlined style={{ marginRight: 8 }} />
                Lịch sử giao dịch
              </span>
            }
          >
            <Table
              columns={columns}
              dataSource={transactions}
              rowKey="id"
              loading={loading}
              pagination={{
                pageSize: 10,
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total) => `Tổng ${total} giao dịch`
              }}
            />
          </Card>
        </motion.div>

        {/* Top Up Modal */}
        <Modal
          title={
            <span>
              <PlusOutlined style={{ marginRight: 8 }} />
              Nạp tiền vào ví
            </span>
          }
          open={topUpModalVisible}
          onCancel={() => setTopUpModalVisible(false)}
          footer={null}
          width={500}
        >
          <Form
            form={form}
            layout="vertical"
            onFinish={handleTopUp}
          >
            <Form.Item
              name="amount"
              label="Số tiền nạp"
              rules={[
                { required: true, message: 'Vui lòng nhập số tiền!' },
                { pattern: /^\d+$/, message: 'Số tiền phải là số nguyên!' },
                { 
                  validator: (_, value) => {
                    if (!value || parseInt(value) >= 10000) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error('Số tiền tối thiểu 10.000 VNĐ!'));
                  }
                }
              ]}
            >
              <Input
                size="large"
                placeholder="Nhập số tiền (tối thiểu 10.000 VNĐ)"
                suffix="VNĐ"
                style={{ fontSize: '16px' }}
              />
            </Form.Item>

            <Form.Item
              name="method"
              label="Phương thức thanh toán"
              initialValue="vnpay"
            >
              <Select size="large" disabled>
                <Option value="vnpay">
                  <Space>
                    <CreditCardOutlined style={{ color: '#1890ff' }} />
                    VNPay
                  </Space>
                </Option>
              </Select>
            </Form.Item>

            <Alert
              message="Thông tin thanh toán"
              description="Bạn sẽ được chuyển đến trang thanh toán VNPay để hoàn tất giao dịch."
              type="info"
              showIcon
              style={{ marginBottom: 16 }}
            />

            <Divider />

            <Form.Item style={{ marginBottom: 0 }}>
              <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
                <Button onClick={() => setTopUpModalVisible(false)}>
                  Hủy
                </Button>
                <motion.div {...hoverAnimations.buttonHover}>
                  <Button type="primary" htmlType="submit" loading={loading}>
                    Thanh toán qua VNPay
                  </Button>
                </motion.div>
              </Space>
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </PageAnimationWrapper>
  );
};

export default UserWalletPage;
