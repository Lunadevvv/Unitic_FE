import dayjs from 'dayjs';

/**
 * Format date to API required format: yyyy-MM-ddTHH:mm:ss
 * @param {dayjs.Dayjs|Date|string} date - Date to format
 * @returns {string} Formatted date string
 */
export const formatDateForAPI = (date) => {
  if (!date) return '';
  
  // Convert to dayjs if it's not already
  const dayjsDate = dayjs.isDayjs(date) ? date : dayjs(date);
  
  // Return in the required format
  return dayjsDate.format('YYYY-MM-DDTHH:mm:ss');
};

/**
 * Format date for display in Vietnamese format
 * @param {string|Date|dayjs.Dayjs} date - Date to format
 * @returns {string} Formatted date string for display
 */
export const formatDateForDisplay = (date) => {
  if (!date) return '';
  
  const dayjsDate = dayjs.isDayjs(date) ? date : dayjs(date);
  return dayjsDate.format('DD/MM/YYYY HH:mm');
};

/**
 * Parse API date string to dayjs object
 * @param {string} dateString - Date string from API
 * @returns {dayjs.Dayjs} Dayjs object
 */
export const parseAPIDate = (dateString) => {
  if (!dateString) return null;
  return dayjs(dateString);
};

/**
 * Check if date format is valid for API
 * @param {string} dateString - Date string to validate
 * @returns {boolean} True if format is valid
 */
export const isValidAPIDateFormat = (dateString) => {
  if (!dateString) return false;
  
  // Check if format matches yyyy-MM-ddTHH:mm:ss
  const regex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}$/;
  if (!regex.test(dateString)) return false;
  
  // Check if date is actually valid
  const parsed = dayjs(dateString);
  return parsed.isValid();
};

export default {
  formatDateForAPI,
  formatDateForDisplay,
  parseAPIDate,
  isValidAPIDateFormat
};
