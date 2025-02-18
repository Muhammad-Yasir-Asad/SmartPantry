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
            subject: "🚨 Attention! Your Pantry Items Are Expiring Soon! ⏳",
            html: `
                <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f4f4f4;">
                    <div style="max-width: 600px; background: white; padding: 20px; border-radius: 12px; box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1); text-align: center; animation: fadeIn 2s;">
                        
                        <!-- 🏆 HEADER SECTION -->
                        <h2 style="color: #ff4500;">🔥 Pantry Expiration Alert! 🔥</h2>
                        <p style="font-size: 16px; color: #333;">Hey <strong>${userEmail}</strong>,</p>
                        <p style="font-size: 16px; color: #555;">Your pantry needs **urgent attention!** Some items are <strong>expiring soon</strong>. Don't let them go to waste! 🚀</p>
        
                        <!-- 🖼️ IMAGE SECTION -->
                        <div style="text-align: center;">
                            <img src="https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExemZxc2R6d2lpbWw1d2N5NHFsaXh4ZnBxZzVtem9qdTlwNGFrOXRrbSZlcD12MV9naWZzX3NlYXJjaCZjdD1n/VNyC1epfEUhLVRSGvL/giphy.gif" width="250px" style="border-radius: 10px; margin: 10px 0;">
                        </div>
        
                        <!-- 📋 EXPIRING ITEMS LIST -->
                        <h3 style="color: #ff4500;">📅 Items Expiring Soon:</h3>
                        <ul style="background: #fff8dc; padding: 12px; border-radius: 6px; font-size: 16px; text-align: left; color: #333; display: inline-block; animation: fadeInUp 1s;">
                            ${itemList.split("\n").map(item => `<li style="margin: 5px 0; font-weight: bold;">✅ ${item}</li>`).join("")}
                        </ul>
        
                        <!-- 💡 ACTION STEPS -->
                        <h3 style="color: #ff4500;">💡 What Can You Do?</h3>
                        <ul style="list-style: none; padding: 0; font-size: 16px; color: #333;">
                            <li>🍽️ Plan meals using these items.</li>
                            <li>📦 Store them properly to extend freshness.</li>
                            <li>🌍 Reduce waste & save money!</li>
                        </ul>
        
                        <!-- 🛒 ACTION BUTTON -->
                        <div style="margin-top: 20px;">
                            <a href="https://smart-pantry-frontend.vercel.app/" 
                                style="display: inline-block; padding: 14px 28px; background: #ff4500; color: white; text-decoration: none; font-size: 18px; font-weight: bold; border-radius: 8px;
                                       transition: background 0.3s ease-in-out; animation: pulse 2s infinite;">
                                🛒 Manage My Pantry Now!
                            </a>
                        </div>
        
                        <!-- 📞 CONTACT INFO -->
                        <p style="font-size: 14px; color: #555; margin-top: 20px;">
                            Cheers, <br>
                            <strong>Muhammad Yasir Asad (MYA)</strong> <br>
                            🚀 Smart Pantry Team <br>
                            📧 <a href="mailto:yasirasad341@gmail.com" style="color: #ff4500; text-decoration: none;">yasirasad341@gmail.com</a> | 📞 <a href="https://wa.me/923085598341" style="color: #ff4500; text-decoration: none;">0308-5598341</a>
                        </p>
        
                        <!-- 🌍 SOCIAL MEDIA -->
                        <p style="margin-top: 15px; text-align: center;">
    <a href="https://www.instagram.com/yasirasad.mya" target="_blank" style="margin: 0 10px; text-decoration: none;">
        <img src="https://cdn-icons-png.flaticon.com/512/2111/2111463.png" width="30" alt="Instagram">
    </a>
    <a href="https://wa.me/923085598341" target="_blank" style="margin: 0 10px; text-decoration: none;">
        <img src="https://cdn-icons-png.flaticon.com/512/733/733585.png" width="30" alt="WhatsApp">
    </a>
    <a href="https://linkedin.com/in/muhammad-yasir-asad-8aa047258" target="_blank" style="margin: 0 10px; text-decoration: none;">
        <img src="https://cdn-icons-png.flaticon.com/512/174/174857.png" width="30" alt="LinkedIn">
    </a>
    <a href="https://github.com/Muhammad-Yasir-Asad" target="_blank" style="margin: 0 10px; text-decoration: none;">
        <img src="https://cdn-icons-png.flaticon.com/512/25/25231.png" width="30" alt="GitHub">
    </a>
</p>

        
                        <!-- ⚠️ UNSUBSCRIBE -->
                        <p style="font-size: 12px; color: #aaa; text-align: center; margin-top: 15px;">
                            You received this email because you're a valued member of Smart Pantry. <br>
                            If you wish to unsubscribe, <a href="https://smart-pantry-frontend.vercel.app" style="color: #ff4500;">click here</a>.
                        </p>
                    </div>
                </div>
        
                <!-- 🌟 ANIMATIONS -->
                <style>
                    @keyframes fadeIn {
                        from { opacity: 0; }
                        to { opacity: 1; }
                    }
                    @keyframes fadeInUp {
                        from { opacity: 0; transform: translateY(10px); }
                        to { opacity: 1; transform: translateY(0); }
                    }
                    @keyframes pulse {
                        0% { transform: scale(1); }
                        50% { transform: scale(1.05); }
                        100% { transform: scale(1); }
                    }
                </style>
            `
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
