import { createAsyncThunk } from "@reduxjs/toolkit";
import BASE_URL from "../../services/api";

// Buy ticket
export const buyTicket = createAsyncThunk(
  "booking/buyTicket",
  async ({ eventID, quantity }, { rejectWithValue }) => {
    try {
      const response = await BASE_URL.post("api/Booking/buy-ticket", {
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
      const response = await BASE_URL.get("api/Booking");
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
      const response = await BASE_URL.get(`api/Booking/All/${userId}`);
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
      const { auth } = getState();
      const userId = auth.user?.id;
      
      if (!userId) {
        return rejectWithValue("User not authenticated");
      }

      const response = await BASE_URL.get(`api/Booking/All/${userId}`);
      return response.data;
    } catch (error) {
      let message =
        error.response?.data?.message ||
        error.message ||
        "Failed to fetch current user bookings";
      return rejectWithValue(message);
    }
  }
);
