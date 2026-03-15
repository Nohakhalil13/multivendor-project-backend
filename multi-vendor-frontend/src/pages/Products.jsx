import React, { useEffect, useState } from "react";
import api from "../api/axios";
import ProductCard from "../components/ProductCard";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
     const res = await api.get("/products");
console.log("DATA_CHECK:", res.data); // ده هيطبع الداتا في المتصفح
setProducts(Array.isArray(res.data) ? res.data : res.data.products || []);
      } catch (error) {
        console.error("Failed to fetch products.", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // Loading State بستايل نظيف
  if (loading) return (
    <div className="flex justify-center items-center min-h-[60vh]">
      <div className="flex flex-col items-center gap-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <p className="text-gray-500 font-medium">Discovering products...</p>
      </div>
    </div>
  );

  // حالة عدم وجود منتجات
  if (!products.length) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
      <div className="text-5xl mb-4">🔍</div>
      <h2 className="text-2xl font-bold text-gray-800">No products found</h2>
      <p className="text-gray-500 mt-2">Check back later or try a different category.</p>
    </div>
  );

  return (
    <div className="bg-gray-50 min-h-screen py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="flex justify-between items-end mb-10">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Explore Products</h1>
            <p className="text-gray-500 mt-1">Found {products.length} premium items for you</p>
          </div>
          <button className="hidden md:block bg-white border border-gray-200 px-4 py-2 rounded-lg text-sm font-semibold shadow-sm hover:bg-gray-50 transition-all">
            Filter & Sort
          </button>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Products;