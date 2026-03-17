import React from "react";
import api from "../api/axios";

const ProductCard = ({ product }) => {
  const handleAddToCart = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return alert("Please login first!");

      await api.post("/cart", { 
        productId: product._id, 
        quantity: 1 // في التصميم ده الإضافة بتبقى 1 فوراً
      });
      alert(`${product.name} added to cart! ✅`);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden flex flex-col h-full hover:shadow-md transition-shadow duration-300 group">
      
      {/* 1. منطقة الصورة - دائرية الأطراف من الأعلى كما في الصورة */}
      <div className="relative aspect-square overflow-hidden p-2">
        <img 
          src={product.image || "https://via.placeholder.com/300"} 
          alt={product.name} 
          className="w-full h-full object-cover rounded-xl transition-transform duration-500 group-hover:scale-105"
        />
        
        {/* Discount Tag (اختياري لو الداتا فيها خصم) */}
        {product.oldPrice && (
          <div className="absolute top-4 left-4 bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded-full">
            {Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)}% Discount
          </div>
        )}
      </div>

      {/* 2. تفاصيل المنتج */}
      <div className="p-5 flex flex-col justify-between flex-grow">
        <div>
          <h3 className="text-[17px] font-semibold text-[#0f172a] mb-1 leading-snug">
            {product.name}
          </h3>
          <p className="text-[#64748b] text-sm mb-4">
            {product.category?.name || "General"}
          </p>
        </div>

        <div className="flex items-center justify-between mt-auto">
          <div className="flex flex-col">
            <span className="text-[20px] font-bold text-[#059669]">
              {product.price} SAR
            </span>
            {product.oldPrice && (
              <span className="text-gray-400 text-xs line-through">
                {product.oldPrice} SAR
              </span>
            )}
          </div>

          {/* زرار الإضافة للسلة - نفس شكل الصورة */}
          <button 
            onClick={handleAddToCart}
            className="w-12 h-10 bg-[#10b981] hover:bg-[#059669] text-white rounded-xl flex items-center justify-center transition-colors shadow-sm"
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-5 w-5" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" 
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;