import React, { useEffect } from 'react';
import { Button, Card, List, Spin, Alert } from 'antd';
import { useAuth } from '../../hooks/useAuth';
import useAccounts from '../../hooks/useAccounts';

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
    <div style={{ padding: '20px' }}>
      <h1>Test API Endpoints</h1>
      
      {/* Universities Section */}
      <Card title="Universities" style={{ marginBottom: '20px' }}>
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

      {/* Accounts Section */}
      <Card title="Accounts" style={{ marginBottom: '20px' }}>
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
    </div>
  );
};

export default TestAPIPage;
