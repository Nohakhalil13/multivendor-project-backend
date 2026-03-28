import React from 'react';
import Hero from "../components/home/Hero";
import Categories from "../components/home/Categories";
import Features from "../components/home/Features";
import FeaturedProducts from "../components/home/FeaturedProducts";

const Home = () => {
  return (
    <main className="overflow-x-hidden">
      <Hero />
      <Categories />
      <Features />
      <FeaturedProducts />
    </main>
  );
};

export default Home;