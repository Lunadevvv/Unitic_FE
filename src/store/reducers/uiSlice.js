import { createSlice } from '@reduxjs/toolkit';

// Initial state
const initialState = {
  // Loading states
  loading: {
    global: false,
    page: false,
    component: {},
  },
  
  // Modal states
  modals: {
    login: false,
    register: false,
    eventDetail: false,
    cart: false,
    profile: false,
    checkout: false,
    qrCode: false,
  },
  
  // Sidebar states
  sidebar: {
    collapsed: false,
    mobileOpen: false,
  },
  
  // Theme settings
  theme: {
    mode: localStorage.getItem('themeMode') || 'light',
    primaryColor: localStorage.getItem('primaryColor') || '#d4b483',
  },
  
  // Notification settings
  notifications: {
    enabled: JSON.parse(localStorage.getItem('notificationsEnabled')) || true,
    sound: JSON.parse(localStorage.getItem('notificationSound')) || true,
    position: localStorage.getItem('notificationPosition') || 'topRight',
  },
  
  // Layout settings
  layout: {
    headerFixed: true,
    sidebarFixed: true,
    contentPadding: 24,
  },
  
  // Search states
  search: {
    query: '',
    suggestions: [],
    history: JSON.parse(localStorage.getItem('searchHistory')) || [],
    recentSearches: JSON.parse(localStorage.getItem('recentSearches')) || [],
  },
  
  // Filters
  filters: {
    visible: false,
    activeFilters: {},
  },
  
  // Breadcrumbs
  breadcrumbs: [],
  
  // Toast notifications
  toasts: [],
  
  // Device info
  device: {
    isMobile: window.innerWidth <= 768,
    isTablet: window.innerWidth > 768 && window.innerWidth <= 1024,
    isDesktop: window.innerWidth > 1024,
  },
  
  // Page states
  page: {
    title: '',
    description: '',
    keywords: '',
  },
};

