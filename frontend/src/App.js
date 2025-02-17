import React, { useEffect, useRef, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Pantry from "./pages/Pantry";
import Recipes from "./pages/Recipes";
import Notifications from "./pages/Notifications";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Header from "./components/Header";
import confetti from "canvas-confetti";
import "./App.css";

function App() {
  const cursorRef = useRef(null);
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem("token"));

  // 🖱️ Custom Cursor & Particle Effect
  useEffect(() => {
    const moveCursor = (e) => {
      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
      }
      confetti({
        particleCount: 1,
        startVelocity: 0,
        ticks: 0,
        origin: {
          x: e.clientX / window.innerWidth,
          y: e.clientY / window.innerHeight,
        },
        colors: ["#ffffff"],
        shapes: ["circle"],
        gravity: 1.8,
        scalar: 0.8,
        drift: (Math.random() - 0.5) * 0.2,
      });
    };

    window.addEventListener("mousemove", moveCursor);
    return () => window.removeEventListener("mousemove", moveCursor);
  }, []);

  // 🚀 Login/Logout Handler
  const handleAuthAction = () => {
    if (isAuthenticated) {
      localStorage.removeItem("token");
      setIsAuthenticated(false);
      window.location.href = "/login"; // Redirect after logout
    } else {
      window.location.href = "/login"; // Redirect to login page
    }
  };

  // 🔒 Protected Route Component (Restricts Access to Certain Pages)
  const ProtectedRoute = ({ element }) => {
    return isAuthenticated ? element : <Navigate to="/login" replace />;
  };

  return (
    <Router>
      <div className="app-container">
        {/* 🎯 Custom Cursor */}
        <div ref={cursorRef} className="custom-cursor"></div>

        {/* ✅ Always Show Header, Pass Dynamic Button State */}
        <Header onAuthAction={handleAuthAction} isAuthenticated={isAuthenticated} />

        {/* ✅ Routes */}
        <Routes>
          <Route path="/login" element={<Login setIsAuthenticated={setIsAuthenticated} />} />
          <Route path="/signup" element={<Signup setIsAuthenticated={setIsAuthenticated} />} />

          {/* 🏠 Home Page is Public */}
          <Route path="/home" element={<Home />} />

          {/* 🔐 Protected Routes (Only accessible if authenticated) */}
          <Route path="/pantry" element={<ProtectedRoute element={<Pantry />} />} />
          <Route path="/recipes" element={<ProtectedRoute element={<Recipes />} />} />
          <Route path="/notifications" element={<ProtectedRoute element={<Notifications />} />} />

          {/* 🛑 Redirect all unknown routes to /home */}
          <Route path="*" element={<Navigate to="/home" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
