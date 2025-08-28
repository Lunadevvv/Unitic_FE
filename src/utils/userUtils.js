import { ROLES, ROLE_NAMES } from './rolePermissions';

// Utility functions for user data handling

/**
 * Get display name from user object, handling different API response formats
 * @param {Object} user - User object from API
 * @returns {string} - Display name
 */
export const getUserDisplayName = (user) => {
  if (!user) return 'Người dùng';
  
  // Check for camelCase format (new API)
  if (user.firstName && user.lastName) {
    return `${user.firstName} ${user.lastName}`;
  }
  
  // Check for PascalCase format (old API)
  if (user.FirstName && user.LastName) {
    return `${user.FirstName} ${user.LastName}`;
  }
  
  // Fallback to other name fields
  if (user.name) return user.name;
  if (user.email) return user.email;
  if (user.Email) return user.Email;
  
  return 'Người dùng';
};

/**
 * Get university name from user object
 * @param {Object} user - User object from API
 * @returns {string} - University name
 */
export const getUserUniversity = (user) => {
  if (!user) return '';
  
  // Check for nested university object
  if (user.university && user.university.name) {
    return user.university.name;
  }
  
  // Check for direct university name fields
  if (user.universityName) return user.universityName;
  if (user.UniversityName) return user.UniversityName;
  
  return '';
};

/**
 * Get user avatar URL - Note: API doesn't provide avatar field
 * @returns {string|null} - Avatar URL or null
 */
export const getUserAvatar = () => {
  // API doesn't provide avatar field, always return null
  // Users will see default avatar icon
  return null;
};

/**
 * Format user data for consistent display
 * @param {Object} user - User object from API
 * @returns {Object} - Formatted user data
 */
export const formatUserData = (user) => {
  if (!user) return null;
  
  return {
    id: user.id,
    email: user.email || user.Email,
    displayName: getUserDisplayName(user),
    firstName: user.firstName || user.FirstName,
    lastName: user.lastName || user.LastName,
    university: getUserUniversity(user),
    avatar: null, // API doesn't provide avatar
    mssv: user.mssv,
    wallet: user.wallet,
    role: user.role,
    ...user // Include original data
  };
};

/**
 * Role mapping for display (legacy support)
 */
export const ROLE_MAPPING = {
  1: ROLE_NAMES[ROLES.ADMIN],
  2: ROLE_NAMES[ROLES.MODERATOR],
  3: ROLE_NAMES[ROLES.ORGANIZER],
  4: ROLE_NAMES[ROLES.STAFF],
  5: ROLE_NAMES[ROLES.USER],
  'admin': ROLE_NAMES[ROLES.ADMIN],
  'moderator': ROLE_NAMES[ROLES.MODERATOR],
  'organizer': ROLE_NAMES[ROLES.ORGANIZER],
  'staff': ROLE_NAMES[ROLES.STAFF],
  'user': ROLE_NAMES[ROLES.USER]
};

/**
 * Get role display name
 * @param {number|string} role - Role ID or role name
 * @returns {string} - Role display name
 */
export const getRoleDisplayName = (role) => {
  return ROLE_NAMES[role] || ROLE_MAPPING[role] || 'Unknown';
};
