import React from "react";

const CartItem = ({ item }) => {
  return (
    <div style={{ border: "1px solid #ccc", margin: "10px", padding: "10px" }}>
      <h3>{item.name}</h3>
      <p>Price: {item.price} EGP</p>
      <p>Quantity: {item.quantity}</p>
    </div>
  );
};

export default CartItem;