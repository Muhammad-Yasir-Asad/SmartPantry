import React, { useState } from "react";
import axios from "axios";
import { FaUtensils, FaSpinner, FaMagic, FaTimes } from "react-icons/fa";
import "./AIRecipes.css"; 

const Recipes = () => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const generateRecipes = async () => {
    setLoading(true);
    setError(null);
    setRecipes([]);

    try {
        const token = localStorage.getItem("token");  // Retrieve token from localStorage
        if (!token) {
            setError("⚠️ You must be logged in to generate recipes.");
            setLoading(false);
            return;
        }

        const response = await axios.post(
            `${process.env.REACT_APP_BACKEND_URL}/recipes/generate-recipes`,
            {},  // Empty request body (if required)
            {
                headers: { Authorization: `Bearer ${token}` }, // Include token
            }
        );

        setRecipes(response.data.recipes);
    } catch (err) {
        console.error("Error generating recipes:", err);
        setError(err.response?.data?.message || "⚠️ Failed to fetch recipes.");
    } finally {
        setLoading(false);
    }
};

  return (
    <div className="ai-container">
      <div className="ai-card">
        <h2 className="ai-title">
          <FaUtensils className="ai-icon" /> AI Recipe Suggestions
        </h2>

        <p className="ai-subtitle">
          Click below to get meal ideas based on your pantry items.
        </p>

        <button
          onClick={generateRecipes}
          className="ai-button ai-primary"
          disabled={loading}
        >
          {loading ? <FaSpinner className="ai-spin" /> : <><FaMagic /> Get AI Recipe Ideas</>}
        </button>

        {error && <p className="ai-error">{error}</p>}

        {recipes && (
          <div className="ai-recipe-box">
            <h3 className="ai-recipe-title">Suggested Recipes</h3>
            <pre className="ai-recipe-content">{recipes}</pre>
          </div>
        )}

        {recipes && (
          <button className="ai-button ai-cancel" onClick={() => setRecipes([])}>
            <FaTimes /> Clear Recipes
          </button>
        )}
      </div>
    </div>
  );
};

export default Recipes;