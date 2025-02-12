const jwt = require("jsonwebtoken");
const User = require("../models/User");
require("dotenv").config();

const authMiddleware = async (req, res, next) => {
    try {
        const token = req.header("Authorization")?.replace("Bearer ", "");
        if (!token) {
            console.log("⛔ No token provided");
            return res.status(401).json({ message: "Access denied. No token provided." });
        }

        // Verify JWT Token
        let decoded;
        try {
            decoded = jwt.verify(token, process.env.JWT_SECRET);
        } catch (error) {
            console.log("⛔ JWT Verification Failed:", error.message);
            return res.status(401).json({ message: "Invalid token", error: error.message });
        }

        console.log("✅ Decoded Token:", decoded);

        // 🔹 Fix: Use `decoded.userId` instead of `decoded.id`
        req.user = await User.findById(decoded.userId).select("-password");

        if (!req.user) {
            console.log("⛔ User not found in DB for token ID:", decoded.userId);
            return res.status(401).json({ message: "Invalid token: User not found" });
        }

        next();
    } catch (error) {
        console.error("⛔ Middleware Error:", error.message);
        return res.status(401).json({ message: "Unauthorized", error: error.message });
    }
};

// ✅ Middleware: Check Admin Role
const adminMiddleware = (req, res, next) => {
    if (!req.user || req.user.role !== "admin") {
        return res.status(403).json({ message: "Access denied. Admins only." });
    }
    next();
};

module.exports = { authMiddleware, adminMiddleware };
