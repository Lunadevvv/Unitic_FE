import React, { useState, useEffect } from 'react';
import { 
  Card, Button, Input, Select, Table, Tag, message, 
  Modal, Form, Statistic, Row, Col, Divider, Space 
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
import '../../assets/scss/UserWalletPage.scss';

const { Option } = Select;

const UserWalletPage = () => {
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [topUpModalVisible, setTopUpModalVisible] = useState(false);
  const [form] = Form.useForm();

  // Section animations
  const balanceSection = useSectionAnimation();
  const actionsSection = useSectionAnimation();
  const transactionsSection = useSectionAnimation();

  useEffect(() => {
    // Simulate API call
    const mockTransactions = [
      {
        id: 1,
        type: 'topup',
        amount: 500000,
        description: 'Nạp tiền qua MoMo',
        status: 'completed',
        createdAt: '2024-01-15 10:30:00',
        method: 'momo'
      },
      {
        id: 2,
        type: 'payment',
        amount: -150000,
        description: 'Mua vé Workshop UX/UI Design',
        status: 'completed',
        createdAt: '2024-01-15 14:20:00',
        eventName: 'Workshop UX/UI Design 2024'
      },
      {
        id: 3,
        type: 'topup',
        amount: 200000,
        description: 'Nạp tiền qua ngân hàng',
        status: 'pending',
        createdAt: '2024-01-16 09:15:00',
        method: 'bank'
      },
      {
        id: 4,
        type: 'payment',
        amount: -75000,
        description: 'Mua vé Seminar AI in Education',
        status: 'completed',
        createdAt: '2024-01-17 16:45:00',
        eventName: 'Seminar AI in Education'
      },
      {
        id: 5,
        type: 'topup',
        amount: 1000000,
        description: 'Nạp tiền qua thẻ tín dụng',
        status: 'completed',
        createdAt: '2024-01-18 11:20:00',
        method: 'credit_card'
      }
    ];

    setLoading(true);
    setTimeout(() => {
      setTransactions(mockTransactions);
      setBalance(1275000); // 500000 + 200000 + 1000000 - 150000 - 75000 - pending
      setLoading(false);
    }, 1000);
  }, []);

  const handleTopUp = async (values) => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const newTransaction = {
        id: transactions.length + 1,
        type: 'topup',
        amount: parseInt(values.amount),
        description: `Nạp tiền qua ${getMethodName(values.method)}`,
        status: 'completed',
        createdAt: new Date().toLocaleString('vi-VN'),
        method: values.method
      };

      setTransactions(prev => [newTransaction, ...prev]);
      setBalance(prev => prev + parseInt(values.amount));
      setTopUpModalVisible(false);
      form.resetFields();
      message.success('Nạp tiền thành công!');
    } catch {
      message.error('Có lỗi xảy ra, vui lòng thử lại!');
    } finally {
      setLoading(false);
    }
  };

  const getMethodName = (method) => {
    const methods = {
      'momo': 'MoMo',
      'zalopay': 'ZaloPay',
      'bank': 'Ngân hàng',
      'credit_card': 'Thẻ tín dụng'
    };
    return methods[method] || method;
  };

  const getMethodIcon = (method) => {
    const icons = {
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

  const heroSection = (
    <motion.section 
      className="wallet-hero"
      variants={animationVariants.fadeInVariant}
      initial="hidden"
      animate="visible"
    >
      <div className="hero-content">
        <motion.div
          variants={animationVariants.titleTextVariant}
        >
          <h1>
            <WalletOutlined style={{ marginRight: 12, color: '#1890ff' }} />
            Ví của tôi
          </h1>
        </motion.div>
        <motion.div
          variants={animationVariants.itemVariant}
        >
          <p>
            Quản lý số dư, nạp tiền và theo dõi lịch sử giao dịch của bạn
          </p>
        </motion.div>
      </div>
    </motion.section>
  );

  return (
    <PageAnimationWrapper 
      className="user-wallet-page"
      showFloatingElements={true}
      floatingVariant="wallet"
      heroSection={heroSection}
      headerProps={{
        showAnimation: true,
        transparent: false,
        showCart: true,
        showNotifications: true
      }}
    >
      {/* Balance Section */}
      <motion.div
        ref={balanceSection.ref}
        variants={animationVariants.staggerContainerVariant}
        initial="hidden"
        animate={balanceSection.inView ? "visible" : "hidden"}
      >
        <Row gutter={[24, 24]} style={{ marginBottom: 24 }}>
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
                  title="Tổng nạp trong tháng"
                  value={1700000}
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
                  title="Tổng chi trong tháng"
                  value={225000}
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
              >
                Nạp tiền
              </Button>
            </motion.div>
            <motion.div {...hoverAnimations.buttonHover}>
              <Button 
                size="large" 
                icon={<HistoryOutlined />}
              >
                Lịch sử giao dịch
              </Button>
            </motion.div>
            <motion.div {...hoverAnimations.buttonHover}>
              <Button 
                size="large" 
                icon={<CreditCardOutlined />}
              >
                Quản lý thẻ
              </Button>
            </motion.div>
          </Space>
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
        visible={topUpModalVisible}
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
              { pattern: /^\d+$/, message: 'Số tiền phải là số nguyên!' }
            ]}
          >
            <Input
              size="large"
              placeholder="Nhập số tiền"
              suffix="VNĐ"
              style={{ fontSize: '16px' }}
            />
          </Form.Item>

          <Form.Item
            name="method"
            label="Phương thức thanh toán"
            rules={[{ required: true, message: 'Vui lòng chọn phương thức!' }]}
          >
            <Select size="large" placeholder="Chọn phương thức thanh toán">
              <Option value="momo">
                <Space>
                  <MobileOutlined style={{ color: '#d82d8b' }} />
                  MoMo
                </Space>
              </Option>
              <Option value="zalopay">
                <Space>
                  <MobileOutlined style={{ color: '#0068ff' }} />
                  ZaloPay
                </Space>
              </Option>
              <Option value="bank">
                <Space>
                  <BankOutlined style={{ color: '#52c41a' }} />
                  Chuyển khoản ngân hàng
                </Space>
              </Option>
              <Option value="credit_card">
                <Space>
                  <CreditCardOutlined style={{ color: '#fa8c16' }} />
                  Thẻ tín dụng
                </Space>
              </Option>
            </Select>
          </Form.Item>

          <Divider />

          <Form.Item style={{ marginBottom: 0 }}>
            <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
              <Button onClick={() => setTopUpModalVisible(false)}>
                Hủy
              </Button>
              <motion.div {...hoverAnimations.buttonHover}>
                <Button type="primary" htmlType="submit" loading={loading}>
                  Nạp tiền
                </Button>
              </motion.div>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </PageAnimationWrapper>
  );
};

export default UserWalletPage;
