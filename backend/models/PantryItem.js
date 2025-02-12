const mongoose = require("mongoose");

const PantryItemSchema = new mongoose.Schema({
    name: { type: String, required: true },
    quantity: { type: Number, required: true },
    expirationDate: { type: Date, required: true },
    category: { type: String, required: true } // New category field
});

module.exports = mongoose.model("PantryItem", PantryItemSchema);
