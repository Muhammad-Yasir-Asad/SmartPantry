const express = require("express");
const router = express.Router();
const PantryItem = require("../models/PantryItem");
const { authMiddleware } = require("../middleware/authMiddleware");
const { generateRecipes } = require("../utils/aiservice");

router.post("/generate-recipes", authMiddleware, async (req, res) => {
    try {
        console.log("📢 Fetching pantry items for AI-generated recipes...");

        // 🔹 Get user pantry items
        const pantryItems = await PantryItem.find({ user: req.user._id });
        if (!pantryItems || pantryItems.length === 0) {
            console.log("⛔ No ingredients found.");
            return res.status(400).json({ message: "No ingredients found in your pantry." });
        }

        const ingredients = pantryItems.map(item => item.name.toLowerCase());
        console.log("✅ User ingredients:", ingredients);

        // 🔹 Call AI service
        const aiResponse = await generateRecipes(ingredients);

        if (!aiResponse || aiResponse.length === 0) {
            console.log("⛔ AI failed to generate recipes.");
            return res.status(500).json({ message: "AI could not generate recipes." });
        }

        console.log("✅ AI-generated recipes:", aiResponse);
        res.status(200).json({ recipes: aiResponse });

    } catch (error) {
        console.error("⛔ AI Recipe Error:", error.message);
        res.status(500).json({ message: "AI request failed", error: error.message });
    }
});

module.exports = router;