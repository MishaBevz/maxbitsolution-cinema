import React from 'react';
import { NavLink } from 'react-router-dom';

const Sidebar = () => {
  const token = localStorage.getItem('token');

  const handleLogout = (e: React.MouseEvent) => {
    e.preventDefault();
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    window.location.href = '/';
  };

  return (
    <aside className="sidebar">
      <nav>
        <NavLink to="/" className={({ isActive }) => isActive ? "active" : ""}>Фильмы</NavLink>
        <NavLink to="/cinemas" className={({ isActive }) => isActive ? "active" : ""}>Кинотеатры</NavLink>
        <NavLink to="/tickets" className={({ isActive }) => isActive ? "active" : ""}>Мои билеты</NavLink>
        {token ? (
          <a href="#" onClick={handleLogout}>Выход</a>
        ) : (
          <NavLink to="/login" className={({ isActive }) => isActive ? "active" : ""}>Вход</NavLink>
        )}
      </nav>
    </aside>
  );
};

export default Sidebar;
