import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  applyPromoCode,
  processCheckout,
  processPayment,
  verifyPayment,
  fetchPaymentMethods,
  calculateShipping,
  syncCartWithServer,
  fetchCartFromServer,
} from '../actions/cartActions';

// Async thunks
export const addToCart = createAsyncThunk(
  'cart/addToCart',
  async (item, { rejectWithValue, getState }) => {
    try {
      const { cart } = getState();
      
      // Check if item already exists in cart
      const existingItem = cart.items.find(cartItem => 
        cartItem.eventId === item.eventId && cartItem.ticketType === item.ticketType
      );
      
      if (existingItem) {
        throw new Error('Item already in cart');
      }
      
      // Add item to cart
      const cartItem = {
        id: `${item.eventId}_${item.ticketType}_${Date.now()}`,
        eventId: item.eventId,
        eventName: item.eventName,
        eventImage: item.eventImage,
        ticketType: item.ticketType,
        quantity: item.quantity || 1,
        price: item.price,
        date: item.date,
        location: item.location,
        addedAt: new Date().toISOString(),
      };
      
      return cartItem;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateCartItem = createAsyncThunk(
  'cart/updateCartItem',
  async ({ itemId, updates }, { rejectWithValue }) => {
    try {
      return { itemId, updates };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const removeFromCart = createAsyncThunk(
  'cart/removeFromCart',
  async (itemId, { rejectWithValue }) => {
    try {
      return itemId;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Helper function to calculate totals
const calculateTotals = (items, discount = 0) => {
  const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const discountAmount = subtotal * (discount / 100);
  const total = subtotal - discountAmount;
  
  return {
    subtotal,
    discountAmount,
    total,
  };
};

// Initial state
const initialState = {
  items: JSON.parse(localStorage.getItem('cartItems')) || [],
  totalAmount: 0,
  subtotal: 0,
  discount: 0,
  discountAmount: 0,
  promoCode: null,
  loading: false,
  error: null,
  checkoutStatus: 'idle', // idle, processing, success, failed
  paymentData: null,
  paymentVerified: false,
  paymentMethods: [],
  shippingCost: 0,
  shippingMethods: [],
};

// Calculate initial totals
const initialTotals = calculateTotals(initialState.items);
initialState.subtotal = initialTotals.subtotal;
initialState.totalAmount = initialTotals.total;
initialState.discountAmount = initialTotals.discountAmount;

// Cart slice
const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCart: (state) => {
      state.items = [];
      state.totalAmount = 0;
      state.subtotal = 0;
      state.discount = 0;
      state.discountAmount = 0;
      state.promoCode = null;
      state.checkoutStatus = 'idle';
      localStorage.removeItem('cartItems');
    },
    updateQuantity: (state, action) => {
      const { itemId, quantity } = action.payload;
      const item = state.items.find(item => item.id === itemId);
      
      if (item && quantity > 0) {
        item.quantity = quantity;
        
        // Recalculate totals
        const totals = calculateTotals(state.items, state.discount);
        state.subtotal = totals.subtotal;
        state.totalAmount = totals.total;
        state.discountAmount = totals.discountAmount;
        
        // Update localStorage
        localStorage.setItem('cartItems', JSON.stringify(state.items));
      }
    },
    removePromoCode: (state) => {
      state.promoCode = null;
      state.discount = 0;
      
      // Recalculate totals
      const totals = calculateTotals(state.items, 0);
      state.subtotal = totals.subtotal;
      state.totalAmount = totals.total;
      state.discountAmount = totals.discountAmount;
    },
    resetCheckoutStatus: (state) => {
      state.checkoutStatus = 'idle';
    },
  },
  extraReducers: (builder) => {
    builder
      // Add to cart
      .addCase(addToCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.loading = false;
        state.items.push(action.payload);
        
        // Recalculate totals
        const totals = calculateTotals(state.items, state.discount);
        state.subtotal = totals.subtotal;
        state.totalAmount = totals.total;
        state.discountAmount = totals.discountAmount;
        
        // Update localStorage
        localStorage.setItem('cartItems', JSON.stringify(state.items));
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update cart item
      .addCase(updateCartItem.fulfilled, (state, action) => {
        const { itemId, updates } = action.payload;
        const item = state.items.find(item => item.id === itemId);
        
        if (item) {
          Object.assign(item, updates);
          
          // Recalculate totals
          const totals = calculateTotals(state.items, state.discount);
          state.subtotal = totals.subtotal;
          state.totalAmount = totals.total;
          state.discountAmount = totals.discountAmount;
          
          // Update localStorage
          localStorage.setItem('cartItems', JSON.stringify(state.items));
        }
      })
      // Remove from cart
      .addCase(removeFromCart.fulfilled, (state, action) => {
        state.items = state.items.filter(item => item.id !== action.payload);
        
        // Recalculate totals
        const totals = calculateTotals(state.items, state.discount);
        state.subtotal = totals.subtotal;
        state.totalAmount = totals.total;
        state.discountAmount = totals.discountAmount;
        
        // Update localStorage
        localStorage.setItem('cartItems', JSON.stringify(state.items));
      })
      // Apply promo code
      .addCase(applyPromoCode.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(applyPromoCode.fulfilled, (state, action) => {
        state.loading = false;
        state.promoCode = action.payload.code;
        state.discount = action.payload.discountPercentage;
        
        // Recalculate totals
        const totals = calculateTotals(state.items, state.discount);
        state.subtotal = totals.subtotal;
        state.totalAmount = totals.total;
        state.discountAmount = totals.discountAmount;
      })
      .addCase(applyPromoCode.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Process checkout
      .addCase(processCheckout.pending, (state) => {
        state.loading = true;
        state.checkoutStatus = 'processing';
        state.error = null;
      })
      .addCase(processCheckout.fulfilled, (state) => {
        state.loading = false;
        state.checkoutStatus = 'success';
        state.items = [];
        state.totalAmount = 0;
        state.subtotal = 0;
        state.discount = 0;
        state.discountAmount = 0;
        state.promoCode = null;
        localStorage.removeItem('cartItems');
      })
      .addCase(processCheckout.rejected, (state, action) => {
        state.loading = false;
        state.checkoutStatus = 'failed';
        state.error = action.payload;
      })
      // Process payment
      .addCase(processPayment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(processPayment.fulfilled, (state, action) => {
        state.loading = false;
        state.paymentData = action.payload;
      })
      .addCase(processPayment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Verify payment
      .addCase(verifyPayment.fulfilled, (state, action) => {
        state.paymentVerified = action.payload.verified;
      })
      // Fetch payment methods
      .addCase(fetchPaymentMethods.fulfilled, (state, action) => {
        state.paymentMethods = action.payload;
      })
      // Calculate shipping
      .addCase(calculateShipping.fulfilled, (state, action) => {
        state.shippingCost = action.payload.cost;
        state.shippingMethods = action.payload.methods;
      })
      // Sync cart with server
      .addCase(syncCartWithServer.fulfilled, (state, action) => {
        state.items = action.payload;
        // Recalculate totals
        const totals = calculateTotals(state.items, state.discount);
        state.subtotal = totals.subtotal;
        state.totalAmount = totals.total;
        state.discountAmount = totals.discountAmount;
      })
      // Fetch cart from server
      .addCase(fetchCartFromServer.fulfilled, (state, action) => {
        state.items = action.payload.items || [];
        // Recalculate totals
        const totals = calculateTotals(state.items, state.discount);
        state.subtotal = totals.subtotal;
        state.totalAmount = totals.total;
        state.discountAmount = totals.discountAmount;
      });
  },
});

export const {
  clearError,
  clearCart,
  updateQuantity,
  removePromoCode,
  resetCheckoutStatus,
} = cartSlice.actions;

export default cartSlice.reducer;
