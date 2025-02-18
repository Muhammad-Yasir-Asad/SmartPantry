const express = require("express");
const router = express.Router();
const PantryItem = require("../models/PantryItem");
const User = require("../models/User");
const nodemailer = require("nodemailer");

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

// ✅ API Route to Trigger Expiration Check
router.get("/run-cron", async (req, res) => {
    try {
        console.log("🔍 Running expiration check...");

        const today = new Date();
        const threeDaysLater = new Date();
        threeDaysLater.setDate(today.getDate() + 3);

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

        res.status(200).json({ message: "Cron job executed successfully!" });
    } catch (error) {
        console.error("❌ Error checking expiring items:", error.message);
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

module.exports = router;
