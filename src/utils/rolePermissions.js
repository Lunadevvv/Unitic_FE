// Role constants
export const ROLES = {
  ADMIN: 1,
  MODERATOR: 2,
  ORGANIZER: 3,
  STAFF: 4,
  USER: 5
};

// Role display names
export const ROLE_NAMES = {
  [ROLES.ADMIN]: 'Admin',
  [ROLES.MODERATOR]: 'Moderator', 
  [ROLES.ORGANIZER]: 'Organizer',
  [ROLES.STAFF]: 'Staff',
  [ROLES.USER]: 'User'
};

// Permission configurations for each role
export const ROLE_PERMISSIONS = {
  [ROLES.ADMIN]: {
    // Admin có thể truy cập tất cả
    canAccessAdmin: true,
    canAccessDashboard: true,
    canAccessUserManagement: true,
    canAccessEventManagement: true,
    canAccessOrderManagement: true,
    canAccessTicketManagement: true,
    canAccessReports: true,
    canAccessSurveyManagement: true,
    canAccessCheckIn: true,
    canAccessBTCEventManagement: true,
    canAccessOrganizationPages: true
  },
  [ROLES.MODERATOR]: {
    // Moderator có thể quản lý sự kiện và user
    canAccessAdmin: true,
    canAccessDashboard: true,
    canAccessUserManagement: true,
    canAccessEventManagement: true,
    canAccessOrderManagement: false,
    canAccessTicketManagement: false,
    canAccessReports: false,
    canAccessSurveyManagement: false,
    canAccessCheckIn: false,
    canAccessBTCEventManagement: false,
    canAccessOrganizationPages: false
  },
  [ROLES.ORGANIZER]: {
    // Organizer có thể quản lý sự kiện của mình
    canAccessAdmin: false,
    canAccessDashboard: false,
    canAccessUserManagement: false,
    canAccessEventManagement: false,
    canAccessOrderManagement: false,
    canAccessTicketManagement: false,
    canAccessReports: false,
    canAccessSurveyManagement: false,
    canAccessCheckIn: false,
    canAccessBTCEventManagement: true,
    canAccessOrganizationPages: true
  },
  [ROLES.STAFF]: {
    // Staff có thể xem dashboard, danh sách vé và thực hiện check-in
    canAccessAdmin: true,
    canAccessDashboard: true,
    canAccessUserManagement: false,
    canAccessEventManagement: false,
    canAccessOrderManagement: false,
    canAccessTicketManagement: true, // Chỉ xem danh sách vé
    canAccessReports: false,
    canAccessSurveyManagement: false,
    canAccessCheckIn: true,
    canAccessBTCEventManagement: false,
    canAccessOrganizationPages: false
  },
  [ROLES.USER]: {
    // User không được truy cập các trang admin
    canAccessAdmin: false,
    canAccessDashboard: false,
    canAccessUserManagement: false,
    canAccessEventManagement: false,
    canAccessOrderManagement: false,
    canAccessTicketManagement: false,
    canAccessReports: false,
    canAccessSurveyManagement: false,
    canAccessCheckIn: false,
    canAccessBTCEventManagement: false,
    canAccessOrganizationPages: false
  }
};

/**
 * Kiểm tra quyền truy cập của user
 * @param {number} userRole - Role của user
 * @param {string} permission - Tên permission cần kiểm tra
 * @returns {boolean} - True nếu có quyền, false nếu không
 */
export const hasPermission = (userRole, permission) => {
  const rolePermissions = ROLE_PERMISSIONS[userRole];
  return rolePermissions ? rolePermissions[permission] : false;
};

/**
 * Lấy danh sách roles được phép cho một permission
 * @param {string} permission - Tên permission
 * @returns {number[]} - Mảng các role number được phép
 */
export const getAllowedRoles = (permission) => {
  return Object.keys(ROLE_PERMISSIONS)
    .map(role => parseInt(role))
    .filter(role => hasPermission(role, permission));
};

/**
 * Kiểm tra xem user có thể truy cập route không
 * @param {number} userRole - Role của user
 * @param {string} routePath - Đường dẫn route
 * @returns {boolean} - True nếu có quyền truy cập
 */
export const canAccessRoute = (userRole, routePath) => {
  // Mapping route paths to permissions
  const routePermissions = {
    '/admin': 'canAccessAdmin',
    '/admin/dashboard': 'canAccessDashboard',
    '/admin/users': 'canAccessUserManagement',
    '/admin/events': 'canAccessEventManagement',
    '/admin/orders': 'canAccessOrderManagement',
    '/admin/tickets': 'canAccessTicketManagement',
    '/admin/reports': 'canAccessReports',
    '/admin/surveys': 'canAccessSurveyManagement',
    '/events/checkin': 'canAccessCheckIn',
    '/btc/events': 'canAccessBTCEventManagement',
    '/organization': 'canAccessOrganizationPages'
  };

  // Kiểm tra exact match trước
  const permission = routePermissions[routePath];
  if (permission) {
    return hasPermission(userRole, permission);
  }

  // Kiểm tra partial match cho nested routes
  for (const [path, perm] of Object.entries(routePermissions)) {
    if (routePath.startsWith(path)) {
      return hasPermission(userRole, perm);
    }
  }

  // Nếu không match với bất kỳ protected route nào, cho phép truy cập
  return true;
};
