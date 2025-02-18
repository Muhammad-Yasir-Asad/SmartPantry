require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const pantryRoutes = require('./routes/pantryRoutes');
const aiRecipeRoutes = require('./routes/aiRecipeRoutes.js');
const authRoutes = require("./routes/authRoutes"); // 🔹 Add Authentication Routes
const errorHandler = require("./middleware/errorMiddleware");



const app = express();

// ✅ Middleware
const corsOptions = {
  origin: 'https://smart-pantry-frontend.vercel.app', // Replace with your frontend URL
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
};

// Enable CORS for all routes
app.use(cors(corsOptions));

// ✅ Connect to MongoDB
mongoose
    .connect(process.env.MONGO_URI, { 
        useNewUrlParser: true, 
        useUnifiedTopology: true 
    })
    .then(() => console.log("✅ MongoDB Connected"))
    .catch((err) => {
        console.error("❌ MongoDB Connection Error:", err);
        process.exit(1); // Force exit on DB connection failure
    });

// ✅ Routes
app.get("/test", (req, res) => {
  res.json({ message: "Backend is working!" });
});

app.use("/api/auth", authRoutes); // 🔹 Add Authentication Routes
app.use("/api/pantry", pantryRoutes); // Pantry Item Routes

app.use(errorHandler);
app.use("/api/recipes", aiRecipeRoutes);


// ✅ Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

