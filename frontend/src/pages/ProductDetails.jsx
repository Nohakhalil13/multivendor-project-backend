import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { getProducts } from '../api'; 
import { ShoppingBag, Heart, ArrowLeft, ShieldCheck, Truck, Star, Minus, Plus, Share2, Copy, CheckCircle2 } from 'lucide-react'; // ضفت أيقونات جديدة للـ Share feedback
import { motion, AnimatePresence } from 'framer-motion';

const ProductDetails = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const [product, setProduct] = useState(location.state?.product || null);
  const [loading, setLoading] = useState(!product);
  const [quantity, setQuantity] = useState(1);
  
  // States للـ Wishlist والـ Share feedback
  const [isFavorite, setIsFavorite] = useState(false);
  const [shareStatus, setShareStatus] = useState(null); // 'copied' أو null

  useEffect(() => {
    // 1. جلب المنتج لو مش موجود (حالة الـ Refresh)
    if (!product) {
      getProducts().then((allProducts) => {
        const found = allProducts.find((p) => p._id === id);
        setProduct(found);
        setLoading(false);
      });
    } else {
        setLoading(false);
    }

    // 2. التحقق لو المنتج في الـ Wishlist (من الـ LocalStorage)
    const favorites = JSON.parse(localStorage.getItem('wishlist')) || [];
    const foundInWishlist = favorites.find((item) => item._id === id);
    if (foundInWishlist) setIsFavorite(true);

    window.scrollTo(0, 0);
  }, [id, product]);

  // --- لوجيك الـ Wishlist (نفس الهوم بيج) ---
  const toggleWishlist = () => {
    let favorites = JSON.parse(localStorage.getItem('wishlist')) || [];
    
    if (isFavorite) {
      // إزالة من المفضلة
      favorites = favorites.filter((item) => item._id !== product._id);
      setIsFavorite(false);
    } else {
      // إضافة للمفضلة
      favorites.push(product);
      setIsFavorite(true);
    }
    localStorage.setItem('wishlist', JSON.stringify(favorites));
  };

  // --- لوجيك المشاركة (Share API + Fallback) ---
  const handleShare = async () => {
    const shareData = {
      title: product.name,
      text: `Check out this amazing product: ${product.name}`,
      url: window.location.href, // لينك الصفحة الحالية
    };

    try {
      if (navigator.share) {
        // استخدام Web Share API الأصلية
        await navigator.share(shareData);
        console.log('Product shared successfully');
      } else {
        // Fallback: نسخ اللينك للكليب بورد
        await navigator.clipboard.writeText(window.location.href);
        setShareStatus('copied');
        // إخفاء رسالة النسخ بعد ثانيتين
        setTimeout(() => setShareStatus(null), 2000);
      }
    } catch (err) {
      console.error('Error sharing:', err);
    }
  };

  if (loading) return (
    <div className="h-screen flex items-center justify-center bg-white">
      <div className="w-5 h-5 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (!product) return <div className="h-screen flex items-center justify-center font-black uppercase tracking-widest text-slate-500">Product Not Found</div>;

  return (
    <div className="min-h-screen bg-white pt-32 pb-20 selection:bg-emerald-50" dir="ltr">
      <div className="container mx-auto px-6 max-w-[1300px]">
        
        {/* Top Navigation - Back Button only */}
        <div className="flex items-center justify-between mb-12 pb-6 border-b border-slate-50">
          <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-all group">
            <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
            <span className="text-[11px] font-black uppercase tracking-[0.2em]">Back</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24 items-start">
          
          {/* --- Left: Image Section with Active Actions --- */}
          <div className="lg:col-span-6 xl:col-span-7 relative group">
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-[#FBFBFB] rounded-[3rem] p-12 lg:p-20 flex items-center justify-center border border-slate-50 shadow-sm"
            >
              <img 
                src={product.image || 'https://via.placeholder.com/600'} 
                alt={product.name}
                className="w-full max-h-[500px] object-contain pointer-events-none mix-blend-multiply"
              />
              
              {/* Active Actions (Share & Love) - Made more visible */}
              <div className="absolute top-8 right-8 flex flex-col gap-4">
                {/* Share Button with API/Fallback */}
                <button 
                    onClick={handleShare}
                    className="w-12 h-12 rounded-2xl bg-white/70 backdrop-blur-lg border border-white/50 flex items-center justify-center text-slate-600 hover:text-slate-900 hover:bg-white hover:scale-110 shadow-lg shadow-black/5 transition-all relative"
                >
                    {shareStatus === 'copied' ? (
                        <CheckCircle2 size={20} className="text-emerald-500" />
                    ) : (
                        <Share2 size={20} />
                    )}
                    
                    {/* Tooltip for Copy Feedback */}
                    <AnimatePresence>
                        {shareStatus === 'copied' && (
                            <motion.span 
                                initial={{ opacity: 0, y: 10, x: '-50%' }}
                                animate={{ opacity: 1, y: 0, x: '-50%' }}
                                exit={{ opacity: 0, y: 5 }}
                                className="absolute -bottom-10 left-1/2 bg-slate-900 text-white text-[9px] font-bold px-3 py-1.5 rounded-lg whitespace-nowrap shadow-xl"
                            >
                                Link Copied!
                            </motion.span>
                        )}
                    </AnimatePresence>
                </button>

                {/* Wishlist Button - Active */}
                <button 
                    onClick={toggleWishlist}
                    className={`w-12 h-12 rounded-2xl backdrop-blur-lg border shadow-lg shadow-black/5 transition-all duration-300 flex items-center justify-center ${
                        isFavorite 
                        ? 'bg-red-500 border-red-600 text-white hover:bg-red-600 scale-110' 
                        : 'bg-white/70 border-white/50 text-slate-600 hover:text-red-500 hover:bg-white'
                    }`}
                >
                    <Heart size={20} fill={isFavorite ? "currentColor" : "none"} strokeWidth={2.5} />
                </button>
              </div>

              {/* Floating Status Badge */}
              <div className="absolute bottom-8 left-8 bg-white/80 backdrop-blur-sm px-4 py-2.5 rounded-xl shadow-sm border border-white/50 flex items-center gap-2.5">
                 <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                 <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">In Stock</span>
              </div>
            </motion.div>
          </div>

          {/* --- Right: Product Info --- */}
          <div className="lg:col-span-6 xl:col-span-5 pt-4 space-y-12">
            
            <div className="space-y-6">
              <div className="space-y-3">
                <span className="text-emerald-600 text-[11px] font-black uppercase tracking-[0.4em]">
                  {product.category?.name || 'Exclusive Release'}
                </span>
                <h1 className="text-5xl lg:text-6xl font-black text-slate-900 tracking-tighter leading-tight uppercase">
                  {product.name}
                </h1>
                <div className="flex items-center gap-2 pt-1">
                   {[1,2,3,4,5].map(i => <Star key={i} size={11} className="fill-emerald-500 text-emerald-500" />)}
                   <span className="text-[11px] font-bold text-slate-300 ml-2 tracking-widest">4.8 (120 REVIEWS)</span>
                </div>
              </div>

              <div className="text-4xl font-black text-slate-900 tracking-tighter flex items-baseline gap-2">
                <span className="text-xl text-slate-300">$</span>
                {product.price?.toLocaleString()}
              </div>

              <p className="text-slate-500 text-[15px] leading-relaxed font-medium max-w-[420px]">
                {product.description || "A masterclass in functional design. Every element is balanced to provide the ultimate experience in both style and daily utility."}
              </p>
            </div>

            {/* Config & Add to Cart */}
            <div className="space-y-8">
              <div className="flex flex-col sm:flex-row gap-4">
                {/* Quantity Control */}
                <div className="flex items-center justify-between border border-slate-100 rounded-2xl p-2 bg-slate-50/50 min-w-[140px]">
                  <button onClick={() => setQuantity(q => Math.max(1, q-1))} className="w-10 h-10 flex items-center justify-center text-slate-400 hover:text-slate-900 transition-colors bg-white rounded-xl shadow-sm border border-slate-100"><Minus size={14} /></button>
                  <span className="text-[12px] font-black w-8 text-center">{quantity}</span>
                  <button onClick={() => setQuantity(q => q+1)} className="w-10 h-10 flex items-center justify-center text-slate-400 hover:text-slate-900 transition-colors bg-white rounded-xl shadow-sm border border-slate-100"><Plus size={14} /></button>
                </div>

                {/* Main Action */}
                <button className="flex-1 h-14 bg-[#1A2421] text-white rounded-2xl flex items-center justify-center gap-3 hover:bg-emerald-600 transition-all shadow-xl shadow-emerald-900/10 active:scale-95 group overflow-hidden relative">
                    {/* Hover Bg animation */}
                    <div className="absolute inset-0 bg-emerald-600 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                    <ShoppingBag size={20} className="relative z-10 group-hover:-rotate-12 transition-transform" />
                    <span className="text-[11px] font-black uppercase tracking-[0.3em] relative z-10">Add to Collection</span>
                </button>
              </div>
            </div>

            {/* Minimalist Trust Grid */}
            <div className="pt-10 grid grid-cols-2 gap-y-6 border-t border-slate-50">
              <div className="flex items-start gap-4">
                 <div className="w-11 h-11 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 border border-slate-100"><Truck size={18} /></div>
                 <div>
                    <h4 className="text-[10px] font-black text-slate-900 uppercase tracking-widest">Fast Delivery</h4>
                    <p className="text-[9px] text-slate-400 font-medium">Estimated 2-3 Days</p>
                 </div>
              </div>
              <div className="flex items-start gap-4">
                 <div className="w-11 h-11 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 border border-slate-100"><ShieldCheck size={18} /></div>
                 <div>
                    <h4 className="text-[10px] font-black text-slate-900 uppercase tracking-widest">Authentic</h4>
                    <p className="text-[9px] text-slate-400 font-medium">100% Original Piece</p>
                 </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;