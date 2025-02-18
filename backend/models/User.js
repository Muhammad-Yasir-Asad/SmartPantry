const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String },
    role: { type: String, enum: ["admin", "user"], default: "user" }, // Role-based access
    googleId: { type: String } // For Google OAuth users
});

module.exports = mongoose.model("User", UserSchema);
