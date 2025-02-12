const express = require("express");
const router = express.Router();
const PantryItem = require("../models/PantryItem");
const { authMiddleware, adminMiddleware } = require("../middleware/authMiddleware"); 

// 🟢 Add a Pantry Item (For Logged-in Users, Not Just Admins)
router.post("/", authMiddleware, async (req, res) => {
    try {
        const { name, quantity, expirationDate, category } = req.body;
        
        const newItem = new PantryItem({
            user: req.user._id,  // 🔹 Associate the item with the logged-in user
            name,
            quantity,
            expirationDate,
            category
        });

        await newItem.save();
        res.status(201).json(newItem);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

// 🔵 Retrieve Pantry Items (Only for the Logged-in User)
router.get("/", authMiddleware, async (req, res) => {
    try {
        const items = await PantryItem.find({ user: req.user._id }); // 🔹 Fetch only this user's items
        res.status(200).json(items);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

// 🔴 Delete a Pantry Item (Only for the User Who Added It)
router.delete("/:id", authMiddleware, async (req, res) => {
    try {
        const { id } = req.params;
        
        const item = await PantryItem.findOne({ _id: id, user: req.user._id }); // 🔹 Ensure user owns the item

        if (!item) {
            return res.status(404).json({ message: "Item not found or not authorized" });
        }

        await item.deleteOne();
        res.status(200).json({ message: "Item deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

// ✅ Update a Pantry Item (Only for the User Who Added It)
router.put("/:id", authMiddleware, async (req, res) => {
    try {
        const { name, quantity, expirationDate, category } = req.body;
        
        const item = await PantryItem.findOne({ _id: req.params.id, user: req.user._id }); // 🔹 Ensure user owns the item

        if (!item) {
            return res.status(404).json({ message: "Item not found or not authorized" });
        }

        item.name = name;
        item.quantity = quantity;
        item.expirationDate = expirationDate;
        item.category = category;

        await item.save();
        res.json(item);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

module.exports = router;
