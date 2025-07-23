import React from 'react';
import { Avatar } from 'antd';
import { UserOutlined } from '@ant-design/icons';

const UserDisplay = ({ user, showEmail = false, size = 'default' }) => {
  if (!user) return null;

  const getDisplayName = () => {
    if (user.firstName && user.lastName) {
      return `${user.firstName} ${user.lastName}`;
    }
    if (user.FirstName && user.LastName) {
      return `${user.FirstName} ${user.LastName}`;
    }
    return user.name || user.email || 'Người dùng';
  };

  const getUniversityName = () => {
    if (user.university && user.university.name) {
      return user.university.name;
    }
    return user.universityName || user.UniversityName || '';
  };

  return (
    <div className="user-display">
      <Avatar 
        icon={<UserOutlined />}
        size={size}
        className="user-avatar"
      />
      <div className="user-info">
        <span className="user-name">{getDisplayName()}</span>
        {showEmail && user.email && (
          <span className="user-email">{user.email}</span>
        )}
        {getUniversityName() && (
          <span className="user-university">{getUniversityName()}</span>
        )}
        {user.mssv && (
          <span className="user-mssv">MSSV: {user.mssv}</span>
        )}
      </div>
    </div>
  );
};

export default UserDisplay;
