import React, { useEffect, useState } from "react";
import api from "../api/axios";
import ProductCard from "../components/ProductCard";

const Products = () => {
  const [allProducts, setAllProducts] = useState([]); // لحفظ كل المنتجات
  const [filteredProducts, setFilteredProducts] = useState([]); // لعرض المنتجات المفلترة
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [prodRes, catRes] = await Promise.all([
          api.get("/products"),
          api.get("/categories")
        ]);
        
        const productsData = Array.isArray(prodRes.data) ? prodRes.data : prodRes.data.products || [];
        setAllProducts(productsData);
        setFilteredProducts(productsData); // في البداية بنعرض الكل
        setCategories(catRes.data || []);
      } catch (error) {
        console.error("Failed to fetch data.", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // لوجيك الفلترة (كاتيجوري + بحث)
  useEffect(() => {
    let result = allProducts;

    if (activeCategory !== "All") {
      result = result.filter(p => p.category?.name === activeCategory);
    }

    if (searchTerm) {
      result = result.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));
    }

    setFilteredProducts(result);
  }, [activeCategory, searchTerm, allProducts]);

  if (loading) return (
    <div className="flex justify-center items-center min-h-[60vh]">
       <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#10b981]"></div>
    </div>
  );

  return (
    <div className="bg-white min-h-screen py-8 px-4 sm:px-6 lg:px-20">
      <div className="max-w-7xl mx-auto">
        
        {/* Title */}
        <h1 className="text-3xl font-black text-gray-900 mb-8">Products</h1>

        {/* 1. Search Bar - نفس شكل الصورة */}
        <div className="relative mb-6">
          <input 
            type="text" 
            placeholder="Search for a product..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-3 pl-10 border border-gray-200 rounded-xl bg-white text-sm focus:outline-none focus:ring-1 focus:ring-gray-300"
          />
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg">🔍</span>
        </div>

        {/* 2. Categories Buttons - نفس شكل الصورة */}
        <div className="flex flex-wrap gap-2 mb-10">
          <button 
            onClick={() => setActiveCategory("All")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeCategory === "All" ? 'bg-[#10b981] text-white shadow-md shadow-green-100' : 'bg-white border border-gray-100 text-gray-600 hover:bg-gray-50'}`}
          >
            All
          </button>
          {categories.map(cat => (
            <button 
              key={cat._id}
              onClick={() => setActiveCategory(cat.name)}
              className={`px-4 py-2 rounded-lg text-sm font-medium border border-gray-100 transition-all ${activeCategory === cat.name ? 'bg-[#10b981] text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* 3. Products Grid */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
             <p className="text-4xl mb-2">📦</p>
             <p>No products found in this category.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-10">
            {filteredProducts.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Products;