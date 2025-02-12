const mongoose = require("mongoose");

const PantryItemSchema = new mongoose.Schema({
    name: { type: String, required: true },
    quantity: { type: Number, required: true },
    expirationDate: { type: Date, required: true },
    category: { type: String, required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true } 
});

module.exports = mongoose.model("PantryItem", PantryItemSchema);
