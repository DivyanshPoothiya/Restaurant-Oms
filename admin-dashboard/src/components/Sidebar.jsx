import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const navItems = [
  { path: '/',       label: '📊 Dashboard'  },
  { path: '/orders', label: '🧾 Orders'     },
  { path: '/menu',   label: '🍽️ Menu'       },
  { path: '/tables', label: '🪑 Tables'     },
  { path: '/staff',  label: '👥 Staff'      },
];

const Sidebar = () => {
  const { user } = useAuth();
  const visibleItems =
    user?.role === 'admin' || user?.role === 'manager'
      ? navItems
      : navItems.filter((i) => i.path !== '/staff');

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <span className="sidebar-logo-main">RESTAURANT</span>
        <span className="sidebar-logo-sub">✦ OMS ADMIN ✦</span>
      </div>
      <nav className="sidebar-nav">
        {visibleItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === '/'}
            className={({ isActive }) => `sidebar-link${isActive ? ' active' : ''}`}
          >
            {item.label}
          </NavLink>
        ))}
      </nav>
      <div className="sidebar-footer">
        {user?.name} · {user?.role}
      </div>
    </aside>
  );
};

export default Sidebar;
