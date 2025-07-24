import { useSelector } from 'react-redux';
import { hasPermission } from '../../utils/rolePermissions';

/**
 * Component để ẩn/hiện element dựa trên role permission
 * @param {Object} props
 * @param {ReactNode} props.children - Element con cần được bảo vệ
 * @param {string} props.permission - Tên permission cần kiểm tra
 * @param {number[]} props.allowedRoles - Danh sách roles được phép (alternative to permission)
 * @param {ReactNode} props.fallback - Element hiển thị khi không có quyền
 * @returns {ReactNode}
 */
const RoleGuard = ({ children, permission, allowedRoles, fallback = null }) => {
  const { user } = useSelector(state => state.auth);
  
  let hasAccess = false;
  
  if (permission && user?.role) {
    // Kiểm tra bằng permission name
    hasAccess = hasPermission(user.role, permission);
  } else if (allowedRoles && user?.role) {
    // Kiểm tra bằng danh sách roles
    hasAccess = allowedRoles.includes(user.role);
  }
  
  return hasAccess ? children : fallback;
};

export default RoleGuard;
