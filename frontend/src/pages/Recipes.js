import React from "react";

function Recipes() {
  const recipes = [
    { name: "Spaghetti Bolognese", description: "Classic Italian pasta dish." },
    { name: "Chicken Curry", description: "Spicy and flavorful curry." },
    { name: "Vegetable Stir Fry", description: "Quick and healthy veggies." },
    { name: "Banana Bread", description: "Perfect for ripe bananas." },
  ];

  return (
    <div className="container">
      <section className="banner">
        <h2>Recipes</h2>
        <p>Discover delicious recipes tailored to your pantry items.</p>
      </section>
      <section>
        <h2>Suggested Recipes</h2>
        <div className="grid">
          {recipes.map((recipe, index) => (
            <div key={index} className="card">
              <h3>{recipe.name}</h3>
              <p>{recipe.description}</p>
              <a className="button" href="#">
                View Recipe
              </a>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default Recipes;
