import axios from "axios";

const API_URL = "http://localhost:5000/api"; // Your backend URL

export const getMealIdeas = async (token) => {
    try {
        const res = await axios.post(
            `${API_URL}/recipes/generate-meal`,
            {},
            { headers: { Authorization: `Bearer ${token}` } }
        );
        return res.data.mealIdeas.split("\n");
    } catch (error) {
        console.error("Error fetching AI meal ideas:", error);
        throw error;
    }
};
