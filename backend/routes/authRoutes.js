const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { check, validationResult } = require("express-validator");
const passport = require("passport");
const dotenv = require("dotenv");
const User = require("../models/User");

dotenv.config(); // Load environment variables

const router = express.Router();

router.post(
    "/register",
    [
        check("name", "Name is required").not().isEmpty(),
        check("email", "Valid email required").isEmail(),
        check("password", "Password must be at least 6 characters").isLength({ min: 6 }),
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

        try {
            const { name, email, password } = req.body;
            const lowerCaseEmail = email.toLowerCase(); // Case insensitive email check

            let user = await User.findOne({ email: lowerCaseEmail });
            if (user) return res.status(400).json({ message: "User already exists" });

            const hashedPassword = await bcrypt.hash(password, 10);
            user = new User({ 
                name, 
                email: lowerCaseEmail, 
                password: hashedPassword, 
                role: "admin"  // Automatically set as admin
            });
            await user.save();

            res.status(201).json({ message: "User registered successfully", user });
        } catch (error) {
            console.error("⛔ Signup Error:", error.message);
            res.status(500).json({ message: "Server error", error: error.message });
        }
    }
);


// 🔵 Login User
router.post(
    "/login",
    [
        check("email", "Valid email required").isEmail(),
        check("password", "Password is required").not().isEmpty(),
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

        try {
            const { email, password } = req.body;
            console.log("🟢 Login Attempt:", { email, password });

            const user = await User.findOne({ email: email.toLowerCase() });
            if (!user) {
                console.log("⛔ User not found:", email);
                return res.status(400).json({ message: "Invalid credentials" });
            }

            console.log("✅ User found:", user.email, "Stored Hash:", user.password);

            const isMatch = await bcrypt.compare(password, user.password);
            console.log("🔍 Password Match:", isMatch);

            if (!isMatch) {
                console.log("⛔ Incorrect password for:", email);
                return res.status(400).json({ message: "Invalid credentials" });
            }

            if (!process.env.JWT_SECRET) {
                console.log("⛔ JWT_SECRET is missing in .env");
                return res.status(500).json({ message: "JWT_SECRET is missing from environment variables" });
            }

            const token = jwt.sign(
                { userId: user._id, role: user.role },
                process.env.JWT_SECRET,
                { expiresIn: "6h" }
            );

            console.log("✅ Login successful for:", email);

            res.json({ 
                token, 
                user: { id: user._id, name: user.name, email: user.email, role: user.role } 
            });
        } catch (error) {
            console.error("⛔ Login Error:", error.message);
            res.status(500).json({ message: "Server error", error: error.message });
        }
    }
);

// 🟡 Google OAuth Authentication
router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));

router.get(
    "/google/callback",
    passport.authenticate("google", { session: false, failureRedirect: "/login" }),
    async (req, res) => {
        try {
            if (!req.user) return res.status(401).json({ message: "Google authentication failed" });

            const token = jwt.sign(
                { userId: req.user._id, role: req.user.role },
                process.env.JWT_SECRET,
                { expiresIn: "1h" }
            );

            res.redirect(`http://localhost:3000/dashboard?token=${token}`);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Server error", error: error.message });
        }
    }
);

module.exports = router;
