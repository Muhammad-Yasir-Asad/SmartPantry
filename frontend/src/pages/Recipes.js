import React, { useState } from "react";
import axios from "axios";
import { FaUtensils, FaSpinner } from "react-icons/fa"; // Icons for better UI

const AIRecipe = () => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const generateRecipes = async () => {
    setLoading(true);
    setError(null);
    setRecipes([]); // Clear previous recipes

    try {
      const token = localStorage.getItem("token"); // Get authentication token
      const response = await axios.post(
        "http://localhost:5000/api/recipes/generate-recipes",
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setRecipes(response.data.content.split("\n").filter(line => line.trim() !== ""));
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch recipes.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
      <div className="bg-white shadow-lg rounded-lg p-8 max-w-lg w-full">
        <h2 className="text-3xl font-bold text-gray-800 text-center flex items-center justify-center gap-2">
          <FaUtensils className="text-red-500" /> AI Recipe Suggestions
        </h2>

        <p className="text-gray-600 text-center mt-2">
          Click the button below to get delicious AI-generated meal ideas based on your pantry items.
        </p>

        <button
          onClick={generateRecipes}
          className="w-full bg-blue-500 text-white px-6 py-3 rounded-lg mt-4 font-semibold hover:bg-blue-600 transition-all duration-300 flex items-center justify-center gap-2"
          disabled={loading}
        >
          {loading ? <FaSpinner className="animate-spin" /> : "Get AI Recipe Ideas"}
        </button>

        {error && <p className="text-red-500 text-center mt-3">{error}</p>}

        {recipes.length > 0 && (
          <div className="mt-6 bg-gray-50 shadow-md rounded-lg p-4">
            <h3 className="text-xl font-semibold text-gray-800">Suggested Recipes</h3>
            <ul className="list-disc pl-6 mt-2 text-gray-700">
              {recipes.map((recipe, index) => (
                <li key={index} className="py-1">{recipe}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default AIRecipe;
