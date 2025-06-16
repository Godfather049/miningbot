import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const BottomMenu = () => {
  const location = useLocation();
  
  const menuItems = [
    { path: '/', icon: '🏠', label: 'Ana Sayfa' },
    { path: '/spin', icon: '🎮', label: 'Spin' },
    { path: '/tasks', icon: '🔗', label: 'Yönlendirme' },
    { path: '/wallet', icon: '💰', label: 'Cüzdan' },
    { path: '/tasks', icon: '✅', label: 'Görevler' },
  ];

  return (
    <div className="bottom-menu">
      {menuItems.map((item) => (
        <Link 
          to={item.path} 
          key={item.path}
          className={`menu-item ${location.pathname === item.path ? 'active' : ''}`}
        >
          <div className="menu-icon">{item.icon}</div>
          <div className="menu-label">{item.label}</div>
        </Link>
      ))}
    </div>
  );
};

export default BottomMenu;
