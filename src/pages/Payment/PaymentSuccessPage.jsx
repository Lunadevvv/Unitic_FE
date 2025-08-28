
import React from 'react';
import { Button, Result } from 'antd';
import { useNavigate } from 'react-router-dom';

const PaymentSuccessPage = () => {
  const navigate = useNavigate();
  return (
    <Result
      status="success"
      title="Thanh toán thành công!"
      subTitle="Giao dịch của bạn đã được xử lý thành công."
      extra={[
        <Button type="primary" key="wallet" onClick={() => navigate('/user/wallet')}>
          Tới ví của tôi
        </Button>,
      ]}
    />
  );
};

export default PaymentSuccessPage;
