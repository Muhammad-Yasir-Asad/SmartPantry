const dotenv = require("dotenv");
dotenv.config();
const { GoogleGenerativeAI } = require("@google/generative-ai");

/**
 * Generate Recipe Ideas using AI
 * @param {string[]} ingredients - List of user pantry ingredients
 */
async function generateRecipes(ingredients) {
    try {
        console.log("Generating recipes using AI...");

        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = await genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

        const prompt = `Generate a structured recipe suggestion using the following ingredients: ${ingredients.join(", ")}. Follow this exact format:

Meal Ideas Using Available Ingredients

Below are three delicious meal ideas based on the available ingredients: "${ingredients.join(" and ")}".

-----

1. [Meal Name]
Matching Percentage: [XX]%

Ingredients:
- Ingredient 1
- Ingredient 2

Steps:
1. Step one.
2. Step two.
3. Step three.

-----

2. [Meal Name]
Matching Percentage: [XX]%

Ingredients:
- Ingredient 1
- Ingredient 2

Steps:
1. Step one.
2. Step two.
3. Step three.

-----

3. [Meal Name]
Matching Percentage: [XX]%

Ingredients:
- Ingredient 1
- Ingredient 2

Steps:
1. Step one.
2. Step two.
3. Step three.

-----

Enjoy these simple and delicious meal ideas! 😊`;

        const result = await model.generateContent(prompt);
        const aiResponse = result.response.text().trim();
        console.log("✅ AI-generated recipes:", aiResponse);
        return aiResponse;
    } catch (error) {
        console.error("⛔ AI Recipe Error:", error.message);
        throw new Error("AI request failed");
    }
}

module.exports = { generateRecipes };
