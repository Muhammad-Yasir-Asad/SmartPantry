const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const mongoose = require("mongoose");

dotenv.config();
const app = express();

// ✅ CORS CONFIGURATION
const corsOptions = {
    origin: ['https://smart-pantry-frontend.vercel.app', 'http://localhost:3000'], // Allow frontend
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
};

app.use(cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Log Requests for Debugging
app.use((req, res, next) => {
    console.log(`📡 Incoming Request: ${req.method} ${req.url}`);
    console.log("🛑 Request Headers:", req.headers);
    next();
});

// ✅ Explicitly handle preflight OPTIONS requests
app.options("*", (req, res) => {
    console.log("🔄 Handling OPTIONS request");
    res.sendStatus(200);
});

// ✅ Test Route
app.get("/test", (req, res) => {
    res.json({ message: "Backend is working fine!" });
});

// ✅ Connect to MongoDB
mongoose
    .connect(process.env.MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        serverSelectionTimeoutMS: 60000,
        socketTimeoutMS: 60000,
    })
    .then(() => console.log("✅ Connected to MongoDB"))
    .catch((err) => console.error("❌ MongoDB Connection Error:", err));

// ✅ Routes
const pantryRoutes = require("./routes/pantryRoutes");
const aiRecipeRoutes = require("./routes/aiRecipeRoutes");
const authRoutes = require("./routes/authRoutes");

app.use("/api/auth", authRoutes);
app.use("/api/pantry", pantryRoutes);
app.use("/api/recipes", aiRecipeRoutes);

// ✅ Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
