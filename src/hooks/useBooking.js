import { useSelector, useDispatch } from 'react-redux';
import { 
  buyTicket,
  getAllBookings,
  getBookingsByUserId,
  getCurrentUserBookings
} from '../store/actions/bookingActions';
import { 
  clearError, 
  clearLastPurchase, 
  setSelectedBooking 
} from '../store/reducers/bookingSlice';

export const useBooking = () => {
  const dispatch = useDispatch();
  const { 
    bookings, 
    currentUserBookings, 
    selectedBooking, 
    loading, 
    error, 
    lastPurchase 
  } = useSelector((state) => state.booking);

  const purchaseTicket = (eventID, quantity) => {
    return dispatch(buyTicket({ eventID, quantity }));
  };

  const loadAllBookings = () => {
    return dispatch(getAllBookings());
  };

  const loadBookingsByUserId = (userId) => {
    return dispatch(getBookingsByUserId(userId));
  };

  const loadCurrentUserBookings = () => {
    return dispatch(getCurrentUserBookings());
  };

  const clearBookingError = () => {
    dispatch(clearError());
  };

  const clearLastPurchaseInfo = () => {
    dispatch(clearLastPurchase());
  };

  const selectBooking = (booking) => {
    dispatch(setSelectedBooking(booking));
  };

  return {
    // Data
    bookings,
    currentUserBookings,
    selectedBooking,
    lastPurchase,
    
    // Loading states
    loading,
    isLoading: Object.values(loading).some(isLoading => isLoading),
    
    // Error
    error,
    
    // Actions
    purchaseTicket,
    loadAllBookings,
    loadBookingsByUserId,
    loadCurrentUserBookings,
    clearBookingError,
    clearLastPurchaseInfo,
    selectBooking,
  };
};
