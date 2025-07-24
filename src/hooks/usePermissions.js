import { useSelector } from 'react-redux';
import { hasPermission, canAccessRoute } from '../utils/rolePermissions';

/**
 * Hook để kiểm tra quyền truy cập của user
 * @returns {Object} - Object chứa các function kiểm tra quyền
 */
export const usePermissions = () => {
  const { user } = useSelector(state => state.auth);
  
  /**
   * Kiểm tra user có permission cụ thể không
   * @param {string} permission - Tên permission
   * @returns {boolean}
   */
  const checkPermission = (permission) => {
    if (!user?.role) return false;
    return hasPermission(user.role, permission);
  };

  /**
   * Kiểm tra user có thể truy cập route không
   * @param {string} routePath - Đường dẫn route
   * @returns {boolean}
   */
  const checkRouteAccess = (routePath) => {
    if (!user?.role) return false;
    return canAccessRoute(user.role, routePath);
  };

  /**
   * Kiểm tra user có thuộc một trong các roles được phép không
   * @param {number[]} allowedRoles - Mảng các role ID được phép
   * @returns {boolean}
   */
  const checkRole = (allowedRoles) => {
    if (!user?.role || !Array.isArray(allowedRoles)) return false;
    return allowedRoles.includes(user.role);
  };

  return {
    user,
    userRole: user?.role,
    checkPermission,
    checkRouteAccess,
    checkRole,
    
    // Quick permission checks
    canAccessAdmin: checkPermission('canAccessAdmin'),
    canAccessDashboard: checkPermission('canAccessDashboard'),
    canAccessUserManagement: checkPermission('canAccessUserManagement'),
    canAccessEventManagement: checkPermission('canAccessEventManagement'),
    canAccessOrderManagement: checkPermission('canAccessOrderManagement'),
    canAccessTicketManagement: checkPermission('canAccessTicketManagement'),
    canAccessReports: checkPermission('canAccessReports'),
    canAccessCheckIn: checkPermission('canAccessCheckIn'),
    canAccessBTCEventManagement: checkPermission('canAccessBTCEventManagement'),
    canAccessOrganizationPages: checkPermission('canAccessOrganizationPages')
  };
};

export default usePermissions;
