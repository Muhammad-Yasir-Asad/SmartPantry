import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion"; // Import animation library
import "./Notification.css";

const ExpirationNotifications = () => {
  const [expiringItems, setExpiringItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchExpiringItems = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/pantry/expiring-soon`, {
          headers: { Authorization: `Bearer ${token}` },
        });
  
        setExpiringItems(response.data.expiringItems);
      } catch (err) {
        setError("⚠️ Failed to fetch expiring items.");
      } finally {
        setLoading(false);
      }
    };
  
    fetchExpiringItems();
  }, []);

  return (
    <div className="notifications-container">
      <h2 className="title">🔔 Expiring Soon</h2>

      {loading && <p className="loading-text">Loading...</p>}
      {error && <p className="error-text">{error}</p>}
      
      {expiringItems.length === 0 && !loading && (
        <p className="no-items">🎉 No items expiring soon!</p>
      )}

      <AnimatePresence>
        {expiringItems.map((item) => (
          <motion.div
            key={item._id}
            className="notification-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
          >
            <h3 className="item-name">{item.name}</h3>
            <p className="item-date">⚠️ Expires on: {new Date(item.expirationDate).toDateString()}</p>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default ExpirationNotifications;
