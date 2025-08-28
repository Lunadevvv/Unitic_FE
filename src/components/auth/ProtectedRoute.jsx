import { useSelector } from 'react-redux';
import { Navigate, useLocation } from 'react-router-dom';
import { message } from 'antd';
import { useEffect } from 'react';

const ProtectedRoute = ({ children, allowedRoles = [], redirectTo = '/signin' }) => {
  const { user, isAuthenticated } = useSelector(state => state.auth);
  const location = useLocation();

  useEffect(() => {
    // Kiểm tra authentication
    if (!isAuthenticated) {
      message.warning('Vui lòng đăng nhập để truy cập trang này');
      return;
    }

    // Kiểm tra role permissions
    if (allowedRoles.length > 0 && user?.role && !allowedRoles.includes(user.role)) {
      message.error('Bạn không có quyền truy cập trang này');
    }
  }, [isAuthenticated, user, allowedRoles, location.pathname]);

  // Nếu chưa đăng nhập, chuyển hướng về trang login
  if (!isAuthenticated || !user) {
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  // Nếu đã đăng nhập nhưng không có quyền, chuyển hướng về trang chủ
  if (allowedRoles.length > 0 && user?.role && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
