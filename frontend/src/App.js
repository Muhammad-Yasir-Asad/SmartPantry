import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import axios from "axios";
import "./App.css";
import Pantry from "./pages/Pantry";
import Recipes from "./pages/Recipes";
import Notifications from "./pages/Notifications";
import Home from "./pages/Home"; // Ensure Home is imported
import AIRecipe from "./components/AIRecipe"; // Ensure AIRecipe is properly imported

function App() {
  const [message, setMessage] = useState("");

  // Fetch backend message using axios (optional)
  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_BACKEND_URL}/`)
      .then((response) => setMessage(response.data))
      .catch((error) => console.error(error));
  }, []);

  return (
    <Router>
      <div>
        <Header />
        <div className="message-banner">{message && <h2>{message}</h2>}</div>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/pantry" element={<Pantry />} />
          <Route path="/recipes" element={<Recipes />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/ai-recipe" element={<AIRecipe />} />
        </Routes>
      </div>
    </Router>
  );
}

function Header() {
  return (
    <header>
      <h1>Smart Pantry</h1>
      <nav>
        <Link to="/">Home</Link>
        <Link to="/pantry">Pantry</Link>
        <Link to="/recipes">Recipes</Link>
        <Link to="/notifications">Notifications</Link>
        <Link to="/ai-recipe">AI Recipe</Link>
      </nav>
    </header>
  );
}

export default App;
