// Contact API Actions
import { createAsyncThunk } from "@reduxjs/toolkit";
import BASE_URL from "../../services/api";

// Send contact message
export const sendContactMessage = createAsyncThunk(
  "contact/sendContactMessage",
  async (messageData, { rejectWithValue }) => {
    try {
      const response = await BASE_URL.post("UniTic/contact", {
        name: messageData.name,
        email: messageData.email,
        subject: messageData.subject,
        message: messageData.message,
        phone: messageData.phone,
      });
      const data = response.data;
      return data;
    } catch (error) {
      let message =
        error.response?.data?.message ||
        error.message ||
        "Failed to send message";
      return rejectWithValue(message);
    }
  }
);

// Subscribe to newsletter
export const subscribeNewsletter = createAsyncThunk(
  "contact/subscribeNewsletter",
  async (email, { rejectWithValue }) => {
    try {
      const response = await BASE_URL.post("UniTic/newsletter/subscribe", {
        email: email,
      });
      const data = response.data;
      return data;
    } catch (error) {
      let message =
        error.response?.data?.message ||
        error.message ||
        "Failed to subscribe";
      return rejectWithValue(message);
    }
  }
);

// Get contact info
export const getContactInfo = createAsyncThunk(
  "contact/getContactInfo",
  async (_, { rejectWithValue }) => {
    try {
      const response = await BASE_URL.get("UniTic/contact/info");
      const data = response.data;
      return data;
    } catch (error) {
      let message =
        error.response?.data?.message ||
        error.message ||
        "Failed to fetch contact info";
      return rejectWithValue(message);
    }
  }
);

// Get FAQ
export const getFAQ = createAsyncThunk(
  "contact/getFAQ",
  async (_, { rejectWithValue }) => {
    try {
      const response = await BASE_URL.get("UniTic/faq");
      const data = response.data;
      return data;
    } catch (error) {
      let message =
        error.response?.data?.message ||
        error.message ||
        "Failed to fetch FAQ";
      return rejectWithValue(message);
    }
  }
);

// Report issue
export const reportIssue = createAsyncThunk(
  "contact/reportIssue",
  async (issueData, { rejectWithValue }) => {
    try {
      const response = await BASE_URL.post("UniTic/support/report", {
        type: issueData.type,
        description: issueData.description,
        priority: issueData.priority,
        userEmail: issueData.userEmail,
        eventId: issueData.eventId,
      });
      const data = response.data;
      return data;
    } catch (error) {
      let message =
        error.response?.data?.message ||
        error.message ||
        "Failed to report issue";
      return rejectWithValue(message);
    }
  }
);
