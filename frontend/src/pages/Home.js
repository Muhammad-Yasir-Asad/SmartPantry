import React from "react";

function Home() {
  return (
    <div className="container">
      {/* Welcome Banner */}
      <section className="banner">
        <h2>Welcome to Kitchen Planner</h2>
        <p>
          Plan. Cook. Enjoy! Manage your pantry, discover recipes, and stay notified with ease.
        </p>
        <a className="button" href="/pantry">Get Started</a>
      </section>

      {/* Quick Links Section */}
      <section>
        <h2>Quick Links</h2>
        <div className="grid">
          <div className="card">
            <h3>Pantry Management</h3>
            <p>Track your ingredients and organize your kitchen.</p>
            <a className="button" href="/pantry">Go to Pantry</a>
          </div>
          <div className="card">
            <h3>Discover Recipes</h3>
            <p>Find recipes based on what's in your pantry.</p>
            <a className="button" href="/recipes">Explore Recipes</a>
          </div>
          <div className="card">
            <h3>Notifications</h3>
            <p>Stay on top of expiry dates and low stock items.</p>
            <a className="button" href="/notifications">View Notifications</a>
          </div>
        </div>
      </section>

      {/* Featured Recipes Section */}
      <section>
        <h2>Featured Recipes</h2>
        <div className="grid">
          <div className="card">
            <h3>Spaghetti Carbonara</h3>
            <p>A simple and classic Italian pasta dish.</p>
            <a className="button" href="/recipes">See Recipe</a>
          </div>
          <div className="card">
            <h3>Vegetable Curry</h3>
            <p>Healthy and flavorful curry with mixed veggies.</p>
            <a className="button" href="/recipes">See Recipe</a>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;
