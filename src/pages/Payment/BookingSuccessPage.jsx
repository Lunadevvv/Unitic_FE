import React from 'react';
import { Button, Result } from 'antd';
import { useNavigate } from 'react-router-dom';

const BookingSuccessPage = () => {
  const navigate = useNavigate();
  return (
    <Result
      status="success"
      title="Đặt vé thành công!"
      subTitle="Bạn đã đặt vé thành công. Vui lòng kiểm tra email hoặc ví để xem chi tiết vé."
      extra={[
        <Button type="primary" key="wallet" onClick={() => navigate('/user/wallet')}>
          Tới ví của tôi
        </Button>,
        <Button key="home" onClick={() => navigate('/')}>Về trang chủ</Button>
      ]}
    />
  );
};

export default BookingSuccessPage;
