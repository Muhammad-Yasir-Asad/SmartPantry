import { useState } from "react";
import { getMealIdeas } from "../api"; // Import API function

const AIRecipe = () => {
    const [mealIdeas, setMealIdeas] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const fetchMealIdeas = async () => {
        setLoading(true);
        setError("");

        try {
            const token = localStorage.getItem("token"); // Ensure the user is authenticated
            const meals = await getMealIdeas(token);
            setMealIdeas(meals);
        } catch (error) {
            setError("Failed to fetch AI meal suggestions");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h2>AI-Powered Meal Ideas</h2>
            <button onClick={fetchMealIdeas} disabled={loading}>
                {loading ? "Generating..." : "Get AI Meal Ideas"}
            </button>
            {error && <p>{error}</p>}
            <ul>
                {mealIdeas.map((meal, index) => (
                    <li key={index}>{meal}</li>
                ))}
            </ul>
        </div>
    );
};

export default AIRecipe;
