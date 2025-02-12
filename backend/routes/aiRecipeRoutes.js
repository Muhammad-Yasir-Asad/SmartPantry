const express = require("express");
const router = express.Router();
const PantryItem = require("../models/PantryItem");
const { authMiddleware } = require("../middleware/authMiddleware");
const { HfInference } = require("@huggingface/inference");

const client = new HfInference(process.env.HUGGING_FACE_API_KEY);

router.post("/generate-recipes", authMiddleware, async (req, res) => {
    try {
        console.log("Fetching pantry items...");

        // Fetch only the logged-in user's pantry ingredients
        const pantryItems = await PantryItem.find({ user: req.user._id });
        const ingredients = pantryItems.map(item => item.name.toLowerCase());

        if (ingredients.length === 0) {
            console.log("No ingredients found in pantry.");
            return res.status(400).json({ message: "No ingredients found in your pantry" });
        }

        console.log("Ingredients found:", ingredients);

        // Send request to Hugging Face API
        const chatCompletion = await client.chatCompletion({
            model: "deepseek-ai/DeepSeek-R1",
            messages: [
                {
                    role: "user",
                    content: `Suggest 3 meal ideas using these ingredients: ${ingredients.join(", ")}. Each meal should have a name and a brief description.`
                }
            ],
            provider: "together",
            max_tokens: 500,
        });

        console.log("Response received from Hugging Face API:", chatCompletion.choices[0].message);

        res.status(200).json(chatCompletion.choices[0].message);
    } catch (error) {
        console.error("Error response from Hugging Face API:", error.response ? error.response.data : error.message);
        res.status(500).json({ message: "AI request failed", error: error.message });
    }
});

module.exports = router;
