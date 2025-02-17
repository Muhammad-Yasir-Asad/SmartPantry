import React from "react";
import { Link } from "react-router-dom";
import "./Header.css"; // ✅ Import Navbar Styles

function Header({ onAuthAction, isAuthenticated }) {
  return (
    <header>
      <nav className="navbar">
        <h1 className="logo">Smart Pantry</h1>
        <ul className="nav-links">
          <li><Link to="/home">Home</Link></li>
          <li><Link to="/pantry">Pantry</Link></li>
          <li><Link to="/recipes">Recipes</Link></li>
          <li><Link to="/notifications">Notifications</Link></li>
          <li>
            {/* ✅ Dynamic Button (Login / Logout) */}
            <button className="auth-btn" onClick={onAuthAction}>
              {isAuthenticated ? "Logout" : "Login"}
            </button>
          </li>
        </ul>
      </nav>
    </header>
  );
}

export default Header;
