import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaUser, FaEnvelope, FaLock } from "react-icons/fa";
import { motion } from "framer-motion";
import "./Signup.css";

const Signup = ({ setIsAuthenticated }) => {
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [focusedField, setFocusedField] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFocus = (field) => {
    setFocusedField(field);
  };

  const handleBlur = () => {
    setFocusedField(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log("🟢 Sending Signup Data:", formData);
      const res = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/auth/register`, formData);

      console.log("✅ Signup Response:", res.data);
      localStorage.setItem("token", res.data.token);
      setIsAuthenticated(true);
      navigate("/home");
    } catch (err) {
      console.error("⛔ Signup Error:", err.response?.data || err.message);
      setError(err.response?.data?.message || "Signup failed. Try again.");
    }
  };

  return (
    <div className="signup-container">
      <motion.div
        className="signup-box"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <h2 className="signup-title">🔐 Create an Account</h2>

        {error && <p className="error-message">{error}</p>}

        <form onSubmit={handleSubmit}>
          <div className={`input-group ${focusedField === "name" ? "focused" : ""}`}>
            <FaUser className="icon" />
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              onChange={handleChange}
              onFocus={() => handleFocus("name")}
              onBlur={handleBlur}
              required
            />
          </div>

          <div className={`input-group ${focusedField === "email" ? "focused" : ""}`}>
            <FaEnvelope className="icon" />
            <input
              type="email"
              name="email"
              placeholder="Email"
              onChange={handleChange}
              onFocus={() => handleFocus("email")}
              onBlur={handleBlur}
              required
            />
          </div>

          <div className={`input-group ${focusedField === "password" ? "focused" : ""}`}>
            <FaLock className="icon" />
            <input
              type="password"
              name="password"
              placeholder="Password"
              onChange={handleChange}
              onFocus={() => handleFocus("password")}
              onBlur={handleBlur}
              required
            />
          </div>

          <motion.button
            type="submit"
            className="btn-primary"
            whileHover={{ scale: 1.05, backgroundColor: "#e67e22" }}
            whileTap={{ scale: 0.95 }}
          >
            Sign Up
          </motion.button>
        </form>

        <p className="signup-text">
          Already have an account? <a href="/" className="signup-link">Login</a>
        </p>
      </motion.div>
    </div>
  );
};

export default Signup;
