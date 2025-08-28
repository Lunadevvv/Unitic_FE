import { createSlice } from '@reduxjs/toolkit';
import {
  buyTicket,
  getAllBookings,
  getBookingsByUserId,
  getCurrentUserBookings
} from '../actions/bookingActions';

const initialState = {
  bookings: [],
  currentUserBookings: [],
  selectedBooking: null,
  loading: {
    buyTicket: false,
    getAllBookings: false,
    getBookingsByUserId: false,
    getCurrentUserBookings: false,
  },
  error: null,
  lastPurchase: null, // Store last successful purchase info
};

const bookingSlice = createSlice({
  name: 'booking',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearLastPurchase: (state) => {
      state.lastPurchase = null;
    },
    setSelectedBooking: (state, action) => {
      state.selectedBooking = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Buy ticket
      .addCase(buyTicket.pending, (state) => {
        state.loading.buyTicket = true;
        state.error = null;
      })
      .addCase(buyTicket.fulfilled, (state, action) => {
        state.loading.buyTicket = false;
        state.lastPurchase = action.payload;
        // Add to current user bookings if it's an array
        if (Array.isArray(state.currentUserBookings)) {
          state.currentUserBookings.unshift(action.payload);
        }
      })
      .addCase(buyTicket.rejected, (state, action) => {
        state.loading.buyTicket = false;
        state.error = action.payload;
      })
      
      // Get all bookings
      .addCase(getAllBookings.pending, (state) => {
        state.loading.getAllBookings = true;
        state.error = null;
      })
      .addCase(getAllBookings.fulfilled, (state, action) => {
        state.loading.getAllBookings = false;
        state.bookings = action.payload;
      })
      .addCase(getAllBookings.rejected, (state, action) => {
        state.loading.getAllBookings = false;
        state.error = action.payload;
      })
      
      // Get bookings by user ID
      .addCase(getBookingsByUserId.pending, (state) => {
        state.loading.getBookingsByUserId = true;
        state.error = null;
      })
      .addCase(getBookingsByUserId.fulfilled, (state, action) => {
        state.loading.getBookingsByUserId = false;
        // This could be for any user, so we store it separately
        state.bookings = action.payload;
      })
      .addCase(getBookingsByUserId.rejected, (state, action) => {
        state.loading.getBookingsByUserId = false;
        state.error = action.payload;
      })
      
      // Get current user bookings
      .addCase(getCurrentUserBookings.pending, (state) => {
        state.loading.getCurrentUserBookings = true;
        state.error = null;
      })
      .addCase(getCurrentUserBookings.fulfilled, (state, action) => {
        state.loading.getCurrentUserBookings = false;
        state.currentUserBookings = action.payload;
      })
      .addCase(getCurrentUserBookings.rejected, (state, action) => {
        state.loading.getCurrentUserBookings = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, clearLastPurchase, setSelectedBooking } = bookingSlice.actions;
export default bookingSlice.reducer;
