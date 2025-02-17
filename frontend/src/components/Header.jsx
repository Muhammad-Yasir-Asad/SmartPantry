import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaHome, FaShoppingCart, FaUtensils, FaBell, FaSignInAlt, FaSignOutAlt } from "react-icons/fa"; // Import icons from react-icons
import "./Header.css"; // ✅ Import Navbar Styles

function Header({ onAuthAction, isAuthenticated }) {
  const [isMenuOpen, setMenuOpen] = useState(false);

  // Toggle the mobile menu visibility
  const handleMenuToggle = () => {
    setMenuOpen(!isMenuOpen);
  };

  return (
    <header>
      <nav className="navbar">
        <h1 className="logo">Smart Pantry</h1>
        {/* Hamburger Icon for Mobile */}
        <div className="hamburger" onClick={handleMenuToggle}>
          <span className="bar"></span>
          <span className="bar"></span>
          <span className="bar"></span>
        </div>
        <ul className={`nav-links ${isMenuOpen ? "active" : ""}`}>
          <li>
            <Link to="/home">
              <FaHome size={20} />
              Home
            </Link>
          </li>
          <li>
            <Link to="/pantry">
              <FaShoppingCart size={20} />
              Pantry
            </Link>
          </li>
          <li>
            <Link to="/recipes">
              <FaUtensils size={20} />
              Recipes
            </Link>
          </li>
          <li>
            <Link to="/notifications">
              <FaBell size={20} />
              Notifications
            </Link>
          </li>
          <li>
            {/* ✅ Dynamic Button (Login / Logout) */}
            <button className="auth-btn" onClick={onAuthAction}>
              {isAuthenticated ? <FaSignOutAlt size={20} /> : <FaSignInAlt size={20} />}
              {isAuthenticated ? "Logout" : "Login"}
            </button>
          </li>
        </ul>
      </nav>
    </header>
  );
}

export default Header;
