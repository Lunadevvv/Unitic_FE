import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Steps, Card, Button, message, Breadcrumb } from 'antd';
import { HomeOutlined, PlusOutlined, EyeOutlined, CheckOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import MainLayout from '../../components/layout/MainLayout';
import OrganizationEventForm from '../../components/organization/OrganizationEventForm';
import EventPreview from '../../components/organization/EventPreview';
import { createEvent } from '../../store/actions/eventsActions';
import '../../assets/scss/OrganizationRegisterEventPage.scss';

const { Step } = Steps;

const OrganizationRegisterEventPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [currentStep, setCurrentStep] = useState(0);
  const [eventData, setEventData] = useState({});
  const [loading, setLoading] = useState(false);

  const steps = [
    {
      title: 'Thông tin sự kiện',
      icon: <PlusOutlined />,
      description: 'Nhập thông tin cơ bản'
    },
    {
      title: 'Xem trước',
      icon: <EyeOutlined />,
      description: 'Kiểm tra thông tin'
    },
    {
      title: 'Hoàn thành',
      icon: <CheckOutlined />,
      description: 'Gửi đăng ký'
    }
  ];

  const handleFormSubmit = (formData) => {
    setEventData(formData);
    setCurrentStep(1);
  };

  const handlePreviewConfirm = async () => {
    setLoading(true);
    try {
      await dispatch(createEvent(eventData));
      
      message.success('Đăng ký sự kiện thành công! Chờ admin duyệt.');
      setCurrentStep(2);
      
      setTimeout(() => {
        navigate('/organization/events');
      }, 2000);
    } catch (error) {
      message.error('Có lỗi xảy ra. Vui lòng thử lại!');
      console.error('Error creating event:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditEvent = () => {
    setCurrentStep(0);
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <OrganizationEventForm 
            initialData={eventData}
            onSubmit={handleFormSubmit}
          />
        );
      case 1:
        return (
          <EventPreview 
            eventData={eventData}
            onConfirm={handlePreviewConfirm}
            onEdit={handleEditEvent}
            loading={loading}
          />
        );
      case 2:
        return (
          <div className="success-container">
            <Card className="success-card">
              <div className="success-content">
                <CheckOutlined className="success-icon" />
                <h2>Đăng ký thành công!</h2>
                <p>Sự kiện của bạn đã được gửi và đang chờ admin duyệt.</p>
                <p>Bạn sẽ nhận được thông báo qua email khi sự kiện được duyệt.</p>
                <Button 
                  type="primary" 
                  size="large"
                  onClick={() => navigate('/organization/events')}
                >
                  Xem danh sách sự kiện
                </Button>
              </div>
            </Card>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <MainLayout 
      className="organization-register-page"
      contentClassName="page-content"
    >
      <div className="page-header">
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
                    <a onClick={() => navigate('/organization/events')}>
                      Quản lý sự kiện
                    </a>
                  ),
                },
                {
                  title: 'Đăng ký sự kiện mới',
                },
              ]}
            />
            
            <div className="page-title">
              <h1>Đăng ký tổ chức sự kiện</h1>
              <p>Tạo meeting/seminar mới cho tổ chức của bạn</p>
            </div>
          </div>
      </div>

      <div className="container">
        <Card className="steps-card">
          <Steps 
            current={currentStep} 
            className="registration-steps"
            type="navigation"
          >
            {steps.map((step, index) => (
              <Step
                key={index}
                title={step.title}
                description={step.description}
                icon={step.icon}
              />
            ))}
          </Steps>
        </Card>

        <div className="step-content">
          {renderStepContent()}
        </div>
      </div>
    </MainLayout>
  );
};

export default OrganizationRegisterEventPage;
