import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, ShoppingCart } from 'lucide-react';

function Navbar() {
  return (
    <nav className="navbar">
      <div className="nav-brand">
        <ShoppingCart size={24} />
        <span>POS System</span>
      </div>
      <ul className="nav-links">
        <li>
          <NavLink to="/" className={({ isActive }) => isActive ? 'active' : ''}>
            <Home size={18} />
            <span>Home</span>
          </NavLink>
        </li>
        <li>
          <NavLink to="/pos" className={({ isActive }) => isActive ? 'active' : ''}>
            <ShoppingCart size={18} />
            <span>POS</span>
          </NavLink>
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;