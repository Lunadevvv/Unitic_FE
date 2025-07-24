import { useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateUserProfile, fetchUserProfile } from '../store/actions/userActions';

/**
 * Custom hook for managing user profile
 */
export const useProfile = () => {
  const dispatch = useDispatch();
  const { profile, loading, error } = useSelector(state => state.user);
  const [updateLoading, setUpdateLoading] = useState(false);

  /**
   * Update user profile information
   * @param {Object} profileData - The profile data to update
   * @param {string} profileData.firstName - User's first name
   * @param {string} profileData.lastName - User's last name
   * @param {string} profileData.mssv - Student ID (MSSV)
   * @param {string} profileData.universityId - University ID
   * @returns {Promise} Promise that resolves with update result
   */
  const updateProfile = useCallback(async (profileData) => {
    setUpdateLoading(true);
    try {
      const result = await dispatch(updateUserProfile(profileData));
      if (updateUserProfile.fulfilled.match(result)) {
        // Refresh profile data after successful update
        dispatch(fetchUserProfile());
        return { success: true, data: result.payload };
      } else {
        return { success: false, error: result.payload || 'Failed to update profile' };
      }
    } catch (error) {
      return { success: false, error: error.message || 'Failed to update profile' };
    } finally {
      setUpdateLoading(false);
    }
  }, [dispatch]);

  /**
   * Refresh user profile data
   */
  const refreshProfile = useCallback(() => {
    dispatch(fetchUserProfile());
  }, [dispatch]);

  return {
    profile,
    loading,
    error,
    updateLoading,
    updateProfile,
    refreshProfile
  };
};

export default useProfile;
