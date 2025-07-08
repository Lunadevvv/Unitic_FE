import { useState, useEffect, createContext, useContext, useMemo } from 'react';

// Create a context for the cart
const CartContext = createContext();

// Initial cart state
const initialCartState = {
  items: [],
  totalItems: 0,
  totalPrice: 0,
};

// Provider component that will wrap the app
export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    // Load cart from localStorage on initial render
    const savedCart = localStorage.getItem('eventCart');
    return savedCart ? JSON.parse(savedCart) : initialCartState;
  });

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('eventCart', JSON.stringify(cart));
  }, [cart]);

  // Calculate totals when cart items change
  const calculateTotals = (items) => {
    const totalItems = items.reduce((total, item) => total + item.quantity, 0);
    const totalPrice = items.reduce((total, item) => total + (item.price * item.quantity), 0);
    
    return {
      items,
      totalItems,
      totalPrice
    };
  };

  // Add an item to the cart
  const addToCart = (newItem) => {
    setCart(prevCart => {
      // Check if item already exists in cart
      const existingItemIndex = prevCart.items.findIndex(item => item.id === newItem.id);
      
      let updatedItems;
      
      if (existingItemIndex >= 0) {
        // Item exists, update quantity
        updatedItems = [...prevCart.items];
        updatedItems[existingItemIndex] = {
          ...updatedItems[existingItemIndex],
          quantity: updatedItems[existingItemIndex].quantity + (newItem.quantity || 1)
        };
      } else {
        // Item doesn't exist, add it
        updatedItems = [
          ...prevCart.items,
          { ...newItem, quantity: newItem.quantity || 1 }
        ];
      }
      
      return calculateTotals(updatedItems);
    });
  };

  // Remove an item from the cart
  const removeFromCart = (itemId) => {
    setCart(prevCart => {
      const updatedItems = prevCart.items.filter(item => item.id !== itemId);
      return calculateTotals(updatedItems);
    });
  };

  // Update item quantity (alias for backward compatibility)
  const updateQuantity = (itemId, quantity) => {
    updateCartItem(itemId, quantity);
  };

  // Update cart item (new method name)
  const updateCartItem = (itemId, quantity) => {
    if (quantity < 1) return;
    
    setCart(prevCart => {
      const updatedItems = prevCart.items.map(item => 
        item.id === itemId ? { ...item, quantity } : item
      );
      
      return calculateTotals(updatedItems);
    });
  };

  // Clear the entire cart
  const clearCart = () => {
    setCart(initialCartState);
  };

  // Check if an item is in the cart
  const isInCart = (itemId) => {
    return cart.items.some(item => item.id === itemId);
  };

  // Get quantity of a specific item
  const getItemQuantity = (itemId) => {
    const item = cart.items.find(item => item.id === itemId);
    return item ? item.quantity : 0;
  };

  // Format price as currency
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };

  // Memoize the cart context value to prevent unnecessary re-renders
  const cartContext = useMemo(() => ({
    cart,
    cartItems: cart.items,
    totalItems: cart.totalItems,
    totalPrice: cart.totalPrice,
    addToCart,
    removeFromCart,
    updateQuantity,
    updateCartItem,
    clearCart,
    isInCart,
    getItemQuantity,
    formatPrice
  }), [cart]);

  return (
    <CartContext.Provider value={cartContext}>
      {children}
    </CartContext.Provider>
  );
};

// Hook to use the cart context
export const useCart = () => {
  const context = useContext(CartContext);
  
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  
  return context;
};