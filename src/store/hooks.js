import { useDispatch, useSelector } from 'react-redux';

// Custom hooks for typed useSelector and useDispatch
export const useAppDispatch = () => useDispatch();
export const useAppSelector = (selector) => useSelector(selector);

// Specific selector hooks for common use cases
export const useAuth = () => {
  return useAppSelector((state) => state.auth);
};

export const useEvents = () => {
  return useAppSelector((state) => state.events);
};

export const useCart = () => {
  return useAppSelector((state) => state.cart);
};

export const useUI = () => {
  return useAppSelector((state) => state.ui);
};

export const useUser = () => {
  return useAppSelector((state) => state.user);
};

// Loading state hooks
export const useIsLoading = (slice, key = 'loading') => {
  return useAppSelector((state) => {
    if (typeof state[slice][key] === 'object') {
      return Object.values(state[slice][key]).some(loading => loading);
    }
    return state[slice][key];
  });
};

export const useGlobalLoading = () => {
  return useAppSelector((state) => state.ui.loading.global);
};

export const usePageLoading = () => {
  return useAppSelector((state) => state.ui.loading.page);
};

// Modal hooks
export const useModal = (modalName) => {
  const isOpen = useAppSelector((state) => state.ui.modals[modalName]);
  const dispatch = useAppDispatch();

  const openModal = () => dispatch({ type: 'ui/openModal', payload: modalName });
  const closeModal = () => dispatch({ type: 'ui/closeModal', payload: modalName });

  return { isOpen, openModal, closeModal };
};

// Theme hooks
export const useTheme = () => {
  const theme = useAppSelector((state) => state.ui.theme);
  const dispatch = useAppDispatch();

  const setThemeMode = (mode) => dispatch({ type: 'ui/setThemeMode', payload: mode });
  const setPrimaryColor = (color) => dispatch({ type: 'ui/setPrimaryColor', payload: color });

  return { ...theme, setThemeMode, setPrimaryColor };
};

// Search hooks
export const useSearch = () => {
  const search = useAppSelector((state) => state.ui.search);
  const dispatch = useAppDispatch();

  const setQuery = (query) => dispatch({ type: 'ui/setSearchQuery', payload: query });
  const addToHistory = (query) => dispatch({ type: 'ui/addToSearchHistory', payload: query });
  const clearHistory = () => dispatch({ type: 'ui/clearSearchHistory' });

  return { ...search, setQuery, addToHistory, clearHistory };
};

// Notification hooks
export const useNotifications = () => {
  const notifications = useAppSelector((state) => state.user.notifications);
  const unreadCount = notifications.filter(n => !n.read).length;
  
  return { notifications, unreadCount };
};

// Cart hooks
export const useCartSummary = () => {
  const cart = useAppSelector((state) => state.cart);
  
  return {
    itemCount: cart.items.length,
    totalItems: cart.items.reduce((sum, item) => sum + item.quantity, 0),
    subtotal: cart.subtotal,
    totalAmount: cart.totalAmount,
    discount: cart.discount,
    discountAmount: cart.discountAmount,
    hasItems: cart.items.length > 0,
  };
};

// Device hooks
export const useDevice = () => {
  return useAppSelector((state) => state.ui.device);
};

// User role hooks
export const useUserRole = () => {
  const { role, isAuthenticated } = useAppSelector((state) => state.auth);
  
  const isAdmin = role === 'admin';
  const isBTC = role === 'btc';
  const isUser = role === 'user';
  const isGuest = !isAuthenticated || role === 'guest';
  
  return { role, isAdmin, isBTC, isUser, isGuest, isAuthenticated };
};

// Error hooks
export const useErrors = () => {
  const authError = useAppSelector((state) => state.auth.error);
  const eventsError = useAppSelector((state) => state.events.error);
  const cartError = useAppSelector((state) => state.cart.error);
  const userError = useAppSelector((state) => state.user.error);
  
  const hasErrors = !!(authError || eventsError || cartError || userError);
  
  return {
    authError,
    eventsError,
    cartError,
    userError,
    hasErrors,
    anyError: authError || eventsError || cartError || userError,
  };
};

export default {
  useAppDispatch,
  useAppSelector,
  useAuth,
  useEvents,
  useCart,
  useUI,
  useUser,
  useIsLoading,
  useGlobalLoading,
  usePageLoading,
  useModal,
  useTheme,
  useSearch,
  useNotifications,
  useCartSummary,
  useDevice,
  useUserRole,
  useErrors,
};
