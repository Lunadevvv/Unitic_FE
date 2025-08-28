import React, { useEffect } from 'react';
import { Button, Card, List, Spin, Alert, Row, Col, Typography } from 'antd';
import { useAuth } from '../hooks/useAuth';
import useAccounts from '../hooks/useAccounts';
import MainLayout from '../components/layout/MainLayout';
import EventCreateForm from '../components/event/EventCreateForm';
import ProfileUpdateForm from '../components/profile/ProfileUpdateForm';
import DateFormatTest from '../components/test/DateFormatTest';
import EventStatusTest from '../components/test/EventStatusTest';

const { Title, Text } = Typography;

const TestAPIPage = () => {
  const { 
    universities, 
    universitiesLoading, 
    loadUniversities 
  } = useAuth();

  const {
    accounts,
    accountsLoading,
    accountsError,
    loadAccounts
  } = useAccounts();

  useEffect(() => {
    loadUniversities();
  }, [loadUniversities]);

  const handleLoadAccounts = () => {
    loadAccounts();
  };

  return (
    <MainLayout 
      className="test-api-page"
      headerProps={{
        showAnimation: true,
        transparent: false,
        showCart: true,
        showNotifications: true
      }}
    >
      <div style={{ padding: '24px' }}>
        <Title level={1}>Test API Page</Title>
        <Text type="secondary">
          Trang này được tạo để test các API mới được thêm vào.
        </Text>
        
        <Row gutter={[24, 24]} style={{ marginTop: 24 }}>
          <Col xs={24} lg={12}>
            <DateFormatTest />
          </Col>
          <Col xs={24} lg={12}>
            <EventStatusTest />
          </Col>
        </Row>
        
        <Row gutter={[24, 24]} style={{ marginTop: 24 }}>
          <Col xs={24} lg={12}>
            <EventCreateForm />
          </Col>
          <Col xs={24} lg={12}>
            <ProfileUpdateForm />
          </Col>
        </Row>

        <Row gutter={[24, 24]} style={{ marginTop: 24 }}>
          <Col xs={24} lg={12}>
            {/* Universities Section */}
            <Card title="Universities">
              {universitiesLoading ? (
                <Spin />
              ) : (
                <List
                  dataSource={universities}
                  renderItem={(university) => (
                    <List.Item>
                      <strong>{university.name}</strong> (ID: {university.id})
                    </List.Item>
                  )}
                />
              )}
            </Card>
          </Col>
          
          <Col xs={24} lg={12}>
            {/* Accounts Section */}
            <Card title="Accounts">
              <Button 
                onClick={handleLoadAccounts} 
                loading={accountsLoading}
                style={{ marginBottom: '16px' }}
              >
                Load Accounts
              </Button>
        
              {accountsError && (
                <Alert 
                  message="Error" 
                  description={accountsError} 
                  type="error" 
                  style={{ marginBottom: '16px' }}
                />
              )}
        
              {accountsLoading ? (
                <Spin />
              ) : (
                <List
                  dataSource={accounts}
                  renderItem={(account) => (
                    <List.Item>
                      <div>
                        <strong>{account.firstName} {account.lastName}</strong><br/>
                        Email: {account.email}<br/>
                        University: {account.university?.name}<br/>
                        Role: {account.role}<br/>
                        MSSV: {account.mssv || 'N/A'}
                      </div>
                    </List.Item>
                  )}
                />
              )}
            </Card>
          </Col>
        </Row>
      </div>
    </MainLayout>
  );
};

export default TestAPIPage;
