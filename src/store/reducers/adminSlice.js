import { createSlice } from '@reduxjs/toolkit';
import {
  fetchDashboardData,
  fetchAllAccounts,
  fetchAccountById,
  fetchUniversities,
  updateUserStatus,
  updateUserRole,
  deleteUser,
  fetchAllOrders,
  updateOrderStatus,
  cancelOrder,
  fetchSurveys,
  createSurvey,
  updateSurvey,
  deleteSurvey,
  sendSurvey,
  fetchSurveyResponses,
  fetchSystemSettings,
  updateSystemSettings,
  generateReport,
} from '../actions/adminActions';

// Initial state
const initialState = {
  dashboard: {
    stats: {
      totalUsers: 0,
      totalEvents: 0,
      totalOrders: 0,
      totalRevenue: 0,
      activeUsers: 0,
      upcomingEvents: 0,
    },
    recentActivities: [],
    chartData: {
      userGrowth: [],
      revenue: [],
      eventBookings: [],
    },
  },
  accounts: {
    list: [],
    total: 0,
    selectedAccount: null,
    filters: {
      status: '',
      role: '',
      search: '',
    },
    pagination: {
      current: 1,
      pageSize: 10,
    },
    loading: false,
    error: null,
  },
  universities: {
    list: [],
    loading: false,
    error: null,
  },
  users: {
    list: [],
    total: 0,
    filters: {
      status: '',
      role: '',
      search: '',
    },
    pagination: {
      current: 1,
      pageSize: 10,
    },
  },
  orders: {
    list: [],
    total: 0,
    filters: {
      status: '',
      dateRange: null,
      search: '',
    },
    pagination: {
      current: 1,
      pageSize: 10,
    },
  },
  surveys: {
    list: [],
    total: 0,
    currentSurvey: null,
  },
  settings: {},
  reports: [],
  loading: {
    dashboard: false,
    users: false,
    orders: false,
    surveys: false,
    reports: false,
  },
  error: null,
};

