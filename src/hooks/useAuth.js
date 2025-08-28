import { useSelector, useDispatch } from 'react-redux';
import { logoutUser, fetchUserProfile, fetchUniversities } from '../store/actions/authActions';

export const useAuth = () => {
  const dispatch = useDispatch();
  const { 
    user, 
    token, 
    isAuthenticated, 
    loading, 
    error, 
    role, 
    universities, 
    universitiesLoading 
  } = useSelector((state) => state.auth);

  const logout = () => {
    dispatch(logoutUser());
  };

  const refreshUserProfile = () => {
    dispatch(fetchUserProfile());
  };

  const loadUniversities = () => {
    dispatch(fetchUniversities());
  };

  return {
    user,
    token,
    isAuthenticated,
    loading,
    error,
    role,
    universities,
    universitiesLoading,
    logout,
    refreshUserProfile,
    loadUniversities
  };
};

export default useAuth;