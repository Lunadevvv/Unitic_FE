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
import MainLayout from '../../components/layout/MainLayout';

const { Option } = Select;

const UserWalletPage = () => {
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [topUpModalVisible, setTopUpModalVisible] = useState(false);
  const [form] = Form.useForm();

  // Mock data
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
    }
  ];

  useEffect(() => {
    loadWalletData();
  }, []);

  const loadWalletData = async () => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setBalance(350000); // Current balance after transactions
      setTransactions(mockTransactions);
    } catch {
      message.error('Không thể tải thông tin ví!');
    } finally {
      setLoading(false);
    }
  };

  const handleTopUp = async (values) => {
    try {
      const newTransaction = {
        id: Date.now(),
        type: 'topup',
        amount: values.amount,
        description: `Nạp tiền qua ${getMethodName(values.method)}`,
        status: 'pending',
        createdAt: new Date().toLocaleString('vi-VN'),
        method: values.method
      };

      setTransactions(prev => [newTransaction, ...prev]);
      
      // Simulate processing
      setTimeout(() => {
        setTransactions(prev => prev.map(t => 
          t.id === newTransaction.id 
            ? { ...t, status: 'completed' }
            : t
        ));
        setBalance(prev => prev + values.amount);
        message.success('Nạp tiền thành công!');
      }, 3000);

      setTopUpModalVisible(false);
      form.resetFields();
      message.info('Đang xử lý giao dịch...');
    } catch {
      message.error('Không thể thực hiện giao dịch!');
    }
  };

  const getMethodName = (method) => {
    const names = {
      'momo': 'MoMo',
      'zalopay': 'ZaloPay',
      'bank': 'Ngân hàng',
      'vnpay': 'VNPay'
    };
    return names[method] || method;
  };

  const getMethodIcon = (method) => {
    const icons = {
      'momo': <MobileOutlined style={{ color: '#d82d8b' }} />,
      'zalopay': <MobileOutlined style={{ color: '#0068ff' }} />,
      'bank': <BankOutlined style={{ color: '#1890ff' }} />,
      'vnpay': <CreditCardOutlined style={{ color: '#1890ff' }} />
    };
    return icons[method] || <CreditCardOutlined />;
  };

  const getTransactionIcon = (type) => {
    return type === 'topup' 
      ? <ArrowUpOutlined style={{ color: '#52c41a' }} />
      : <ArrowDownOutlined style={{ color: '#f5222d' }} />;
  };

  const getStatusColor = (status) => {
    const colors = {
      'completed': 'green',
      'pending': 'orange',
      'failed': 'red'
    };
    return colors[status] || 'default';
  };

  const getStatusText = (status) => {
    const texts = {
      'completed': 'Thành công',
      'pending': 'Đang xử lý',
      'failed': 'Thất bại'
    };
    return texts[status] || status;
  };

  const columns = [
    {
      title: 'Thời gian',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 150,
    },
    {
      title: 'Loại giao dịch',
      key: 'transactionType',
      render: (_, record) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {getTransactionIcon(record.type)}
          <span>
            {record.type === 'topup' ? 'Nạp tiền' : 'Thanh toán'}
          </span>
        </div>
      ),
    },
    {
      title: 'Mô tả',
      dataIndex: 'description',
      key: 'description',
      render: (text, record) => (
        <div>
          <div>{text}</div>
          {record.eventName && (
            <div style={{ fontSize: '12px', color: '#666' }}>
              {record.eventName}
            </div>
          )}
        </div>
      ),
    },
    {
      title: 'Phương thức',
      key: 'method',
      render: (_, record) => (
        record.method ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            {getMethodIcon(record.method)}
            <span>{getMethodName(record.method)}</span>
          </div>
        ) : '-'
      ),
    },
    {
      title: 'Số tiền',
      dataIndex: 'amount',
      key: 'amount',
      align: 'right',
      render: (amount) => (
        <span style={{ 
          color: amount > 0 ? '#52c41a' : '#f5222d',
          fontWeight: 'bold'
        }}>
          {amount > 0 ? '+' : ''}{amount.toLocaleString('vi-VN')} VNĐ
        </span>
      ),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={getStatusColor(status)}>
          {getStatusText(status)}
        </Tag>
      ),
    },
  ];

  return (
    <MainLayout>
      <div className="user-wallet-page" style={{ padding: '24px' }}>
        <Row gutter={24}>
          <Col span={24}>
            <Card>
              <Row gutter={24} align="middle">
                <Col span={12}>
                  <Statistic
                    title="Số dư ví"
                    value={balance}
                    precision={0}
                    valueStyle={{ color: '#3f8600', fontSize: '28px' }}
                    prefix={<WalletOutlined />}
                    suffix="VNĐ"
                  />
                </Col>
                <Col span={12} style={{ textAlign: 'right' }}>
                  <Space>
                    <Button
                      type="primary"
                      size="large"
                      icon={<PlusOutlined />}
                      onClick={() => setTopUpModalVisible(true)}
                    >
                      Nạp tiền
                    </Button>
                  </Space>
                </Col>
              </Row>
            </Card>
          </Col>
        </Row>

        <Divider />

        <Card 
          title={
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <HistoryOutlined />
              <span>Lịch sử giao dịch</span>
            </div>
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
              showTotal: (total, range) =>
                `${range[0]}-${range[1]} của ${total} giao dịch`,
            }}
          />
        </Card>

        <Modal
          title="Nạp tiền vào ví"
          open={topUpModalVisible}
          onCancel={() => setTopUpModalVisible(false)}
          onOk={() => form.submit()}
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
                { type: 'number', min: 10000, message: 'Số tiền tối thiểu 10,000 VNĐ!' },
                { type: 'number', max: 10000000, message: 'Số tiền tối đa 10,000,000 VNĐ!' }
              ]}
            >
              <Input
                type="number"
                placeholder="Nhập số tiền"
                suffix="VNĐ"
                size="large"
              />
            </Form.Item>

            <Form.Item
              name="method"
              label="Phương thức thanh toán"
              rules={[{ required: true, message: 'Vui lòng chọn phương thức!' }]}
            >
              <Select placeholder="Chọn phương thức thanh toán" size="large">
                <Option value="momo">
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <MobileOutlined style={{ color: '#d82d8b' }} />
                    MoMo
                  </div>
                </Option>
                <Option value="zalopay">
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <MobileOutlined style={{ color: '#0068ff' }} />
                    ZaloPay
                  </div>
                </Option>
                <Option value="bank">
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <BankOutlined style={{ color: '#1890ff' }} />
                    Chuyển khoản ngân hàng
                  </div>
                </Option>
                <Option value="vnpay">
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <CreditCardOutlined style={{ color: '#1890ff' }} />
                    VNPay
                  </div>
                </Option>
              </Select>
            </Form.Item>

            <div style={{ 
              background: '#f6f8fa', 
              padding: '12px', 
              borderRadius: '6px',
              fontSize: '12px',
              color: '#666'
            }}>
              <p style={{ margin: 0 }}>Lưu ý:</p>
              <ul style={{ margin: '4px 0 0 16px' }}>
                <li>Số tiền nạp tối thiểu: 10,000 VNĐ</li>
                <li>Số tiền nạp tối đa: 10,000,000 VNĐ/lần</li>
                <li>Phí giao dịch có thể được tính thêm tùy theo phương thức</li>
              </ul>
            </div>
          </Form>
        </Modal>
      </div>
    </MainLayout>
  );
};

export default UserWalletPage;
