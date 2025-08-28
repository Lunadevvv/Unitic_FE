import { useState, useEffect, useRef } from 'react';
import BASE_URL from '../services/api';
import { message } from 'antd';

export const usePaymentStatus = () => {
  const [isPolling, setIsPolling] = useState(false);
  const [paymentResult, setPaymentResult] = useState(null);
  const intervalRef = useRef(null);
  const timeoutRef = useRef(null);

  const startPolling = (paymentId, maxDuration = 300000) => { // 5 phút timeout
    if (isPolling) return;

    setIsPolling(true);
    setPaymentResult(null);
    
    console.log(`Starting to poll payment status for: ${paymentId}`);

    // Polling mỗi 3 giây
    intervalRef.current = setInterval(async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await BASE_URL.get(`/Unitic/Payment/check-status/${paymentId}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.data) {
          const { success, vnPayResponseCode, vnPayTransactionStatus } = response.data;
          
          // Kiểm tra nếu thanh toán đã hoàn tất (thành công hoặc thất bại)
          if (vnPayResponseCode !== null && vnPayTransactionStatus !== null) {
            console.log('Payment completed:', response.data);
            setPaymentResult(response.data);
            stopPolling();
            
            if (success && vnPayResponseCode === '00' && vnPayTransactionStatus === '00') {
              message.success(`Nạp tiền thành công! Số tiền: ${parseInt(response.data.money).toLocaleString('vi-VN')} VNĐ`);
            } else {
              message.error('Thanh toán thất bại hoặc bị hủy');
            }
          }
        }
      } catch (error) {
        console.error('Error checking payment status:', error);
        // Không dừng polling nếu chỉ là lỗi network tạm thời
      }
    }, 3000);

    // Timeout sau maxDuration
    timeoutRef.current = setTimeout(() => {
      console.log('Payment polling timeout');
      stopPolling();
      message.warning('Hết thời gian chờ kiểm tra thanh toán. Vui lòng kiểm tra lại sau.');
    }, maxDuration);
  };

  const stopPolling = () => {
    setIsPolling(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  };

  // Cleanup khi component unmount
  useEffect(() => {
    return () => {
      stopPolling();
    };
  }, []);

  return {
    isPolling,
    paymentResult,
    startPolling,
    stopPolling
  };
};