// UI slice
const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    // Loading actions
    setGlobalLoading: (state, action) => {
      state.loading.global = action.payload;
    },
    setPageLoading: (state, action) => {
      state.loading.page = action.payload;
    },
    setComponentLoading: (state, action) => {
      const { component, loading } = action.payload;
      state.loading.component[component] = loading;
    },
    
    openModal: (state, action) => {
      const modalName = action.payload;
      if (Object.prototype.hasOwnProperty.call(state.modals, modalName)) {
        state.modals[modalName] = true;
      }
    },
    closeModal: (state, action) => {
      const modalName = action.payload;
      if (Object.prototype.hasOwnProperty.call(state.modals, modalName)) {
        state.modals[modalName] = false;
      }
    },
    closeAllModals: (state) => {
      Object.keys(state.modals).forEach(modal => {
        state.modals[modal] = false;
      });
    },
    
    // Sidebar actions
    toggleSidebar: (state) => {
      state.sidebar.collapsed = !state.sidebar.collapsed;
    },
    setSidebarCollapsed: (state, action) => {
      state.sidebar.collapsed = action.payload;
    },
    toggleMobileSidebar: (state) => {
      state.sidebar.mobileOpen = !state.sidebar.mobileOpen;
    },
    setMobileSidebarOpen: (state, action) => {
      state.sidebar.mobileOpen = action.payload;
    },
    
    // Theme actions
    setThemeMode: (state, action) => {
      state.theme.mode = action.payload;
      localStorage.setItem('themeMode', action.payload);
    },
    setPrimaryColor: (state, action) => {
      state.theme.primaryColor = action.payload;
      localStorage.setItem('primaryColor', action.payload);
    },
    
    // Notification actions
    setNotificationsEnabled: (state, action) => {
      state.notifications.enabled = action.payload;
      localStorage.setItem('notificationsEnabled', JSON.stringify(action.payload));
    },
    setNotificationSound: (state, action) => {
      state.notifications.sound = action.payload;
      localStorage.setItem('notificationSound', JSON.stringify(action.payload));
    },
    setNotificationPosition: (state, action) => {
      state.notifications.position = action.payload;
      localStorage.setItem('notificationPosition', action.payload);
    },
    
    // Search actions
    setSearchQuery: (state, action) => {
      state.search.query = action.payload;
    },
    setSearchSuggestions: (state, action) => {
      state.search.suggestions = action.payload;
    },
    addToSearchHistory: (state, action) => {
      const query = action.payload;
      if (query && !state.search.history.includes(query)) {
        state.search.history.unshift(query);
        // Keep only last 10 searches
        state.search.history = state.search.history.slice(0, 10);
        localStorage.setItem('searchHistory', JSON.stringify(state.search.history));
      }
    },
    clearSearchHistory: (state) => {
      state.search.history = [];
      localStorage.removeItem('searchHistory');
    },
    addRecentSearch: (state, action) => {
      const search = action.payload;
      const existingIndex = state.search.recentSearches.findIndex(s => s.query === search.query);
      
      if (existingIndex !== -1) {
        state.search.recentSearches.splice(existingIndex, 1);
      }
      
      state.search.recentSearches.unshift({
        ...search,
        timestamp: new Date().toISOString(),
      });
      
      // Keep only last 5 recent searches
      state.search.recentSearches = state.search.recentSearches.slice(0, 5);
      localStorage.setItem('recentSearches', JSON.stringify(state.search.recentSearches));
    },
    
    // Filter actions
    setFiltersVisible: (state, action) => {
      state.filters.visible = action.payload;
    },
    setActiveFilters: (state, action) => {
      state.filters.activeFilters = action.payload;
    },
    updateActiveFilters: (state, action) => {
      state.filters.activeFilters = { ...state.filters.activeFilters, ...action.payload };
    },
    clearActiveFilters: (state) => {
      state.filters.activeFilters = {};
    },
    
    // Breadcrumb actions
    setBreadcrumbs: (state, action) => {
      state.breadcrumbs = action.payload;
    },
    addBreadcrumb: (state, action) => {
      state.breadcrumbs.push(action.payload);
    },
    
    // Toast actions
    addToast: (state, action) => {
      const toast = {
        id: Date.now() + Math.random(),
        ...action.payload,
        timestamp: new Date().toISOString(),
      };
      state.toasts.push(toast);
    },
    removeToast: (state, action) => {
      state.toasts = state.toasts.filter(toast => toast.id !== action.payload);
    },
    clearToasts: (state) => {
      state.toasts = [];
    },
    
    // Device actions
    updateDeviceInfo: (state, action) => {
      const width = action.payload || window.innerWidth;
      state.device = {
        isMobile: width <= 768,
        isTablet: width > 768 && width <= 1024,
        isDesktop: width > 1024,
      };
    },
    
    // Page actions
    setPageMeta: (state, action) => {
      state.page = { ...state.page, ...action.payload };
    },
    
    // Layout actions
    setHeaderFixed: (state, action) => {
      state.layout.headerFixed = action.payload;
    },
    setSidebarFixed: (state, action) => {
      state.layout.sidebarFixed = action.payload;
    },
    setContentPadding: (state, action) => {
      state.layout.contentPadding = action.payload;
    },
  },
});

export const {
  // Loading
  setGlobalLoading,
  setPageLoading,
  setComponentLoading,
  
  // Modals
  openModal,
  closeModal,
  closeAllModals,
  
  // Sidebar
  toggleSidebar,
  setSidebarCollapsed,
  toggleMobileSidebar,
  setMobileSidebarOpen,
  
  // Theme
  setThemeMode,
  setPrimaryColor,
  
  // Notifications
  setNotificationsEnabled,
  setNotificationSound,
  setNotificationPosition,
  
  // Search
  setSearchQuery,
  setSearchSuggestions,
  addToSearchHistory,
  clearSearchHistory,
  addRecentSearch,
  
  // Filters
  setFiltersVisible,
  setActiveFilters,
  updateActiveFilters,
  clearActiveFilters,
  
  // Breadcrumbs
  setBreadcrumbs,
  addBreadcrumb,
  
  // Toasts
  addToast,
  removeToast,
  clearToasts,
  
  // Device
  updateDeviceInfo,
  
  // Page
  setPageMeta,
  
  // Layout
  setHeaderFixed,
  setSidebarFixed,
  setContentPadding,
} = uiSlice.actions;

export default uiSlice.reducer;
