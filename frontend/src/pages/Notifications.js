import React from "react";

function Notifications() {
  const notifications = [
    { message: "Milk is about to expire in 2 days." },
    { message: "You’re running low on Sugar." },
    { message: "New recipe suggestion: Pancakes!" },
  ];

  return (
    <div className="container">
      <section className="banner">
        <h2>Notifications</h2>
        <p>Stay updated with pantry alerts and recipe suggestions.</p>
      </section>
      <section>
        <h2>Recent Notifications</h2>
        {notifications.map((notification, index) => (
          <div key={index} className="notification">
            <p>{notification.message}</p>
          </div>
        ))}
      </section>
    </div>
  );
}

export default Notifications;