// Admin slice
const adminSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setUserFilters: (state, action) => {
      state.users.filters = { ...state.users.filters, ...action.payload };
    },
    setUserPagination: (state, action) => {
      state.users.pagination = { ...state.users.pagination, ...action.payload };
    },
    setOrderFilters: (state, action) => {
      state.orders.filters = { ...state.orders.filters, ...action.payload };
    },
    setOrderPagination: (state, action) => {
      state.orders.pagination = { ...state.orders.pagination, ...action.payload };
    },
    setCurrentSurvey: (state, action) => {
      state.surveys.currentSurvey = action.payload;
    },
    updateDashboardStats: (state, action) => {
      state.dashboard.stats = { ...state.dashboard.stats, ...action.payload };
    },
  },
  extraReducers: (builder) => {
    builder
      // Dashboard
      .addCase(fetchDashboardData.pending, (state) => {
        state.loading.dashboard = true;
        state.error = null;
      })
      .addCase(fetchDashboardData.fulfilled, (state, action) => {
        state.loading.dashboard = false;
        state.dashboard = { ...state.dashboard, ...action.payload };
      })
      .addCase(fetchDashboardData.rejected, (state, action) => {
        state.loading.dashboard = false;
        state.error = action.payload;
      })
      // Accounts
      .addCase(fetchAllAccounts.pending, (state) => {
        state.accounts.loading = true;
        state.accounts.error = null;
      })
      .addCase(fetchAllAccounts.fulfilled, (state, action) => {
        state.accounts.loading = false;
        state.accounts.list = action.payload;
        state.accounts.total = action.payload.length;
      })
      .addCase(fetchAllAccounts.rejected, (state, action) => {
        state.accounts.loading = false;
        state.accounts.error = action.payload;
      })
      // Account by ID
      .addCase(fetchAccountById.pending, (state) => {
        state.accounts.loading = true;
        state.accounts.error = null;
      })
      .addCase(fetchAccountById.fulfilled, (state, action) => {
        state.accounts.loading = false;
        state.accounts.selectedAccount = action.payload;
      })
      .addCase(fetchAccountById.rejected, (state, action) => {
        state.accounts.loading = false;
        state.accounts.error = action.payload;
      })
      // Universities
      .addCase(fetchUniversities.pending, (state) => {
        state.universities.loading = true;
        state.universities.error = null;
      })
      .addCase(fetchUniversities.fulfilled, (state, action) => {
        state.universities.loading = false;
        state.universities.list = action.payload;
      })
      .addCase(fetchUniversities.rejected, (state, action) => {
        state.universities.loading = false;
        state.universities.error = action.payload;
      })
      .addCase(updateUserStatus.fulfilled, (state, action) => {
        const { userId, status } = action.payload;
        const user = state.users.list.find(u => u.id === userId);
        if (user) {
          user.status = status;
        }
      })
      .addCase(updateUserRole.fulfilled, (state, action) => {
        const { userId, role } = action.payload;
        const user = state.users.list.find(u => u.id === userId);
        if (user) {
          user.role = role;
        }
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.users.list = state.users.list.filter(u => u.id !== action.payload);
        state.users.total -= 1;
      })
      // Orders
      .addCase(fetchAllOrders.pending, (state) => {
        state.loading.orders = true;
        state.error = null;
      })
      .addCase(fetchAllOrders.fulfilled, (state, action) => {
        state.loading.orders = false;
        state.orders.list = action.payload.orders || action.payload;
        state.orders.total = action.payload.total || action.payload.length;
      })
      .addCase(fetchAllOrders.rejected, (state, action) => {
        state.loading.orders = false;
        state.error = action.payload;
      })
      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        const { orderId, status } = action.payload;
        const order = state.orders.list.find(o => o.id === orderId);
        if (order) {
          order.status = status;
        }
      })
      .addCase(cancelOrder.fulfilled, (state, action) => {
        const { orderId, status, reason } = action.payload;
        const order = state.orders.list.find(o => o.id === orderId);
        if (order) {
          order.status = status;
          order.cancelReason = reason;
        }
      })
      // Surveys
      .addCase(fetchSurveys.pending, (state) => {
        state.loading.surveys = true;
        state.error = null;
      })
      .addCase(fetchSurveys.fulfilled, (state, action) => {
        state.loading.surveys = false;
        state.surveys.list = action.payload.surveys || action.payload;
        state.surveys.total = action.payload.total || action.payload.length;
      })
      .addCase(fetchSurveys.rejected, (state, action) => {
        state.loading.surveys = false;
        state.error = action.payload;
      })
      .addCase(createSurvey.fulfilled, (state, action) => {
        state.surveys.list.unshift(action.payload);
        state.surveys.total += 1;
      })
      .addCase(updateSurvey.fulfilled, (state, action) => {
        const index = state.surveys.list.findIndex(s => s.id === action.payload.id);
        if (index !== -1) {
          state.surveys.list[index] = action.payload;
        }
      })
      .addCase(deleteSurvey.fulfilled, (state, action) => {
        state.surveys.list = state.surveys.list.filter(s => s.id !== action.payload);
        state.surveys.total -= 1;
      })
      .addCase(sendSurvey.fulfilled, (state, action) => {
        const survey = state.surveys.list.find(s => s.id === action.payload);
        if (survey) {
          survey.status = 'active';
          survey.sentAt = new Date().toISOString();
        }
      })
      .addCase(fetchSurveyResponses.fulfilled, (state, action) => {
        const survey = state.surveys.list.find(s => s.id === action.meta.arg);
        if (survey) {
          survey.responses = action.payload;
        }
      })
      // System settings
      .addCase(fetchSystemSettings.fulfilled, (state, action) => {
        state.settings = action.payload;
      })
      .addCase(updateSystemSettings.fulfilled, (state, action) => {
        state.settings = { ...state.settings, ...action.payload };
      })
      // Reports
      .addCase(generateReport.pending, (state) => {
        state.loading.reports = true;
      })
      .addCase(generateReport.fulfilled, (state, action) => {
        state.loading.reports = false;
        state.reports = state.reports || [];
        state.reports.unshift(action.payload);
      })
      .addCase(generateReport.rejected, (state, action) => {
        state.loading.reports = false;
        state.error = action.payload;
      });
  },
});

export const {
  clearError,
  setUserFilters,
  setUserPagination,
  setOrderFilters,
  setOrderPagination,
  setCurrentSurvey,
  updateDashboardStats,
} = adminSlice.actions;

export default adminSlice.reducer;
