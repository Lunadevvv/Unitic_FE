import React from 'react';
import { useCart } from '../hooks/useCart';
import { Button, Card, Typography } from 'antd';

const { Title } = Typography;

const TestCartPage = () => {
  const { cartItems, addToCart, totalItems, totalPrice } = useCart();

  const testItem = {
    id: 'test-1',
    title: 'Test Event',
    price: 100000,
    image: 'https://via.placeholder.com/150',
    date: new Date().toISOString(),
    quantity: 1
  };

  const handleAddTest = () => {
    addToCart(testItem);
  };

  return (
    <div style={{ padding: '20px' }}>
      <Card>
        <Title level={2}>Cart Test Page</Title>
        <p>Total Items: {totalItems}</p>
        <p>Total Price: {totalPrice.toLocaleString('vi-VN')} VNĐ</p>
        
        <Button type="primary" onClick={handleAddTest}>
          Add Test Item
        </Button>
        
        <div style={{ marginTop: '20px' }}>
          <h3>Cart Items:</h3>
          {cartItems.length === 0 ? (
            <p>Cart is empty</p>
          ) : (
            cartItems.map(item => (
              <div key={item.id}>
                {item.title} - {item.quantity} x {item.price.toLocaleString('vi-VN')} VNĐ
              </div>
            ))
          )}
        </div>
      </Card>
    </div>
  );
};

export default TestCartPage;
