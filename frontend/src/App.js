import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import axios from "axios";
import Pantry from "./pages/Pantry";
import Recipes from "./pages/Recipes";
import Notifications from "./pages/Notifications";
import Home from "./pages/Home";
import AIRecipe from "./components/AIRecipe";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import { Link } from "react-router-dom";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      setIsAuthenticated(true);
    }
  }, [isAuthenticated]); // ✅ React to changes in `isAuthenticated`

  const handleLogout = () => {
    localStorage.removeItem("token");
    delete axios.defaults.headers.common["Authorization"];
    setIsAuthenticated(false);
  };

  return (
    <Router>
      <div>
        {isAuthenticated && <Header onLogout={handleLogout} />}
        <Routes>
          <Route path="/" element={isAuthenticated ? <Navigate to="/home" replace /> : <Login setIsAuthenticated={setIsAuthenticated} />} />
          <Route path="/signup" element={<Signup setIsAuthenticated={setIsAuthenticated} />} />

          {isAuthenticated ? (
            <>
              <Route path="/home" element={<Home />} />
              <Route path="/pantry" element={<Pantry />} />
              <Route path="/recipes" element={<Recipes />} />
              <Route path="/notifications" element={<Notifications />} />
              <Route path="/ai-recipe" element={<AIRecipe />} />
            </>
          ) : (
            <Route path="*" element={<Navigate to="/" replace />} />
          )}
        </Routes>
      </div>
    </Router>
  );
}

function Header({ onLogout }) {
  return (
    <header>
      <h1>Smart Pantry</h1>
      <nav>
        <Link to="/home">Home</Link>
        <Link to="/pantry">Pantry</Link>
        <Link to="/recipes">Recipes</Link>
        <Link to="/notifications">Notifications</Link>
        <Link to="/ai-recipe">AI Recipe</Link>
        <button className="logout-btn" onClick={onLogout}>Logout</button>
      </nav>
    </header>
  );
}

export default App;
