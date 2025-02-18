require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const pantryRoutes = require('./routes/pantryRoutes');
const aiRecipeRoutes = require('./routes/aiRecipeRoutes.js');
const authRoutes = require("./routes/authRoutes"); 
const errorHandler = require("./middleware/errorMiddleware");

const app = express();

// ✅ CORS Configuration
const allowedOrigins = [
    "https://smart-pantry-frontend.vercel.app", 
    "http://localhost:3000"
];

const corsOptions = {
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error("Not allowed by CORS"));
        }
    },
    methods: "GET,POST,PUT,DELETE,PATCH,OPTIONS",
    allowedHeaders: "Content-Type,Authorization",
    credentials: true
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions)); // ✅ Explicitly handle preflight OPTIONS requests

// ✅ Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 60000,
  socketTimeoutMS: 60000
});

// ✅ Routes
app.get("/test", (req, res) => {
    res.json({ message: "Backend is working fine!" });
});

app.use("/api/auth", authRoutes);
app.use("/api/pantry", pantryRoutes);
app.use("/api/recipes", aiRecipeRoutes);

// ✅ Global Error Handler
app.use(errorHandler);

// ✅ Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
