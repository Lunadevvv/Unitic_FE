import { createAsyncThunk } from "@reduxjs/toolkit";
import BASE_URL from "../../services/api";

// Buy ticket
export const buyTicket = createAsyncThunk(
  "booking/buyTicket",
  async ({ eventID, quantity }, { rejectWithValue }) => {
    try {
      const response = await BASE_URL.post("/api/Booking/buy-ticket", {
        eventID,
        quantity
      });
      return response.data;
    } catch (error) {
      let message =
        error.response?.data?.message ||
        error.message ||
        "Failed to buy ticket";
      return rejectWithValue(message);
    }
  }
);

// Get all bookings
export const getAllBookings = createAsyncThunk(
  "booking/getAllBookings",
  async (_, { rejectWithValue }) => {
    try {
      const response = await BASE_URL.get("/api/Booking");
      return response.data;
    } catch (error) {
      let message =
        error.response?.data?.message ||
        error.message ||
        "Failed to fetch bookings";
      return rejectWithValue(message);
    }
  }
);

// Get bookings by user ID
export const getBookingsByUserId = createAsyncThunk(
  "booking/getBookingsByUserId",
  async (userId, { rejectWithValue }) => {
    try {
      const response = await BASE_URL.get(`/api/Booking/All/${userId}`);
      return response.data;
    } catch (error) {
      let message =
        error.response?.data?.message ||
        error.message ||
        "Failed to fetch user bookings";
      return rejectWithValue(message);
    }
  }
);

// Get current user's bookings
export const getCurrentUserBookings = createAsyncThunk(
  "booking/getCurrentUserBookings",
  async (_, { rejectWithValue, getState }) => {
    try {
      const state = getState();
      
      // Try multiple state paths to find user ID
      let userId = null;
      
      // Check auth state first
      if (state.auth?.user?.id) {
        userId = state.auth.user.id;
      }
      // Check user state as fallback
      else if (state.user?.user?.id) {
        userId = state.user.user.id;
      }
      // Check localStorage as last resort
      else {
        const tokenUser = localStorage.getItem('user');
        if (tokenUser) {
          const parsedUser = JSON.parse(tokenUser);
          userId = parsedUser?.id;
        }
      }
      
      console.log('Auth state:', state.auth); // Debug log
      console.log('User state:', state.user); // Debug log
      console.log('Getting bookings for user ID:', userId); // Debug log
      
      if (!userId) {
        return rejectWithValue("User not authenticated - no user ID found");
      }

      const response = await BASE_URL.get(`/api/Booking/All/${userId}`);
      console.log('User bookings response:', response.data); // Debug log
      return response.data;
    } catch (error) {
      console.error('Error fetching user bookings:', error); // Debug log
      let message =
        error.response?.data?.message ||
        error.message ||
        "Failed to fetch current user bookings";
      return rejectWithValue(message);
    }
  }
);
