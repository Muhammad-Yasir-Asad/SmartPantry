import React from "react";
import { Link } from "react-router-dom";
import "./Home.css";

const Home = () => {
  return (
    <div className="home-container">
      {/* 🔹 Hero Section */}
      <section className="hero">
        <div className="hero-text">
          <h1>Your Kitchen, Optimized.</h1>
          <br></br>
          <p className="hero-text1">Pantry perfection at your fingertips.</p> 
          <p className="hero-text2">Transform your kitchen management with our intelligent pantry system.</p>
          <Link to="/pantry" className="btn">Discover!</Link>
        </div>
        <div className="hero-image">
          <img src="assests/hero-image.png" alt="Pantry System" />
        </div>
      </section>

      {/* 🔹 Features Section */}
      <section className="features">
  <div className="feature-card left">
    <img src="assests/pantry-image.png" alt="Kitchen Management" />
    <div className="feature-content">
      <h2>🛒 Your Pantry at a Glance</h2>
      <p className="sp">Know what you have, use what you need, and waste nothing with smart inventory tracking.</p>
      <p>•✅ Full Control : Create, view, edit, and delete pantry items effortlessly.</p>
      <p>•🎙️ Voice Recognition : Add products using hands-free voice commands.</p>
      <p>•🔒 Personalized Storage : Store data securely, linked to your unique user ID.</p>
      <Link to="/pantry" className="btn">Manage Now</Link>
    </div>
  </div>

  <div className="feature-card right">
    <div className="feature-content">
      <h2>🍳 Inspire Your Cooking</h2>
      <p className="sp">Discover delicious meals based on what’s in your pantry and filter recipes.</p>
      <p>•🍽      AI-Powered Recipe : Get instant meal ideas based on the ingredients.</p>
      <p>•🛒     Smart Matching : Fetches ingredients from your pantry to generate recipes.</p>
      <p>•🤖     Meal Planning : No more guessing! Let AI suggest the best recipes for you.</p>
      <Link to="/recipes" className="btn">Get Recipe</Link>
    </div>
    <img src="assests/recipe-img.png" alt="Pantry Glance" />
  </div>

  <div className="feature-card left">
    <img src="assests/notification-image.png" alt="Cooking" />
    <div className="feature-content">
      <h2>🔔 Smart Notifications</h2>
      <p className="sp">Never Let Your Ingredients Go to Waste - Stay Ahead with Smart Alerts!</p>
      <p>•⏳  Expiry Alerts : Get notified when your pantry items are about to expire.</p>
      <p>•📩  Email Reminders : Receive timely email alerts to keep track of expiring ingredients.</p>
      <p>•🛑  Reduce Waste, Save Money : Use ingredients before they go bad and cut down on food waste.</p>
      <Link to="/notifications" className="btn">View Alerts</Link>
    </div>
  </div>

 
</section>


      {/* 🔹 Call to Action */}
      <section className="cta">
        <h2>“Be A Part Of The <span className="highlight">Next</span> Big Thing.”</h2>
      </section>

      {/* 🔹 Footer Section */}
      <footer className="footer">
  <p>Designed & Developed by <strong className="my-name">Muhammad Yasir Asad (MYA)</strong> | Innovating Smart Solutions for the Future</p>
</footer>


    </div>
  );
};

export default Home;
