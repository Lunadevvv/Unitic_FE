import React from 'react';
import { Button, Result } from 'antd';
import { useNavigate } from 'react-router-dom';

const PaymentFailPage = () => {
  const navigate = useNavigate();
  return (
    <Result
      status="error"
      title="Thanh toán thất bại"
      subTitle="Đã có lỗi xảy ra trong quá trình thanh toán. Vui lòng thử lại hoặc liên hệ hỗ trợ."
      extra={[
        <Button type="primary" key="wallet" onClick={() => navigate('/user/wallet')}>
          Trở về ví của tôi
        </Button>,
      ]}
    />
  );
};

export default PaymentFailPage;
