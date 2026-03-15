import React from "react";
import { Link } from "react-router-dom";

const Home = () => (
  <div style={{ textAlign: "center", padding: "50px" }}>
    <h1>Welcome to My Marketplace</h1>
    <p>Shop the best products from multiple vendors!</p>
    <Link to="/products">
      <button style={{ padding: "10px 20px", marginTop: "20px" }}>View Products</button>
    </Link>
  </div>
);

export default Home;