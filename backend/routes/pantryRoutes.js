const express = require("express");
const router = express.Router();
const PantryItem = require("../models/PantryItem");
const { authMiddleware, adminMiddleware } = require("../middleware/authMiddleware"); 
const User = require("../models/User"); // Import User model for email notifications
const nodemailer = require("nodemailer");
const cron = require("node-cron");

require("dotenv").config(); // Load environment variables


// ✅ Email Notification Function
const sendExpirationEmail = async (userEmail, items) => {
    try {
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        // 🔹 Create Email Content
        const itemList = items.map(item => `${item.name} (Expires: ${item.expirationDate.toDateString()})`).join("\n");

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: userEmail,
            subject: "Pantry Expiration Alert",
            text: `The following items in your pantry are expiring soon:\n\n${itemList}\n\nCheck your pantry to prevent waste!`
        };

        await transporter.sendMail(mailOptions);
        console.log(`✅ Expiration email sent to ${userEmail}`);
    } catch (error) {
        console.error("❌ Error sending email:", error.message);
    }
};

// 🕒 Schedule Daily Expiration Check (Runs at 8 AM)
cron.schedule("0 8 * * *", async () => {
    console.log("🔍 Running expiration check...");

    const today = new Date();
    const threeDaysLater = new Date();
    threeDaysLater.setDate(today.getDate() + 3);

    try {
        const users = await User.find(); // Get all users

        for (const user of users) {
            const expiringItems = await PantryItem.find({
                user: user._id,
                expirationDate: { $gte: today, $lte: threeDaysLater }
            });

            if (expiringItems.length > 0) {
                await sendExpirationEmail(user.email, expiringItems);
            }
        }
    } catch (error) {
        console.error("❌ Error checking expiring items:", error.message);
    }
});

// ✅ Get Expiring Items for a User (Manual Check)
router.get("/expiring-soon", authMiddleware, async (req, res) => {
    try {
        const today = new Date();
        const threeDaysLater = new Date();
        threeDaysLater.setDate(today.getDate() + 3);

        const expiringItems = await PantryItem.find({
            user: req.user._id,
            expirationDate: { $gte: today, $lte: threeDaysLater }
        });

        res.json({ expiringItems });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

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

router.get("/expiring-soon", authMiddleware, async (req, res) => {
    try {
        const today = new Date();
        const threeDaysLater = new Date();
        threeDaysLater.setDate(today.getDate() + 3);

        const expiringItems = await PantryItem.find({
            user: req.user._id,
            expirationDate: { $gte: today, $lte: threeDaysLater }
        });

        res.json({ expiringItems });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

module.exports = router;
