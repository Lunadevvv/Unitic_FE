import { Badge, Dropdown, Button, List, Avatar } from 'antd';
import { ShoppingCartOutlined, DeleteOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { useCart } from '../../hooks/useCart';

const CartWidget = () => {
  const { cart, removeFromCart, formatPrice } = useCart();
  
  const cartDropdownContent = (
    <div className="cart-dropdown">
      <h3>Your Cart ({cart.totalItems} items)</h3>
      
      {cart.items.length === 0 ? (
        <div className="empty-cart">
          <p>Your cart is empty</p>
          <Link to="/events">
            <Button type="primary">Browse Events</Button>
          </Link>
        </div>
      ) : (
        <>
          <List
            className="cart-items-list"
            itemLayout="horizontal"
            dataSource={cart.items}
            renderItem={item => (
              <List.Item
                actions={[
                  <Button 
                    type="text" 
                    danger 
                    icon={<DeleteOutlined />} 
                    onClick={() => removeFromCart(item.id)}
                  />
                ]}
              >
                <List.Item.Meta
                  avatar={<Avatar src={item.image} shape="square" size={50} />}
                  title={item.title}
                  description={`${formatPrice(item.price)} × ${item.quantity}`}
                />
              </List.Item>
            )}
          />
          
          <div className="cart-footer">
            <div className="cart-total">
              <span>Total:</span>
              <span className="total-price">{formatPrice(cart.totalPrice)}</span>
            </div>
            
            <Link to="/checkout">
              <Button type="primary" block>
                Proceed to Checkout
              </Button>
            </Link>
          </div>
        </>
      )}
    </div>
  );

  return (
    <Dropdown 
      overlay={cartDropdownContent} 
      trigger={['click']}
      placement="bottomRight"
      overlayClassName="cart-dropdown-container"
    >
      <Badge count={cart.totalItems} showZero>
        <Button 
          type="text" 
          icon={<ShoppingCartOutlined />} 
          className="cart-widget-button"
        />
      </Badge>
    </Dropdown>
  );
};

export default CartWidget;