import React, { useState, useEffect } from "react";
import axios from "axios";

const ExpirationNotifications = () => {
  const [expiringItems, setExpiringItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchExpiringItems = async () => {
      try {
        const token = localStorage.getItem("token"); // Get auth token
        const response = await axios.get("http://localhost:5000/api/pantry/expiring-soon", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setExpiringItems(response.data.expiringItems);
      } catch (err) {
        setError("Failed to fetch expiring items.");
      } finally {
        setLoading(false);
      }
    };

    fetchExpiringItems();
  }, []);

  return (
    <div className="max-w-3xl mx-auto mt-8 p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">🔔 Expiring Soon</h2>

      {loading && <p className="text-gray-600">Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}
      
      {expiringItems.length === 0 && !loading && (
        <p className="text-gray-500">No items are expiring soon! 🎉</p>
      )}

      {expiringItems.map((item) => (
        <div key={item._id} className="p-4 mb-3 bg-red-100 border-l-4 border-red-500 rounded-md">
          <h3 className="text-lg font-bold text-gray-800">{item.name}</h3>
          <p className="text-sm text-gray-700">⚠️ Expires on: {new Date(item.expirationDate).toDateString()}</p>
        </div>
      ))}
    </div>
  );
};

export default ExpirationNotifications;
