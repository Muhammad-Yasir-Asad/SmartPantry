const express = require("express");
const router = express.Router();
const PantryItem = require("../models/PantryItem");
const { authMiddleware, adminMiddleware } = require("../middleware/authMiddleware"); // Add Middleware

// 🟢 Add a Pantry Item (Only Admins)
router.post("/", authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const { name, quantity, expirationDate, category } = req.body;
        const newItem = new PantryItem({ name, quantity, expirationDate, category });

        await newItem.save();
        res.status(201).json(newItem);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

// 🔵 Retrieve All Pantry Items (Any Logged-In User)
router.get("/", authMiddleware, async (req, res) => {
    try {
        const items = await PantryItem.find();
        res.status(200).json(items);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

// 🔴 Delete a Pantry Item (Only Admins)
router.delete("/:id", authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const { id } = req.params;
        const deletedItem = await PantryItem.findByIdAndDelete(id);

        if (!deletedItem) {
            return res.status(404).json({ message: "Item not found" });
        }

        res.status(200).json({ message: "Item deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

// ✅ Update a Pantry Item (Only Admins)
router.put("/:id", authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const { name, quantity, expirationDate, category } = req.body;
        const updatedItem = await PantryItem.findByIdAndUpdate(
            req.params.id,
            { name, quantity, expirationDate, category },
            { new: true, runValidators: true }
        );

        if (!updatedItem) {
            return res.status(404).json({ message: "Item not found" });
        }

        res.json(updatedItem);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

module.exports = router;