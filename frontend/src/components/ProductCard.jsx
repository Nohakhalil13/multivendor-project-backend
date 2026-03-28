import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ShoppingCart, Star, Heart, ArrowUpRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

/**
 * ProductCard Component
 */
const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  const [isFavorite, setIsFavorite] = useState(false);

  // Synchronize Wishlist state with LocalStorage on mount
  useEffect(() => {
    const favorites = JSON.parse(localStorage.getItem('wishlist')) || [];
    const found = favorites.find((item) => item._id === product._id);
    if (found) setIsFavorite(true);
  }, [product._id]);

  // Handle Wishlist Toggle Logic
  const toggleWishlist = (e) => {
    e.stopPropagation(); // Prevents card navigation trigger
    let favorites = JSON.parse(localStorage.getItem('wishlist')) || [];
    
    if (isFavorite) {
      favorites = favorites.filter((item) => item._id !== product._id);
      setIsFavorite(false);
    } else {
      favorites.push(product);
      setIsFavorite(true);
    }
    localStorage.setItem('wishlist', JSON.stringify(favorites));
  };

  // Handle Cart Addition Logic
  const addToCart = (e) => {
    e.stopPropagation(); // Prevents card navigation trigger
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const existingIndex = cart.findIndex((item) => item._id === product._id);
    
    if (existingIndex !== -1) {
      cart[existingIndex].quantity += 1;
    } else {
      cart.push({ ...product, quantity: 1 });
    }
    localStorage.setItem('cart', JSON.stringify(cart));
  };

  // Navigate to Product Details with state persistence
  const handleCardClick = () => {
    navigate(`/product/${product._id}`, { state: { product } });
  };

  const imageUrl = product.image || 'https://via.placeholder.com/300x400?text=Tradify+Market';

  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      onClick={handleCardClick}
      className="group relative bg-white rounded-[2.5rem] p-3 hover:shadow-[0_40px_100px_-20px_rgba(0,0,0,0.08)] transition-all duration-700 cursor-pointer border border-transparent hover:border-slate-100"
    >
      
      {/* 1. Visual Asset Container */}
      <div className="relative aspect-[4/5] rounded-[2.2rem] overflow-hidden bg-[#F9F9F9]">
        <img 
          src={imageUrl} 
          alt={product.name} 
          className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" 
        />

        {/* Floating Action: Wishlist Toggle */}
        <button 
          onClick={toggleWishlist}
          className={`absolute top-4 right-4 p-3 rounded-2xl transition-all duration-500 backdrop-blur-md shadow-lg z-20 ${
            isFavorite ? 'bg-red-500 text-white scale-110' : 'bg-white/70 text-slate-900 opacity-0 group-hover:opacity-100'
          }`}
        >
          <Heart size={18} fill={isFavorite ? "currentColor" : "none"} strokeWidth={2.5} />
        </button>

        {/* Floating Action: Detailed View Indicator */}
        <div className="absolute top-4 left-4 p-3 rounded-2xl bg-white/70 backdrop-blur-md text-slate-900 opacity-0 group-hover:opacity-100 transition-all duration-500 delay-75 shadow-lg">
           <ArrowUpRight size={18} strokeWidth={2.5} />
        </div>
      </div>

      {/* 2. Product Metadata & Information */}
      <div className="mt-6 px-3 pb-4 space-y-4">
        <div className="space-y-1">
          <div className="flex justify-between items-center">
            <span className="text-[10px] text-emerald-600 font-black uppercase tracking-[0.25em]">
              {product.category?.name || 'Aswan Collection'}
            </span>
            {product.ratingsAverage > 0 && (
                <div className="flex items-center gap-1 bg-slate-50 px-2 py-1 rounded-full">
                    <Star size={10} className="text-amber-400 fill-amber-400" />
                    <span className="text-[10px] font-black text-slate-700">{product.ratingsAverage}</span>
                </div>
            )}
          </div>
          <h3 className="text-slate-900 text-xl font-black tracking-tight line-clamp-1 group-hover:text-emerald-600 transition-colors">
            {product.name}
          </h3>
          <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">
              By {product.vendor?.storeName || 'Tradify Partner'}
          </p>
        </div>

        {/* 3. Transaction Area: Pricing & CTA */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-50">
          <div className="text-slate-900 text-2xl font-black tracking-tighter">
            <span className="text-sm font-bold align-top mr-0.5">EGP</span>
            {product.price}
          </div>
          
          <button 
            onClick={addToCart}
            aria-label="Add to cart"
            className="relative flex items-center justify-center bg-[#1A2421] text-white w-14 h-14 rounded-2xl hover:bg-emerald-600 transition-all shadow-xl shadow-slate-200 active:scale-90 group/btn overflow-hidden"
          >
            <ShoppingCart size={20} className="relative z-10" />
            <div className="absolute inset-0 bg-emerald-600 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300"></div>
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;