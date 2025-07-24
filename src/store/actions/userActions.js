// User API Actions
import { createAsyncThunk } from "@reduxjs/toolkit";
import BASE_URL from "../../services/api";

// Fetch user profile
export const fetchUserProfile = createAsyncThunk(
  "user/fetchUserProfile",
  async (_, { rejectWithValue }) => {
    try {
      const response = await BASE_URL.get("api/profile");
      const data = response.data;
      return data;
    } catch (error) {
      let message =
        error.response?.data?.message ||
        error.message ||
        "Failed to fetch profile";
      return rejectWithValue(message);
    }
  }
);

// Update user profile
export const updateUserProfile = createAsyncThunk(
  "user/updateUserProfile",
  async (profileData, { rejectWithValue }) => {
    try {
      const response = await BASE_URL.put("api/Profile", {
        firstName: profileData.firstName,
        lastName: profileData.lastName,
        mssv: profileData.mssv,
        universityId: profileData.universityId,
      });
      const data = response.data;
      return data;
    } catch (error) {
      let message =
        error.response?.data?.message ||
        error.message ||
        "Failed to update profile";
      return rejectWithValue(message);
    }
  }
);

// Upload avatar (not used)
export const uploadAvatar = createAsyncThunk(
  "user/uploadAvatar",
  async (file, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState();
      const formData = new FormData();
      formData.append("avatar", file);

      const response = await fetch("/api/user/avatar", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${auth.token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to upload avatar");
      }

      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Fetch user tickets (not used)
export const fetchUserTickets = createAsyncThunk(
  "user/fetchUserTickets",
  async (params = {}, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState();
      const queryParams = new URLSearchParams(params).toString();
      const response = await fetch(`/api/user/tickets?${queryParams}`, {
        headers: {
          Authorization: `Bearer ${auth.token}`,
        },
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to fetch tickets");
      }

      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Fetch user events (not used)
export const fetchUserEvents = createAsyncThunk(
  "user/fetchUserEvents",
  async (params = {}, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState();
      const queryParams = new URLSearchParams(params).toString();
      const response = await fetch(`/api/user/events?${queryParams}`, {
        headers: {
          Authorization: `Bearer ${auth.token}`,
        },
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to fetch user events");
      }

      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Fetch wallet data (not used)
export const fetchWalletData = createAsyncThunk(
  "user/fetchWalletData",
  async (_, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState();
      const response = await fetch("/api/user/wallet", {
        headers: {
          Authorization: `Bearer ${auth.token}`,
        },
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to fetch wallet data");
      }

      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Top up wallet (not used)
export const topUpWallet = createAsyncThunk(
  "user/topUpWallet",
  async (topUpData, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState();
      const response = await fetch("/api/user/wallet/topup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${auth.token}`,
        },
        body: JSON.stringify(topUpData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Top-up failed");
      }

      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Withdraw from wallet (not used)
export const withdrawFromWallet = createAsyncThunk(
  "user/withdrawFromWallet",
  async (withdrawData, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState();
      const response = await fetch("/api/user/wallet/withdraw", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${auth.token}`,
        },
        body: JSON.stringify(withdrawData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Withdrawal failed");
      }

      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Fetch wallet transactions (not used)
export const fetchWalletTransactions = createAsyncThunk(
  "user/fetchWalletTransactions",
  async (params = {}, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState();
      const queryParams = new URLSearchParams(params).toString();
      const response = await fetch(
        `/api/user/wallet/transactions?${queryParams}`,
        {
          headers: {
            Authorization: `Bearer ${auth.token}`,
          },
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to fetch transactions");
      }

      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Fetch notifications (not used)
export const fetchNotifications = createAsyncThunk(
  "user/fetchNotifications",
  async (params = {}, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState();
      const queryParams = new URLSearchParams(params).toString();
      const response = await fetch(`/api/user/notifications?${queryParams}`, {
        headers: {
          Authorization: `Bearer ${auth.token}`,
        },
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to fetch notifications");
      }

      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Mark notification as read (not used)
export const markNotificationAsRead = createAsyncThunk(
  "user/markNotificationAsRead",
  async (notificationId, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState();
      const response = await fetch(
        `/api/user/notifications/${notificationId}/read`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${auth.token}`,
          },
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to mark notification as read");
      }

      return notificationId;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Mark all notifications as read (not used)
export const markAllNotificationsAsRead = createAsyncThunk(
  "user/markAllNotificationsAsRead",
  async (_, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState();
      const response = await fetch("/api/user/notifications/read-all", {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${auth.token}`,
        },
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(
          error.message || "Failed to mark all notifications as read"
        );
      }

      return true;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Delete notification (not used)
export const deleteNotification = createAsyncThunk(
  "user/deleteNotification",
  async (notificationId, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState();
      const response = await fetch(
        `/api/user/notifications/${notificationId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${auth.token}`,
          },
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to delete notification");
      }

      return notificationId;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Update user preferences (not used)
export const updateUserPreferences = createAsyncThunk(
  "user/updateUserPreferences",
  async (preferences, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState();
      const response = await fetch("/api/user/preferences", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${auth.token}`,
        },
        body: JSON.stringify(preferences),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to update preferences");
      }

      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
