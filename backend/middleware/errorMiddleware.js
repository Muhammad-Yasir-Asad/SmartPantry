// middleware/errorMiddleware.js

const errorHandler = (err, req, res, next) => {
    console.error("🔥 Error:", err.stack);

    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    res.status(statusCode).json({
        message: err.message || "Server Error",
        stack: process.env.NODE_ENV === "production" ? null : err.stack,
    });
};

// ✅ Ensure this is the only export
module.exports = errorHandler;
