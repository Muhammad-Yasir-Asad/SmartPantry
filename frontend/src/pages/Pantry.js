import React from "react";

function Pantry() {
  const pantryItems = [
    { name: "Flour", quantity: "2 kg" },
    { name: "Sugar", quantity: "1 kg" },
    { name: "Rice", quantity: "5 kg" },
    { name: "Pasta", quantity: "500 g" },
  ];

  return (
    <div className="container">
      <section className="banner">
        <h2>Pantry Management</h2>
        <p>Track your pantry items and keep everything organized!</p>
      </section>
      <section>
        <h2>Pantry Items</h2>
        <div className="grid">
          {pantryItems.map((item, index) => (
            <div key={index} className="card">
              <h3>{item.name}</h3>
              <p>Quantity: {item.quantity}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default Pantry;
