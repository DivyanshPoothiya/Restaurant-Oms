import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Navbar = ({ title }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="navbar">
      <h2 className="navbar-title">{title}</h2>
      <div className="navbar-user">
        <span>👤 {user?.name}</span>
        <button className="btn btn-logout" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </div>
  );
};

export default Navbar;
