import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Signup({ setIsAuthenticated }) {
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log("🟢 Sending Signup Data:", formData); // Debugging

      const res = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/auth/register`, formData);
      
      console.log("✅ Signup Response:", res.data); // Debugging

      localStorage.setItem("token", res.data.token);
      setIsAuthenticated(true);
      navigate("/home");
    } catch (err) {
      console.error("⛔ Signup Error:", err.response?.data || err.message);
      setError(err.response?.data?.message || "Signup failed. Try again.");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <h2 className="text-2xl font-bold text-center mb-4">Sign Up</h2>
        {error && <p className="text-red-500 text-center">{error}</p>}
        <form onSubmit={handleSubmit}>
          <input type="text" name="name" placeholder="Full Name" className="w-full p-2 mb-3 border rounded" onChange={handleChange} required />
          <input type="email" name="email" placeholder="Email" className="w-full p-2 mb-3 border rounded" onChange={handleChange} required />
          <input type="password" name="password" placeholder="Password" className="w-full p-2 mb-3 border rounded" onChange={handleChange} required />
          <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600">Sign Up</button>
        </form>
        <p className="text-center mt-3">Already have an account? <a href="/" className="text-blue-500">Login</a></p>
      </div>
    </div>
  );
}

export default Signup;
