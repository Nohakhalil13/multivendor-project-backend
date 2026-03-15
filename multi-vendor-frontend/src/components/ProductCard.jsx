import React, { useState } from "react";
import api from "../api/axios";

const ProductCard = ({ product }) => {
  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);

  const handleAddToCart = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return alert("Please login first!");

      await api.post("/cart", { 
        productId: product._id, 
        quantity: quantity 
      });
      alert(`${product.name} added to cart! ✅`);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="group bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 overflow-hidden flex flex-col h-full relative">
      
      {/* زرار المفضلة - Favorite Button */}
      <button 
        onClick={() => setIsFavorite(!isFavorite)}
        className="absolute top-4 right-4 z-10 bg-white/80 backdrop-blur-md p-2 rounded-full shadow-sm hover:scale-110 transition-transform"
      >
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          className={`h-5 w-5 ${isFavorite ? 'fill-red-500 stroke-red-500' : 'stroke-gray-400 fill-none'}`} 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      </button>

      {/* منطقة الصورة - Product Image */}
      <div className="relative aspect-[4/5] bg-gray-50 flex items-center justify-center overflow-hidden">
        {product.image ? (
          <img src={product.image} alt={product.name} className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-700" />
        ) : (
          <div className="text-gray-300 italic text-sm">No Image Available</div>
        )}
        
        {/* اسم الستور كـ Badge على الصورة */}
        <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-sm text-white text-[10px] px-2 py-1 rounded-md font-medium uppercase tracking-wider">
          🏪 {product.vendor?.storeName || "Official Store"}
        </div>
      </div>

      {/* تفاصيل المنتج - Product Details */}
      <div className="p-5 flex flex-col flex-grow">
        <div className="mb-1">
          <h3 className="text-lg font-bold text-gray-800 line-clamp-1 group-hover:text-blue-600 transition-colors">
            {product.name}
          </h3>
        </div>
        
        <p className="text-gray-500 text-xs mb-4 line-clamp-2 leading-relaxed">
          {product.description}
        </p>

        <div className="mt-auto">
          <div className="flex items-baseline gap-1 mb-4">
            <span className="text-2xl font-black text-gray-900">{product.price}</span>
            <span className="text-sm font-bold text-blue-600 uppercase">EGP</span>
          </div>

          {/* التحكم في الكمية - Quantity Selector */}
          <div className="flex items-center gap-3 mb-4 bg-gray-50 w-fit p-1 rounded-xl border border-gray-100">
            <button 
              onClick={() => setQuantity(q => Math.max(1, q - 1))}
              className="w-8 h-8 flex items-center justify-center bg-white rounded-lg shadow-sm hover:bg-gray-100 font-bold"
            > - </button>
            <span className="w-6 text-center font-bold text-gray-700">{quantity}</span>
            <button 
              onClick={() => setQuantity(q => q + 1)}
              className="w-8 h-8 flex items-center justify-center bg-white rounded-lg shadow-sm hover:bg-gray-100 font-bold"
            > + </button>
          </div>

          {/* زرار الإضافة للسلة - Add to Cart */}
          <button 
            onClick={handleAddToCart}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-blue-100 transition-all active:scale-95"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;