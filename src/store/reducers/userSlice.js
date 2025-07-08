import { createSlice } from '@reduxjs/toolkit';
import {
  fetchUserProfile,
  updateUserProfile,
  uploadAvatar,
  fetchUserTickets,
  fetchUserEvents,
  fetchWalletData,
  topUpWallet,
  withdrawFromWallet,
  fetchWalletTransactions,
  fetchNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
  updateUserPreferences,
} from '../actions/userActions';

// Initial state
const initialState = {
  profile: null,
  tickets: [],
  events: [],
  wallet: {
    balance: 0,
    transactions: [],
  },
  notifications: [],
  preferences: {
    language: 'vi',
    timezone: 'Asia/Ho_Chi_Minh',
    emailNotifications: true,
    pushNotifications: true,
    smsNotifications: false,
  },
  statistics: {
    totalEvents: 0,
    totalTickets: 0,
    totalSpent: 0,
    upcomingEvents: 0,
  },
  loading: {
    profile: false,
    tickets: false,
    events: false,
    wallet: false,
    notifications: false,
  },
  error: null,
};

// User slice
const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    updatePreferences: (state, action) => {
      state.preferences = { ...state.preferences, ...action.payload };
    },
    updateStatistics: (state, action) => {
      state.statistics = { ...state.statistics, ...action.payload };
    },
    addNotification: (state, action) => {
      state.notifications.unshift(action.payload);
    },
    removeNotification: (state, action) => {
      state.notifications = state.notifications.filter(
        notification => notification.id !== action.payload
      );
    },
    clearNotifications: (state) => {
      state.notifications = [];
    },
    updateWalletBalance: (state, action) => {
      state.wallet.balance = action.payload;
    },
    addWalletTransaction: (state, action) => {
      state.wallet.transactions.unshift(action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch user profile
      .addCase(fetchUserProfile.pending, (state) => {
        state.loading.profile = true;
        state.error = null;
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.loading.profile = false;
        state.profile = action.payload;
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.loading.profile = false;
        state.error = action.payload;
      })
      // Update user profile
      .addCase(updateUserProfile.pending, (state) => {
        state.loading.profile = true;
        state.error = null;
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.loading.profile = false;
        state.profile = { ...state.profile, ...action.payload };
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.loading.profile = false;
        state.error = action.payload;
      })
      // Fetch user tickets
      .addCase(fetchUserTickets.pending, (state) => {
        state.loading.tickets = true;
        state.error = null;
      })
      .addCase(fetchUserTickets.fulfilled, (state, action) => {
        state.loading.tickets = false;
        state.tickets = action.payload.tickets || action.payload;
        if (action.payload.statistics) {
          state.statistics = { ...state.statistics, ...action.payload.statistics };
        }
      })
      .addCase(fetchUserTickets.rejected, (state, action) => {
        state.loading.tickets = false;
        state.error = action.payload;
      })
      // Fetch user events
      .addCase(fetchUserEvents.pending, (state) => {
        state.loading.events = true;
        state.error = null;
      })
      .addCase(fetchUserEvents.fulfilled, (state, action) => {
        state.loading.events = false;
        state.events = action.payload.events || action.payload;
      })
      .addCase(fetchUserEvents.rejected, (state, action) => {
        state.loading.events = false;
        state.error = action.payload;
      })
      // Fetch wallet data
      .addCase(fetchWalletData.pending, (state) => {
        state.loading.wallet = true;
        state.error = null;
      })
      .addCase(fetchWalletData.fulfilled, (state, action) => {
        state.loading.wallet = false;
        state.wallet = action.payload;
      })
      .addCase(fetchWalletData.rejected, (state, action) => {
        state.loading.wallet = false;
        state.error = action.payload;
      })
      // Top up wallet
      .addCase(topUpWallet.pending, (state) => {
        state.loading.wallet = true;
        state.error = null;
      })
      .addCase(topUpWallet.fulfilled, (state, action) => {
        state.loading.wallet = false;
        state.wallet.balance = action.payload.newBalance;
        state.wallet.transactions.unshift(action.payload.transaction);
      })
      .addCase(topUpWallet.rejected, (state, action) => {
        state.loading.wallet = false;
        state.error = action.payload;
      })
      // Fetch notifications
      .addCase(fetchNotifications.pending, (state) => {
        state.loading.notifications = true;
        state.error = null;
      })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.loading.notifications = false;
        state.notifications = action.payload.notifications || action.payload;
      })
      .addCase(fetchNotifications.rejected, (state, action) => {
        state.loading.notifications = false;
        state.error = action.payload;
      })
      // Mark notification as read
      .addCase(markNotificationAsRead.fulfilled, (state, action) => {
        const notification = state.notifications.find(n => n.id === action.payload);
        if (notification) {
          notification.read = true;
        }
      })
      // Upload avatar
      .addCase(uploadAvatar.pending, (state) => {
        state.loading.profile = true;
      })
      .addCase(uploadAvatar.fulfilled, (state, action) => {
        state.loading.profile = false;
        if (state.profile) {
          state.profile.avatar = action.payload.avatarUrl;
        }
      })
      .addCase(uploadAvatar.rejected, (state, action) => {
        state.loading.profile = false;
        state.error = action.payload;
      })
      // Withdraw from wallet
      .addCase(withdrawFromWallet.pending, (state) => {
        state.loading.wallet = true;
      })
      .addCase(withdrawFromWallet.fulfilled, (state, action) => {
        state.loading.wallet = false;
        state.wallet.balance = action.payload.newBalance;
        state.wallet.transactions.unshift(action.payload.transaction);
      })
      .addCase(withdrawFromWallet.rejected, (state, action) => {
        state.loading.wallet = false;
        state.error = action.payload;
      })
      // Fetch wallet transactions
      .addCase(fetchWalletTransactions.fulfilled, (state, action) => {
        state.wallet.transactions = action.payload;
      })
      // Mark all notifications as read
      .addCase(markAllNotificationsAsRead.fulfilled, (state) => {
        state.notifications.forEach(notification => {
          notification.read = true;
        });
      })
      // Delete notification
      .addCase(deleteNotification.fulfilled, (state, action) => {
        state.notifications = state.notifications.filter(n => n.id !== action.payload);
      })
      // Update preferences
      .addCase(updateUserPreferences.fulfilled, (state, action) => {
        state.preferences = { ...state.preferences, ...action.payload };
      });
  },
});

export const {
  clearError,
  updatePreferences,
  updateStatistics,
  addNotification,
  removeNotification,
  clearNotifications,
  updateWalletBalance,
  addWalletTransaction,
} = userSlice.actions;

export default userSlice.reducer;
