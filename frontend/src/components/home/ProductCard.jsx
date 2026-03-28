import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ShoppingCart, Star, Heart, ArrowUpRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

/**
 * ProductCard Component (Balanced Luxury Edition)
 * Maintained the Premium Structure and hover logic, 
 * but standardized the image aspect and framing for visual comfort.
 */
const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  const [isFavorite, setIsFavorite] = useState(false);

  // Synchronize Wishlist state
  useEffect(() => {
    const favorites = JSON.parse(localStorage.getItem('wishlist')) || [];
    setIsFavorite(favorites.some((item) => item._id === product._id));
  }, [product._id]);

  // Handle Wishlist Toggle
  const handleWishlist = (e) => {
    e.stopPropagation();
    let favorites = JSON.parse(localStorage.getItem('wishlist')) || [];
    if (isFavorite) {
      favorites = favorites.filter((item) => item._id !== product._id);
    } else {
      favorites.push(product);
    }
    localStorage.setItem('wishlist', JSON.stringify(favorites));
    setIsFavorite(!isFavorite);
  };

  // Handle Cart Addition
  const handleAddToCart = (e) => {
    e.stopPropagation();
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const index = cart.findIndex((item) => item._id === product._id);
    index !== -1 ? cart[index].quantity += 1 : cart.push({ ...product, quantity: 1 });
    localStorage.setItem('cart', JSON.stringify(cart));
  };

  const imageUrl = product.image || 'https://via.placeholder.com/400x500?text=Premium+Artifact';

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      onClick={() => navigate(`/product/${product._id}`, { state: { product } })}
      className="group cursor-pointer bg-white"
    >
      {/* 1. Visual Showcase Container (Balanced Frame) */}
      <div className="relative aspect-[4/5] rounded-[3rem] overflow-hidden bg-[#FBFBFB] border border-slate-50 transition-all duration-700 group-hover:shadow-3xl group-hover:shadow-slate-200">
        
        {/* Main Product Image - Perfectly Framed and Centered */}
        <div className="w-full h-full p-6 flex items-center justify-center">
          <img 
            src={imageUrl} 
            alt={product.name} 
            className="w-full h-full object-contain mix-blend-multiply transition-transform duration-[1.5s] ease-out group-hover:scale-110 pointer-events-none" 
          />
        </div>

        {/* Hover Action Group (Top Layer) */}
        <div className="absolute inset-x-0 top-0 p-5 flex justify-between items-start opacity-0 group-hover:opacity-100 transition-all duration-500 transform -translate-y-2 group-hover:translate-y-0 z-20">
          <div className="bg-white/80 backdrop-blur-md p-3.5 rounded-2xl shadow-sm">
            <ArrowUpRight size={18} className="text-slate-900" strokeWidth={3} />
          </div>
          
          <button 
            onClick={handleWishlist}
            className={`w-12 h-12 rounded-2xl transition-all duration-500 backdrop-blur-md shadow-sm flex items-center justify-center ${
              isFavorite ? 'bg-red-500 text-white shadow-xl shadow-red-500/30' : 'bg-white/80 text-slate-500 hover:bg-white hover:text-red-500'
            }`}
          >
            <Heart size={18} fill={isFavorite ? "currentColor" : "none"} strokeWidth={2.5} />
          </button>
        </div>

        {/* Floating Quick Add (Bottom Layer) */}
        <div className="absolute inset-x-0 bottom-0 p-5 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-in-out z-20">
          <button 
            onClick={handleAddToCart}
            className="w-full bg-slate-950 text-white py-4 rounded-2xl flex items-center justify-center gap-3 font-black text-[10px] uppercase tracking-[0.2em] hover:bg-emerald-600 transition-colors shadow-2xl active:scale-95"
          >
            <ShoppingCart size={14} />
            Add To Bag
          </button>
        </div>
      </div>

      {/* 2. Product Metadata & Transaction Area  */}
      <div className="mt-7 px-3 space-y-4">
        <div className="space-y-1.5">
          <div className="flex items-center justify-between gap-2">
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-600">
              {product.category?.name || 'Exclusive artifact'}
            </span>
            {product.ratingsAverage > 0 && (
              <div className="flex items-center gap-1.5 bg-slate-100/70 px-2 py-1 rounded-full">
                <Star size={10} className="text-amber-400 fill-amber-400" />
                <span className="text-[9px] font-black text-slate-500">{product.ratingsAverage}</span>
              </div>
            )}
          </div>

          <h3 className="text-xl font-[900] text-slate-900 tracking-tight leading-none group-hover:text-emerald-600 transition-colors duration-300 uppercase">
            {product.name}
          </h3>

          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            By {product.vendor?.storeName || 'Tradify Curator'}
          </p>
        </div>

        {/* Pricing Area */}
        <div className="flex items-baseline gap-1 pt-2 border-t border-slate-50">
          <span className="text-[11px] font-black text-slate-300 uppercase tracking-tighter">EGP</span>
          <span className="text-2xl font-[900] text-slate-950 tracking-tighter">{product.price}</span>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;