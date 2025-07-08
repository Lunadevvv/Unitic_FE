// Cart API Actions
import { createAsyncThunk } from '@reduxjs/toolkit';

// Apply promo code
export const applyPromoCode = createAsyncThunk(
  'cart/applyPromoCode',
  async (promoCode, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState();
      const response = await fetch('/api/promo-codes/validate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${auth.token}`,
        },
        body: JSON.stringify({ code: promoCode }),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Invalid promo code');
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Process checkout
export const processCheckout = createAsyncThunk(
  'cart/processCheckout',
  async (checkoutData, { rejectWithValue, getState }) => {
    try {
      const { auth, cart } = getState();
      
      const orderData = {
        items: cart.items,
        totalAmount: cart.totalAmount,
        discount: cart.discount,
        promoCode: cart.promoCode,
        paymentMethod: checkoutData.paymentMethod,
        customerInfo: checkoutData.customerInfo,
        billingAddress: checkoutData.billingAddress,
      };
      
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${auth.token}`,
        },
        body: JSON.stringify(orderData),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Checkout failed');
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Process payment
export const processPayment = createAsyncThunk(
  'cart/processPayment',
  async (paymentData, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState();
      
      const response = await fetch('/api/payments/process', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${auth.token}`,
        },
        body: JSON.stringify(paymentData),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Payment failed');
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Verify payment
export const verifyPayment = createAsyncThunk(
  'cart/verifyPayment',
  async (paymentId, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState();
      
      const response = await fetch(`/api/payments/${paymentId}/verify`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${auth.token}`,
        },
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Payment verification failed');
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Get available payment methods
export const fetchPaymentMethods = createAsyncThunk(
  'cart/fetchPaymentMethods',
  async (_, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState();
      
      const response = await fetch('/api/payments/methods', {
        headers: {
          'Authorization': `Bearer ${auth.token}`,
        },
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to fetch payment methods');
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Calculate shipping
export const calculateShipping = createAsyncThunk(
  'cart/calculateShipping',
  async (address, { rejectWithValue, getState }) => {
    try {
      const { cart } = getState();
      
      const response = await fetch('/api/shipping/calculate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items: cart.items,
          address: address,
        }),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to calculate shipping');
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Sync cart with server
export const syncCartWithServer = createAsyncThunk(
  'cart/syncCartWithServer',
  async (_, { rejectWithValue, getState }) => {
    try {
      const { auth, cart } = getState();
      
      if (!auth.isAuthenticated) {
        return cart.items; // Return local cart if not authenticated
      }
      
      const response = await fetch('/api/cart/sync', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${auth.token}`,
        },
        body: JSON.stringify({ items: cart.items }),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to sync cart');
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Fetch cart from server
export const fetchCartFromServer = createAsyncThunk(
  'cart/fetchCartFromServer',
  async (_, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState();
      
      const response = await fetch('/api/cart', {
        headers: {
          'Authorization': `Bearer ${auth.token}`,
        },
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to fetch cart');
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
